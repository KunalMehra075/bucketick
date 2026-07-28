import { Router } from 'express';
import { Types } from 'mongoose';
import { Follow } from '../models/Follow';
import { User, UserDoc } from '../models/User';
import { requireAuth } from '../middleware/auth';
import { asyncHandler, badRequest, notFound, ok } from '../utils/http';

export const followsRouter = Router();
followsRouter.use(requireAuth);

function toConnection(u: UserDoc, following: boolean) {
  return {
    id: String(u._id),
    name: u.name,
    username: u.username,
    avatarColor: u.avatarColor,
    avatarUrl: u.avatarUrl ?? null,
    points: u.points,
    following,
  };
}

/** Which of these user ids does `me` currently follow? */
async function followedSet(meId: string, ids: Types.ObjectId[]): Promise<Set<string>> {
  if (ids.length === 0) return new Set();
  const edges = await Follow.find({ follower: meId, following: { $in: ids } }).select('following');
  return new Set(edges.map((e) => String(e.following)));
}

// GET /follows/followers — people who follow me (with follow-back state).
followsRouter.get(
  '/followers',
  asyncHandler(async (req, res) => {
    const edges = await Follow.find({ following: req.userId }).sort({ createdAt: -1 }).populate<{
      follower: UserDoc;
    }>('follower');
    const users = edges.map((e) => e.follower).filter(Boolean);
    const followed = await followedSet(
      req.userId!,
      users.map((u) => u._id as Types.ObjectId)
    );
    ok(res, users.map((u) => toConnection(u, followed.has(String(u._id)))));
  })
);

// GET /follows/following — people I follow.
followsRouter.get(
  '/following',
  asyncHandler(async (req, res) => {
    const edges = await Follow.find({ follower: req.userId }).sort({ createdAt: -1 }).populate<{
      following: UserDoc;
    }>('following');
    const users = edges.map((e) => e.following).filter(Boolean);
    ok(res, users.map((u) => toConnection(u, true)));
  })
);

// GET /follows/suggestions — people I could follow (not me, not already followed).
followsRouter.get(
  '/suggestions',
  asyncHandler(async (req, res) => {
    const following = await Follow.find({ follower: req.userId }).select('following');
    const exclude = following.map((e) => e.following);
    exclude.push(new Types.ObjectId(req.userId));
    const users = (await User.find({ _id: { $nin: exclude } })
      .sort({ points: -1, createdAt: 1 })
      .limit(20)) as UserDoc[];
    ok(res, users.map((u) => toConnection(u, false)));
  })
);

// POST /follows/:userId — follow someone.
followsRouter.post(
  '/:userId',
  asyncHandler(async (req, res) => {
    const targetId = req.params.userId;
    if (!Types.ObjectId.isValid(targetId)) throw badRequest('Invalid user id');
    if (targetId === req.userId) throw badRequest('You cannot follow yourself');

    const target = await User.findById(targetId);
    if (!target) throw notFound('User not found');

    // Upsert the edge; only bump counters if it did not already exist.
    const existing = await Follow.findOne({ follower: req.userId, following: targetId });
    if (!existing) {
      await Follow.create({ follower: req.userId, following: targetId });
      await User.updateOne({ _id: targetId }, { $inc: { followersCount: 1 } });
      await User.updateOne({ _id: req.userId }, { $inc: { followingCount: 1 } });
    }
    ok(res, { following: true });
  })
);

// DELETE /follows/:userId — unfollow someone.
followsRouter.delete(
  '/:userId',
  asyncHandler(async (req, res) => {
    const targetId = req.params.userId;
    if (!Types.ObjectId.isValid(targetId)) throw badRequest('Invalid user id');

    const removed = await Follow.findOneAndDelete({ follower: req.userId, following: targetId });
    if (removed) {
      await User.updateOne({ _id: targetId, followersCount: { $gt: 0 } }, { $inc: { followersCount: -1 } });
      await User.updateOne({ _id: req.userId, followingCount: { $gt: 0 } }, { $inc: { followingCount: -1 } });
    }
    ok(res, { following: false });
  })
);
