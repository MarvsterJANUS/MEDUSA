/* Γ Perseus – große Momente: horizontaler Fries mit Parallax-Ebenen,
   danach Black-out: Medusa ist nur im runden Spiegelschild sichtbar, der Maus bzw. Finger folgt. */
(function () {
  'use strict';
  const M = (window.MEDUSA = window.MEDUSA || {});

  M.scene = function () {
    /* ---------- Fries ---------- */
    const pin = document.querySelector('.frieze__pin');
    const track = document.querySelector('.frieze__track');
    const dist = () => Math.max(0, track.scrollWidth - window.innerWidth);

    const move = gsap.to(track, {
      x: () => -dist(),
      ease: 'none',
      scrollTrigger: {
        trigger: pin,
        start: 'top top',
        end: () => '+=' + dist(),
        pin: true,
        scrub: 0.8,
        invalidateOnRefresh: true,
        onUpdate: (self) => gsap.set('.frieze__bar i', { scaleX: self.progress })
      }
    });

    // Tastatur: Fokus in einer Station → Fries so weit fahren, dass sie zu sehen ist
    M.focusTargets.push({
      root: pin,
      y: (el) => {
        const st = move.scrollTrigger;
        const item = el.closest('.station, .frieze__intro');
        if (!item || !st) return null;
        const x = Math.max(0, Math.min(dist(), item.offsetLeft - window.innerWidth * 0.18));
        return st.start + (dist() ? x / dist() : 0) * (st.end - st.start) + 2;
      }
    });

    // Parallax: Bild im Rahmen langsamer, Nummer schneller als die Station
    gsap.utils.toArray('.station').forEach((st) => {
      const sc = { containerAnimation: move, trigger: st, start: 'left right', end: 'right left', scrub: true };
      gsap.fromTo(st.querySelector('.station__img img'), { xPercent: -7 }, { xPercent: 7, ease: 'none', scrollTrigger: sc });
      gsap.fromTo(st.querySelector('.station__no'), { x: 90 }, { x: -90, ease: 'none', scrollTrigger: Object.assign({}, sc) });
      gsap.fromTo(st.querySelector('.station__text'), { opacity: 0.15, y: 30 }, { opacity: 1, y: 0, ease: 'power2.out', scrollTrigger: { containerAnimation: move, trigger: st, start: 'left 85%', end: 'left 40%', scrub: true } });
    });

    /* ---------- Spiegelschild ---------- */
    const stage = document.querySelector('.mirror-stage');
    const mirror = stage.querySelector('.mirror');
    const inner = stage.querySelector('.mirror__inner');
    let W = 0, H = 0, D = 0;
    const pos = { x: 0, y: 0, tx: 0, ty: 0 };
    let lastInput = -1e9, visible = false;

    const layout = () => {
      W = stage.clientWidth; H = stage.clientHeight; D = mirror.offsetWidth;
      inner.style.width = W + 'px';
      inner.style.height = H + 'px';
      if (!pos.x) { pos.x = pos.tx = W * 0.5; pos.y = pos.ty = H * 0.58; }
    };
    layout();
    window.addEventListener('resize', layout);

    const setTarget = (cx, cy) => {
      const r = stage.getBoundingClientRect();
      pos.tx = cx - r.left; pos.ty = cy - r.top;
      lastInput = performance.now();
    };
    stage.addEventListener('pointermove', (e) => setTarget(e.clientX, e.clientY), { passive: true });
    stage.addEventListener('touchstart', (e) => { const t = e.touches[0]; setTarget(t.clientX, t.clientY); }, { passive: true });
    stage.addEventListener('touchmove', (e) => { const t = e.touches[0]; setTarget(t.clientX, t.clientY); }, { passive: true });

    new IntersectionObserver((en) => { visible = en[0].isIntersecting; }).observe(stage);

    gsap.ticker.add((time) => {
      if (!visible) return;
      // ohne Eingabe: der Spiegel tastet langsam die Dunkelheit ab
      if (performance.now() - lastInput > 2200) {
        pos.tx = W * 0.5 + Math.sin(time * 0.35) * W * 0.28;
        pos.ty = H * 0.56 + Math.sin(time * 0.53 + 1) * H * 0.2;
      }
      pos.x += (pos.tx - pos.x) * 0.09;
      pos.y += (pos.ty - pos.y) * 0.09;
      const x = Math.max(D * 0.3, Math.min(W - D * 0.3, pos.x));
      const y = Math.max(D * 0.3, Math.min(H - D * 0.3, pos.y));
      mirror.style.transform = 'translate3d(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px,0)';
      // Bild bleibt an der Bühne ausgerichtet: Gegenbewegung im Inneren
      inner.style.transform = 'translate3d(' + (D / 2 - x).toFixed(1) + 'px,' + (D / 2 - y).toFixed(1) + 'px,0)';
    });

    gsap.fromTo(stage.querySelector('.mirror-stage__hint'), { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1.4, ease: 'power3.out', scrollTrigger: { trigger: stage, start: 'top 60%', once: true } });
  };
})();
