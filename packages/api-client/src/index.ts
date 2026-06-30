/**
 * @bucketick/api-client — the single door to the Bucketick backend.
 *
 * Apps never call fetch directly; they import this client (typically through a
 * TanStack Query hook per domain) and call namespaced methods. Every method is
 * currently backed by `stub()` + mock data. To go live, swap a method's
 * `stub(mock)` for the equivalent `request(method, path, body)` — the call sites
 * and types do not change.
 */

import { stub } from './request';
import {
  mockAchievements,
  mockComments,
  mockConversations,
  mockExplore,
  mockItems,
  mockLists,
  mockMessages,
  mockNotifications,
  mockStreak,
  mockUser,
  mockUsers,
} from './mocks';
import type {
  Achievement,
  AuthTokens,
  BucketItem,
  BucketListSummary,
  Comment,
  Conversation,
  CreateBucketListPayload,
  ExploreMedia,
  ID,
  Message,
  Notification,
  Paginated,
  StreakSummary,
  UpdateUserPayload,
  User,
} from './types';

export * from './types';
export { BASE_URL, STORAGE_KEYS, ApiError } from './request';

const page = <T>(items: T[]): Paginated<T> => ({
  items,
  nextCursor: null,
  total: items.length,
});

export const auth = {
  login: (email: string, _password: string) =>
    stub<AuthTokens>(
      {
        accessToken: 'mock_access',
        refreshToken: 'mock_refresh',
        user: { ...mockUser, username: email.split('@')[0] },
      },
      'auth.login',
    ),
  signup: (_email: string, _password: string, name: string) =>
    stub<AuthTokens>(
      { accessToken: 'mock_access', refreshToken: 'mock_refresh', user: { ...mockUser, name } },
      'auth.signup',
    ),
  refresh: (_rt: string) =>
    stub<{ accessToken: string; refreshToken: string }>(
      { accessToken: 'mock_access', refreshToken: 'mock_refresh' },
      'auth.refresh',
    ),
  logout: (_rt: string) => stub<void>(undefined, 'auth.logout'),
  forgotPassword: (_email: string) => stub<void>(undefined, 'auth.forgotPassword'),
  resetPassword: (_token: string, _password: string) => stub<void>(undefined, 'auth.resetPassword'),
};

export const users = {
  getMe: () => stub<User>(mockUser, 'users.getMe'),
  updateMe: (payload: UpdateUserPayload) =>
    stub<User>({ ...mockUser, ...payload }, 'users.updateMe'),
  getByUsername: (username: string) =>
    stub<User>(mockUsers.find((u) => u.username === username) ?? mockUser, 'users.getByUsername'),
};

export const bucketLists = {
  listMine: () =>
    stub<Paginated<BucketListSummary>>(
      page(mockLists.filter((l) => l.owner.id === mockUser.id)),
      'bucketLists.listMine',
    ),
  getById: (id: ID) =>
    stub<BucketListSummary>(
      mockLists.find((l) => l.id === id) ?? mockLists[0],
      'bucketLists.getById',
    ),
  create: (payload: CreateBucketListPayload) =>
    stub<BucketListSummary>(
      {
        ...mockLists[0],
        id: `l_${Math.round(performance.now())}`,
        title: payload.title,
        description: payload.description ?? null,
        visibility: payload.visibility ?? 'private',
        category: payload.category ?? null,
        itemsCount: 0,
        completedCount: 0,
        starsCount: 0,
      },
      'bucketLists.create',
    ),
  update: (id: ID, payload: Partial<CreateBucketListPayload>) =>
    stub<BucketListSummary>(
      { ...(mockLists.find((l) => l.id === id) ?? mockLists[0]), ...payload },
      'bucketLists.update',
    ),
  remove: (_id: ID) => stub<void>(undefined, 'bucketLists.remove'),
};

export const items = {
  listForList: (_listId: ID) => stub<BucketItem[]>(mockItems, 'items.listForList'),
  create: (listId: ID, title: string) =>
    stub<BucketItem>(
      {
        id: `i_${Math.round(performance.now())}`,
        listId,
        title,
        note: null,
        status: 'dreaming',
        photos: [],
        location: null,
        targetDate: null,
        completedAt: null,
        position: 99,
      },
      'items.create',
    ),
  toggleComplete: (id: ID) =>
    stub<BucketItem>({ ...mockItems[0], id, status: 'completed' }, 'items.toggleComplete'),
  remove: (_id: ID) => stub<void>(undefined, 'items.remove'),
};

export const comments = {
  listForList: (_listId: ID) => stub<Comment[]>(mockComments, 'comments.listForList'),
  add: (_listId: ID, body: string) =>
    stub<Comment>(
      { ...mockComments[0], id: `c_${Math.round(performance.now())}`, body },
      'comments.add',
    ),
};

export const stars = {
  star: (_listId: ID) => stub<void>(undefined, 'stars.star'),
  unstar: (_listId: ID) => stub<void>(undefined, 'stars.unstar'),
};

export const follows = {
  followUser: (_userId: ID) => stub<void>(undefined, 'follows.followUser'),
  unfollowUser: (_userId: ID) => stub<void>(undefined, 'follows.unfollowUser'),
  followers: () => stub<Paginated<User>>(page(mockUsers), 'follows.followers'),
  following: () => stub<Paginated<User>>(page(mockUsers), 'follows.following'),
};

export const saved = {
  list: () =>
    stub<Paginated<BucketListSummary>>(page(mockLists.filter((l) => l.savedByMe)), 'saved.list'),
  save: (_listId: ID) => stub<void>(undefined, 'saved.save'),
  unsave: (_listId: ID) => stub<void>(undefined, 'saved.unsave'),
};

export const explore = {
  feed: (_cursor?: string) => stub<Paginated<BucketListSummary>>(page(mockLists), 'explore.feed'),
  media: (_cursor?: string) => stub<Paginated<ExploreMedia>>(page(mockExplore), 'explore.media'),
  trendingLists: () => stub<BucketListSummary[]>(mockLists, 'explore.trendingLists'),
  trendingUsers: () => stub<User[]>(mockUsers, 'explore.trendingUsers'),
};

export const streaks = {
  mine: () => stub<StreakSummary>(mockStreak, 'streaks.mine'),
};

export const messages = {
  conversations: () => stub<Conversation[]>(mockConversations, 'messages.conversations'),
  thread: (conversationId: ID) =>
    stub<Message[]>(mockMessages[conversationId] ?? [], 'messages.thread'),
};

export const search = {
  query: (q: string) =>
    stub<{ lists: BucketListSummary[]; users: User[] }>(
      {
        lists: mockLists.filter((l) => l.title.toLowerCase().includes(q.toLowerCase())),
        users: mockUsers.filter((u) => u.name.toLowerCase().includes(q.toLowerCase())),
      },
      'search.query',
    ),
};

export const notifications = {
  list: () => stub<Notification[]>(mockNotifications, 'notifications.list'),
  markAllRead: () => stub<void>(undefined, 'notifications.markAllRead'),
};

export const achievements = {
  listMine: () => stub<Achievement[]>(mockAchievements, 'achievements.listMine'),
};

export const analytics = {
  overview: () =>
    stub<{
      listsCreated: number;
      goalsCompleted: number;
      followers: number;
      starsReceived: number;
    }>(
      { listsCreated: 12, goalsCompleted: 47, followers: 1284, starsReceived: 3920 },
      'analytics.overview',
    ),
};

const apiClient = {
  auth,
  users,
  bucketLists,
  items,
  comments,
  stars,
  follows,
  saved,
  explore,
  streaks,
  messages,
  search,
  notifications,
  achievements,
  analytics,
};

export default apiClient;
