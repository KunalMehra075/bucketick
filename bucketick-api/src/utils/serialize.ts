import { UserDoc } from '../models/User';
import { ListDoc } from '../models/List';
import { ItemDoc } from '../models/Item';
import { PostDoc } from '../models/Post';
import { CommentDoc } from '../models/Comment';

export interface ListCounts {
  itemsCount: number;
  completedCount: number;
  inProgressCount: number;
}

/** The compact author/actor reference used on posts, comments, and explore items. */
export function authorRef(u: UserDoc) {
  return {
    id: String(u._id),
    username: u.username,
    name: u.name,
    avatarUrl: u.avatarUrl ?? null,
    avatarColor: u.avatarColor,
    verified: u.verified,
  };
}

export function serializeUser(u: UserDoc) {
  return {
    id: String(u._id),
    username: u.username,
    name: u.name,
    avatarColor: u.avatarColor,
    avatarUrl: u.avatarUrl ?? null,
    bio: u.bio ?? null,
    verified: u.verified,
    followersCount: u.followersCount,
    followingCount: u.followingCount,
    listsCount: u.listsCount,
    completedCount: u.completedCount,
    postsCount: u.postsCount,
    points: u.points,
  };
}

export function serializeList(l: ListDoc, counts: ListCounts) {
  return {
    id: String(l._id),
    title: l.title,
    description: l.description ?? null,
    visibility: l.visibility,
    category: l.category,
    accent: l.accent,
    coverUrl: l.coverUrl ?? null,
    createdAt: (l as unknown as { createdAt: Date }).createdAt.toISOString(),
    itemsCount: counts.itemsCount,
    completedCount: counts.completedCount,
    inProgressCount: counts.inProgressCount,
  };
}

export function serializeItem(i: ItemDoc) {
  return {
    id: String(i._id),
    listId: String(i.list),
    title: i.title,
    note: i.note ?? null,
    status: i.status,
    location: i.location ?? null,
    completedAt: i.completedAt ? i.completedAt.toISOString() : null,
  };
}

export interface PostFlags {
  hypedByMe: boolean;
  bookmarkedByMe: boolean;
}

/** `author` must be the populated User document for the post. */
export function serializePost(p: PostDoc, author: UserDoc, flags: PostFlags) {
  const ts = p as unknown as { createdAt: Date };
  return {
    id: String(p._id),
    author: authorRef(author),
    caption: p.caption,
    images: p.images ?? [],
    coverAspect: p.coverAspect ?? 1,
    achievement: p.achievement
      ? { kind: p.achievement.kind, refId: String(p.achievement.refId), title: p.achievement.title }
      : null,
    category: p.category,
    visibility: p.visibility,
    hypesCount: p.hypesCount,
    commentsCount: p.commentsCount,
    bookmarksCount: p.bookmarksCount,
    hypedByMe: flags.hypedByMe,
    bookmarkedByMe: flags.bookmarkedByMe,
    createdAt: ts.createdAt.toISOString(),
  };
}

/** Compact shape for the Explore masonry grid. */
export function serializeExploreItem(p: PostDoc, author: UserDoc) {
  return {
    id: String(p._id),
    thumbnailUrl: p.images?.[0] ?? '',
    aspect: p.coverAspect ?? 1,
    caption: p.caption,
    author: authorRef(author),
    hypesCount: p.hypesCount,
  };
}

export function serializeComment(c: CommentDoc, author: UserDoc) {
  const ts = c as unknown as { createdAt: Date };
  return {
    id: String(c._id),
    postId: String(c.post),
    author: authorRef(author),
    body: c.body,
    createdAt: ts.createdAt.toISOString(),
  };
}
