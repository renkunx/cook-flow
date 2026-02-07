/**
 * PWA 安装提示组件
 * 检测浏览器是否支持安装，并显示安装提示
 */

import { useState, useEffect, useCallback } from 'react';
import { Download, X, Smartphone, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // 检查是否已安装
    if (window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as any).standalone === true) {
      setIsInstalled(true);
      return;
    }

    // 检测 iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(isIOSDevice);

    // 检查是否已经拒绝过安装（7天内不再提示）
    const lastDismissed = localStorage.getItem('pwa-install-dismissed');
    if (lastDismissed) {
      const daysSince = (Date.now() - parseInt(lastDismissed)) / (1000 * 60 * 60 * 24);
      if (daysSince < 7) return;
    }

    // 监听 beforeinstallprompt 事件
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // iOS 没有 beforeinstallprompt 事件，直接显示提示
    if (isIOSDevice) {
      const hasShownIOSPrompt = localStorage.getItem('pwa-ios-prompt-shown');
      if (!hasShownIOSPrompt) {
        setTimeout(() => setShowPrompt(true), 3000);
      }
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = useCallback(async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('用户接受了安装');
      setIsInstalled(true);
    }
    
    setDeferredPrompt(null);
    setShowPrompt(false);
  }, [deferredPrompt]);

  const handleDismiss = useCallback(() => {
    setShowPrompt(false);
    localStorage.setItem('pwa-install-dismissed', Date.now().toString());
    
    if (isIOS) {
      localStorage.setItem('pwa-ios-prompt-shown', 'true');
    }
  }, [isIOS]);

  if (!showPrompt || isInstalled) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50 animate-in slide-in-from-bottom duration-300">
      <div className="bg-white rounded-2xl shadow-lg border border-[var(--warm-beige)] p-4">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--tomato-red)] to-[var(--warm-orange)] flex items-center justify-center flex-shrink-0">
            <Download className="w-6 h-6 text-white" />
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-[var(--text-brown)] text-lg">
              安装下厨有谱
            </h3>
            <p className="text-sm text-[var(--text-brown-light)] mt-1">
              {isIOS ? (
                <>
                  点击 <Share2 className="inline w-4 h-4 mx-1" /> 分享按钮，
                  然后选择"添加到主屏幕"
                </>
              ) : (
                '添加到主屏幕，快速访问，离线使用'
              )}
            </p>
            
            {isIOS && (
              <div className="mt-3 flex items-center gap-2 text-sm text-[var(--text-brown-light)] bg-[var(--warm-cream)] p-2 rounded-lg">
                <Share2 className="w-5 h-5 text-[var(--tomato-red)]" />
                <span>→</span>
                <span className="flex items-center gap-1">
                  <span className="font-medium">添加到主屏幕</span>
                </span>
              </div>
            )}
          </div>
          
          <button 
            onClick={handleDismiss}
            className="p-1 hover:bg-[var(--warm-cream)] rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-[var(--text-brown-light)]" />
          </button>
        </div>
        
        {!isIOS && (
          <div className="flex gap-2 mt-4">
            <Button
              variant="outline"
              className="flex-1 border-[var(--warm-beige)]"
              onClick={handleDismiss}
            >
              暂不
            </Button>
            <Button
              className="flex-1 bg-gradient-to-r from-[var(--tomato-red)] to-[var(--warm-orange)] text-white"
              onClick={handleInstall}
            >
              <Smartphone className="w-4 h-4 mr-2" />
              安装
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default InstallPrompt;
