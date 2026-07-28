import { Router } from 'express';
import { Post, PostDoc } from '../models/Post';
import { UserDoc } from '../models/User';
import { requireAuth } from '../middleware/auth';
import { asyncHandler, ok } from '../utils/http';
import { serializeExploreItem } from '../utils/serialize';
import { buildPage, cursorFilter, KEYSET_SORT, pageLimit } from '../utils/pagination';

export const exploreRouter = Router();
exploreRouter.use(requireAuth);

// GET /explore?cursor= — masonry grid of public posts that have images.
exploreRouter.get(
  '/',
  asyncHandler(async (req, res) => {
    const limit = pageLimit(req.query.limit);
    const base = { visibility: 'public', 'images.0': { $exists: true } };
    const filter = { $and: [base, cursorFilter(req.query.cursor as string | undefined)] };

    const docs = (await Post.find(filter)
      .sort(KEYSET_SORT)
      .limit(limit + 1)
      .populate('author')) as PostDoc[];

    const { pageDocs, nextCursor } = buildPage(docs, limit);
    const items = pageDocs.map((p) => serializeExploreItem(p, p.author as unknown as UserDoc));
    const total = await Post.countDocuments(base);
    ok(res, { items, nextCursor, total });
  })
);
