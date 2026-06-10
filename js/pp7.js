/* ═══════════════════════════════════════════════════════
   DOS CURAÇAO — PP-7  ·  DIRECTOR DASHBOARD (Command Center)
   Live, intelligent, connected — executive-level
═══════════════════════════════════════════════════════ */

gsap.registerPlugin(ScrollTrigger);

(function () {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const section = document.querySelector('.pp7');
  if (!section) return;

  const feed = section.querySelector('.pp7-feed-list');

  // live activity events (cycled into the feed)
  const EVENTS = [
    { t: 'M. Santos checked in', s: 'Kolegio Brievengat', c: 'green', ic: 'check' },
    { t: 'Late arrival detected', s: 'A. de Vries · +15 min', c: 'yellow', ic: 'clock' },
    { t: 'Campus synced', s: 'Otrobanda · School B', c: 'blue', ic: 'sync' },
    { t: 'Payroll hours updated', s: 'SOHO · +12h', c: 'blue', ic: 'doc' },
    { t: 'Attendance report generated', s: 'Weekly · all schools', c: 'green', ic: 'chart' },
    { t: 'D. Girigori checked in', s: 'Kolegio San Hose', c: 'green', ic: 'check' },
    { t: 'Campus detected', s: 'Maria Santos · School A', c: 'yellow', ic: 'pin' },
  ];
  const ICONS = {
    check: '<path d="M20 6 9 17l-5-5"/>',
    clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
    sync:  '<path d="M21 2v6h-6M3 22v-6h6"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L21 8M21 15a9 9 0 0 1-14.85 3.36L3 16"/>',
    doc:   '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/>',
    chart: '<path d="M3 3v18h18"/><path d="M7 14l3-3 3 3 4-5"/>',
    pin:   '<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>',
  };
  const TIMES = ['just now', '1 min ago', '2 min ago', '3 min ago', '5 min ago'];

  function feedItem(ev) {
    const el = document.createElement('div');
    el.className = 'pp7-fitem';
    el.innerHTML =
      '<span class="pp7-fitem-ic pp7-fi--' + ev.c + '"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">' + ICONS[ev.ic] + '</svg></span>' +
      '<div class="pp7-fitem-txt"><div class="pp7-fitem-t">' + ev.t + '</div><div class="pp7-fitem-time">' + ev.s + ' · ' + TIMES[0] + '</div></div>';
    return el;
  }

  // seed 4 feed items, then cycle a new one in periodically
  let evi = 0;
  function seedFeed() {
    if (!feed) return;
    for (let i = 0; i < 4; i++) {
      const el = feedItem(EVENTS[evi % EVENTS.length]); evi++;
      feed.appendChild(el);
      gsap.to(el, { opacity: 1, duration: 0.4, delay: 0.15 * i });
    }
  }
  function pushFeed() {
    if (!feed) return;
    const el = feedItem(EVENTS[evi % EVENTS.length]); evi++;
    feed.insertBefore(el, feed.firstChild);
    gsap.fromTo(el, { opacity: 0, height: 0, marginBottom: 0 }, { opacity: 1, height: 'auto', duration: 0.5, ease: 'power2.out' });
    // age the "time" labels down the list
    feed.querySelectorAll('.pp7-fitem-time').forEach((tEl, i) => {
      const base = tEl.textContent.split(' · ')[0];
      tEl.textContent = base + ' · ' + TIMES[Math.min(i, TIMES.length - 1)];
    });
    while (feed.children.length > 4) feed.removeChild(feed.lastChild);
  }

  function runCounters() {
    section.querySelectorAll('.pp7-count[data-target]').forEach((el) => {
      const target = +el.dataset.target;
      gsap.fromTo(el, { innerText: 0 }, {
        innerText: target, duration: 1.5, ease: 'power1.out', snap: { innerText: 1 },
        onUpdate: function () { el.innerText = Math.round(el.innerText).toLocaleString(); }
      });
    });
  }

  if (reduceMotion) {
    gsap.set('.pp7-head > *, .pp7-kpi, .pp7-main, .pp7-card', { opacity: 1, y: 0 });
    runCounters(); seedFeed();
    return;
  }

  /* reveals */
  gsap.from('.pp7-head > *', { opacity: 0, y: 30, duration: 0.8, stagger: 0.12, ease: 'power3.out', scrollTrigger: { trigger: '.pp7-head', start: 'top 82%' } });
  gsap.from('.pp7-kpi', { opacity: 0, y: 24, duration: 0.6, stagger: 0.08, ease: 'power3.out', scrollTrigger: { trigger: '.pp7-kpis', start: 'top 85%' } });
  gsap.from('.pp7-main', { opacity: 0, y: 30, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: '.pp7-grid', start: 'top 78%' } });
  gsap.from('.pp7-side > *', { opacity: 0, y: 30, duration: 0.7, stagger: 0.12, ease: 'power3.out', scrollTrigger: { trigger: '.pp7-grid', start: 'top 74%' } });
  gsap.from('.pp7-stat', { opacity: 0, scale: 0.92, duration: 0.5, stagger: 0.08, ease: 'back.out(1.5)', scrollTrigger: { trigger: '.pp7-stats', start: 'top 85%' } });
  gsap.from('.pp7-sgroup', { opacity: 0, y: 18, duration: 0.55, stagger: 0.12, ease: 'power2.out', scrollTrigger: { trigger: '.pp7-staff', start: 'top 82%' } });

  // weekly trend bars grow
  gsap.from('.pp7-tc-bar', { scaleY: 0, duration: 0.7, stagger: 0.06, ease: 'power2.out', scrollTrigger: { trigger: '.pp7-trendchart', start: 'top 88%' } });

  // counters + feed kick off when dashboard enters
  ScrollTrigger.create({ trigger: '.pp7-grid', start: 'top 75%', once: true, onEnter: () => { runCounters(); seedFeed(); } });

  // live feed cycles while in view
  let feedTimer = null;
  ScrollTrigger.create({
    trigger: '.pp7-feed', start: 'top 90%', end: 'bottom top',
    onEnter: () => { if (!feedTimer) feedTimer = setInterval(pushFeed, 3200); },
    onLeave: () => { clearInterval(feedTimer); feedTimer = null; },
    onEnterBack: () => { if (!feedTimer) feedTimer = setInterval(pushFeed, 3200); },
    onLeaveBack: () => { clearInterval(feedTimer); feedTimer = null; },
  });

  /* parallax */
  const pScroll = { trigger: '.pp7', start: 'top bottom', end: 'bottom top', scrub: 1 };
  gsap.to('.pp7 .blob--blue',   { y: 70,  ease: 'none', scrollTrigger: pScroll });
  gsap.to('.pp7 .blob--yellow', { y: -50, ease: 'none', scrollTrigger: { ...pScroll, scrub: 1.4 } });
})();
