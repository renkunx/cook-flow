/**
 * API 服务统一导出
 */

// 核心客户端
export { api, default as apiClient, uploadFile } from './client';

// 认证
export { authApi, default as auth } from './auth';

// 用户相关
export {
  userApi,
  userSpaceApi,
  userPreferenceApi,
  spaceApi,
  groupApi,
  default as user,
} from './user';

// 食谱相关
export { recipeApi, default as recipe } from './recipe';
export { stepApi, default as step } from './step';
export { ingredientApi, default as ingredient } from './ingredient';
export { recipeBookApi, recipeBookEntryApi, default as recipeBook } from './recipeBook';

// 食物相关
export { foodApi, default as food } from './food';
export { keywordApi, default as keyword } from './keyword';
export { unitApi, unitConversionApi, default as unit } from './unit';

// 膳食计划
export { mealPlanApi, mealTypeApi, default as mealPlan } from './mealPlan';

// 购物清单
export {
  shoppingListApi,
  shoppingListEntryApi,
  shoppingListRecipeApi,
  default as shoppingList,
} from './shoppingList';

// 超市
export {
  supermarketApi,
  supermarketCategoryApi,
  supermarketCategoryRelationApi,
  default as supermarket,
} from './supermarket';

// 属性
export { propertyApi, propertyTypeApi, default as property } from './property';

// AI
export { aiProviderApi, aiLogApi, aiImportApi, default as ai } from './ai';

// 日志
export {
  cookLogApi,
  viewLogApi,
  importLogApi,
  exportLogApi,
  default as log,
} from './log';

// 导入导出
export { importExportApi, default as importExport } from './importExport';

// 分享
export { shareLinkApi, inviteLinkApi, getShareLink, reportAbuse, default as share } from './share';

// FDC
export { fdcApi, default as fdc } from './fdc';
