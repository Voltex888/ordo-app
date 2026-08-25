const CACHE="ordo-v2-4";
const CORE=["./","./index.html","./manifest.webmanifest","./icon-192.png","./icon-512.png"];
self.addEventListener("install",event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(CORE)).then(()=>self.skipWaiting())));
self.addEventListener("activate",event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener("fetch",event=>{
  if(event.request.method!=="GET")return;
  event.respondWith(fetch(event.request).then(response=>{const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(event.request,copy));return response}).catch(()=>caches.match(event.request).then(hit=>hit||caches.match("./"))));
});
self.addEventListener("push",event=>{
  let data={title:"Ordo — lembrete",body:"Você tem um item programado agora."};
  try{data={...data,...event.data.json()}}catch{}
  event.waitUntil(self.registration.showNotification(data.title,{body:data.body,icon:"./icon-192.png",badge:"./icon-192.png",tag:data.tag||"ordo-alert",renotify:true,data:{url:data.url||"./"}}));
});
self.addEventListener("notificationclick",event=>{
  event.notification.close();
  event.waitUntil(clients.matchAll({type:"window",includeUncontrolled:true}).then(list=>{for(const client of list)if("focus"in client)return client.focus();return clients.openWindow(event.notification.data?.url||"/")}));
});
self.addEventListener("periodicsync",event=>{if(event.tag==="ordo-reminders")event.waitUntil(Promise.resolve())});
