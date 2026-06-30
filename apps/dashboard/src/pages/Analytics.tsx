import { ListChecks, CheckCircle2, Users, Star, TrendingUp, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, Skeleton } from '@bucketick/ui';
import { StatCard } from '@/components/dashboard/StatCard';
import { PageHeader } from '@/components/layout/PageHeader';
import { useAnalytics } from '@/hooks/queries';
import { compact } from '@/lib/format';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
const goalsPerMonth = [4, 7, 5, 9, 6, 11];
const followersTrend = [820, 910, 1010, 1090, 1180, 1284];
const categorySplit = [
  { label: 'Travel', value: 38, color: '#4d8bff' },
  { label: 'Fitness', value: 24, color: '#ff006e' },
  { label: 'Life', value: 21, color: '#8b3dff' },
  { label: 'Food', value: 17, color: '#ffbb00' },
];

function BarChart({ data, labels }: { data: number[]; labels: string[] }) {
  const max = Math.max(...data);
  return (
    <div className="flex h-44 items-end justify-between gap-2">
      {data.map((v, i) => (
        <div key={i} className="flex flex-1 flex-col items-center gap-2">
          <div className="flex w-full flex-1 items-end">
            <div
              className="w-full rounded-t-lg bg-gradient-dusk transition-all"
              style={{ height: `${(v / max) * 100}%` }}
              title={`${v} goals`}
            />
          </div>
          <span className="text-[11px] font-semibold text-content-muted">{labels[i]}</span>
        </div>
      ))}
    </div>
  );
}

function LineChart({ data }: { data: number[] }) {
  const w = 320;
  const h = 140;
  const pad = 6;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const span = max - min || 1;
  const pts = data.map((v, i) => {
    const x = pad + (i / (data.length - 1)) * (w - pad * 2);
    const y = h - pad - ((v - min) / span) * (h - pad * 2);
    return [x, y] as const;
  });
  const line = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0]},${p[1]}`).join(' ');
  const area = `${line} L${pts[pts.length - 1][0]},${h} L${pts[0][0]},${h} Z`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-44 w-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ff006e" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#ff006e" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#areaFill)" />
      <path
        d={line}
        fill="none"
        stroke="#ff006e"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {pts.map((p, i) => (
        <circle key={i} cx={p[0]} cy={p[1]} r="3" fill="#ff006e" />
      ))}
    </svg>
  );
}

function Donut({ data }: { data: typeof categorySplit }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  let offset = 0;
  const r = 54;
  const c = 2 * Math.PI * r;

  return (
    <div className="flex items-center gap-6">
      <svg viewBox="0 0 140 140" className="h-36 w-36 -rotate-90">
        {data.map((d) => {
          const len = (d.value / total) * c;
          const seg = (
            <circle
              key={d.label}
              cx="70"
              cy="70"
              r={r}
              fill="none"
              stroke={d.color}
              strokeWidth="16"
              strokeDasharray={`${len} ${c - len}`}
              strokeDashoffset={-offset}
            />
          );
          offset += len;
          return seg;
        })}
      </svg>
      <div className="space-y-2">
        {data.map((d) => (
          <div key={d.label} className="flex items-center gap-2 text-sm">
            <span className="h-3 w-3 rounded-sm" style={{ background: d.color }} />
            <span className="font-semibold text-content">{d.label}</span>
            <span className="text-content-muted">{d.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function Analytics() {
  const { data: stats, isLoading } = useAnalytics();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Analytics"
        subtitle="The numbers behind your dreaming. Mostly going up, which is the only direction that matters."
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {isLoading || !stats ? (
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

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="inline-flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-brand-purple" /> Goals completed
            </CardTitle>
            <span className="text-xs font-semibold text-content-muted">Last 6 months</span>
          </CardHeader>
          <CardContent>
            <BarChart data={goalsPerMonth} labels={MONTHS} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="inline-flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-brand-pink" /> Follower growth
            </CardTitle>
            <span className="text-xs font-semibold text-emerald-500">+56% YoY</span>
          </CardHeader>
          <CardContent>
            <LineChart data={followersTrend} />
            <div className="mt-2 flex justify-between text-[11px] font-semibold text-content-muted">
              {MONTHS.map((m) => (
                <span key={m}>{m}</span>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="inline-flex items-center gap-2">
              <ListChecks className="h-4 w-4 text-brand-blue" /> Goals by category
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Donut data={categorySplit} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="inline-flex items-center gap-2">
              <Eye className="h-4 w-4 text-brand-yellow" /> Top performing lists
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { title: 'Couch to first marathon', views: 48210, pct: 100 },
              { title: 'Things to do before 30', views: 31044, pct: 72 },
              { title: 'Japan, finally', views: 19877, pct: 46 },
              { title: 'Weekend microadventures', views: 8123, pct: 19 },
            ].map((row) => (
              <div key={row.title}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="truncate font-semibold text-content">{row.title}</span>
                  <span className="shrink-0 text-xs font-semibold text-content-muted">
                    {compact(row.views)} views
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-surface2">
                  <div
                    className="h-full rounded-full bg-gradient-sky"
                    style={{ width: `${row.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
