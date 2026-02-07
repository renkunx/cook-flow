# Cook Flow 前端 API 对接方案

## 📋 概述

本文档描述了前端 React 应用与后端 Django REST Framework API 的完整对接方案。

## 📁 文件结构

```
frontend/src/
├── api/                      # API 服务层
│   ├── client.ts            # Axios 客户端配置
│   ├── index.ts             # API 统一导出
│   ├── auth.ts              # 认证相关
│   ├── user.ts              # 用户相关
│   ├── recipe.ts            # 食谱相关
│   ├── step.ts              # 步骤相关
│   ├── ingredient.ts        # 食材相关
│   ├── food.ts              # 食物相关
│   ├── keyword.ts           # 关键词相关
│   ├── unit.ts              # 单位相关
│   ├── mealPlan.ts          # 膳食计划相关
│   ├── shoppingList.ts      # 购物清单相关
│   ├── supermarket.ts       # 超市相关
│   ├── property.ts          # 属性相关
│   ├── recipeBook.ts        # 食谱书相关
│   ├── ai.ts                # AI 相关
│   ├── log.ts               # 日志相关
│   ├── importExport.ts      # 导入导出相关
│   ├── share.ts             # 分享相关
│   ├── fdc.ts               # FDC 相关
│   └── example.tsx          # 使用示例
├── types/
│   └── api/
│       └── index.ts         # API 类型定义
├── hooks/
│   └── useApi.ts            # API Hooks
└── ...
```

## 🚀 快速开始

### 1. 安装依赖

```bash
cd frontend
npm install
```

### 2. 配置环境变量

创建 `.env` 文件：

```env
VITE_API_BASE_URL=http://localhost:8000/api
VITE_MEDIA_URL=http://localhost:8000/media/
```

### 3. 使用 API

```typescript
import { recipeApi, authApi } from '@/api';

// 登录
const { token } = await authApi.login({ username: 'user', password: 'pass' });
authApi.setToken(token);

// 获取食谱
const recipes = await recipeApi.list({ query: '西红柿' });

// 创建食谱
const newRecipe = await recipeApi.create({
  name: '新食谱',
  description: '描述',
});
```

## 📚 文档索引

| 文档 | 说明 |
|------|------|
| [API_INTEGRATION.md](./API_INTEGRATION.md) | API 对接完整指南 |
| [API_ENDPOINTS.md](./API_ENDPOINTS.md) | 后端 API 端点完整列表 |
| [API_MODEL_MAPPING.md](./API_MODEL_MAPPING.md) | 前后端模型映射表 |

## ✅ 已完成对接的模块

- ✅ 认证 (Auth)
- ✅ 用户管理 (User, UserSpace, UserPreference, Space, Group)
- ✅ 食谱管理 (Recipe, Step, Ingredient)
- ✅ 食物管理 (Food, Keyword, Unit, UnitConversion)
- ✅ 食谱书 (RecipeBook, RecipeBookEntry)
- ✅ 膳食计划 (MealPlan, MealType)
- ✅ 购物清单 (ShoppingList, ShoppingListEntry, ShoppingListRecipe)
- ✅ 超市管理 (Supermarket, SupermarketCategory)
- ✅ 属性管理 (Property, PropertyType)
- ✅ AI 功能 (AiProvider, AiLog)
- ✅ 日志 (CookLog, ViewLog, ImportLog, ExportLog)
- ✅ 导入导出
- ✅ 分享 (ShareLink, InviteLink)
- ✅ FDC 搜索

## ⚠️ 未对接的模块

以下模块后端已提供但前端暂未对接：

- Storage & Sync（存储与同步）
- Connector Config（连接器配置）
- Automation（自动化）
- Recipe Import Queue（食谱导入队列）
- Search Preference（搜索偏好）
- Custom Filter（自定义过滤器）
- Access Token（API 令牌管理）
- Bookmarklet Import（书签导入）
- User File（用户文件）

## 🔧 使用 Hooks 简化 API 调用

```typescript
import { usePaginatedList, useMutation } from '@/hooks/useApi';
import { recipeApi } from '@/api';

function RecipeList() {
  const { data, loading, error, refetch } = usePaginatedList(recipeApi.list);
  
  return (
    <div>
      {loading && <div>加载中...</div>}
      {error && <div>错误: {error.msg}</div>}
      <ul>
        {data.map((recipe) => (
          <li key={recipe.id}>{recipe.name}</li>
        ))}
      </ul>
    </div>
  );
}

function CreateRecipe() {
  const { mutate, loading } = useMutation(recipeApi.create);
  
  const handleSubmit = async (data) => {
    try {
      const newRecipe = await mutate(data);
      console.log('创建成功:', newRecipe.id);
    } catch (error) {
      console.error('创建失败:', error.msg);
    }
  };
  
  return <form onSubmit={handleSubmit}>...</form>;
}
```

## 📝 类型定义

所有 API 类型定义在 `src/types/api/index.ts`，包括：

- 模型类型（Recipe, Food, Ingredient 等）
- 请求参数类型
- 响应类型
- 枚举类型

## 🔄 数据迁移

### 从本地数据迁移到 API

**旧代码：**
```typescript
import { recipes } from '@/data/recipes';
const recipe = recipes.find((r) => r.id === id);
```

**新代码：**
```typescript
import { recipeApi } from '@/api';
const recipe = await recipeApi.get(Number(id));
```

详见 [API_INTEGRATION.md](./API_INTEGRATION.md) 中的"数据迁移指南"部分。

## ❓ 常见问题

### Q: 如何处理认证？
A: 使用 `authApi` 进行登录，token 会自动存储在 localStorage。

### Q: 如何上传图片？
A: 使用 `recipeApi.uploadImage(id, file)` 方法。

### Q: 如何处理分页？
A: 使用 `usePaginatedList` hook，它自动处理分页逻辑。

### Q: 如何批量操作？
A: 使用 `recipeApi.batchUpdate` 或 `foodApi.batchUpdate`。

### Q: 如何处理错误？
A: API 客户端已配置统一错误处理，也可以在组件中 try-catch。

## 🔗 相关链接

- [Django REST Framework](https://www.django-rest-framework.org/)
- [Axios](https://axios-http.com/)
- [React Query](https://tanstack.com/query/latest) (可选，用于更复杂的状态管理)
