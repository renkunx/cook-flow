# PWA (Progressive Web App) 配置指南

## 功能概述

本项目已配置完整的 PWA 功能，包括：

- ✅ **Favicon & Icons** - 多尺寸应用图标
- ✅ **Manifest** - PWA 清单文件
- ✅ **Service Worker** - 离线缓存支持
- ✅ **iOS 支持** - Apple 设备专用配置
- ✅ **全屏模式** - 沉浸式体验
- ✅ **安装提示** - 添加到主屏幕引导
- ✅ **密码输入** - 带强度检测的密码框
- ✅ **图标选择器** - Space/用户图标设置

## 文件结构

```
frontend/
├── public/
│   ├── manifest.json          # PWA 清单
│   ├── favicon.ico            # 网站图标
│   ├── service-worker.js      # Service Worker
│   ├── icon.svg               # 源图标
│   ├── icons/                 # 多尺寸图标
│   │   ├── icon-16x16.png
│   │   ├── icon-32x32.png
│   │   ├── icon-192x192.png
│   │   └── icon-512x512.png
│   └── splash/                # iOS 启动屏
│       ├── splash-640x1136.png
│       └── ...
├── src/
│   ├── components/
│   │   ├── pwa/               # PWA 组件
│   │   │   ├── InstallPrompt.tsx    # 安装提示
│   │   │   ├── FullscreenToggle.tsx # 全屏切换
│   │   │   ├── NetworkStatus.tsx    # 网络状态
│   │   │   ├── UpdatePrompt.tsx     # 更新提示
│   │   │   └── registerSW.ts        # SW 注册
│   │   └── ui/
│   │       ├── password-input.tsx   # 密码输入框
│   │       └── icon-picker.tsx      # 图标选择器
│   └── pages/
│       └── PWASettings.tsx    # 设置页面示例
└── scripts/
    └── generate-pwa-icons.js  # 图标生成脚本
```

## 快速开始

### 1. 生成图标

```bash
cd frontend
npm install --save-dev sharp
node scripts/generate-pwa-icons.js
```

或使用自定义图标：
- 替换 `public/icon.svg` 为你的 SVG 图标
- 运行脚本生成各种尺寸

### 2. 在应用中使用

```tsx
import { InstallPrompt, FullscreenToggle, NetworkStatus } from '@/components/pwa';
import { PasswordInput } from '@/components/ui/password-input';
import { IconPicker } from '@/components/ui/icon-picker';

function App() {
  return (
    <>
      {/* 网络状态提示 */}
      <NetworkStatus />
      
      {/* PWA 安装提示 */}
      <InstallPrompt />
      
      {/* 你的应用内容 */}
      <main>
        {/* 密码输入框 */}
        <PasswordInput 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          showStrength
        />
        
        {/* 图标选择器 */}
        <IconPicker
          value={selectedIcon}
          onChange={(icon, color) => setSelectedIcon(icon)}
        />
        
        {/* 全屏切换 */}
        <FullscreenToggle />
      </main>
    </>
  );
}
```

## 组件说明

### InstallPrompt
自动检测浏览器是否支持 PWA 安装，并显示安装提示。

- 支持 Chrome/Android 的原生安装
- 支持 iOS 的"添加到主屏幕"引导
- 7天内不再重复提示

```tsx
<InstallPrompt />
```

### FullscreenToggle
全屏模式切换按钮。

```tsx
<FullscreenToggle variant="outline" size="sm" />
```

### NetworkStatus
网络状态检测和提示。

```tsx
<NetworkStatus />

// 或使用 Hook
const { isOnline } = useNetworkStatus();
```

### PasswordInput
带显示/隐藏切换和密码强度检测的输入框。

```tsx
<PasswordInput
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  showStrength      // 显示密码强度
  leftIcon={<Lock />}  // 自定义左侧图标
/>

// 确认密码组
<ConfirmPasswordInput
  password={password}
  confirmPassword={confirmPassword}
  onPasswordChange={setPassword}
  onConfirmChange={setConfirmPassword}
/>
```

### IconPicker
图标选择器，支持预设图标和图片上传。

```tsx
<IconPicker
  value={selectedIcon}
  color={themeColor}
  onChange={(icon, color) => {
    setSelectedIcon(icon);
    setThemeColor(color);
  }}
  allowUpload      // 允许上传图片
  size="lg"        // sm | md | lg
/>
```

## Manifest 配置

`public/manifest.json`:

```json
{
  "name": "下厨有谱",
  "short_name": "下厨有谱",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#FF6B35",
  "theme_color": "#FF6B35",
  "icons": [
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192"
    }
  ]
}
```

## Service Worker

`public/service-worker.js` 提供：

- 静态资源缓存
- 离线访问支持
- 后台同步
- 推送通知（预留）

## iOS 特有配置

`index.html` 包含：

```html
<!-- Apple Touch Icons -->
<link rel="apple-touch-icon" sizes="180x180" href="/icons/icon-180x180.png" />

<!-- 状态栏样式 -->
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="default" />

<!-- 启动屏 -->
<link rel="apple-touch-startup-image" href="/splash/splash-750x1334.png" ... />
```

## 添加到主屏幕

### Android/Chrome
1. 点击安装提示按钮
2. 或在菜单中选择"添加到主屏幕"

### iOS Safari
1. 点击底部分享按钮
2. 选择"添加到主屏幕"

### 桌面 Chrome/Edge
1. 地址栏右侧点击安装图标
2. 或在菜单中选择"安装下厨有谱"

## 主题色配置

默认主题色：`#FF6B35`（暖橙色）

修改位置：
1. `public/manifest.json` - `theme_color` 和 `background_color`
2. `index.html` - `theme-color` meta 标签
3. `tailwind.config.js` - 自定义颜色

## 离线支持

Service Worker 自动缓存：
- 静态资源（JS/CSS/图片）
- API 响应（可选）
- 页面路由

离线时显示：
- 已缓存的页面
- 离线提示条

## 调试技巧

### Chrome DevTools
1. 打开 DevTools → Application 面板
2. 查看 Manifest 配置
3. 测试 Service Worker
4. 模拟离线状态

### Lighthouse 测试
```bash
# 运行 Lighthouse PWA 测试
npx lighthouse http://localhost:5173 --preset=desktop
```

### 验证清单
- [ ] manifest.json 可访问
- [ ] Service Worker 已注册
- [ ] 所有图标可加载
- [ ] 主题色正确显示
- [ ] 离线功能正常
- [ ] iOS 启动屏正常

## 浏览器兼容性

| 功能           | Chrome | Safari  | Firefox | Edge |
| -------------- | ------ | ------- | ------- | ---- |
| PWA 安装       | ✅      | ⚠️ (iOS) | ❌       | ✅    |
| Service Worker | ✅      | ✅       | ✅       | ✅    |
| 推送通知       | ✅      | ⚠️       | ❌       | ✅    |
| 后台同步       | ✅      | ❌       | ❌       | ✅    |

## 注意事项

1. **HTTPS**: PWA 功能需要 HTTPS（localhost 除外）
2. **缓存策略**: 生产环境建议配置合适的缓存策略
3. **更新机制**: Service Worker 更新后需要刷新页面
4. **存储限制**: 注意缓存存储配额限制

## 参考链接

- [MDN PWA 指南](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
- [Google PWA 文档](https://web.dev/progressive-web-apps/)
- [Apple PWA 指南](https://developer.apple.com/library/archive/documentation/AppleApplications/Reference/SafariWebContent/ConfiguringWebApplications/ConfiguringWebApplications.html)
