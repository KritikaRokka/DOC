/* ═══════════════════════════════════════════════════════
   DOS CURAÇAO — PP-12  ·  ROLLING OUT ACROSS CURAÇAO
   Island deployment journey — schools light up stage by stage
═══════════════════════════════════════════════════════ */

gsap.registerPlugin(ScrollTrigger);

(function () {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const section = document.querySelector('.pp12');
  if (!section) return;

  const stages = gsap.utils.toArray('.pp12-stage');
  const nodes = gsap.utils.toArray('.pp12-node');
  const counter = section.querySelector('.pp12-livecount .pp12-count');
  const cum = [4, 10, 18, 25];   // cumulative schools live per stage
  let cur = 1, auto = null, userTook = false;

  function lightMap(s) {
    nodes.forEach((n) => n.classList.toggle('lit', +n.dataset.stage <= s));
  }
  function setCount(s) {
    const target = cum[s - 1];
    if (reduceMotion) { counter.innerText = target; return; }
    gsap.fromTo(counter, { innerText: +counter.innerText || 0 }, {
      innerText: target, duration: 0.8, ease: 'power1.out', snap: { innerText: 1 },
      onUpdate: function () { counter.innerText = Math.round(counter.innerText); }
    });
  }
  function setStage(s) {
    cur = s;
    stages.forEach((st) => st.classList.toggle('selected', +st.dataset.stage === s));
    lightMap(s);
    setCount(s);
    if (!reduceMotion) {
      const active = stages.find((st) => +st.dataset.stage === s);
      gsap.fromTo(active.querySelector('.pp12-stage-detail').children,
        { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.4, stagger: 0.08, ease: 'power2.out' });
    }
  }
  function stopAuto() { if (auto) { clearInterval(auto); auto = null; } }

  stages.forEach((st) => st.addEventListener('click', () => { userTook = true; stopAuto(); setStage(+st.dataset.stage); }));

  if (reduceMotion) {
    gsap.set('.pp12-head > *, .pp12-journey, .pp12-batable, .pp12-ba-head, .pp12-supcard', { opacity: 1, x: 0, y: 0 });
    setStage(1);
    return;
  }

  /* reveals */
  gsap.from('.pp12-head > *', { opacity: 0, y: 30, duration: 0.8, stagger: 0.12, ease: 'power3.out', scrollTrigger: { trigger: '.pp12-head', start: 'top 82%' } });
  gsap.from('.pp12-mapcard', { opacity: 0, x: -34, duration: 0.85, ease: 'power3.out', scrollTrigger: { trigger: '.pp12-journey', start: 'top 78%' } });
  gsap.from('.pp12-stage', { opacity: 0, x: 30, duration: 0.6, stagger: 0.1, ease: 'power3.out', scrollTrigger: { trigger: '.pp12-stages', start: 'top 82%' } });
  gsap.from('.pp12-barow', { opacity: 0, y: 16, duration: 0.5, stagger: 0.07, ease: 'power2.out', scrollTrigger: { trigger: '.pp12-batable', start: 'top 86%' } });
  gsap.from('.pp12-supcard', { opacity: 0, y: 28, duration: 0.6, stagger: 0.12, ease: 'power3.out', scrollTrigger: { trigger: '.pp12-support', start: 'top 88%' } });

  /* kick off stage 1 + auto-advance the rollout while in view */
  ScrollTrigger.create({ trigger: '.pp12-journey', start: 'top 72%', once: true, onEnter: () => setStage(1) });
  ScrollTrigger.create({
    trigger: '.pp12-journey', start: 'top 60%', end: 'bottom 42%',
    onEnter: () => { if (!userTook && !auto) auto = setInterval(() => setStage(cur >= 4 ? 1 : cur + 1), 3600); },
    onLeave: stopAuto,
    onEnterBack: () => { if (!userTook && !auto) auto = setInterval(() => setStage(cur >= 4 ? 1 : cur + 1), 3600); },
    onLeaveBack: stopAuto,
  });

  /* parallax */
  const pScroll = { trigger: '.pp12', start: 'top bottom', end: 'bottom top', scrub: 1 };
  gsap.to('.pp12 .blob--blue',   { y: 80,  ease: 'none', scrollTrigger: pScroll });
  gsap.to('.pp12 .blob--yellow', { y: -60, ease: 'none', scrollTrigger: { ...pScroll, scrub: 1.4 } });
})();
