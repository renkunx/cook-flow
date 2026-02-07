/**
 * Service Worker 注册
 * 提供离线缓存、后台同步等功能
 */

export interface SWRegistrationOptions {
  onUpdate?: (registration: ServiceWorkerRegistration) => void;
  onSuccess?: (registration: ServiceWorkerRegistration) => void;
  onOfflineReady?: () => void;
}

export function registerSW(options: SWRegistrationOptions = {}) {
  const { onUpdate, onSuccess, onOfflineReady } = options;

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      const swUrl = '/service-worker.js';

      navigator.serviceWorker
        .register(swUrl)
        .then((registration) => {
          console.log('SW registered:', registration);

          registration.onupdatefound = () => {
            const installingWorker = registration.installing;
            if (installingWorker == null) {
              return;
            }

            installingWorker.onstatechange = () => {
              if (installingWorker.state === 'installed') {
                if (navigator.serviceWorker.controller) {
                  // 新版本可用
                  console.log('New content is available');
                  onUpdate?.(registration);
                } else {
                  // 首次缓存完成
                  console.log('Content is cached for offline use');
                  onOfflineReady?.();
                  onSuccess?.(registration);
                }
              }
            };
          };
        })
        .catch((error) => {
          console.error('SW registration failed:', error);
        });
    });
  }
}

export function unregisterSW() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then((registration) => {
        registration.unregister();
      })
      .catch((error) => {
        console.error(error.message);
      });
  }
}

/**
 * 检查 Service Worker 更新
 */
export async function checkSWUpdate() {
  if ('serviceWorker' in navigator) {
    const registration = await navigator.serviceWorker.ready;
    await registration.update();
  }
}

/**
 * 跳过等待，立即激活新版本
 */
export async function skipWaiting() {
  if ('serviceWorker' in navigator) {
    const registration = await navigator.serviceWorker.ready;
    registration.waiting?.postMessage({ type: 'SKIP_WAITING' });
  }
}

export default { registerSW, unregisterSW, checkSWUpdate, skipWaiting };
