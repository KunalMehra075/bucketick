# Frontend Architecture & Design System

## Design Philosophy

Bucketick is not a productivity application.

It is a premium social platform where people collect dreams, achieve goals together, preserve memories, and inspire others.

The UI should feel emotional, colorful, modern, premium, playful, and delightful.

Every interaction should encourage exploration and make users excited to return.

The visual language should be consistent across the Landing Page, User Dashboard, Admin Dashboard, and Mobile App.

Avoid generic SaaS dashboards or corporate-looking interfaces.

---

# Brand Personality

The experience should feel like a combination of:

* Apple-level polish
* Pinterest-style inspiration
* Duolingo's playfulness
* Linear's smooth animations
* Airbnb's clean layouts

The interface should immediately communicate:

* Dreams
* Adventures
* Memories
* Community
* Achievements
* Positivity

---

# Color System

## Primary Brand Colors

Brand Yellow

```css
#ffbb00
```

Brand Pink

```css
#ff006e
```

Brand Orange

```css
oklch(0.69 0.25 38.09)
```

Brand Blue

```css
oklch(0.64 0.21 255.09)
```

---

## Neutral Colors

White

Light Gray

Gray-100

Gray-200

Gray-300

Gray-500

Gray-700

Gray-900

Backgrounds should primarily use

* White
* Soft gray
* Very subtle gradients
* Glass effects only where appropriate

Accent colors should only be used for important interactions and should never overwhelm the interface.

---

# Typography

Primary Font

Manrope

Fallback

sans-serif

Typography should feel rounded, modern, clean, and friendly.

Font hierarchy

* Large Hero Titles
* Bold Section Titles
* Comfortable Paragraphs
* Clear UI Labels

Use generous spacing between headings and content.

---

# Border Radius

Buttons

16px

Cards

24px

Dialogs

24px

Inputs

14px

Avatars

Fully rounded

Pills

999px

Avoid sharp corners.

---

# Shadows

Use soft layered shadows.

Cards should appear slightly elevated.

Avoid heavy material-style shadows.

---

# Icons

Rounded

Minimal

Consistent stroke width

Modern

---

# Motion Design

Animations should communicate delight rather than decoration.

Use

* Spring animations
* Smooth fades
* Scale transitions
* Shared element transitions
* Blur reveals
* Floating objects
* Smooth page transitions
* Hover animations
* Scroll-based storytelling

Animations should never reduce usability.

---

# Frontend Architecture

The project is divided into four frontend applications.

---

## 1. Landing Website

Purpose

Marketing website for Bucketick.

Technology

* Vite
* Vanilla HTML
* Vanilla CSS
* Vanilla JavaScript (ES Modules)

Animation Libraries

* GSAP
* ScrollTrigger
* Lenis
* SplitType
* Swiper (when needed)

No React should be used for the landing website.

The landing page should remain lightweight, highly optimized, and handcrafted for maximum animation flexibility.

---

Landing Page Goals

Create an emotional first impression.

Convince visitors to download Bucketick.

Showcase community achievements.

Tell a visual story through animations.

---

Landing Page Sections

Navigation

Hero

Features

How It Works

Community Showcase

Scrubbed Bento Gallery

Statistics

Achievements

Testimonials

FAQ

Download App

Footer

---

Hero Section

Large animated headline

Gradient backgrounds

Floating bucket list cards

Animated phone mockups

Floating achievement badges

Interactive CTA buttons

---

Features Section

Animated feature cards

Scroll reveals

Parallax elements

Interactive illustrations

---

How It Works

Timeline animation

Step-by-step illustrations

Scroll storytelling

---

Community Showcase

Featured bucket lists

Popular users

Trending achievements

Animated cards

---

Scrubbed Bento Gallery

One of the signature sections.

Requirements

* GSAP ScrollTrigger
* Pinned scrolling
* Scroll scrubbing
* Bento grid layout
* Large real-world imagery
* Independent image movement
* Blur transitions
* Scale animations
* Mask reveals
* Layered parallax
* Smooth interpolation

The gallery should feel cinematic.

---

Statistics Section

Animated counters

Floating graphs

Achievement badges

Progress animations

---

Testimonials

Stacking cards

Infinite marquee

Auto animations

Smooth transitions

---

Download Section

Animated phones

App Store buttons

Google Play buttons

Gradient backgrounds

Floating UI cards

---

Landing Page Performance

Lighthouse score above 95

Optimized assets

Lazy-loaded images

Modern image formats

Minimal layout shift

Deferred JavaScript

Code splitting where appropriate

Animation performance should remain smooth on mid-range mobile devices.

---

## 2. User Dashboard

Technology

* React
* Vite
* TypeScript
* TailwindCSS
* ShadCN UI
* TanStack Query
* React Router
* Framer Motion
* Zustand
* React Hook Form
* Zod

Do not use default ShadCN styling.

Every component must be customized to match Bucketick's design language.

---

Dashboard Pages

Dashboard

My Bucket Lists

Explore

Saved

Followers

Following

Notifications

Messages

Achievements

Analytics

Settings

Premium

---

Dashboard Design

Large cards

Rounded layouts

Premium spacing

Beautiful empty states

Soft gradients

Interactive hover effects

Responsive design

Fast transitions

Optimistic UI updates

---

## 3. Admin Dashboard

Technology

* React
* Vite
* TypeScript
* TailwindCSS
* ShadCN UI
* Framer Motion
* TanStack Query

All ShadCN components should be customized.

---

Admin Features

Dashboard

Users

Reports

Moderation

Categories

Achievements

Analytics

Push Notifications

Feature Flags

Settings

Revenue

Audit Logs

---

Admin Design

Professional

Minimal

Fast

Data-focused

Powerful filtering

Beautiful charts

Dark mode

Responsive tables

---

## 4. Mobile Application

Technology

* React Native
* Expo
* TypeScript
* NativeWind
* React Navigation
* Zustand
* TanStack Query
* React Hook Form

The mobile application should use the same design system as the web applications.

---

# Shared Design System

Create a reusable component library.

Components include

Buttons

Cards

Goal Cards

Bucket List Cards

Profile Cards

Achievement Badges

Avatar Groups

Progress Indicators

Comment Cards

Dialogs

Inputs

Selects

Dropdowns

Bottom Sheets

Tabs

Navigation

Timeline Components

Gallery Components

Statistics Cards

Charts

Skeleton Loaders

Empty States

Toasts

Modals

Every component should be reusable and consistent across all platforms.

---

# User Experience Principles

Every screen should answer one question:

"What makes users want to come back tomorrow?"

The product should encourage:

* Creating dreams
* Sharing memories
* Tracking progress
* Collaborating with others
* Celebrating achievements
* Discovering inspiration

The experience should feel joyful, rewarding, and emotionally engaging.

---

# Performance Standards

Fast initial load

Instant navigation

Code splitting

Lazy loading

Image optimization

Optimistic updates

API caching

Virtualized lists

Offline-friendly architecture

Responsive on all screen sizes

Accessibility-first implementation

---

# Development Standards

* Use clean, modular architecture.
* Follow feature-based folder structure.
* Write reusable components.
* Maintain strict TypeScript typing.
* Follow SOLID principles where applicable.
* Use consistent naming conventions.
* Ensure high testability.
* Optimize for scalability as the user base grows.

The codebase should be production-ready, maintainable, and easy for multiple developers to work on over time.
