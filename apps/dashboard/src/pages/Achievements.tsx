import { Trophy, Lock } from 'lucide-react';
import type { Achievement } from '@bucketick/api-client';
import { Card, Progress, Skeleton, cn } from '@bucketick/ui';
import { PageHeader } from '@/components/layout/PageHeader';
import { useAchievements } from '@/hooks/queries';

function AchievementCard({ a }: { a: Achievement }) {
  const unlocked = !!a.unlockedAt;

  return (
    <Card
      className={cn(
        'flex flex-col items-center p-6 text-center transition-all duration-200 hover:-translate-y-1 hover:shadow-soft-md',
        !unlocked && 'opacity-90',
      )}
    >
      <span
        className="grid h-16 w-16 place-items-center rounded-2xl text-white shadow-soft-sm"
        style={{ background: unlocked ? a.iconColor : 'var(--bt-surface-2)' }}
      >
        {unlocked ? (
          <Trophy className="h-8 w-8" />
        ) : (
          <Lock className="h-8 w-8 text-content-muted" />
        )}
      </span>

      <p className="mt-4 font-extrabold text-content">{a.title}</p>
      <p className="mt-1 line-clamp-2 min-h-[2.5rem] text-xs text-content-muted">{a.description}</p>

      {unlocked ? (
        <span className="mt-3 rounded-pill bg-soft-yellow px-3 py-1 text-[11px] font-bold text-[#9a6b00]">
          Unlocked
        </span>
      ) : (
        <div className="mt-3 w-full">
          <Progress value={a.progress * 100} className="h-1.5" />
          <p className="mt-1.5 text-[11px] font-bold text-content-muted">
            {Math.round(a.progress * 100)}% there
          </p>
        </div>
      )}
    </Card>
  );
}

export function Achievements() {
  const { data: achievements, isLoading } = useAchievements();

  const unlocked = (achievements ?? []).filter((a) => a.unlockedAt).length;
  const total = achievements?.length ?? 0;
  const pct = total ? Math.round((unlocked / total) * 100) : 0;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Achievements"
        subtitle="Little gold stars for big stubborn dreams. Yes, they are pointless. No, that won't stop you collecting them."
      />

      {/* Summary banner */}
      <Card className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center">
        <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gradient-sunrise text-white">
          <Trophy className="h-7 w-7" />
        </span>
        <div className="flex-1">
          <p className="font-bold text-content">
            {unlocked} of {total} unlocked
          </p>
          <p className="text-sm text-content-muted">
            Keep going, the rare ones are the most fun to brag about.
          </p>
          <Progress value={pct} className="mt-3 h-2.5" />
        </div>
        <p className="text-3xl font-extrabold tracking-tight text-content">{pct}%</p>
      </Card>

      {isLoading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-56 rounded-card" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {(achievements ?? []).map((a) => (
            <AchievementCard key={a.id} a={a} />
          ))}
        </div>
      )}
    </div>
  );
}
