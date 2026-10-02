/* Blisterborn: funziona anche offline dopo la prima apertura */
importScripts('./src/config.js');
const CACHE=`blisterborn-${GAME_CONFIG.version}`;
const SPRITE_GROUPS={
 portrait:['marco','davide','sara','elena'],
 cast:['capo','marta','paolo','negoziante','giulia','gatto','custode','jonas','renna','barcaiolo','guardiaparco','erik'],
 event:['rifugio','impronte','sole','cerotto','zanzara','scarpone','pioggia','vento','bussola','acqua','cibo','tenda','zaino','bivio','soldi','meraviglia','taccuino','persona','lemming','corvo'],
 gear:['zainoClassico','zainoUL','saccoPiuma','saccoSint','quiltPiuma','quiltSint','matGonfiabile','matSchiuma','trail','scarponi','basse','guscio','pile','ghette','bastoncini','sandali','rete','cappello','filtro','mappa','orologio','faro','kit','fornello','tenda','carte','pasti','barrette','gas','calze'],
 brand:['A','S','Sh','D'],
 walk:['marco','davide','sara','elena']
};
const SPRITES=Object.entries(SPRITE_GROUPS).flatMap(([folder,names])=>names.map(name=>`./assets/sprites/${folder}/${name}.png`));
for(const person of SPRITE_GROUPS.portrait){for(const pose of ['walk','stand','sit','victory']){SPRITES.push(`./assets/sprites/pose/${person}-${pose}.png`);for(const kind of ['jacket','pack'])SPRITES.push(`./assets/sprites/mask/pose/${person}-${pose}-${kind}.png`)}for(const kind of ['jacket','pack'])SPRITES.push(`./assets/sprites/mask/walk/${person}-${kind}.png`)}
const CORE=[
 './','./index.html','./styles.css','./manifest.webmanifest',
 './src/config.js','./src/data.js','./src/state.js','./src/content.js','./src/game.js',
 './src/visuals.js','./src/home.js','./src/bootstrap.js',
 './assets/art/trail-scenes.png','./assets/art/home-scenes.png',...SPRITES,
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
