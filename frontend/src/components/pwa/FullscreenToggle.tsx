/**
 * 全屏切换组件
 * 控制应用进入/退出全屏模式
 */

import { useState, useEffect, useCallback } from 'react';
import { Maximize2, Minimize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FullscreenToggleProps {
  variant?: 'default' | 'ghost' | 'outline';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
}

export function FullscreenToggle({ 
  variant = 'ghost', 
  size = 'icon',
  className 
}: FullscreenToggleProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    // 检查是否支持全屏
    setIsSupported(
      !!(document.fullscreenEnabled || 
         (document as any).webkitFullscreenEnabled ||
         (document as any).mozFullScreenEnabled ||
         (document as any).msFullscreenEnabled)
    );

    // 监听全屏变化
    const handleFullscreenChange = () => {
      setIsFullscreen(
        !!(document.fullscreenElement || 
           (document as any).webkitFullscreenElement ||
           (document as any).mozFullScreenElement ||
           (document as any).msFullscreenElement)
      );
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (!isFullscreen) {
      // 进入全屏
      const elem = document.documentElement;
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if ((elem as any).webkitRequestFullscreen) {
        (elem as any).webkitRequestFullscreen();
      } else if ((elem as any).mozRequestFullScreen) {
        (elem as any).mozRequestFullScreen();
      } else if ((elem as any).msRequestFullscreen) {
        (elem as any).msRequestFullscreen();
      }
    } else {
      // 退出全屏
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if ((document as any).webkitExitFullscreen) {
        (document as any).webkitExitFullscreen();
      } else if ((document as any).mozCancelFullScreen) {
        (document as any).mozCancelFullScreen();
      } else if ((document as any).msExitFullscreen) {
        (document as any).msExitFullscreen();
      }
    }
  }, [isFullscreen]);

  if (!isSupported) return null;

  return (
    <Button
      variant={variant}
      size={size}
      onClick={toggleFullscreen}
      className={className}
      title={isFullscreen ? '退出全屏' : '全屏'}
    >
      {isFullscreen ? (
        <Minimize2 className="w-5 h-5" />
      ) : (
        <Maximize2 className="w-5 h-5" />
      )}
    </Button>
  );
}

/**
 * 全屏容器组件
 * 双击进入全屏
 */
interface FullscreenContainerProps {
  children: React.ReactNode;
  className?: string;
  enabled?: boolean;
}

export function FullscreenContainer({ 
  children, 
  className,
  enabled = true 
}: FullscreenContainerProps) {
  const handleDoubleClick = useCallback(() => {
    if (!enabled) return;
    
    const elem = document.documentElement;
    if (!document.fullscreenElement) {
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if ((elem as any).webkitRequestFullscreen) {
        (elem as any).webkitRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  }, [enabled]);

  return (
    <div 
      className={className}
      onDoubleClick={handleDoubleClick}
    >
      {children}
    </div>
  );
}

export default FullscreenToggle;
