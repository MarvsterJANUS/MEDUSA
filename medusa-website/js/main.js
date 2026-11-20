/* =========================================================
   MEDUSA – gemeinsames Skript aller Seiten
   Lenis + GSAP-Takt, Filmkorn, Cursor, Kopfleiste, Menü,
   Fortschritts-Schlange, Seitenübergänge, Einblendungen
   ========================================================= */
(function () {
  'use strict';

  gsap.registerPlugin(ScrollTrigger, SplitText, DrawSVGPlugin);

  const html = document.documentElement;
  const body = document.body;
  const base = body.dataset.base || '';
  const SZENEN = window.MEDUSA_SZENEN || [];
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (reduced) html.classList.add('reduced-motion');

  const M = (window.MEDUSA = window.MEDUSA || {});
  M.base = base;
  M.reduced = reduced;
  M.finePointer = finePointer;

  /* ---------- Ein Takt für alles: Lenis über den GSAP-Ticker ---------- */
  let lenis = null;
  if (!reduced && typeof Lenis !== 'undefined') {
    lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 0.9, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }
  M.lenis = lenis;
  M.scrollTo = (y, opts) => (lenis ? lenis.scrollTo(y, opts) : window.scrollTo(0, typeof y === 'number' ? y : 0));

  const scrollY = () => (lenis ? lenis.scroll : window.scrollY);

  /* ---------- Filmkorn ---------- */
  function initGrain() {
    const el = document.createElement('div');
    el.className = 'grain';
    el.setAttribute('aria-hidden', 'true');
    const c = document.createElement('canvas');
    c.width = c.height = 180;
    const ctx = c.getContext('2d');
    const img = ctx.createImageData(180, 180);
    for (let i = 0; i < img.data.length; i += 4) {
      const v = Math.random() * 255;
      img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
      img.data[i + 3] = 255;
    }
    ctx.putImageData(img, 0, 0);
    el.style.backgroundImage = 'url(' + c.toDataURL('image/png') + ')';
    body.appendChild(el);

    const vig = document.createElement('div');
    vig.className = 'vignette';
    vig.setAttribute('aria-hidden', 'true');
    body.appendChild(vig);

    if (reduced) return;
    let n = 0;
    gsap.ticker.add(() => {
      if (++n % 4) return; // ca. 15 Bilder pro Sekunde – wie echtes Korn
      el.style.transform = 'translate(' + (Math.random() * 10 - 5).toFixed(2) + '%,' + (Math.random() * 10 - 5).toFixed(2) + '%)';
    });
  }

  /* ---------- Cursor: goldener Ring mit Verzögerung ---------- */
  function initCursor() {
    if (!finePointer || reduced) return;
    const ring = document.createElement('div');
    ring.className = 'cursor';
    ring.setAttribute('aria-hidden', 'true');
    body.appendChild(ring);
    const xTo = gsap.quickTo(ring, 'x', { duration: 0.45, ease: 'power3.out' });
    const yTo = gsap.quickTo(ring, 'y', { duration: 0.45, ease: 'power3.out' });
    window.addEventListener('pointermove', (e) => {
      if (e.pointerType !== 'mouse') return;
      xTo(e.clientX); yTo(e.clientY);
      ring.classList.add('is-visible');
    }, { passive: true });
    document.addEventListener('pointerleave', () => ring.classList.remove('is-visible'));
    document.addEventListener('pointerover', (e) => {
      const hot = e.target.closest('a, button, input, [data-cursor]');
      gsap.to(ring, { scale: hot ? 1.7 : 1, backgroundColor: hot ? 'rgba(201,164,106,.08)' : 'rgba(201,164,106,0)', duration: 0.5, ease: 'power3.out', overwrite: 'auto' });
    });
  }

  /* ---------- Motiv-Platzhalter ---------- */
  function motifEl(s, cls) {
    const d = document.createElement('div');
    d.className = 'motif ' + (cls || '');
    d.dataset.motiv = s ? s.motiv : '';
    d.innerHTML = '<span class="motif__ghost">' + (s ? s.b : 'Μ') + '</span>' +
      '<span class="motif__label">Platzhalter · Motiv ' + (s ? s.motiv : '') + ' folgt</span>';
    return d;
  }
  M.motifEl = motifEl;

  /* ---------- Kopfleiste ---------- */
  const header = document.querySelector('.site-header');
  let headerHidden = false;
  function setHeaderHidden(hide) {
    if (!header || hide === headerHidden) return;
    headerHidden = hide;
    gsap.to(header, { yPercent: hide ? -110 : 0, duration: 0.7, ease: 'power3.out', overwrite: 'auto' });
  }
  M.setHeaderHidden = setHeaderHidden;

  function initHeader() {
    if (!header) return;
    const ind = header.querySelector('.scene-indicator');
    const id = body.dataset.szene;
    const s = SZENEN.find((x) => x.id === id);
    if (ind) ind.innerHTML = s ? '<span class="greek">' + s.b + '</span> · ' + s.t : 'Die Verwandlung';

    let last = 0;
    const onScroll = () => {
      const y = scrollY();
      const dy = y - last;
      last = y;
      if (header.classList.contains('is-hero') || menuOpen) return;
      if (y < (M.headerHideAfter || 80)) setHeaderHidden(false);
      else if (dy > 3) setHeaderHidden(true);
      else if (dy < -3) setHeaderHidden(false);
    };
    if (lenis) lenis.on('scroll', onScroll);
    else window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---------- Vollbild-Menü ---------- */
  let menuOpen = false;
  let menu, menuBtn, menuTl;
  function initMenu() {
    menuBtn = document.querySelector('.menu-btn');
    if (!menuBtn) return;
    const current = body.dataset.szene || 'home';
    const items = [{ id: 'home', b: 'Μ', t: 'Startseite', hint: 'Die Verwandlung', href: base + 'index.html' }]
      .concat(SZENEN.map((s, i) => ({ id: s.id, b: s.b, t: s.t, hint: 'Szene ' + (i + 1) + ' von 9', href: base + 'szenen/' + s.id + '.html', s })));

    menu = document.createElement('div');
    menu.className = 'menu';
    menu.id = 'menu';
    menu.hidden = true;
    menu.setAttribute('role', 'dialog');
    menu.setAttribute('aria-modal', 'true');
    menu.setAttribute('aria-label', 'Menü');
    const bg = document.createElement('div');
    bg.className = 'menu__bg';
    bg.innerHTML = '<img class="menu__shield" src="' + base + 'media/ui/schild-1024.webp" alt="">';
    const nav = document.createElement('nav');
    nav.className = 'menu__nav';
    nav.setAttribute('aria-label', 'Hauptnavigation');
    const ol = document.createElement('ol');
    ol.className = 'menu__list';
    items.forEach((it) => {
      const m = motifEl(it.s, 'menu__motif');
      if (!it.s) m.querySelector('.motif__label').textContent = '';
      bg.appendChild(m);
      const li = document.createElement('li');
      li.className = 'menu__item';
      li.innerHTML = '<a href="' + it.href + '"' + (it.id === current ? ' aria-current="page"' : '') + '>' +
        '<span class="menu__letter" aria-hidden="true">' + it.b + '</span>' +
        '<span class="menu__title">' + it.t + '</span>' +
        '<span class="menu__hint">' + (it.id === current ? 'Du bist hier' : it.hint) + '</span></a>';
      const a = li.querySelector('a');
      const show = () => { gsap.to(bg.querySelectorAll('.menu__motif'), { opacity: 0, duration: 0.6, overwrite: 'auto' }); gsap.to(m, { opacity: 0.6, duration: 0.8, ease: 'power3.out', overwrite: 'auto' }); };
      a.addEventListener('pointerenter', show);
      a.addEventListener('focus', show);
      ol.appendChild(li);
    });
    nav.appendChild(ol);
    const foot = document.createElement('p');
    foot.className = 'menu__foot';
    foot.textContent = 'Esc schließt das Menü';
    nav.appendChild(foot);
    menu.appendChild(bg);
    menu.appendChild(nav);
    header.after(menu);

    menuBtn.setAttribute('aria-controls', 'menu');
    menuBtn.setAttribute('aria-expanded', 'false');
    menuBtn.addEventListener('click', () => (menuOpen ? closeMenu() : openMenu()));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && menuOpen) closeMenu(); });
  }

  function setInert(on) {
    document.querySelectorAll('main, .site-footer, .hero').forEach((el) => { el.inert = on; });
  }

  function openMenu() {
    if (menuOpen) return;
    menuOpen = true;
    setHeaderHidden(false);
    header.classList.add('menu-open');
    menu.hidden = false;
    menuBtn.setAttribute('aria-expanded', 'true');
    menuBtn.querySelector('.menu-btn__label').textContent = 'Schließen';
    if (lenis) lenis.stop();
    setInert(true);
    if (menuTl) menuTl.kill();
    const titles = menu.querySelectorAll('.menu__item');
    menuTl = gsap.timeline()
      .fromTo(menu, { opacity: 0 }, { opacity: 1, duration: reduced ? 0 : 0.5, ease: 'power2.out' })
      .fromTo(menu.querySelector('.menu__shield'), { scale: 1.12, rotate: -12, opacity: 0 }, { scale: 1, rotate: 0, opacity: 0.13, duration: reduced ? 0 : 1.6, ease: 'power3.out' }, 0)
      .fromTo(titles, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: reduced ? 0 : 0.9, ease: 'power3.out', stagger: 0.045 }, 0.1);
    const cur = menu.querySelector('[aria-current="page"]') || menu.querySelector('a');
    setTimeout(() => cur && cur.focus({ preventScroll: true }), 60);
  }

  function closeMenu(instant) {
    if (!menuOpen) return;
    menuOpen = false;
    menuBtn.setAttribute('aria-expanded', 'false');
    menuBtn.querySelector('.menu-btn__label').textContent = 'Menü';
    setInert(false);
    if (menuTl) menuTl.kill();
    const done = () => { menu.hidden = true; header.classList.remove('menu-open'); if (lenis) lenis.start(); };
    if (instant || reduced) { gsap.set(menu, { opacity: 0 }); done(); }
    else gsap.to(menu, { opacity: 0, duration: 0.45, ease: 'power2.inOut', onComplete: done });
    menuBtn.focus({ preventScroll: true });
  }
  M.closeMenu = closeMenu;

  /* ---------- Fortschritts-Schlange ---------- */
  let snake = null;
  function initSnake() {
    const ns = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('class', 'progress-snake');
    svg.setAttribute('aria-hidden', 'true');
    const track = document.createElementNS(ns, 'path');
    track.setAttribute('class', 'track');
    const fill = document.createElementNS(ns, 'path');
    fill.setAttribute('class', 'fill');
    const head = document.createElementNS(ns, 'circle');
    head.setAttribute('class', 'head');
    head.setAttribute('r', '2.6');
    svg.append(track, fill, head);
    body.appendChild(svg);

    let len = 0;
    let p = 0;
    const build = () => {
      const H = window.innerHeight;
      svg.setAttribute('viewBox', '0 0 24 ' + H);
      const waves = Math.max(4, Math.round(H / 130));
      let d = '';
      for (let y = 4; y <= H - 4; y += 4) {
        const x = 12 + Math.sin(((y - 4) / (H - 8)) * waves * Math.PI * 2) * 5.5;
        d += (d ? 'L' : 'M') + x.toFixed(2) + ' ' + y;
      }
      track.setAttribute('d', d);
      fill.setAttribute('d', d);
      len = fill.getTotalLength();
      draw();
    };
    const draw = () => {
      gsap.set(fill, { drawSVG: '0 ' + (p * 100).toFixed(3) + '%' });
      const pt = fill.getPointAtLength(Math.max(0.01, len * p));
      head.setAttribute('cx', pt.x.toFixed(2));
      head.setAttribute('cy', pt.y.toFixed(2));
    };
    build();
    window.addEventListener('resize', build);
    ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: (self) => { p = self.progress; draw(); },
      onRefresh: (self) => { p = self.progress; draw(); }
    });
    snake = svg;
    M.snake = svg;
  }

  /* ---------- Seitenübergänge (ohne Fetch – funktioniert per Doppelklick offline) ---------- */
  let leaving = false;
  let trEl, wave;
  function initTransition() {
    trEl = document.querySelector('.transition');
    if (!trEl) {
      trEl = document.createElement('div');
      trEl.className = 'transition';
      trEl.setAttribute('aria-hidden', 'true');
      trEl.innerHTML = '<div class="transition__wave"><div class="transition__smoke"></div></div>';
      body.appendChild(trEl);
    }
    wave = trEl.querySelector('.transition__wave');

    document.addEventListener('click', (e) => {
      const a = e.target.closest('a');
      if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      if ((a.target && a.target !== '_self') || a.hasAttribute('download')) return;
      const href = a.getAttribute('href');
      if (!href || href.charAt(0) === '#' || /^(https?:|mailto:|tel:|javascript:)/i.test(href)) return;
      if (!/\.html(#.*)?$/i.test(href)) return;
      e.preventDefault();
      const url = a.href;
      if (url.split('#')[0] === location.href.split('#')[0]) { // gleiche Seite: nur Menü schließen, nach oben
        closeMenu();
        M.scrollTo(0, { duration: 1.6 });
        return;
      }
      navigate(url);
    });

    // Zurück-Taste: Seite aus dem Cache wiederhergestellt -> Übergang zurücksetzen
    window.addEventListener('pageshow', (e) => {
      if (!e.persisted) return;
      leaving = false;
      trEl.classList.remove('is-active');
      gsap.set(wave, { yPercent: 110 });
      if (menuOpen) closeMenu(true);
      if (lenis) lenis.start();
    });
  }

  function navigate(url) {
    if (leaving) return;
    leaving = true;
    try { sessionStorage.setItem('medusa-tr', '1'); } catch (err) { /* ohne Speicher: kein Problem */ }
    if (reduced) { location.href = url; return; }
    trEl.classList.add('is-active');
    if (lenis) lenis.stop();
    gsap.fromTo(wave, { yPercent: 110 }, {
      yPercent: 0, duration: 0.95, ease: 'power3.inOut',
      onComplete: () => { location.href = url; }
    });
  }
  M.navigate = navigate;

  function revealPage() {
    // Auf der neuen Seite: Rauch zieht ab
    if (!html.classList.contains('tr-in')) return Promise.resolve();
    gsap.set(wave, { yPercent: 0 });
    html.classList.remove('tr-in');
    if (reduced) { gsap.set(wave, { yPercent: 110 }); return Promise.resolve(); }
    return new Promise((res) => {
      gsap.to(wave, {
        yPercent: -110, duration: 1.15, ease: 'power3.inOut', delay: 0.05,
        onComplete: () => { gsap.set(wave, { yPercent: 110 }); }
      });
      gsap.delayedCall(0.5, res);
    });
  }

  /* ---------- Szenen-Titel baut sich auf (Unterseiten) ---------- */
  function sceneIntro() {
    const st = document.querySelector('.scene-title');
    if (!st) return;
    if (reduced) return;
    const name = st.querySelector('.scene-title__name');
    const split = new SplitText(name, { type: 'lines,words', mask: 'lines', linesClass: 'line' });
    const motto = st.querySelectorAll('.motto > *');
    gsap.timeline({ defaults: { ease: 'power3.out' } })
      .fromTo(st.querySelector('.scene-title__letter'), { opacity: 0, scale: 0.92, y: 40 }, { opacity: 1, scale: 1, y: 0, duration: 2.2 }, 0)
      .fromTo(st.querySelector('.scene-title__eyebrow'), { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 1 }, 0.1)
      .fromTo(split.words, { yPercent: 110 }, { yPercent: 0, duration: 1.2, stagger: 0.06 }, 0.15)
      .fromTo(motto, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 1.1, stagger: 0.12 }, 0.55)
      .fromTo(st.querySelector('.scene-title__hint'), { opacity: 0 }, { opacity: 1, duration: 1 }, 1.1);
  }

  function hideSceneIntro() {
    const st = document.querySelector('.scene-title');
    if (!st || reduced) return;
    gsap.set([st.querySelector('.scene-title__letter'), st.querySelector('.scene-title__eyebrow'), st.querySelector('.scene-title__hint')].concat(Array.from(st.querySelectorAll('.motto > *'))), { opacity: 0 });
    gsap.set(st.querySelector('.scene-title__name'), { visibility: 'hidden' });
  }

  /* ---------- Ruhige Einblendungen beim Scrollen ---------- */
  function initReveals() {
    if (reduced) return;
    gsap.utils.toArray('[data-reveal]').forEach((el) => {
      gsap.fromTo(el, { opacity: 0, y: 48 }, {
        opacity: 1, y: 0, duration: 1.1, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 88%', once: true }
      });
    });
  }

  /* ---------- Weiterlesen-Panels ---------- */
  function initPanels() {
    const btns = document.querySelectorAll('[data-panel]');
    if (!btns.length) return;
    const back = document.createElement('div');
    back.className = 'panel-backdrop';
    body.appendChild(back);
    let open = null, opener = null;
    const close = () => {
      if (!open) return;
      const p = open;
      open = null;
      back.classList.remove('is-open');
      gsap.to(back, { opacity: 0, duration: reduced ? 0 : 0.4 });
      gsap.to(p, { x: '102%', duration: reduced ? 0 : 0.6, ease: 'power3.inOut', onComplete: () => { p.hidden = true; } });
      if (opener) { opener.setAttribute('aria-expanded', 'false'); opener.focus({ preventScroll: true }); }
      document.querySelectorAll('main, .site-header').forEach((el) => { el.inert = false; });
      if (lenis) lenis.start();
    };
    btns.forEach((b) => {
      const p = document.getElementById(b.dataset.panel);
      if (!p) return;
      b.setAttribute('aria-controls', p.id);
      b.setAttribute('aria-expanded', 'false');
      p.setAttribute('role', 'dialog');
      p.setAttribute('aria-modal', 'true');
      p.setAttribute('data-lenis-prevent', '');
      p.hidden = true;
      if (!p.querySelector('.panel__close')) {
        const c = document.createElement('button');
        c.type = 'button';
        c.className = 'panel__close';
        c.textContent = 'Schließen ✕';
        p.prepend(c);
      }
      p.querySelector('.panel__close').addEventListener('click', close);
      b.addEventListener('click', () => {
        if (open) close();
        open = p; opener = b;
        p.hidden = false;
        p.scrollTop = 0;
        b.setAttribute('aria-expanded', 'true');
        back.classList.add('is-open');
        document.querySelectorAll('main, .site-header').forEach((el) => { el.inert = true; });
        if (lenis) lenis.stop();
        gsap.to(back, { opacity: 1, duration: reduced ? 0 : 0.5 });
        gsap.fromTo(p, { x: '102%' }, { x: '0%', duration: reduced ? 0 : 0.8, ease: 'power3.out' });
        setTimeout(() => p.querySelector('.panel__close').focus({ preventScroll: true }), 50);
      });
    });
    back.addEventListener('click', close);
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
  }

  /* ---------- Namensfeld (bleibt nur im eigenen Browser gespeichert) ---------- */
  function initNameField() {
    const input = document.querySelector('#namensfeld');
    if (!input) return;
    try { input.value = localStorage.getItem('medusa-name') || ''; } catch (e) { /* egal */ }
    input.addEventListener('input', () => { try { localStorage.setItem('medusa-name', input.value); } catch (e) { /* egal */ } });
  }

  /* ---------- Start ---------- */
  function boot() {
    initGrain();
    initCursor();
    initHeader();
    initMenu();
    initSnake();
    initTransition();
    initNameField();
    initPanels();

    const fonts = (document.fonts && document.fonts.ready) ? document.fonts.ready : Promise.resolve();

    if (M.hero) {
      // Startseite: Scroll-Film übernimmt Laden, Intro und Kopfleiste
      M.hero.init({ revealPage, fonts });
    } else {
      hideSceneIntro();
      fonts.then(() => {
        const name = document.querySelector('.scene-title__name');
        if (name) gsap.set(name, { visibility: 'visible' });
        revealPage().then(sceneIntro);
        if (M.scene && !reduced) M.scene();   // großer Moment der Szene (js/szenen/*.js)
        initReveals();
        ScrollTrigger.refresh();
        window.addEventListener('load', () => ScrollTrigger.refresh());
      });
    }
    M.initReveals = initReveals;
  }

  document.addEventListener('DOMContentLoaded', boot);
})();
