import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';

function BrandMark() {
  return (
    <span className="grid h-9 w-9 place-items-center rounded-xl bg-white/15 backdrop-blur-sm ring-1 ring-white/25">
      <Check className="h-5 w-5 text-white" strokeWidth={3} />
    </span>
  );
}

/**
 * The decorative half of the auth pages. A layered "climb to your dream" scene
 * built entirely from SVG in the Bucketick accent palette. Hidden on mobile,
 * where a slim brand header stands in for it.
 */
export function AuthArt({ title, tagline }: { title: string; tagline: string }) {
  return (
    <div className="relative hidden overflow-hidden bg-gradient-dusk p-12 text-white lg:flex lg:flex-col lg:justify-between">
      {/* Soft accent orbs for depth */}
      <div className="pointer-events-none absolute -right-20 -top-24 h-80 w-80 rounded-full bg-brand-yellow/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-16 h-80 w-80 rounded-full bg-brand-blue/40 blur-3xl" />

      {/* Brand */}
      <Link to="/" className="relative z-10 inline-flex items-center gap-2.5">
        <BrandMark />
        <span className="text-xl font-extrabold tracking-tight">Bucketick</span>
      </Link>

      {/* Illustration */}
      <div className="relative z-10 flex flex-1 items-center justify-center py-10">
        <svg viewBox="0 0 400 360" fill="none" className="w-full max-w-md drop-shadow-xl">
          <defs>
            <linearGradient id="bt-sun" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#ffd000" />
              <stop offset="1" stopColor="#ff7a00" />
            </linearGradient>
            <linearGradient id="bt-flag" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#ffbb00" />
              <stop offset="1" stopColor="#ff006e" />
            </linearGradient>
            <filter id="bt-card-shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow
                dx="0"
                dy="8"
                stdDeviation="10"
                floodColor="#0f0f12"
                floodOpacity="0.18"
              />
            </filter>
          </defs>

          {/* Sun */}
          <circle cx="300" cy="92" r="44" fill="url(#bt-sun)" />
          <circle cx="300" cy="92" r="56" fill="#ffffff" fillOpacity="0.12" />

          {/* Stars / sparkles */}
          <g fill="#ffffff">
            <circle cx="64" cy="58" r="3" />
            <circle cx="120" cy="38" r="2" />
            <circle cx="356" cy="168" r="2.5" />
            <circle cx="44" cy="150" r="2" />
            <circle cx="250" cy="48" r="2" />
          </g>
          <path
            d="M210 70 l4 9 9 4 -9 4 -4 9 -4 -9 -9 -4 9 -4z"
            fill="#ffffff"
            fillOpacity="0.85"
          />
          <path d="M348 92 l3 7 7 3 -7 3 -3 7 -3 -7 -7 -3 7 -3z" fill="#ffffff" fillOpacity="0.6" />

          {/* Back mountains */}
          <path d="M-10 320 L100 158 L210 320 Z" fill="#ffffff" fillOpacity="0.16" />
          <path d="M150 320 L262 138 L410 320 Z" fill="#ffffff" fillOpacity="0.12" />

          {/* Main mountain, two-tone for a folded look */}
          <path d="M40 322 L182 108 L182 322 Z" fill="#ffffff" fillOpacity="0.96" />
          <path d="M182 108 L330 322 L182 322 Z" fill="#ffffff" fillOpacity="0.72" />
          {/* Snow cap accent */}
          <path d="M182 108 L156 148 L170 142 L182 160 L196 140 L210 150 Z" fill="#ffe0ec" />

          {/* Winding trail */}
          <path
            d="M188 312 C150 280 226 246 184 214 C150 188 206 168 184 138"
            stroke="#ff006e"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray="1 11"
            opacity="0.85"
          />

          {/* Checkpoint pins along the trail */}
          <g>
            <circle cx="188" cy="312" r="12" fill="#ffffff" />
            <circle cx="188" cy="312" r="7" fill="#4d8bff" />
            <circle cx="184" cy="214" r="12" fill="#ffffff" />
            <circle cx="184" cy="214" r="7" fill="#ffbb00" />
          </g>

          {/* Summit flag */}
          <rect x="181" y="96" width="3.5" height="44" rx="1.75" fill="#8b3dff" />
          <path d="M184 98 L214 108 L184 120 Z" fill="url(#bt-flag)" />

          {/* Floating bucket-list card */}
          <g transform="rotate(-7 100 196)" filter="url(#bt-card-shadow)">
            <rect x="26" y="146" width="148" height="104" rx="18" fill="#ffffff" />
            <rect x="42" y="164" width="64" height="9" rx="4.5" fill="#ff006e" fillOpacity="0.85" />
            {/* row 1 - done */}
            <circle cx="50" cy="194" r="8" fill="#ff006e" />
            <path
              d="M46.5 194 l2.4 2.5 4.6 -5"
              stroke="#fff"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            <rect x="66" y="190" width="92" height="8" rx="4" fill="#e9e9ec" />
            {/* row 2 - done */}
            <circle cx="50" cy="218" r="8" fill="#4d8bff" />
            <path
              d="M46.5 218 l2.4 2.5 4.6 -5"
              stroke="#fff"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            <rect x="66" y="214" width="80" height="8" rx="4" fill="#e9e9ec" />
            {/* row 3 - pending */}
            <circle cx="50" cy="242" r="8" fill="none" stroke="#d6d6db" strokeWidth="2" />
            <rect x="66" y="238" width="70" height="8" rx="4" fill="#f4f4f5" />
          </g>
        </svg>
      </div>

      {/* Headline */}
      <div className="relative z-10 max-w-md">
        <h2 className="text-3xl font-extrabold leading-tight">{title}</h2>
        <p className="mt-2 text-white/80">{tagline}</p>
        <div className="mt-5 flex items-center gap-3 text-sm font-semibold text-white/75">
          <div className="flex -space-x-2">
            {['women/44', 'men/52', 'women/68', 'men/76'].map((p) => (
              <img
                key={p}
                src={`https://randomuser.me/api/portraits/${p}.jpg`}
                alt=""
                className="h-7 w-7 rounded-full ring-2 ring-brand-pink object-cover"
              />
            ))}
          </div>
          <span>Join 50,000+ dreamers already on the journey</span>
        </div>
      </div>
    </div>
  );
}
