/* ═══════════════════════════════════════════════════════
   DOS CURAÇAO — PP-3  ·  ONE CONNECTED EDUCATIONAL NETWORK
   Network activation · living data · interactive nodes
═══════════════════════════════════════════════════════ */

gsap.registerPlugin(ScrollTrigger);

(function () {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const section = document.querySelector('.pp3');
  if (!section) return;

  const svg = section.querySelector('.pp3-lines');
  const lines = Array.from(section.querySelectorAll('.pp3-line'));
  const inbound = ['brievengat', 'trupial', 'alejandro'];      // schools → platform
  const lineByNode = {};
  lines.forEach((l) => (lineByNode[l.dataset.node] = l));

  const coords = (line) => ({
    x1: +line.getAttribute('x1'), y1: +line.getAttribute('y1'),
    x2: +line.getAttribute('x2'), y2: +line.getAttribute('y2'),
  });

  /* ── Fire a single packet along a node's line ── */
  function firePacket(node, colorOverride) {
    const line = lineByNode[node];
    if (!line) return;
    const { x1, y1, x2, y2 } = coords(line);
    const isIn = inbound.includes(node);
    const from = isIn ? { cx: x2, cy: y2 } : { cx: x1, cy: y1 };
    const to   = isIn ? { cx: x1, cy: y1 } : { cx: x2, cy: y2 };
    const c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    c.setAttribute('r', '4.5');
    c.setAttribute('fill', colorOverride || (isIn ? '#0852A7' : '#F8CB0C'));
    svg.appendChild(c);
    const tl = gsap.timeline({ onComplete: () => c.remove() });
    tl.set(c, { cx: from.cx, cy: from.cy, opacity: 0 })
      .to(c, { opacity: 1, duration: 0.25 })
      .to(c, { cx: to.cx, cy: to.cy, duration: 1.3, ease: 'power1.inOut' }, '<')
      .to(c, { opacity: 0, duration: 0.3 }, '-=0.3');
  }

  /* ── Continuous ambient packet flow on every line ── */
  function ambientFlow() {
    lines.forEach((line, i) => {
      const node = line.dataset.node;
      gsap.delayedCall(i * 0.5, function loop() {
        firePacket(node);
        gsap.delayedCall(2.2 + Math.random() * 1.5, loop);
      });
    });
  }

  /* ── Pulse the center hub ── */
  function pulseCenter() {
    gsap.fromTo('.pp3-center', { scale: 1 }, { scale: 1.05, duration: 0.3, yoyo: true, repeat: 1, ease: 'power2.inOut' });
  }

  if (reduceMotion) {
    gsap.set('.pp3-head > *, .pp3-chain > *, .pp3-eco, .pp3-center, .pp3-node, .pp3-school, .pp3-fcard, .pp3-metric', { opacity: 1, scale: 1, x: 0, y: 0 });
    gsap.set('.pp3-line', { opacity: 0.4 });
    runPp3Counters();
    return;
  }

  /* ── Header + chain ── */
  gsap.from('.pp3-head > *', {
    opacity: 0, y: 30, duration: 0.8, stagger: 0.12, ease: 'power3.out',
    scrollTrigger: { trigger: '.pp3-head', start: 'top 82%' }
  });
  gsap.from('.pp3-chain > *', {
    opacity: 0, y: 14, duration: 0.5, stagger: 0.08, ease: 'power2.out',
    scrollTrigger: { trigger: '.pp3-chain', start: 'top 85%' }
  });

  /* ── Ecosystem activation sequence ── */
  gsap.set('.pp3-center', { opacity: 0, scale: 0.6 });
  gsap.set('.pp3-school, .pp3-node', { opacity: 0 });
  gsap.set('.pp3-fcard', { opacity: 0 });

  const ecoTl = gsap.timeline({ scrollTrigger: { trigger: '.pp3-eco', start: 'top 70%' } });
  ecoTl
    .to('.pp3-center', { opacity: 1, scale: 1, duration: 0.8, ease: 'back.out(1.7)' })
    .to('.pp3-line', { opacity: 0.32, duration: 0.5, stagger: 0.08, ease: 'power2.out' }, '-=0.4')
    .to('.pp3-school', { opacity: 1, duration: 0.5, stagger: 0.1, ease: 'power2.out' }, '-=0.5')
    .to('.pp3-node', { opacity: 1, duration: 0.5, stagger: 0.1, ease: 'power2.out' }, '-=0.4')
    .add(() => { ambientFlow(); startLiveActivity(); }, '-=0.2')
    .to('.pp3-fcard', { opacity: 1, duration: 0.6, stagger: 0.12, ease: 'power2.out' }, '-=0.3')
    .add(runPp3Counters, '-=0.4');

  /* ── Interactive nodes: hover lights the connection + fires a packet ── */
  section.querySelectorAll('.pp3-school, .pp3-node').forEach((el) => {
    const node = el.dataset.node;
    const line = lineByNode[node];
    el.addEventListener('mouseenter', () => {
      if (line) line.classList.add('lit');
      firePacket(node, '#F8CB0C');
      pulseCenter();
    });
    el.addEventListener('mouseleave', () => { if (line) line.classList.remove('lit'); });
  });

  /* ── Metrics counters ── */
  gsap.from('.pp3-metric', {
    opacity: 0, y: 30, duration: 0.7, stagger: 0.1, ease: 'power3.out',
    scrollTrigger: { trigger: '.pp3-metrics', start: 'top 84%', onEnter: runPp3Counters }
  });

  /* ── Parallax ── */
  const pScroll = { trigger: '.pp3', start: 'top bottom', end: 'bottom top', scrub: 1 };
  gsap.to('.pp3 .blob--blue',   { y: 80,  ease: 'none', scrollTrigger: pScroll });
  gsap.to('.pp3 .blob--yellow', { y: -60, ease: 'none', scrollTrigger: { ...pScroll, scrub: 1.4 } });

  /* ── Live activity: schools receive check-ins over time ── */
  function startLiveActivity() {
    const schools = Array.from(section.querySelectorAll('.pp3-school'));
    setInterval(() => {
      const el = schools[Math.floor(Math.random() * schools.length)];
      if (!el) return;
      const node = el.dataset.node;
      // flash the school
      el.classList.add('active');
      gsap.delayedCall(1.1, () => el.classList.remove('active'));
      // light its line + send a packet to the platform
      const line = lineByNode[node];
      if (line) { line.classList.add('lit'); gsap.delayedCall(1.3, () => line.classList.remove('lit')); }
      firePacket(node);
      pulseCenter();
      // tick the staff count +1, then settle back after a moment
      const staff = el.querySelector('.pp3-staff');
      if (staff) {
        const base = +staff.dataset.base;
        staff.textContent = base + 1;
        staff.style.color = '#F8CB0C';
        gsap.delayedCall(1.4, () => { staff.textContent = base; staff.style.color = ''; });
      }
    }, 3200);
  }
})();

/* ── Counters ── */
let pp3Counted = false;
function runPp3Counters() {
  if (pp3Counted) return;
  pp3Counted = true;
  document.querySelectorAll('.pp3 [data-target]').forEach((el) => {
    const target = +el.dataset.target;
    gsap.fromTo(el, { innerText: 0 }, {
      innerText: target, duration: 1.5, ease: 'power1.out',
      snap: { innerText: 1 },
      onUpdate: function () { el.innerText = Math.round(el.innerText).toLocaleString(); }
    });
  });
}
