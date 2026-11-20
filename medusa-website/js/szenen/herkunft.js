/* Α Herkunft – großer Moment: der Stammbaum wächst als goldene Linien aus der Dunkelheit */
(function () {
  'use strict';
  const M = (window.MEDUSA = window.MEDUSA || {});

  M.scene = function () {
    const mm = gsap.matchMedia();

    // Stammbaum: Querformat und Hochformat haben je eine eigene Zeichnung
    mm.add({ tall: '(max-width: 700px), (max-aspect-ratio: 4/5)', wide: '(min-width: 701px) and (min-aspect-ratio: 4/5)' }, (ctx) => {
      const svg = document.querySelector(ctx.conditions.tall ? '.tree__svg--tall' : '.tree__svg--wide');
      const lines = Array.from(svg.querySelectorAll('.t-line'));
      const nodes = Array.from(svg.querySelectorAll('.t-node'));
      const note = document.querySelector('.tree__note');

      lines.forEach((l) => {
        if (l.classList.contains('t-line--dash')) gsap.set(l, { opacity: 0 });
        else gsap.set(l, { drawSVG: '0%' });
      });
      gsap.set(nodes, { opacity: 0, y: 16 });
      gsap.set(note, { opacity: 0, y: 20 });

      const tl = gsap.timeline({ defaults: { ease: 'none' } });
      const showNodes = (k, at) => {
        const n = nodes.filter((x) => +x.dataset.at === k);
        if (n.length) tl.to(n, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, at);
      };
      showNodes(-1, 0);
      let t = 0.5;
      lines.forEach((l, i) => {
        if (l.classList.contains('t-line--dash')) tl.to(l, { opacity: 1, duration: 0.5 }, t);
        else tl.to(l, { drawSVG: '100%', duration: l.classList.contains('t-line--gold') ? 1 : 0.7 }, t);
        t += l.classList.contains('t-line--gold') ? 0.9 : 0.6;
        showNodes(i, t - 0.1);
        if (i === 6) {
          // Medusa erscheint: die unsterblichen Schwestern treten zurück
          const sisters = nodes.filter((x) => x.dataset.at === '4' || x.dataset.at === '5');
          tl.to(sisters, { opacity: 0.35, duration: 0.8 }, t + 0.2);
          t += 0.5;
        }
      });
      tl.to(note, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, t + 0.2);
      tl.to({}, { duration: 0.6 });

      ScrollTrigger.create({
        trigger: '.tree__pin',
        start: 'top top',
        end: '+=' + (ctx.conditions.tall ? 260 : 230) + '%',
        pin: true,
        scrub: 0.6,
        animation: tl,
        invalidateOnRefresh: true
      });
    });

    // „Schuppen. Hauer. Bronzehände. Goldene Flügel.“ – Wörter schieben sich aus dem Dunkel
    gsap.utils.toArray('.gestalt__words li').forEach((li, i) => {
      gsap.fromTo(li, { xPercent: i % 2 ? 8 : -8, opacity: 0.06 }, {
        xPercent: 0, opacity: 1, ease: 'none',
        scrollTrigger: { trigger: li, start: 'top 95%', end: 'top 55%', scrub: true }
      });
    });

    // Die Vase taucht aus dem Nebel auf
    document.querySelectorAll('[data-fog]').forEach((f) => {
      const tl = gsap.timeline({ scrollTrigger: { trigger: f, start: 'top 90%', end: 'center 50%', scrub: true } });
      tl.fromTo(f.querySelector('.fog__veil'), { scale: 1, opacity: 1 }, { scale: 2.6, opacity: 0, ease: 'power1.in' }, 0)
        .fromTo(f.querySelector('.fog__img img'), { scale: 1.2, opacity: 0.15 }, { scale: 1, opacity: 1, ease: 'power2.out' }, 0);
    });
  };
})();
