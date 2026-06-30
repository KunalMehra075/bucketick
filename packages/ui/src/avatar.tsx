import { type ImgHTMLAttributes } from 'react';
import { cn } from './lib/utils';

interface AvatarProps extends ImgHTMLAttributes<HTMLImageElement> {
  size?: number;
  name?: string;
}

/** Rounded avatar. Falls back to initials on a brand tint when src is missing. */
export function Avatar({ src, name, size = 40, className, alt, ...props }: AvatarProps) {
  const initials = name
    ? name
        .split(' ')
        .map((p) => p[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : '';

  if (!src) {
    return (
      <span
        className={cn(
          'inline-grid place-items-center rounded-full bg-soft-pink font-bold text-brand-pink',
          className,
        )}
        style={{ width: size, height: size, fontSize: size * 0.36 }}
      >
        {initials}
      </span>
    );
  }

  return (
    <img
      src={src}
      alt={alt ?? name ?? ''}
      width={size}
      height={size}
      loading="lazy"
      decoding="async"
      className={cn('rounded-full object-cover', className)}
      style={{ width: size, height: size }}
      {...props}
    />
  );
}
