/* ═══════════════════════════════════════════════════════
   DOS CURAÇAO — PP-8  ·  PAYROLL PREPARATION (Automation)
   Watch attendance become payroll-ready, automatically
═══════════════════════════════════════════════════════ */

gsap.registerPlugin(ScrollTrigger);

(function () {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const section = document.querySelector('.pp8');
  if (!section) return;

  const stages = gsap.utils.toArray('.pp8-stage');
  const sohoChecks = gsap.utils.toArray('.pp8-sc-ic');

  function runCounters() {
    section.querySelectorAll('.pp8-count[data-target]').forEach((el) => {
      const target = +el.dataset.target;
      gsap.fromTo(el, { innerText: 0 }, {
        innerText: target, duration: 1.6, ease: 'power1.out', snap: { innerText: 1 },
        onUpdate: function () { el.innerText = Math.round(el.innerText).toLocaleString(); }
      });
    });
  }

  if (reduceMotion) {
    gsap.set('.pp8-head > *, .pp8-stage, .pp8-metric, .pp8-ba-card, .pp8-report, .pp8-soho, .pp8-transition', { opacity: 1, y: 0 });
    gsap.set('.pp8-pipe-fill', { width: '100%' });
    stages.forEach((s) => s.classList.add('active'));
    gsap.set('.pp8-stage-check, .pp8-sc-ic', { opacity: 1, scale: 1 });
    runCounters();
    return;
  }

  /* reveals */
  gsap.from('.pp8-head > *', { opacity: 0, y: 30, duration: 0.8, stagger: 0.12, ease: 'power3.out', scrollTrigger: { trigger: '.pp8-head', start: 'top 82%' } });
  gsap.from('.pp8-metric', { opacity: 0, y: 26, duration: 0.6, stagger: 0.08, ease: 'power3.out', scrollTrigger: { trigger: '.pp8-metrics', start: 'top 85%', onEnter: runCounters } });
  gsap.from('.pp8-ba-card', { opacity: 0, y: 30, duration: 0.7, stagger: 0.15, ease: 'power3.out', scrollTrigger: { trigger: '.pp8-ba', start: 'top 80%' } });
  gsap.from('.pp8-report, .pp8-soho', { opacity: 0, y: 30, duration: 0.7, stagger: 0.14, ease: 'power3.out', scrollTrigger: { trigger: '.pp8-out', start: 'top 80%' } });
  gsap.from('.pp8-rrow', { opacity: 0, x: -14, duration: 0.5, stagger: 0.08, ease: 'power2.out', scrollTrigger: { trigger: '.pp8-report-rows', start: 'top 88%' } });
  gsap.from('.pp8-transition', { opacity: 0, y: 16, duration: 0.7, ease: 'power2.out', scrollTrigger: { trigger: '.pp8-transition', start: 'top 92%' } });

  /* SOHO checks pop in sequence */
  ScrollTrigger.create({
    trigger: '.pp8-soho', start: 'top 78%', once: true,
    onEnter: () => gsap.to('.pp8-sc-ic', { opacity: 1, scale: 1, duration: 0.4, stagger: 0.25, ease: 'back.out(2)' })
  });

  /* ── Automation pipeline loop (~9s + hold, repeats while in view) ── */
  const DUR = 4.2;
  function buildPipe() {
    stages.forEach((s) => s.classList.remove('active'));
    gsap.set('.pp8-stage-check', { opacity: 0, scale: 0 });

    const tl = gsap.timeline();
    tl.fromTo('.pp8-pipe-fill', { width: '0%' }, { width: '100%', duration: DUR, ease: 'none' }, 0)
      .fromTo('.pp8-pipe-packet', { left: '9%', opacity: 0 }, { opacity: 1, duration: 0.2 }, 0)
      .to('.pp8-pipe-packet', { left: '91%', duration: DUR, ease: 'none' }, 0)
      .to('.pp8-pipe-packet', { opacity: 0, duration: 0.3 }, DUR - 0.1);

    stages.forEach((s, i) => {
      const t = 0.2 + i * (DUR / 5.2);
      tl.add(() => s.classList.add('active'), t);
      tl.to(s.querySelector('.pp8-stage-check'), { opacity: 1, scale: 1, duration: 0.4, ease: 'back.out(2.2)' }, t + 0.25);
    });

    tl.to({}, { duration: 4 });  // hold completed state before restart
    return tl;
  }

  const master = buildPipe();
  master.repeat(-1);
  master.pause();
  ScrollTrigger.create({
    trigger: '.pp8-pipe', start: 'top 72%',
    onEnter: () => master.play(), onLeave: () => master.pause(),
    onEnterBack: () => master.play(), onLeaveBack: () => master.pause(),
  });

  /* parallax */
  const pScroll = { trigger: '.pp8', start: 'top bottom', end: 'bottom top', scrub: 1 };
  gsap.to('.pp8 .blob--blue',   { y: 70,  ease: 'none', scrollTrigger: pScroll });
  gsap.to('.pp8 .blob--yellow', { y: -50, ease: 'none', scrollTrigger: { ...pScroll, scrub: 1.4 } });
})();
