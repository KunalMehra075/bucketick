import { Flame, Snowflake, Trophy, Target, Lock, Check, Calendar } from 'lucide-react';
import type { StreakSummary } from '@bucketick/api-client';
import { Card, CardContent, CardHeader, CardTitle, Progress, Skeleton, cn } from '@bucketick/ui';
import { PageHeader } from '@/components/layout/PageHeader';
import { useStreak } from '@/hooks/queries';

const intensityClass = [
  'bg-surface2',
  'bg-brand-pink/25',
  'bg-brand-pink/50',
  'bg-brand-pink/75',
  'bg-brand-pink',
];

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function Heatmap({ days }: { days: number[] }) {
  // Chunk the flat day array (oldest first) into weeks of 7 → one column per week.
  const weeks: number[][] = [];
  for (let i = 0; i < days.length; i += 7) weeks.push(days.slice(i, i + 7));

  return (
    <div className="flex gap-3">
      <div className="hidden flex-col justify-between py-[2px] text-[10px] font-semibold text-content-muted sm:flex">
        {WEEKDAYS.map((d, i) => (
          <span key={d} className={i % 2 === 0 ? 'h-3' : 'h-3 opacity-0'}>
            {i % 2 === 0 ? d : '·'}
          </span>
        ))}
      </div>
      <div className="scroll-slim flex gap-1 overflow-x-auto pb-1">
        {weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-1">
            {week.map((v, di) => (
              <span
                key={di}
                title={`${v} ${v === 1 ? 'activity' : 'activities'}`}
                className={cn('h-3 w-3 rounded-[3px]', intensityClass[v] ?? intensityClass[0])}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function HeroStat({
  icon: Icon,
  value,
  label,
  tone,
}: {
  icon: typeof Flame;
  value: string;
  label: string;
  tone: string;
}) {
  return (
    <Card className="p-5">
      <span className={cn('grid h-11 w-11 place-items-center rounded-xl', tone)}>
        <Icon className="h-5 w-5" />
      </span>
      <p className="mt-3 text-3xl font-extrabold tracking-tight text-content">{value}</p>
      <p className="text-sm font-semibold text-content-muted">{label}</p>
    </Card>
  );
}

function StreakContent({ streak }: { streak: StreakSummary }) {
  const weekPct = Math.round((streak.thisWeekDone / streak.weeklyGoal) * 100);

  return (
    <div className="space-y-6">
      {/* Big flame banner */}
      <Card className="overflow-hidden">
        <div className="relative flex flex-col items-center gap-4 bg-gradient-sunrise px-6 py-8 text-center text-white sm:flex-row sm:text-left">
          <div className="grid h-20 w-20 shrink-0 place-items-center rounded-full bg-white/20 backdrop-blur-sm">
            <Flame className="h-10 w-10 fill-white" />
          </div>
          <div className="flex-1">
            <p className="text-5xl font-extrabold leading-none">{streak.current}</p>
            <p className="mt-1 text-lg font-bold">day streak, and counting</p>
            <p className="mt-1 text-sm text-white/85">
              Show up tomorrow and it becomes {streak.current + 1}. Miss it and we both know how
              that feels.
            </p>
          </div>
        </div>
      </Card>

      {/* Stat row */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        <HeroStat
          icon={Flame}
          value={`${streak.current}`}
          label="Current streak"
          tone="bg-soft-pink text-brand-pink"
        />
        <HeroStat
          icon={Trophy}
          value={`${streak.longest}`}
          label="Longest streak"
          tone="bg-soft-yellow text-[#9a6b00]"
        />
        <HeroStat
          icon={Snowflake}
          value={`${streak.freezesAvailable}`}
          label="Freezes left"
          tone="bg-soft-blue text-brand-blue"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Heatmap */}
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle className="inline-flex items-center gap-2">
              <Calendar className="h-4 w-4 text-brand-pink" /> Last 18 weeks
            </CardTitle>
            <span className="text-xs font-semibold text-content-muted">Less &rarr; More</span>
          </CardHeader>
          <CardContent>
            <Heatmap days={streak.days} />
            <div className="mt-4 flex items-center gap-1.5">
              <span className="text-xs font-semibold text-content-muted">Intensity</span>
              {intensityClass.map((c, i) => (
                <span key={i} className={cn('h-3 w-3 rounded-[3px]', c)} />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Weekly goal */}
        <Card>
          <CardHeader>
            <CardTitle className="inline-flex items-center gap-2">
              <Target className="h-4 w-4 text-brand-blue" /> Weekly goal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-content-muted">
              You've checked in{' '}
              <span className="font-bold text-content">{streak.thisWeekDone}</span> of{' '}
              <span className="font-bold text-content">{streak.weeklyGoal}</span> days this week.
            </p>
            <Progress value={weekPct} className="mt-3 h-2.5" />
            <div className="mt-4 flex justify-between gap-1">
              {WEEKDAYS.map((d, i) => {
                const done = i < streak.thisWeekDone;
                return (
                  <div key={d} className="flex flex-col items-center gap-1.5">
                    <span
                      className={cn(
                        'grid h-8 w-8 place-items-center rounded-full text-xs font-bold',
                        done ? 'bg-brand-pink text-white' : 'bg-surface2 text-content-muted',
                      )}
                    >
                      {done ? <Check className="h-4 w-4" /> : d[0]}
                    </span>
                    <span className="text-[10px] font-semibold text-content-muted">{d}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Milestones */}
      <Card>
        <CardHeader>
          <CardTitle className="inline-flex items-center gap-2">
            <Trophy className="h-4 w-4 text-brand-yellow" /> Milestones
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {streak.milestones.map((m) => (
            <div
              key={m.days}
              className={cn(
                'flex items-center gap-3 rounded-2xl border p-4',
                m.reached ? 'border-brand-pink/30 bg-soft-pink/40' : 'border-line bg-surface',
              )}
            >
              <span
                className={cn(
                  'grid h-11 w-11 shrink-0 place-items-center rounded-xl text-white',
                  m.reached ? 'bg-gradient-sunrise' : 'bg-surface2',
                )}
              >
                {m.reached ? (
                  <Flame className="h-5 w-5" />
                ) : (
                  <Lock className="h-5 w-5 text-content-muted" />
                )}
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-content">{m.label}</p>
                <p className="text-xs text-content-muted">
                  {m.days} day{m.days > 1 ? 's' : ''} {m.reached ? '· unlocked' : '· locked'}
                </p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

export function Streaks() {
  const { data: streak, isLoading } = useStreak();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Streaks"
        subtitle="One small step toward a dream every day. The flame doesn't care how big the step is, only that you took it."
      />

      {isLoading || !streak ? (
        <div className="space-y-6">
          <Skeleton className="h-40 rounded-card" />
          <div className="grid grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-32 rounded-card" />
            ))}
          </div>
        </div>
      ) : (
        <StreakContent streak={streak} />
      )}
    </div>
  );
}
