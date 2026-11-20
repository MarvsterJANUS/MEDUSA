// Lädt Commons-Dateien (Standardbreite 1920 px) und notiert Bildnachweis. Aufruf: node tools/commons-download.js liste.json
// liste.json: [{ "key": "s3-bj-01", "titles": ["File:...", "File:... (Ersatz)"] }, ...]
const fs = require('fs'), path = require('path');
const UA = 'MedusaSchulprojekt/1.0 (Bildungsprojekt; Offline-Ausstellung)';
const OUT = path.join(__dirname, '..', 'quellen-bilder');
const CREDITS = path.join(OUT, 'bildnachweis.json');
fs.mkdirSync(OUT, { recursive: true });
const sleep = ms => new Promise(r => setTimeout(r, ms));
const strip = s => (s || '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
async function api(params) {
  const u = 'https://commons.wikimedia.org/w/api.php?' + new URLSearchParams(Object.assign({ action: 'query', format: 'json' }, params));
  for (let t = 0; t < 5; t++) {
    const r = await fetch(u, { headers: { 'User-Agent': UA } }); const x = await r.text();
    if (x.startsWith('{')) return JSON.parse(x);
    await sleep(20000);
  }
  throw new Error('API blockiert');
}
(async () => {
  const list = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
  const credits = fs.existsSync(CREDITS) ? JSON.parse(fs.readFileSync(CREDITS, 'utf8')) : {};
  for (const item of list) {
    if (credits[item.key] && fs.existsSync(path.join(OUT, item.key + '.jpg'))) { console.log('schon da:', item.key); continue; }
    let ok = false;
    for (const title of item.titles) {
      const j = await api({ titles: title, prop: 'imageinfo', iiprop: 'url|size|extmetadata', iiurlwidth: '1920' });
      const p = Object.values(j.query.pages)[0];
      await sleep(4000);
      if (!p.imageinfo) { console.log('  nicht gefunden:', title); continue; }
      let ii = p.imageinfo[0];
      const m = ii.extmetadata || {};
      // Nur Standardbreiten vom Thumb-Server – das Original-Server-Limit greift sonst sofort
      if (ii.width <= 1920) {
        const w = [1280, 960, 500].find((x) => x < ii.width) || 500;
        await sleep(3000);
        const j2 = await api({ titles: title, prop: 'imageinfo', iiprop: 'url|size', iiurlwidth: String(w) });
        ii = Object.assign({}, ii, { thumburl: Object.values(j2.query.pages)[0].imageinfo[0].thumburl });
      }
      const url = ii.thumburl;
      let buf;
      for (let t = 0; t < 5; t++) {
        const r = await fetch(url, { headers: { 'User-Agent': UA } });
        if (r.ok) { buf = Buffer.from(await r.arrayBuffer()); break; }
        console.log('  warte (HTTP ' + r.status + ')'); await sleep(20000);
      }
      if (!buf) { console.log('  Download fehlgeschlagen:', title); continue; }
      fs.writeFileSync(path.join(OUT, item.key + '.jpg'), buf);
      credits[item.key] = {
        datei: p.title, seite: ii.descriptionurl,
        titel: strip(m.ObjectName && m.ObjectName.value), kuenstler: strip(m.Artist && m.Artist.value),
        datum: strip(m.DateTimeOriginal && m.DateTimeOriginal.value), lizenz: strip(m.LicenseShortName && m.LicenseShortName.value),
        lizenzUrl: strip(m.LicenseUrl && m.LicenseUrl.value), credit: strip(m.Credit && m.Credit.value).slice(0, 200),
        breite: ii.width, hoehe: ii.height
      };
      fs.writeFileSync(CREDITS, JSON.stringify(credits, null, 2));
      console.log('ok:', item.key, '<-', p.title, '|', credits[item.key].lizenz, '|', (buf.length / 1024 | 0) + ' KB');
      ok = true; await sleep(5000); break;
    }
    if (!ok) console.log('FEHLT:', item.key);
  }
})();
