/**
 * 购物清单相关 API 服务
 * 对应后端 ShoppingListViewSet, ShoppingListEntryViewSet, ShoppingListRecipeViewSet
 */

import { api } from './client';
import {
  ShoppingList,
  ShoppingListEntry,
  ShoppingListRecipe,
  ShoppingListEntryBulkCreate,
  PaginationResponse,
} from '@/types/api';

export const shoppingListApi = {
  /**
   * 获取购物清单列表
   * GET /api/shopping-list/
   */
  list: () => api.get<PaginationResponse<ShoppingList>>('/shopping-list/'),

  /**
   * 获取购物清单详情
   * GET /api/shopping-list/{id}/
   */
  get: (id: number) => api.get<ShoppingList>(`/shopping-list/${id}/`),

  /**
   * 创建购物清单
   * POST /api/shopping-list/
   */
  create: (data: Partial<ShoppingList>) =>
    api.post<ShoppingList>('/shopping-list/', data),

  /**
   * 更新购物清单
   * PUT /api/shopping-list/{id}/
   */
  update: (id: number, data: Partial<ShoppingList>) =>
    api.put<ShoppingList>(`/shopping-list/${id}/`, data),

  /**
   * 部分更新购物清单
   * PATCH /api/shopping-list/{id}/
   */
  patch: (id: number, data: Partial<ShoppingList>) =>
    api.patch<ShoppingList>(`/shopping-list/${id}/`, data),

  /**
   * 删除购物清单
   * DELETE /api/shopping-list/{id}/
   */
  delete: (id: number) => api.delete<void>(`/shopping-list/${id}/`),
};

export const shoppingListEntryApi = {
  /**
   * 获取购物清单条目列表
   * GET /api/shopping-list-entry/
   */
  list: (params?: { checked?: boolean; food?: number; unit?: number }) =>
    api.get<PaginationResponse<ShoppingListEntry>>('/shopping-list-entry/', { params }),

  /**
   * 获取购物清单条目详情
   * GET /api/shopping-list-entry/{id}/
   */
  get: (id: number) => api.get<ShoppingListEntry>(`/shopping-list-entry/${id}/`),

  /**
   * 创建购物清单条目
   * POST /api/shopping-list-entry/
   */
  create: (data: Partial<ShoppingListEntry>) =>
    api.post<ShoppingListEntry>('/shopping-list-entry/', data),

  /**
   * 更新购物清单条目
   * PUT /api/shopping-list-entry/{id}/
   */
  update: (id: number, data: Partial<ShoppingListEntry>) =>
    api.put<ShoppingListEntry>(`/shopping-list-entry/${id}/`, data),

  /**
   * 部分更新购物清单条目
   * PATCH /api/shopping-list-entry/{id}/
   */
  patch: (id: number, data: Partial<ShoppingListEntry>) =>
    api.patch<ShoppingListEntry>(`/shopping-list-entry/${id}/`, data),

  /**
   * 删除购物清单条目
   * DELETE /api/shopping-list-entry/{id}/
   */
  delete: (id: number) => api.delete<void>(`/shopping-list-entry/${id}/`),

  /**
   * 批量创建条目
   * POST /api/shopping-list-entry/bulk/
   */
  bulkCreate: (data: ShoppingListEntryBulkCreate) =>
    api.post<ShoppingListEntry[]>('/shopping-list-entry/bulk/', data),
};

export const shoppingListRecipeApi = {
  /**
   * 获取购物清单食谱列表
   * GET /api/shopping-list-recipe/
   */
  list: (params?: { mealplan?: number }) =>
    api.get<PaginationResponse<ShoppingListRecipe>>('/shopping-list-recipe/', { params }),

  /**
   * 获取购物清单食谱详情
   * GET /api/shopping-list-recipe/{id}/
   */
  get: (id: number) => api.get<ShoppingListRecipe>(`/shopping-list-recipe/${id}/`),

  /**
   * 创建购物清单食谱
   * POST /api/shopping-list-recipe/
   */
  create: (data: Partial<ShoppingListRecipe>) =>
    api.post<ShoppingListRecipe>('/shopping-list-recipe/', data),

  /**
   * 更新购物清单食谱
   * PUT /api/shopping-list-recipe/{id}/
   */
  update: (id: number, data: Partial<ShoppingListRecipe>) =>
    api.put<ShoppingListRecipe>(`/shopping-list-recipe/${id}/`, data),

  /**
   * 部分更新购物清单食谱
   * PATCH /api/shopping-list-recipe/{id}/
   */
  patch: (id: number, data: Partial<ShoppingListRecipe>) =>
    api.patch<ShoppingListRecipe>(`/shopping-list-recipe/${id}/`, data),

  /**
   * 删除购物清单食谱
   * DELETE /api/shopping-list-recipe/{id}/
   */
  delete: (id: number) => api.delete<void>(`/shopping-list-recipe/${id}/`),

  /**
   * 批量创建条目
   * POST /api/shopping-list-recipe/{id}/bulk_create_entries/
   */
  bulkCreateEntries: (id: number, data: ShoppingListEntryBulkCreate) =>
    api.post<ShoppingListEntry[]>(`/shopping-list-recipe/${id}/bulk_create_entries/`, data),
};

export default {
  shoppingListApi,
  shoppingListEntryApi,
  shoppingListRecipeApi,
};
