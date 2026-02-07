/**
 * 超市相关 API 服务
 * 对应后端 SupermarketViewSet, SupermarketCategoryViewSet, SupermarketCategoryRelationViewSet
 */

import { api } from './client';
import {
  Supermarket,
  SupermarketCategory,
  SupermarketCategoryRelation,
  PaginationResponse,
} from '@/types/api';

export const supermarketApi = {
  /**
   * 获取超市列表
   * GET /api/supermarket/
   */
  list: (params?: { query?: string; updated_at?: string; limit?: number }) =>
    api.get<PaginationResponse<Supermarket>>('/supermarket/', { params }),

  /**
   * 获取超市详情
   * GET /api/supermarket/{id}/
   */
  get: (id: number) => api.get<Supermarket>(`/supermarket/${id}/`),

  /**
   * 创建超市
   * POST /api/supermarket/
   */
  create: (data: Partial<Supermarket>) =>
    api.post<Supermarket>('/supermarket/', data),

  /**
   * 更新超市
   * PUT /api/supermarket/{id}/
   */
  update: (id: number, data: Partial<Supermarket>) =>
    api.put<Supermarket>(`/supermarket/${id}/`, data),

  /**
   * 部分更新超市
   * PATCH /api/supermarket/{id}/
   */
  patch: (id: number, data: Partial<Supermarket>) =>
    api.patch<Supermarket>(`/supermarket/${id}/`, data),

  /**
   * 删除超市
   * DELETE /api/supermarket/{id}/
   */
  delete: (id: number) => api.delete<void>(`/supermarket/${id}/`),

  /**
   * 获取级联删除信息
   * GET /api/supermarket/{id}/cascading/
   */
  getCascading: (id: number, cache?: boolean) =>
    api.get(`/supermarket/${id}/cascading/`, { params: { cache } }),

  /**
   * 获取阻止删除的信息
   * GET /api/supermarket/{id}/protecting/
   */
  getProtecting: (id: number, cache?: boolean) =>
    api.get(`/supermarket/${id}/protecting/`, { params: { cache } }),

  /**
   * 获取置空删除信息
   * GET /api/supermarket/{id}/nulling/
   */
  getNulling: (id: number, cache?: boolean) =>
    api.get(`/supermarket/${id}/nulling/`, { params: { cache } }),
};

export const supermarketCategoryApi = {
  /**
   * 获取超市分类列表
   * GET /api/supermarket-category/
   */
  list: (params?: {
    query?: string;
    updated_at?: string;
    limit?: number;
    random?: boolean;
  }) =>
    api.get<PaginationResponse<SupermarketCategory>>('/supermarket-category/', { params }),

  /**
   * 获取超市分类详情
   * GET /api/supermarket-category/{id}/
   */
  get: (id: number) => api.get<SupermarketCategory>(`/supermarket-category/${id}/`),

  /**
   * 创建超市分类
   * POST /api/supermarket-category/
   */
  create: (data: Partial<SupermarketCategory>) =>
    api.post<SupermarketCategory>('/supermarket-category/', data),

  /**
   * 更新超市分类
   * PUT /api/supermarket-category/{id}/
   */
  update: (id: number, data: Partial<SupermarketCategory>) =>
    api.put<SupermarketCategory>(`/supermarket-category/${id}/`, data),

  /**
   * 部分更新超市分类
   * PATCH /api/supermarket-category/{id}/
   */
  patch: (id: number, data: Partial<SupermarketCategory>) =>
    api.patch<SupermarketCategory>(`/supermarket-category/${id}/`, data),

  /**
   * 删除超市分类
   * DELETE /api/supermarket-category/{id}/
   */
  delete: (id: number) => api.delete<void>(`/supermarket-category/${id}/`),

  /**
   * 合并超市分类
   * PUT /api/supermarket-category/{id}/merge/{target}/
   */
  merge: (id: number, targetId: number) =>
    api.put<void>(`/supermarket-category/${id}/merge/${targetId}/`),

  /**
   * 获取级联删除信息
   * GET /api/supermarket-category/{id}/cascading/
   */
  getCascading: (id: number, cache?: boolean) =>
    api.get(`/supermarket-category/${id}/cascading/`, { params: { cache } }),

  /**
   * 获取阻止删除的信息
   * GET /api/supermarket-category/{id}/protecting/
   */
  getProtecting: (id: number, cache?: boolean) =>
    api.get(`/supermarket-category/${id}/protecting/`, { params: { cache } }),

  /**
   * 获取置空删除信息
   * GET /api/supermarket-category/{id}/nulling/
   */
  getNulling: (id: number, cache?: boolean) =>
    api.get(`/supermarket-category/${id}/nulling/`, { params: { cache } }),
};

export const supermarketCategoryRelationApi = {
  /**
   * 获取超市分类关系列表
   * GET /api/supermarket-category-relation/
   */
  list: (params?: { query?: string; updated_at?: string; limit?: number }) =>
    api.get<PaginationResponse<SupermarketCategoryRelation>>(
      '/supermarket-category-relation/',
      { params }
    ),

  /**
   * 获取超市分类关系详情
   * GET /api/supermarket-category-relation/{id}/
   */
  get: (id: number) =>
    api.get<SupermarketCategoryRelation>(`/supermarket-category-relation/${id}/`),

  /**
   * 创建超市分类关系
   * POST /api/supermarket-category-relation/
   */
  create: (data: Partial<SupermarketCategoryRelation>) =>
    api.post<SupermarketCategoryRelation>('/supermarket-category-relation/', data),

  /**
   * 更新超市分类关系
   * PUT /api/supermarket-category-relation/{id}/
   */
  update: (id: number, data: Partial<SupermarketCategoryRelation>) =>
    api.put<SupermarketCategoryRelation>(`/supermarket-category-relation/${id}/`, data),

  /**
   * 部分更新超市分类关系
   * PATCH /api/supermarket-category-relation/{id}/
   */
  patch: (id: number, data: Partial<SupermarketCategoryRelation>) =>
    api.patch<SupermarketCategoryRelation>(`/supermarket-category-relation/${id}/`, data),

  /**
   * 删除超市分类关系
   * DELETE /api/supermarket-category-relation/{id}/
   */
  delete: (id: number) =>
    api.delete<void>(`/supermarket-category-relation/${id}/`),
};

export default {
  supermarketApi,
  supermarketCategoryApi,
  supermarketCategoryRelationApi,
};
