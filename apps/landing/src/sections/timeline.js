import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/** How It Works: steps slide in and the numbers pop as the section scrolls in. */
export function initTimeline() {
  const steps = gsap.utils.toArray('[data-step]');
  if (!steps.length) return;

  steps.forEach((step, i) => {
    gsap.from(step, {
      opacity: 0,
      y: 40,
      duration: 0.7,
      ease: 'power3.out',
      scrollTrigger: { trigger: step, start: 'top 85%' },
      delay: i * 0.05,
    });

    const num = step.querySelector('.timeline__num');
    if (num) {
      gsap.from(num, {
        scale: 0,
        rotation: -30,
        duration: 0.6,
        ease: 'back.out(2)',
        scrollTrigger: { trigger: step, start: 'top 82%' },
      });
    }
  });

  ScrollTrigger.refresh();
}
