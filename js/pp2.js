/* ═══════════════════════════════════════════════════════
   DOS CURAÇAO — PP-2  ·  THE CHALLENGE
   Scroll storytelling: problem → transformation → solution
═══════════════════════════════════════════════════════ */

gsap.registerPlugin(ScrollTrigger);

(function () {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const section = document.querySelector('.pp2');
  if (!section) return;

  if (reduceMotion) {
    gsap.set('.pp2-head > *, .pp2-today, .pp2-future, .pp2-old-item, .pp2-new-item, .pp2-core, .pp2-float, .pp2-metric', { opacity: 1, x: 0, y: 0, scale: 1 });
    runPp2Counters();
    return;
  }

  /* ── Header ── */
  gsap.from('.pp2-head > *', {
    opacity: 0, y: 30, duration: 0.8, stagger: 0.12, ease: 'power3.out',
    scrollTrigger: { trigger: '.pp2-head', start: 'top 80%' }
  });

  /* ── Cards slide in from their sides ── */
  gsap.from('.pp2-today', {
    opacity: 0, x: -50, duration: 0.9, ease: 'power3.out',
    scrollTrigger: { trigger: '.pp2-grid', start: 'top 72%' }
  });
  gsap.from('.pp2-future', {
    opacity: 0, x: 50, duration: 0.9, ease: 'power3.out',
    scrollTrigger: { trigger: '.pp2-grid', start: 'top 72%' }
  });

  /* ── Problems reveal first (the pain) ── */
  gsap.from('.pp2-old-item', {
    opacity: 0, x: -20, duration: 0.6, stagger: 0.12, ease: 'power2.out',
    scrollTrigger: { trigger: '.pp2-today', start: 'top 65%' }
  });

  /* ── Transformation core pops, then solutions counter-reveal ── */
  gsap.from('.pp2-core', {
    opacity: 0, scale: 0, duration: 0.7, ease: 'back.out(2)',
    scrollTrigger: { trigger: '.pp2-grid', start: 'top 58%' }
  });

  gsap.from('.pp2-new-item', {
    opacity: 0, x: 20, duration: 0.6, stagger: 0.12, delay: 0.5, ease: 'power2.out',
    scrollTrigger: { trigger: '.pp2-future', start: 'top 65%' }
  });

  /* ── Floating live cards (opacity-only; CSS handles idle bob) ── */
  gsap.from('.pp2-float-payroll', {
    opacity: 0, duration: 0.6, delay: 0.9, ease: 'power2.out',
    scrollTrigger: { trigger: '.pp2-grid', start: 'top 60%' }
  });
  gsap.from('.pp2-float-hours', {
    opacity: 0, duration: 0.6, delay: 1.1, ease: 'power2.out',
    scrollTrigger: { trigger: '.pp2-grid', start: 'top 60%' }
  });

  /* ── Outcome metrics + counters ── */
  gsap.from('.pp2-metric', {
    opacity: 0, y: 30, duration: 0.7, stagger: 0.12, ease: 'power3.out',
    scrollTrigger: { trigger: '.pp2-metrics', start: 'top 82%', onEnter: runPp2Counters }
  });

  /* ── Parallax depth (blobs only — floats keep CSS bob) ── */
  const pScroll = { trigger: '.pp2', start: 'top bottom', end: 'bottom top', scrub: 1 };
  gsap.to('.pp2 .blob--yellow', { y: -60, ease: 'none', scrollTrigger: pScroll });
  gsap.to('.pp2 .blob--blue',   { y: 70,  ease: 'none', scrollTrigger: { ...pScroll, scrub: 1.4 } });
})();

/* ── Counters (all data-target in PP-2) ── */
let pp2Counted = false;
function runPp2Counters() {
  if (pp2Counted) return;
  pp2Counted = true;
  document.querySelectorAll('.pp2 [data-target]').forEach((el) => {
    const target = +el.dataset.target;
    gsap.fromTo(el, { innerText: 0 }, {
      innerText: target, duration: 1.4, ease: 'power1.out',
      snap: { innerText: 1 },
      onUpdate: function () { el.innerText = Math.round(el.innerText); }
    });
  });
}
