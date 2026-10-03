const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { webcrypto } = require('node:crypto');

const root = path.resolve(__dirname, '..');
const errors = [];
const context = vm.createContext({ console, crypto: webcrypto, URLSearchParams, location: { search: '' } });

for (const relative of ['src/data.js', 'src/state.js', 'src/content.js']) {
  const source = fs.readFileSync(path.join(root, relative), 'utf8');
  new vm.Script(source, { filename: relative }).runInContext(context);
}

const model = vm.runInContext('({ITEMS,CONSUM,TAPPE,TERR,MESI,STATO,EV,BRANDS,CATALOG,MONTH_ONLY})', context);

function duplicateValues(values) {
  const seen = new Set();
  const duplicates = new Set();
  for (const value of values) (seen.has(value) ? duplicates : seen).add(value);
  return [...duplicates];
}

function requireUnique(label, values) {
  for (const value of duplicateValues(values)) errors.push(`${label} duplicato: ${value}`);
}

requireUnique('ID oggetto', model.ITEMS.map((item) => item.id));
requireUnique('ID evento', model.EV.map((event) => event.id));
requireUnique('ID consumabile', model.CONSUM.map((item) => item.id));

const itemIds = new Set(model.ITEMS.map((item) => item.id));
const consumableIds = new Set([...model.CONSUM.map((item) => item.id), 'batteria']);
const eventIds = new Set(model.EV.map((event) => event.id));
const stageNumbers = new Set(model.TAPPE.map((stage) => stage.n));
const terrains = new Set(Object.keys(model.TERR));
const states = new Set(Object.keys(model.STATO));
const months = new Set(Object.keys(model.MESI));

for (const item of model.ITEMS) {
  if (!item.id || !item.name) errors.push(`Oggetto incompleto: ${item.id || '(senza ID)'}`);
  if (item.base && !itemIds.has(item.base)) errors.push(`${item.id}: base inesistente ${item.base}`);
  if (item.brand && !model.BRANDS[item.brand]) errors.push(`${item.id}: marchio inesistente ${item.brand}`);
  if (item.a && Object.values(item.a).some((value) => value < 0 || value > 3)) errors.push(`${item.id}: caratteristica fuori scala 0-3`);
}

function validateEffects(eventId, effects) {
  if (!effects) return;
  for (const key of ['gain', 'lose']) {
    if (effects[key] && !itemIds.has(effects[key])) errors.push(`${eventId}: ${key} riferisce ${effects[key]}`);
  }
  for (const key of ['add', 'rm']) {
    for (const state of effects[key] || []) if (!states.has(state)) errors.push(`${eventId}: stato inesistente ${state}`);
  }
  for (const key of Object.keys(effects.give || {})) {
    if (!consumableIds.has(key)) errors.push(`${eventId}: consumabile inesistente ${key}`);
  }
  if (effects.later) validateEffects(eventId, effects.later.fx);
}

function validateOptions(event) {
  const descriptor = Object.getOwnPropertyDescriptor(event, 'o');
  if (!descriptor) {
    errors.push(`${event.id}: opzioni mancanti`);
    return;
  }
  if (descriptor.get) return;
  if (!Array.isArray(descriptor.value) || descriptor.value.length === 0) {
    errors.push(`${event.id}: elenco opzioni vuoto o non valido`);
    return;
  }
  for (const [index, option] of descriptor.value.entries()) {
    if (!option.l) errors.push(`${event.id}/${index}: etichetta opzione mancante`);
    for (const key of Object.keys(option.use || {})) {
      if (!consumableIds.has(key)) errors.push(`${event.id}/${index}: costo inesistente ${key}`);
    }
    const outcomes = Object.getOwnPropertyDescriptor(option, 'out');
    if (!outcomes) errors.push(`${event.id}/${index}: esiti mancanti`);
    else if (!outcomes.get) {
      if (!Array.isArray(outcomes.value) || outcomes.value.length === 0) errors.push(`${event.id}/${index}: esiti vuoti`);
      else for (const outcome of outcomes.value) validateEffects(event.id, outcome.f);
    }
  }
}

for (const event of model.EV) {
  if (!event.id || !event.title) errors.push(`Evento incompleto: ${event.id || '(senza ID)'}`);
  if (!['comune', 'regione', 'unico'].includes(event.cat)) errors.push(`${event.id}: categoria non valida ${event.cat}`);
  for (const stage of event.tappe || []) if (!stageNumbers.has(stage)) errors.push(`${event.id}: tappa inesistente ${stage}`);
  for (const terrain of event.ter || []) if (!terrains.has(terrain)) errors.push(`${event.id}: terreno inesistente ${terrain}`);
  validateOptions(event);
}

for (const [eventId, allowedMonths] of Object.entries(model.MONTH_ONLY)) {
  if (!eventIds.has(eventId)) errors.push(`Vincolo mensile per evento inesistente: ${eventId}`);
  for (const month of allowedMonths) if (!months.has(month)) errors.push(`${eventId}: mese inesistente ${month}`);
}

if (model.CATALOG.length !== 53) errors.push(`Catalogo: attesi 53 prodotti, trovati ${model.CATALOG.length}`);
if (model.EV.length !== 439) errors.push(`Eventi: attesi 439, trovati ${model.EV.length}`);

const configSource = fs.readFileSync(path.join(root, 'src/config.js'), 'utf8');
const visuals = fs.readFileSync(path.join(root, 'src/visuals.js'), 'utf8');
const worker = fs.readFileSync(path.join(root, 'sw.js'), 'utf8');
const readme = fs.readFileSync(path.join(root, 'README.md'), 'utf8');
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'manifest.webmanifest'), 'utf8'));
const configContext = vm.createContext({});
new vm.Script(configSource, { filename: 'src/config.js' }).runInContext(configContext);
const config = vm.runInContext('GAME_CONFIG', configContext);
const appVersion = config.version;
const documentedVersion = readme.match(/Prototipo `([^`]+)`/)?.[1];
if (!appVersion || appVersion !== documentedVersion || !worker.includes('GAME_CONFIG.version')) {
  errors.push(`Versioni non allineate: gioco=${appVersion}, README=${documentedVersion}, cache centralizzata=${worker.includes('GAME_CONFIG.version')}`);
}
if (manifest.name !== config.name || manifest.short_name !== config.name) errors.push(`Nome non allineato: config=${config.name}, manifest=${manifest.name}/${manifest.short_name}`);
if (/<svg\b/i.test(visuals)) errors.push('La nuova identità visiva deve usare risorse raster, non markup SVG');
for (const relative of ['protagonists.png','story-cast.png','event-icons.png','gear.png','trail-scenes.png','home-scenes.png','protagonist-poses.png','walk-cycle-v2.png','walk-cycle-poles.png','event-scenes-water.png','event-scenes-terrain.png','event-scenes-places.png']) {
  if (!fs.existsSync(path.join(root, 'assets/art', relative))) errors.push(`Risorsa grafica mancante: ${relative}`);
}
for (const [folder, expected] of Object.entries({ portrait: 4, cast: 12, event: 20, gear: 32, pose: 16, walk: 4, 'walk-poles': 4, 'pose-poles': 4, brand: 4, scene: 27 })) {
  const directory = path.join(root, 'assets', 'sprites', folder);
  const count = fs.existsSync(directory) ? fs.readdirSync(directory).filter((name) => name.endsWith('.png')).length : 0;
  if (count !== expected) errors.push(`Sprite ${folder}: attesi ${expected}, trovati ${count}`);
}
for (const relative of [
  ...['marco','davide','sara','elena'].map((name) => `base/${name}.png`),
  ...['pack-classic','pack-ul','hat-wool','hat-sun','net','shell','gloves','shoe-trail','shoe-low','shoe-boot','poles'].map((name) => `gear/${name}.png`),
]) if (!fs.existsSync(path.join(root, 'assets', 'sprites', 'rig', relative))) errors.push(`Strato personaggio mancante: ${relative}`);

context.location.search = '?seed=123456789';
const firstSequence = vm.runInContext('S=newState();[rnd(),rnd(),rnd(),rnd()]', context);
const secondSequence = vm.runInContext('S=newState();[rnd(),rnd(),rnd(),rnd()]', context);
if (JSON.stringify(firstSequence) !== JSON.stringify(secondSequence)) errors.push('Il generatore con seed non è riproducibile');

if (errors.length) {
  console.error(errors.map((error) => `- ${error}`).join('\n'));
  process.exitCode = 1;
} else {
  const categories = Object.groupBy(model.EV, (event) => event.cat);
  console.log(`Validazione OK: ${model.EV.length} eventi (${categories.comune.length} comuni, ${categories.regione.length} regionali, ${categories.unico.length} unici), ${model.CATALOG.length} prodotti, versione ${appVersion}`);
}
