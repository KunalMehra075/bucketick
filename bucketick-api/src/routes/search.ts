import { Router } from 'express';
import { Types } from 'mongoose';
import { User, UserDoc } from '../models/User';
import { Follow } from '../models/Follow';
import { requireAuth } from '../middleware/auth';
import { asyncHandler, ok } from '../utils/http';

export const searchRouter = Router();
searchRouter.use(requireAuth);

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function searchResult(u: UserDoc, followedByMe: boolean) {
  return {
    id: String(u._id),
    name: u.name,
    username: u.username,
    avatarUrl: u.avatarUrl ?? null,
    avatarColor: u.avatarColor,
    verified: u.verified,
    followersCount: u.followersCount,
    followedByMe,
  };
}

// GET /search/users?q= — accounts by name/username. Empty q returns suggestions.
searchRouter.get(
  '/users',
  asyncHandler(async (req, res) => {
    const q = String(req.query.q ?? '').trim();
    const meId = new Types.ObjectId(req.userId);

    let users: UserDoc[];
    if (!q) {
      // Suggestions: people I do not already follow.
      const following = await Follow.find({ follower: req.userId }).select('following');
      const exclude = following.map((f) => f.following as Types.ObjectId);
      exclude.push(meId);
      users = (await User.find({ _id: { $nin: exclude } })
        .sort({ points: -1, createdAt: 1 })
        .limit(20)) as UserDoc[];
    } else {
      const rx = new RegExp(escapeRegex(q), 'i');
      users = (await User.find({ _id: { $ne: meId }, $or: [{ username: rx }, { name: rx }] })
        .sort({ followersCount: -1 })
        .limit(20)) as UserDoc[];
    }

    const ids = users.map((u) => u._id as Types.ObjectId);
    const edges = await Follow.find({ follower: req.userId, following: { $in: ids } }).select('following');
    const followed = new Set(edges.map((e) => String(e.following)));

    ok(res, users.map((u) => searchResult(u, followed.has(String(u._id)))));
  })
);
