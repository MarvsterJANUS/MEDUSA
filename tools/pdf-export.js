/* PDF für die Abgabe: Titel + Film + Inhalt, dann die Szenen Α–Ω (Druckansicht), ein Dokument mit Seitenzahlen.
   Aufruf:  node tools/pdf-export.js            → medusa-ausstellung.pdf im Projektordner
            node tools/pdf-export.js mythos     → nur diese Teile (Kontrolle), Ausgabe in tools/pdf-teile/
   Browser: CHROME_PATH oder Chrome/Edge an den üblichen Orten. */
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const puppeteer = require('puppeteer-core');
const { PDFDocument, StandardFonts, rgb } = require('pdf-lib');

const ROOT = path.resolve(__dirname, '..');
const SITE = path.join(ROOT, 'medusa-website');
const OUT = path.join(ROOT, 'medusa-ausstellung.pdf');
const TEILE = path.join(__dirname, 'pdf-teile');
const url = (p) => 'file:///' + path.join(SITE, p).split(path.sep).join('/');

const ctx = {}; vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(SITE, 'js/data.js'), 'utf8').replace(/window\./g, 'this.'), ctx);
const SZENEN = ctx.MEDUSA_SZENEN;
const AUTOR = String(ctx.MEDUSA_AUTOR || '').trim();
const HAT_AUTOR = AUTOR && AUTOR !== '[NAME]';

function browserPfad() {
  const kandidaten = [
    process.env.CHROME_PATH,
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
    path.join(process.env.LOCALAPPDATA || '', 'Google/Chrome/Application/chrome.exe'),
    'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
    'C:/Program Files/Microsoft/Edge/Application/msedge.exe'
  ].filter(Boolean);
  const p = kandidaten.find((k) => fs.existsSync(k));
  if (!p) throw new Error('Kein Chrome/Edge gefunden – CHROME_PATH setzen.');
  return p;
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/* ---------- Szene vorbereiten (läuft im Browser) ---------- */
function vorbereiten() {
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  document.documentElement.classList.add('druck');

  // „Weiterlesen“-Panels an die Stelle ihres Knopfes
  $$('[data-panel]').forEach((btn) => {
    const p = document.getElementById(btn.dataset.panel);
    if (p) { p.hidden = false; p.classList.add('exkurs'); const host = btn.closest('.merk'); if (host) { host.after(p); btn.remove(); } else btn.replaceWith(p); }
  });
  // Η Kunst: Werkliste → alle Werkblätter in Reihenfolge
  const werke = document.querySelector('.werke');
  if (werke) {
    const blaetter = $$('.werk__btn').map((b) => document.getElementById(b.dataset.werk)).filter(Boolean);
    const box = document.createElement('div'); box.className = 'werkblaetter';
    blaetter.forEach((w) => { w.hidden = false; w.removeAttribute('style'); box.appendChild(w); });
    werke.replaceWith(box);
  }
  // Β Mythos: Bild jeder Fassung direkt zur Fassung
  const vs = $$('.versions .version');
  vs.forEach((v, i) => {
    const src = document.querySelector('.v-img[data-v="' + i + '"] img'); if (!src) return;
    const fig = document.createElement('figure'); fig.className = 'druck-bild';
    const im = document.createElement('img'); im.src = src.src; im.alt = ''; fig.appendChild(im); v.prepend(fig);
  });
  $$('.versions__media').forEach((m) => m.remove());
  // Videos → Standbild
  $$('video').forEach((v) => {
    if (!v.poster) return v.remove();
    const img = document.createElement('img'); img.src = v.poster; img.alt = ''; img.className = v.className;
    v.replaceWith(img);
  });
  $$('img').forEach((i) => { i.loading = 'eager'; i.decoding = 'sync'; });

  // Anmerkungen: Fußnoten der Szene als Liste ans Ende
  const fns = $$('a.fn');
  if (fns.length) {
    const sec = document.createElement('section'); sec.className = 'anmerkungen';
    sec.innerHTML = '<h2>Anmerkungen</h2><ol></ol><p class="anmerkungen__hinweis">Vollständige Quellenangaben mit Links im Quellenverzeichnis am Ende (Szene Ω, Abspann).</p>';
    const ol = sec.querySelector('ol'); const seen = new Set();
    fns.forEach((a) => {
      const n = a.textContent.trim(); const k = n + '|' + a.dataset.quelle;
      if (seen.has(k)) return; seen.add(k);
      const li = document.createElement('li'); li.value = parseInt(n, 10) || undefined;
      li.textContent = a.dataset.quelle || a.getAttribute('aria-label') || '';
      ol.appendChild(li);
    });
    const main = document.querySelector('main');
    const credits = main.querySelector('.credits');
    credits ? credits.before(sec) : main.appendChild(sec);
  }
  // Seite oben, alle Inline-Zustände der Animationen bleiben (Bewegung reduziert = Endzustand)
  window.scrollTo(0, 0);
}

/* ---------- Farben für Papier (läuft im Browser, nach Umschalten auf Druck) ---------- */
function kontrast() {
  const rgbA = (c) => { const m = c.match(/rgba?\(([^)]+)\)/); if (!m) return null; const p = m[1].split(/[ ,/]+/).filter(Boolean).map(Number); return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 }; };
  const lum = ({ r, g, b }) => { const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
  const warm = (c) => c.r - c.b > 40; // Gold/Bernstein behalten
  for (const el of document.querySelectorAll('body *')) {
    if (el.closest('.cover, img, video, canvas')) continue;
    const cs = getComputedStyle(el);
    const c = rgbA(cs.color);
    if (c && lum(c) > 0.45) el.style.setProperty('color', warm(c) ? '#9A7A45' : 'rgba(20,22,21,' + Math.max(c.a, 0.8) + ')', 'important');
    if (el instanceof SVGElement) {
      const fl = rgbA(cs.fill); if (fl && lum(fl) > 0.45) el.style.setProperty('fill', warm(fl) ? '#9A7A45' : '#141615', 'important');
      const st = rgbA(cs.stroke); if (st && lum(st) > 0.45) el.style.setProperty('stroke', warm(st) ? '#9A7A45' : '#8E938F', 'important');
    }
    const bg = rgbA(cs.backgroundColor);
    if (bg && bg.a > 0.3 && lum(bg) < 0.12) el.style.setProperty('background-color', 'transparent', 'important');
    if (cs.textShadow !== 'none') el.style.setProperty('text-shadow', 'none', 'important');
    if (/gradient/.test(cs.backgroundImage) && !/text/.test(cs.backgroundClip + cs.webkitBackgroundClip)) el.style.setProperty('background-image', 'none', 'important');
  }
}

async function bilderGeladen(page) {
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all([...document.images].map((i) => (i.complete ? null : new Promise((r) => { i.onload = i.onerror = r; }))));
  });
}

/* ---------- Bilder für den Druck verkleinern (sonst ~100 MB) ---------- */
const { execFileSync } = require('child_process');
const CACHE = path.join(TEILE, 'bilder');
function druckBild(datei) {
  fs.mkdirSync(CACHE, { recursive: true });
  const st = fs.statSync(datei);
  const ziel = path.join(CACHE, path.relative(SITE, datei).replace(/[\\/:]/g, '_') + '-' + st.mtimeMs.toFixed(0) + '.jpg');
  if (!fs.existsSync(ziel)) {
    execFileSync('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', '-i', datei,
      '-vf', "scale='min(1600,iw)':'min(1600,ih)':force_original_aspect_ratio=decrease,format=yuvj420p", '-q:v', '4', ziel]);
  }
  return fs.readFileSync(ziel);
}
async function bilderKlein(page) {
  await page.setRequestInterception(true);
  page.on('request', (r) => {
    const u = r.url();
    if (u.startsWith('file:') && /\/media\/.+\.(webp|png|jpe?g)$/i.test(u)) {
      try { return r.respond({ status: 200, contentType: 'image/jpeg', body: druckBild(decodeURIComponent(new URL(u).pathname).replace(/^\/([A-Za-z]:)/, '$1')) }); }
      catch (e) { return r.continue(); }
    }
    r.continue();
  });
}

async function szenePdf(browser, id, ziel) {
  const page = await browser.newPage();
  const fehler = []; page.on('pageerror', (e) => fehler.push(e.message));
  await bilderKlein(page);
  await page.setViewport({ width: 1200, height: 1600 });
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  await page.goto(url('szenen/' + id + '.html'), { waitUntil: 'networkidle0' });
  await sleep(1500);
  await page.evaluate(vorbereiten);
  await page.emulateMediaType('print');
  await page.evaluate(kontrast);
  await bilderGeladen(page);
  await sleep(500);
  await page.pdf({ path: ziel, format: 'A4', printBackground: true, preferCSSPageSize: true });
  await page.close();
  if (fehler.length) console.warn('  Hinweis ' + id + ': ' + fehler.join(' | '));
}

/* ---------- Titel, Film, Inhalt ---------- */
function titelCss() {
  const ff = fs.readFileSync(path.join(SITE, 'css/style.css'), 'utf8').split(/\r?\n/)
    .filter((l) => l.startsWith('@font-face')).join('\n').split('url(../').join('url(');
  return ff + '\n' + fs.readFileSync(path.join(__dirname, 'pdf-titel.css'), 'utf8');
}

function titelHtml(seiten) {
  const film = [
    ['A', 'Sie war eine Frau. Dann kam der Fluch.', 'Β Mythos'],
    ['B', 'Wer sie ansah, wurde zu Stein.', 'Ε Deutungen'],
    ['X', 'Perseus nahm ihr den Kopf.', 'Γ Perseus'],
    ['C', 'Ihr Kopf wurde zur Waffe – und zum Schutz. Bis heute.', 'Δ Schutzzeichen']
  ];
  const inhalt = SZENEN.map((s) => `<li><span class="toc__b">${s.b}</span><span class="toc__t">${esc(s.t)}<small>${esc(s.teaser)}</small></span><span class="toc__s">${seiten[s.id] || ''}</span></li>`).join('');
  return `<!doctype html><html lang="de" class="druck"><head><meta charset="utf-8"><title>Medusa</title>
<style>${titelCss()}</style></head><body>
<section class="cover">
  <img class="cover__bild" src="media/hero/keyframes/A.webp" alt="">
  <div class="cover__text">
    <p class="cover__greek">ΜΕΔΟΥΣΑ</p>
    <h1 class="cover__word">MEDUSA</h1>
    <p class="cover__sub">Monster · Opfer · Schutzzeichen · Ikone</p>
    <p class="cover__frage">Wie wurde aus einem Schutzzeichen und Monster eine Opferfigur und feministische Ikone – und was sagt das über die jeweilige Zeit?</p>
  </div>
  <div class="cover__fuss">
    <p><span class="cover__label">Eine digitale Ausstellung</span>${HAT_AUTOR ? `<span class="cover__label">Ausstellung von</span><span class="cover__name">${esc(AUTOR)}</span>` : ''}</p>
    <p class="cover__url"><span class="cover__label">Online</span>marvsterjanus.github.io/MEDUSA</p>
  </div>
</section>
<section class="seite film">
  <p class="kicker">Die Startseite · Scroll-Film</p>
  <h2>Ein Gesicht, vier Zustände</h2>
  <p class="film__intro">Auf der Website erzählt die Startseite Medusas Geschichte als Film, der sich beim Scrollen bewegt: Die Marmorbüste wird zur Gorgo, zerspringt und setzt sich als Schild wieder zusammen. Im PDF stehen die vier Schlüsselbilder mit den Sätzen, die dazu eingeblendet werden. Bilder und Film der Startseite sind KI-generiert.</p>
  <ol class="film__reihe">${film.map(([k, t, z], i) => `<li><img src="media/hero/keyframes/${k}.webp" alt=""><p class="film__nr">0${i + 1}</p><p class="film__t">${esc(t)}</p><p class="film__z">→ ${esc(z)}</p></li>`).join('')}</ol>
  <figure class="film__motto"><blockquote lang="en">„Approach the chamber, and destroy your sight /<br>With a new Gorgon.“</blockquote><p>„Tretet ein und zerstört euer Augenlicht an einer neuen Gorgo.“</p><figcaption>Shakespeare, Macbeth 2.3</figcaption></figure>
</section>
<section class="seite toc">
  <p class="kicker">Neun Szenen · Α bis Ω</p>
  <h2>Vom Ungeheuer zur Ikone</h2>
  <ol class="toc__liste">${inhalt}</ol>
</section>
</body></html>`;
}

async function titelPdf(browser, seiten, ziel) {
  const datei = path.join(SITE, '_druck-titel.html');
  fs.writeFileSync(datei, titelHtml(seiten));
  try {
    const page = await browser.newPage();
    await bilderKlein(page);
    await page.goto(url('_druck-titel.html'), { waitUntil: 'networkidle0' });
    await bilderGeladen(page);
    await page.pdf({ path: ziel, format: 'A4', printBackground: true, preferCSSPageSize: true });
    await page.close();
  } finally { fs.unlinkSync(datei); }
}

/* ---------- Zusammenfügen + Seitenzahlen ---------- */
async function seitenzahl(datei) { return (await PDFDocument.load(fs.readFileSync(datei))).getPageCount(); }

async function zusammen(teile, ziel) {
  const doc = await PDFDocument.create();
  for (const t of teile) {
    const src = await PDFDocument.load(fs.readFileSync(t));
    (await doc.copyPages(src, src.getPageIndices())).forEach((p) => doc.addPage(p));
  }
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const n = doc.getPageCount();
  doc.getPages().forEach((p, i) => {
    if (i === 0) return; // Titel ohne Zahl
    const txt = String(i + 1); const w = font.widthOfTextAtSize(txt, 8);
    p.drawText(txt, { x: p.getWidth() / 2 - w / 2, y: 22, size: 8, font, color: rgb(0.45, 0.47, 0.46) });
  });
  doc.setTitle('Medusa – Monster · Opfer · Schutzzeichen · Ikone');
  doc.setSubject('Eine digitale Ausstellung');
  if (HAT_AUTOR) doc.setAuthor(AUTOR);
  doc.setLanguage('de-DE');
  fs.writeFileSync(ziel, await doc.save());
  return n;
}

(async () => {
  const nur = process.argv.slice(2);
  fs.mkdirSync(TEILE, { recursive: true });
  const browser = await puppeteer.launch({ executablePath: browserPfad(), headless: 'new', args: ['--allow-file-access-from-files'] });
  try {
    const ids = SZENEN.map((s) => s.id).filter((id) => !nur.length || nur.includes(id));
    const seiten = {}; const teile = [];
    for (const id of ids) {
      const z = path.join(TEILE, id + '.pdf');
      await szenePdf(browser, id, z);
      teile.push(z);
      console.log(id.padEnd(14), await seitenzahl(z), 'Seiten');
    }
    if (nur.length && !nur.includes('titel')) return;
    // Seitenzahlen fürs Inhaltsverzeichnis: Titel einmal rendern, um seine Länge zu kennen
    const titel = path.join(TEILE, 'titel.pdf');
    await titelPdf(browser, {}, titel);
    let s = (await seitenzahl(titel)) + 1;
    for (const id of ids) { seiten[id] = s; s += await seitenzahl(path.join(TEILE, id + '.pdf')); }
    await titelPdf(browser, seiten, titel);
    if (nur.length) return console.log('titel', await seitenzahl(titel), 'Seiten');
    const n = await zusammen([titel, ...teile], OUT);
    console.log('\nFertig:', OUT, '–', n, 'Seiten,', (fs.statSync(OUT).size / 1048576).toFixed(1), 'MB');
  } finally { await browser.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
