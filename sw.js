/* Blisterborn: funziona anche offline dopo la prima apertura */
importScripts('./src/config.js');
const CACHE=`blisterborn-${GAME_CONFIG.version}`;
const SPRITE_GROUPS={
 portrait:['marco','davide','sara','elena'],
 cast:['capo','marta','paolo','negoziante','giulia','gatto','custode','jonas','renna','barcaiolo','guardiaparco','erik'],
 event:['rifugio','impronte','sole','cerotto','zanzara','scarpone','pioggia','vento','bussola','acqua','cibo','tenda','zaino','bivio','soldi','meraviglia','taccuino','persona','lemming','corvo'],
 gear:['zainoClassico','zainoUL','saccoPiuma','saccoSint','quiltPiuma','quiltSint','matGonfiabile','matSchiuma','trail','scarponi','basse','guscio','pile','ghette','bastoncini','sandali','rete','cappello','filtro','mappa','orologio','faro','kit','fornello','tenda','carte','pasti','barrette','gas','calze'],
 brand:['A','S','Sh','D'],
 walk:['marco','davide','sara','elena'],
 'walk-poles':['marco','davide','sara','elena'],
 'pose-poles':['marco','davide','sara','elena'],
 scene:['waterfall','suspension-bridge','ford','spring','fisherman-lake','stream-camp','lake-boat','double-rainbow','broken-bridge','deep-mud','bog-boardwalk','boulder-field','landslide','flower-meadow','blueberry-slope','snowfield','moose-birches','forest-smoke','reindeer-corral','sacred-boulder','turf-hut','ridge-routes','summit-panorama','narrow-canyon','evening-refuge','aurora-camp','trail-station']
};
const SPRITES=Object.entries(SPRITE_GROUPS).flatMap(([folder,names])=>names.map(name=>`./assets/sprites/${folder}/${name}.png`));
for(const person of SPRITE_GROUPS.portrait)for(const pose of ['walk','stand','sit','victory'])SPRITES.push(`./assets/sprites/pose/${person}-${pose}.png`);
const BACKGROUNDS=[
 'poi-t1-06-vuolle-overlook','poi-t3-05-mist-cairns','poi-t3-06-biegga-three-roofs',
 'poi-t4-04-raven-teeth','poi-t4-05-green-valley','poi-t4-06-sallo-from-above',
 'poi-t5-01-silent-meadow','poi-t5-03-cranes-boardwalk','poi-t5-05-icy-pool','poi-t5-06-guovda-smoke',
 'poi-t6-01-gaisi-birches','poi-t6-03-torrent-ledge','poi-t6-04-station-hill','poi-t6-05-gaisi-wall','poi-t6-06-last-switchback',
 'poi-t7-01-summit-marker','poi-t7-02-stone-slabs','poi-t7-03-snow-tongue','poi-t7-04-gaisi-shoulder','poi-t7-05-false-cairn',
 'poi-t8-01-first-road','poi-t8-02-return-forest','poi-t8-03-njalla-lake','poi-t8-04-boat-fork','poi-t8-05-reed-boardwalk','poi-t8-06-njalla-roofs',
 'final-njalla-bench','evening-vuolle','evening-gaskas','evening-biegga','evening-sallo','evening-guovda','evening-gaisi-station','evening-gaisi-return',
 'morning-vuolle-refuge','morning-vuolle-tent','morning-gaskas-refuge','morning-gaskas-tent','morning-biegga-refuge','morning-biegga-tent',
 'morning-sallo-refuge','morning-sallo-tent','morning-guovda-refuge','morning-guovda-tent','morning-gaisi-summit-refuge','morning-gaisi-summit-tent',
 'morning-gaisi-njalla-refuge','morning-gaisi-njalla-tent'
].map(name=>`./assets/backgrounds/${name}.jpg`);
const MAPS=Array.from({length:8},(_,i)=>`./assets/maps/stage-map-${i+1}.png`);
const PAPERS=Array.from({length:8},(_,stage)=>Array.from({length:4},(_,wear)=>`./assets/paper/paper-stage-${stage+1}-${wear+1}.jpg`)).flat();
const CORE=[
 './','./index.html','./styles.css','./manifest.webmanifest',
 './src/config.js','./src/data.js','./src/state.js','./src/content.js','./src/game.js',
 './src/visuals.js','./src/home.js','./src/bootstrap.js',
 './assets/art/trail-scenes.png','./assets/art/home-scenes.png',...SPRITES,...BACKGROUNDS,...MAPS,...PAPERS,
 './icons/icon-192.png','./icons/icon-512.png','./icons/maskable-192.png',
 './icons/maskable-512.png','./icons/apple-touch-icon.png'
];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;
 const url=new URL(r.url);
 if(url.origin===location.origin){
  /* pagina: prima la rete, così vedi sempre l'ultima versione; offline usa la copia */
  e.respondWith(fetch(r).then(res=>{const c=res.clone();caches.open(CACHE).then(k=>k.put(r,c));return res}).catch(()=>caches.match(r).then(m=>m||caches.match('./index.html'))));
 } else if(url.host.includes('fonts.googleapis.com')||url.host.includes('fonts.gstatic.com')){
  /* caratteri: copia locale appena possibile */
  e.respondWith(caches.match(r).then(m=>m||fetch(r).then(res=>{const c=res.clone();caches.open(CACHE).then(k=>k.put(r,c));return res})));
 }});
