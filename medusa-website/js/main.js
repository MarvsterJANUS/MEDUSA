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

  /* ---------- Filmkorn + Vignette: reines CSS (html::before / ::after in style.css) ---------- */

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

  /* ---------- Motiv: Bild aus media/motive, sonst nur der große Buchstabe ---------- */
  function motifEl(s, cls) {
    const d = document.createElement('div');
    d.className = 'motif ' + (cls || '');
    d.dataset.motiv = s ? s.motiv : '';
    if (s && s.bild) {
      // echtes Motivbild (media/motive/<bild>.webp); lädt erst, wenn es gebraucht wird
      d.classList.add('motif--bild');
      d.innerHTML = '<img class="motif__img" src="' + base + 'media/motive/' + s.bild + '.webp" alt="" loading="lazy" decoding="async">';
      return d;
    }
    d.innerHTML = '<span class="motif__ghost">' + (s ? s.b : 'Μ') + '</span>';
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
    // weitere Knöpfe, die das Menü öffnen (z. B. „Alle Kapitel“ im Scroll-Film)
    document.querySelectorAll('[data-open-menu]').forEach((b) => {
      b.setAttribute('aria-controls', 'menu');
      b.setAttribute('aria-haspopup', 'dialog');
      b.addEventListener('click', () => openMenu(b));
    });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && menuOpen) closeMenu(); });
  }

  function setInert(on) {
    document.querySelectorAll('main, .site-footer, .hero').forEach((el) => { el.inert = on; });
  }

  let menuOpener = null;
  function openMenu(opener) {
    if (menuOpen) return;
    menuOpen = true;
    menuOpener = opener && opener.nodeType === 1 ? opener : null;
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
    // Fokus zurück an den Knopf, der das Menü geöffnet hat (falls er noch sichtbar ist)
    const back = menuOpener && menuOpener.offsetParent !== null && getComputedStyle(menuOpener).visibility !== 'hidden' ? menuOpener : menuBtn;
    menuOpener = null;
    back.focus({ preventScroll: true });
  }
  M.closeMenu = closeMenu;
  M.openMenu = openMenu;

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
  /* Lichtnaht: Zwei dunkle Flächen schließen sich zur Mitte, ein goldener Strahl leuchtet an
     der Naht auf. Die neue Seite wartet darunter, bis Schriften und Bilder geladen sind; dann
     flammt der Strahl auf und die Flächen fahren auseinander (wie beim Ladebildschirm). */
  /* Szene → Szene: „Der Buchstabe führt weiter“ (siehe navigate / revealPage, Art 'buchstabe'). */
  let leaving = false;
  let trEl, panL, panR, beam, dark, letter;
  const isLetter = html.classList.contains('tr-buchstabe');
  function initTransition() {
    trEl = document.querySelector('.transition');
    if (!trEl) {
      trEl = document.createElement('div');
      trEl.className = 'transition';
      trEl.setAttribute('aria-hidden', 'true');
      trEl.innerHTML = '<div class="transition__panel transition__panel--l"></div><div class="transition__panel transition__panel--r"></div><div class="transition__beam"></div>';
      body.appendChild(trEl);
    }
    panL = trEl.querySelector('.transition__panel--l');
    panR = trEl.querySelector('.transition__panel--r');
    beam = trEl.querySelector('.transition__beam');
    dark = trEl.querySelector('.transition__dark');
    letter = trEl.querySelector('.transition__letter');
    // CSS-Startlage als xPercent übernehmen (sonst liest GSAP sie als Pixel-Versatz)
    const closed = html.classList.contains('tr-in') && !isLetter;
    gsap.set([dark, letter], { opacity: isLetter ? 1 : 0 });
    gsap.set(panL, { x: 0, xPercent: closed ? 0 : -101 });
    gsap.set(panR, { x: 0, xPercent: closed ? 0 : 101 });
    gsap.set(beam, { opacity: closed ? 1 : 0, scaleY: closed ? 1 : 0, scaleX: 1 });

    document.addEventListener('click', (e) => {
      const a = e.target.closest('a');
      if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      if ((a.target && a.target !== '_self') || a.hasAttribute('download')) return;
      const href = a.getAttribute('href');
      if (!href || href.charAt(0) === '#' || /^(https?:|mailto:|tel:|javascript:)/i.test(href)) return;
      if (!/\.html(#.*)?$/i.test(href)) return;
      e.preventDefault();
      const url = a.href;
      if (url.split('#')[0] === location.href.split('#')[0]) { // gleiche Seite
        const hash = url.split('#')[1];
        const target = hash && document.getElementById(hash);
        if (target) { closeMenu(); if (lenis) lenis.scrollTo(target, { offset: -120, duration: 1.4 }); else target.scrollIntoView(); return; }
        // sonst: nur Menü schließen, nach oben
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
      gsap.killTweensOf([panL, panR, beam]);
      gsap.set(panL, { xPercent: -101 });
      gsap.set(panR, { xPercent: 101 });
      gsap.set(beam, { opacity: 0, scaleY: 0, scaleX: 1 });
      gsap.killTweensOf([dark, letter]);
      gsap.set([dark, letter], { opacity: 0, x: 0, y: 0, scale: 1 });
      if (menuOpen) closeMenu(true);
      if (lenis) lenis.start();
    });
  }

  function navigate(url) {
    if (leaving) return;
    leaving = true;
    // Von Szene zu Szene: Buchstabe; von/zur Startseite: Lichtnaht
    const m = /szenen\/([a-z]+)\.html/i.exec(url);
    const target = m && SZENEN.find((x) => x.id === m[1]);
    const art = target && body.dataset.szene ? 'buchstabe' : '1';
    if (body.classList.contains('page-home')) { try { sessionStorage.setItem('medusa-home-y', String(Math.round(scrollY()))); } catch (err) { /* egal */ } }
    try { sessionStorage.setItem('medusa-tr', art); } catch (err) { /* ohne Speicher: kein Problem */ }
    if (reduced) { location.href = url; return; }
    trEl.classList.add('is-active');
    if (lenis) lenis.stop();
    if (art === 'buchstabe') {
      letter.textContent = target.b;
      gsap.set(letter, { x: 0, y: 0 });
      gsap.timeline({ onComplete: () => { location.href = url; } })
        .fromTo(dark, { opacity: 0 }, { opacity: 1, duration: 0.6, ease: 'power2.inOut' }, 0)
        .fromTo(letter, { opacity: 0, scale: 0.94, y: 30 }, { opacity: 1, scale: 1, y: 0, duration: 0.85, ease: 'power3.out' }, 0.12);
      return;
    }
    gsap.timeline({ onComplete: () => { location.href = url; } })
      .to(panL, { xPercent: 0, duration: 0.8, ease: 'power4.inOut' }, 0)
      .to(panR, { xPercent: 0, duration: 0.8, ease: 'power4.inOut' }, 0)
      .fromTo(beam, { opacity: 0, scaleY: 0, scaleX: 1 }, { opacity: 1, scaleY: 1, duration: 0.4, ease: 'power3.out' }, 0.42);
  }
  M.navigate = navigate;

  // Neue Seite erst öffnen, wenn Schriften und Bilder da sind (höchstens 1,5 s warten)
  function pageReady() {
    const fonts = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
    const load = document.readyState === 'complete' ? Promise.resolve() : new Promise((r) => window.addEventListener('load', r, { once: true }));
    return Promise.race([Promise.all([fonts, load]), new Promise((r) => setTimeout(r, 1500))])
      .then(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
  }

  function revealPage() {
    if (!html.classList.contains('tr-in')) return Promise.resolve();
    html.classList.remove('tr-in', 'tr-buchstabe');   // Inline-Werte aus initTransition halten den Zustand
    if (reduced) {
      gsap.set(panL, { xPercent: -101 }); gsap.set(panR, { xPercent: 101 }); gsap.set([beam, dark, letter], { opacity: 0 });
      return Promise.resolve();
    }
    if (isLetter) {
      return pageReady().then(() => new Promise((res) => {
        // Der goldene Buchstabe legt sich exakt auf den Hintergrund-Buchstaben der Szene und dimmt in ihn hinein
        const real = document.querySelector('.scene-title__letter');
        if (real) {
          M.letterCarried = true;
          gsap.set(real, { opacity: 1 });
          const a = letter.getBoundingClientRect(), b = real.getBoundingClientRect();
          if (a.height && b.height) {
            const dx = (b.left + b.width / 2) - (a.left + a.width / 2);
            const dy = (b.top + b.height / 2) - (a.top + a.height / 2);
            const sc = b.height / a.height;
            if (Math.abs(dx) > 1 || Math.abs(dy) > 1 || Math.abs(sc - 1) > 0.01) gsap.to(letter, { x: dx, y: dy, scale: sc, duration: 0.7, ease: 'power3.inOut' });
          }
        }
        gsap.timeline({ onComplete: () => gsap.set(letter, { x: 0, y: 0, scale: 1 }) })
          .to(dark, { opacity: 0, duration: 0.9, ease: 'power2.inOut' }, 0.05)
          .to(letter, { opacity: 0, duration: 1.3, ease: 'power2.inOut' }, 0.2);
        gsap.delayedCall(0.35, res);   // Titel baut sich auf, während das Dunkel weicht
      }));
    }
    return pageReady().then(() => new Promise((res) => {
      gsap.timeline()
        .to(panL, { xPercent: -101, duration: 1.15, ease: 'power4.inOut' }, 0.1)
        .to(panR, { xPercent: 101, duration: 1.15, ease: 'power4.inOut' }, 0.1)
        .to(beam, { scaleX: 60, opacity: 0, duration: 1, ease: 'power3.inOut' }, 0.15)
        .set(beam, { scaleX: 1, scaleY: 0 });
      gsap.delayedCall(0.45, res);   // Titel baut sich auf, während sich die Flächen öffnen
    }));
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
      .fromTo(st.querySelector('.scene-title__letter'), { opacity: M.letterCarried ? 1 : 0, scale: M.letterCarried ? 1 : 0.92, y: M.letterCarried ? 0 : 40 }, { opacity: 1, scale: 1, y: 0, duration: 2.2 }, 0)
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
      body.appendChild(p);   // außerhalb von <main>, das beim Öffnen gesperrt (inert) wird
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

  /* ---------- „Ausstellung von …“: Name aus js/data.js (MEDUSA_AUTOR) ---------- */
  function initNameField() {
    const name = String(window.MEDUSA_AUTOR || '').trim();
    const ok = name && name !== '[NAME]';
    document.querySelectorAll('[data-autor]').forEach((el) => {
      if (ok) el.textContent = name;
      else el.closest('.namefield').hidden = true;
    });
  }

  /* ---------- Start ---------- */
  function boot() {

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
        // Sprungziel aus der Adresse (z. B. Fußnote → fazit.html#q-…): nach dem Aufbau der Pins erneut anspringen
        const jump = () => {
          const t = location.hash && document.getElementById(location.hash.slice(1));
          if (!t) return;
          const y = Math.max(0, t.getBoundingClientRect().top + window.scrollY - 120);   // feste Pixelposition (Lenis-Stand ist hier noch 0)
          window.scrollTo(0, y);
          if (lenis) { lenis.resize(); lenis.scrollTo(y, { immediate: true, force: true }); }   // Seitenlänge nach den Pins neu messen
        };
        if (location.hash) {
          const later = () => setTimeout(() => { ScrollTrigger.refresh(); jump(); }, 120);
          if (document.readyState === 'complete') later(); else window.addEventListener('load', later, { once: true });
        }
      });
    }
    M.initReveals = initReveals;
    initFocusScroll();
    initFps();
  }

  /* ---------- Tastatur: fokussierte Elemente immer sichtbar machen ----------
     Fixierte Szenen (Kartenstapel, Verwandlung, Fries) melden über M.focusTargets, an welcher
     Scrollposition ein Element zu sehen ist: { root: Element, y: (el) => Scrollposition }. */
  M.focusTargets = [];
  function initFocusScroll() {
    let keyboard = false;
    document.addEventListener('keydown', (e) => { if (e.key === 'Tab') keyboard = true; });
    document.addEventListener('pointerdown', () => { keyboard = false; });
    document.addEventListener('focusin', (e) => {
      const el = e.target;
      if (!keyboard || !el || el === body || menuOpen) return;
      if (el.closest('.menu, .panel, .werkblatt, .site-header, .transition, .hero')) return;   // eigene Logik bzw. fest im Bild
      // noch nicht eingeblendete Inhalte sofort zeigen
      const rv = el.closest('[data-reveal], .zeit__item, .tile, .ov-item');
      if (rv && +getComputedStyle(rv).opacity < 0.5) gsap.to(rv, { opacity: 1, y: 0, duration: 0.4, overwrite: 'auto' });
      const t = M.focusTargets.find((x) => x.root.contains(el));
      if (t) { const y = t.y(el); if (y != null) M.scrollTo(Math.max(0, y), { duration: 0.7 }); return; }
      const r = el.getBoundingClientRect();
      if (r.top < (header ? header.offsetHeight : 80) + 16 || r.bottom > window.innerHeight - 24) {
        M.scrollTo(Math.max(0, scrollY() + r.top - window.innerHeight * 0.35), { duration: 0.7 });
      }
    });
  }

  /* ---------- Bildraten-Anzeige zum Testen: index.html?fps (bleibt über Seitenwechsel aktiv, ?fps=0 schaltet ab) ---------- */
  function initFps() {
    const q = new URLSearchParams(location.search).get('fps');
    try {
      if (q === '0') sessionStorage.removeItem('medusa-fps');
      else if (q !== null) sessionStorage.setItem('medusa-fps', '1');
      if (sessionStorage.getItem('medusa-fps') !== '1') return;
    } catch (e) { if (q === null || q === '0') return; }
    const box = document.createElement('div');
    box.setAttribute('aria-hidden', 'true');
    box.style.cssText = 'position:fixed;left:12px;bottom:12px;z-index:100000;padding:8px 12px;font:600 12px/1.4 ui-monospace,Consolas,monospace;color:#0D0F0E;background:#C9A46A;border-radius:4px;pointer-events:none;white-space:pre';
    document.body.appendChild(box);
    let frames = 0, worst = 0, slow = 0, last = performance.now(), t0 = last;
    const tick = (t) => {
      const dt = t - last; last = t; frames++;
      if (dt > worst) worst = dt;
      if (dt > 34) slow++;                       // langsamer als ~30 fps = sichtbares Ruckeln
      if (t - t0 >= 1000) {
        const fps = Math.round(frames * 1000 / (t - t0));
        box.textContent = fps + ' fps  · schlechtestes Bild ' + Math.round(worst) + ' ms · Ruckler ' + slow;
        box.style.background = fps >= 55 ? '#C9A46A' : fps >= 40 ? '#d89a3c' : '#c0533a';
        frames = 0; worst = 0; slow = 0; t0 = t;
      }
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  document.addEventListener('DOMContentLoaded', boot);
})();
