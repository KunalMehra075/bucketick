import { Router } from 'express';
import { User, UserDoc } from '../models/User';
import { requireAuth } from '../middleware/auth';
import { asyncHandler, notFound, ok } from '../utils/http';

export const leaderboardRouter = Router();
leaderboardRouter.use(requireAuth);

function toRanked(u: UserDoc, isMe: boolean) {
  return {
    id: String(u._id),
    name: u.name,
    username: u.username,
    avatarColor: u.avatarColor,
    points: u.points,
    completedCount: u.completedCount,
    isMe,
  };
}

// GET /leaderboard — top players plus my own rank.
leaderboardRouter.get(
  '/',
  asyncHandler(async (req, res) => {
    const me = await User.findById(req.userId);
    if (!me) throw notFound('User not found');

    const top = (await User.find().sort({ points: -1, completedCount: -1, createdAt: 1 }).limit(20)) as UserDoc[];

    // Rank = how many users strictly outscore me, plus one.
    const ahead = await User.countDocuments({ points: { $gt: me.points } });
    const myRank = ahead + 1;

    ok(res, {
      items: top.map((u) => toRanked(u, String(u._id) === String(me._id))),
      me: { rank: myRank, ...toRanked(me, true) },
    });
  })
);
