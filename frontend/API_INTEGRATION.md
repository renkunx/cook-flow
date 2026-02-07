# 前端 API 对接文档

## 概述

本文档描述了前端 React 应用与后端 Django REST Framework API 的对接方案。

## 后端 API 端点总览

### 已实现的 API 服务模块

| 模块 | 文件 | 对应后端 ViewSet | 状态 |
|------|------|------------------|------|
| 认证 | `api/auth.ts` | CustomAuthToken | ✅ |
| 用户 | `api/user.ts` | UserViewSet, UserSpaceViewSet, UserPreferenceViewSet, SpaceViewSet, GroupViewSet | ✅ |
| 食谱 | `api/recipe.ts` | RecipeViewSet | ✅ |
| 步骤 | `api/step.ts` | StepViewSet | ✅ |
| 食材 | `api/ingredient.ts` | IngredientViewSet | ✅ |
| 食物 | `api/food.ts` | FoodViewSet | ✅ |
| 关键词 | `api/keyword.ts` | KeywordViewSet | ✅ |
| 单位 | `api/unit.ts` | UnitViewSet, UnitConversionViewSet | ✅ |
| 食谱书 | `api/recipeBook.ts` | RecipeBookViewSet, RecipeBookEntryViewSet | ✅ |
| 膳食计划 | `api/mealPlan.ts` | MealPlanViewSet, AutoPlanViewSet, MealTypeViewSet | ✅ |
| 购物清单 | `api/shoppingList.ts` | ShoppingListViewSet, ShoppingListEntryViewSet, ShoppingListRecipeViewSet | ✅ |
| 超市 | `api/supermarket.ts` | SupermarketViewSet, SupermarketCategoryViewSet, SupermarketCategoryRelationViewSet | ✅ |
| 属性 | `api/property.ts` | PropertyViewSet, PropertyTypeViewSet | ✅ |
| AI | `api/ai.ts` | AiProviderViewSet, AiLogViewSet | ✅ |
| 日志 | `api/log.ts` | CookLogViewSet, ViewLogViewSet, ImportLogViewSet, ExportLogViewSet | ✅ |
| 导入导出 | `api/importExport.ts` | 多个端点 | ✅ |
| 分享 | `api/share.ts` | ShareLink, InviteLink | ✅ |
| FDC | `api/fdc.ts` | FdcSearchView | ✅ |

## 后端有但前端尚未完全对接的功能

### 1. Storage & Sync（存储与同步）

**后端端点：**
- `GET/POST /api/storage/` - 存储配置
- `GET/PUT/PATCH/DELETE /api/storage/{id}/`
- `GET/POST /api/sync/` - 同步配置
- `GET/PUT/PATCH/DELETE /api/sync/{id}/`
- `POST /api/sync/{id}/query_synced_folder/`
- `GET /api/sync-log/` - 同步日志

**缺失原因：** 前端目前不涉及文件存储和外部同步功能

### 2. Connector Config（连接器配置）

**后端端点：**
- `GET/POST /api/connector-config/`
- `GET/PUT/PATCH/DELETE /api/connector-config/{id}/`

**缺失原因：** 前端目前不涉及 Home Assistant 等外部系统集成

### 3. Automation（自动化）

**后端端点：**
- `GET/POST /api/automation/`
- `GET/PUT/PATCH/DELETE /api/automation/{id}/`

**缺失原因：** 前端目前不涉及自动化规则配置

### 4. Recipe Import（食谱导入队列）

**后端端点：**
- `GET/POST /api/recipe-import/`
- `GET/PUT/PATCH/DELETE /api/recipe-import/{id}/`
- `POST /api/recipe-import/{id}/import_recipe/`
- `POST /api/recipe-import/import_all/`

**缺失原因：** 前端目前使用直接导入，不涉及导入队列管理

### 5. Search Preference & Search Fields（搜索偏好）

**后端端点：**
- `GET /api/search-fields/`
- `GET/PATCH /api/search-preference/`

**缺失原因：** 前端目前使用固定搜索方式

### 6. Custom Filter（自定义过滤器）

**后端端点：**
- `GET/POST /api/custom-filter/`
- `GET/PUT/PATCH/DELETE /api/custom-filter/{id}/`

**缺失原因：** 前端目前不涉及高级过滤功能

### 7. Access Token（API 令牌）

**后端端点：**
- `GET/POST /api/access-token/`
- `GET/DELETE /api/access-token/{id}/`

**缺失原因：** 前端使用 Session 或固定 Token 认证

### 8. Bookmarklet Import（书签导入）

**后端端点：**
- `GET/POST /api/bookmarklet-import/`
- `GET/DELETE /api/bookmarklet-import/{id}/`

**缺失原因：** 浏览器书签功能，前端不需要直接调用

### 9. User File（用户文件）

**后端端点：**
- `GET/POST /api/user-file/`
- `GET/DELETE /api/user-file/{id}/`

**缺失原因：** 文件上传通过其他端点处理

### 10. Food Inherit Field（食物继承字段）

**后端端点：**
- `GET /api/food-inherit-field/`

**缺失原因：** 只读端点，数据嵌套在 Food 中返回

### 11. 系统级端点

**后端端点：**
- `GET /api/localization/` - 本地化统计
- `GET /api/server-settings/` - 服务器设置
- `POST /api/sync_all/` - 同步所有存储

**缺失原因：** 管理功能，前端不需要直接调用

### 12. Telegram Bot（电报机器人）

**后端端点：**
- `GET/POST /telegram/setup/{pk}`
- `GET /telegram/remove/{pk}`
- `POST /telegram/hook/{token}/`

**缺失原因：** 后端 webhook 端点，前端不需要调用

## 快速开始

### 1. 配置环境变量

在项目根目录创建 `.env` 文件：

```env
VITE_API_BASE_URL=http://localhost:8000/api
VITE_API_TOKEN=your_api_token_here
```

### 2. 使用 API 服务

```typescript
import { recipeApi, foodApi, authApi } from '@/api';

// 获取食谱列表
const recipes = await recipeApi.list({ query: '西红柿' });

// 创建新食谱
const newRecipe = await recipeApi.create({
  name: '新食谱',
  description: '描述',
  servings: 4,
});

// 登录
const { token, user } = await authApi.login({
  username: 'user',
  password: 'pass',
});
authApi.setToken(token);
```

### 3. 在 React 组件中使用

```typescript
import { useState, useEffect } from 'react';
import { recipeApi } from '@/api';
import type { RecipeOverview } from '@/types/api';

function RecipeList() {
  const [recipes, setRecipes] = useState<RecipeOverview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    recipeApi.list()
      .then((response) => setRecipes(response.results))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <ul>
      {recipes.map((recipe) => (
        <li key={recipe.id}>{recipe.name}</li>
      ))}
    </ul>
  );
}
```

## 类型定义

所有 API 类型定义在 `src/types/api/index.ts` 中，包括：

- 模型类型（Recipe, Food, Ingredient 等）
- 请求参数类型（RecipeSearchParams, FoodBatchUpdate 等）
- 响应类型（PaginationResponse 等）

## 错误处理

API 客户端已配置统一错误处理：

- 401: 自动跳转登录页
- 403: 权限不足提示
- 404: 资源不存在提示
- 500: 服务器错误提示

自定义错误处理：

```typescript
import { recipeApi } from '@/api';

try {
  const recipe = await recipeApi.get(999);
} catch (error) {
  if (error.response?.status === 404) {
    console.log('食谱不存在');
  }
}
```

## 数据迁移指南

### 从本地数据迁移到 API

**旧代码（本地数据）：**
```typescript
import { recipes } from '@/data/recipes';

const recipe = recipes.find((r) => r.id === id);
```

**新代码（API）：**
```typescript
import { recipeApi } from '@/api';
import type { Recipe } from '@/types/api';

const [recipe, setRecipe] = useState<Recipe | null>(null);

useEffect(() => {
  recipeApi.get(Number(id)).then(setRecipe);
}, [id]);
```

### 搜索功能迁移

**旧代码（本地过滤）：**
```typescript
const filtered = recipes.filter((r) =>
  r.title.includes(query)
);
```

**新代码（API 搜索）：**
```typescript
const { data } = await recipeApi.list({ query });
```

### 购物清单迁移

**旧代码（localStorage）：**
```typescript
const [items, setItems] = useSyncStorage('shopping_list', []);
```

**新代码（API）：**
```typescript
import { shoppingListEntryApi } from '@/api';

const { data } = await shoppingListEntryApi.list();
await shoppingListEntryApi.create({ food: 1, amount: 2 });
```

## 注意事项

1. **ID 类型**: 后端使用 `number` 类型的 ID，前端需要转换 `string` 类型的 ID
2. **日期格式**: 后端使用 ISO 8601 格式，前端需要使用 `toISOString()` 转换
3. **图片 URL**: 后端返回相对路径，需要拼接 `MEDIA_URL` 或使用 `file_download` 字段
4. **分页**: 列表接口返回分页数据，需要处理 `count`, `next`, `previous` 字段
5. **权限**: 注意不同接口的权限要求，部分接口需要管理员权限
