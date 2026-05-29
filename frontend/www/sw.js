// ========================================
// 🙏 SERVICE WORKER - CONVERSE COM MARIA
// Estratégia: network-first pra HTML/JS (sempre atualiza)
//             cache-first pra assets imutáveis (PNG, MP3, fonts)
//             bypass total pra APIs e CDNs externos
// ========================================

// VERSION: bump esse valor pra forçar invalidação total do cache em todos
// os clientes na próxima visita. Use data + sequencial.
const VERSION = '2026-05-28-001';
const CACHE_RUNTIME = `maria-runtime-${VERSION}`;  // HTML, JS, CSS, JSON
const CACHE_ASSETS  = `maria-assets-${VERSION}`;   // Imagens, fonts, áudio

// Apenas o essencial pra exibir splash offline
const PRECACHE = [
  '/maria-splash.jpg'
];

// Hosts cujas respostas NUNCA cachemos (controle externo + dinâmicos)
const BYPASS_HOSTS = [
  'googleapis.com',
  'gstatic.com',
  'firebaseio.com',
  'firebaseapp.com',
  'web.app',
  'cdnjs.cloudflare.com',
  'cdn.tailwindcss.com',
  'fonts.googleapis.com',
  'fonts.gstatic.com',
  'cdn.jsdelivr.net',
  'mercadopago.com',
  'stripe.com'
];

// Regex pra detectar assets "estáveis" (cache-first)
const ASSET_REGEX = /\.(png|jpg|jpeg|gif|svg|webp|avif|mp3|wav|ogg|m4a|woff|woff2|ttf|otf|eot|ico)(\?.*)?$/i;

// ========== INSTALL ==========
self.addEventListener('install', (event) => {
  console.log('🙏 SW instalando — version', VERSION);
  event.waitUntil(
    caches.open(CACHE_ASSETS)
      .then((cache) => cache.addAll(PRECACHE).catch(e => console.warn('Precache falhou parcial:', e)))
      .then(() => self.skipWaiting())
  );
});

// ========== ACTIVATE ==========
self.addEventListener('activate', (event) => {
  console.log('✅ SW ativado — version', VERSION);
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_RUNTIME && name !== CACHE_ASSETS)
          .map((name) => {
            console.log('🗑️ Removendo cache antigo:', name);
            return caches.delete(name);
          })
      ))
      .then(() => self.clients.claim())
  );
});

// ========== FETCH ==========
self.addEventListener('fetch', (event) => {
  const req = event.request;

  // Só GET (skips POST de API, navegação especial, etc)
  if (req.method !== 'GET') return;

  let url;
  try { url = new URL(req.url); } catch (e) { return; }

  // BYPASS 1 — API do próprio backend
  if (url.pathname.includes('/api/')) return;

  // BYPASS 2 — hosts externos (Firebase, CDNs, payment processors)
  if (BYPASS_HOSTS.some(h => url.hostname.endsWith(h))) return;

  // CACHE-FIRST pra assets imutáveis (PNG/MP3/fonts/etc)
  if (ASSET_REGEX.test(url.pathname)) {
    event.respondWith(handleAsset(req));
    return;
  }

  // NETWORK-FIRST com timeout 3s pra HTML/JS/CSS/JSON (conteúdo "vivo")
  event.respondWith(handleRuntime(req));
});

// Cache-first pra assets: tenta cache, senão network e cacheia
async function handleAsset(req) {
  const cache = await caches.open(CACHE_ASSETS);
  const cached = await cache.match(req);
  if (cached) {
    // Background revalidate (stale-while-revalidate light)
    fetch(req).then(resp => {
      if (resp && resp.ok) cache.put(req, resp.clone()).catch(() => {});
    }).catch(() => {});
    return cached;
  }
  try {
    const resp = await fetch(req);
    if (resp && resp.ok) cache.put(req, resp.clone()).catch(() => {});
    return resp;
  } catch (e) {
    return new Response('Offline — sem cache local', { status: 503 });
  }
}

// Network-first com timeout: tenta network 3s, fallback cache
async function handleRuntime(req) {
  const cache = await caches.open(CACHE_RUNTIME);
  try {
    const networkResp = await Promise.race([
      fetch(req),
      new Promise((_, reject) => setTimeout(() => reject(new Error('SW timeout')), 3000))
    ]);
    if (networkResp && networkResp.ok) {
      cache.put(req, networkResp.clone()).catch(() => {});
    }
    return networkResp;
  } catch (e) {
    const cached = await cache.match(req);
    if (cached) return cached;
    // Último recurso: tenta cache de qualquer namespace
    const anyCache = await caches.match(req);
    if (anyCache) return anyCache;
    return new Response('Offline — recarregue quando tiver conexão', {
      status: 503,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' }
    });
  }
}

// ========== PUSH NOTIFICATIONS (inalterado) ==========
self.addEventListener('push', (event) => {
  console.log('📬 Push recebido');
  let data = {
    title: 'Maria tem uma palavra para você',
    body: 'Venha conversar com Nossa Senhora',
    icon: '/icons/icon-192.png'
  };
  if (event.data) {
    try { data = event.data.json(); }
    catch (e) { data.body = event.data.text(); }
  }
  const options = {
    body: data.body,
    icon: data.icon || '/icons/icon-192.png',
    badge: '/icons/icon-72.png',
    vibrate: [100, 50, 100],
    data: { url: data.url || '/' }
  };
  event.waitUntil(self.registration.showNotification(data.title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        if (clientList.length > 0) return clientList[0].focus();
        return clients.openWindow(event.notification.data.url || '/');
      })
  );
});

// ========== MENSAGEM DO APP (forçar update) ==========
self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') self.skipWaiting();
  if (event.data === 'CLEAR_CACHE') {
    caches.keys().then(keys => Promise.all(keys.map(k => caches.delete(k))))
      .then(() => event.source && event.source.postMessage('CACHE_CLEARED'));
  }
});
