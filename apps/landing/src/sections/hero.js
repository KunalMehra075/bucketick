import gsap from 'gsap';

/**
 * Rotating word in the headline: "your friends" -> "your partner" -> "you",
 * looping forever. The inner column slides up one slot at a time; a clone of the
 * first word sits at the end so the wrap is seamless. Percentages are relative to
 * the inner height, so it stays correct at any font size.
 */
function initRotator() {
  const inner = document.querySelector('[data-rotator-inner]');
  if (!inner) return;
  const words = Array.from(inner.children);
  if (words.length < 2) return;

  inner.appendChild(words[0].cloneNode(true)); // seamless wrap
  const slots = words.length + 1;
  const step = 100 / slots;

  const tl = gsap.timeline({ repeat: -1, defaults: { duration: 0.65, ease: 'power3.inOut' } });
  for (let i = 1; i <= words.length; i++) {
    tl.to(inner, { yPercent: -step * i }, '+=1.5');
  }
  tl.set(inner, { yPercent: 0 });
}

/** Hero: headline lines rise in, decor pops in, everything floats gently. */
export function initHero() {
  const lines = gsap.utils.toArray('[data-hero-line]');
  if (lines.length) {
    gsap.from(lines, {
      yPercent: 60,
      opacity: 0,
      duration: 0.9,
      ease: 'power4.out',
      stagger: 0.12,
    });
  }

  initRotator();

  // The bucket-list items are intentionally static (no entrance, no drift).
  // Only the soft background blobs float.
  gsap.utils.toArray('[data-float]').forEach((el) => {
    const depth = Number(el.getAttribute('data-float')) || 1;
    gsap.to(el, {
      y: `+=${10 + depth * 6}`,
      x: `+=${depth * 3}`,
      rotation: depth % 2 ? 1.5 : -1.5,
      duration: 3 + depth * 0.6,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
      delay: 1.2,
    });
  });
}
