import { Types } from 'mongoose';
import { Hype } from '../models/Hype';
import { Bookmark } from '../models/Bookmark';
import { PostDoc } from '../models/Post';
import { UserDoc } from '../models/User';
import { serializePost } from './serialize';

/** Which of these posts has the given user hyped / bookmarked? */
export async function postFlags(
  userId: string,
  postIds: Types.ObjectId[]
): Promise<{ hyped: Set<string>; bookmarked: Set<string> }> {
  if (postIds.length === 0) return { hyped: new Set(), bookmarked: new Set() };
  const [hypes, bookmarks] = await Promise.all([
    Hype.find({ user: userId, post: { $in: postIds } }).select('post'),
    Bookmark.find({ user: userId, post: { $in: postIds } }).select('post'),
  ]);
  return {
    hyped: new Set(hypes.map((h) => String(h.post))),
    bookmarked: new Set(bookmarks.map((b) => String(b.post))),
  };
}

/**
 * Serialize a page of posts for the current user. Each post must have its
 * `author` populated (`.populate('author')`).
 */
export async function serializePostPage(posts: PostDoc[], meId: string) {
  const ids = posts.map((p) => p._id as Types.ObjectId);
  const { hyped, bookmarked } = await postFlags(meId, ids);
  return posts.map((p) =>
    serializePost(p, p.author as unknown as UserDoc, {
      hypedByMe: hyped.has(String(p._id)),
      bookmarkedByMe: bookmarked.has(String(p._id)),
    })
  );
}
