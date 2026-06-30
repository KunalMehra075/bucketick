import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';
import { AuthArt } from './AuthArt';

/**
 * Split-screen auth shell: SVG art on the left half (desktop), form on the right.
 * On mobile the art collapses to a slim gradient brand header so the form stays
 * front and center.
 */
export function AuthLayout({
  children,
  artTitle,
  artTagline,
}: {
  children: ReactNode;
  artTitle: string;
  artTagline: string;
}) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <AuthArt title={artTitle} tagline={artTagline} />

      <div className="flex min-h-screen flex-col bg-bg">
        {/* Mobile brand header */}
        <Link
          to="/"
          className="flex items-center gap-2.5 bg-gradient-dusk px-5 py-4 text-white lg:hidden"
        >
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-white/15 ring-1 ring-white/25">
            <Check className="h-4 w-4" strokeWidth={3} />
          </span>
          <span className="text-lg font-extrabold tracking-tight">Bucketick</span>
        </Link>

        <div className="flex flex-1 items-center justify-center px-5 py-10 sm:px-10">
          <div className="w-full max-w-sm">{children}</div>
        </div>
      </div>
    </div>
  );
}
