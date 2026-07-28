import { Router } from 'express';
import { Types } from 'mongoose';
import { z } from 'zod';
import { User, UserDoc } from '../models/User';
import { Post, PostDoc } from '../models/Post';
import { Follow } from '../models/Follow';
import { requireAuth } from '../middleware/auth';
import { asyncHandler, badRequest, notFound, ok } from '../utils/http';
import { serializeUser } from '../utils/serialize';
import { serializePostPage } from '../utils/postQuery';
import { buildPage, cursorFilter, KEYSET_SORT, pageLimit } from '../utils/pagination';
import { BRAND_COLORS } from '../types';

export const usersRouter = Router();

usersRouter.use(requireAuth);

usersRouter.get(
  '/me',
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.userId);
    if (!user) throw notFound('User not found');
    ok(res, serializeUser(user));
  })
);

const updateSchema = z.object({
  name: z.string().trim().min(2).max(60).optional(),
  bio: z.string().trim().max(280).nullable().optional(),
  avatarColor: z.enum(BRAND_COLORS).optional(),
  avatarUrl: z.string().url().nullable().optional(),
});

usersRouter.patch(
  '/me',
  asyncHandler(async (req, res) => {
    const patch = updateSchema.parse(req.body);
    const user = await User.findByIdAndUpdate(req.userId, { $set: patch }, { new: true });
    if (!user) throw notFound('User not found');
    ok(res, serializeUser(user));
  })
);

// GET /users/:userId — public profile of any user, with my follow state.
usersRouter.get(
  '/:userId',
  asyncHandler(async (req, res) => {
    const { userId } = req.params;
    if (!Types.ObjectId.isValid(userId)) throw badRequest('Invalid user id');
    const user = (await User.findById(userId)) as UserDoc | null;
    if (!user) throw notFound('User not found');
    const isMe = String(user._id) === req.userId;
    const followedByMe = isMe
      ? false
      : Boolean(await Follow.exists({ follower: req.userId, following: userId }));
    ok(res, { ...serializeUser(user), isMe, followedByMe });
  })
);

// GET /users/:userId/posts?cursor= — that user's posts (public; all if it is me).
usersRouter.get(
  '/:userId/posts',
  asyncHandler(async (req, res) => {
    const { userId } = req.params;
    if (!Types.ObjectId.isValid(userId)) throw badRequest('Invalid user id');
    const isMe = userId === req.userId;
    const limit = pageLimit(req.query.limit);

    const base = isMe ? { author: userId } : { author: userId, visibility: 'public' };
    const filter = { $and: [base, cursorFilter(req.query.cursor as string | undefined)] };
    const docs = (await Post.find(filter)
      .sort(KEYSET_SORT)
      .limit(limit + 1)
      .populate('author')) as PostDoc[];

    const { pageDocs, nextCursor } = buildPage(docs, limit);
    const items = await serializePostPage(pageDocs, req.userId!);
    const total = await Post.countDocuments(base);
    ok(res, { items, nextCursor, total });
  })
);
