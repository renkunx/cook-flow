/**
 * PWA 图标生成脚本
 * 使用 Node.js 和 Sharp 库生成各种尺寸的 PWA 图标
 * 
 * 使用方法:
 * 1. npm install sharp
 * 2. node scripts/generate-pwa-icons.js
 */

const fs = require('fs');
const path = require('path');

// 检查是否有 sharp
let sharp;
try {
  sharp = require('sharp');
} catch (e) {
  console.log('请安装 sharp: npm install --save-dev sharp');
  process.exit(1);
}

// 图标尺寸配置
const ICONS = [
  { size: 16, name: 'icon-16x16.png' },
  { size: 32, name: 'icon-32x32.png' },
  { size: 72, name: 'icon-72x72.png' },
  { size: 96, name: 'icon-96x96.png' },
  { size: 128, name: 'icon-128x128.png' },
  { size: 144, name: 'icon-144x144.png' },
  { size: 152, name: 'icon-152x152.png' },
  { size: 180, name: 'icon-180x180.png' },
  { size: 192, name: 'icon-192x192.png' },
  { size: 384, name: 'icon-384x384.png' },
  { size: 512, name: 'icon-512x512.png' },
];

// iOS 启动屏尺寸
const SPLASH_SCREENS = [
  { width: 640, height: 1136, name: 'splash-640x1136.png' },    // iPhone SE
  { width: 750, height: 1334, name: 'splash-750x1334.png' },    // iPhone 8
  { width: 828, height: 1792, name: 'splash-828x1792.png' },    // iPhone XR
  { width: 1125, height: 2436, name: 'splash-1125x2436.png' },  // iPhone X/XS
  { width: 1242, height: 2688, name: 'splash-1242x2688.png' },  // iPhone XS Max
  { width: 1536, height: 2048, name: 'splash-1536x2048.png' },  // iPad
  { width: 1668, height: 2224, name: 'splash-1668x2224.png' },  // iPad Pro 10.5
  { width: 1668, height: 2388, name: 'splash-1668x2388.png' },  // iPad Pro 11
  { width: 2048, height: 2732, name: 'splash-2048x2732.png' },  // iPad Pro 12.9
];

// 颜色配置
const THEME_COLOR = '#FF6B35';
const BACKGROUND_COLOR = '#FF6B35';

/**
 * 创建 SVG 图标
 */
function createSVG(size) {
  const iconSize = size * 0.6;
  const fontSize = size * 0.5;

  return `
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#FF6B35;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#F7931E;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" fill="url(#grad)" rx="${size * 0.2}"/>
  <text x="50%" y="55%" dominant-baseline="middle" text-anchor="middle" 
        font-size="${fontSize}" fill="white" font-family="Arial, sans-serif" font-weight="bold">
    厨
  </text>
</svg>
  `.trim();
}

/**
 * 创建启动屏 SVG
 */
function createSplashSVG(width, height) {
  const iconSize = Math.min(width, height) * 0.2;

  return `
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#FF6B35;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#F7931E;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="${width}" height="${height}" fill="url(#bg)"/>
  <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" 
        font-size="${iconSize}" fill="white" font-family="Arial, sans-serif" font-weight="bold">
    下厨有谱
  </text>
  <text x="50%" y="${height * 0.6}" dominant-baseline="middle" text-anchor="middle" 
        font-size="${iconSize * 0.3}" fill="white" font-family="Arial, sans-serif" opacity="0.8">
    智能菜谱推荐
  </text>
</svg>
  `.trim();
}

/**
 * 生成图标
 */
async function generateIcons() {
  const iconsDir = path.join(__dirname, '../public/icons');

  // 确保目录存在
  if (!fs.existsSync(iconsDir)) {
    fs.mkdirSync(iconsDir, { recursive: true });
  }

  console.log('生成 PWA 图标...');

  for (const icon of ICONS) {
    const svg = createSVG(icon.size);
    const outputPath = path.join(iconsDir, icon.name);

    await sharp(Buffer.from(svg))
      .png()
      .toFile(outputPath);

    console.log(`✓ ${icon.name} (${icon.size}x${icon.size})`);
  }

  // 生成 favicon.ico（使用 32x32）
  const faviconSvg = createSVG(32);
  await sharp(Buffer.from(faviconSvg))
    .resize(32, 32)
    .toFile(path.join(__dirname, '../public/favicon.ico'));
  console.log('✓ favicon.ico');

  console.log('\n图标生成完成！');
}

/**
 * 生成启动屏
 */
async function generateSplashScreens() {
  const splashDir = path.join(__dirname, '../public/splash');

  if (!fs.existsSync(splashDir)) {
    fs.mkdirSync(splashDir, { recursive: true });
  }

  console.log('\n生成 iOS 启动屏...');

  for (const splash of SPLASH_SCREENS) {
    const svg = createSplashSVG(splash.width, splash.height);
    const outputPath = path.join(splashDir, splash.name);

    await sharp(Buffer.from(svg))
      .png()
      .toFile(outputPath);

    console.log(`✓ ${splash.name} (${splash.width}x${splash.height})`);
  }

  console.log('\n启动屏生成完成！');
}

/**
 * 主函数
 */
async function main() {
  try {
    console.log('========================================');
    console.log('  下厨有谱 PWA 资源生成器');
    console.log('========================================\n');

    await generateIcons();
    await generateSplashScreens();

    console.log('\n========================================');
    console.log('  所有资源生成完成！');
    console.log('========================================');
    console.log('\n提示:');
    console.log('- 图标已保存到 public/icons/');
    console.log('- 启动屏已保存到 public/splash/');
    console.log('- favicon.ico 已保存到 public/');
    console.log('\n您可以使用自定义 SVG 替换生成的图标。');

  } catch (error) {
    console.error('生成失败:', error);
    process.exit(1);
  }
}

main();
