import { cva, type VariantProps } from 'class-variance-authority';
import { type HTMLAttributes } from 'react';
import { cn } from './lib/utils';

const badge = cva(
  'inline-flex items-center gap-1 rounded-pill px-2.5 py-0.5 text-xs font-bold whitespace-nowrap',
  {
    variants: {
      tone: {
        pink: 'bg-soft-pink text-brand-pink',
        yellow: 'bg-soft-yellow text-[#9a6b00]',
        blue: 'bg-soft-blue text-brand-blue',
        purple: 'bg-soft-purple text-brand-purple',
        neutral: 'bg-surface2 text-content-muted',
      },
    },
    defaultVariants: { tone: 'neutral' },
  },
);

export interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badge> {}

export function Badge({ className, tone, ...props }: BadgeProps) {
  return <span className={cn(badge({ tone }), className)} {...props} />;
}
