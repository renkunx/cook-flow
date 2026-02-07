/**
 * PWA 设置页面示例
 * 展示 PWA 功能和设置选项
 */

import { useState, useEffect } from 'react';
import { 
  Smartphone, 
  Maximize2, 
  Wifi, 
  Download,
  Bell,
  Share2,
  Info
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { 
  InstallPrompt, 
  FullscreenToggle, 
  NetworkStatus,
  UpdatePrompt,
  useNetworkStatus 
} from '@/components/pwa';
import { PasswordInput, ConfirmPasswordInput } from '@/components/ui/password-input';
import { IconPicker, SpaceLogoSetting } from '@/components/ui/icon-picker';

export function PWASettings() {
  const { isOnline } = useNetworkStatus();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('ChefHat');
  const [selectedColor, setSelectedColor] = useState('#FF6B35');
  const [notifications, setNotifications] = useState(false);
  const [offlineMode, setOfflineMode] = useState(true);

  // 请求通知权限
  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) {
      alert('您的浏览器不支持通知功能');
      return;
    }

    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      setNotifications(true);
      // 发送测试通知
      new Notification('下厨有谱', {
        body: '通知功能已开启！',
        icon: '/icons/icon-192x192.png',
      });
    } else {
      setNotifications(false);
    }
  };

  // 分享应用
  const shareApp = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: '下厨有谱',
          text: '发现一个很棒的菜谱应用，根据冰箱食材推荐食谱！',
          url: window.location.origin,
        });
      } catch (err) {
        console.log('分享取消');
      }
    } else {
      // 复制链接到剪贴板
      navigator.clipboard.writeText(window.location.origin);
      alert('链接已复制到剪贴板');
    }
  };

  return (
    <div className="min-h-screen bg-[var(--warm-cream)]">
      {/* 网络状态提示 */}
      <NetworkStatus />
      
      {/* 更新提示 */}
      <UpdatePrompt />
      
      {/* 安装提示 */}
      <InstallPrompt />

      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* 页面标题 */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[var(--text-brown)]">
            应用设置
          </h1>
          <p className="text-[var(--text-brown-light)]">
            管理 PWA 功能、图标和密码设置
          </p>
        </div>

        <div className="space-y-6">
          {/* 图标设置 */}
          <section className="bg-white rounded-2xl p-6 shadow-warm">
            <h2 className="text-lg font-bold text-[var(--text-brown)] mb-4 flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-[var(--tomato-red)]" />
              应用图标
            </h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-[var(--text-brown)] mb-2">
                  选择应用图标
                </label>
                <IconPicker
                  value={selectedIcon}
                  color={selectedColor}
                  onChange={(icon, color) => {
                    setSelectedIcon(icon);
                    if (color) setSelectedColor(color);
                  }}
                  size="lg"
                  showColorPicker
                />
              </div>

              <div className="border-t border-[var(--warm-beige)] pt-4">
                <SpaceLogoSetting spaceId={1} />
              </div>
            </div>
          </section>

          {/* 显示设置 */}
          <section className="bg-white rounded-2xl p-6 shadow-warm">
            <h2 className="text-lg font-bold text-[var(--text-brown)] mb-4 flex items-center gap-2">
              <Maximize2 className="w-5 h-5 text-[var(--tomato-red)]" />
              显示设置
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-[var(--text-brown)]">全屏模式</p>
                  <p className="text-sm text-[var(--text-brown-light)]">
                    隐藏浏览器地址栏，获得沉浸式体验
                  </p>
                </div>
                <FullscreenToggle variant="outline" />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-[var(--text-brown)]">离线模式</p>
                  <p className="text-sm text-[var(--text-brown-light)]">
                    允许在无网络时使用已缓存的内容
                  </p>
                </div>
                <Switch
                  checked={offlineMode}
                  onCheckedChange={setOfflineMode}
                />
              </div>
            </div>
          </section>

          {/* 通知设置 */}
          <section className="bg-white rounded-2xl p-6 shadow-warm">
            <h2 className="text-lg font-bold text-[var(--text-brown)] mb-4 flex items-center gap-2">
              <Bell className="w-5 h-5 text-[var(--tomato-red)]" />
              通知设置
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-[var(--text-brown)]">推送通知</p>
                  <p className="text-sm text-[var(--text-brown-light)]">
                    接收食谱推荐和烹饪提醒
                  </p>
                </div>
                <Switch
                  checked={notifications}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      requestNotificationPermission();
                    } else {
                      setNotifications(false);
                    }
                  }}
                />
              </div>
            </div>
          </section>

          {/* 密码设置 */}
          <section className="bg-white rounded-2xl p-6 shadow-warm">
            <h2 className="text-lg font-bold text-[var(--text-brown)] mb-4 flex items-center gap-2">
              <Info className="w-5 h-5 text-[var(--tomato-red)]" />
              密码设置
            </h2>
            
            <div className="space-y-4">
              <ConfirmPasswordInput
                password={password}
                confirmPassword={confirmPassword}
                onPasswordChange={setPassword}
                onConfirmChange={setConfirmPassword}
                showStrength
              />
            </div>
          </section>

          {/* 网络状态 */}
          <section className="bg-white rounded-2xl p-6 shadow-warm">
            <h2 className="text-lg font-bold text-[var(--text-brown)] mb-4 flex items-center gap-2">
              <Wifi className="w-5 h-5 text-[var(--tomato-red)]" />
              网络状态
            </h2>
            
            <div className="flex items-center gap-3 p-4 bg-[var(--warm-cream)] rounded-xl">
              <div className={cn(
                'w-3 h-3 rounded-full',
                isOnline ? 'bg-green-500' : 'bg-red-500'
              )} />
              <span className="text-[var(--text-brown)]">
                {isOnline ? '已连接到网络' : '网络已断开'}
              </span>
            </div>
          </section>

          {/* 关于 */}
          <section className="bg-white rounded-2xl p-6 shadow-warm">
            <h2 className="text-lg font-bold text-[var(--text-brown)] mb-4">
              关于
            </h2>
            
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-[var(--text-brown-light)]">版本</span>
                <span className="text-[var(--text-brown)]">1.0.0</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[var(--text-brown-light)]">PWA 状态</span>
                <span className="text-[var(--text-brown)]">
                  {window.matchMedia('(display-mode: standalone)').matches 
                    ? '已安装' 
                    : '浏览器运行'}
                </span>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button
                variant="outline"
                className="flex-1"
                onClick={shareApp}
              >
                <Share2 className="w-4 h-4 mr-2" />
                分享应用
              </Button>
              
              {!window.matchMedia('(display-mode: standalone)').matches && (
                <Button
                  className="flex-1 bg-gradient-to-r from-[var(--tomato-red)] to-[var(--warm-orange)] text-white"
                  onClick={() => {
                    // 触发安装提示
                    window.dispatchEvent(new Event('beforeinstallprompt'));
                  }}
                >
                  <Download className="w-4 h-4 mr-2" />
                  安装应用
                </Button>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

// 导入 cn 工具
import { cn } from '@/lib/utils';

export default PWASettings;
