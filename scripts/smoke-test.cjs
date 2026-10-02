const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('playwright');

const root = path.resolve(__dirname, '..');
const mime = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
};

const server = http.createServer((request, response) => {
  const pathname = new URL(request.url, 'http://localhost').pathname;
  const relative = pathname === '/' ? 'index.html' : pathname.slice(1);
  const target = path.resolve(root, relative);

  if (!target.startsWith(root + path.sep) && target !== path.join(root, 'index.html')) {
    response.writeHead(403).end();
    return;
  }

  fs.readFile(target, (error, body) => {
    if (error) {
      response.writeHead(404).end();
      return;
    }
    response.writeHead(200, { 'Content-Type': mime[path.extname(target)] || 'application/octet-stream' });
    response.end(body);
  });
});

(async () => {
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const { port } = server.address();
  const launchOptions = { headless: true };
  if (process.platform === 'win32') {
    const installedBrowsers = [
      'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
      'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    ];
    launchOptions.executablePath = installedBrowsers.find((candidate) => fs.existsSync(candidate));
  }
  const browser = await chromium.launch(launchOptions);
  const context = await browser.newContext();
  const page = await context.newPage();
  const errors = [];

  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error' && !message.text().startsWith('Failed to load resource:')) {
      errors.push(message.text());
    }
  });

  await page.goto(`http://127.0.0.1:${port}/`, { waitUntil: 'networkidle' });
  await page.getByText('Prototipo · versione 0.1.16').waitFor();
  if (await page.getByText('Marco', { exact: true }).count()) throw new Error('Il nome non deve comparire sotto il personaggio');

  await page.evaluate(() => {
    localStorage.setItem('blisterlands', JSON.stringify({
      screen: 'casa', mese: 7, anno: 1, soldi: 300, ferie: 8, forma: 60, voglia: 70,
      xp: 0, punti: 0, abil: { resistenza: 0 }, owned: ['sGita'], scorte: { pasti: 2 },
      timbri: [], storia: [], fila: 0, sconto: 0, completati: 0, vette: 0,
      carta: null, esito: null, ritorno: null, scelta: 'luglio',
    }));
  });
  await page.reload({ waitUntil: 'networkidle' });
  await page.getByRole('heading', { name: 'Luglio, anno 1' }).waitFor();
  await page.getByRole('button', { name: /Lavoro normale/ }).click();
  const migratedSave = await page.evaluate(() => ({
    current: JSON.parse(localStorage.getItem('blisterlands')),
    backup: JSON.parse(localStorage.getItem('blisterlands-backup-v0')),
  }));
  if (migratedSave.current.saveVersion !== 1 || !migratedSave.backup || 'saveVersion' in migratedSave.backup) {
    throw new Error('Migrazione del salvataggio precedente non riuscita');
  }

  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: 'networkidle' });
  await page.locator('.pgcard').nth(2).click();
  await page.getByLabel('Come ti chiamano lungo il cammino?').fill('Nico');
  await page.getByRole('button', { name: /Comincia ad aprile/ }).click();
  await page.getByRole('heading', { name: 'Aprile, anno 1' }).waitFor();
  const selectedPose = await page.locator('.pose-sprite .pose-art').getAttribute('src');
  if (!selectedPose || !selectedPose.includes('sara-sit.png')) throw new Error(`Personaggio scelto non conservato: ${selectedPose}`);
  await page.getByRole('button', { name: /Negozio/ }).click();
  await page.getByText('I quattro marchi').waitFor();
  if (await page.locator('.brand-logo').count() < 4) throw new Error('Loghi dei marchi mancanti nel negozio');
  await page.getByRole('button', { name: /Torna a casa/ }).click();
  const equipmentLook = await page.evaluate(() => {
    S.kit = new Set(['aFjellvind', 'shStorm', 'sCappello', 'aStav']);
    const host = document.createElement('div'); host.innerHTML = poseSprite('walk', 'prova'); const pose = host.firstElementChild;
    return { pack: pose.dataset.packBrand, clothes: pose.dataset.clothesBrand, hat: !!pose.querySelector('.wearable-hat'), poles: !!pose.querySelector('.wearable-poles') };
  });
  if (JSON.stringify(equipmentLook) !== JSON.stringify({ pack: 'A', clothes: 'Sh', hat: true, poles: true })) throw new Error(`Aspetto equipaggiamento errato: ${JSON.stringify(equipmentLook)}`);
  await page.reload({ waitUntil: 'networkidle' });

  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.reload({ waitUntil: 'networkidle' });
  await context.setOffline(true);
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.getByRole('heading', { name: 'Aprile, anno 1' }).waitFor();
  await context.setOffline(false);

  if (errors.length) throw new Error(errors.join('\n'));
  console.log('Smoke test: migrazione salvataggio, UI iniziale, ciclo di casa e avvio offline OK');

  await browser.close();
  server.close();
})().catch((error) => {
  console.error(error);
  server.close();
  process.exitCode = 1;
});
