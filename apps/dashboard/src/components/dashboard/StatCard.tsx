import { type LucideIcon } from 'lucide-react';
import { Card, cn } from '@bucketick/ui';

const tones = {
  pink: 'bg-soft-pink text-brand-pink',
  yellow: 'bg-soft-yellow text-[#9a6b00]',
  blue: 'bg-soft-blue text-brand-blue',
  purple: 'bg-soft-purple text-brand-purple',
} as const;

interface StatCardProps {
  label: string;
  value: string;
  delta?: string;
  icon: LucideIcon;
  tone: keyof typeof tones;
}

export function StatCard({ label, value, delta, icon: Icon, tone }: StatCardProps) {
  return (
    <Card className="p-5 transition-transform duration-200 hover:-translate-y-1 hover:shadow-soft-md">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-semibold text-content-muted">{label}</p>
          <p className="mt-1 text-3xl font-extrabold tracking-tight text-content">{value}</p>
        </div>
        <span className={cn('grid h-11 w-11 place-items-center rounded-xl', tones[tone])}>
          <Icon className="h-5 w-5" />
        </span>
      </div>
      {delta && <p className="mt-3 text-xs font-semibold text-emerald-500">{delta}</p>}
    </Card>
  );
}
