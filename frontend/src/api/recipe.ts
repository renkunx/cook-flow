/**
 * 食谱相关 API 服务
 * 对应后端 RecipeViewSet
 */

import { api } from './client';
import {
  Recipe,
  RecipeOverview,
  RecipeSimple,
  RecipeSearchParams,
  RecipeBatchUpdate,
  RecipeFromSource,
  RecipeFromSourceResponse,
  PaginationResponse,
} from '@/types/api';

export const recipeApi = {
  /**
   * 获取食谱列表
   * GET /api/recipe/
   */
  list: (params?: RecipeSearchParams) =>
    api.get<PaginationResponse<RecipeOverview>>('/recipe/', { params }),

  /**
   * 获取食谱详情
   * GET /api/recipe/{id}/
   */
  get: (id: number) => api.get<Recipe>(`/recipe/${id}/`),

  /**
   * 创建食谱
   * POST /api/recipe/
   */
  create: (data: Partial<Recipe>) => api.post<Recipe>('/recipe/', data),

  /**
   * 更新食谱
   * PUT /api/recipe/{id}/
   */
  update: (id: number, data: Partial<Recipe>) =>
    api.put<Recipe>(`/recipe/${id}/`, data),

  /**
   * 部分更新食谱
   * PATCH /api/recipe/{id}/
   */
  patch: (id: number, data: Partial<Recipe>) =>
    api.patch<Recipe>(`/recipe/${id}/`, data),

  /**
   * 删除食谱
   * DELETE /api/recipe/{id}/
   */
  delete: (id: number) => api.delete<void>(`/recipe/${id}/`),

  /**
   * 批量更新食谱
   * PUT /api/recipe/batch_update/
   */
  batchUpdate: (data: RecipeBatchUpdate) =>
    api.put<void>('/recipe/batch_update/', data),

  /**
   * 上传食谱图片
   * PUT /api/recipe/{id}/image/
   */
  uploadImage: (id: number, image: File) => {
    const formData = new FormData();
    formData.append('image', image);
    return api.put<Recipe>(`/recipe/${id}/image/`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  /**
   * 从 URL 导入食谱
   * POST /api/recipe-from-source/
   */
  importFromUrl: (data: RecipeFromSource) =>
    api.post<RecipeFromSourceResponse>('/recipe-from-source/', data),

  /**
   * 添加到购物清单
   * PUT /api/recipe/{id}/shopping/
   */
  addToShopping: (
    id: number,
    data: {
      ingredients?: number[];
      servings?: number;
      list_recipe?: number;
      mealplan?: number;
    }
  ) => api.put<void>(`/recipe/${id}/shopping/`, data),

  /**
   * 获取相关食谱
   * GET /api/recipe/{id}/related/
   */
  getRelated: (id: number, levels?: number) =>
    api.get<RecipeSimple[]>(`/recipe/${id}/related/`, { params: { levels } }),

  /**
   * 获取扁平食谱列表（用于选择器）
   * GET /api/recipe/flat/
   */
  getFlatList: () => api.get<RecipeSimple[]>('/recipe/flat/'),

  /**
   * 使用 AI 获取食谱属性
   * POST /api/recipe/{id}/aiproperties/
   */
  getAiProperties: (id: number, provider: number, data: Partial<Recipe>) =>
    api.post<Recipe>(`/recipe/${id}/aiproperties/`, data, {
      params: { provider },
    }),

  /**
   * 删除外部存储文件
   * PATCH /api/recipe/{id}/delete_external/
   */
  deleteExternal: (id: number) =>
    api.patch<Recipe>(`/recipe/${id}/delete_external/`),

  /**
   * 获取级联删除信息
   * GET /api/recipe/{id}/cascading/
   */
  getCascading: (id: number, cache?: boolean) =>
    api.get(`/recipe/${id}/cascading/`, { params: { cache } }),

  /**
   * 获取阻止删除的信息
   * GET /api/recipe/{id}/protecting/
   */
  getProtecting: (id: number, cache?: boolean) =>
    api.get(`/recipe/${id}/protecting/`, { params: { cache } }),

  /**
   * 获取置空删除信息
   * GET /api/recipe/{id}/nulling/
   */
  getNulling: (id: number, cache?: boolean) =>
    api.get(`/recipe/${id}/nulling/`, { params: { cache } }),
};

export default recipeApi;
