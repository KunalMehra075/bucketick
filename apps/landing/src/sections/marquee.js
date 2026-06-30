import gsap from 'gsap';

/** Infinite testimonial marquee. Duplicates the track and loops seamlessly. */
export function initMarquee() {
  const track = document.querySelector('[data-marquee-track]');
  if (!track) return;

  // Clone children once so the loop has no visible seam.
  const originals = Array.from(track.children);
  originals.forEach((node) => track.appendChild(node.cloneNode(true)));

  const distance = track.scrollWidth / 2;
  const loop = gsap.to(track, {
    x: -distance,
    duration: 32,
    ease: 'none',
    repeat: -1,
  });

  // Slow down (don't stop) on hover so it feels alive but readable.
  track.addEventListener('mouseenter', () => gsap.to(loop, { timeScale: 0.25, duration: 0.4 }));
  track.addEventListener('mouseleave', () => gsap.to(loop, { timeScale: 1, duration: 0.4 }));
}
