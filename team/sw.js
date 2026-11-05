const C="luvina-team-v4";
const CORE=["./","index.html","kb.json","users.json","manifest.json","icon-192.png","icon-512.png","site.js","theme.css"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{
  const r=e.request;if(r.method!=="GET")return;
  const u=new URL(r.url);
  if(u.hostname==="api.github.com")return;
  // network-first for app files, cache fallback (works offline)
  e.respondWith(fetch(r).then(res=>{if(res&&(res.ok||res.type==="opaque")){const cp=res.clone();caches.open(C).then(c=>c.put(u.origin===location.origin?u.pathname:r,cp))}return res})
    .catch(()=>caches.match(u.origin===location.origin?u.pathname:r).then(m=>m||caches.match(r,{ignoreSearch:true}))));
});
