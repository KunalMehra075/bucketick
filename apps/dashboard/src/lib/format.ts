/** 1284 -> "1.3k", 1_200_000 -> "1.2M" */
export function compact(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
  if (n >= 1_000) return (n / 1_000).toFixed(1).replace(/\.0$/, '') + 'k';
  return String(n);
}

export function greeting(date = new Date()): string {
  const h = date.getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}

/** "3h ago", "2d ago" from an ISO date. */
export function timeAgo(iso: string, now = new Date()): string {
  const diff = (now.getTime() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return `${Math.floor(diff / 604800)}w ago`;
}

/** Gradient per category, used when a list has no cover image. */
export function categoryGradient(category: string | null): string {
  const map: Record<string, string> = {
    Travel: 'var(--bt-gradient-sky)',
    Life: 'var(--bt-gradient-dusk)',
    Fitness: 'var(--bt-gradient-sunrise)',
  };
  return (category && map[category]) || 'var(--bt-gradient-brand)';
}
