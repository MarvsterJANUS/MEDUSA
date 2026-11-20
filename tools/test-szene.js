// Testlauf einer Szene: node tools/test-szene.js <id> <ausgabeordner> [mobile] [anzahl]
const puppeteer = require('puppeteer-core');
const path = require('path');
const [id, out, mode, nArg] = process.argv.slice(2);
const mobile = mode === 'mobile';
const N = +nArg || 14;
const url = 'file:///' + path.resolve(__dirname, '..', 'medusa-website', 'szenen', id + '.html').split(path.sep).join('/');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
(async () => {
  const browser = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: 'new' });
  const page = await browser.newPage();
  if (mobile) await page.emulate({ viewport: { width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true }, userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148 Safari/604.1' });
  else await page.setViewport({ width: 1440, height: 900 });
  const errors = [];
  page.on('console', (m) => { if (['error', 'warning'].includes(m.type())) errors.push(m.type() + ': ' + m.text()); });
  page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
  page.on('requestfailed', (r) => errors.push('requestfailed: ' + r.url()));
  await page.goto(url, { waitUntil: 'load' });
  await sleep(2500);
  const max = await page.evaluate(() => document.documentElement.scrollHeight - innerHeight);
  console.log(id, mobile ? 'mobil' : 'desktop', 'Scrollhöhe', max);
  for (let i = 0; i < N; i++) {
    const y = Math.round((i / (N - 1)) * max);
    await page.evaluate((y) => { MEDUSA.lenis ? MEDUSA.lenis.scrollTo(y, { immediate: true, force: true }) : scrollTo(0, y); }, y);
    await sleep(1100);
    await page.screenshot({ path: path.join(out, (mobile ? 'm' : 'd') + '-' + id + '-' + String(i).padStart(2, '0') + '.png') });
  }
  if (id === 'herkunft' || id === 'mythos' || id === 'perseus' || id === 'schutzzeichen') {
    const btn = await page.$('.more-btn');
    if (btn) {
      await page.evaluate(() => { const b = document.querySelector('.more-btn'); b.scrollIntoView({ block: 'center' }); });
      await sleep(600);
      await page.evaluate(() => document.querySelector('.more-btn').click());
      await sleep(1200);
      await page.screenshot({ path: path.join(out, (mobile ? 'm' : 'd') + '-' + id + '-panel.png') });
    }
  }
  console.log(errors.length ? errors.join('\n') : 'Keine Fehler.');
  await browser.close();
})();
