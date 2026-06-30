import { useState } from 'react';
import { Search, Users } from 'lucide-react';
import { Skeleton } from '@bucketick/ui';
import { PageHeader } from '@/components/layout/PageHeader';
import { UserCard } from '@/components/social/UserCard';
import { useFollowers } from '@/hooks/queries';

export function Followers() {
  const { data, isLoading } = useFollowers();
  const [q, setQ] = useState('');

  const people = (data?.items ?? [])
    .filter((u) => u.username !== 'kunal')
    .filter(
      (u) => u.name.toLowerCase().includes(q.toLowerCase()) || u.username.includes(q.toLowerCase()),
    );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Followers"
        subtitle="The people who decided your dreams were worth watching. Try not to let it go to your head."
      />

      <div className="relative max-w-sm">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-content-muted" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search followers..."
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
          {people.map((u, i) => (
            <UserCard key={u.id} user={u} initialFollowing={i % 2 === 0} />
          ))}
        </div>
      ) : (
        <EmptyPeople />
      )}
    </div>
  );
}

function EmptyPeople() {
  return (
    <div className="grid place-items-center rounded-card border border-dashed border-line py-20 text-center">
      <span className="grid h-14 w-14 place-items-center rounded-2xl bg-soft-purple text-brand-purple">
        <Users className="h-7 w-7" />
      </span>
      <p className="mt-4 font-bold text-content">No one here</p>
      <p className="mt-1 text-sm text-content-muted">
        Nobody matches that search. Spelling is hard, it happens.
      </p>
    </div>
  );
}
