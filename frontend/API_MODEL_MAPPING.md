# 后端模型与前端类型对照表

## 模型映射总览

| 后端模型 | 前端类型 | API 端点 | 前端状态 |
|----------|----------|----------|----------|
| Recipe | Recipe | /api/recipe/ | ✅ 已对接 |
| Step | Step | /api/step/ | ✅ 已对接 |
| Ingredient | Ingredient | /api/ingredient/ | ✅ 已对接 |
| Food | Food | /api/food/ | ✅ 已对接 |
| Keyword | Keyword | /api/keyword/ | ✅ 已对接 |
| Unit | Unit | /api/unit/ | ✅ 已对接 |
| UnitConversion | UnitConversion | /api/unit-conversion/ | ✅ 已对接 |
| MealPlan | MealPlan | /api/meal-plan/ | ✅ 已对接 |
| MealType | MealType | /api/meal-type/ | ✅ 已对接 |
| ShoppingList | ShoppingList | /api/shopping-list/ | ✅ 已对接 |
| ShoppingListEntry | ShoppingListEntry | /api/shopping-list-entry/ | ✅ 已对接 |
| ShoppingListRecipe | ShoppingListRecipe | /api/shopping-list-recipe/ | ✅ 已对接 |
| Supermarket | Supermarket | /api/supermarket/ | ✅ 已对接 |
| SupermarketCategory | SupermarketCategory | /api/supermarket-category/ | ✅ 已对接 |
| RecipeBook | RecipeBook | /api/recipe-book/ | ✅ 已对接 |
| RecipeBookEntry | RecipeBookEntry | /api/recipe-book-entry/ | ✅ 已对接 |
| Property | Property | /api/property/ | ✅ 已对接 |
| PropertyType | PropertyType | /api/property-type/ | ✅ 已对接 |
| User | User | /api/user/ | ✅ 已对接 |
| Space | Space | /api/space/ | ✅ 已对接 |
| UserSpace | UserSpace | /api/user-space/ | ✅ 已对接 |
| CookLog | CookLog | /api/cook-log/ | ✅ 已对接 |
| ViewLog | ViewLog | /api/view-log/ | ✅ 已对接 |
| AiProvider | AiProvider | /api/ai-provider/ | ✅ 已对接 |
| AiLog | AiLog | /api/ai-log/ | ✅ 已对接 |
| Storage | - | /api/storage/ | ⚠️ 未对接 |
| Sync | - | /api/sync/ | ⚠️ 未对接 |
| Automation | - | /api/automation/ | ⚠️ 未对接 |
| ConnectorConfig | - | /api/connector-config/ | ⚠️ 未对接 |

## 详细字段映射

### Recipe（食谱）

| 后端字段 | 前端字段 | 类型 | 说明 |
|----------|----------|------|------|
| id | id | number | 唯一标识 |
| name | title | string | 名称（前端使用 title） |
| description | description | string | 描述 |
| image | image | string | 图片 URL |
| servings | servings | number | 份数 |
| servings_text | servings_text | string | 份数文本 |
| working_time | cookTime | number | 烹饪时间（分钟） |
| waiting_time | - | number | 等待时间 |
| source_url | - | string | 来源 URL |
| private | - | boolean | 是否私有 |
| internal | - | boolean | 是否内部 |
| created_by | - | User | 创建者 |
| created_at | - | string | 创建时间 |
| updated_at | - | string | 更新时间 |
| keywords | tags | Keyword[] | 关键词（前端使用 tags） |
| steps | instructions | Step[] | 步骤（前端使用 instructions） |
| properties | - | Property[] | 属性 |

### Food（食物）

| 后端字段 | 前端字段 | 类型 | 说明 |
|----------|----------|------|------|
| id | id | number | 唯一标识 |
| name | name | string | 名称 |
| plural_name | - | string | 复数名称 |
| description | - | string | 描述 |
| supermarket_category | category | SupermarketCategory | 分类 |
| ignore_shopping | - | boolean | 忽略购物 |
| onhand_users | - | User[] | 库存用户 |
| properties | - | Property[] | 属性 |
| recipe | - | Recipe | 食谱 |

### Ingredient（食材）

| 后端字段 | 前端字段 | 类型 | 说明 |
|----------|----------|------|------|
| id | id | number | 唯一标识 |
| food | - | Food | 食物 |
| unit | - | Unit | 单位 |
| amount | quantity | number | 数量（前端使用 quantity） |
| note | - | string | 备注 |

### Keyword（关键词）

| 后端字段 | 前端字段 | 类型 | 说明 |
|----------|----------|------|------|
| id | id | number | 唯一标识 |
| name | name | string | 名称 |
| description | - | string | 描述 |

### MealPlan（膳食计划）

| 后端字段 | 前端字段 | 类型 | 说明 |
|----------|----------|------|------|
| id | id | number | 唯一标识 |
| recipe | - | Recipe | 食谱 |
| servings | servings | number | 份数 |
| from_date | plannedDate | string | 开始日期 |
| to_date | - | string | 结束日期 |
| meal_type | - | MealType | 膳食类型 |
| note | - | string | 备注 |

### ShoppingListEntry（购物清单条目）

| 后端字段 | 前端字段 | 类型 | 说明 |
|----------|----------|------|------|
| id | id | number | 唯一标识 |
| food | name | Food | 食物（前端使用 name） |
| amount | quantity | number | 数量 |
| unit | unit | Unit | 单位 |
| checked | checked | boolean | 是否已勾选 |

## 类型转换说明

### ID 类型转换
```typescript
// 后端: number
// 前端 URL 参数: string
const recipeId = Number(params.id);
```

### 日期格式转换
```typescript
// 后端: ISO 8601 (2024-01-01T00:00:00Z)
// 前端显示: 本地化格式
const displayDate = new Date(mealPlan.from_date).toLocaleDateString('zh-CN');
```

### 图片 URL 转换
```typescript
// 后端: 相对路径 (recipes/image.jpg)
// 前端: 完整 URL
const imageUrl = recipe.image 
  ? `${import.meta.env.VITE_MEDIA_URL}${recipe.image}`
  : '/placeholder.jpg';
```

### 难度等级映射
```typescript
// 后端: 数字或不存储
// 前端: easy | medium | hard
const difficultyMap: Record<string, 'easy' | 'medium' | 'hard'> = {
  '简单': 'easy',
  '中等': 'medium',
  '困难': 'hard',
};
```

### 食材分类映射
```typescript
// 后端: SupermarketCategory 树形结构
// 前端: CategoryType 枚举
const categoryMap: Record<number, CategoryType> = {
  1: 'vegetable',
  2: 'meat',
  3: 'seafood',
  // ...
};
```

## 前端本地类型 vs API 类型

### Recipe（前端本地类型）
```typescript
interface Recipe {
  id: string;           // API: number
  title: string;        // API: name
  description: string;  // API: description
  image: string;        // API: image (需要拼接 URL)
  cookTime: number;     // API: working_time
  calories: number;     // API: properties 中的能量
  difficulty: 'easy' | 'medium' | 'hard';  // API: 无直接对应
  ingredients: string[];  // API: steps[].ingredients[].food.name
  instructions: string[]; // API: steps[].instruction
  tags: string[];       // API: keywords[].name
}
```

### 转换函数示例
```typescript
function apiRecipeToLocal(recipe: ApiRecipe): LocalRecipe {
  return {
    id: String(recipe.id),
    title: recipe.name,
    description: recipe.description,
    image: recipe.image 
      ? `${MEDIA_URL}${recipe.image}` 
      : '/placeholder.jpg',
    cookTime: recipe.working_time,
    calories: calculateCalories(recipe.properties),
    difficulty: inferDifficulty(recipe),
    ingredients: extractIngredients(recipe.steps),
    instructions: recipe.steps.map(s => s.instruction),
    tags: recipe.keywords.map(k => k.name),
  };
}

function localRecipeToApi(recipe: Partial<LocalRecipe>): Partial<ApiRecipe> {
  return {
    name: recipe.title,
    description: recipe.description,
    working_time: recipe.cookTime,
    // ... 其他字段
  };
}
```

## 字段差异说明

### 前端有但后端没有的字段
| 前端字段 | 说明 | 处理方式 |
|----------|------|----------|
| calories | 卡路里 | 从 properties 计算 |
| difficulty | 难度 | 根据 working_time 推断或后端添加字段 |
| matchCount | 匹配食材数 | 前端计算 |

### 后端有但前端没有的字段
| 后端字段 | 说明 | 处理方式 |
|----------|------|----------|
| waiting_time | 等待时间 | 前端添加 |
| source_url | 来源 | 前端添加 |
| private | 私有 | 前端添加 |
| internal | 内部 | 忽略 |
| created_by | 创建者 | 前端添加 |
| shared | 共享用户 | 前端添加 |
| properties | 属性 | 前端添加 |

## 建议的字段对齐方案

### 方案 1: 前端适配后端（推荐）
前端使用后端的数据结构，通过计算属性或工具函数转换显示。

### 方案 2: 后端添加字段
后端添加前端需要的字段，如 `difficulty`, `calories` 等。

### 方案 3: 中间层适配
创建适配层函数，在 API 调用时自动转换数据格式。

```typescript
// 适配层示例
export async function getRecipes(params?: RecipeSearchParams): Promise<LocalRecipe[]> {
  const response = await recipeApi.list(params);
  return response.results.map(apiRecipeToLocal);
}
```
