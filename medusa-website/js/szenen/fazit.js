/* Ω Fazit – große Momente:
   1. Der Zeitstrahl zeichnet sich beim Scrollen in Gold (noch in Stein-Grau).
   2. Medusa erwacht: Das Video (Einzelbilder) läuft mit dem Scrollen, der Stein bricht, die Augen öffnen sich –
      in diesem Moment wird die ganze Seite farbig (Grau → Gold).
   3. Abspann wie im Kino, auf Wunsch automatisch abgespielt. */
(function () {
  'use strict';
  const M = (window.MEDUSA = window.MEDUSA || {});
  const FRAMES = 145;

  M.scene = function () {
    const body = document.body;

    /* ---------- 1. Zeitstrahl ---------- */
    const wrap = document.querySelector('.zeit__wrap');
    if (wrap) {
      gsap.fromTo('.zeit__line i', { scaleY: 0 }, {
        scaleY: 1, ease: 'none',
        scrollTrigger: { trigger: wrap, start: 'top 70%', end: 'bottom 60%', scrub: 0.6 }
      });
      gsap.utils.toArray('.zeit__item').forEach((li) => {
        gsap.fromTo(li, { opacity: 0, y: 40 }, {
          opacity: 1, y: 0, duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: li, start: 'top 82%', once: true }
        });
      });
    }

    /* ---------- 2. Medusa erwacht ---------- */
    const pin = document.querySelector('.augen__pin');
    const canvas = pin && pin.querySelector('.augen__canvas');
    if (canvas) {
      const ctx = canvas.getContext('2d', { alpha: false });
      const mobile = window.matchMedia('(max-width: 900px), (pointer: coarse)').matches;
      const dir = '../media/fazit/' + (mobile ? 'mobile' : 'desktop') + '/f_';
      const imgs = new Array(FRAMES);
      const ok = new Uint8Array(FRAMES);
      let requested = false, frame = 0, drawn = -1;

      const load = () => {
        if (requested) return;
        requested = true;
        // erst jedes 4. Bild (schnell ein grober Film), dann der Rest
        const order = [];
        for (let i = 0; i < FRAMES; i += 4) order.push(i);
        for (let i = 0; i < FRAMES; i++) if (i % 4) order.push(i);
        let k = 0;
        const next = () => {
          if (k >= order.length) return;
          const i = order[k++];
          const im = new Image();
          im.decoding = 'async';
          im.onload = () => { imgs[i] = im; ok[i] = 1; if (Math.abs(i - frame) < 6) draw(true); next(); };
          im.onerror = next;
          im.src = dir + String(i + 1).padStart(3, '0') + '.webp';
        };
        for (let c = 0; c < 4; c++) next();
      };
      const nearest = (i) => {
        if (ok[i]) return i;
        for (let d = 1; d < FRAMES; d++) {
          if (i - d >= 0 && ok[i - d]) return i - d;
          if (i + d < FRAMES && ok[i + d]) return i + d;
        }
        return -1;
      };
      let cw = 0, ch = 0;
      const resize = () => {
        const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
        cw = canvas.offsetWidth; ch = canvas.offsetHeight;
        canvas.width = Math.round(cw * dpr); canvas.height = Math.round(ch * dpr);
        draw(true);
      };
      function draw(force) {
        const n = nearest(frame);
        if (n < 0 || (!force && n === drawn)) return;
        const im = imgs[n];
        // Querformat: Bild füllt den Schirm. Hochformat: beide Augen müssen sichtbar bleiben (ca. 72 % der Bildbreite) – Kino-Rand oben/unten
        const cover = Math.max(canvas.width / im.naturalWidth, canvas.height / im.naturalHeight);
        const eyes = canvas.width / (im.naturalWidth * 0.72);
        const s = canvas.width < canvas.height ? Math.min(cover, eyes) : cover;
        if (s < cover) { ctx.fillStyle = '#000'; ctx.fillRect(0, 0, canvas.width, canvas.height); }
        const w = im.naturalWidth * s, h = im.naturalHeight * s;
        ctx.drawImage(im, (canvas.width - w) / 2, (canvas.height - h) * 0.45, w, h);
        drawn = n;
      }

      ScrollTrigger.create({ trigger: pin, start: 'top 250%', once: true, onEnter: load });
      const textA = pin.querySelector('.augen__text--a');
      const textB = pin.querySelector('.augen__text--b');
      gsap.set(textB, { opacity: 0, y: 30 });

      const tl = gsap.timeline({ defaults: { ease: 'none' } });
      const prog = { p: 0 };
      tl.to(prog, { p: 1, duration: 1, onUpdate: () => { frame = Math.round(prog.p * (FRAMES - 1)); draw(false); } }, 0)
        .to(textA, { opacity: 0, y: -30, duration: 0.12 }, 0.12)
        .to(textB, { opacity: 1, y: 0, duration: 0.12 }, 0.84);

      ScrollTrigger.create({
        trigger: pin, start: 'top top', end: '+=300%',
        pin: true, scrub: 0.5, animation: tl, invalidateOnRefresh: true,
        onRefresh: resize,
        // Stein → Farbe, sobald sich die Augen öffnen (beim Zurückscrollen wieder Stein)
        onUpdate: (self) => body.classList.toggle('is-farbig', self.progress > 0.8)
      });
      // wer an der Szene schon vorbei ist (z. B. über einen Fußnoten-Link), sieht sie farbig
      window.addEventListener('resize', resize);
      resize();
    }

    /* ---------- 3. Abspann ---------- */
    const play = document.querySelector('.credits__play');
    if (play) {
      play.addEventListener('click', () => {
        const credits = document.querySelector('.credits');
        const end = credits.getBoundingClientRect().bottom + window.scrollY - window.innerHeight;
        const dist = Math.max(0, end - window.scrollY);
        if (M.lenis) M.lenis.scrollTo(end, { duration: Math.max(8, dist / 90), easing: (t) => t, lock: false });
        else window.scrollTo({ top: end, behavior: 'smooth' });
      });
    }
  };
})();
