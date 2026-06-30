import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from './lib/utils';

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        'h-11 w-full rounded-input border-2 border-line bg-surface px-3.5 text-sm text-content placeholder:text-content-muted transition-colors focus-visible:outline-none focus-visible:border-brand-pink',
        className,
      )}
      {...props}
    />
  ),
);
Input.displayName = 'Input';
