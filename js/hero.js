/* ═══════════════════════════════════════════════════════
   DOS CURAÇAO — PP-1 HERO
   Cinematic entrance · ecosystem loop · live data · parallax
═══════════════════════════════════════════════════════ */

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin, TextPlugin);

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

document.addEventListener('DOMContentLoaded', () => {

  /* ── Cinematic background video ── */
  const video = document.getElementById('heroVideo');
  if (video) {
    const showVideo = () => gsap.to(video, { opacity: 0.55, duration: 1.6, ease: 'power2.out' });
    if (video.readyState >= 2) showVideo();
    video.addEventListener('loadeddata', showVideo);
  }

  /* ── Nav scroll state ── */
  const nav = document.getElementById('nav');
  ScrollTrigger.create({
    start: 'top -40',
    onUpdate: (self) => nav.classList.toggle('scrolled', self.scroll() > 40),
  });

  if (reduceMotion) {
    gsap.set('.hero-badge, .hl-line, .hero-sub, .hero-ctas, .stat-item, .hero-product', { opacity: 1, y: 0 });
    runCounters();
    return;
  }

  /* ════════════════════════════════════════════
     ENTRANCE CHOREOGRAPHY
  ════════════════════════════════════════════ */
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  gsap.set('.hero-badge', { opacity: 0, x: -24 });
  gsap.set('.hl-line', { opacity: 0, y: 40, rotateX: -40, transformOrigin: '50% 100%' });
  gsap.set('.hero-sub', { opacity: 0, y: 24 });
  gsap.set('.hero-ctas > *', { opacity: 0, y: 20 });
  gsap.set('.stat-item', { opacity: 0, y: 20 });
  gsap.set('.hero-product', { opacity: 0, scale: 0.92, y: 20 });
  gsap.set('.scroll-cue', { opacity: 0 });
  // floating ecosystem elements start hidden, reveal after product lands
  gsap.set('.cloud-node, .chip-schools, .chip-teachers', { opacity: 0, scale: 0.8, y: 12 });
  gsap.set('.tap-hint', { opacity: 0 });

  tl.to('.hero-badge', { opacity: 1, x: 0, duration: 0.7 }, 0.2)
    .to('.hl-line', { opacity: 1, y: 0, rotateX: 0, duration: 0.9, stagger: 0.12 }, 0.35)
    .to('.hero-sub', { opacity: 1, y: 0, duration: 0.8 }, 0.85)
    .to('.hero-ctas > *', { opacity: 1, y: 0, duration: 0.7, stagger: 0.12 }, 1.05)
    .to('.stat-item', { opacity: 1, y: 0, duration: 0.7, stagger: 0.1 }, 1.3)
    .to('.hero-product', { opacity: 1, scale: 1, y: 0, duration: 1.1 }, 0.7)
    .to('.cloud-node', { opacity: 1, scale: 1, y: 0, duration: 0.6, ease: 'back.out(1.7)' }, 1.4)
    .to('.chip-schools', { opacity: 1, scale: 1, y: 0, duration: 0.6, ease: 'back.out(1.7)' }, 1.55)
    .to('.chip-teachers', { opacity: 1, scale: 1, y: 0, duration: 0.6, ease: 'back.out(1.7)' }, 1.7)
    .to('.tap-hint', { opacity: 0.7, duration: 0.6 }, 1.9)
    .to('.scroll-cue', { opacity: 1, duration: 0.8 }, 1.8)
    .add(runCounters, 1.4)
    .add(startLiveData, 2.6);

  /* ════════════════════════════════════════════
     SIGNATURE ECOSYSTEM LOOP
     phone tap → reader scan → cloud → dashboard
  ════════════════════════════════════════════ */
  const reader = document.querySelector('.rfid-reader');
  const loop = gsap.timeline({ repeat: -1, repeatDelay: 1.6, delay: 2.6 });

  loop
    // Phone reaches toward reader
    .to('.phone', { x: 30, y: -30, duration: 1, ease: 'power2.inOut' })
    // Reader lights up (scanning)
    .add(() => reader && reader.classList.add('scanning'), '+=0.1')
    // Success state on phone
    .to('.phone-check-icon', { opacity: 0, scale: 0.6, duration: 0.3 }, '+=0.1')
    .to('.phone-success-icon', { opacity: 1, scale: 1, duration: 0.4, ease: 'back.out(2)' }, '<')
    .to('.phone-success-ring', { opacity: 1, scale: 1.15, duration: 0.5 }, '<')
    .to('.phone-label', { text: 'Checked In', color: '#10B981', duration: 0.1 }, '<')
    .to('.phone-time', { text: '7:45 AM', color: '#5A6B82', duration: 0.1 }, '<')
    .to('.reader-status', { text: 'Verified', color: '#10B981', duration: 0.2 }, '<')
    // Data packets travel phone → reader → cloud → dashboard
    .to('.data-flow', { opacity: 1, duration: 0.3 }, '<')
    .to('.data-packet--1', { motionPath: { path: '#flowPath', align: '#flowPath', alignOrigin: [0.5, 0.5] }, duration: 1.1, ease: 'power1.inOut' }, '<')
    .to('.data-packet--2', { motionPath: { path: '#flowPath', align: '#flowPath', alignOrigin: [0.5, 0.5] }, duration: 1.1, ease: 'power1.inOut' }, '-=0.85')
    .to('.data-packet--3', { motionPath: { path: '#flowPath', align: '#flowPath', alignOrigin: [0.5, 0.5] }, duration: 1.1, ease: 'power1.inOut' }, '-=0.85')
    // Live toast slides in
    .fromTo('.live-toast', { opacity: 0, x: -16 }, { opacity: 1, x: 0, duration: 0.5, ease: 'back.out(1.6)' }, '-=0.6')
    // Confirmation card pops
    .fromTo('.confirm-card', { opacity: 0, y: 14, scale: 0.92 },
      { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: 'back.out(1.7)' }, '-=0.3')
    // Dashboard row appears + stat ticks
    .to('.dash-row--live', { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, '-=0.2')
    .fromTo('.dash-count', { innerText: 11 }, { innerText: 12, duration: 0.4, snap: { innerText: 1 }, onUpdate: function () {
        this.targets()[0].innerText = Math.round(this.targets()[0].innerText);
      } }, '<')
    // Hold the moment
    .to({}, { duration: 2 })
    // Reset
    .add(() => reader && reader.classList.remove('scanning'))
    .to('.live-toast', { opacity: 0, x: -12, duration: 0.4, ease: 'power2.in' })
    .to('.confirm-card', { opacity: 0, y: -10, duration: 0.4, ease: 'power2.in' }, '<')
    .to('.phone', { x: 0, y: 0, duration: 0.8, ease: 'power2.inOut' }, '<')
    .to('.phone-success-icon', { opacity: 0, scale: 0.6, duration: 0.3 }, '<')
    .to('.phone-success-ring', { opacity: 0, scale: 1, duration: 0.3 }, '<')
    .to('.phone-check-icon', { opacity: 1, scale: 1, duration: 0.3 }, '<')
    .to('.phone-label', { text: 'Hold Near Reader', color: '#0A1A2F', duration: 0.1 }, '<')
    .to('.phone-time', { text: '— : —', color: '#5A6B82', duration: 0.1 }, '<')
    .to('.reader-status', { text: 'Ready', color: '#5A6B82', duration: 0.2 }, '<')
    .to('.dash-row--live', { opacity: 0, duration: 0.3 }, '<')
    .to('.data-flow', { opacity: 0.45, duration: 0.3 }, '<');

  /* ── Click-to-try interaction ── */
  if (reader) {
    reader.addEventListener('click', () => {
      loop.restart();
      gsap.to('.tap-hint', { opacity: 0, duration: 0.4 });
    });
  }

  /* ════════════════════════════════════════════
     LAYERED PARALLAX (depth)
  ════════════════════════════════════════════ */
  // NOTE: floating chips keep their CSS idle-float; the whole product zone
  // parallaxes as one layer so the chips ride along without transform conflict.
  const pScroll = { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 };
  gsap.to('.blob--blue',    { y: 120, ease: 'none', scrollTrigger: pScroll });
  gsap.to('.blob--yellow',  { y: 80,  ease: 'none', scrollTrigger: { ...pScroll, scrub: 1.4 } });
  gsap.to('.hero-product',  { y: -50, ease: 'none', scrollTrigger: { ...pScroll, scrub: 1.2 } });
  gsap.to('.hero-copy',     { y: 40, opacity: 0.3, ease: 'none', scrollTrigger: pScroll });
});

/* ── Counters (all data-target in hero) ── */
function runCounters() {
  document.querySelectorAll('#hero [data-target]').forEach((el) => {
    const target = +el.dataset.target;
    if (el.classList.contains('dash-count')) {
      gsap.fromTo(el, { innerText: 0 }, { innerText: target, duration: 1.2, ease: 'power1.out',
        snap: { innerText: 1 }, onUpdate: function () { el.innerText = Math.round(el.innerText); } });
    } else {
      gsap.fromTo(el, { innerText: 0 }, { innerText: target, duration: 1.6, ease: 'power1.out',
        snap: { innerText: 1 }, onUpdate: function () { el.innerText = Math.round(el.innerText).toLocaleString(); } });
    }
  });
}

/* ── Live data: teachers checked-in ticks up over time ── */
function startLiveData() {
  const t = document.querySelector('.count-teachers');
  if (!t) return;
  setInterval(() => {
    const current = parseInt(t.innerText.replace(/,/g, ''), 10) || 0;
    const next = current + Math.floor(Math.random() * 3) + 1;
    gsap.fromTo(t, { innerText: current }, {
      innerText: next, duration: 0.8, ease: 'power1.out', snap: { innerText: 1 },
      onUpdate: function () { t.innerText = Math.round(t.innerText).toLocaleString(); }
    });
  }, 4000);
}
