import { request } from './client';
import type {
  AuthResponse,
  BucketItem,
  BucketList,
  Comment,
  Connection,
  ExploreItem,
  ItemStatus,
  LeaderboardResponse,
  Paginated,
  Post,
  PostAchievement,
  PublicUser,
  SearchUser,
  User,
  Visibility,
} from '../types';
import type { BrandColor } from '../theme';

export interface CreateListInput {
  title: string;
  description?: string | null;
  category?: string;
  accent?: BrandColor;
  visibility?: Visibility;
  coverUrl?: string | null;
}

export interface CreatePostInput {
  caption: string;
  images?: string[];
  coverAspect?: number;
  achievement?: PostAchievement | null;
  category?: string;
  visibility?: Visibility;
}

const qs = (cursor?: string, limit?: number) => {
  const p = new URLSearchParams();
  if (cursor) p.set('cursor', cursor);
  if (limit) p.set('limit', String(limit));
  const s = p.toString();
  return s ? `?${s}` : '';
};

export const authApi = {
  register: (name: string, email: string, password: string) =>
    request<AuthResponse>('POST', '/auth/register', { name, email, password }),
  login: (email: string, password: string) =>
    request<AuthResponse>('POST', '/auth/login', { email, password }),
  logout: (refreshToken: string) =>
    request<null>('POST', '/auth/logout', { refresh_token: refreshToken }),
};

export const usersApi = {
  me: () => request<User>('GET', '/users/me'),
  updateMe: (patch: { name?: string; bio?: string | null; avatarColor?: BrandColor; avatarUrl?: string | null }) =>
    request<User>('PATCH', '/users/me', patch),
  getUser: (userId: string) => request<PublicUser>('GET', `/users/${userId}`),
  posts: (userId: string, cursor?: string) =>
    request<Paginated<Post>>('GET', `/users/${userId}/posts${qs(cursor)}`),
};

export const listsApi = {
  list: () => request<BucketList[]>('GET', '/lists'),
  get: (id: string) => request<BucketList>('GET', `/lists/${id}`),
  create: (input: CreateListInput) => request<BucketList>('POST', '/lists', input),
  update: (id: string, patch: Partial<CreateListInput>) =>
    request<BucketList>('PATCH', `/lists/${id}`, patch),
  remove: (id: string) => request<null>('DELETE', `/lists/${id}`),
  items: (listId: string) => request<BucketItem[]>('GET', `/lists/${listId}/items`),
  addItem: (listId: string, input: { title: string; note?: string | null; location?: string | null }) =>
    request<BucketItem>('POST', `/lists/${listId}/items`, input),
};

export const itemsApi = {
  update: (
    id: string,
    patch: { title?: string; note?: string | null; location?: string | null; status?: ItemStatus }
  ) => request<BucketItem>('PATCH', `/items/${id}`, patch),
  remove: (id: string) => request<null>('DELETE', `/items/${id}`),
};

export const feedApi = {
  get: (cursor?: string) => request<Paginated<Post>>('GET', `/feed${qs(cursor)}`),
};

export const postsApi = {
  get: (id: string) => request<Post>('GET', `/posts/${id}`),
  create: (input: CreatePostInput) => request<Post>('POST', '/posts', input),
  remove: (id: string) => request<null>('DELETE', `/posts/${id}`),
  hype: (id: string) => request<{ hyped: boolean; hypesCount: number }>('POST', `/posts/${id}/hype`),
  unhype: (id: string) => request<{ hyped: boolean; hypesCount: number }>('DELETE', `/posts/${id}/hype`),
  bookmark: (id: string) => request<{ bookmarked: boolean }>('POST', `/posts/${id}/bookmark`),
  unbookmark: (id: string) => request<{ bookmarked: boolean }>('DELETE', `/posts/${id}/bookmark`),
  comments: (id: string, cursor?: string) =>
    request<Paginated<Comment>>('GET', `/posts/${id}/comments${qs(cursor)}`),
  addComment: (id: string, body: string) =>
    request<Comment>('POST', `/posts/${id}/comments`, { body }),
};

export const bookmarksApi = {
  list: (cursor?: string) => request<Paginated<Post>>('GET', `/bookmarks${qs(cursor)}`),
};

export const exploreApi = {
  get: (cursor?: string) => request<Paginated<ExploreItem>>('GET', `/explore${qs(cursor)}`),
};

export const searchApi = {
  users: (q: string) => request<SearchUser[]>('GET', `/search/users${q ? `?q=${encodeURIComponent(q)}` : ''}`),
};

export const leaderboardApi = {
  get: () => request<LeaderboardResponse>('GET', '/leaderboard'),
};

export const followsApi = {
  followers: () => request<Connection[]>('GET', '/follows/followers'),
  following: () => request<Connection[]>('GET', '/follows/following'),
  suggestions: () => request<Connection[]>('GET', '/follows/suggestions'),
  follow: (userId: string) => request<{ following: boolean }>('POST', `/follows/${userId}`),
  unfollow: (userId: string) => request<{ following: boolean }>('DELETE', `/follows/${userId}`),
};
