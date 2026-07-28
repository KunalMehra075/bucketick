import { Types } from 'mongoose';
import { Item } from '../models/Item';
import { List } from '../models/List';
import { User } from '../models/User';
import { Post } from '../models/Post';
import { pointsFor } from '../types';
import type { ListCounts } from './serialize';

/** Recompute a user's denormalized counters from their lists, items, and posts. */
export async function recomputeUserStats(userId: string | Types.ObjectId): Promise<void> {
  const owner = new Types.ObjectId(String(userId));
  const [listsCount, completedCount, inProgressCount, postsCount] = await Promise.all([
    List.countDocuments({ owner }),
    Item.countDocuments({ owner, status: 'completed' }),
    Item.countDocuments({ owner, status: 'in_progress' }),
    Post.countDocuments({ author: owner }),
  ]);
  await User.updateOne(
    { _id: owner },
    {
      $set: { listsCount, completedCount, postsCount, points: pointsFor(completedCount, inProgressCount) },
    }
  );
}

/** Item counts grouped per list, for a set of list ids. */
export async function countsByList(listIds: Types.ObjectId[]): Promise<Map<string, ListCounts>> {
  const map = new Map<string, ListCounts>();
  listIds.forEach((id) => map.set(String(id), { itemsCount: 0, completedCount: 0, inProgressCount: 0 }));
  if (listIds.length === 0) return map;

  const rows = await Item.aggregate<{
    _id: Types.ObjectId;
    itemsCount: number;
    completedCount: number;
    inProgressCount: number;
  }>([
    { $match: { list: { $in: listIds } } },
    {
      $group: {
        _id: '$list',
        itemsCount: { $sum: 1 },
        completedCount: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } },
        inProgressCount: { $sum: { $cond: [{ $eq: ['$status', 'in_progress'] }, 1, 0] } },
      },
    },
  ]);

  rows.forEach((r) => {
    map.set(String(r._id), {
      itemsCount: r.itemsCount,
      completedCount: r.completedCount,
      inProgressCount: r.inProgressCount,
    });
  });
  return map;
}

export async function countsForList(listId: Types.ObjectId): Promise<ListCounts> {
  const map = await countsByList([listId]);
  return map.get(String(listId)) ?? { itemsCount: 0, completedCount: 0, inProgressCount: 0 };
}
