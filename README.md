# Bucketick

A social platform where people collect dreams, chase goals together, preserve memories, and inspire each other. Not a to-do app. Not a habit tracker. A place where goals become journeys, journeys become memories, and memories inspire others.

This repo is a **Turborepo + Bun** monorepo holding every Bucketick frontend.

## Structure

```
bucketick/
├── apps/
│   ├── landing/    Marketing site — vanilla Vite (GSAP / Lenis / SplitType). No React.
│   ├── dashboard/  User dashboard — Vite + React + TS (Phase 2)
│   ├── mobile/     Mobile app — Expo + React Native (Phase 3)
│   └── admin/      Admin console — placeholder (deferred)
├── packages/
│   ├── design-tokens/  Single source of truth for the visual language
│   │                   (CSS variables + Tailwind preset + TS tokens)
│   ├── api-client/     Typed client to the backend. Stubbed until the API exists.
│   ├── ui/             Shared web components (customized shadcn) — Phase 2
│   ├── tsconfig/       Shared TypeScript configs
│   └── eslint-config/  Shared lint rules
```

## Why this shape

The landing page is intentionally **vanilla** — no framework tax, full control over the
scroll-driven cinematic animations, and a Lighthouse budget above 95. Everything else is
React (web) or React Native (mobile). They can't share rendered components across those
runtimes, so they share something better: one `design-tokens` package, so every surface
speaks the exact same visual language.

## Commands

```bash
bun install                          # install all workspaces
bun dev                              # run every app in parallel (turbo)
bun --filter @bucketick/landing dev  # run a single app
bun run build                        # build everything → apps/*/dist
bun run lint
```

## Design language

Brand: Yellow `#ffbb00`, Pink `#ff006e`, Orange/Blue accents. Nunito type, generous
spacing, soft layered shadows, rounded everything (no sharp corners), spring-y motion.
Tokens live in `packages/design-tokens` — change them there, not per app.
