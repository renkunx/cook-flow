/**
 * 网络状态检测组件
 * 显示离线/在线状态，提供离线提示
 */

import { useState, useEffect } from 'react';
import { Wifi, WifiOff, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function NetworkStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showOfflineAlert, setShowOfflineAlert] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowOfflineAlert(false);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowOfflineAlert(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // 初始状态
    setShowOfflineAlert(!navigator.onLine);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <>
      {/* 离线提示条 */}
      {showOfflineAlert && (
        <div className="fixed top-0 left-0 right-0 z-[100] bg-[var(--tomato-red)] text-white px-4 py-2 animate-in slide-in-from-top">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <WifiOff className="w-5 h-5" />
              <span className="font-medium">网络已断开，部分功能可能无法使用</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRetry}
              className="text-white hover:bg-white/20"
            >
              <RefreshCw className="w-4 h-4 mr-1" />
              重试
            </Button>
          </div>
        </div>
      )}

      {/* 在线状态指示器（可选） */}
      {!isOnline && (
        <div className="fixed bottom-4 right-4 z-50 w-3 h-3 rounded-full bg-red-500 animate-pulse" 
             title="离线" />
      )}
    </>
  );
}

/**
 * 网络状态 Hook
 */
export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [connectionType, setConnectionType] = useState<string>('unknown');

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // 获取连接类型（如果支持）
    const connection = (navigator as any).connection;
    if (connection) {
      setConnectionType(connection.effectiveType || 'unknown');
      connection.addEventListener('change', () => {
        setConnectionType(connection.effectiveType);
      });
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return { isOnline, connectionType };
}

export default NetworkStatus;
