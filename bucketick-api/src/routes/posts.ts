import { Router } from 'express';
import { Types } from 'mongoose';
import { z } from 'zod';
import { Post, PostDoc } from '../models/Post';
import { Hype } from '../models/Hype';
import { Bookmark } from '../models/Bookmark';
import { Comment, CommentDoc } from '../models/Comment';
import { User, UserDoc } from '../models/User';
import { requireAuth } from '../middleware/auth';
import { asyncHandler, badRequest, forbidden, notFound, ok } from '../utils/http';
import { serializeComment, serializePost } from '../utils/serialize';
import { postFlags, serializePostPage } from '../utils/postQuery';
import { buildPage, cursorFilter, KEYSET_SORT, pageLimit } from '../utils/pagination';
import { recomputeUserStats } from '../utils/stats';
import { CATEGORIES, VISIBILITIES } from '../types';

async function loadPost(id: string): Promise<PostDoc> {
  if (!Types.ObjectId.isValid(id)) throw badRequest('Invalid post id');
  const post = (await Post.findById(id).populate('author')) as PostDoc | null;
  if (!post) throw notFound('Post not found');
  return post;
}

// ---------------------------------------------------------------------------
// Feed router (mounted at /feed)
// ---------------------------------------------------------------------------
export const feedRouter = Router();
feedRouter.use(requireAuth);

feedRouter.get(
  '/',
  asyncHandler(async (req, res) => {
    const limit = pageLimit(req.query.limit);
    const me = new Types.ObjectId(req.userId);
    // Your own posts (any visibility) plus everyone's public posts.
    const audience = { $or: [{ author: me }, { visibility: 'public' }] };
    const filter = { $and: [audience, cursorFilter(req.query.cursor as string | undefined)] };

    const docs = (await Post.find(filter)
      .sort(KEYSET_SORT)
      .limit(limit + 1)
      .populate('author')) as PostDoc[];

    const { pageDocs, nextCursor } = buildPage(docs, limit);
    const items = await serializePostPage(pageDocs, req.userId!);
    const total = await Post.countDocuments(audience);
    ok(res, { items, nextCursor, total });
  })
);

// ---------------------------------------------------------------------------
// Posts router (mounted at /posts)
// ---------------------------------------------------------------------------
export const postsRouter = Router();
postsRouter.use(requireAuth);

const createSchema = z.object({
  caption: z.string().trim().min(1, 'Say something about it').max(2000),
  images: z.array(z.string().url()).max(6).optional(),
  coverAspect: z.number().positive().max(4).optional(),
  achievement: z
    .object({
      kind: z.enum(['list', 'item']),
      refId: z.string(),
      title: z.string().max(160),
    })
    .nullish(),
  category: z.enum(CATEGORIES).optional(),
  visibility: z.enum(VISIBILITIES).optional(),
});

// POST /posts
postsRouter.post(
  '/',
  asyncHandler(async (req, res) => {
    const body = createSchema.parse(req.body);
    if (body.achievement && !Types.ObjectId.isValid(body.achievement.refId)) {
      throw badRequest('Invalid achievement reference');
    }
    const post = await Post.create({
      author: req.userId,
      caption: body.caption,
      images: body.images ?? [],
      coverAspect: body.coverAspect ?? 1,
      achievement: body.achievement
        ? { kind: body.achievement.kind, refId: body.achievement.refId, title: body.achievement.title }
        : null,
      category: body.category ?? 'Everyday',
      visibility: body.visibility ?? 'public',
    });
    await recomputeUserStats(req.userId!);
    const me = (await User.findById(req.userId)) as UserDoc;
    ok(res, serializePost(post as PostDoc, me, { hypedByMe: false, bookmarkedByMe: false }), 201);
  })
);

// GET /posts/:id
postsRouter.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const post = await loadPost(req.params.id);
    if (post.visibility === 'private' && String(post.author._id) !== req.userId) {
      throw forbidden('This post is private');
    }
    const { hyped, bookmarked } = await postFlags(req.userId!, [post._id as Types.ObjectId]);
    ok(
      res,
      serializePost(post, post.author as unknown as UserDoc, {
        hypedByMe: hyped.has(String(post._id)),
        bookmarkedByMe: bookmarked.has(String(post._id)),
      })
    );
  })
);

// DELETE /posts/:id (owner only)
postsRouter.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    const post = await loadPost(req.params.id);
    if (String(post.author._id) !== req.userId) throw forbidden('This post is not yours');
    await Promise.all([
      Hype.deleteMany({ post: post._id }),
      Bookmark.deleteMany({ post: post._id }),
      Comment.deleteMany({ post: post._id }),
    ]);
    await post.deleteOne();
    await recomputeUserStats(req.userId!);
    ok(res, null);
  })
);

// POST /posts/:id/hype
postsRouter.post(
  '/:id/hype',
  asyncHandler(async (req, res) => {
    const post = await loadPost(req.params.id);
    const existing = await Hype.findOne({ user: req.userId, post: post._id });
    if (!existing) {
      await Hype.create({ user: req.userId, post: post._id });
      await Post.updateOne({ _id: post._id }, { $inc: { hypesCount: 1 } });
    }
    const fresh = await Post.findById(post._id).select('hypesCount');
    ok(res, { hyped: true, hypesCount: fresh?.hypesCount ?? post.hypesCount });
  })
);

// DELETE /posts/:id/hype
postsRouter.delete(
  '/:id/hype',
  asyncHandler(async (req, res) => {
    const post = await loadPost(req.params.id);
    const removed = await Hype.findOneAndDelete({ user: req.userId, post: post._id });
    if (removed) {
      await Post.updateOne({ _id: post._id, hypesCount: { $gt: 0 } }, { $inc: { hypesCount: -1 } });
    }
    const fresh = await Post.findById(post._id).select('hypesCount');
    ok(res, { hyped: false, hypesCount: fresh?.hypesCount ?? 0 });
  })
);

// POST /posts/:id/bookmark
postsRouter.post(
  '/:id/bookmark',
  asyncHandler(async (req, res) => {
    const post = await loadPost(req.params.id);
    const existing = await Bookmark.findOne({ user: req.userId, post: post._id });
    if (!existing) {
      await Bookmark.create({ user: req.userId, post: post._id });
      await Post.updateOne({ _id: post._id }, { $inc: { bookmarksCount: 1 } });
    }
    ok(res, { bookmarked: true });
  })
);

// DELETE /posts/:id/bookmark
postsRouter.delete(
  '/:id/bookmark',
  asyncHandler(async (req, res) => {
    const post = await loadPost(req.params.id);
    const removed = await Bookmark.findOneAndDelete({ user: req.userId, post: post._id });
    if (removed) {
      await Post.updateOne(
        { _id: post._id, bookmarksCount: { $gt: 0 } },
        { $inc: { bookmarksCount: -1 } }
      );
    }
    ok(res, { bookmarked: false });
  })
);

// GET /posts/:id/comments?cursor=
postsRouter.get(
  '/:id/comments',
  asyncHandler(async (req, res) => {
    const post = await loadPost(req.params.id);
    const limit = pageLimit(req.query.limit);
    const filter = { $and: [{ post: post._id }, cursorFilter(req.query.cursor as string | undefined)] };
    const docs = (await Comment.find(filter)
      .sort(KEYSET_SORT)
      .limit(limit + 1)
      .populate('author')) as CommentDoc[];
    const { pageDocs, nextCursor } = buildPage(docs, limit);
    const items = pageDocs.map((c) => serializeComment(c, c.author as unknown as UserDoc));
    ok(res, { items, nextCursor, total: post.commentsCount });
  })
);

// POST /posts/:id/comments
const commentSchema = z.object({ body: z.string().trim().min(1, 'Write a comment').max(1000) });

postsRouter.post(
  '/:id/comments',
  asyncHandler(async (req, res) => {
    const post = await loadPost(req.params.id);
    const { body } = commentSchema.parse(req.body);
    const comment = await Comment.create({ post: post._id, author: req.userId, body });
    await Post.updateOne({ _id: post._id }, { $inc: { commentsCount: 1 } });
    const me = (await User.findById(req.userId)) as UserDoc;
    ok(res, serializeComment(comment as CommentDoc, me), 201);
  })
);
