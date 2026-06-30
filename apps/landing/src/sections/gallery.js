import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * Signature bento gallery: the section pins while the user scrolls and the tiles
 * assemble in a staggered 3D wave (rising, scaling up, un-tilting). Once settled,
 * each image keeps a slow cinematic parallax + Ken-Burns drift *inside* its own
 * tile, so depth reads without any tile ever overlapping its neighbours.
 */
export function initGallery() {
  const pin = document.querySelector('[data-gallery-pin]');
  const bento = document.querySelector('[data-bento]');
  if (!pin || !bento) return;

  const tiles = gsap.utils.toArray('.bento__tile');

  // Entry state: tucked down, scaled down, tilted back in 3D, invisible.
  tiles.forEach((tile) => {
    const img = tile.querySelector('img');
    gsap.set(tile, {
      autoAlpha: 0,
      scale: 0.78,
      yPercent: 22,
      rotateX: 14,
      transformOrigin: '50% 100%',
    });
    if (img) gsap.set(img, { scale: 1.35 });
  });

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: pin,
      start: 'top top',
      end: '+=160%',
      pin: true,
      scrub: 1,
      anticipatePin: 1,
    },
  });

  // 1) Assemble: a staggered wave drops the tiles into their grid cells.
  tl.to(
    tiles,
    {
      autoAlpha: 1,
      scale: 1,
      yPercent: 0,
      rotateX: 0,
      ease: 'power3.out',
      stagger: { each: 0.07, from: 'start' },
      duration: 1.1,
    },
    0,
  );

  // 2) Cinematic: each image settles its zoom and drifts at its own depth —
  //    all motion stays inside the tile's overflow box, so nothing collides.
  tiles.forEach((tile) => {
    const img = tile.querySelector('img');
    if (!img) return;
    const depth = Number(tile.getAttribute('data-parallax')) || 0;
    tl.to(img, { scale: 1.14, yPercent: depth * 26, ease: 'none' }, 0);
  });

  ScrollTrigger.refresh();
}
