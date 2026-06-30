import { useState } from 'react';
import { Search, UserPlus } from 'lucide-react';
import { Skeleton } from '@bucketick/ui';
import { PageHeader } from '@/components/layout/PageHeader';
import { UserCard } from '@/components/social/UserCard';
import { useFollowing } from '@/hooks/queries';

export function Following() {
  const { data, isLoading } = useFollowing();
  const [q, setQ] = useState('');

  const people = (data?.items ?? [])
    .filter((u) => u.username !== 'kunal')
    .filter(
      (u) => u.name.toLowerCase().includes(q.toLowerCase()) || u.username.includes(q.toLowerCase()),
    );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Following"
        subtitle="Your personal highlight reel of people doing slightly more than you. Inspiration, mild guilt, both."
      />

      <div className="relative max-w-sm">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-content-muted" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search who you follow..."
          className="h-11 w-full rounded-pill border border-line bg-surface pl-9 pr-4 text-sm text-content placeholder:text-content-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-pink/40"
        />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-60 rounded-card" />
          ))}
        </div>
      ) : people.length ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
          {people.map((u) => (
            <UserCard key={u.id} user={u} initialFollowing />
          ))}
        </div>
      ) : (
        <div className="grid place-items-center rounded-card border border-dashed border-line py-20 text-center">
          <span className="grid h-14 w-14 place-items-center rounded-2xl bg-soft-pink text-brand-pink">
            <UserPlus className="h-7 w-7" />
          </span>
          <p className="mt-4 font-bold text-content">Not following anyone like that</p>
          <p className="mt-1 text-sm text-content-muted">
            Head to Explore and find some people worth following.
          </p>
        </div>
      )}
    </div>
  );
}
