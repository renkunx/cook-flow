/**
 * Service Worker
 * 提供离线缓存、推送通知等功能
 */

const CACHE_NAME = 'cook-flow-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
];

// 安装时缓存静态资源
self.addEventListener('install', (event) => {
  console.log('[SW] Installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        return self.skipWaiting();
      })
      .catch((err) => {
        console.error('[SW] Cache failed:', err);
      })
  );
});

// 激活时清理旧缓存
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((name) => name !== CACHE_NAME)
            .map((name) => {
              console.log('[SW] Deleting old cache:', name);
              return caches.delete(name);
            })
        );
      })
      .then(() => {
        return self.clients.claim();
      })
  );
});

// 拦截网络请求
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // 跳过非 GET 请求
  if (request.method !== 'GET') {
    return;
  }

  // 跳过 API 请求（除了 GET）
  if (url.pathname.startsWith('/api/')) {
    return;
  }

  // 跳过 chrome 扩展
  if (url.protocol === 'chrome-extension:') {
    return;
  }

  event.respondWith(
    caches.match(request)
      .then((cached) => {
        // 返回缓存或网络请求
        const fetchPromise = fetch(request)
          .then((networkResponse) => {
            // 缓存新响应
            if (networkResponse.ok) {
              const clone = networkResponse.clone();
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(request, clone);
              });
            }
            return networkResponse;
          })
          .catch((err) => {
            console.log('[SW] Fetch failed:', err);
            // 网络失败时返回缓存
            return cached;
          });

        // 优先返回缓存，同时更新缓存
        return cached || fetchPromise;
      })
  );
});

// 处理消息
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// 后台同步
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-shopping-list') {
    event.waitUntil(syncShoppingList());
  }
});

// 推送通知
self.addEventListener('push', (event) => {
  const data = event.data.json();
  
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: '/icons/icon-192x192.png',
      badge: '/icons/icon-72x72.png',
      tag: data.tag,
      data: data.data,
      actions: data.actions || [],
    })
  );
});

// 点击通知
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  const { notification } = event;
  const { data } = notification;

  event.waitUntil(
    clients.matchAll({ type: 'window' })
      .then((clientList) => {
        // 如果已有窗口，聚焦它
        for (const client of clientList) {
          if (client.url === '/' && 'focus' in client) {
            return client.focus();
          }
        }
        // 否则打开新窗口
        if (clients.openWindow) {
          return clients.openWindow(data?.url || '/');
        }
      })
  );
});

// 同步购物清单
async function syncShoppingList() {
  try {
    const cache = await caches.open(CACHE_NAME);
    const requests = await cache.keys();
    
    for (const request of requests) {
      if (request.url.includes('/api/shopping-list')) {
        // 尝试重新发送请求
        try {
          const response = await fetch(request);
          if (response.ok) {
            await cache.delete(request);
          }
        } catch (err) {
          console.log('[SW] Sync failed for:', request.url);
        }
      }
    }
  } catch (err) {
    console.error('[SW] Sync error:', err);
  }
}
