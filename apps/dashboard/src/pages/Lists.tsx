import { useState } from 'react';
import { Plus, ListChecks, Search } from 'lucide-react';
import { Button, Skeleton } from '@bucketick/ui';
import { PageHeader } from '@/components/layout/PageHeader';
import { BucketListCard } from '@/components/dashboard/BucketListCard';
import { useMyLists } from '@/hooks/queries';

const FILTERS = ['All', 'In progress', 'Completed', 'Public', 'Private'] as const;
type Filter = (typeof FILTERS)[number];

export function Lists() {
  const { data, isLoading } = useMyLists();
  const [filter, setFilter] = useState<Filter>('All');
  const [q, setQ] = useState('');

  const lists = (data?.items ?? [])
    .filter((l) => l.title.toLowerCase().includes(q.toLowerCase()))
    .filter((l) => {
      if (filter === 'Public') return l.visibility === 'public';
      if (filter === 'Private') return l.visibility === 'private';
      if (filter === 'Completed') return l.itemsCount > 0 && l.completedCount === l.itemsCount;
      if (filter === 'In progress') return l.completedCount < l.itemsCount;
      return true;
    });

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Bucket Lists"
        subtitle="Every wild idea, half-plan, and someday-maybe in one place. The judgment-free zone for your ambitions."
        action={
          <Button>
            <Plus className="h-4 w-4" /> New bucket list
          </Button>
        }
      />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="scroll-slim flex gap-2 overflow-x-auto">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={
                'shrink-0 rounded-pill px-4 py-2 text-sm font-bold transition-colors ' +
                (filter === f
                  ? 'bg-content text-bg'
                  : 'bg-surface2 text-content-muted hover:text-content')
              }
            >
              {f}
            </button>
          ))}
        </div>

        <div className="relative w-full max-w-xs sm:w-auto">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-content-muted" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search your lists..."
            className="h-11 w-full rounded-pill border border-line bg-surface pl-9 pr-4 text-sm text-content placeholder:text-content-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-pink/40"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-64 rounded-card" />
          ))}
        </div>
      ) : lists.length ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {lists.map((l) => (
            <BucketListCard key={l.id} list={l} />
          ))}
        </div>
      ) : (
        <div className="grid place-items-center rounded-card border border-dashed border-line py-20 text-center">
          <span className="grid h-14 w-14 place-items-center rounded-2xl bg-soft-pink text-brand-pink">
            <ListChecks className="h-7 w-7" />
          </span>
          <p className="mt-4 font-bold text-content">Nothing matches that filter</p>
          <p className="mt-1 text-sm text-content-muted">
            Either clear the filter or go add a brand new dream. Both are valid.
          </p>
        </div>
      )}
    </div>
  );
}
