import { Router } from 'express';
import { Types } from 'mongoose';
import { Bookmark, BookmarkDoc } from '../models/Bookmark';
import { Post, PostDoc } from '../models/Post';
import { requireAuth } from '../middleware/auth';
import { asyncHandler, ok } from '../utils/http';
import { serializePostPage } from '../utils/postQuery';
import { buildPage, cursorFilter, KEYSET_SORT, pageLimit } from '../utils/pagination';

export const bookmarksRouter = Router();
bookmarksRouter.use(requireAuth);

// GET /bookmarks?cursor= — my saved posts, newest bookmark first.
bookmarksRouter.get(
  '/',
  asyncHandler(async (req, res) => {
    const limit = pageLimit(req.query.limit);
    const filter = { $and: [{ user: req.userId }, cursorFilter(req.query.cursor as string | undefined)] };
    const marks = (await Bookmark.find(filter).sort(KEYSET_SORT).limit(limit + 1)) as BookmarkDoc[];
    const { pageDocs, nextCursor } = buildPage(marks, limit);

    const postIds = pageDocs.map((b) => b.post as Types.ObjectId);
    const posts = (await Post.find({ _id: { $in: postIds } }).populate('author')) as PostDoc[];
    const byId = new Map(posts.map((p) => [String(p._id), p]));
    const ordered = postIds.map((id) => byId.get(String(id))).filter(Boolean) as PostDoc[];

    const items = await serializePostPage(ordered, req.userId!);
    const total = await Bookmark.countDocuments({ user: req.userId });
    ok(res, { items, nextCursor, total });
  })
);
