import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Bell,
  CheckCircle2,
  ListChecks,
  Lock,
  Plus,
  Star,
  Trophy,
  Users,
} from 'lucide-react';
import {
  Avatar,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Progress,
  Skeleton,
} from '@bucketick/ui';
import { StatCard } from '@/components/dashboard/StatCard';
import { BucketListCard } from '@/components/dashboard/BucketListCard';
import {
  useAchievements,
  useAnalytics,
  useMyLists,
  useNotifications,
  useProfile,
} from '@/hooks/queries';
import { compact, greeting, timeAgo } from '@/lib/format';

export function Dashboard() {
  const { data: profile } = useProfile();
  const { data: stats, isLoading: statsLoading } = useAnalytics();
  const { data: lists, isLoading: listsLoading } = useMyLists();
  const { data: achievements } = useAchievements();
  const { data: notifications } = useNotifications();

  const firstName = (profile?.name ?? 'there').split(' ')[0];

  return (
    <div className="space-y-7">
      {/* Greeting */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-content md:text-3xl">
            {greeting()}, {firstName}
          </h1>
          <p className="mt-1 text-sm text-content-muted">
            You are 5 dreams away from your next badge. No pressure, but also: a little pressure.
          </p>
          <div className="mt-2 flex items-center gap-4 text-sm">
            <Link to="/followers" className="font-semibold text-content-muted hover:text-content">
              <span className="font-extrabold text-content">
                {compact(profile?.followersCount ?? 0)}
              </span>{' '}
              followers
            </Link>
            <Link to="/following" className="font-semibold text-content-muted hover:text-content">
              <span className="font-extrabold text-content">
                {compact(profile?.followingCount ?? 0)}
              </span>{' '}
              following
            </Link>
          </div>
        </div>
        <Button className="shrink-0">
          <Plus className="h-4 w-4" />
          New bucket list
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {statsLoading || !stats ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-[116px] rounded-card" />
          ))
        ) : (
          <>
            <StatCard
              label="Bucket lists"
              value={compact(stats.listsCreated)}
              icon={ListChecks}
              tone="pink"
              delta="+2 this month"
            />
            <StatCard
              label="Goals completed"
              value={compact(stats.goalsCompleted)}
              icon={CheckCircle2}
              tone="blue"
              delta="+8 this month"
            />
            <StatCard
              label="Followers"
              value={compact(stats.followers)}
              icon={Users}
              tone="purple"
              delta="+124 this week"
            />
            <StatCard
              label="Stars earned"
              value={compact(stats.starsReceived)}
              icon={Star}
              tone="yellow"
              delta="+312 this week"
            />
          </>
        )}
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Recent lists */}
        <section className="xl:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-bold text-content">Pick up where you left off</h2>
            <Link
              to="/lists"
              className="inline-flex items-center gap-1 text-sm font-semibold text-brand-pink hover:underline"
            >
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {listsLoading || !lists ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {Array.from({ length: 2 }).map((_, i) => (
                <Skeleton key={i} className="h-64 rounded-card" />
              ))}
            </div>
          ) : lists.items.length ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {lists.items.map((list) => (
                <BucketListCard key={list.id} list={list} />
              ))}
            </div>
          ) : (
            <Card className="grid place-items-center px-6 py-16 text-center">
              <span className="grid h-14 w-14 place-items-center rounded-2xl bg-soft-pink text-brand-pink">
                <ListChecks className="h-7 w-7" />
              </span>
              <p className="mt-4 font-bold text-content">No lists yet</p>
              <p className="mt-1 max-w-xs text-sm text-content-muted">
                Every great adventure starts with a slightly unrealistic list. Make yours.
              </p>
              <Button className="mt-5">
                <Plus className="h-4 w-4" /> Create your first list
              </Button>
            </Card>
          )}
        </section>

        {/* Side column */}
        <div className="space-y-6">
          {/* Achievements */}
          <Card>
            <CardHeader>
              <CardTitle className="inline-flex items-center gap-2">
                <Trophy className="h-4 w-4 text-brand-yellow" /> Achievements
              </CardTitle>
              <Link
                to="/achievements"
                className="text-sm font-semibold text-brand-pink hover:underline"
              >
                All
              </Link>
            </CardHeader>
            <CardContent className="space-y-4">
              {(achievements ?? []).slice(0, 3).map((a) => (
                <div key={a.id} className="flex items-center gap-3">
                  <span
                    className="grid h-10 w-10 shrink-0 place-items-center rounded-xl text-white"
                    style={{ background: a.unlockedAt ? a.iconColor : 'var(--bt-surface-2)' }}
                  >
                    {a.unlockedAt ? (
                      <Trophy className="h-5 w-5" />
                    ) : (
                      <Lock className="h-5 w-5 text-content-muted" />
                    )}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-content">{a.title}</p>
                    {a.unlockedAt ? (
                      <p className="text-xs text-content-muted">Unlocked</p>
                    ) : (
                      <Progress value={a.progress * 100} className="mt-1.5 h-1.5" />
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="inline-flex items-center gap-2">
                <Bell className="h-4 w-4 text-brand-blue" /> Recent activity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {(notifications ?? []).map((n) => (
                <div key={n.id} className="flex items-start gap-3">
                  <Avatar src={n.actor?.avatarUrl ?? undefined} name={n.actor?.name} size={36} />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm leading-snug text-content">
                      <span className="font-bold">{n.actor?.name}</span>{' '}
                      <span className="text-content-muted">{n.text}</span>
                    </p>
                    <p className="mt-0.5 text-xs text-content-muted">{timeAgo(n.createdAt)}</p>
                  </div>
                  {!n.read && (
                    <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-brand-pink" />
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
