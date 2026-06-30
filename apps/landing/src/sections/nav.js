/** Toggle the nav's frosted background once the user scrolls past the hero top. */
export function initNav() {
  const nav = document.querySelector('[data-nav]');
  if (!nav) return;

  const onScroll = () => {
    nav.classList.toggle('is-scrolled', window.scrollY > 24);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}
