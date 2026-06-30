/** Bucketick domain types. Shared by every consuming app. */

export type ID = string;
export type ISODate = string;

export type Visibility = 'public' | 'private';
export type ItemStatus = 'dreaming' | 'in_progress' | 'completed';

export interface User {
  id: ID;
  username: string;
  name: string;
  avatarUrl: string | null;
  bio: string | null;
  verified: boolean;
  followersCount: number;
  followingCount: number;
  listsCount: number;
  completedCount: number;
  createdAt: ISODate;
}

export interface BucketListSummary {
  id: ID;
  title: string;
  description: string | null;
  coverUrl: string | null;
  visibility: Visibility;
  category: string | null;
  owner: Pick<User, 'id' | 'username' | 'name' | 'avatarUrl' | 'verified'>;
  collaborators: Array<Pick<User, 'id' | 'avatarUrl' | 'name'>>;
  itemsCount: number;
  completedCount: number;
  starsCount: number;
  savedByMe: boolean;
  starredByMe: boolean;
  updatedAt: ISODate;
}

export interface BucketItem {
  id: ID;
  listId: ID;
  title: string;
  note: string | null;
  status: ItemStatus;
  photos: string[];
  location: string | null;
  targetDate: ISODate | null;
  completedAt: ISODate | null;
  position: number;
}

export interface Comment {
  id: ID;
  author: Pick<User, 'id' | 'username' | 'name' | 'avatarUrl' | 'verified'>;
  body: string;
  createdAt: ISODate;
  likesCount: number;
}

export interface Achievement {
  id: ID;
  key: string;
  title: string;
  description: string;
  iconColor: string;
  unlockedAt: ISODate | null;
  progress: number; // 0..1
}

export interface Notification {
  id: ID;
  type: 'follow' | 'star' | 'comment' | 'achievement' | 'collab_invite' | 'progress';
  actor: Pick<User, 'id' | 'username' | 'name' | 'avatarUrl'> | null;
  text: string;
  read: boolean;
  createdAt: ISODate;
}

/** A piece of media in the Explore grid. `aspect` = height / width, drives the masonry layout. */
export interface ExploreMedia {
  id: ID;
  type: 'video' | 'image';
  thumbnailUrl: string;
  aspect: number;
  title: string;
  author: Pick<User, 'id' | 'username' | 'name' | 'avatarUrl' | 'verified'>;
  starsCount: number;
  viewsCount: number;
  durationSeconds: number | null;
  category: string;
}

export interface StreakMilestone {
  days: number;
  label: string;
  reached: boolean;
}

export interface StreakSummary {
  current: number;
  longest: number;
  freezesAvailable: number;
  weeklyGoal: number;
  thisWeekDone: number;
  startedAt: ISODate;
  /** Activity intensity 0..4 per day, oldest first, ending today. */
  days: number[];
  milestones: StreakMilestone[];
}

export interface Conversation {
  id: ID;
  participant: Pick<User, 'id' | 'username' | 'name' | 'avatarUrl' | 'verified'>;
  lastMessage: string;
  lastAt: ISODate;
  unread: number;
  online: boolean;
}

export interface Message {
  id: ID;
  conversationId: ID;
  fromMe: boolean;
  body: string;
  createdAt: ISODate;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface Paginated<T> {
  items: T[];
  nextCursor: string | null;
  total: number;
}

export interface UpdateUserPayload {
  name?: string;
  bio?: string;
  avatarUrl?: string;
}

export interface CreateBucketListPayload {
  title: string;
  description?: string;
  visibility?: Visibility;
  category?: string;
}
