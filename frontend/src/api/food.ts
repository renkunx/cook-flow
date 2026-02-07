/**
 * 食物相关 API 服务
 * 对应后端 FoodViewSet
 */

import { api } from './client';
import {
  Food,
  FoodSimple,
  FoodBatchUpdate,
  PaginationResponse,
} from '@/types/api';

export const foodApi = {
  /**
   * 获取食物列表
   * GET /api/food/
   */
  list: (params?: {
    query?: string;
    updated_at?: string;
    limit?: number;
    random?: boolean;
    root?: number;
    tree?: number;
    root_tree?: number;
    extended?: boolean;
    simple?: boolean;
  }) => api.get<PaginationResponse<Food | FoodSimple>>('/food/', { params }),

  /**
   * 获取食物详情
   * GET /api/food/{id}/
   */
  get: (id: number) => api.get<Food>(`/food/${id}/`),

  /**
   * 创建食物
   * POST /api/food/
   */
  create: (data: Partial<Food>) => api.post<Food>('/food/', data),

  /**
   * 更新食物
   * PUT /api/food/{id}/
   */
  update: (id: number, data: Partial<Food>) =>
    api.put<Food>(`/food/${id}/`, data),

  /**
   * 部分更新食物
   * PATCH /api/food/{id}/
   */
  patch: (id: number, data: Partial<Food>) =>
    api.patch<Food>(`/food/${id}/`, data),

  /**
   * 删除食物
   * DELETE /api/food/{id}/
   */
  delete: (id: number) => api.delete<void>(`/food/${id}/`),

  /**
   * 批量更新食物
   * PUT /api/food/batch_update/
   */
  batchUpdate: (data: FoodBatchUpdate) =>
    api.put<void>('/food/batch_update/', data),

  /**
   * 合并食物
   * PUT /api/food/{id}/merge/{target}/
   */
  merge: (id: number, targetId: number) =>
    api.put<void>(`/food/${id}/merge/${targetId}/`),

  /**
   * 移动食物
   * PUT /api/food/{id}/move/{parent}/
   */
  move: (id: number, parentId: number) =>
    api.put<void>(`/food/${id}/move/${parentId}/`),

  /**
   * 添加到购物清单
   * PUT /api/food/{id}/shopping/
   */
  addToShopping: (id: number, data?: { amount?: number; unit?: number; _delete?: boolean }) =>
    api.put<void>(`/food/${id}/shopping/`, data),

  /**
   * 从 FDC 更新食物数据
   * POST /api/food/{id}/fdc/
   */
  updateFromFdc: (id: number, fdcId?: number) =>
    api.post<Food>(`/food/${id}/fdc/`, { fdc_id: fdcId }),

  /**
   * 使用 AI 获取食物属性
   * POST /api/food/{id}/aiproperties/
   */
  getAiProperties: (id: number, provider: number, data: Partial<Food>) =>
    api.post<Food>(`/food/${id}/aiproperties/`, data, {
      params: { provider },
    }),

  /**
   * 获取级联删除信息
   * GET /api/food/{id}/cascading/
   */
  getCascading: (id: number, cache?: boolean) =>
    api.get(`/food/${id}/cascading/`, { params: { cache } }),

  /**
   * 获取阻止删除的信息
   * GET /api/food/{id}/protecting/
   */
  getProtecting: (id: number, cache?: boolean) =>
    api.get(`/food/${id}/protecting/`, { params: { cache } }),

  /**
   * 获取置空删除信息
   * GET /api/food/{id}/nulling/
   */
  getNulling: (id: number, cache?: boolean) =>
    api.get(`/food/${id}/nulling/`, { params: { cache } }),
};

export default foodApi;
