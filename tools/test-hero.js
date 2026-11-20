// Testlauf: öffnet die Seite headless, sammelt Fehler und macht Bildschirmfotos an Scroll-Positionen.
// Aufruf: node tools/test-hero.js <ausgabeordner> [mobile]
const puppeteer = require('puppeteer-core');
const path = require('path');

const out = process.argv[2];
const mobile = process.argv[3] === 'mobile';
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const url = 'file:///' + path.resolve(__dirname, '..', 'medusa-website', 'index.html').replace(/\\/g, '/');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

(async () => {
  const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new' });
  const page = await browser.newPage();
  if (mobile) await page.emulate({ viewport: { width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true }, userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1' });
  else await page.setViewport({ width: 1440, height: 900 });
  const errors = [];
  page.on('console', (m) => { if (['error', 'warning'].includes(m.type())) errors.push(m.type() + ': ' + m.text()); });
  page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
  page.on('requestfailed', (r) => errors.push('requestfailed: ' + r.url()));

  const t0 = Date.now();
  await page.goto(url, { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => !document.querySelector('.loader'), { timeout: 15000 }).catch(() => errors.push('Loader nicht verschwunden'));
  console.log('Loader weg nach', Date.now() - t0, 'ms');
  await sleep(2600);
  const pre = mobile ? 'm' : 'd';
  await page.screenshot({ path: path.join(out, pre + '-00-start.png') });

  const H = await page.evaluate(() => window.innerHeight);
  const PIN = mobile ? 4.5 : 6;
  const shots = (process.env.SHOTS || '0.05,0.16,0.27,0.38,0.5,0.62,0.75,0.85,0.875,0.885,0.92,0.95,0.98,1.0').split(',').map(Number);
  for (const p of shots) {
    await page.evaluate((y) => { MEDUSA.lenis ? MEDUSA.lenis.scrollTo(y, { immediate: true, force: true }) : window.scrollTo(0, y); }, Math.round(p * H * PIN));
    await sleep(900);
    await page.screenshot({ path: path.join(out, pre + '-' + String(Math.round(p * 100)).padStart(3, '0') + '.png') });
  }
  // Übersicht
  await page.evaluate((y) => MEDUSA.lenis ? MEDUSA.lenis.scrollTo(y, { immediate: true, force: true }) : window.scrollTo(0, y), Math.round(H * PIN + H * 0.9));
  await sleep(1500);
  await page.screenshot({ path: path.join(out, pre + '-overview.png') });

  // Menü öffnen
  await page.evaluate(() => document.querySelector('.menu-btn').click());
  await sleep(1400);
  await page.screenshot({ path: path.join(out, pre + '-menu.png') });
  const aria = await page.evaluate(() => document.querySelector('.menu-btn').getAttribute('aria-expanded'));
  console.log('aria-expanded nach Klick:', aria);

  // Seitenübergang zu Szene Γ
  await Promise.all([
    page.waitForNavigation({ timeout: 10000 }),
    page.evaluate(() => [...document.querySelectorAll('.menu a')].find((a) => a.href.includes('perseus')).click())
  ]);
  await sleep(250);
  await page.screenshot({ path: path.join(out, pre + '-tr-cover.png') });
  await sleep(2600);
  await page.screenshot({ path: path.join(out, pre + '-perseus.png') });
  await page.evaluate(() => MEDUSA.lenis ? MEDUSA.lenis.scrollTo('bottom', { immediate: true, force: true }) : window.scrollTo(0, 1e6));
  await sleep(1500);
  await page.screenshot({ path: path.join(out, pre + '-perseus-end.png') });

  // Zurück-Taste
  await page.goBack();
  await sleep(1500);
  const backOk = await page.evaluate(() => location.href.endsWith('index.html'));
  console.log('Zurück-Taste:', backOk ? 'ok' : 'FEHLER');

  console.log(errors.length ? errors.join('\n') : 'Keine Fehler in der Konsole.');
  await browser.close();
})();
