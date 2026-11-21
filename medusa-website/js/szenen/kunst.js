/* Η Kunst – großer Moment: Liste der Werke, das Bild folgt dem Cursor (leicht verzerrt);
   Klick öffnet das Werkblatt im Vollbild. Dazu der Regler Cellini ↔ Garbati (Rollentausch). */
(function () {
  'use strict';
  const M = (window.MEDUSA = window.MEDUSA || {});

  M.scene = function () {
    const btns = gsap.utils.toArray('.werk__btn');

    /* ---------- Bild folgt dem Cursor (nur mit Maus) ---------- */
    if (M.finePointer) {
      const box = document.createElement('div');
      box.className = 'cursor-img cursor-img--kunst';
      box.setAttribute('aria-hidden', 'true');
      document.body.appendChild(box);
      const imgs = {};
      btns.forEach((b) => {
        const src = b.dataset.img;
        if (src && !imgs[src]) { const im = new Image(); im.src = src; im.alt = ''; im.decoding = 'async'; box.appendChild(im); imgs[src] = im; }
      });
      const xTo = gsap.quickTo(box, 'x', { duration: 0.6, ease: 'power3.out' });
      const yTo = gsap.quickTo(box, 'y', { duration: 0.6, ease: 'power3.out' });
      let lastX = 0;
      window.addEventListener('pointermove', (e) => {
        xTo(e.clientX + 28); yTo(e.clientY - box.offsetHeight / 2);
        const v = gsap.utils.clamp(-14, 14, (e.clientX - lastX) * 0.45);
        lastX = e.clientX;
        gsap.to(box, { skewX: -v * 0.5, rotate: v * 0.25, duration: 0.5, ease: 'power3.out', overwrite: 'auto' });
      }, { passive: true });
      btns.forEach((b) => {
        b.addEventListener('pointerenter', () => {
          const cur = imgs[b.dataset.img];
          Object.values(imgs).forEach((im) => gsap.to(im, { opacity: im === cur ? 1 : 0, scale: im === cur ? 1 : 1.08, duration: 0.45, overwrite: 'auto' }));
          gsap.to(box, { opacity: 1, scale: 1, duration: 0.5, ease: 'power3.out', overwrite: 'auto' });
        });
      });
      document.querySelector('.werke').addEventListener('pointerleave', () => gsap.to(box, { opacity: 0, scale: 0.9, duration: 0.4 }));
    }

    /* ---------- Werkblatt im Vollbild ---------- */
    let open = null, opener = null;
    const back = document.createElement('div');
    back.className = 'werkblatt-back';
    document.body.appendChild(back);
    const closeBtnHtml = '<button type="button" class="werkblatt__close">Schließen ✕</button>';
    gsap.utils.toArray('.werkblatt').forEach((w) => {
      w.setAttribute('role', 'dialog');
      w.setAttribute('aria-modal', 'true');
      w.setAttribute('data-lenis-prevent', '');
      document.body.appendChild(w);   // außerhalb von <main>, das beim Öffnen gesperrt (inert) wird
      w.insertAdjacentHTML('afterbegin', closeBtnHtml);
      w.querySelector('.werkblatt__close').addEventListener('click', () => close());
    });
    function setInert(on) { document.querySelectorAll('main, .site-header').forEach((el) => { el.inert = on; }); }
    function show(id, from) {
      const w = document.getElementById(id);
      if (!w) return;
      if (open) close(true);
      open = w; opener = from || null;
      w.hidden = false;
      w.scrollTop = 0;
      setInert(true);
      if (M.lenis) M.lenis.stop();
      back.classList.add('is-open');
      gsap.fromTo(back, { opacity: 0 }, { opacity: 1, duration: 0.4 });
      gsap.fromTo(w, { opacity: 0 }, { opacity: 1, duration: 0.5, ease: 'power2.out' });
      gsap.fromTo(w.querySelector('.werkblatt__fig img'), { scale: 1.06, opacity: 0 }, { scale: 1, opacity: 1, duration: 1, ease: 'power3.out' });
      gsap.fromTo(w.querySelectorAll('.werkblatt__text > *'), { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.05, delay: 0.15 });
      setTimeout(() => w.querySelector('.werkblatt__close').focus({ preventScroll: true }), 60);
    }
    function close(instant) {
      if (!open) return;
      const w = open;
      open = null;
      back.classList.remove('is-open');
      const done = () => { w.hidden = true; };
      if (instant || M.reduced) { gsap.set([w, back], { opacity: 0 }); done(); }
      else { gsap.to(back, { opacity: 0, duration: 0.35 }); gsap.to(w, { opacity: 0, duration: 0.35, onComplete: done }); }
      setInert(false);
      if (M.lenis) M.lenis.start();
      if (opener && !instant) opener.focus({ preventScroll: true });
    }
    btns.forEach((b) => {
      b.setAttribute('aria-haspopup', 'dialog');
      b.setAttribute('aria-controls', b.dataset.werk);
      b.addEventListener('click', () => show(b.dataset.werk, b));
    });
    back.addEventListener('click', () => close());
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });

    /* ---------- Regler Cellini ↔ Garbati ---------- */
    const swap = document.querySelector('.swap');
    if (swap) {
      const range = swap.querySelector('.swap__range');
      const set = (v) => { swap.style.setProperty('--p', v + '%'); };
      range.addEventListener('input', () => set(range.value));
      set(range.value);
      // beim Hineinscrollen einmal von rechts nach links gleiten: erst Cellini, dann der Tausch
      const o = { v: 100 };
      set(100); range.value = 100;
      gsap.to(o, {
        v: 50, duration: 1.8, ease: 'power3.inOut',
        scrollTrigger: { trigger: swap, start: 'top 65%', once: true },
        onUpdate: () => { set(o.v.toFixed(2)); range.value = Math.round(o.v); }
      });
    }
  };
})();
