/**
 * 食谱书相关 API 服务
 * 对应后端 RecipeBookViewSet, RecipeBookEntryViewSet
 */

import { api } from './client';
import {
  RecipeBook,
  RecipeBookEntry,
  PaginationResponse,
} from '@/types/api';

export const recipeBookApi = {
  /**
   * 获取食谱书列表
   * GET /api/recipe-book/
   */
  list: (params?: {
    order_field?: 'id' | 'name' | 'order';
    order_direction?: 'asc' | 'desc';
  }) => api.get<PaginationResponse<RecipeBook>>('/recipe-book/', { params }),

  /**
   * 获取食谱书详情
   * GET /api/recipe-book/{id}/
   */
  get: (id: number) => api.get<RecipeBook>(`/recipe-book/${id}/`),

  /**
   * 创建食谱书
   * POST /api/recipe-book/
   */
  create: (data: Partial<RecipeBook>) =>
    api.post<RecipeBook>('/recipe-book/', data),

  /**
   * 更新食谱书
   * PUT /api/recipe-book/{id}/
   */
  update: (id: number, data: Partial<RecipeBook>) =>
    api.put<RecipeBook>(`/recipe-book/${id}/`, data),

  /**
   * 部分更新食谱书
   * PATCH /api/recipe-book/{id}/
   */
  patch: (id: number, data: Partial<RecipeBook>) =>
    api.patch<RecipeBook>(`/recipe-book/${id}/`, data),

  /**
   * 删除食谱书
   * DELETE /api/recipe-book/{id}/
   */
  delete: (id: number) => api.delete<void>(`/recipe-book/${id}/`),

  /**
   * 获取级联删除信息
   * GET /api/recipe-book/{id}/cascading/
   */
  getCascading: (id: number, cache?: boolean) =>
    api.get(`/recipe-book/${id}/cascading/`, { params: { cache } }),

  /**
   * 获取阻止删除的信息
   * GET /api/recipe-book/{id}/protecting/
   */
  getProtecting: (id: number, cache?: boolean) =>
    api.get(`/recipe-book/${id}/protecting/`, { params: { cache } }),

  /**
   * 获取置空删除信息
   * GET /api/recipe-book/{id}/nulling/
   */
  getNulling: (id: number, cache?: boolean) =>
    api.get(`/recipe-book/${id}/nulling/`, { params: { cache } }),
};

export const recipeBookEntryApi = {
  /**
   * 获取食谱书条目列表
   * GET /api/recipe-book-entry/
   */
  list: (params?: { recipe?: number; book?: number }) =>
    api.get<PaginationResponse<RecipeBookEntry>>('/recipe-book-entry/', { params }),

  /**
   * 获取食谱书条目详情
   * GET /api/recipe-book-entry/{id}/
   */
  get: (id: number) => api.get<RecipeBookEntry>(`/recipe-book-entry/${id}/`),

  /**
   * 创建食谱书条目
   * POST /api/recipe-book-entry/
   */
  create: (data: Partial<RecipeBookEntry>) =>
    api.post<RecipeBookEntry>('/recipe-book-entry/', data),

  /**
   * 更新食谱书条目
   * PUT /api/recipe-book-entry/{id}/
   */
  update: (id: number, data: Partial<RecipeBookEntry>) =>
    api.put<RecipeBookEntry>(`/recipe-book-entry/${id}/`, data),

  /**
   * 部分更新食谱书条目
   * PATCH /api/recipe-book-entry/{id}/
   */
  patch: (id: number, data: Partial<RecipeBookEntry>) =>
    api.patch<RecipeBookEntry>(`/recipe-book-entry/${id}/`, data),

  /**
   * 删除食谱书条目
   * DELETE /api/recipe-book-entry/{id}/
   */
  delete: (id: number) => api.delete<void>(`/recipe-book-entry/${id}/`),
};

export default { recipeBookApi, recipeBookEntryApi };
