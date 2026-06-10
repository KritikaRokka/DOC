/* ═══════════════════════════════════════════════════════
   DOS CURAÇAO — Navigation: mobile menu toggle
═══════════════════════════════════════════════════════ */
(function () {
  const burger = document.getElementById('navBurger');
  const panel = document.getElementById('navMobile');
  if (!burger || !panel) return;

  function setOpen(open) {
    burger.classList.toggle('open', open);
    panel.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }

  burger.addEventListener('click', () => setOpen(!panel.classList.contains('open')));
  // close after choosing a destination
  panel.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setOpen(false)));
  // close on resize to desktop
  window.addEventListener('resize', () => { if (window.innerWidth >= 768) setOpen(false); });
})();

/* scroll progress bar */
(function () {
  const bar = document.getElementById('scrollProg');
  if (!bar) return;
  let ticking = false;
  function update() {
    const h = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (h > 0 ? (window.scrollY / h) * 100 : 0) + '%';
    ticking = false;
  }
  window.addEventListener('scroll', () => { if (!ticking) { requestAnimationFrame(update); ticking = true; } }, { passive: true });
  update();
})();

/* closing CTA reveal */
(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (typeof gsap === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);
  const card = document.querySelector('.site-cta-card');
  if (!card) return;
  gsap.from('.site-cta-card', { opacity: 0, y: 50, scale: 0.97, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: '.site-cta', start: 'top 80%' } });
  gsap.from('.site-cta-card .relative > *', { opacity: 0, y: 26, duration: 0.7, stagger: 0.1, ease: 'power3.out', scrollTrigger: { trigger: '.site-cta', start: 'top 72%' } });
})();
