/* Blisterlands: funziona anche offline dopo la prima apertura */
const CACHE='blisterlands-v4';
const CORE=['./','./index.html','./manifest.webmanifest','./icons/icon-192.png','./icons/icon-512.png','./icons/maskable-192.png','./icons/maskable-512.png','./icons/apple-touch-icon.png'];
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
