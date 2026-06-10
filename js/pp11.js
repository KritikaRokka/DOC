/* ═══════════════════════════════════════════════════════
   DOS CURAÇAO — PP-11  ·  THE DOS PLATFORM IN ACTION
   Product experience — teacher & administrator
═══════════════════════════════════════════════════════ */

gsap.registerPlugin(ScrollTrigger);

(function () {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const section = document.querySelector('.pp11');
  if (!section) return;

  function runCounters(root) {
    (root || section).querySelectorAll('.pp11-count[data-target]').forEach((el) => {
      const target = +el.dataset.target;
      gsap.fromTo(el, { innerText: 0 }, {
        innerText: target, duration: 1.5, ease: 'power1.out', snap: { innerText: 1 },
        onUpdate: function () { el.innerText = Math.round(el.innerText).toLocaleString(); }
      });
    });
  }

  if (reduceMotion) {
    gsap.set('.pp11-head > *, .pp11-card, .pp11-step, .pp11-benefit, .pp11-quality', { opacity: 1, x: 0, y: 0 });
    runCounters();
    return;
  }

  /* header */
  gsap.from('.pp11-head > *', { opacity: 0, y: 30, duration: 0.8, stagger: 0.12, ease: 'power3.out', scrollTrigger: { trigger: '.pp11-head', start: 'top 82%' } });

  /* phone card enters from left, dashboard card enters from right */
  gsap.from('.pp11-card--teacher', { opacity: 0, x: -60, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: '.pp11-grid', start: 'top 78%' } });
  gsap.from('.pp11-card--admin', { opacity: 0, x: 60, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: '.pp11-grid', start: 'top 78%' } });

  /* workflow steps reveal one by one inside each card */
  gsap.utils.toArray('.pp11-card').forEach((card) => {
    gsap.from(card.querySelectorAll('.pp11-step'), {
      opacity: 0, x: -16, duration: 0.5, stagger: 0.12, ease: 'power2.out',
      scrollTrigger: { trigger: card, start: 'top 70%' }
    });
  });

  /* mockup stats count up + dashboard bars grow when the cards appear */
  ScrollTrigger.create({ trigger: '.pp11-grid', start: 'top 72%', once: true, onEnter: () => runCounters(section.querySelector('.pp11-grid')) });
  gsap.from('.pp11-dbars span', { scaleY: 0, duration: 0.7, stagger: 0.06, ease: 'power2.out', scrollTrigger: { trigger: '.pp11-dash', start: 'top 80%' } });

  /* benefits reveal + statistics count up */
  gsap.from('.pp11-benefit', { opacity: 0, y: 28, duration: 0.6, stagger: 0.1, ease: 'power3.out', scrollTrigger: { trigger: '.pp11-benefits', start: 'top 85%', onEnter: () => runCounters(section.querySelector('.pp11-benefits')) } });
  gsap.from('.pp11-quality', { opacity: 0, y: 20, duration: 0.5, stagger: 0.08, ease: 'power2.out', scrollTrigger: { trigger: '.pp11-qualities', start: 'top 90%' } });

  /* parallax */
  const pScroll = { trigger: '.pp11', start: 'top bottom', end: 'bottom top', scrub: 1 };
  gsap.to('.pp11 .blob--blue',   { y: 80,  ease: 'none', scrollTrigger: pScroll });
  gsap.to('.pp11 .blob--yellow', { y: -60, ease: 'none', scrollTrigger: { ...pScroll, scrub: 1.4 } });
})();
