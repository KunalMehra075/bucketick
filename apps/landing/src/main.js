import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { initSmoothScroll } from './lib/smooth-scroll.js';
import { initReveals } from './lib/reveal.js';
import { initNav } from './sections/nav.js';
import { initHero } from './sections/hero.js';
import { initTimeline } from './sections/timeline.js';
import { initGallery } from './sections/gallery.js';
import { initStats } from './sections/stats.js';
import { initMarquee } from './sections/marquee.js';

gsap.registerPlugin(ScrollTrigger);

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function boot() {
  initNav();

  // Reveals run for everyone; they degrade to a simple fade with reduced motion.
  initReveals({ reduced: prefersReducedMotion });

  if (prefersReducedMotion) {
    // Skip the heavy scroll-driven choreography. Show final states immediately.
    initStats({ reduced: true });
    return;
  }

  const lenis = initSmoothScroll();
  // Keep ScrollTrigger in sync with Lenis' virtual scroll position.
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  initHero();
  initTimeline();
  initGallery();
  initStats({ reduced: false });
  initMarquee();

  // Recalculate once fonts/images settle to avoid trigger drift.
  window.addEventListener('load', () => ScrollTrigger.refresh());
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
