// Erzeugt die neun Szenen-Seiten aus einer gemeinsamen Vorlage.
// Aufruf: node tools/make-szenen.js
// Inhalt einer Szene: tools/inhalte/<id>.html (fehlt er, kommt der Platzhalter).
// Skript für den großen Moment: medusa-website/js/szenen/<id>.js (wird automatisch eingebunden).
const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname, '..', 'medusa-website', 'szenen');

// Motivbilder kommen aus der gemeinsamen Datenquelle der Website (js/data.js)
const vm = require('vm');
const DATA = (() => { const ctx = { window: {} }; vm.runInNewContext(fs.readFileSync(path.join(OUT, '..', 'js', 'data.js'), 'utf8'), ctx); return ctx.window.MEDUSA_SZENEN || []; })();
const bildVon = (id) => (DATA.find((x) => x.id === id) || {}).bild;
const vorschau = (src, ghost) => src
  ? '<span class="motif motif--bild"><img class="motif__img" src="' + src + '" alt="" loading="lazy" decoding="async"></span>'
  : '<span class="motif"><span class="motif__ghost">' + ghost + '</span><span class="motif__label">Platzhalter · Vorschaubild folgt</span></span>';

const S = [
  { id: 'herkunft', b: 'Α', t: 'Herkunft', teaser: 'Drei Schwestern am Rand der Welt – nur eine von ihnen war sterblich.',
    motto: { de: '„Nur Medusa war sterblich.“', q: 'nach Apollodor, Bibliotheke 2.4.2' },
    inhalt: 'Familie, Namen, Aussehen, Graien, Wohnort am Rand der Welt',
    moment: 'Schwarz. Beim Scrollen wachsen goldene Linien aus der Dunkelheit und bilden den Stammbaum; die Namen erscheinen riesig, das Bild der Gorgonen-Schwestern taucht aus dem Nebel auf.',
    assets: 's1-gorgonen, s1-graien', session: 2 },
  { id: 'mythos', b: 'Β', t: 'Mythos', teaser: 'Drei Dichter, drei Medusen: Ungeheuer von Geburt, Opfer im Tempel, stolze Rivalin.',
    motto: { orig: '„clarissima forma“', lang: 'la', de: '„von strahlendster Schönheit“', q: 'Ovid, Metamorphosen 4,794' },
    inhalt: 'Hesiod, Ovid, Apollodor – drei Versionen im Vergleich',
    moment: 'Das Bild links bleibt stehen, die drei Versionen gleiten rechts vorbei, das Bild wechselt mit; bei Ovid frisst sich Stein von den Rändern über das Bild (Farbe → Grau).',
    assets: 's2-tempel, f-caravaggio', session: 2 },
  { id: 'perseus', b: 'Γ', t: 'Perseus', teaser: 'Ein Held, ein Spiegel, ein Schwert aus Adamant – und ein Kopf, der weiterblickt.',
    motto: { de: '„Tröpfelten blutige Tropfen vom Haupt der Gorgo Medusa“', q: 'Ovid, Metamorphosen IV, deutsche Übersetzung' },
    inhalt: 'Neun Stationen der Sage, Medusas Blut, Pegasus und Chrysaor',
    moment: 'Horizontaler Fries durch die neun Burne-Jones-Bilder mit Parallax-Ebenen; danach Black-out: Medusa schläft im Dunkeln und ist nur im runden Spiegelschild sichtbar, der Maus bzw. Finger folgt.',
    assets: 'Burne-Jones-Zyklus, s3-medusa-schlaf, s3-ausruestung, v-fackel', session: 2 },
  { id: 'schutzzeichen', b: 'Δ', t: 'Schutzzeichen', teaser: 'Wie das Schreckliche zum Schutz gegen das Schreckliche wurde.',
    motto: { de: '„… die Gorgo, grässlich anzuschauen, furchtbar blickend, und um sie Schrecken und Flucht.“', q: 'Homer, Ilias 11,36' },
    inhalt: 'Gorgoneion, apotropäische Wirkung, Korfu-Giebel, Wandel des Gesichts',
    moment: 'Scroll-Scrub: archaische Fratze, Übergangstyp und Medusa Rondanini verwandeln sich ineinander; Fundorte als Liste, das Bild folgt dem Cursor.',
    assets: 'Korfu-Giebel, Münze, Stirnziegel, Rondanini', session: 2 },
  { id: 'deutungen', b: 'Ε', t: 'Deutungen', teaser: 'Schutz, Opfer, Chaos, Blick, Freud, Cixous – sechs Blicke auf ein Gesicht.',
    motto: { orig: '„Though he be painted one way like a Gorgon, / The other way’s a Mars.“', lang: 'en', de: '„Von der einen Seite gemalt wie eine Gorgo, von der anderen ein Mars.“', q: 'Shakespeare, Antony and Cleopatra 2.5' },
    inhalt: 'Schutz, Opfer, Ordnung gegen Chaos, Blick, Freud, Cixous',
    moment: 'Sechs Vollbild-Karten fallen beim Scrollen übereinander, jede mit eigenem Motiv und einem großen Satz.',
    assets: 's5-karte1 bis s5-karte6', session: 3 },
  { id: 'literatur', b: 'Ζ', t: 'Literatur', teaser: 'Von Homer bis Percy Jackson: Wer über Medusa schreibt, schreibt über das Hinsehen.',
    motto: { orig: '„Volgiti ’n dietro e tien lo viso chiuso“', lang: 'it', de: '„Dreh dich um und halte die Augen geschlossen.“', q: 'Dante, Inferno IX, 55' },
    inhalt: 'Homer, Pindar, Ovid, Dante, Goethe, Shelley, Haynes, Burton, Percy Jackson',
    moment: 'Reine Typografie auf Schwarz: Zitate bauen sich Wort für Wort auf, riesig; bei Dante wird der Bildschirm dunkel, als würden Hände die Augen verdecken.',
    assets: 's6-buch, Blake-Illustration', session: 3 },
  { id: 'kunst', b: 'Η', t: 'Kunst', teaser: 'Von Korfu bis New York – zweieinhalb Jahrtausende Medusenhäupter.',
    motto: { orig: '„Its horror and its beauty are divine.“', lang: 'en', de: '„Ihr Grauen und ihre Schönheit sind göttlich.“', q: 'Percy Bysshe Shelley, 1819' },
    inhalt: 'Korfu, Cellini, Caravaggio, Rubens/Snyders, Canova, Burne-Jones, Böcklin, Garbati',
    moment: 'Liste der Werktitel, das Bild folgt dem Cursor mit leichter Verzerrung; Klick öffnet Vollbild mit Analyse; Regler Cellini ↔ Garbati.',
    assets: 'echte Kunstwerke (Wikimedia Commons)', session: 3 },
  { id: 'heute', b: 'Θ', t: 'Heute', teaser: 'Flagge, Mode, Tattoo, Qualle: Medusa ist nie verschwunden.',
    motto: { de: 'Man muss Medusa nur direkt ansehen: Sie ist nicht tödlich, sie ist schön und sie lacht.', q: 'Hélène Cixous, 1975 (sinngemäß)' },
    inhalt: 'Sizilien, Mode, #MeToo und Tattoos, Biologie, Istanbul, Popkultur',
    moment: 'Raster aus stummen Video-Kacheln, die beim Hovern aufleben (mobil beim Sichtbarwerden).',
    assets: 'v-qualle, v-zisterne, Sizilien-Flagge', session: 3 },
  { id: 'fazit', b: 'Ω', t: 'Fazit', teaser: 'Alles wandelt sich, nichts vergeht.',
    motto: { orig: '„Omnia mutantur, nihil interit.“', lang: 'la', de: '„Alles wandelt sich, nichts vergeht.“', q: 'Ovid, Metamorphosen 15,165' },
    inhalt: 'Wandel durch die Zeit, Antwort auf die Leitfrage, Abspann mit Quellen, Bildnachweis und Glossar',
    moment: 'Zeitstrahl zeichnet sich, dann öffnen sich ihre Augen und die Seite wird von Stein zu Farbe; danach läuft der Abspann wie im Kino.',
    assets: 's9-augen', session: 3 }
];

function page(s, i) {
  const next = S[i + 1];
  const prev = S[i - 1];
  const mottoOrig = s.motto.orig ? `\n          <blockquote lang="${s.motto.lang}">${s.motto.orig}</blockquote>\n          <p class="motto__de">${s.motto.de}</p>` : `\n          <blockquote>${s.motto.de}</blockquote>`;
  const nextBlock = next
    ? `<a class="next__link" href="${next.id}.html">
        <span>
          <span class="eyebrow next__label">Weiter</span>
          <span class="next__title"><span class="greek">${next.b}</span>${next.t}</span>
          <span class="next__teaser">${next.teaser}</span>
        </span>
        <span class="next__preview" aria-hidden="true">${vorschau(bildVon(next.id) && '../media/motive/' + bildVon(next.id) + '.webp', next.b)}</span>
      </a>`
    : `<a class="next__link" href="../index.html">
        <span>
          <span class="eyebrow next__label">Zum Anfang</span>
          <span class="next__title">Die Verwandlung</span>
          <span class="next__teaser">Zurück zum Scroll-Film – und alles beginnt von vorn.</span>
        </span>
        <span class="next__preview" aria-hidden="true">${vorschau('../media/hero/keyframes/C.webp', 'Μ')}</span>
      </a>`;
  const back = prev
    ? `<a class="next__back" href="${prev.id}.html">← Zurück: <span class="greek">${prev.b}</span> ${prev.t}</a>`
    : `<a class="next__back" href="../index.html">← Zurück zur Startseite</a>`;

  return `<!doctype html>
<html lang="de">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title>${s.b} ${s.t} – Medusa</title>
  <meta name="description" content="${s.teaser}">
  <meta name="theme-color" content="#0D0F0E">
  <link rel="icon" href="../media/ui/schild-128.webp" type="image/webp">
  <link rel="stylesheet" href="../css/style.css">
  <link rel="stylesheet" href="../css/szenen.css">
  <link rel="stylesheet" href="../css/print.css" media="print">
  <script>
    (function (h) {
      try { var v = sessionStorage.getItem('medusa-tr'); if (v) { sessionStorage.removeItem('medusa-tr'); if (v === 'buchstabe') h.classList.add('tr-buchstabe'); h.classList.add('tr-in'); } } catch (e) {}
      if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) h.classList.add('reduced-motion');
    })(document.documentElement);
  </script>
</head>
<body class="page-scene" data-base="../" data-szene="${s.id}">

  <a class="skip-link" href="#inhalt">Zum Inhalt springen</a>

  <div class="transition" aria-hidden="true"><div class="transition__panel transition__panel--l"></div><div class="transition__panel transition__panel--r"></div><div class="transition__beam"></div><div class="transition__dark"></div><span class="transition__letter">${s.b}</span></div>

  <header class="site-header">
    <a class="logo" href="../index.html" aria-label="Medusa – zur Startseite"><img src="../media/ui/schild-128.webp" alt="" width="44" height="44"></a>
    <p class="scene-indicator"><span class="greek">${s.b}</span> · ${s.t}</p>
    <button class="menu-btn" type="button" aria-expanded="false"><span class="menu-btn__label">Menü</span><span class="menu-btn__lines" aria-hidden="true"></span></button>
  </header>

  <main id="inhalt" tabindex="-1">
    <section class="scene-title">
      <span class="scene-title__letter" aria-hidden="true">${s.b}</span>
      <p class="eyebrow scene-title__eyebrow">Szene ${i + 1} von 9</p>
      <h1 class="scene-title__name"><span class="greek">${s.b}</span>${s.t}</h1>
      <figure class="motto">${mottoOrig}
        <figcaption>${s.motto.q}</figcaption>
      </figure>
      <div class="scene-title__hint" aria-hidden="true">Scrollen<span class="hero__hint-line"></span></div>
    </section>

${inhalt(s)}
    <!-- PLATZHALTER-START -->
    <section class="scene-body">
      <div class="placeholder-box" data-reveal>
        <span class="placeholder-box__tag">Platzhalter · Session ${s.session}</span>
        <h2>Hier entsteht der große Moment dieser Szene.</h2>
        <dl>
          <dt>Inhalt</dt><dd>${s.inhalt}</dd>
          <dt>Großer Moment</dt><dd>${s.moment}</dd>
          <dt>Assets</dt><dd>${s.assets}</dd>
        </dl>
      </div>
    </section>
    <!-- PLATZHALTER-ENDE -->

    <nav class="next" aria-label="Weiter">
      ${nextBlock}
      ${back}
    </nav>
  </main>

  <script src="../js/vendor/gsap.min.js"></script>
  <script src="../js/vendor/ScrollTrigger.min.js"></script>
  <script src="../js/vendor/SplitText.min.js"></script>
  <script src="../js/vendor/DrawSVGPlugin.min.js"></script>
  <script src="../js/vendor/lenis.min.js"></script>
  <script src="../js/data.js"></script>
  <script src="../js/main.js"></script>${skript(s)}
</body>
</html>
`;
}

// Bildnachweis aus tools/commons-download.js
const CREDITS_FILE = path.join(__dirname, '..', 'quellen-bilder', 'bildnachweis.json');
const CREDITS = fs.existsSync(CREDITS_FILE) ? JSON.parse(fs.readFileSync(CREDITS_FILE, 'utf8')) : {};
function credit(key) {
  const c = CREDITS[key];
  if (!c) return '<span class="muted">[Bildnachweis folgt]</span>';
  const lic = /public domain/i.test(c.lizenz) ? 'gemeinfrei' : c.lizenz;
  const who = c.kuenstler && !/^unknown/i.test(c.kuenstler) ? c.kuenstler.replace(/\s*\(.*?\)\s*/g, ' ').trim() : '';
  const photo = /^(CC|GFDL)/i.test(lic) && who ? 'Foto: ' + who + ', ' : '';
  return '<span class="muted">' + photo + 'Wikimedia Commons, ' + lic + '</span>';
}
// Abbildungsnummern laufen über alle Szenen hinweg; Liste geht an den Abspann (js/bildnachweis.js)
let ABB = 0;
const ABB_LIST = [];
const cache = {};
function inhalt(s) {
  if (cache[s.id] !== undefined) return cache[s.id];
  const f = path.join(__dirname, 'inhalte', s.id + '.html');
  if (!fs.existsSync(f)) return (cache[s.id] = '');
  let h = fs.readFileSync(f, 'utf8');
  h = h.replace(/<figure[\s\S]*?<\/figure>|\{\{abbnr:([\w-]+)\|([^}]+)\}\}|\{\{abbki:([^}]+)\}\}/g, (fig, k2, t2, tki) => {
    if (tki) { // KI-Bild ohne <figure>, z. B. auf einer Bühne
      const n = ++ABB;
      ABB_LIST.push({ nr: n, szene: s.b + ' ' + s.t, titel: tki, key: null, ki: true, nachweis: null });
      return '<span class="abb">Abb. ' + n + '</span>' + tki + ' · <span class="muted">KI-generiert</span>';
    }
    if (k2) { // Abbildung ohne <figure>, z. B. Bildunterschrift auf einer Bühne
      const n = ++ABB;
      ABB_LIST.push({ nr: n, szene: s.b + ' ' + s.t, titel: t2, key: k2, ki: false, nachweis: CREDITS[k2] || null });
      return '<span class="abb">Abb. ' + n + '</span>' + t2 + ' · ' + credit(k2);
    }
    if (!fig.includes('{{abb}}')) return fig;
    const n = ++ABB;
    const key = (fig.match(/\{\{credit:([\w-]+)\}\}/) || [])[1] || null;
    const cap = (fig.match(/<b>([\s\S]*?)<\/b>/) || [])[1] || '';
    ABB_LIST.push({ nr: n, szene: s.b + ' ' + s.t, titel: cap.replace(/<[^>]+>/g, ''), key, ki: /KI-generiert/.test(fig), nachweis: key ? CREDITS[key] || null : null });
    return fig.replace('{{abb}}', String(n));
  });
  h = h.replace(/\{\{credit:([\w-]+)\}\}/g, (_, k) => credit(k));
  return (cache[s.id] = h);
}
function skript(s) {
  return fs.existsSync(path.join(OUT, '..', 'js', 'szenen', s.id + '.js')) ? '\n  <script src="../js/szenen/' + s.id + '.js"></script>' : '';
}

S.forEach((s, i) => {
  let html = page(s, i);
  if (inhalt(s)) html = html.replace(/\n    <!-- PLATZHALTER-START -->[\s\S]*?<!-- PLATZHALTER-ENDE -->\n/, '\n');
  fs.writeFileSync(path.join(OUT, s.id + '.html'), html, 'utf8');
  console.log('geschrieben:', s.id + '.html', inhalt(s) ? '(Inhalt)' : '(Platzhalter)');
});
fs.writeFileSync(path.join(OUT, '..', 'js', 'bildnachweis.js'),
  '/* automatisch erzeugt von tools/make-szenen.js – nicht von Hand ändern */\nwindow.MEDUSA_BILDNACHWEIS = ' + JSON.stringify(ABB_LIST, null, 1) + ';\n', 'utf8');
console.log('Abbildungen:', ABB_LIST.length);
