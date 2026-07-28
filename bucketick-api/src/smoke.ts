/**
 * End-to-end smoke test against an in-memory MongoDB. No real DB needed.
 * Usage: npm run smoke
 */
import { MongoMemoryServer } from 'mongodb-memory-server';
import type { Server } from 'http';

const PORT = 8099;
const BASE = `http://localhost:${PORT}`;

let passed = 0;
let failed = 0;

function check(name: string, cond: boolean, extra?: unknown) {
  if (cond) {
    passed += 1;
    // eslint-disable-next-line no-console
    console.log(`  PASS  ${name}`);
  } else {
    failed += 1;
    // eslint-disable-next-line no-console
    console.error(`  FAIL  ${name}`, extra ?? '');
  }
}

async function api(method: string, path: string, body?: unknown, token?: string) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  const json = res.status === 204 ? null : await res.json().catch(() => null);
  return { status: res.status, body: json };
}

async function main() {
  const mem = await MongoMemoryServer.create();
  process.env.MONGODB_URI = mem.getUri('bucketick_test');
  process.env.JWT_ACCESS_SECRET = 'test_access';
  process.env.JWT_REFRESH_SECRET = 'test_refresh';
  process.env.PORT = String(PORT);

  // Import AFTER env is set so config/env picks up the in-memory URI.
  const { connectDb, disconnectDb } = await import('./config/db');
  const { createApp } = await import('./app');
  const { User } = await import('./models/User');
  const { Follow } = await import('./models/Follow');

  await connectDb(process.env.MONGODB_URI);
  const app = createApp();
  const server: Server = await new Promise((resolve) => {
    const s = app.listen(PORT, () => resolve(s));
  });

  try {
    // Health
    const health = await api('GET', '/health');
    check('health ok', health.status === 200 && health.body.status === 'ok');

    // Register
    const reg = await api('POST', '/api/v1/auth/register', {
      name: 'Test Dreamer',
      email: 'test@bucketick.com',
      password: 'secret1',
    });
    check('register 201 + tokens', reg.status === 201 && !!reg.body.data.accessToken, reg.body);
    check('register returns user', reg.body.data?.user?.username?.length > 0, reg.body.data?.user);
    const token = reg.body.data.accessToken as string;
    const refresh = reg.body.data.refreshToken as string;

    // Duplicate email rejected
    const dup = await api('POST', '/api/v1/auth/register', {
      name: 'Test Dreamer',
      email: 'test@bucketick.com',
      password: 'secret1',
    });
    check('duplicate email rejected', dup.status === 400, dup.body);

    // Login
    const login = await api('POST', '/api/v1/auth/login', {
      email: 'test@bucketick.com',
      password: 'secret1',
    });
    check('login ok', login.status === 200 && !!login.body.data.accessToken);

    const badLogin = await api('POST', '/api/v1/auth/login', {
      email: 'test@bucketick.com',
      password: 'wrong',
    });
    check('wrong password 401', badLogin.status === 401, badLogin.body);

    // Auth required
    const noAuth = await api('GET', '/api/v1/lists');
    check('lists without token 401', noAuth.status === 401);

    // Me
    const me = await api('GET', '/api/v1/users/me', undefined, token);
    check('users/me ok', me.status === 200 && me.body.data.email === undefined, me.body);

    // Update profile
    const upd = await api('PATCH', '/api/v1/users/me', { bio: 'Test bio' }, token);
    check('update profile', upd.status === 200 && upd.body.data.bio === 'Test bio', upd.body);

    // Create list
    const list = await api(
      'POST',
      '/api/v1/lists',
      { title: 'My first list', category: 'Travel', accent: 'blue', visibility: 'public' },
      token
    );
    check('create list 201', list.status === 201 && !!list.body.data.id, list.body);
    const listId = list.body.data.id as string;
    check('new list counts zero', list.body.data.itemsCount === 0, list.body.data);

    // Add items
    const it1 = await api('POST', `/api/v1/lists/${listId}/items`, { title: 'Dream one' }, token);
    const it2 = await api('POST', `/api/v1/lists/${listId}/items`, { title: 'Dream two', location: 'Rome' }, token);
    check('add items 201', it1.status === 201 && it2.status === 201, [it1.body, it2.body]);
    const itemId = it1.body.data.id as string;

    // Items list
    const items = await api('GET', `/api/v1/lists/${listId}/items`, undefined, token);
    check('list items count 2', items.status === 200 && items.body.data.length === 2, items.body);

    // Complete an item
    const complete = await api('PATCH', `/api/v1/items/${itemId}`, { status: 'completed' }, token);
    check('complete item', complete.status === 200 && complete.body.data.status === 'completed' && !!complete.body.data.completedAt, complete.body);

    // List now reflects counts
    const listsAfter = await api('GET', '/api/v1/lists', undefined, token);
    const mine = listsAfter.body.data.find((l: { id: string }) => l.id === listId);
    check('list counts updated', mine.itemsCount === 2 && mine.completedCount === 1, mine);

    // Stats/points updated
    const me2 = await api('GET', '/api/v1/users/me', undefined, token);
    check('user points updated', me2.body.data.completedCount === 1 && me2.body.data.points === 50, me2.body.data);

    // Edit item
    const edit = await api('PATCH', `/api/v1/items/${itemId}`, { title: 'Dream one edited' }, token);
    check('edit item title', edit.body.data.title === 'Dream one edited', edit.body);

    // Delete item
    const del = await api('DELETE', `/api/v1/items/${itemId}`, undefined, token);
    check('delete item', del.status === 200);
    const itemsAfterDel = await api('GET', `/api/v1/lists/${listId}/items`, undefined, token);
    check('items count 1 after delete', itemsAfterDel.body.data.length === 1, itemsAfterDel.body);

    // Refresh token
    const refreshed = await api('POST', '/api/v1/auth/refresh', { refresh_token: refresh });
    check('refresh token', refreshed.status === 200 && !!refreshed.body.data.accessToken, refreshed.body);

    // Seed a couple more users to test social + leaderboard
    const other = await api('POST', '/api/v1/auth/register', {
      name: 'Other Person',
      email: 'other@bucketick.com',
      password: 'secret1',
    });
    const otherId = other.body.data.user.id as string;
    const otherToken = other.body.data.accessToken as string;
    // Give other person a completed item so they have points
    const oList = await api('POST', '/api/v1/lists', { title: 'Theirs', category: 'Food' }, otherToken);
    const oItem = await api('POST', `/api/v1/lists/${oList.body.data.id}/items`, { title: 'X' }, otherToken);
    await api('PATCH', `/api/v1/items/${oItem.body.data.id}`, { status: 'completed' }, otherToken);

    // Leaderboard
    const lb = await api('GET', '/api/v1/leaderboard', undefined, token);
    check('leaderboard returns items + me', lb.status === 200 && Array.isArray(lb.body.data.items) && !!lb.body.data.me.rank, lb.body);
    check('leaderboard marks me', lb.body.data.items.some((u: { isMe: boolean }) => u.isMe), lb.body.data.items);

    // Follow
    const suggestions = await api('GET', '/api/v1/follows/suggestions', undefined, token);
    check('suggestions include other', suggestions.body.data.some((u: { id: string }) => u.id === otherId), suggestions.body);
    const follow = await api('POST', `/api/v1/follows/${otherId}`, {}, token);
    check('follow ok', follow.status === 200 && follow.body.data.following === true, follow.body);

    const following = await api('GET', '/api/v1/follows/following', undefined, token);
    check('following list has other', following.body.data.length === 1 && following.body.data[0].id === otherId, following.body);

    const otherFollowers = await api('GET', '/api/v1/follows/followers', undefined, otherToken);
    check('other sees me as follower', otherFollowers.body.data.length === 1, otherFollowers.body);

    // Follow idempotent (no double count)
    await api('POST', `/api/v1/follows/${otherId}`, {}, token);
    const meAfterFollow = await User.findById(reg.body.data.user.id);
    check('following count is 1 (idempotent)', meAfterFollow?.followingCount === 1, meAfterFollow?.followingCount);

    // Unfollow
    const unfollow = await api('DELETE', `/api/v1/follows/${otherId}`, undefined, token);
    check('unfollow ok', unfollow.status === 200 && unfollow.body.data.following === false);
    const edgeGone = await Follow.countDocuments({ following: otherId });
    check('follow edge removed', edgeGone === 0, edgeGone);

    // Cannot follow self
    const selfFollow = await api('POST', `/api/v1/follows/${reg.body.data.user.id}`, {}, token);
    check('cannot follow self', selfFollow.status === 400, selfFollow.body);

    // ---- Social: posts, feed, hype, comment, bookmark, explore, search ----
    const createPost = await api(
      'POST',
      '/api/v1/posts',
      {
        caption: 'Finally ran my first 10k',
        images: ['https://images.unsplash.com/photo-a', 'https://images.unsplash.com/photo-b'],
        coverAspect: 1.2,
        visibility: 'public',
      },
      token
    );
    check('create post 201', createPost.status === 201 && !!createPost.body.data.id, createPost.body);
    const postId = createPost.body.data.id as string;
    check('post carries author ref', createPost.body.data.author?.username?.length > 0, createPost.body.data.author);

    const feed = await api('GET', '/api/v1/feed', undefined, token);
    check(
      'feed returns my post + cursor field',
      feed.status === 200 &&
        'nextCursor' in feed.body.data &&
        feed.body.data.items.some((p: { id: string }) => p.id === postId),
      feed.body
    );

    const getPost = await api('GET', `/api/v1/posts/${postId}`, undefined, otherToken);
    check('other reads public post, hypedByMe false', getPost.status === 200 && getPost.body.data.hypedByMe === false, getPost.body);

    const hype = await api('POST', `/api/v1/posts/${postId}/hype`, {}, otherToken);
    check('hype ok count 1', hype.status === 200 && hype.body.data.hyped === true && hype.body.data.hypesCount === 1, hype.body);
    await api('POST', `/api/v1/posts/${postId}/hype`, {}, otherToken); // idempotent
    const reGet = await api('GET', `/api/v1/posts/${postId}`, undefined, otherToken);
    check('hype idempotent (still 1, hypedByMe true)', reGet.body.data.hypesCount === 1 && reGet.body.data.hypedByMe === true, reGet.body.data);
    const unhype = await api('DELETE', `/api/v1/posts/${postId}/hype`, undefined, otherToken);
    check('unhype -> count 0', unhype.body.data.hyped === false && unhype.body.data.hypesCount === 0, unhype.body);

    const comment = await api('POST', `/api/v1/posts/${postId}/comments`, { body: 'Massive, congrats' }, otherToken);
    check('add comment 201', comment.status === 201 && comment.body.data.body === 'Massive, congrats', comment.body);
    const comments = await api('GET', `/api/v1/posts/${postId}/comments`, undefined, token);
    check('comments list total 1', comments.body.data.items.length === 1 && comments.body.data.total === 1, comments.body);

    const bm = await api('POST', `/api/v1/posts/${postId}/bookmark`, {}, token);
    check('bookmark ok', bm.body.data.bookmarked === true, bm.body);
    const bookmarks = await api('GET', '/api/v1/bookmarks', undefined, token);
    check('bookmarks list has post', bookmarks.body.data.items.some((p: { id: string }) => p.id === postId), bookmarks.body);
    const unbm = await api('DELETE', `/api/v1/posts/${postId}/bookmark`, undefined, token);
    check('unbookmark ok', unbm.body.data.bookmarked === false);

    const explore = await api('GET', '/api/v1/explore', undefined, token);
    check(
      'explore returns my post with thumbnail',
      explore.status === 200 &&
        explore.body.data.items.some((x: { id: string; thumbnailUrl: string }) => x.id === postId && x.thumbnailUrl.length > 0),
      explore.body
    );

    const userPosts = await api('GET', `/api/v1/users/${reg.body.data.user.id}/posts`, undefined, otherToken);
    check('user posts returns my post', userPosts.body.data.items.some((p: { id: string }) => p.id === postId), userPosts.body);

    const searchOther = await api('GET', '/api/v1/search/users?q=other', undefined, token);
    check('search finds other person', searchOther.body.data.some((u: { id: string }) => u.id === otherId), searchOther.body);
    const searchEmpty = await api('GET', '/api/v1/search/users', undefined, token);
    check('empty search returns suggestions', Array.isArray(searchEmpty.body.data), searchEmpty.body);

    const otherProfile = await api('GET', `/api/v1/users/${otherId}`, undefined, token);
    check('public profile has followedByMe', otherProfile.status === 200 && 'followedByMe' in otherProfile.body.data, otherProfile.body);

    const delPost = await api('DELETE', `/api/v1/posts/${postId}`, undefined, token);
    check('delete post ok', delPost.status === 200, delPost.body);

    // Delete list cascades items
    await api('DELETE', `/api/v1/lists/${listId}`, undefined, token);
    const listsGone = await api('GET', '/api/v1/lists', undefined, token);
    check('list deleted', listsGone.body.data.length === 0, listsGone.body);
  } finally {
    await new Promise<void>((resolve) => server.close(() => resolve()));
    await disconnectDb();
    await mem.stop();
  }

  // eslint-disable-next-line no-console
  console.log(`\n${passed} passed, ${failed} failed.`);
  process.exit(failed === 0 ? 0 : 1);
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('Smoke run crashed:', err);
  process.exit(1);
});
