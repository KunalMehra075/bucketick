import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * Staggered fade/rise for every [data-reveal] element as it enters the viewport.
 * Falls back to a plain class toggle (via IntersectionObserver) when motion is
 * reduced, so content still appears without transforms.
 */
export function initReveals({ reduced = false } = {}) {
  const els = gsap.utils.toArray('[data-reveal]');
  if (!els.length) return;

  if (reduced) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -10% 0px' },
    );
    els.forEach((el) => io.observe(el));
    return;
  }

  ScrollTrigger.batch(els, {
    start: 'top 88%',
    onEnter: (batch) =>
      gsap.to(batch, {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: 'power3.out',
        stagger: 0.08,
        overwrite: true,
        onStart: () => batch.forEach((el) => el.classList.add('is-visible')),
      }),
  });
}
