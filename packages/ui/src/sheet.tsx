import { useEffect, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { cn } from './lib/utils';

interface SheetProps {
  open: boolean;
  onClose: () => void;
  side?: 'right' | 'left';
  /** Tailwind width class for the panel. */
  widthClassName?: string;
  title?: ReactNode;
  description?: ReactNode;
  /** Optional node rendered in the header, right of the title (before the close button). */
  headerAction?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
}

/**
 * Slide-in panel anchored to a screen edge. Portals to <body>, locks scroll,
 * and closes on Escape or overlay click. No external animation dep — pure CSS.
 */
export function Sheet({
  open,
  onClose,
  side = 'right',
  widthClassName = 'w-full max-w-md',
  title,
  description,
  headerAction,
  children,
  footer,
}: SheetProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  return createPortal(
    <div className={cn('fixed inset-0 z-[60]', !open && 'pointer-events-none')} aria-hidden={!open}>
      {/* Overlay */}
      <div
        onClick={onClose}
        className={cn(
          'absolute inset-0 bg-[var(--bt-overlay)] transition-opacity duration-300',
          open ? 'opacity-100' : 'opacity-0',
        )}
      />

      {/* Panel */}
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          'absolute inset-y-0 flex flex-col bg-surface shadow-soft-lg transition-transform duration-300 ease-smooth',
          widthClassName,
          side === 'right' ? 'right-0' : 'left-0',
          open ? 'translate-x-0' : side === 'right' ? 'translate-x-full' : '-translate-x-full',
        )}
      >
        {(title || description) && (
          <div className="flex items-start gap-3 border-b border-line px-5 py-4">
            <div className="min-w-0 flex-1">
              {title && <h2 className="text-lg font-extrabold text-content">{title}</h2>}
              {description && <p className="mt-0.5 text-sm text-content-muted">{description}</p>}
            </div>
            {headerAction}
            <button
              onClick={onClose}
              aria-label="Close"
              className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-content-muted hover:bg-surface2 hover:text-content"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        )}

        <div className="scroll-slim min-h-0 flex-1 overflow-y-auto">{children}</div>

        {footer && <div className="border-t border-line p-4">{footer}</div>}
      </div>
    </div>,
    document.body,
  );
}
