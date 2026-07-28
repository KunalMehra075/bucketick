import { Types } from 'mongoose';

/**
 * Keyset (cursor) pagination on (createdAt, _id) descending. Scales to large
 * collections because it never uses skip/offset. Every paginated endpoint uses
 * these helpers so the frontend sees one consistent contract.
 */

export const DEFAULT_PAGE = 12;
export const MAX_PAGE = 50;

export function pageLimit(raw?: unknown): number {
  const n = Number(raw);
  if (!Number.isFinite(n) || n <= 0) return DEFAULT_PAGE;
  return Math.min(Math.floor(n), MAX_PAGE);
}

export function encodeCursor(createdAt: Date, id: Types.ObjectId | string): string {
  return Buffer.from(`${createdAt.toISOString()}|${String(id)}`).toString('base64url');
}

export function decodeCursor(cursor?: string): { createdAt: Date; id: Types.ObjectId } | null {
  if (!cursor) return null;
  try {
    const [ts, id] = Buffer.from(cursor, 'base64url').toString('utf8').split('|');
    if (!ts || !id || !Types.ObjectId.isValid(id)) return null;
    const createdAt = new Date(ts);
    if (Number.isNaN(createdAt.getTime())) return null;
    return { createdAt, id: new Types.ObjectId(id) };
  } catch {
    return null;
  }
}

/** Mongo filter that selects rows strictly older than the cursor position. */
export function cursorFilter(cursor?: string): Record<string, unknown> {
  const c = decodeCursor(cursor);
  if (!c) return {};
  return {
    $or: [{ createdAt: { $lt: c.createdAt } }, { createdAt: c.createdAt, _id: { $lt: c.id } }],
  };
}

/** The sort every keyset query must use. */
export const KEYSET_SORT = { createdAt: -1, _id: -1 } as const;

/**
 * Split docs fetched with limit+1 into a page plus the next cursor.
 * Docs must already be sorted by KEYSET_SORT.
 */
export function buildPage<T extends { _id: Types.ObjectId; createdAt?: Date }>(
  docs: T[],
  limit: number
): { pageDocs: T[]; nextCursor: string | null } {
  const hasMore = docs.length > limit;
  const pageDocs = hasMore ? docs.slice(0, limit) : docs;
  const last = pageDocs[pageDocs.length - 1];
  const nextCursor = hasMore && last?.createdAt ? encodeCursor(last.createdAt, last._id) : null;
  return { pageDocs, nextCursor };
}
