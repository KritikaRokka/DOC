/* ═══════════════════════════════════════════════════════
   DOS CURAÇAO — PP-5  ·  LATE ARRIVAL DETECTION (mission control)
   Watch a late arrival travel through the DOS ecosystem, live
═══════════════════════════════════════════════════════ */

gsap.registerPlugin(ScrollTrigger);

(function () {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const section = document.querySelector('.pp5');
  if (!section) return;

  const stage = section.querySelector('.pp5-mc');
  const clockMin = section.querySelector('.pp5-bigclock-min');
  const clock = section.querySelector('.pp5-bp-clock');
  const statusVal = section.querySelector('.pp5-status-val');
  const tlSteps = gsap.utils.toArray('.pp5-tl-step');
  const events = ['.pp5-ev-1', '.pp5-ev-2', '.pp5-ev-3', '.pp5-ev-4', '.pp5-ev-5'];
  const flowLines = ['#mc1', '#mc2', '#mc3', '#mc4', '#mc5'];
  const svg = section.querySelector('.pp5-mc-flow');

  /* fire a packet along a flow line (phone → event) */
  function firePacket(lineSel, color) {
    const path = section.querySelector(lineSel);
    if (!path || !svg) return;
    path.classList.add('lit');
    const c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    c.setAttribute('r', '4.5'); c.setAttribute('fill', color);
    svg.appendChild(c);
    const len = path.getTotalLength();
    const obj = { d: 0 };
    gsap.timeline({ onComplete: () => c.remove() })
      .set(c, { opacity: 0 })
      .to(c, { opacity: 1, duration: 0.2 })
      .to(obj, { d: len, duration: 1.3, ease: 'power1.inOut', onUpdate: () => {
        const p = path.getPointAtLength(obj.d); c.setAttribute('cx', p.x); c.setAttribute('cy', p.y);
      } }, '<')
      .to(c, { opacity: 0, duration: 0.25 }, '-=0.25');
  }

  if (reduceMotion) {
    gsap.set('.pp5-head > *, .pp5-mc, .pp5-mc-mobile, .pp5-ev, .pp5-tl, .pp5-stat', { opacity: 1, y: 0, scale: 1 });
    if (clockMin) clockMin.textContent = '15';
    if (clock) clock.classList.add('late');
    if (statusVal) { statusVal.textContent = 'Late'; statusVal.classList.add('late'); }
    gsap.set('.pp5-bp-banner', { opacity: 1 });
    tlSteps.forEach((s) => s.classList.add('active'));
    runPp5Counters();
    return;
  }

  /* ── Header ── */
  gsap.from('.pp5-head > *', {
    opacity: 0, y: 30, duration: 0.8, stagger: 0.12, ease: 'power3.out',
    scrollTrigger: { trigger: '.pp5-head', start: 'top 82%' }
  });

  /* ── Phone + mobile reveal ── */
  gsap.from('.pp5-mc-phonewrap, .pp5-mc-mobile', {
    opacity: 0, scale: 0.94, y: 20, duration: 0.9, ease: 'power3.out',
    scrollTrigger: { trigger: '.pp5-mc, .pp5-mc-mobile', start: 'top 75%' }
  });

  // event cards + timeline start hidden
  gsap.set('.pp5-ev', { opacity: 0, y: 16 });

  /* ── The live mission-control sequence (looping ~22s, hold, restart) ── */
  const colors = ['#10B981', '#D72024', '#0852A7', '#0852A7', '#F8CB0C'];

  function buildLoop() {
    const tl = gsap.timeline({ defaults: { ease: 'power2.inOut' } });

    // reset state at the start of every loop
    tl.add(() => {
      if (clockMin) clockMin.textContent = '00';
      if (clock) clock.classList.remove('late');
      if (statusVal) { statusVal.textContent = 'Expected'; statusVal.classList.remove('late'); }
      gsap.set('.pp5-bp-banner', { opacity: 0 });
      gsap.set('.pp5-ev', { opacity: 0, y: 16 });
      gsap.set('.pp5-tl-fill', { width: '0%' });
      tlSteps.forEach((s) => s.classList.remove('active'));
    });

    // scan + clock 8:00 → 8:15
    tl.fromTo('.pp5-scan', { opacity: 0, y: -10 }, { opacity: 1, y: 200, duration: 0.9, ease: 'power1.inOut' }, 0.6)
      .to('.pp5-scan', { opacity: 0, duration: 0.2 }, '>-0.1');
    if (clockMin) {
      tl.to(clockMin, { innerText: 15, duration: 1, ease: 'power2.inOut', snap: { innerText: 1 },
        onUpdate: function () { clockMin.textContent = String(Math.round(+clockMin.innerText)).padStart(2, '0'); } }, 0.7)
        .add(() => clock && clock.classList.add('late'), '>-0.15')
        .add(() => { if (statusVal) { statusVal.textContent = 'Late'; statusVal.classList.add('late'); } }, '<')
        .to('.pp5-bp-banner', { opacity: 1, duration: 0.4 }, '<');
    }

    // each of the 5 steps fires in sequence: timeline node + event card + packet
    const stepStart = 2.8;
    const gap = 2.1;          // slower — each step is readable before the next fires
    for (let i = 0; i < 5; i++) {
      const t = stepStart + i * gap;
      tl.add(() => { if (tlSteps[i]) tlSteps[i].classList.add('active'); }, t);
      tl.to('.pp5-tl-fill', { width: `${(i + 1) / 5 * 100}%`, duration: gap * 0.7, ease: 'power1.inOut' }, t);
      tl.add(() => firePacket(flowLines[i], colors[i]), t);
      tl.to(events[i], { opacity: 1, y: 0, duration: 0.6, ease: 'back.out(1.7)' }, t + 0.4);
    }
    tl.add(runPp5Counters, stepStart);

    // hold the completed state, then loop restarts
    tl.to({}, { duration: 5.5 });
    return tl;
  }

  const master = buildLoop();
  master.repeat(-1);
  master.pause();
  ScrollTrigger.create({
    trigger: '.pp5-mc', start: 'top 62%',
    onEnter: () => master.play(),
    onLeave: () => master.pause(),
    onEnterBack: () => master.play(),
    onLeaveBack: () => master.pause(),
  });

  /* ── Stats ── */
  gsap.from('.pp5-stat', {
    opacity: 0, y: 26, duration: 0.6, stagger: 0.12, ease: 'power3.out',
    scrollTrigger: { trigger: '.pp5-stats', start: 'top 85%', onEnter: runPp5Counters }
  });

  /* ── Parallax ── */
  const pScroll = { trigger: '.pp5', start: 'top bottom', end: 'bottom top', scrub: 1 };
  gsap.to('.pp5 .blob--red',  { y: 80,  ease: 'none', scrollTrigger: pScroll });
  gsap.to('.pp5 .blob--blue', { y: -60, ease: 'none', scrollTrigger: { ...pScroll, scrub: 1.4 } });
})();

/* ── Counters ── */
let pp5Counted = false;
function runPp5Counters() {
  if (pp5Counted) return;
  pp5Counted = true;
  document.querySelectorAll('.pp5 [data-target]').forEach((el) => {
    const target = +el.dataset.target;
    gsap.fromTo(el, { innerText: 0 }, {
      innerText: target, duration: 1.4, ease: 'power1.out',
      snap: { innerText: 1 },
      onUpdate: function () { el.innerText = Math.round(el.innerText).toLocaleString(); }
    });
  });
}
