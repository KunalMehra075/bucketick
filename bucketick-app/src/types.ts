/**
 * Domain types, matching the bucketick-api responses exactly
 * (see bucketick-api/src/utils/serialize.ts).
 */
import type { BrandColor } from './theme';

export type ID = string;
export type ISODate = string;

export type Visibility = 'public' | 'private';
export type ItemStatus = 'dreaming' | 'in_progress' | 'completed';

export interface User {
  id: ID;
  username: string;
  name: string;
  avatarColor: BrandColor;
  avatarUrl: string | null;
  bio: string | null;
  verified: boolean;
  followersCount: number;
  followingCount: number;
  listsCount: number;
  completedCount: number;
  postsCount: number;
  points: number;
}

/** Public profile shape (User plus my relationship to them). */
export interface PublicUser extends User {
  isMe: boolean;
  followedByMe: boolean;
}

export interface BucketList {
  id: ID;
  title: string;
  description: string | null;
  visibility: Visibility;
  category: string;
  accent: BrandColor;
  coverUrl: string | null;
  createdAt: ISODate;
  itemsCount: number;
  completedCount: number;
  inProgressCount: number;
}

export interface BucketItem {
  id: ID;
  listId: ID;
  title: string;
  note: string | null;
  status: ItemStatus;
  location: string | null;
  completedAt: ISODate | null;
}

/** Compact author reference on posts, comments, explore items. */
export interface AuthorRef {
  id: ID;
  username: string;
  name: string;
  avatarUrl: string | null;
  avatarColor: BrandColor;
  verified: boolean;
}

export interface PostAchievement {
  kind: 'list' | 'item';
  refId: ID;
  title: string;
}

export interface Post {
  id: ID;
  author: AuthorRef;
  caption: string;
  images: string[];
  coverAspect: number;
  achievement: PostAchievement | null;
  category: string;
  visibility: Visibility;
  hypesCount: number;
  commentsCount: number;
  bookmarksCount: number;
  hypedByMe: boolean;
  bookmarkedByMe: boolean;
  createdAt: ISODate;
}

export interface Comment {
  id: ID;
  postId: ID;
  author: AuthorRef;
  body: string;
  createdAt: ISODate;
}

export interface ExploreItem {
  id: ID;
  thumbnailUrl: string;
  aspect: number;
  caption: string;
  author: AuthorRef;
  hypesCount: number;
}

export interface SearchUser {
  id: ID;
  name: string;
  username: string;
  avatarUrl: string | null;
  avatarColor: BrandColor;
  verified: boolean;
  followersCount: number;
  followedByMe: boolean;
}

export interface RankedUser {
  id: ID;
  name: string;
  username: string;
  avatarColor: BrandColor;
  points: number;
  completedCount: number;
  isMe?: boolean;
}

export interface RankedMe extends RankedUser {
  rank: number;
}

export interface Connection {
  id: ID;
  name: string;
  username: string;
  avatarColor: BrandColor;
  avatarUrl: string | null;
  points: number;
  following: boolean;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface LeaderboardResponse {
  items: RankedUser[];
  me: RankedMe;
}

/** Cursor-paginated envelope from every infinite list endpoint. */
export interface Paginated<T> {
  items: T[];
  nextCursor: string | null;
  total: number;
}
