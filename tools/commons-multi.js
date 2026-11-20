// Mehrere Commons-Suchen nacheinander mit Pause (Rate-Limit). Aufruf: node tools/commons-multi.js "q1" "q2" ...
const UA = 'MedusaSchulprojekt/1.0 (Bildungsprojekt; Offline-Ausstellung)';
const sleep = ms => new Promise(r => setTimeout(r, ms));
const strip = s => (s || '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim().slice(0, 70);
(async () => {
  for (const q of process.argv.slice(2)) {
    const u = 'https://commons.wikimedia.org/w/api.php?' + new URLSearchParams({ action: 'query', format: 'json', generator: 'search', gsrnamespace: '6', gsrlimit: '6', gsrsearch: q, prop: 'imageinfo', iiprop: 'size|extmetadata' });
    for (let tries = 0; tries < 4; tries++) {
      const r = await fetch(u, { headers: { 'User-Agent': UA } });
      const t = await r.text();
      if (t.startsWith('{')) {
        const pages = Object.values((JSON.parse(t).query || {}).pages || {}).sort((a, b) => a.index - b.index);
        console.log('=== ' + q);
        for (const p of pages) { const ii = p.imageinfo[0], m = ii.extmetadata || {}; console.log(`${p.title} | ${ii.width}x${ii.height} | ${strip(m.LicenseShortName && m.LicenseShortName.value)} | ${strip(m.Artist && m.Artist.value)}`); }
        break;
      }
      await sleep(15000);
    }
    await sleep(6000);
  }
})();
