# 菜谱公众号图文模板使用指南

## 📄 模板文件

`recipe-template.html` - 完整的单文件 HTML 模板，包含内联 CSS，可直接使用

## ✨ 模板特点

- 📱 **移动端优先** - 完美适配微信公众号阅读
- 🎨 **精美设计** - 暖橙色调，圆角卡片，渐变背景
- 🖼️ **图文混排** - 支持首图、步骤图、小贴士
- 📊 **营养展示** - 热量、卡路里、脂肪数据可视化
- 🥬 **材料清单** - Emoji 图标 + 网格布局
- 📋 **步骤展示** - 数字标识 + 提示信息

## 📝 使用方法

### 1. 基础使用

直接用浏览器打开 `recipe-template.html`，复制内容到微信公众号编辑器

### 2. 修改菜谱内容

编辑 HTML 中的以下内容区域：

#### 首图和标题
```html
<div class="hero-section">
  <img src="你的图片链接" alt="菜名" class="hero-image">
  <div class="hero-overlay">
    <h1 class="recipe-title">你的菜名</h1>
    <p class="recipe-subtitle">副标题描述</p>
  </div>
</div>
```

#### 营养价值
```html
<div class="nutrition-grid">
  <div class="nutrition-item">
    <div class="nutrition-value">128</div>
    <div class="nutrition-unit">kcal</div>
    <div class="nutrition-label">热量</div>
  </div>
  <!-- 修改数值即可 -->
</div>
```

#### 操作时长和难度
```html
<div class="info-tags">
  <div class="info-tag">
    <div class="info-value">15分钟</div>  <!-- 修改时长 -->
  </div>
  <div class="info-tag">
    <div class="info-value difficulty-easy">简单</div>  <!-- easy/medium/hard -->
  </div>
</div>
```

#### 所需材料
```html
<div class="ingredient-item">
  <div class="ingredient-icon">🍅</div>  <!-- 修改 Emoji -->
  <div class="ingredient-info">
    <div class="ingredient-name">西红柿</div>  <!-- 材料名 -->
    <div class="ingredient-amount">2个</div>   <!-- 用量 -->
  </div>
</div>
```

#### 操作步骤
```html
<div class="step-item">
  <div class="step-number">1</div>
  <div class="step-content">
    <p class="step-text">步骤描述文字</p>
    <div class="step-tip">💡 小贴士内容</div>
    <img src="步骤图片链接" alt="" class="step-image">
  </div>
</div>
```

### 3. 图片规格建议

| 用途 | 尺寸 | 格式 |
|------|------|------|
| 首图 | 800x500 | JPG/PNG |
| 步骤图 | 600x375 | JPG/PNG |
| 文件大小 | <2MB | - |

## 🎨 自定义样式

### 修改主题色

在 CSS 中搜索 `#FF6B35` 替换为你想要的颜色

### 难度等级颜色
```css
.difficulty-easy { color: #52C41A; }    /* 简单 - 绿色 */
.difficulty-medium { color: #FAAD14; } /* 中等 - 黄色 */
.difficulty-hard { color: #FF4D4F; }   /* 困难 - 红色 */
```

## 🚀 进阶使用

### 批量生成

如果你有多个菜谱，可以使用模板引擎批量生成：

```javascript
// 示例：使用数据填充模板
const recipes = [
  {
    title: '西红柿炒蛋',
    image: 'xxx.jpg',
    calories: 128,
    time: '15分钟',
    difficulty: 'easy',
    ingredients: [...],
    steps: [...]
  },
  // ...
];
```

### 嵌入小程序

可以添加跳转到小程序的按钮：
```html
<a href="weixin://dl/business/?t= *YOUR_APPID*" class="mini-program-btn">
  打开小程序查看完整做法
</a>
```

## 📋 Emoji 参考

常用食材 Emoji：
- 🍅 西红柿 - 🥚 鸡蛋 - 🥩 肉类 - 🐟 鱼类
- 🥬 蔬菜 - 🥕 胡萝卜 - 🥔 土豆 - 🧅 洋葱
- 🌶️ 辣椒 - 🧄 大蒜 - 🌿 葱/香菜 - 🍋 柠檬
- 🛢️ 油 - 🧂 盐 - 🍬 糖 - 🍶 酱油
- 🍚 米饭 - 🍜 面条 - 🍞 面包

## 💡 使用技巧

1. **图片优化** - 使用 tinypng.com 压缩图片
2. **文案精简** - 每步不超过50字，易于阅读
3. **重点突出** - 使用 💡 小贴士标注关键技巧
4. **品牌统一** - 在底部添加公众号二维码

## 📞 问题反馈

如有问题，请在项目中提交 Issue 或联系开发团队
