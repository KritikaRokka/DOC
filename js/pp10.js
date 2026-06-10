/* ═══════════════════════════════════════════════════════
   DOS CURAÇAO — PP-10  ·  REAL-TIME DATA FLOW
   Live system architecture — one tap travels every layer
═══════════════════════════════════════════════════════ */

gsap.registerPlugin(ScrollTrigger);

(function () {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const section = document.querySelector('.pp10');
  if (!section) return;

  const flow = section.querySelector('.pp10-flow');
  const lanes = gsap.utils.toArray('.pp10-lane');

  function runCounters() {
    section.querySelectorAll('.pp10-count[data-target]').forEach((el) => {
      const target = +el.dataset.target;
      gsap.fromTo(el, { innerText: 0 }, {
        innerText: target, duration: 1.6, ease: 'power1.out', snap: { innerText: 1 },
        onUpdate: function () { el.innerText = Math.round(el.innerText).toLocaleString(); }
      });
    });
  }

  if (reduceMotion) {
    gsap.set('.pp10-head > *, .pp10-tele, .pp10-video, .pp10-lane, .pp10-transition', { opacity: 1, y: 0 });
    gsap.set('.pp10-spine-fill', { height: '100%' });
    lanes.forEach((l) => l.classList.add('active'));
    runCounters();
    return;
  }

  /* reveals */
  gsap.from('.pp10-head > *', { opacity: 0, y: 30, duration: 0.8, stagger: 0.12, ease: 'power3.out', scrollTrigger: { trigger: '.pp10-head', start: 'top 82%' } });
  gsap.from('.pp10-tele', { opacity: 0, y: 22, duration: 0.6, stagger: 0.08, ease: 'power3.out', scrollTrigger: { trigger: '.pp10-telemetry', start: 'top 88%', onEnter: runCounters } });
  gsap.from('.pp10-video', { opacity: 0, y: 38, scale: 0.97, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: '.pp10-video', start: 'top 80%' } });
  gsap.from('.pp10-lane', { opacity: 0, x: -24, duration: 0.6, stagger: 0.1, ease: 'power3.out', scrollTrigger: { trigger: '.pp10-flow', start: 'top 82%' } });
  gsap.from('.pp10-transition', { opacity: 0, y: 16, duration: 0.7, ease: 'power2.out', scrollTrigger: { trigger: '.pp10-transition', start: 'top 92%' } });

  /* ── Real-time sync pulse travels the pipeline (loops in view) ── */
  const DUR = 5;
  function buildFlow() {
    lanes.forEach((l) => l.classList.remove('active'));
    const H = flow.clientHeight;
    const topY = 30, botY = Math.max(topY + 1, H - 30);

    const tl = gsap.timeline();
    tl.fromTo('.pp10-spine-fill', { height: '0%' }, { height: '100%', duration: DUR, ease: 'none' }, 0)
      .fromTo('.pp10-spine-pulse', { top: topY, opacity: 0 }, { opacity: 1, duration: 0.2 }, 0)
      .to('.pp10-spine-pulse', { top: botY, duration: DUR, ease: 'none' }, 0)
      .to('.pp10-spine-pulse', { opacity: 0, duration: 0.3 }, DUR - 0.05);

    lanes.forEach((l) => {
      const center = l.offsetTop + l.offsetHeight / 2;
      const t = ((center - topY) / (botY - topY)) * DUR;
      tl.add(() => l.classList.add('active'), Math.max(0, Math.min(DUR, t)));
    });

    tl.to({}, { duration: 3 }); // hold fully-synced state before replay
    return tl;
  }

  let master = buildFlow();
  master.repeat(-1);
  master.pause();
  ScrollTrigger.create({
    trigger: '.pp10-flow', start: 'top 72%',
    onEnter: () => master.play(), onLeave: () => master.pause(),
    onEnterBack: () => master.play(), onLeaveBack: () => master.pause(),
  });

  /* rebuild timing if layout changes (e.g. orientation/resize) */
  let rT;
  window.addEventListener('resize', () => {
    clearTimeout(rT);
    rT = setTimeout(() => {
      const playing = master.isActive();
      master.kill();
      gsap.set('.pp10-spine-pulse', { clearProps: 'all' });
      master = buildFlow(); master.repeat(-1);
      if (playing) master.play(); else master.pause();
    }, 250);
  });

  /* play button — decorative until the Higgsfield video is dropped in */
  const play = section.querySelector('.pp10-play');
  if (play) play.addEventListener('click', () => gsap.fromTo(play, { scale: 0.9 }, { scale: 1, duration: 0.4, ease: 'back.out(3)' }));

  /* parallax */
  const pScroll = { trigger: '.pp10', start: 'top bottom', end: 'bottom top', scrub: 1 };
  gsap.to('.pp10 .blob--blue',   { y: 80,  ease: 'none', scrollTrigger: pScroll });
  gsap.to('.pp10 .blob--yellow', { y: -60, ease: 'none', scrollTrigger: { ...pScroll, scrub: 1.4 } });
})();
