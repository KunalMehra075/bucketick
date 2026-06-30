import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from './lib/utils';

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
}

/** Square icon-only button with an accessible label. */
export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, label, children, ...props }, ref) => (
    <button
      ref={ref}
      aria-label={label}
      title={label}
      className={cn(
        'inline-grid h-10 w-10 place-items-center rounded-xl text-content-muted transition-colors hover:bg-surface2 hover:text-content focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-pink',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  ),
);
IconButton.displayName = 'IconButton';
