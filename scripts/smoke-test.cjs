const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
let chromium;
try {
  ({ chromium } = require('playwright'));
} catch {
  ({ chromium } = require(path.join(
    process.env.USERPROFILE,
    '.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright',
  )));
}

const root = path.resolve(__dirname, '..');
const mime = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
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
  await page.setViewportSize({ width: 390, height: 844 });
  const errors = [];

  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error' && !message.text().startsWith('Failed to load resource:')) {
      errors.push(message.text());
    }
  });

  await page.goto(`http://127.0.0.1:${port}/`, { waitUntil: 'networkidle' });
  await page.getByText('Prototipo · versione 0.1.22').waitFor();
  const sceneCoverage = await page.evaluate(() => ({ scenes: new Set(Object.values(EVENT_SCENE)).size, events: Object.keys(EVENT_SCENE).length }));
  if (sceneCoverage.scenes !== 27 || sceneCoverage.events < 100) throw new Error(`Copertura paesaggi insufficiente: ${JSON.stringify(sceneCoverage)}`);
  const poiCoverage = await page.evaluate(() => ({ stages: POI.length, counts: POI.map((stage) => stage.length), names: new Set(POI.flat().map(([name]) => name)).size, assets: new Set(POI.flat().map(([,asset]) => asset)).size }));
  if (poiCoverage.stages !== 8 || poiCoverage.counts.some((count) => count !== 6) || poiCoverage.names !== 48 || poiCoverage.assets !== 48) throw new Error(`Copertura POI non valida: ${JSON.stringify(poiCoverage)}`);
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
  if (await page.locator('.hdr .pose-sprite').count()) throw new Error('Il personaggio non deve comparire nelle scene di casa');
  await page.getByRole('button', { name: /Negozio/ }).click();
  await page.getByText('I quattro marchi').waitFor();
  if (await page.locator('.brand-logo').count() < 4) throw new Error('Loghi dei marchi mancanti nel negozio');
  await page.getByRole('button', { name: /Torna a casa/ }).click();
  const equipmentLook = await page.evaluate(() => {
    S.kit = new Set(['aFjellvind', 'shStorm', 'sCappello', 'aStav']);
    const host = document.createElement('div'); host.innerHTML = poseSprite('walk', 'prova'); const pose = host.firstElementChild;
    const withPoles = { poles: pose.querySelector('.walk-art')?.dataset.poles, source: pose.querySelector('.walk-art')?.style.backgroundImage, overlays: pose.querySelectorAll('.wearable,.gear-tint').length };
    const standing = document.createElement('div'); standing.innerHTML = poseSprite('stand', 'prova');
    S.kit = new Set();
    const plain = document.createElement('div'); plain.innerHTML = poseSprite('walk', 'prova');
    S.current = EV.find((event) => event.id === 'cascata');
    const landscape = scene(TAPPE[0]);
    S.current = null;
    const routes = TAPPE.map((stage, index) => {
      S.tappa = index; S.seg = 2;
      const routeHost = document.createElement('div'); routeHost.innerHTML = scene(stage);
      const route = routeHost.querySelector('.route-overlay');
      return { src: route?.getAttribute('src'), stage: route?.dataset.stage, events: route?.dataset.events, done: route?.dataset.done };
    });
    S.tappa = 0; S.seg = 0;
    return { withPoles, standing: standing.querySelector('.pose-art')?.getAttribute('src'), plain: plain.querySelector('.walk-art')?.style.backgroundImage, landscape, routes };
  });
  if (equipmentLook.withPoles.poles !== 'yes' || !equipmentLook.withPoles.source.includes('walk-poles/sara.png') || equipmentLook.withPoles.overlays) throw new Error(`Animazione bastoncini errata: ${JSON.stringify(equipmentLook)}`);
  if (!equipmentLook.standing.includes('pose-poles/sara.png')) throw new Error(`Posa ferma con bastoncini errata: ${equipmentLook.standing}`);
  if (!equipmentLook.plain.includes('walk/sara.png')) throw new Error(`Animazione senza bastoncini errata: ${equipmentLook.plain}`);
  if (!equipmentLook.landscape.includes('scene/waterfall.png')) throw new Error('Paesaggio della cascata non coerente');
  if (equipmentLook.routes.length !== 8 || new Set(equipmentLook.routes.map((route) => route.src)).size !== 8) throw new Error('Le otto tappe devono avere tracce differenti');
  if (equipmentLook.routes.some((route, index) => !route.src?.startsWith('data:image/png') || route.stage !== String(index + 1) || route.events !== '6' || route.done !== '2')) throw new Error(`Punti delle tracce errati: ${JSON.stringify(equipmentLook.routes.map(({ stage, events, done }) => ({ stage, events, done })))}`);
  const trekLayout = await page.evaluate(() => {
    H.screen = null;
    S = newState();
    S.screen = 'tappa';
    S.seg = 3;
    S.gseg = Math.ceil(TAPPE.reduce((sum, t) => sum + t.terr.length, 0) * .75);
    render();
    const pose = document.querySelector('.trek-scene .pose-sprite').getBoundingClientRect();
    const sceneBox = document.querySelector('.trek-scene').getBoundingClientRect();
    const stats = document.querySelector('.ov-bot').getBoundingClientRect();
    const route = document.querySelector('.route-overlay');
    const title = getComputedStyle(document.querySelector('.ov-top'));
    const weather = getComputedStyle(document.querySelector('.weather-layer'));
    return { poseBottom: pose.bottom, statsTop: stats.top, poseLeft: (pose.left-sceneBox.left)/sceneBox.width, routeDone: route?.dataset.done, subtitle: document.querySelector('.ov-top span')?.textContent, wear: document.body.dataset.paperWear, titleZ: Number(title.zIndex), weatherZ: Number(weather.zIndex), titleBg: title.backgroundColor };
  });
  if (trekLayout.poseBottom > trekLayout.statsTop - 2) throw new Error(`Il personaggio invade la barra dei valori: ${JSON.stringify(trekLayout)}`);
  if (trekLayout.poseLeft > .04 || trekLayout.routeDone !== '3') throw new Error(`Personaggio o avanzamento fuori dalla partenza della traccia: ${JSON.stringify(trekLayout)}`);
  if (/[●○]/.test(trekLayout.subtitle || '')) throw new Error('I pallini non devono essere duplicati nel sottotitolo');
  if (trekLayout.titleZ <= trekLayout.weatherZ || trekLayout.titleBg !== 'rgb(243, 234, 214)') throw new Error(`Il meteo attraversa il titolo: ${JSON.stringify(trekLayout)}`);
  if (trekLayout.wear !== 'worn') throw new Error(`Il taccuino non si sporca con il cammino: ${JSON.stringify(trekLayout)}`);
  const lodgingScenes = await page.evaluate(() => {
    S.tappa = 5; S.lastSleep = 'letto'; S.forecast = { shown: 'sole' };
    const refuge = morningScene();
    S.lastSleep = 'tenda'; const tent = morningScene();
    S.tappa = 5; const evening = hutScene(TAPPE[5], true);
    S.tappa = 6; const returnEvening = hutScene(TAPPE[6], false);
    S.endKind = 'completo'; const ending = endScene();
    return { refuge, tent, evening, returnEvening, ending };
  });
  if (!lodgingScenes.refuge.includes('morning-gaisi-summit-refuge.jpg') || !lodgingScenes.tent.includes('morning-gaisi-summit-tent.jpg')) throw new Error('Varianti del mattino non coerenti con il pernottamento');
  if (!lodgingScenes.evening.includes('evening-gaisi-station.jpg') || !lodgingScenes.evening.includes('sauna-on') || !lodgingScenes.returnEvening.includes('evening-gaisi-return.jpg')) throw new Error('Arrivi alla Stazione del Gáisi non distinti');
  if (!lodgingScenes.ending.includes('final-njalla-bench.jpg')) throw new Error('Sfondo finale di Njalla mancante');
  const cleanAtHome = await page.evaluate(() => { H.screen = 'casa'; render(); return document.body.dataset.paperWear; });
  if (cleanAtHome !== 'clean') throw new Error(`Il taccuino a casa non e pulito: ${cleanAtHome}`);
  await page.reload({ waitUntil: 'networkidle' });

  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.reload({ waitUntil: 'networkidle' });
  await context.setOffline(true);
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.getByRole('heading', { name: 'Aprile, anno 1' }).waitFor();
  await context.setOffline(false);

  if (errors.length) throw new Error(errors.join('\n'));
  console.log(`Smoke test: migrazione, UI, 48 POI, arrivi/mattine/finale, ${sceneCoverage.scenes} paesaggi evento e avvio offline OK`);

  await browser.close();
  server.close();
})().catch((error) => {
  console.error(error);
  server.close();
  process.exitCode = 1;
});
