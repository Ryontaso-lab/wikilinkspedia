const CACHE_NAME = 'wiki-pwa-v3';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // 共有パラメータ（?url= や ?text= など）が付いている場合はキャッシュを見ず直接ネットワークへ通す
  if (url.searchParams.has('url') || url.searchParams.has('text') || url.searchParams.has('title')) {
    event.respondWith(fetch(event.request));
    return;
  }

  // 通常アクセスはネットワーク優先、フォールバックでキャッシュ
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
