// ========================================
// 🙏 SERVICE WORKER - CONVERSE COM MARIA
// PWA + Notificações (sem cache agressivo)
// ========================================

const CACHE_NAME = 'maria-v2';

// Apenas arquivos essenciais para offline
const urlsToCache = [
  '/maria-splash.jpg'
];

// INSTALL
self.addEventListener('install', (event) => {
  console.log('🙏 Service Worker instalado');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
  self.skipWaiting();
});

// ACTIVATE - Limpar caches antigos
self.addEventListener('activate', (event) => {
  console.log('✅ Service Worker ativado');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('🗑️ Removendo cache antigo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// FETCH - Network first, cache como fallback
self.addEventListener('fetch', (event) => {
  // Ignorar requisições de API
  if (event.request.url.includes('/api/')) {
    return;
  }
  
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Se conseguiu da rede, retorna direto
        return response;
      })
      .catch(() => {
        // Se falhou (offline), tenta do cache
        return caches.match(event.request);
      })
  );
});

// PUSH - Receber notificações push
self.addEventListener('push', (event) => {
  console.log('📬 Push recebido');
  
  let data = {
    title: 'Maria tem uma palavra para você',
    body: 'Venha conversar com Nossa Senhora',
    icon: '/icons/icon-192.png'
  };
  
  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      data.body = event.data.text();
    }
  }
  
  const options = {
    body: data.body,
    icon: data.icon || '/icons/icon-192.png',
    badge: '/icons/icon-72.png',
    vibrate: [100, 50, 100],
    data: { url: data.url || '/' }
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// NOTIFICATION CLICK
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        if (clientList.length > 0) {
          return clientList[0].focus();
        }
        return clients.openWindow(event.notification.data.url || '/');
      })
  );
});
