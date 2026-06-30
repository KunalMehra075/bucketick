import { Star, Users } from 'lucide-react';
import type { BucketListSummary } from '@bucketick/api-client';
import { Badge, Card, Progress } from '@bucketick/ui';
import { categoryGradient, compact } from '@/lib/format';

const toneByCategory: Record<string, 'blue' | 'purple' | 'yellow' | 'pink'> = {
  Travel: 'blue',
  Life: 'purple',
  Fitness: 'yellow',
};

export function BucketListCard({ list }: { list: BucketListSummary }) {
  const pct = list.itemsCount ? Math.round((list.completedCount / list.itemsCount) * 100) : 0;

  return (
    <Card className="group overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-soft-lg">
      <div className="relative h-28">
        {list.coverUrl ? (
          <img src={list.coverUrl} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="h-full w-full" style={{ background: categoryGradient(list.category) }} />
        )}
        {list.category && (
          <span className="absolute left-3 top-3">
            <Badge
              tone={toneByCategory[list.category] ?? 'neutral'}
              className="bg-white/90 backdrop-blur"
            >
              {list.category}
            </Badge>
          </span>
        )}
      </div>

      <div className="p-4">
        <h3 className="truncate text-base font-bold text-content">{list.title}</h3>
        <p className="mt-0.5 line-clamp-2 min-h-[2.5rem] text-sm text-content-muted">
          {list.description}
        </p>

        <div className="mt-3 flex items-center justify-between text-xs font-semibold text-content-muted">
          <span>
            {list.completedCount}/{list.itemsCount} done
          </span>
          <span>{pct}%</span>
        </div>
        <Progress value={pct} className="mt-1.5" />

        <div className="mt-3 flex items-center gap-4 text-xs font-semibold text-content-muted">
          <span className="inline-flex items-center gap-1">
            <Star className="h-3.5 w-3.5" /> {compact(list.starsCount)}
          </span>
          {list.collaborators.length > 0 && (
            <span className="inline-flex items-center gap-1">
              <Users className="h-3.5 w-3.5" /> {list.collaborators.length + 1}
            </span>
          )}
        </div>
      </div>
    </Card>
  );
}
