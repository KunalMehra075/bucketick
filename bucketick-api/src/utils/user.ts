import { User } from '../models/User';
import { BRAND_COLORS, BrandColor } from '../types';

/** Deterministic accent from a name, so a person keeps their color. */
export function pickAvatarColor(seed: string): BrandColor {
  const base = (seed.trim()[0] ?? 'a').toLowerCase().charCodeAt(0);
  return BRAND_COLORS[base % BRAND_COLORS.length];
}

/** Build a unique, url-safe username from a name or email local part. */
export async function makeUniqueUsername(source: string): Promise<string> {
  const root =
    source
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '')
      .slice(0, 16) || 'dreamer';

  let candidate = root;
  let suffix = 0;
  // Loop until we find a free one. Small number of iterations in practice.
  // eslint-disable-next-line no-await-in-loop
  while (await User.exists({ username: candidate })) {
    suffix += 1;
    candidate = `${root}${suffix}`.slice(0, 20);
  }
  return candidate;
}
