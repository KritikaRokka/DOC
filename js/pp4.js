/* ═══════════════════════════════════════════════════════
   DOS CURAÇAO — PP-4  ·  HOW IT WORKS
   Scroll storytelling: data moves through the platform
═══════════════════════════════════════════════════════ */

gsap.registerPlugin(ScrollTrigger);

(function () {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const section = document.querySelector('.pp4');
  if (!section) return;

  const stages = gsap.utils.toArray('.pp4-stage');

  if (reduceMotion) {
    gsap.set('.pp4-head > *, .pp4-media, .pp4-stage, .pp4-step', { opacity: 1, y: 0, scale: 1 });
    gsap.set('.pp4-track-fill', { width: '100%' });
    gsap.set('.pp4-confirm', { opacity: 1, y: 0, scale: 1 });
    stages.forEach((s) => s.classList.add('active'));
    runPp4Counters();
    return;
  }

  /* ── Header ── */
  gsap.from('.pp4-head > *', {
    opacity: 0, y: 30, duration: 0.8, stagger: 0.12, ease: 'power3.out',
    scrollTrigger: { trigger: '.pp4-head', start: 'top 82%' }
  });

  /* ── Big media area ── */
  gsap.from('.pp4-media', {
    opacity: 0, y: 40, scale: 0.98, duration: 1, ease: 'power3.out',
    scrollTrigger: { trigger: '.pp4-media', start: 'top 78%' }
  });

  /* ── Journey: plays the workflow when it enters view ── */
  const DUR = 3.2;
  function buildJourney() {
    const jt = gsap.timeline();
    jt.fromTo('.pp4-track-fill', { width: '0%' }, { width: '100%', duration: DUR, ease: 'none' }, 0)
      .fromTo('.pp4-packet', { left: '6%', opacity: 0 }, { opacity: 1, duration: 0.2 }, 0)
      .to('.pp4-packet', { left: '94%', duration: DUR, ease: 'none' }, 0)
      .to('.pp4-packet', { opacity: 0, duration: 0.3 }, DUR - 0.2);

    // stages activate in sequence as the data reaches them
    stages.forEach((s, i) => {
      jt.call(() => s.classList.add('active'), null, 0.15 + i * (DUR / 6));
    });

    // confirmation cards pop progressively (cloud → dashboard → payroll)
    const pops = [
      ['.pp4-confirm-1', DUR * (3 / 6)],   // Identity Verified  (cloud)
      ['.pp4-confirm-2', DUR * (4 / 6)],   // Attendance Recorded
      ['.pp4-confirm-3', DUR * (4.7 / 6)], // Dashboard Updated
      ['.pp4-confirm-4', DUR * (5.6 / 6)], // Payroll Ready
    ];
    pops.forEach(([sel, t]) => {
      jt.fromTo(sel, { opacity: 0, y: 10, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: 'back.out(1.7)' }, t);
    });
    return jt;
  }

  let journey;
  ScrollTrigger.create({
    trigger: '.pp4-journey', start: 'top 72%', once: true,
    onEnter: () => { journey = buildJourney(); }
  });

  /* ── Replay on play-button click ── */
  const playBtn = section.querySelector('.pp4-play');
  if (playBtn) {
    playBtn.addEventListener('click', () => {
      stages.forEach((s) => s.classList.remove('active'));
      gsap.set('.pp4-confirm', { opacity: 0 });
      journey = buildJourney();
    });
  }

  /* ── 7 step cards ── */
  gsap.from('.pp4-step', {
    opacity: 0, y: 30, duration: 0.6, stagger: 0.1, ease: 'power3.out',
    scrollTrigger: { trigger: '.pp4-steps', start: 'top 82%', onEnter: runPp4Counters }
  });

  /* ── Parallax ── */
  const pScroll = { trigger: '.pp4', start: 'top bottom', end: 'bottom top', scrub: 1 };
  gsap.to('.pp4 .blob--blue',   { y: 70,  ease: 'none', scrollTrigger: pScroll });
  gsap.to('.pp4 .blob--yellow', { y: -50, ease: 'none', scrollTrigger: { ...pScroll, scrub: 1.4 } });

  /* ── Journey stages drift on scroll (smooth wave parallax) ── */
  const jScroll = { trigger: '.pp4-journey', start: 'top bottom', end: 'bottom top', scrub: 1.1 };
  stages.forEach((s, i) => {
    const dir = i % 2 === 0 ? -1 : 1;          // alternate up / down for a wave
    gsap.fromTo(s,
      { y: dir * -20 },
      { y: dir * 20, ease: 'none', scrollTrigger: jScroll }
    );
  });
})();

/* ── Counters ── */
let pp4Counted = false;
function runPp4Counters() {
  if (pp4Counted) return;
  pp4Counted = true;
  document.querySelectorAll('.pp4 [data-target]').forEach((el) => {
    const target = +el.dataset.target;
    gsap.fromTo(el, { innerText: 0 }, {
      innerText: target, duration: 1.3, ease: 'power1.out',
      snap: { innerText: 1 },
      onUpdate: function () { el.innerText = Math.round(el.innerText); }
    });
  });
}
