/** Shared enums, kept in sync with the mobile app's src/types.ts. */

export const BRAND_COLORS = ['yellow', 'pink', 'orange', 'blue', 'purple'] as const;
export type BrandColor = (typeof BRAND_COLORS)[number];

export const VISIBILITIES = ['public', 'private'] as const;
export type Visibility = (typeof VISIBILITIES)[number];

export const ITEM_STATUSES = ['dreaming', 'in_progress', 'completed'] as const;
export type ItemStatus = (typeof ITEM_STATUSES)[number];

export const CATEGORIES = [
  'Travel',
  'Adventure',
  'Skills',
  'Fitness',
  'Food',
  'Creative',
  'Career',
  'Everyday',
] as const;

/** Points formula, shared so leaderboard math matches everywhere. */
export function pointsFor(completed: number, inProgress: number): number {
  return completed * 50 + inProgress * 15;
}
