import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

function format(value) {
  if (value >= 1_000_000) return (value / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
  if (value >= 1_000) return Math.round(value / 1_000) + 'k';
  return String(Math.round(value));
}

/** Animated counters that tick up to their target when scrolled into view. */
export function initStats({ reduced = false } = {}) {
  const nums = gsap.utils.toArray('[data-count]');
  if (!nums.length) return;

  nums.forEach((el) => {
    const target = Number(el.getAttribute('data-count')) || 0;
    const suffix = el.getAttribute('data-suffix') || '';

    if (reduced) {
      el.textContent = format(target) + suffix;
      return;
    }

    const counter = { v: 0 };
    gsap.to(counter, {
      v: target,
      duration: 1.6,
      ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      onUpdate: () => {
        el.textContent = format(counter.v) + suffix;
      },
    });
  });

  ScrollTrigger.refresh();
}
