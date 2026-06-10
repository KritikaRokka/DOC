/* ═══════════════════════════════════════════════════════
   DOS CURAÇAO — PP-6  ·  MULTIPLE CAMPUS SUPPORT
   Living ecosystem loop:
   Teacher → School → DOS Platform → Director Dashboard → Payroll
═══════════════════════════════════════════════════════ */

gsap.registerPlugin(ScrollTrigger);

(function () {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const section = document.querySelector('.pp6');
  if (!section) return;

  const svg = section.querySelector('.pp6-map-lines');
  const marker = section.querySelector('.pp6-marker');
  const campusA = section.querySelector('.pp6-campus--a');
  const campusB = section.querySelector('.pp6-campus--b');
  const dashNode = section.querySelector('.pp6-node--dash');
  const payNode = section.querySelector('.pp6-node--pay');
  const dayLabel = section.querySelector('.pp6-day-text');
  const dashCount = section.querySelector('.pp6-dash-count');
  const dashFill = section.querySelector('.pp6-dashbar-fill');
  const payA = section.querySelector('.pp6-pay-a');
  const payB = section.querySelector('.pp6-pay-b');
  const payTotal = section.querySelector('.pp6-pay-total');

  function firePacket(lineSel, color) {
    const path = section.querySelector(lineSel);
    if (!path || !svg) return;
    path.classList.add('lit');
    gsap.delayedCall(1.6, () => path.classList.remove('lit'));
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
  function detect(c) { if (!c) return; c.classList.add('detect', 'active'); gsap.delayedCall(1, () => c.classList.remove('detect')); }
  function pulseHub() { gsap.fromTo('.pp6-hub-core', { scale: 1 }, { scale: 1.06, duration: 0.3, yoyo: true, repeat: 1, ease: 'power2.inOut' }); }
  function activate(n) { n && n.classList.add('active'); }
  function setNum(el, v, unit) {
    if (!el) return;
    gsap.fromTo(el, { innerText: +el.dataset.v || 0 }, { innerText: v, duration: 0.7, snap: { innerText: 1 },
      onUpdate: function () { el.innerText = Math.round(el.innerText); } });
    el.dataset.v = v;
  }

  /* reveals */
  if (!reduceMotion) {
    gsap.from('.pp6-head > *', { opacity: 0, y: 30, duration: 0.8, stagger: 0.12, ease: 'power3.out', scrollTrigger: { trigger: '.pp6-head', start: 'top 82%' } });
    gsap.from('.pp6-profile', { opacity: 0, y: 30, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: '.pp6-profile', start: 'top 84%' } });
    gsap.from('.pp6-campus, .pp6-hub, .pp6-node, .pp6-marker', { opacity: 0, scale: 0.85, duration: 0.7, stagger: 0.1, ease: 'back.out(1.5)', scrollTrigger: { trigger: '.pp6-map', start: 'top 72%' } });
    gsap.from('.pp6-map-mobile > *', { opacity: 0, y: 24, duration: 0.6, stagger: 0.12, ease: 'power2.out', scrollTrigger: { trigger: '.pp6-map-mobile', start: 'top 82%' } });
    gsap.from('.pp6-metric', { opacity: 0, y: 30, duration: 0.6, stagger: 0.1, ease: 'power3.out', scrollTrigger: { trigger: '.pp6-metrics', start: 'top 84%' } });
  }

  if (reduceMotion) {
    gsap.set('.pp6-status', { opacity: 1 });
    campusA && campusA.classList.add('active'); campusB && campusB.classList.add('active');
    activate(dashNode); activate(payNode);
    setNum(dashCount, 2); if (dashFill) dashFill.style.width = '100%';
    setNum(payA, 4); setNum(payB, 4); setNum(payTotal, 8);
    if (dayLabel) dayLabel.textContent = 'Unified';
    return;
  }

  gsap.set('.pp6-status', { opacity: 0, y: 10, scale: 0.9 });
  const show = (s) => gsap.to(s, { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: 'back.out(1.7)' });
  const hide = (s) => gsap.to(s, { opacity: 0, duration: 0.4 });

  /* ── full ecosystem loop (~27s, then hold) ── */
  function buildLoop() {
    const tl = gsap.timeline({ defaults: { ease: 'power2.inOut' } });

    // reset visual state
    tl.add(() => {
      [campusA, campusB, dashNode, payNode].forEach((n) => n && n.classList.remove('active'));
      gsap.set('.pp6-status', { opacity: 0, y: 10, scale: 0.9 });
      gsap.set(marker, { left: '14%', top: '22%' });
      if (dayLabel) dayLabel.textContent = 'Monday';
      [['pp6-dash-count', dashCount], ['pp6-pay-a', payA], ['pp6-pay-b', payB], ['pp6-pay-total', payTotal]].forEach(([, el]) => { if (el) { el.textContent = '0'; el.dataset.v = 0; } });
      if (dashFill) dashFill.style.width = '0%';
    });

    // 1) Maria checks in at School A
    tl.add(() => detect(campusA), 0.6)
      .add(() => show('.pp6-status-1'), 0.9)                       // Location Verified
    // 2) Attendance record created
      .add(() => show('.pp6-status-3'), 2.0)                       // Attendance Recorded
    // 3) DOS Platform receives data
      .add(() => { firePacket('#p6a', '#0852A7'); }, 3.0)
      .add(() => pulseHub(), 4.0)
    // 4) Director dashboard updates
      .add(() => { firePacket('#p6dash', '#0852A7'); }, 4.6)
      .add(() => { activate(dashNode); show('.pp6-status-4'); setNum(dashCount, 1); if (dashFill) gsap.to(dashFill, { width: '50%', duration: 0.8 }); }, 5.8)
    // 5) Payroll hours sync (School A — one shift = 4h)
      .add(() => { firePacket('#p6pay', '#0852A7'); }, 6.4)
      .add(() => { activate(payNode); setNum(payA, 4); setNum(payTotal, 4); }, 7.6)
      .add(() => { hide('.pp6-status-1'); hide('.pp6-status-3'); hide('.pp6-status-4'); }, 8.6)

    // 6) Transition to next day
      .add(() => { if (dayLabel) dayLabel.textContent = 'Tuesday'; show('.pp6-status-2'); }, 9.2)   // Campus Detected
      .to(marker, { left: '50%', top: '4%', duration: 1.1 }, 9.2)
      .to(marker, { left: '86%', top: '22%', duration: 1.1 }, 10.3)

    // 7) Maria arrives at School B  8) auto-campus detection
      .add(() => detect(campusB), 11.5)
    // 9) Attendance record for School B
      .add(() => show('.pp6-status-3'), 12.3)
    // 10) DOS Platform syncs records
      .add(() => { firePacket('#p6b', '#F8CB0C'); }, 13.0)
      .add(() => pulseHub(), 14.0)
    // 11) Unified reporting updates
      .add(() => { firePacket('#p6dash', '#F8CB0C'); }, 14.6)
      .add(() => { show('.pp6-status-5'); setNum(dashCount, 2); if (dashFill) gsap.to(dashFill, { width: '100%', duration: 0.8 }); }, 15.8)
    // 12) Payroll updates automatically (School B — one shift = 4h, total 8h)
      .add(() => { firePacket('#p6pay', '#F8CB0C'); }, 16.4)
      .add(() => { setNum(payB, 4); setNum(payTotal, 8); pulseHub(); }, 17.6)
      .add(() => { if (dayLabel) dayLabel.textContent = 'Unified'; }, 18.4)

    // 13) Hold the completed state 3–4s, then 14) restart
      .to({}, { duration: 4 });

    return tl;
  }

  const master = buildLoop();   // first child resets state, so it's safe to repeat
  master.repeat(-1);
  master.pause();

  ScrollTrigger.create({
    trigger: '.pp6-map', start: 'top 65%',
    onEnter: () => master.play(),
    onLeave: () => master.pause(),
    onEnterBack: () => master.play(),
    onLeaveBack: () => master.pause(),
  });

  /* parallax */
  const pScroll = { trigger: '.pp6', start: 'top bottom', end: 'bottom top', scrub: 1 };
  gsap.to('.pp6 .blob--blue',   { y: 70,  ease: 'none', scrollTrigger: pScroll });
  gsap.to('.pp6 .blob--yellow', { y: -50, ease: 'none', scrollTrigger: { ...pScroll, scrub: 1.4 } });
})();
