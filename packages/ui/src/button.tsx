import { cva, type VariantProps } from 'class-variance-authority';
import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from './lib/utils';

const button = cva(
  'inline-flex items-center justify-center gap-2 font-bold whitespace-nowrap rounded-button transition-all duration-150 ease-spring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-pink focus-visible:ring-offset-2 focus-visible:ring-offset-bg disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]',
  {
    variants: {
      variant: {
        primary: 'bg-brand-pink text-white hover:brightness-110 shadow-soft-sm',
        secondary: 'bg-surface2 text-content hover:bg-line',
        outline: 'border-2 border-line text-content hover:bg-surface2',
        ghost: 'text-content-muted hover:bg-surface2 hover:text-content',
        gradient: 'bg-gradient-sunrise text-white hover:brightness-105 shadow-soft-sm',
      },
      size: {
        sm: 'h-9 px-3 text-sm',
        md: 'h-11 px-5 text-sm',
        lg: 'h-12 px-6 text-base',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  },
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof button> {}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button ref={ref} className={cn(button({ variant, size }), className)} {...props} />
  ),
);
Button.displayName = 'Button';
