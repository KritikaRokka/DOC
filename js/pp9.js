/* ═══════════════════════════════════════════════════════
   DOS CURAÇAO — PP-9  ·  SCHOOL ECOSYSTEM EXPANSION
   Strategic vision — from attendance to workforce platform
═══════════════════════════════════════════════════════ */

gsap.registerPlugin(ScrollTrigger);

(function () {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const section = document.querySelector('.pp9');
  if (!section) return;

  if (reduceMotion) {
    gsap.set('.pp9-head > *, .pp9-phase, .pp9-today, .pp9-cap, .pp9-connector-line, .pp9-connector-arrow, .pp9-xcard, .pp9-banner, .pp9-final', { opacity: 1, y: 0, scaleY: 1 });
    return;
  }

  /* header */
  gsap.from('.pp9-head > *', { opacity: 0, y: 30, duration: 0.8, stagger: 0.12, ease: 'power3.out', scrollTrigger: { trigger: '.pp9-head', start: 'top 82%' } });

  /* TODAY — card appears first, then capabilities, then the connector grows down */
  const today = gsap.timeline({ scrollTrigger: { trigger: '.pp9-today', start: 'top 80%' } });
  today.from('.pp9-phase:not(.pp9-phase--next)', { opacity: 0, y: 16, duration: 0.5, ease: 'power2.out' })
       .from('.pp9-today', { opacity: 0, y: 34, scale: 0.97, duration: 0.8, ease: 'power3.out' }, '-=0.2')
       .from('.pp9-cap', { opacity: 0, y: 18, duration: 0.5, stagger: 0.08, ease: 'power2.out' }, '-=0.35')
       .from('.pp9-connector-line', { scaleY: 0, transformOrigin: 'top center', duration: 0.5, ease: 'power2.inOut' }, '+=0.05')
       .from('.pp9-connector-arrow', { opacity: 0, scale: 0, y: -8, duration: 0.4, ease: 'back.out(2)' }, '-=0.1');

  /* TOMORROW — phase label, then expansion cards reveal one by one */
  gsap.from('.pp9-phase--next', { opacity: 0, y: 16, duration: 0.5, ease: 'power2.out', scrollTrigger: { trigger: '.pp9-phase--next', start: 'top 88%' } });
  gsap.from('.pp9-xcard', { opacity: 0, y: 30, duration: 0.6, stagger: 0.1, ease: 'power3.out', scrollTrigger: { trigger: '.pp9-xgrid', start: 'top 80%' } });

  /* bottom platform banner fades in last */
  gsap.from('.pp9-banner', { opacity: 0, y: 40, scale: 0.98, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: '.pp9-banner', start: 'top 84%' } });
  gsap.from('.pp9-banner-eyebrow, .pp9-banner-title, .pp9-banner-sub', { opacity: 0, y: 22, duration: 0.7, stagger: 0.12, ease: 'power3.out', scrollTrigger: { trigger: '.pp9-banner', start: 'top 76%' } });
  gsap.from('.pp9-final', { opacity: 0, y: 16, duration: 0.7, ease: 'power2.out', scrollTrigger: { trigger: '.pp9-final', start: 'top 92%' } });

  /* parallax */
  const pScroll = { trigger: '.pp9', start: 'top bottom', end: 'bottom top', scrub: 1 };
  gsap.to('.pp9 .blob--blue',   { y: 80,  ease: 'none', scrollTrigger: pScroll });
  gsap.to('.pp9 .blob--yellow', { y: -60, ease: 'none', scrollTrigger: { ...pScroll, scrub: 1.4 } });
})();
