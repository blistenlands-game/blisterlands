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
  await page.getByText('Prototipo · versione 0.5.8').waitFor();
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
  const homeLook = await page.evaluate(() => ({
    shell: !!document.querySelector('.home-ui.home-casa'),
    atlas: getComputedStyle(document.querySelector('.home-diorama .scene-bg')).backgroundImage,
    stats: document.querySelectorAll('.home-stats>div').length,
  }));
  if (!homeLook.shell || !homeLook.atlas.includes('home-scenes-isometric-v2.png') || homeLook.stats !== 4) throw new Error(`Nuova interfaccia di casa incompleta: ${JSON.stringify(homeLook)}`);
  await page.getByRole('button', { name: /Lavoro normale/ }).click();
  const migratedSave = await page.evaluate(() => ({
    current: JSON.parse(localStorage.getItem('blisterlands')),
    backup: JSON.parse(localStorage.getItem('blisterlands-backup-v0')),
  }));
  if (migratedSave.current.saveVersion !== 3 || !migratedSave.current.owned.includes('sPantaloni') || !migratedSave.backup || 'saveVersion' in migratedSave.backup) {
    throw new Error('Migrazione del salvataggio precedente non riuscita');
  }

  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: 'networkidle' });
  await page.locator('.pgcard').nth(2).click();
  await page.getByLabel('Come ti chiamano lungo il cammino?').fill('Nico');
  await page.getByRole('button', { name: /Comincia ad aprile/ }).click();
  await page.getByRole('heading', { name: 'Aprile, anno 1' }).waitFor();
  if (await page.locator('.hdr .pose-sprite').count()) throw new Error('Il personaggio non deve comparire nelle scene di casa');
  const expandedHome = await page.evaluate(() => ({ cards: CARDS.length, statStates: document.querySelectorAll('.home-stat[class*="state-"]').length }));
  if (expandedHome.cards < 60 || expandedHome.statStates !== 4) throw new Error(`Casa non ampliata: ${JSON.stringify(expandedHome)}`);
  await page.getByRole('button', { name: /Personaggio/ }).click();
  await page.evaluate(() => { for(const id of ['shStorm','sGuanti','sGhette','shCarbon','sPantaloni'])H.owned.add(id);Object.assign(H.loadout,{guscio:'shStorm',guanti:'sGuanti',ghette:'sGhette',bastoncini:'shCarbon',pantaloni:'sPantaloni'});render(); });
  const characterLook = await page.evaluate(() => { const board=document.querySelector('.character-board').getBoundingClientRect(),avatar=document.querySelector('.character-avatar').getBoundingClientRect(),layers=[...document.querySelectorAll('.character-wear')],z=(selector)=>Number(getComputedStyle(document.querySelector(selector)).zIndex);return { front:getComputedStyle(document.querySelector('.character-front')).backgroundImage, files:layers.map(layer=>getComputedStyle(layer).backgroundImage), slots:document.querySelectorAll('.equipment-slot').length, wardrobe:document.querySelectorAll('.wardrobe-card').length, tabs:document.querySelectorAll('.character-tabs button').length, layers:layers.length, fullCanvas:layers.every(layer=>{const r=layer.getBoundingClientRect();return Math.abs(r.left-avatar.left)<1&&Math.abs(r.top-avatar.top)<1&&Math.abs(r.width-avatar.width)<1&&Math.abs(r.height-avatar.height)<1}), legacyIcons:document.querySelectorAll('.character-wear .gear-sprite').length, centerDelta:Math.abs((board.left+board.width/2)-(avatar.left+avatar.width/2)), topOverlap:!!document.querySelector('.wear-shell')&&!!document.querySelector('.wear-pile'), lowerLayers:!!document.querySelector('.wear-pants')&&!!document.querySelector('.wear-gaiters')&&!!document.querySelector('.wear-shoes'), poles:!!document.querySelector('.wear-poles')&&getComputedStyle(document.querySelector('.wear-poles')).display!=='none', layerOrder:z('.character-front')<z('.wear-pants')&&z('.wear-pants')<z('.wear-gaiters')&&z('.wear-pile')<z('.wear-shell')&&z('.wear-shell')<z('.wear-poles')&&z('.wear-poles')<z('.wear-gloves') }; });
  if (!characterLook.front.includes('character-front-swimsuit-v3.png') || characterLook.files.some(file=>!file.includes('-v2.png')) || characterLook.slots < 12 || characterLook.wardrobe < 8 || characterLook.tabs !== 2 || characterLook.layers < 8 || !characterLook.fullCanvas || characterLook.legacyIcons || characterLook.centerDelta > 1 || !characterLook.topOverlap || !characterLook.lowerLayers || !characterLook.poles || !characterLook.layerOrder) throw new Error(`Scheda personaggio incompleta: ${JSON.stringify(characterLook)}`);
  await page.locator('.equipment-slot').filter({ hasText: 'StormShell' }).click();
  await page.getByRole('button', { name: 'Disequipaggia' }).click();
  if (await page.locator('.wear-shell').count()) throw new Error('Il comando Disequipaggia non rimuove il guscio');
  await page.getByRole('button', { name: /Indietro/ }).click();
  await page.getByRole('button', { name: /Negozio/ }).click();
  await page.getByText('Conosci i quattro marchi').waitFor();
  const shopLook = await page.evaluate(() => ({ cards:document.querySelectorAll('.shop-card').length, categories:document.querySelectorAll('.shop-categories button').length, oldRows:document.querySelectorAll('.prod').length, detail:!!document.querySelector('.gear-detail'), shelfDisplay:getComputedStyle(document.querySelector('.shop-shelf')).display, shelfOverflow:getComputedStyle(document.querySelector('.shop-shelf')).overflowX, back:getComputedStyle(document.querySelector('.shop-back')).backgroundImage }));
  if (shopLook.cards < 4 || shopLook.categories !== 6 || shopLook.oldRows !== 0 || !shopLook.detail || shopLook.shelfDisplay !== 'grid' || shopLook.shelfOverflow === 'auto' || shopLook.shelfOverflow === 'scroll' || shopLook.back === 'none') throw new Error(`Nuovo negozio incompleto: ${JSON.stringify(shopLook)}`);
  if (await page.locator('.brand-logo').count() < 4) throw new Error('Loghi dei marchi mancanti nel negozio');
  await page.getByRole('button', { name: 'Abbigliamento', exact: true }).click();
  const apparelLook = await page.evaluate(() => {
    const cards = [...document.querySelectorAll('.shop-card')];
    const byType = (type) => cards.filter((card) => card.textContent.includes(type));
    const distinctIcons = (type) => new Set(byType(type).map((card) => card.querySelector('img')?.getAttribute('src'))).size;
    return { pants: byType('Pantaloni').length, shellIcons: distinctIcons('Guscio'), pileIcons: distinctIcons('Strato caldo') };
  });
  if (apparelLook.pants !== 4 || apparelLook.shellIcons !== 4 || apparelLook.pileIcons !== 3) throw new Error(`Varianti abbigliamento incomplete: ${JSON.stringify(apparelLook)}`);
  await page.getByRole('button', { name: 'Calzature', exact: true }).click();
  const gaiterLook = await page.evaluate(() => { const cards=[...document.querySelectorAll('.shop-card')].filter(card=>card.textContent.includes('Ghette'));return { cards:cards.length, icons:new Set(cards.map(card=>card.querySelector('img')?.getAttribute('src'))).size }; });
  if (gaiterLook.cards !== 3 || gaiterLook.icons !== 3) throw new Error(`Varianti ghette incomplete: ${JSON.stringify(gaiterLook)}`);
  await page.getByRole('button', { name: /Torna a casa/ }).click();
  await page.evaluate(() => { H.owned = new Set(['sGita','sRifugio','sZigzag','sCresta','sPile','sCappello']); prepareTrek(); });
  const packLook = await page.evaluate(() => ({ shell:!!document.querySelector('.pack-ui'), product:document.querySelectorAll('.pack-product .gear-sprite').length, people:document.querySelectorAll('.pack-hero .pose-sprite').length }));
  if (!packLook.shell || packLook.product !== 1 || packLook.people !== 0) throw new Error(`Nuova interfaccia zaino errata: ${JSON.stringify(packLook)}`);
  await page.evaluate(() => { H.screen='casa'; S.screen=null; render(); });
  const equipmentLook = await page.evaluate(() => {
    S.kit = new Set(['aFjellvind', 'shStorm', 'sCappello', 'sGuanti', 'aStav']);
    const host = document.createElement('div'); host.innerHTML = poseSprite('walk', 'prova'); const pose = host.firstElementChild;
    const withPoles = { poles: pose.dataset.poles, pack: pose.dataset.pack, packBrand: pose.dataset.packBrand, shoes: pose.dataset.shoes, hat: pose.dataset.hat, shell: pose.dataset.shell, gloves: pose.dataset.gloves, layers: [...pose.querySelectorAll('.rig-strip')].map((layer) => layer.className) };
    const standing = document.createElement('div'); standing.innerHTML = poseSprite('stand', 'prova');
    S.kit = new Set(['shAirpeak','sCresta','sBerretto','sRete']);
    const alternate = document.createElement('div'); alternate.innerHTML = poseSprite('walk', 'prova'); const altPose=alternate.firstElementChild;
    S.current = EV.find((event) => event.id === 'cascata');
    const landscape = scene(TAPPE[0]);
    S.current = null;
    const routes = TAPPE.map((stage, index) => {
      S.tappa = index; S.seg = 2;
      const routeHost = document.createElement('div'); routeHost.innerHTML = scene(stage);
      const route = routeHost.querySelector('.route-progress');
      return { src: route?.getAttribute('src'), stage: route?.dataset.stage, events: route?.dataset.events, done: route?.dataset.done };
    });
    S.tappa = 0; S.seg = 0;
    return { withPoles, standing: standing.querySelectorAll('.rig-strip').length, alternate:{pack:altPose.dataset.pack,shoes:altPose.dataset.shoes,hat:altPose.dataset.hat,net:altPose.dataset.net,poles:altPose.dataset.poles,layers:[...altPose.querySelectorAll('.rig-strip')].map(layer=>layer.className)}, landscape, routes };
  });
  if (equipmentLook.withPoles.poles !== 'yes' || equipmentLook.withPoles.pack !== 'classic' || equipmentLook.withPoles.packBrand !== 'A' || equipmentLook.withPoles.hat !== 'sun' || equipmentLook.withPoles.shell !== 'yes' || equipmentLook.withPoles.gloves !== 'yes' || !equipmentLook.withPoles.layers.some(layer=>layer.includes('rig-poles'))) throw new Error(`Composizione equipaggiamento errata: ${JSON.stringify(equipmentLook)}`);
  if (equipmentLook.standing < 7) throw new Error(`Posa ferma incompleta: ${equipmentLook.standing} strati`);
  if (equipmentLook.alternate.pack !== 'ul' || equipmentLook.alternate.shoes !== 'low' || equipmentLook.alternate.hat !== 'wool' || equipmentLook.alternate.net !== 'yes' || equipmentLook.alternate.poles !== 'no' || !equipmentLook.alternate.layers.some(layer=>layer.includes('rig-net'))) throw new Error(`Varianti equipaggiamento errate: ${JSON.stringify(equipmentLook.alternate)}`);
  if (!equipmentLook.landscape.includes('scene/waterfall.png')) throw new Error('Paesaggio della cascata non coerente');
  if (equipmentLook.routes.length !== 8 || new Set(equipmentLook.routes.map((route) => route.src)).size !== 8) throw new Error('Le otto tappe devono avere tracce differenti');
  if (equipmentLook.routes.some((route, index) => !route.src?.startsWith('data:image/png') || route.stage !== String(index + 1) || route.events !== '6' || route.done !== '2')) throw new Error(`Punti delle tracce errati: ${JSON.stringify(equipmentLook.routes.map(({ stage, events, done }) => ({ stage, events, done })))}`);
  const trekLayout = await page.evaluate(() => {
    H.screen = null;
    S = newState();
    S.screen = 'tappa';
    S.tappa = 0;
    S.seg = 3;
    S.current = null;
    S.gseg = Math.ceil(TAPPE.reduce((sum, t) => sum + t.terr.length, 0) * .75);
    render();
    const route = document.querySelector('.stage-one-map .route-progress');
    return {
      stage: !!document.querySelector('.stage-one-ui'),
      panorama: document.querySelector('.stage-one-diorama>.scene-bg')?.getAttribute('src'),
      walker: document.querySelectorAll('.map-hiker,.stage-one-ui .pose-sprite').length,
      stats: document.querySelectorAll('.stage-one-stats>div').length,
      dynamicStats: document.querySelectorAll('.dynamic-stats .home-stat[class*="state-"]').length,
      statTracks: document.querySelectorAll('.dynamic-stats .home-stat-track').length,
      tools: [...document.querySelectorAll('.stage-one-tools summary span')].map((node) => node.textContent),
      map: document.querySelector('.stage-one-map-sheet>img')?.getAttribute('src'),
      routeDone: route?.dataset.done,
      continueButton: document.querySelector('.stage-continue')?.textContent,
      paperStage: document.body.dataset.paperStage,
      paperLevel: document.body.dataset.paperLevel,
    };
  });
  if (!trekLayout.stage || !trekLayout.panorama?.includes('poi-t1-03-betulle-isometric.png')) throw new Error(`Panorama isometrico della prima tappa errato: ${JSON.stringify(trekLayout)}`);
  if (trekLayout.walker !== 0) throw new Error(`L'omino non deve comparire nella schermata di tappa: ${JSON.stringify(trekLayout)}`);
  if (trekLayout.stats !== 4 || trekLayout.dynamicStats !== 4 || trekLayout.statTracks !== 4 || !trekLayout.tools.includes('TACCUINO') || !trekLayout.tools.includes('ZAINO')) throw new Error(`Comandi o statistiche mancanti: ${JSON.stringify(trekLayout)}`);
  if (!trekLayout.map?.includes('stage-map-1.png') || trekLayout.routeDone !== '3') throw new Error(`Mappa della tappa non disponibile: ${JSON.stringify(trekLayout)}`);
  if (!trekLayout.continueButton?.includes('CONTINUA') || trekLayout.paperStage !== '1' || trekLayout.paperLevel !== '3') throw new Error(`Pannello di avanzamento errato: ${JSON.stringify(trekLayout)}`);
  await page.locator('.stage-one-diorama .diorama-canvas canvas').waitFor();
  await page.waitForFunction(() => document.querySelector('.stage-one-diorama')?.classList.contains('diorama-ready'));
  const diorama = await page.evaluate(() => ({
    ready: document.querySelector('.stage-one-diorama')?.classList.contains('diorama-ready'),
    poi: document.querySelector('.diorama-canvas')?.dataset.poi,
    src: document.querySelector('.diorama-canvas')?.dataset.src,
    backgroundAnimation: getComputedStyle(document.querySelector('.stage-one-diorama>.scene-bg')).animationName,
    backgroundOpacity: getComputedStyle(document.querySelector('.stage-one-diorama>.scene-bg')).opacity,
  }));
  if (!diorama.ready || diorama.poi !== '2' || !diorama.src?.includes('poi-t1-03-betulle-isometric.png') || diorama.backgroundAnimation !== 'none' || diorama.backgroundOpacity !== '1') throw new Error(`Animazione ambientale isometrica errata: ${JSON.stringify(diorama)}`);
  const allStageLayouts = await page.evaluate(() => TAPPE.map((stage, index) => {
    S = newState(); S.screen = 'tappa'; S.tappa = index; S.seg = 3; S.current = null; S.wx = index % 2 ? 'nuvole' : 'sole'; render();
    return {
      stage: index + 1,
      ui: !!document.querySelector('.stage-one-ui'),
      image: document.querySelector('.stage-one-diorama>.scene-bg')?.getAttribute('src') || document.querySelector('.stage-one-diorama>.scene-bg')?.dataset.atlas,
      map: document.querySelector('.stage-one-map-sheet>img')?.getAttribute('src'),
      route: document.querySelector('.stage-one-map .route-progress')?.dataset.stage,
      heading: document.querySelector('.stage-one-heading>b')?.textContent,
      title: document.querySelector('.stage-one-heading h2')?.textContent,
      choices: document.querySelectorAll('.stage-event-choice').length,
      walker: document.querySelectorAll('.map-hiker,.stage-one-ui .pose-sprite').length,
    };
  }));
  if (allStageLayouts.some((stage, index) => !stage.ui || !stage.image || !stage.map?.includes(`stage-map-${index + 1}.png`) || stage.route !== String(index + 1) || !stage.title || stage.walker !== 0 || (index>0&&!stage.image.includes(`poi-t${index+1}-03-isometric-hd-v2.png`)))) throw new Error(`Interfacce delle otto tappe incomplete: ${JSON.stringify(allStageLayouts)}`);
  if (new Set(allStageLayouts.map((stage) => stage.image)).size !== 8) throw new Error(`I panorami delle tappe non sono distinti: ${JSON.stringify(allStageLayouts)}`);
  const laterEventLayout = await page.evaluate(() => {
    S = newState(); S.screen = 'tappa'; S.tappa = 4; S.seg = 2; S.current = EV.find((event) => event.id === 'corvo') || EV[0]; render();
    const paper = document.querySelector('.stage-one-event')?.getBoundingClientRect(), ui = document.querySelector('.stage-one-ui')?.getBoundingClientRect();
    return { event: !!paper, choices: document.querySelectorAll('.stage-event-choice').length, stage: document.querySelector('.stage-one-ui')?.className, bottom: paper?.bottom, uiBottom: ui?.bottom };
  });
  if (!laterEventLayout.event || laterEventLayout.choices < 2 || !laterEventLayout.stage?.includes('stage-5') || Math.abs(laterEventLayout.bottom-laterEventLayout.uiBottom) > 1) throw new Error(`Evento delle tappe successive non impaginato: ${JSON.stringify(laterEventLayout)}`);
  const allArrivals = await page.evaluate(() => TAPPE.slice(0,7).map((stage, index) => {
    S = newState(); S.screen = 'sera'; S.tappa = index; S.arrive = 990; S.full = false; S.closed = false; S.arrMsg = []; S.forecast = { real: 'sole', shown: 'sole' }; render();
    return { stage:index+1, arrival:!!document.querySelector('.stage-one-ui.arrival'), image:document.querySelector('.arrival-diorama>.scene-bg')?.getAttribute('src'), title:document.querySelector('.stage-one-arrival-heading h2')?.textContent, sleep:document.querySelectorAll('.arrival-choice').length, shop:!!document.querySelector('.arrival-service>summary'), shopExpected:!!stage.shop, sauna:document.querySelectorAll('.arrival-smoke').length, saunaExpected:!!stage.sauna };
  }));
  if (allArrivals.some((arrival) => !arrival.arrival || !arrival.image || !arrival.title || arrival.sleep < 3 || (arrival.shopExpected && !arrival.shop) || (arrival.saunaExpected && arrival.sauna !== 2) || (!arrival.saunaExpected && arrival.sauna !== 0))) throw new Error(`Arrivi non completi: ${JSON.stringify(allArrivals)}`);
  if (new Set(allArrivals.map((arrival) => arrival.image)).size !== 7) throw new Error(`Gli arrivi non hanno sette fondali distinti: ${JSON.stringify(allArrivals)}`);
  const allMornings = await page.evaluate(() => TAPPE.slice(0,7).map((stage,index) => {
    S = newState(); S.screen = 'mattino'; S.tappa = index; S.lastSleep = index%2?'tenda':'letto'; S.night = []; S.forecast = { real:'sole', shown:index%2?'nuvole':'sole' }; render();
    return { stage:index+1, morning:!!document.querySelector('.stage-one-ui.morning'), image:document.querySelector('.morning-diorama>.scene-bg')?.getAttribute('src'), choices:document.querySelectorAll('.morning-choices .arrival-choice').length, tools:document.querySelectorAll('.stage-morning-paper .stage-one-tools details').length };
  }));
  if (allMornings.some((morning,index) => !morning.morning || !morning.image || morning.choices < 4 || morning.tools !== 2 || (index===5 && morning.choices !== 5))) throw new Error(`Mattini non completi: ${JSON.stringify(allMornings)}`);
  const finalLayout = await page.evaluate(() => {
    S = newState(); S.screen = 'fine'; S.tappa = 7; S.endKind = 'completo'; S.end = 'Arrivi a Njalla. Hai completato la Via delle Renne.'; S.timbri = ['Vuolle','Gaskas','Biegga','Sállo','Guovda','Gáisi','Njalla']; render();
    const ui=document.querySelector('.stage-one-ui'),paper=document.querySelector('.stage-final-paper');
    return { final:!!document.querySelector('.trail-final.completed'), image:document.querySelector('.final-diorama>.scene-bg')?.getAttribute('src'), stats:document.querySelectorAll('.trail-summary>div').length, restart:document.querySelector('.final-restart')?.textContent, height:ui?.getBoundingClientRect().height, paperBottom:paper?.getBoundingClientRect().bottom, uiBottom:ui?.getBoundingClientRect().bottom };
  });
  if (!finalLayout.final || !finalLayout.image?.includes('final-njalla-bench.jpg') || finalLayout.stats !== 4 || !finalLayout.restart?.includes('RICOMINCIA') || Math.abs(finalLayout.paperBottom-finalLayout.uiBottom)>1) throw new Error(`Finale non completo: ${JSON.stringify(finalLayout)}`);
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
  const eveningEffects = await page.evaluate(() => {
    S.tappa = 0; S.wx = 'sole';
    const host = document.createElement('div');
    host.innerHTML = hutScene(TAPPE[0], true);
    document.body.append(host);
    const result = { sun: getComputedStyle(host.querySelector('.weather-sun')).display, stage: host.querySelector('.evening-scene')?.className, image: host.querySelector('.scene-bg')?.getAttribute('src'), glow: !!host.querySelector('.sauna-glow'), smoke: host.querySelectorAll('.sauna-smoke').length };
    host.remove();
    return result;
  });
  if (eveningEffects.sun !== 'none' || !eveningEffects.stage?.includes('stage-1') || !eveningEffects.stage?.includes('isometric-refuge') || !eveningEffects.image?.includes('poi-t1-vuolle-refuge-isometric-v1.png') || !eveningEffects.glow || eveningEffects.smoke !== 2) throw new Error(`Effetti serali o sauna errati: ${JSON.stringify(eveningEffects)}`);
  const stageOneArrival = await page.evaluate(() => {
    H.screen = null; S = newState(); S.screen = 'sera'; S.tappa = 0; S.arrive = 990; S.full = false; S.closed = false; S.arrMsg = []; S.forecast = { real: 'sole', shown: 'sole' }; render();
    const open = { image: document.querySelector('.arrival-diorama>.scene-bg')?.getAttribute('src'), smoke: document.querySelectorAll('.arrival-smoke').length, choices: document.querySelectorAll('.arrival-choice').length, bottom: document.querySelector('.stage-one-arrival-paper')?.getBoundingClientRect().bottom, uiBottom: document.querySelector('.stage-one-ui')?.getBoundingClientRect().bottom };
    S.arrive = 1050; S.full = true; render();
    const closed = { image: document.querySelector('.arrival-diorama>.scene-bg')?.getAttribute('src'), smoke: document.querySelectorAll('.arrival-smoke').length, label: document.querySelector('.arrival-closed')?.textContent };
    return { open, closed };
  });
  if (!stageOneArrival.open.image?.includes('poi-t1-vuolle-refuge-isometric-v1.png') || stageOneArrival.open.smoke !== 2 || stageOneArrival.open.choices < 4 || Math.abs(stageOneArrival.open.bottom-stageOneArrival.open.uiBottom) > 1) throw new Error(`Arrivo Vuolle aperto errato: ${JSON.stringify(stageOneArrival)}`);
  if (!stageOneArrival.closed.image?.includes('poi-t1-vuolle-refuge-isometric-closed-v1.png') || stageOneArrival.closed.smoke !== 0 || !stageOneArrival.closed.label?.includes('SAUNA CHIUSA')) throw new Error(`Arrivo Vuolle chiuso errato: ${JSON.stringify(stageOneArrival)}`);
  if (!lodgingScenes.ending.includes('final-njalla-bench.jpg')) throw new Error('Sfondo finale di Njalla mancante');
  const cleanAtHome = await page.evaluate(() => { H.screen = 'casa'; save(); render(); return { wear: document.body.dataset.paperWear, stage: document.body.dataset.paperStage, level: document.body.dataset.paperLevel }; });
  if (cleanAtHome.wear !== 'clean' || cleanAtHome.stage !== '1' || cleanAtHome.level !== '1') throw new Error(`Il taccuino a casa non e pulito: ${JSON.stringify(cleanAtHome)}`);
  await page.reload({ waitUntil: 'networkidle' });

  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.reload({ waitUntil: 'networkidle' });
  await context.setOffline(true);
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.getByRole('heading', { name: 'Aprile, anno 1' }).waitFor();
  await context.setOffline(false);

  if (errors.length) throw new Error(errors.join('\n'));
  console.log(`Smoke test: migrazione, UI, rig equipaggiamento, diorama, 48 POI, 8 mappe, 32 taccuini, arrivi/mattine/finale e avvio offline OK`);

  await browser.close();
  server.close();
})().catch((error) => {
  console.error(error);
  server.close();
  process.exitCode = 1;
});
