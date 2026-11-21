/* =========================================================
   MEDUSA – Scroll-Film der Startseite
   216 Einzelbilder auf einem Canvas, gesteuert vom Scrollen.
   Frau → Gorgone → Explosion → Schild → Logo
   ========================================================= */
(function () {
  'use strict';

  const M = (window.MEDUSA = window.MEDUSA || {});

  /* ---------- Feste Werte (am Video gemessen) ---------- */
  const FRAMES = 216;
  // Scroll-Anteil → Bildnummer (0-basiert). Explosion bekommt den längsten Weg (Zeitlupe).
  const MAP = [[0, 0], [0.10, 40], [0.35, 96], [0.42, 108], [0.68, 160], [0.82, 200], [0.88, 215], [1, 215]];
  const FOCUS = { x: 0.52, y: 0.48 };              // Fokuspunkt für den Cover-Zuschnitt
  const IMG_W = 1920, IMG_H = 1080;                // Bezugsraster (auch für die 1280er Handy-Bilder)
  const SHIELD = { x: 504, y: 86, size: 880 };     // Freisteller-Ausschnitt im letzten Bild (Mitte 944/526, Ø 870 px)
  const P_SHIELD_ON = 0.879;                       // ab hier liegt das Schild-Bild deckungsgleich über dem Canvas
  const P_FLY_START = 0.89, P_FLY_END = 0.995;     // Bogenflug zum Logo

  const mqMobile = window.matchMedia('(max-width: 900px), (pointer: coarse)');
  const isMobile = mqMobile.matches;
  // Schwächere Geräte (wenige Kerne oder wenig Speicher): leichtere 1280-px-Filmbilder, weniger Staub
  const lite = (navigator.hardwareConcurrency > 0 && navigator.hardwareConcurrency <= 4) || (navigator.deviceMemory > 0 && navigator.deviceMemory <= 4);
  const dir = isMobile || lite ? 'mobile' : 'desktop';
  const SRC_W = dir === 'mobile' ? 1280 : 1920;   // tatsächliche Breite der Filmbilder
  const PIN_VH = isMobile ? 4.5 : 6;

  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const smooth = (a, b, v) => { const t = clamp((v - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
  const src = (i) => 'media/hero/' + dir + '/f_' + String(i + 1).padStart(3, '0') + '.webp';

  function progressToFrame(p) {
    for (let k = 1; k < MAP.length; k++) {
      const p0 = MAP[k - 1][0], f0 = MAP[k - 1][1], p1 = MAP[k][0], f1 = MAP[k][1];
      if (p <= p1) return f0 + (f1 - f0) * ((p - p0) / (p1 - p0 || 1));
    }
    return FRAMES - 1;
  }

  /* ---------- Einzelbilder laden ---------- */
  const images = new Array(FRAMES);
  const loaded = new Uint8Array(FRAMES);
  let loadedFirst = 0;

  function loadFrame(i) {
    return new Promise((resolve) => {
      if (loaded[i]) return resolve(true);
      const img = new Image();
      img.decoding = 'async';
      img.onload = () => {
        const done = () => { images[i] = img; loaded[i] = 1; needsDraw = true; resolve(true); };
        if (img.decode) img.decode().then(done, done); else done();
      };
      img.onerror = () => resolve(false);
      img.src = src(i);
    });
  }

  function loadQueue(list, concurrency, onEach) {
    let idx = 0;
    const worker = async () => {
      while (idx < list.length) {
        const i = list[idx++];
        await loadFrame(i);
        if (onEach) onEach(i);
      }
    };
    return Promise.all(Array.from({ length: concurrency }, worker));
  }

  // Nie ein leeres Canvas: fehlt ein Bild, das nächste geladene nehmen
  function nearest(i) {
    if (loaded[i]) return i;
    for (let d = 1; d < FRAMES; d++) {
      if (i - d >= 0 && loaded[i - d]) return i - d;
      if (i + d < FRAMES && loaded[i + d]) return i + d;
    }
    return -1;
  }

  /* ---------- DOM ---------- */
  let hero, stage, canvas, ctx, shakeEl, parallaxEl, dustCanvas, dctx, flashEl, introEl, wordEl, shieldEl, header, logoImg;
  let cw = 0, ch = 0, dpr = 1, cover = { s: 1, dx: 0, dy: 0, dw: 0, dh: 0 };
  let dw = 0, dh = 0;
  let needsDraw = true, lastDrawn = -1, lastIdx = 0;
  let progress = 0, frameF = 0;
  let shieldBox = { x: 0, y: 0, size: 100 }, logoBox = { x: 0, y: 0, size: 44 };
  let heroVisible = true;
  let st = null;

  function resize() {
    const r = canvas.getBoundingClientRect();
    cw = canvas.offsetWidth || r.width;
    ch = canvas.offsetHeight || r.height;
    const s0 = Math.max(cw / IMG_W, ch / IMG_H);
    // Zeichenfläche nie feiner als die Filmbilder selbst: mehr Pixel bringen keine Schärfe, kosten aber Leistung
    const native = SRC_W / (IMG_W * s0);           // Bildpixel pro CSS-Pixel
    dpr = Math.max(1, Math.min(window.devicePixelRatio || 1, 1.5, native));
    canvas.width = Math.round(cw * dpr);
    canvas.height = Math.round(ch * dpr);
    // Zustand A: Cover-Zuschnitt mit Fokuspunkt (Gesicht)
    coverA = { s: s0, dx: clamp(cw / 2 - FOCUS.x * IMG_W * s0, cw - IMG_W * s0, 0), dy: clamp(ch / 2 - FOCUS.y * IMG_H * s0, ch - IMG_H * s0, 0) };
    // Zustand B (nur Hochformat): herauszoomen, bis der ganze Schild mit Rand ins Bild passt
    const sFit = Math.min(cw, ch) * 0.86 / 870;
    zoomOn = sFit < s0 * 0.98;
    const s1 = zoomOn ? sFit : s0;
    coverB = zoomOn ? { s: s1, dx: cw / 2 - 944 * s1, dy: ch / 2 - 526 * s1 } : coverA;
    setCover(zoomOn ? zoomT : 0);
    // Staub-Canvas
    dw = dustCanvas.offsetWidth; dh = dustCanvas.offsetHeight;
    dustCanvas.width = Math.round(dw);
    dustCanvas.height = Math.round(dh);
    initMotes();
    layoutShield();
    needsDraw = true;
  }

  let coverA = { s: 1, dx: 0, dy: 0 }, coverB = coverA, zoomOn = false, zoomT = 0;
  function setCover(t) {
    const s = lerp(coverA.s, coverB.s, t);
    cover = { s, dw: IMG_W * s, dh: IMG_H * s, dx: lerp(coverA.dx, coverB.dx, t), dy: lerp(coverA.dy, coverB.dy, t) };
  }

  function draw(i) {
    const n = nearest(i);
    if (n < 0) return;
    if (zoomOn && zoomT > 0) { ctx.fillStyle = '#000'; ctx.fillRect(0, 0, canvas.width, canvas.height); }
    ctx.drawImage(images[n], cover.dx * dpr, cover.dy * dpr, cover.dw * dpr, cover.dh * dpr);
    lastDrawn = i;
  }

  /* ---------- Schild → Logo ---------- */
  function layoutShield() {
    // Canvas liegt im Parallax-Rahmen, der 16 px über die Bühne hinausragt.
    // Der Schild liegt am Ende immer im Zustand B (auf dem Desktop identisch mit A).
    const ox = parallaxEl.offsetLeft, oy = parallaxEl.offsetTop;
    shieldBox = {
      x: ox + coverB.dx + SHIELD.x * coverB.s,
      y: oy + coverB.dy + SHIELD.y * coverB.s,
      size: SHIELD.size * coverB.s
    };
    shieldEl.style.width = shieldBox.size + 'px';
    shieldEl.style.height = shieldBox.size + 'px';
    const lr = logoImg.getBoundingClientRect();
    const hr = header.getBoundingClientRect();
    logoBox = { x: lr.left - hr.left, y: lr.top - hr.top, size: lr.width || 44 };
    updateShield();
  }

  const easeX = gsap.parseEase('power3.in');
  const easeYS = gsap.parseEase('power2.inOut');
  function updateShield() {
    const t = clamp((progress - P_FLY_START) / (P_FLY_END - P_FLY_START), 0, 1);
    // Mittelpunkte interpolieren; seitwärts läuft verzögert → Bogen nach oben links.
    // Größe und Höhe mit derselben Kurve, damit der Rand nie oben aus dem Bild ragt.
    const ex = easeX(t), ey = easeYS(t);
    const S0 = shieldBox.size;
    const cx = lerp(shieldBox.x + S0 / 2, logoBox.x + logoBox.size / 2, ex);
    const cy = lerp(shieldBox.y + S0 / 2, logoBox.y + logoBox.size / 2, ey);
    const size = lerp(S0, logoBox.size, ey);
    const rot = -24 * Math.sin(Math.PI * t);
    shieldEl.style.transform = 'translate3d(' + (cx - S0 / 2).toFixed(2) + 'px,' + (cy - S0 / 2).toFixed(2) + 'px,0) scale(' + (size / S0).toFixed(5) + ') rotate(' + rot.toFixed(2) + 'deg)';

    const onFilm = progress >= P_SHIELD_ON && progress < P_FLY_END;
    shieldEl.style.opacity = onFilm ? 1 : 0;
    const done = progress >= P_FLY_END;
    header.classList.toggle('is-hero', !done);
  }

  /* ---------- Staub und Partikel ---------- */
  const motes = [];
  const shards = [];
  let sprite = null;

  function makeSprite() {
    const c = document.createElement('canvas');
    c.width = c.height = 64;
    const g = c.getContext('2d');
    const grd = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    grd.addColorStop(0, 'rgba(255,244,222,1)');
    grd.addColorStop(0.25, 'rgba(232,206,160,.75)');
    grd.addColorStop(0.6, 'rgba(201,164,106,.18)');
    grd.addColorStop(1, 'rgba(201,164,106,0)');
    g.fillStyle = grd;
    g.fillRect(0, 0, 64, 64);
    sprite = c;
  }

  function initMotes() {
    motes.length = 0;
    const n = isMobile || lite ? 34 : 72;
    for (let i = 0; i < n; i++) {
      const z = Math.random() * 0.8 + 0.2;
      motes.push({
        x: Math.random() * dw, y: Math.random() * dh, z,
        vx: (Math.random() * 0.25 + 0.05) * z, vy: (Math.random() * 0.18 - 0.04) * z,
        r: (Math.random() * 2.2 + 0.8) * z * (z > 0.85 ? 2.4 : 1),
        ph: Math.random() * Math.PI * 2
      });
    }
  }

  // Lichtbündel von oben links: Staub leuchtet nur im Strahl
  function beamLight(x, y) {
    const nx = x / dw, ny = y / dh;
    const d = Math.abs(ny - (nx * 1.15 - 0.05)) ; // Abstand zur Strahlachse (ca. 50° von oben links)
    return 0.18 + 0.82 * Math.exp(-Math.pow(d / 0.32, 2)) * (1 - nx * 0.6);
  }

  function burst(n) {
    const cx = dw * 0.5, cy = dh * 0.46;
    for (let i = 0; i < n && shards.length < 260; i++) {
      const a = Math.random() * Math.PI * 2;
      const sp = Math.random() * 7 + 3;
      shards.push({
        x: cx + Math.cos(a) * dh * 0.12 * Math.random(), y: cy + Math.sin(a) * dh * 0.12 * Math.random(),
        px: 0, py: 0,
        vx: Math.cos(a) * sp, vy: Math.sin(a) * sp * 0.8,
        r: Math.random() * 1.6 + 0.6, g: Math.random() * 0.05 + 0.035, // Wachstum = fliegt auf die Kamera zu
        life: 1, decay: Math.random() * 0.012 + 0.01
      });
    }
  }

  let dustFade = 1;
  function drawDust(time) {
    dctx.clearRect(0, 0, dw, dh);
    if (dustFade <= 0.01) return;
    dctx.globalCompositeOperation = 'lighter';
    for (const m of motes) {
      m.x += m.vx; m.y += m.vy + Math.sin(time * 0.6 + m.ph) * 0.08;
      if (m.x > dw + 20) m.x = -20;
      if (m.y > dh + 20) m.y = -20;
      if (m.y < -20) m.y = dh + 20;
      const a = beamLight(m.x, m.y) * (0.45 + 0.35 * Math.sin(time * 1.3 + m.ph)) * m.z * dustFade;
      if (a < 0.02) continue;
      const s = m.r * 4;
      dctx.globalAlpha = Math.min(1, a);
      dctx.drawImage(sprite, m.x - s / 2, m.y - s / 2, s, s);
    }
    for (let i = shards.length - 1; i >= 0; i--) {
      const p = shards[i];
      p.px = p.x; p.py = p.y;
      p.vx *= 1.018; p.vy *= 1.018;
      p.x += p.vx; p.y += p.vy;
      p.r += p.g * p.r;
      p.life -= p.decay;
      if (p.life <= 0 || p.x < -80 || p.x > dw + 80 || p.y < -80 || p.y > dh + 80) { shards.splice(i, 1); continue; }
      dctx.globalAlpha = Math.max(0, p.life) * 0.85 * dustFade;
      dctx.strokeStyle = 'rgba(240,222,186,1)';
      dctx.lineWidth = p.r;
      dctx.lineCap = 'round';
      dctx.beginPath();
      dctx.moveTo(p.px - p.vx * 1.5, p.py - p.vy * 1.5);
      dctx.lineTo(p.x, p.y);
      dctx.stroke();
    }
    dctx.globalAlpha = 1;
    dctx.globalCompositeOperation = 'source-over';
  }

  /* ---------- Effekte: Lichtblitz, Wackeln ---------- */
  let shake = 0;
  function flash() {
    gsap.fromTo(flashEl, { opacity: 0 }, { opacity: 0.38, duration: 0.09, ease: 'power2.out', overwrite: true, onComplete: () => gsap.to(flashEl, { opacity: 0, duration: 0.7, ease: 'power2.out' }) });
  }

  /* ---------- Maus-Parallaxe ---------- */
  const mouse = { x: 0, y: 0, sx: 0, sy: 0 };
  let setPx, setPy, setDx, setDy, setIx;

  /* ---------- Ein Takt ---------- */
  function tick(time) {
    const idx = Math.round(clamp(frameF, 0, FRAMES - 1));

    if (idx !== lastIdx) {
      const fwd = idx > lastIdx;
      if (fwd && lastIdx < 100 && idx >= 100) flash();
      if (idx >= 112 && idx <= 136) {
        const env = idx <= 118 ? 1 : 1 - (idx - 118) / 18;
        shake = Math.max(shake, 6 * env);
      }
      lastIdx = idx;
    }

    // Hochformat: während „Das Zeichen“ herauszoomen, bis der Schild ganz zu sehen ist
    if (zoomOn) {
      const z = smooth(0.66, 0.84, progress);
      if (Math.abs(z - zoomT) > 0.0005) { zoomT = z; setCover(z); needsDraw = true; }
    }

    if (idx !== lastDrawn || needsDraw) { draw(idx); needsDraw = false; }

    // abklingendes Wackeln (max. 6 px)
    if (shake > 0.05) {
      shakeEl.style.transform = 'translate3d(' + ((Math.random() * 2 - 1) * shake).toFixed(2) + 'px,' + ((Math.random() * 2 - 1) * shake).toFixed(2) + 'px,0)';
      shake *= 0.86;
    } else if (shake !== 0) {
      shake = 0;
      shakeEl.style.transform = '';
    }

    // Parallaxe – blendet vor dem Schild-Flug aus, damit das Logo exakt deckungsgleich startet
    if (setPx) {
      const amt = 1 - smooth(0.8, 0.87, progress);
      mouse.sx += (mouse.x - mouse.sx) * 0.06;
      mouse.sy += (mouse.y - mouse.sy) * 0.06;
      setPx(-mouse.sx * 14 * amt); setPy(-mouse.sy * 10 * amt);
      setDx(mouse.sx * 26 * amt); setDy(mouse.sy * 18 * amt);
      setIx(mouse.sx * 10 * amt);
    }

    if (heroVisible) drawDust(time);
  }

  /* ---------- Text-Zeitleiste (0–100 = Scroll-Anteil in %) ---------- */
  function buildTimeline() {
    const tl = gsap.timeline({ paused: true, defaults: { ease: 'none' } });
    const hint = stage.querySelector('.hero__hint');
    const motto = stage.querySelector('.hero__motto');

    tl.to(hint, { autoAlpha: 0, duration: 3 }, 0);
    tl.to(motto, { autoAlpha: 0, y: -24, duration: 5, ease: 'power1.in' }, 5);
    // Phase 2: „MEDUSA“ blendet aus
    tl.to(introEl, { autoAlpha: 0, yPercent: -12, duration: 4.5, ease: 'power2.in' }, 8);

    teasers.forEach(({ el, a, b }) => {
      const split = new SplitText(el.querySelector('.teaser__text'), { type: 'lines', mask: 'lines', linesClass: 'line' });
      const cta = el.querySelector('.hero-btns');
      tl.fromTo(split.lines, { yPercent: 115 }, { yPercent: 0, duration: 2.2, stagger: 0.45, ease: 'power3.out' }, a);
      if (cta) tl.fromTo(cta, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 1.6, ease: 'power2.out' }, a + 0.6);
      tl.to(el, { opacity: 0, y: -28, duration: 1.5, ease: 'power2.in' }, b);
      // sichtbar im Sinne der Tastatur: Knöpfe bleiben fokussierbar, der Text ist per Maske verborgen
      gsap.set(el, { visibility: 'visible' });
    });

    // Phase 7: Film blendet aus, Kopfleiste + Schlange blenden ein
    // Canvas blendet aus, sobald das Schild-Bild deckungsgleich darüber liegt (88 %), noch bevor es losfliegt (89 %)
    tl.to([shakeEl, stage.querySelector('.hero__beam'), stage.querySelector('.hero__shade')], { opacity: 0, duration: 1, ease: 'power1.inOut' }, 88);
    tl.to({ v: 1 }, { v: 0, duration: 2, onUpdate: function () { dustFade = this.targets()[0].v; } }, 88);
    tl.fromTo([header.querySelector('.scene-indicator'), header.querySelector('.menu-btn')], { autoAlpha: 0 }, { autoAlpha: 1, duration: 5, ease: 'power2.out' }, 93);
    if (M.snake) tl.fromTo(M.snake, { autoAlpha: 0 }, { autoAlpha: 1, duration: 5 }, 93);
    tl.set({}, {}, 100);
    return tl;
  }

  /* ---------- Kapitel-Buttons im Film ---------- */
  let teasers = [];
  function collectTeasers() {
    teasers = Array.from(stage.querySelectorAll('.teaser')).map((el) => ({ el, a: parseFloat(el.dataset.in), b: parseFloat(el.dataset.out) }));
  }

  // Klickbar nur, solange der Abschnitt zu sehen ist
  function updateLive() {
    const pc = progress * 100;
    for (const t of teasers) t.el.classList.toggle('is-live', pc >= t.a + 1 && pc <= t.b + 0.4);
  }

  // Scroll-Anteil (0–100) → Scrollposition in px
  const pctToY = (pc) => st.start + (pc / 100) * (st.end - st.start);

  // Tastatur: Wer per Tab auf einen Knopf springt, bekommt den Film an die passende Stelle gespult
  function initTeaserFocus() {
    teasers.forEach((t) => {
      t.el.addEventListener('focusin', () => {
        if (!st) return;
        const pc = progress * 100;
        if (pc >= t.a + 2.6 && pc <= t.b) return;
        M.scrollTo(pctToY(Math.min(t.a + 3.2, t.b - 0.3)), { duration: 0.9 });
      });
    });
    introEl.addEventListener('focusin', () => {
      if (st && progress > 0.05) M.scrollTo(pctToY(0), { duration: 0.9 });
    });
  }

  /* ---------- Intro nach dem Laden ---------- */
  function introAnim(restored) {
    if (restored) {
      // Zurück aus einer Szene: der Film steht schon an der alten Stelle, nur das Bild blendet ein
      return gsap.fromTo(canvas, { opacity: 0 }, { opacity: 1, duration: 1.2, ease: 'power2.out' });
    }
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.fromTo(canvas, { opacity: 0, scale: 1.06 }, { opacity: 1, scale: 1, duration: 2.4, ease: 'power2.out' }, 0)
      .fromTo(wordEl, { yPercent: 105 }, { yPercent: 0, duration: 1.7, ease: 'power4.out' }, 0.35)
      .fromTo(stage.querySelector('.hero__greek'), { opacity: 0, letterSpacing: '1.2em' }, { opacity: 1, letterSpacing: '.5em', duration: 2 }, 0.6)
      .fromTo(stage.querySelector('.hero__sub'), { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 1.2 }, 0.95)
      .fromTo(stage.querySelectorAll('.hero__motto > *'), { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 1.2, stagger: 0.12 }, 1.1)
      .fromTo(stage.querySelector('.hero__hint'), { opacity: 0 }, { opacity: 1, duration: 1 }, 1.6);
    return tl;
  }

  /* ---------- Ladebildschirm ---------- */
  function runLoader(skip) {
    const loader = document.querySelector('.loader');
    return new Promise((resolve) => {
      if (skip || !loader) { if (loader) loader.remove(); resolve(); return; }
      const count = loader.querySelector('.loader__count');
      const ring = loader.querySelector('.ring');
      // Schlangenring: Kreis mit leichter Wellung wie Schuppen
      let d = '';
      for (let k = 0; k <= 360; k += 2) {
        const a = (k - 90) * Math.PI / 180;
        const r = 80 + Math.sin(a * 16) * 1.8;
        d += (k ? 'L' : 'M') + (90 + Math.cos(a) * r).toFixed(2) + ' ' + (90 + Math.sin(a) * r).toFixed(2);
      }
      ring.setAttribute('d', d);
      loader.querySelector('.ring-track').setAttribute('d', d);
      gsap.set(ring, { drawSVG: '0%' });

      const t0 = performance.now();
      const shown = { v: 0 };
      const step = () => {
        const el = (performance.now() - t0) / 1000;
        const target = Math.min(1, loadedFirst / 40) * 100;
        const forced = el > 1.75 ? 100 : target;          // spätestens nach 2 s fertig
        shown.v += (Math.max(target, forced) - shown.v) * (el > 1.75 ? 0.3 : 0.12);
        if (el < 0.9) shown.v = Math.min(shown.v, el / 0.9 * 100); // nicht hektisch
        const v = Math.round(shown.v);
        count.textContent = v;
        gsap.set(ring, { drawSVG: '0% ' + v + '%' });
        if (v >= 100 && loaded[0]) { gsap.ticker.remove(step); open(); }
      };
      gsap.ticker.add(step);

      const open = () => {
        loader.classList.add('is-done');
        gsap.timeline({ onComplete: () => loader.remove() })
          .to(loader.querySelector('.loader__center'), { opacity: 0, scale: 0.96, duration: 0.35, ease: 'power2.in' })
          .to(loader.querySelector('.loader__beam'), { scaleY: 1, duration: 0.45, ease: 'power3.inOut' }, 0.15)
          .add(resolve, 0.55)
          .to(loader.querySelector('.loader__panel--l'), { xPercent: -100, duration: 1.25, ease: 'power4.inOut' }, 0.55)
          .to(loader.querySelector('.loader__panel--r'), { xPercent: 100, duration: 1.25, ease: 'power4.inOut' }, 0.55)
          .to(loader.querySelector('.loader__beam'), { scaleX: 60, opacity: 0, duration: 1.1, ease: 'power3.inOut' }, 0.6);
      };
    });
  }

  /* ---------- Szenen-Übersicht ---------- */
  function initOverview() {
    const ov = document.querySelector('.overview');
    if (!ov) return;
    const bg = ov.querySelector('.overview__bg');
    // Motive in einer bildschirmgroßen, mitlaufenden Fläche (statt auf die Listenhöhe gestreckt)
    const stick = document.createElement('div');
    stick.className = 'overview__sticky';
    bg.appendChild(stick);
    const items = ov.querySelectorAll('.ov-item');
    const SZ = window.MEDUSA_SZENEN || [];
    const layers = [];
    items.forEach((li, i) => {
      const m = M.motifEl(SZ[i], 'overview__motif');
      stick.appendChild(m);
      layers.push(m);
    });
    const show = (i) => {
      items.forEach((li, k) => li.classList.toggle('is-active', k === i));
      layers.forEach((m, k) => gsap.to(m, { opacity: k === i ? 1 : 0, scale: k === i ? 1 : 1.06, duration: k === i ? 1 : 0.7, ease: 'power3.out', overwrite: 'auto' }));
    };
    items.forEach((li, i) => {
      const a = li.querySelector('a');
      a.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse') show(i); });
      a.addEventListener('focus', () => show(i));
      if (!M.finePointer && !M.reduced) {
        // Touch: Motiv erscheint, wenn der Eintrag in die Bildmitte kommt
        ScrollTrigger.create({ trigger: li, start: 'top 55%', end: 'bottom 45%', onToggle: (self) => { if (self.isActive) show(i); } });
      }
    });
    ov.querySelector('.overview__list').addEventListener('pointerleave', () => show(-1));

    if (!M.reduced) {
      gsap.set(items, { opacity: 0, y: 40 });
      ScrollTrigger.batch(items, {
        start: 'top 92%', once: true,
        onEnter: (els) => gsap.to(els, { opacity: 1, y: 0, duration: 1.1, ease: 'power3.out', stagger: 0.08 })
      });
    }
  }

  /* ---------- Start ---------- */
  function init(opts) {
    hero = document.querySelector('.hero');
    stage = hero.querySelector('.hero__stage');
    canvas = stage.querySelector('.hero__canvas');
    ctx = canvas.getContext('2d', { alpha: false });
    shakeEl = stage.querySelector('.hero__shake');
    parallaxEl = stage.querySelector('.hero__parallax');
    dustCanvas = stage.querySelector('.hero__dust');
    dctx = dustCanvas.getContext('2d');
    flashEl = stage.querySelector('.hero__flash');
    introEl = stage.querySelector('.hero__intro');
    wordEl = stage.querySelector('.hero__word');
    shieldEl = stage.querySelector('.hero__shield');
    header = document.querySelector('.site-header');
    logoImg = header.querySelector('.logo img');
    collectTeasers();

    initOverview();

    /* „Bewegung reduzieren“: kein Pin, kein Film – Bild C als Standbild, Texte untereinander */
    if (M.reduced) {
      header.classList.remove('is-hero');
      document.querySelector('.loader') && document.querySelector('.loader').remove();
      opts.revealPage();
      return;
    }

    header.classList.add('is-hero');
    gsap.set([header.querySelector('.scene-indicator'), header.querySelector('.menu-btn')], { autoAlpha: 0 });
    if (M.snake) gsap.set(M.snake, { autoAlpha: 0 });
    gsap.set(canvas, { opacity: 0 });
    gsap.set(wordEl, { yPercent: 105 });
    gsap.set([stage.querySelector('.hero__greek'), stage.querySelector('.hero__sub'), stage.querySelector('.hero__hint')].concat(Array.from(stage.querySelectorAll('.hero__motto > *'))), { opacity: 0 });

    makeSprite();
    resize();

    // „Zurück“ aus einer Szene: Film an derselben Stelle wie vorher (Position beim Verlassen gemerkt)
    let restoreY = 0;
    try {
      const nav = performance.getEntriesByType && performance.getEntriesByType('navigation')[0];
      if (nav && nav.type === 'back_forward') restoreY = parseInt(sessionStorage.getItem('medusa-home-y'), 10) || 0;
    } catch (e) { /* ohne Speicher: Start oben */ }
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    const restoreFrame = restoreY ? Math.round(progressToFrame(clamp(restoreY / (window.innerHeight * PIN_VH), 0, 1))) : 0;

    // Laden: zuerst die 40 Bilder um die Startstelle (normal: Bild 1–40), dann der Rest im Hintergrund
    const order = Array.from({ length: FRAMES }, (_, i) => i).sort((x, y) => Math.abs(x - restoreFrame) - Math.abs(y - restoreFrame) || x - y);
    const first = order.slice(0, 40);
    const rest = order.slice(40);
    const firstDone = loadQueue(first, 6, () => { loadedFirst++; });
    firstDone.then(() => loadQueue(rest, 4));

    // Maus-Parallaxe (nur mit Maus)
    if (M.finePointer) {
      setPx = gsap.quickSetter(parallaxEl, 'x', 'px');
      setPy = gsap.quickSetter(parallaxEl, 'y', 'px');
      setDx = gsap.quickSetter(dustCanvas, 'x', 'px');
      setDy = gsap.quickSetter(dustCanvas, 'y', 'px');
      setIx = gsap.quickSetter(introEl, 'x', 'px');
      window.addEventListener('pointermove', (e) => {
        if (e.pointerType !== 'mouse') return;
        mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        mouse.y = (e.clientY / window.innerHeight) * 2 - 1;
      }, { passive: true });
    }

    // Bühne außerhalb des Bildes: Staub nicht zeichnen
    new IntersectionObserver((en) => { heroVisible = en[0].isIntersecting; }).observe(stage);

    const fromTransition = document.documentElement.classList.contains('tr-in');

    // Szenen-Übersicht liegt unter der Bühne und blendet ein, während der Schild zum Logo fliegt
    const overview = document.querySelector('.overview');
    const tuck = () => { if (overview) overview.style.marginTop = -hero.offsetHeight + 'px'; };
    tuck();
    ScrollTrigger.addEventListener('refreshInit', tuck);

    opts.fonts.then(() => {
      if (restoreY) {
        // Intro-Elemente im Endzustand, damit die Zeitleiste sie beim Zurückscrollen richtig zeigt
        gsap.set(wordEl, { yPercent: 0 });
        gsap.set([stage.querySelector('.hero__greek'), stage.querySelector('.hero__sub'), stage.querySelector('.hero__hint')].concat(Array.from(stage.querySelectorAll('.hero__motto > *'))), { opacity: 1 });
      }
      const tl = buildTimeline();
      ScrollTrigger.config({ ignoreMobileResize: true });
      st = ScrollTrigger.create({
        trigger: hero,
        start: 'top top',
        end: () => '+=' + Math.round(window.innerHeight * PIN_VH),
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
        animation: tl,
        scrub: true,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          progress = self.progress;
          frameF = progressToFrame(progress);
          updateShield();
          updateLive();
        },
        onRefresh: (self) => {
          progress = self.progress;
          frameF = progressToFrame(progress);
          updateLive();
          M.headerHideAfter = self.end + window.innerHeight * 0.6;
        }
      });
      initTeaserFocus();
      ScrollTrigger.addEventListener('refreshInit', () => { gsap.set(parallaxEl, { x: 0, y: 0 }); });
      ScrollTrigger.addEventListener('refresh', resize);
      gsap.ticker.add(tick);
      M.initReveals && M.initReveals();
      ScrollTrigger.refresh();

      if (restoreY) {
        window.scrollTo(0, restoreY);
        if (M.lenis) M.lenis.scrollTo(restoreY, { immediate: true, force: true });
        ScrollTrigger.update();
      }

      // Ladebildschirm (nicht beim Zurückkommen über einen Seitenübergang)
      const ready = fromTransition
        ? firstDone.then(() => opts.revealPage())
        : runLoader(false);
      ready.then(() => introAnim(!!restoreY));
    });
  }

  M.hero = { init };
})();
