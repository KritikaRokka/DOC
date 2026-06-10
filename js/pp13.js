/* ═══════════════════════════════════════════════════════
   DOS CURAÇAO — PP-13  ·  THE VISION (Cinematic Finale)
   Connected island network + the lasting impression
═══════════════════════════════════════════════════════ */

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

(function () {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const section = document.querySelector('.pp13');
  if (!section) return;

  const nnodes = gsap.utils.toArray('.pp13-nnode');
  const netlines = gsap.utils.toArray('.pp13-netline');

  function runCounters() {
    section.querySelectorAll('.pp13-count[data-target]').forEach((el) => {
      const target = +el.dataset.target;
      gsap.fromTo(el, { innerText: 0 }, {
        innerText: target, duration: 1.8, ease: 'power1.out', snap: { innerText: 1 },
        onUpdate: function () { el.innerText = Math.round(el.innerText).toLocaleString(); }
      });
    });
  }

  // prep network lines for draw-in
  netlines.forEach((l) => { const len = l.getTotalLength(); l.style.strokeDasharray = len; l.style.strokeDashoffset = len; });

  if (reduceMotion) {
    gsap.set('.pp13-head > *, .pp13-line, .pp13-stat, .pp13-videowrap, .pp13-storyboard, .pp13-close > *, .pp13-overlay', { opacity: 1, x: 0, y: 0 });
    netlines.forEach((l) => { l.style.strokeDashoffset = 0; });
    nnodes.forEach((n) => n.classList.add('lit'));
    runCounters();
    return;
  }

  /* header reveal */
  gsap.from('.pp13-eyebrow', { opacity: 0, y: 20, duration: 0.7, ease: 'power3.out', scrollTrigger: { trigger: '.pp13-head', start: 'top 85%' } });
  gsap.from('.pp13-title', { opacity: 0, y: 38, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: '.pp13-head', start: 'top 82%' } });
  gsap.from('.pp13-sub', { opacity: 0, y: 22, duration: 0.8, delay: 0.15, ease: 'power3.out', scrollTrigger: { trigger: '.pp13-head', start: 'top 82%' } });

  /* manifesto — dramatic line-by-line blur reveal */
  gsap.from('.pp13-line', { opacity: 0, y: 34, filter: 'blur(6px)', duration: 0.8, stagger: 0.2, ease: 'power3.out', scrollTrigger: { trigger: '.pp13-manifesto', start: 'top 78%' } });

  /* impact band — rise + count up */
  gsap.from('.pp13-stat', { opacity: 0, y: 34, scale: 0.94, duration: 0.7, stagger: 0.12, ease: 'back.out(1.4)', scrollTrigger: { trigger: '.pp13-impact', start: 'top 85%', onEnter: runCounters } });

  /* cinematic video reveal */
  gsap.from('.pp13-videowrap', { opacity: 0, y: 40, scale: 0.97, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: '.pp13-videowrap', start: 'top 84%' } });
  gsap.from('.pp13-storyboard', { opacity: 0, y: 14, duration: 0.6, delay: 0.2, ease: 'power2.out', scrollTrigger: { trigger: '.pp13-videowrap', start: 'top 74%' } });

  /* closing dramatic reveal */
  gsap.from('.pp13-close > *', { opacity: 0, y: 26, duration: 0.8, stagger: 0.15, ease: 'power3.out', scrollTrigger: { trigger: '.pp13-close', start: 'top 90%' } });

  /* floating overlays */
  gsap.from('.pp13-overlay', { opacity: 0, scale: 0.82, duration: 0.6, stagger: 0.2, delay: 0.4, ease: 'back.out(1.6)', scrollTrigger: { trigger: '.pp13', start: 'top 60%' } });

  /* connected island network: lines draw, schools light up, data flows */
  ScrollTrigger.create({
    trigger: '.pp13', start: 'top 70%', once: true,
    onEnter: () => {
      gsap.to(netlines, { strokeDashoffset: 0, duration: 1.1, stagger: 0.07, ease: 'power2.out' });
      nnodes.forEach((n, i) => gsap.delayedCall(0.3 + i * 0.12, () => n.classList.add('lit')));
      if (document.querySelector('#pp13netpath')) {
        gsap.set('.pp13-netpulse', { opacity: 1 });
        gsap.to('.pp13-netpulse', { duration: 4, repeat: -1, ease: 'none', motionPath: { path: '#pp13netpath', align: '#pp13netpath' } });
      }
    }
  });

  /* subtle parallax on the cinematic background */
  gsap.to('.pp13-bg-img', { yPercent: 12, ease: 'none', scrollTrigger: { trigger: '.pp13', start: 'top bottom', end: 'bottom top', scrub: 1 } });
})();
