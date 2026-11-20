/* Ε Deutungen – großer Moment: Sieben Vollbild-Karten fallen beim Scrollen übereinander.
   Die neue Karte schiebt sich von unten über die alte; die alte weicht zurück und versinkt im Dunkel. */
(function () {
  'use strict';
  const M = (window.MEDUSA = window.MEDUSA || {});

  M.scene = function () {
    const cards = gsap.utils.toArray('.card');
    const n = cards.length;
    if (!n) return;
    const cur = document.querySelector('.stack__cur');
    const texts = cards.map((c) => c.querySelector('.card__text'));
    const dims = cards.map((c, i) => {
      c.style.zIndex = String(i + 1);
      const d = document.createElement('div');
      d.className = 'card__dim';
      d.setAttribute('aria-hidden', 'true');
      c.appendChild(d);
      return d;
    });

    gsap.set(cards.slice(1), { yPercent: 100 });
    gsap.set(texts.slice(1), { opacity: 0, y: 40 });

    const tl = gsap.timeline({ defaults: { ease: 'none' } });
    const marks = [0];
    tl.to({}, { duration: 0.35 });
    for (let i = 1; i < n; i++) {
      tl.to(cards[i], { yPercent: 0, duration: 1, ease: 'power2.inOut' })
        .fromTo(cards[i].querySelector('.card__img'), { scale: 1.14 }, { scale: 1, duration: 1.2, ease: 'power2.out' }, '<')
        .to(cards[i - 1], { scale: 0.9, yPercent: -3, duration: 1, ease: 'power2.inOut' }, '<')
        .to(dims[i - 1], { opacity: 0.8, duration: 1 }, '<')
        .to(texts[i], { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, '<0.6');
      marks.push(tl.duration() - 0.5);
      tl.to({}, { duration: 0.6 });
    }

    // Zähler folgt der Animation selbst (nicht dem Scrollwert, der wegen scrub vorauseilt)
    let shown = 0;
    tl.eventCallback('onUpdate', () => {
      const t = tl.time();
      let k = 0;
      for (let i = 0; i < marks.length; i++) if (t >= marks[i]) k = i;
      if (k !== shown && cur) { shown = k; cur.textContent = String(k + 1).padStart(2, '0'); }
    });
    ScrollTrigger.create({
      trigger: '.stack__pin',
      start: 'top top',
      end: () => '+=' + Math.round(window.innerHeight * (n - 1) * 1.15),
      pin: true,
      scrub: 0.6,
      animation: tl,
      invalidateOnRefresh: true
    });

    // Erste Karte: Text baut sich beim Hineinscrollen auf
    gsap.fromTo(texts[0], { opacity: 0, y: 40 }, {
      opacity: 1, y: 0, duration: 1.1, ease: 'power3.out',
      scrollTrigger: { trigger: '.stack', start: 'top 60%', once: true }
    });
  };
})();
