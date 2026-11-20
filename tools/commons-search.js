// Sucht Dateien auf Wikimedia Commons und zeigt Größe, Lizenz, Urheber.
// Aufruf: node tools/commons-search.js "suchbegriff" [anzahl]
const q = process.argv[2], n = process.argv[3] || 8;
const UA = 'MedusaSchulprojekt/1.0 (Bildungsprojekt; Offline-Ausstellung)';
const u = 'https://commons.wikimedia.org/w/api.php?' + new URLSearchParams({
  action: 'query', format: 'json', generator: 'search', gsrnamespace: '6', gsrlimit: String(n), gsrsearch: q,
  prop: 'imageinfo', iiprop: 'url|size|extmetadata|mime'
});
fetch(u, { headers: { 'User-Agent': UA } }).then(r => r.json()).then(j => {
  const pages = Object.values((j.query || {}).pages || {}).sort((a, b) => a.index - b.index);
  for (const p of pages) {
    const ii = p.imageinfo[0], m = ii.extmetadata || {};
    const strip = s => (s || '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim().slice(0, 80);
    console.log(`${p.title} | ${ii.width}x${ii.height} | ${strip(m.LicenseShortName && m.LicenseShortName.value)} | ${strip(m.Artist && m.Artist.value)}`);
  }
}).catch(e => console.error('Fehler', e.message));
