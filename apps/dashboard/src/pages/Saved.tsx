import { Link } from 'react-router-dom';
import { Bookmark, Compass } from 'lucide-react';
import { Button, Skeleton } from '@bucketick/ui';
import { PageHeader } from '@/components/layout/PageHeader';
import { BucketListCard } from '@/components/dashboard/BucketListCard';
import { useSavedLists } from '@/hooks/queries';

export function Saved() {
  const { data, isLoading } = useSavedLists();
  const lists = data?.items ?? [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Saved"
        subtitle="Other people's lists you bookmarked to revisit later. We both know later is a flexible concept."
      />

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
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
          <span className="grid h-14 w-14 place-items-center rounded-2xl bg-soft-yellow text-[#9a6b00]">
            <Bookmark className="h-7 w-7" />
          </span>
          <p className="mt-4 font-bold text-content">Nothing saved yet</p>
          <p className="mt-1 max-w-xs text-sm text-content-muted">
            Found a list that gave you ideas? Hit the bookmark and it lands here for safekeeping.
          </p>
          <Link to="/explore">
            <Button variant="outline" className="mt-5">
              <Compass className="h-4 w-4" /> Browse Explore
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
