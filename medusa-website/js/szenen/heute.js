/* Θ Heute – großer Moment: Raster aus stummen, dunklen Kacheln. Sie erwachen beim Hovern
   (Tastatur: beim Fokussieren; Handy: sobald sie in der Bildmitte sind) – Farbe kommt zurück,
   das Bild zoomt langsam, Videos laufen, der Text schiebt sich herein. */
(function () {
  'use strict';
  const M = (window.MEDUSA = window.MEDUSA || {});

  M.scene = function () {
    const tiles = gsap.utils.toArray('.tile');
    const wake = (t, on) => {
      t.classList.toggle('is-live', on);
      const v = t.querySelector('video');
      if (!v) return;
      if (on) { const p = v.play(); if (p && p.catch) p.catch(() => {}); }
      else v.pause();
    };

    if (M.finePointer) {
      tiles.forEach((t) => {
        t.addEventListener('pointerenter', () => wake(t, true));
        t.addEventListener('pointerleave', () => { if (!t.contains(document.activeElement)) wake(t, false); });
      });
    } else {
      // Touch: die Kachel in der Bildmitte erwacht
      tiles.forEach((t) => ScrollTrigger.create({
        trigger: t, start: 'top 62%', end: 'bottom 38%',
        onToggle: (self) => wake(t, self.isActive)
      }));
    }
    tiles.forEach((t) => {
      t.addEventListener('focusin', () => wake(t, true));
      t.addEventListener('focusout', (e) => { if (!t.contains(e.relatedTarget)) wake(t, false); });
    });

    // Auftritt: Kacheln steigen nacheinander aus dem Dunkel
    gsap.fromTo(tiles, { opacity: 0, y: 60 }, {
      opacity: 1, y: 0, duration: 1.1, ease: 'power3.out', stagger: 0.1,
      scrollTrigger: { trigger: '.tiles', start: 'top 80%', once: true }
    });
  };
})();
