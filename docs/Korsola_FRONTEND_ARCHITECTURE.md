# Frontend Architecture (based on Corsola)

Reference blueprint extracted from `Korsola/corsola-frontend`. Use this as the structure
for **Blissley**'s frontend. Replace `corsola`/`@corsola` with `blissley`/`@blissley` and
the `korsola.com` domains with Blissley's.

---

## 1. High-level shape

A **Turborepo monorepo** managed with **Bun**. Multiple deployable React apps share code
through internal `packages/*` workspaces. There is **one shared typed API client** that is
the single door to the Go backend.

```
blissley-frontend/                  (root workspace — Turborepo + Bun)
├── apps/
│   ├── dashboard/    Vite + React + TS  → the authenticated product (TanStack Query)
│   ├── landing/      Vite + React + TS  → public marketing site (GSAP / Lenis anims)
│   └── admin/        Vite + React + TS  → internal admin console
├── packages/
│   ├── api-client/   Typed HTTP client for the Go backend  (THE request layer)
│   ├── ui/           Shared shadcn/ui components
│   ├── tsconfig/     Shared TS base configs (base / vite / nextjs)
│   └── eslint-config/ Shared ESLint rules
├── package.json      workspaces: ["apps/*", "packages/*"]
├── turbo.json        task pipeline (dev/build/lint/test/clean)
├── bunfig.toml       linker = "hoisted"
├── docker-compose.yml  builds dashboard + landing nginx images
└── .env.example      VITE_* build-time vars
```

> Note: README mentions Next.js for landing, but the actual `landing` app is **Vite +
> React** like the others. All three apps are Vite SPAs. Keep them uniform.

---

## 2. Structure diagram

```
                         ┌──────────────────────────────┐
                         │      blissley-frontend         │
                         │   (Turborepo root, Bun ws)     │
                         └───────────────┬───────────────┘
                 ┌───────────────────────┼───────────────────────┐
                 ▼                       ▼                       ▼
          ┌────────────┐          ┌────────────┐          ┌────────────┐
          │ apps/      │          │ apps/      │          │ apps/      │
          │ dashboard  │          │ landing    │          │ admin      │
          │ (Vite SPA) │          │ (Vite SPA) │          │ (Vite SPA) │
          └─────┬──────┘          └─────┬──────┘          └─────┬──────┘
                │  imports               │                       │
                └──────────────┬─────────┴───────────┬───────────┘
                               ▼                     ▼
                     ┌───────────────────┐  ┌───────────────────┐
                     │ packages/api-client│  │ packages/ui        │
                     │ (typed Go client)  │  │ (shadcn components)│
                     └─────────┬─────────┘  └───────────────────┘
                               │ fetch + Bearer JWT
                               ▼
                     ┌───────────────────┐
                     │  Go backend :8090 │   (corsola-backend → blissley-backend)
                     │  /api/v1/...      │
                     └───────────────────┘

   shared by all apps:  packages/tsconfig (TS base)   packages/eslint-config
```

### Per-app internal layout (`apps/dashboard/src` — the richest example)

```
src/
├── main.tsx          entry — createRoot, posthog init, attribution capture
├── App.tsx           providers + router (QueryClientProvider, GoogleOAuth, Routes)
├── index.css         tailwind layer + CSS variables
├── pages/            route-level components (Auth, Generator, Video, Profile…)
│   └── settings/     nested route group
├── components/       feature-grouped UI
│   ├── ui/           shadcn primitives (button, dialog, …)
│   ├── auth/         ProtectedRoute, BillingGate, PostAuthLoader
│   ├── billing/      PastDueBanner, …
│   ├── canvas/  generator/  video/  marketingstudio/   (feature folders)
│   └── ...
├── hooks/            data + UI hooks (useProfile, useCredits, useAuth, use-toast)
├── store/            Zustand stores (authStore, canvasStore, videoStore, …)
├── lib/              pure helpers (apiErrors, analytics, s3Upload, urls, utils)
├── assets/
└── test/             vitest setup
```

`admin` and `landing` follow the same `pages / components / hooks / lib` convention.
`landing` adds `src/types/` and marketing-specific component folders; it has no `store/`.

---

## 3. Dependencies

### Root (dev only)
- `turbo` ^2.3 — task runner / build pipeline
- `typescript` ^5.8
- `packageManager: bun@1.3.13`, `engines.node >= 20`

### Shared across every app
| Concern | Library |
|---|---|
| Framework | `react` / `react-dom` ^18.3 |
| Build/dev | `vite` ^5.4 + `@vitejs/plugin-react-swc` |
| Routing | `react-router-dom` ^6.30 |
| Styling | `tailwindcss` ^3.4 + `tailwindcss-animate`, `tailwind-merge`, `clsx`, `class-variance-authority` |
| UI primitives | `@radix-ui/react-*` + shadcn (`components.json`) |
| Icons | `lucide-react` |
| Animation | `framer-motion` |
| Analytics | `posthog-js` |
| Lint | `eslint` ^9 + `typescript-eslint` + react-hooks/react-refresh plugins |

### Dashboard-only (the authenticated app)
- **`@tanstack/react-query` ^5.83** — server state / data fetching
- **`zustand` ^5** — client/UI state
- `@react-oauth/google` — Google sign-in
- `@xyflow/react` — node canvas (Spaces)
- `@dnd-kit/*` — drag & drop
- `react-hook-form`, `recharts`, `embla-carousel-react`, `cmdk`, `sonner`, `vaul`,
  `input-otp`, `react-resizable-panels`, `react-day-picker`, `next-themes`
- Test: `vitest`, `@testing-library/react`, `jsdom`

### Landing-only
- `gsap`, `lenis` (smooth scroll), `framer-motion` — marketing animations. No data layer.

### Admin
- Depends on `@corsola/api-client` (the shared client) + a lighter Radix/shadcn subset.

---

## 4. Backend → Frontend request flow (the important part)

**Everything funnels through `packages/api-client`.** Apps never call `fetch` directly for
backend data — they import the typed client and call namespaced methods through TanStack
Query hooks.

### 4.1 The client (`packages/api-client/index.ts`)

```ts
export const BASE_URL =
  import.meta.env?.VITE_API_URL || 'http://localhost:8090';   // Go backend

export const STORAGE_KEYS = {
  ACCESS_TOKEN:  'blissley:access_token',
  REFRESH_TOKEN: 'blissley:refresh_token',
  USER:          'blissley:user',
} as const;

// single request() primitive used by every domain method
export async function request<T>(method, path, body?, skipRefresh = false): Promise<T> {
  const accessToken = readToken(STORAGE_KEYS.ACCESS_TOKEN);
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json',
               ...(accessToken && { Authorization: `Bearer ${accessToken}` }) },
    credentials: 'include',
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    // 401 → try /api/v1/auth/refresh with refresh_token, retry once (skipRefresh)
    //       on failure: clear tokens, redirect to /auth
    // else → throw Error enriched with { status, errorCode, details, code, retryAfter }
  }
  const json = await res.json();
  return json?.data !== undefined ? json.data : json;   // unwrap { data: ... } envelope
}
```

Key conventions baked into this layer:
- **Auth:** JWT access token in `Authorization: Bearer`, stored in `localStorage` (JSON
  string under `blissley:access_token`). `credentials: 'include'` also sent.
- **Auto-refresh:** on `401`, it POSTs to `/api/v1/auth/refresh`, swaps tokens, retries the
  original request once. If refresh fails it clears storage and hard-redirects to `/auth`.
- **Response envelope:** backend returns `{ data: ... }`; client auto-unwraps `.data`.
- **Errors:** non-2xx throws an `Error` carrying `status`, `errorCode`, `details`, `code`,
  and `Retry-After`. `src/lib/*Errors.ts` (apiErrors, billingErrors, rateLimitErrors,
  moderationErrors, systemBusyErrors) map these to user-facing messages.
- **API versioning:** all paths are `/api/v1/...`.

### 4.2 Domain namespaces (default export)

The client groups endpoints into domains and exports one object:

```ts
const apiClient = {
  projects, imageGenerations, videoGenerations,
  msGenerations, msProducts, msProjects, msAvatars,
  uploads, moderation, spaces, auth, users, billing, admin,
  STORAGE_KEYS,
};
export default apiClient;
```

Each domain is a record of typed methods, e.g.:
```ts
export const auth = {
  login:    (email, password) => request('POST', '/api/v1/auth/login', { email, password }, true),
  refresh:  (rt) => request('POST', '/api/v1/auth/refresh', { refresh_token: rt }, true),
  logout:   (rt) => request('POST', '/api/v1/auth/logout', { refresh_token: rt }, true),
  // forgotPassword, resetPassword, verifyEmail, resendVerification, changePassword …
};
```
> Endpoints not yet built on the Go side return via a `stub()` helper (logs + resolves
> empty) so the frontend can be developed ahead of the backend. Swap `stub()` → `request()`
> as each Go route lands.

### 4.3 Consumption pattern (React)

Components never touch `apiClient` directly — they use a **hook per domain** built on
TanStack Query:

```ts
// hooks/useProfile.ts
import apiClient, { type UpdateUserPayload } from '@corsola/api-client';

export function useProfile() {
  const query = useQuery({
    queryKey: ['profile', 'me'],
    queryFn: () => apiClient.users.getMe(),
    staleTime: 5 * 60 * 1000,
  });
  const mutation = useMutation({
    mutationFn: (p: UpdateUserPayload) => apiClient.users.updateMe(p),
    onSuccess: (updated) => { qc.setQueryData(['profile','me'], updated); setUser(updated); },
  });
  return { profile: query.data, updateProfile: mutation.mutateAsync, /* … */ };
}
```

**Layering, top to bottom:**
```
Page/Component → domain hook (useProfile, useCredits…) → TanStack Query
   → apiClient.<domain>.<method>() → request() → fetch → Go :8090 /api/v1/*
```
`QueryClientProvider` wraps the app once in `App.tsx`. Client/UI state that isn't server
data lives in **Zustand** stores (`store/authStore.ts`, etc.).

---

## 5. Configuration & tooling

- **TS configs** are centralized in `packages/tsconfig`:
  - `base.json` — `target ES2022`, `strict`, `module esnext`, `moduleResolution bundler`,
    `isolatedModules`. Apps extend `vite.json` (`jsx: react-jsx`, `noEmit`).
  - Each app has `tsconfig.json` + `tsconfig.app.json` + `tsconfig.node.json`.
- **Path alias:** `@/* → ./src/*` (set in `vite.config.ts` and tsconfig paths).
- **shadcn:** `components.json` per app, aliases `@/components`, `@/lib/utils`, `@/components/ui`.
- **Vite dev server:** `host "::"`, dashboard on port 3000; `dedupe` react & react-query.
- **Turbo pipeline** (`turbo.json`): `dev` (persistent, no cache), `build`
  (`dependsOn ^build`, outputs `dist/**`), `lint`, `test`, `clean`.
- **Env vars** are `VITE_*` and **baked at build time** (Vite). Changing them requires a
  rebuild. Key ones: `VITE_API_URL`, `VITE_GOOGLE_CLIENT_ID`, `VITE_*_ASSETS_URL`,
  `VITE_POSTHOG_KEY/HOST`.

---

## 6. Build & deploy

- **Two deploy targets supported:**
  1. **Vercel** — each app has `vercel.json` (SPA rewrite `/(.*) → /index.html` + long
     cache headers for hashed assets / media).
  2. **Docker + nginx** — `docker-compose.yml` builds `apps/<app>/Dockerfile`
     (multi-stage: `oven/bun` build → `nginx:alpine` serving `dist/`). `nginx.conf` does
     SPA fallback + immutable caching of `/assets/`. Dashboard published on `:8080`,
     landing on `:8081` (loopback-bound, behind a reverse proxy on the EC2 box).
- Build args pass the `VITE_*` values into the image at build time.

---

## 7. Commands

```bash
bun install                              # install all workspaces

bun dev                                  # run all apps in parallel (turbo)
bun --filter @blissley/dashboard dev     # single app
bun --filter @blissley/landing dev

bun run build                            # build everything → apps/*/dist
bun run lint
bun run test                             # vitest (dashboard)
```

---

## 8. Checklist to replicate for Blissley

1. `package.json` workspaces `apps/*` + `packages/*`; `packageManager: bun@…`; turbo + ts as root devDeps.
2. `turbo.json`, `bunfig.toml` (`linker = "hoisted"`), `.env.example`, `docker-compose.yml`.
3. `packages/tsconfig` (base/vite), `packages/eslint-config`, `packages/ui`, `packages/api-client`.
4. `packages/api-client/index.ts`: `BASE_URL` from `VITE_API_URL`, `STORAGE_KEYS`,
   `request<T>()` with Bearer + 401-refresh + `{data}` unwrap, domain namespaces, default export.
5. Scaffold `apps/dashboard` (Vite + React + TS) with
   `src/{main.tsx, App.tsx, pages, components/ui, hooks, store, lib}`, TanStack Query +
   Zustand, `@/` alias, `components.json`, Dockerfile + nginx.conf + vercel.json.
6. Add `apps/landing` (marketing) and `apps/admin` (uses api-client) mirroring the same layout.
7. One domain hook per backend domain in `hooks/`, wrapping `apiClient.<domain>` in `useQuery`/`useMutation`.
