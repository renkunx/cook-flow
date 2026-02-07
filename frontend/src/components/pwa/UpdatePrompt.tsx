/**
 * PWA 更新提示组件
 * 当有新版本时提示用户更新
 */

import { useState, useEffect } from 'react';
import { RefreshCw, X, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { checkSWUpdate, skipWaiting } from './registerSW';

export function UpdatePrompt() {
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // 监听 Service Worker 更新
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        // 新 Service Worker 已激活，刷新页面
        window.location.reload();
      });

      // 定期检查更新
      const checkInterval = setInterval(() => {
        checkSWUpdate();
      }, 60 * 60 * 1000); // 每小时检查一次

      // 页面可见性变化时检查
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
          checkSWUpdate();
        }
      });

      return () => clearInterval(checkInterval);
    }
  }, []);

  // 监听来自 Service Worker 的消息
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'SW_UPDATE_AVAILABLE') {
        setShowPrompt(true);
      }
    };

    navigator.serviceWorker?.addEventListener('message', handleMessage);
    return () => {
      navigator.serviceWorker?.removeEventListener('message', handleMessage);
    };
  }, []);

  const handleUpdate = async () => {
    await skipWaiting();
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed top-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50 animate-in slide-in-from-top">
      <div className="bg-white rounded-2xl shadow-lg border border-[var(--warm-beige)] p-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
            <Download className="w-5 h-5 text-blue-600" />
          </div>
          
          <div className="flex-1">
            <h3 className="font-bold text-[var(--text-brown)]">
              发现新版本
            </h3>
            <p className="text-sm text-[var(--text-brown-light)] mt-1">
              新版本已准备好，点击更新获取最新功能和修复。
            </p>
          </div>
          
          <button 
            onClick={handleDismiss}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>
        
        <div className="flex gap-2 mt-4">
          <Button
            variant="outline"
            className="flex-1"
            onClick={handleDismiss}
          >
            稍后
          </Button>
          <Button
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white"
            onClick={handleUpdate}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            立即更新
          </Button>
        </div>
      </div>
    </div>
  );
}

export default UpdatePrompt;
