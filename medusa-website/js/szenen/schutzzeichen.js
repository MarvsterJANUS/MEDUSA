/* Δ Schutzzeichen – großer Moment: Fratze → Übergangstyp → Rondanini verwandeln sich beim Scrollen.
   Dazu: Fundorte als Liste, das Bild folgt dem Cursor (auf Touch: Antippen klappt das Bild auf). */
(function () {
  'use strict';
  const M = (window.MEDUSA = window.MEDUSA || {});

  M.scene = function () {
    /* ---------- Verwandlungs-Scrub ---------- */
    const faces = gsap.utils.toArray('.morph__face');
    const steps = gsap.utils.toArray('.morph__step');
    gsap.set(faces, { opacity: 0 });
    gsap.set(faces[0], { opacity: 1 });
    gsap.set(steps, { opacity: 0, y: 30 });
    gsap.set(steps[0], { opacity: 1, y: 0 });

    const tl = gsap.timeline({ defaults: { ease: 'none' } });
    const marks = [0.2];   // Zeitpunkte, an denen Stufe i voll zu sehen ist (für die Tastatur)
    tl.to({}, { duration: 0.5 });
    for (let i = 1; i < faces.length; i++) {
      tl.fromTo(faces[i], { opacity: 0, scale: 1.04 }, { opacity: 1, scale: 1, duration: 1 }, '>')
        .to(faces[i - 1], { opacity: 0, scale: 0.98, duration: 1 }, '<')
        .to(steps[i - 1], { opacity: 0, y: -30, duration: 0.45 }, '<')
        .to(steps[i], { opacity: 1, y: 0, duration: 0.45 }, '<0.55')
        .to({}, { duration: 0.6 });
      marks.push(tl.duration() - 0.3);
    }
    tl.fromTo('.morph__line i', { scaleX: 0 }, { scaleX: 1, duration: tl.duration() }, 0);
    // aktuelle Stufe merken (nur sie ist klickbar)
    steps[0].classList.add('is-cur');
    tl.eventCallback('onUpdate', () => {
      const t = tl.time();
      let k = 0;
      for (let i = 0; i < marks.length; i++) if (t >= marks[i] - 0.45) k = i;
      steps.forEach((x, i) => x.classList.toggle('is-cur', i === k));
    });

    const st = ScrollTrigger.create({
      trigger: '.morph__pin', start: 'top top', end: '+=260%',
      pin: true, scrub: 0.6, animation: tl, invalidateOnRefresh: true
    });
    // Tastatur: Fokus in einer Stufe → zur passenden Stelle der Verwandlung scrollen
    M.focusTargets.push({
      root: document.querySelector('.morph__pin'),
      y: (el) => { const k = steps.findIndex((s) => s.contains(el)); return k < 0 ? null : st.start + (marks[k] / tl.duration()) * (st.end - st.start); }
    });

    /* ---------- Fundorte ---------- */
    const items = gsap.utils.toArray('.places li');
    if (M.finePointer) {
      const box = document.createElement('div');
      box.className = 'cursor-img';
      box.setAttribute('aria-hidden', 'true');
      document.body.appendChild(box);
      const imgs = {};
      items.forEach((li) => {
        const src = li.querySelector('button').dataset.img;
        if (src && !imgs[src]) { const im = new Image(); im.src = src; im.alt = ''; box.appendChild(im); imgs[src] = im; }
      });
      const xTo = gsap.quickTo(box, 'x', { duration: 0.6, ease: 'power3.out' });
      const yTo = gsap.quickTo(box, 'y', { duration: 0.6, ease: 'power3.out' });
      let lastX = 0;
      window.addEventListener('pointermove', (e) => {
        xTo(e.clientX + 24); yTo(e.clientY - box.offsetHeight / 2);
        // leichte Verzerrung je nach Tempo
        const v = gsap.utils.clamp(-12, 12, (e.clientX - lastX) * 0.4);
        lastX = e.clientX;
        gsap.to(box, { skewX: -v * 0.5, rotate: v * 0.25, duration: 0.5, ease: 'power3.out', overwrite: 'auto' });
      }, { passive: true });
      items.forEach((li) => {
        const src = li.querySelector('button').dataset.img;
        li.addEventListener('pointerenter', () => {
          Object.values(imgs).forEach((im) => gsap.to(im, { opacity: im === imgs[src] ? 1 : 0, duration: 0.4, overwrite: 'auto' }));
          gsap.to(box, { opacity: src ? 1 : 0, scale: src ? 1 : 0.9, duration: 0.5, ease: 'power3.out', overwrite: 'auto' });
        });
      });
      document.querySelector('.places').addEventListener('pointerleave', () => gsap.to(box, { opacity: 0, scale: 0.9, duration: 0.4 }));
    }
    // Touch und Tastatur: Antippen bzw. Enter klappt das Bild auf
    items.forEach((li) => {
      const btn = li.querySelector('button');
      if (!li.querySelector('.places__img')) { btn.setAttribute('aria-disabled', 'true'); return; }
      btn.setAttribute('aria-expanded', 'false');
      btn.addEventListener('click', () => {
        const open = !li.classList.contains('is-open');
        items.forEach((x) => { x.classList.remove('is-open'); const b = x.querySelector('button'); if (b.hasAttribute('aria-expanded')) b.setAttribute('aria-expanded', 'false'); });
        li.classList.toggle('is-open', open);
        btn.setAttribute('aria-expanded', String(open));
        ScrollTrigger.refresh();
      });
    });
  };
})();
