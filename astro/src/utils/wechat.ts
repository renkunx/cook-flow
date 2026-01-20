import type { Recipe, Ingredient } from './api';

// 微信公众号格式的颜色主题
const WECHAT_COLORS = {
  primary: '#FA5151',      // 微信品牌红色
  secondary: '#FFC300',    // 温暖黄色
  bgLight: '#F7F7F7',      // 浅灰背景
  text: '#333333',         // 主文本色
  textLight: '#666666',    // 次要文本
  border: '#E0E0E0',       // 边框色
  nutrition: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4'], // 营养信息颜色
};

// 生成微信公众号格式的 HTML
export function generateWechatHTML(
  recipe: Recipe,
  ingredients: Ingredient[]
): string {
  const { name, description, image, nutrition, servings, steps } = recipe;

  // 营养信息
  const nutritionHTML = nutrition
    ? `
    <div class="wechat-section">
      <div class="wechat-section-title">
        <span class="wechat-title-icon">📊</span>
        <span>营养信息</span>
      </div>
      <div class="wechat-nutrition-grid">
        <div class="wechat-nutrition-item" style="background: linear-gradient(135deg, #FFE5E5 0%, #FFF5F5 100%);">
          <div class="nutrition-label">热量</div>
          <div class="nutrition-value" style="color: ${WECHAT_COLORS.nutrition[0]}">${nutrition.calories}</div>
          <div class="nutrition-unit">kcal</div>
        </div>
        <div class="wechat-nutrition-item" style="background: linear-gradient(135deg, #E5F9F6 0%, #F0FFFD 100%);">
          <div class="nutrition-label">蛋白质</div>
          <div class="nutrition-value" style="color: ${WECHAT_COLORS.nutrition[1]}">${nutrition.proteins}</div>
          <div class="nutrition-unit">g</div>
        </div>
        <div class="wechat-nutrition-item" style="background: linear-gradient(135deg, #E5F4FA 0%, #F0FAFF 100%);">
          <div class="nutrition-label">脂肪</div>
          <div class="nutrition-value" style="color: ${WECHAT_COLORS.nutrition[2]}">${nutrition.fats}</div>
          <div class="nutrition-unit">g</div>
        </div>
        <div class="wechat-nutrition-item" style="background: linear-gradient(135deg, #E8F5E9 0%, #F1F8F3 100%);">
          <div class="nutrition-label">碳水</div>
          <div class="nutrition-value" style="color: ${WECHAT_COLORS.nutrition[3]}">${nutrition.carbohydrates}</div>
          <div class="nutrition-unit">g</div>
        </div>
      </div>
    </div>
  `
    : '';

  // 食材列表
  const ingredientsHTML = ingredients.length
    ? `
    <div class="wechat-section">
      <div class="wechat-section-title">
        <span class="wechat-title-icon">🥗</span>
        <span>食材清单</span>
        <span class="wechat-servings">（${servings}人份）</span>
      </div>
      <div class="wechat-ingredient-list">
        ${ingredients
          .map(
            (ing) => `
          <div class="wechat-ingredient-item">
            <span class="ingredient-food">${ing.food?.name || ''}</span>
            <span class="ingredient-amount">${ing.amount || ''} ${ing.unit?.name || ''}</span>
            ${ing.note ? `<span class="ingredient-note">${ing.note}</span>` : ''}
          </div>
        `
          )
          .join('')}
      </div>
    </div>
  `
    : '';

  // 制作步骤
  const stepsHTML = steps
    .map(
      (step, index) => `
    <div class="wechat-step-item">
      <div class="wechat-step-number">${index + 1}</div>
      <div class="wechat-step-content">
        ${step.name ? `<div class="step-name">${step.name}</div>` : ''}
        <div class="step-instruction">${step.instruction || ''}</div>
        ${step.time ? `<div class="step-time">⏱ ${step.time} 分钟</div>` : ''}
      </div>
    </div>
  `
    )
    .join('');

  // 完整 HTML
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif;
      line-height: 1.75;
      color: #333;
      background: #fff;
      padding: 0;
      margin: 0;
    }
    .wechat-container {
      max-width: 677px;
      margin: 0 auto;
      padding: 20px 16px;
    }
    .wechat-title {
      font-size: 24px;
      font-weight: 600;
      color: #1a1a1a;
      text-align: center;
      margin-bottom: 12px;
      line-height: 1.4;
    }
    .wechat-desc {
      font-size: 15px;
      color: #666;
      text-align: center;
      margin-bottom: 16px;
      line-height: 1.6;
    }
    .wechat-image {
      width: 100%;
      border-radius: 8px;
      margin-bottom: 20px;
      display: block;
    }
    .wechat-section {
      margin-bottom: 24px;
    }
    .wechat-section-title {
      font-size: 18px;
      font-weight: 600;
      margin-bottom: 12px;
      color: #1a1a1a;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .wechat-title-icon {
      font-size: 20px;
    }
    .wechat-servings {
      font-size: 14px;
      color: #999;
      font-weight: 400;
      margin-left: 4px;
    }
    .wechat-nutrition-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 10px;
    }
    .wechat-nutrition-item {
      padding: 14px;
      border-radius: 8px;
      text-align: center;
    }
    .nutrition-label {
      font-size: 13px;
      color: #666;
      margin-bottom: 6px;
    }
    .nutrition-value {
      font-size: 22px;
      font-weight: 700;
      margin-bottom: 2px;
    }
    .nutrition-unit {
      font-size: 12px;
      color: #999;
    }
    .wechat-ingredient-list {
      background: #F7F7F7;
      border-radius: 8px;
      padding: 12px 16px;
    }
    .wechat-ingredient-item {
      display: flex;
      align-items: center;
      padding: 10px 0;
      border-bottom: 1px solid #E8E8E8;
      font-size: 15px;
    }
    .wechat-ingredient-item:last-child {
      border-bottom: none;
    }
    .ingredient-food {
      flex: 1;
      color: #333;
    }
    .ingredient-amount {
      color: #FA5151;
      font-weight: 500;
      margin-left: 12px;
    }
    .ingredient-note {
      color: #999;
      font-size: 14px;
      margin-left: 8px;
    }
    .wechat-step-item {
      display: flex;
      gap: 12px;
      margin-bottom: 20px;
    }
    .wechat-step-number {
      flex-shrink: 0;
      width: 28px;
      height: 28px;
      background: linear-gradient(135deg, #FA5151 0%, #FF7875 100%);
      color: white;
      text-align: center;
      line-height: 28px;
      border-radius: 50%;
      font-size: 14px;
      font-weight: 600;
    }
    .wechat-step-content {
      flex: 1;
    }
    .step-name {
      font-size: 16px;
      font-weight: 600;
      color: #333;
      margin-bottom: 6px;
    }
    .step-instruction {
      font-size: 15px;
      color: #555;
      line-height: 1.75;
      white-space: pre-wrap;
    }
    .step-time {
      font-size: 13px;
      color: #999;
      margin-top: 8px;
    }
    .wechat-footer {
      text-align: center;
      padding: 24px 0;
      color: #999;
      font-size: 13px;
      border-top: 1px solid #E8E8E8;
      margin-top: 32px;
    }
  </style>
</head>
<body>
  <div class="wechat-container">
    <h1 class="wechat-title">${name}</h1>
    ${description ? `<p class="wechat-desc">${description}</p>` : ''}
    ${image ? `<img class="wechat-image" src="${image}" alt="${name}">` : ''}

    ${nutritionHTML}
    ${ingredientsHTML}

    <div class="wechat-section">
      <div class="wechat-section-title">
        <span class="wechat-title-icon">👨‍🍳</span>
        <span>制作步骤</span>
      </div>
      ${stepsHTML}
    </div>

    <div class="wechat-footer">
      — 本文由 Cook Flow 提供 —
    </div>
  </div>
</body>
</html>
  `.trim();
}

// 复制到剪贴板（富文本格式）
export async function copyToWechat(html: string): Promise<boolean> {
  try {
    // 创建 Blob 对象（HTML 类型）
    const blob = new Blob([html], { type: 'text/html' });
    const clipboardItem = new ClipboardItem({ 'text/html': blob });
    await navigator.clipboard.write([clipboardItem]);
    return true;
  } catch (error) {
    console.error('Copy failed:', error);
    // 降级方案：复制纯文本
    try {
      const text = html
        .replace(/<[^>]+>/g, '')
        .replace(/\s+/g, ' ')
        .trim();
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      return false;
    }
  }
}
