/**
 * 食材相关 API 服务
 * 对应后端 IngredientViewSet
 */

import { api } from './client';
import {
  Ingredient,
  IngredientSimple,
  PaginationResponse,
} from '@/types/api';

export const ingredientApi = {
  /**
   * 获取食材列表
   * GET /api/ingredient/
   */
  list: (params?: { food?: number; unit?: number; simple?: boolean }) =>
    api.get<PaginationResponse<Ingredient | IngredientSimple>>('/ingredient/', { params }),

  /**
   * 获取食材详情
   * GET /api/ingredient/{id}/
   */
  get: (id: number) => api.get<Ingredient>(`/ingredient/${id}/`),

  /**
   * 创建食材
   * POST /api/ingredient/
   */
  create: (data: Partial<Ingredient>) => api.post<Ingredient>('/ingredient/', data),

  /**
   * 更新食材
   * PUT /api/ingredient/{id}/
   */
  update: (id: number, data: Partial<Ingredient>) =>
    api.put<Ingredient>(`/ingredient/${id}/`, data),

  /**
   * 部分更新食材
   * PATCH /api/ingredient/{id}/
   */
  patch: (id: number, data: Partial<Ingredient>) =>
    api.patch<Ingredient>(`/ingredient/${id}/`, data),

  /**
   * 删除食材
   * DELETE /api/ingredient/{id}/
   */
  delete: (id: number) => api.delete<void>(`/ingredient/${id}/`),

  /**
   * 从字符串解析食材
   * POST /api/ingredient-from-string/
   */
  parseFromString: (text: string) =>
    api.post<Ingredient>('/ingredient-from-string/', { text }),
};

export default ingredientApi;
