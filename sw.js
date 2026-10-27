/* Luna Arcana service worker – offline cache. Version changes whenever cached files change. */
const VERSION="luna-2377ac48a2";
const PRECACHE=["./", "index.html", "manifest.webmanifest", "icons/icon-192.png", "icons/icon-512.png", "icons/icon.svg", "lang/lt.json", "lib/lt.json", "lib/slugs.json", "img/hero.jpg", "img/dusk-red.jpg", "img/lighthouse-islet.jpg", "img/aurora-hills.jpg", "img/dusk-archipelago.jpg", "content/lt/astrology.json", "content/lt/dreams-a.json", "content/lt/dreams-b.json", "content/lt/encyclopedia.json", "content/lt/games.json", "content/lt/learn.json", "content/lt/learn2.json", "content/lt/lenormand.json", "content/lt/numerology.json", "content/lt/pairs-a.json", "content/lt/pairs-b.json", "content/lt/rituals-micro.json", "content/lt/rituals-season.json", "content/lt/rituals-sign.json", "content/lt/rituals.json", "content/lt/spreads.json", "content/lt/symbols.json", "content/lt/cards/kardai.json", "content/lt/cards/maj-a.json", "content/lt/cards/maj-b.json", "content/lt/cards/monetos.json", "content/lt/cards/skeptrai.json", "content/lt/cards/taures.json"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(VERSION).then(c=>c.addAll(PRECACHE)).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==VERSION).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{
  const r=e.request;if(r.method!=="GET")return;
  const url=new URL(r.url);
  // pages: network first, fall back to cache, then to the app shell
  if(r.mode==="navigate"){e.respondWith(fetch(r).then(res=>{const cp=res.clone();caches.open(VERSION).then(c=>c.put(r,cp));return res}).catch(()=>caches.match(r).then(m=>m||caches.match("index.html"))));return}
  // own files and Google Fonts: serve from cache, refresh in the background
  if(url.origin===location.origin||/fonts\.(googleapis|gstatic)\.com$/.test(url.hostname)){
    e.respondWith(caches.open(VERSION).then(async c=>{const hit=await c.match(r);
      const net=fetch(r).then(res=>{if(res&&(res.ok||res.type==="opaque"))c.put(r,res.clone());return res}).catch(()=>hit);
      return hit||net}));
  }
});
