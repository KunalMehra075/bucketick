import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { env } from './config/env';
import { authRouter } from './routes/auth';
import { usersRouter } from './routes/users';
import { listsRouter } from './routes/lists';
import { itemsRouter } from './routes/items';
import { leaderboardRouter } from './routes/leaderboard';
import { followsRouter } from './routes/follows';
import { postsRouter, feedRouter } from './routes/posts';
import { bookmarksRouter } from './routes/bookmarks';
import { exploreRouter } from './routes/explore';
import { searchRouter } from './routes/search';
import { errorHandler, notFoundHandler } from './middleware/error';

// General limiter for the whole API, plus a stricter one for auth (brute-force guard).
const apiLimiter = rateLimit({ windowMs: 60_000, max: 300, standardHeaders: true, legacyHeaders: false });
const authLimiter = rateLimit({ windowMs: 15 * 60_000, max: 50, standardHeaders: true, legacyHeaders: false });

export function createApp(): Express {
  const app = express();
  app.set('trust proxy', 1);

  app.use(helmet());
  app.use(compression());
  app.use(
    cors({
      origin: env.corsOrigins.length > 0 ? env.corsOrigins : true,
      credentials: true,
    })
  );
  app.use(express.json({ limit: '1mb' }));

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok', service: 'bucketick-api' });
  });

  const v1 = express.Router();
  v1.use(apiLimiter);
  v1.use('/auth', authLimiter, authRouter);
  v1.use('/users', usersRouter);
  v1.use('/lists', listsRouter);
  v1.use('/items', itemsRouter);
  v1.use('/leaderboard', leaderboardRouter);
  v1.use('/follows', followsRouter);
  v1.use('/feed', feedRouter);
  v1.use('/posts', postsRouter);
  v1.use('/bookmarks', bookmarksRouter);
  v1.use('/explore', exploreRouter);
  v1.use('/search', searchRouter);
  app.use('/api/v1', v1);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
