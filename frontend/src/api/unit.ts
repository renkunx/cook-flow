/**
 * 单位相关 API 服务
 * 对应后端 UnitViewSet, UnitConversionViewSet
 */

import { api } from './client';
import { Unit, UnitConversion, PaginationResponse } from '@/types/api';

export const unitApi = {
  /**
   * 获取单位列表
   * GET /api/unit/
   */
  list: (params?: {
    query?: string;
    updated_at?: string;
    limit?: number;
    random?: boolean;
  }) => api.get<PaginationResponse<Unit>>('/unit/', { params }),

  /**
   * 获取单位详情
   * GET /api/unit/{id}/
   */
  get: (id: number) => api.get<Unit>(`/unit/${id}/`),

  /**
   * 创建单位
   * POST /api/unit/
   */
  create: (data: Partial<Unit>) => api.post<Unit>('/unit/', data),

  /**
   * 更新单位
   * PUT /api/unit/{id}/
   */
  update: (id: number, data: Partial<Unit>) =>
    api.put<Unit>(`/unit/${id}/`, data),

  /**
   * 部分更新单位
   * PATCH /api/unit/{id}/
   */
  patch: (id: number, data: Partial<Unit>) =>
    api.patch<Unit>(`/unit/${id}/`, data),

  /**
   * 删除单位
   * DELETE /api/unit/{id}/
   */
  delete: (id: number) => api.delete<void>(`/unit/${id}/`),

  /**
   * 合并单位
   * PUT /api/unit/{id}/merge/{target}/
   */
  merge: (id: number, targetId: number) =>
    api.put<void>(`/unit/${id}/merge/${targetId}/`),

  /**
   * 获取级联删除信息
   * GET /api/unit/{id}/cascading/
   */
  getCascading: (id: number, cache?: boolean) =>
    api.get(`/unit/${id}/cascading/`, { params: { cache } }),

  /**
   * 获取阻止删除的信息
   * GET /api/unit/{id}/protecting/
   */
  getProtecting: (id: number, cache?: boolean) =>
    api.get(`/unit/${id}/protecting/`, { params: { cache } }),

  /**
   * 获取置空删除信息
   * GET /api/unit/{id}/nulling/
   */
  getNulling: (id: number, cache?: boolean) =>
    api.get(`/unit/${id}/nulling/`, { params: { cache } }),
};

export const unitConversionApi = {
  /**
   * 获取单位转换列表
   * GET /api/unit-conversion/
   */
  list: (params?: { food_id?: number; query?: string }) =>
    api.get<PaginationResponse<UnitConversion>>('/unit-conversion/', { params }),

  /**
   * 获取单位转换详情
   * GET /api/unit-conversion/{id}/
   */
  get: (id: number) => api.get<UnitConversion>(`/unit-conversion/${id}/`),

  /**
   * 创建单位转换
   * POST /api/unit-conversion/
   */
  create: (data: Partial<UnitConversion>) =>
    api.post<UnitConversion>('/unit-conversion/', data),

  /**
   * 更新单位转换
   * PUT /api/unit-conversion/{id}/
   */
  update: (id: number, data: Partial<UnitConversion>) =>
    api.put<UnitConversion>(`/unit-conversion/${id}/`, data),

  /**
   * 部分更新单位转换
   * PATCH /api/unit-conversion/{id}/
   */
  patch: (id: number, data: Partial<UnitConversion>) =>
    api.patch<UnitConversion>(`/unit-conversion/${id}/`, data),

  /**
   * 删除单位转换
   * DELETE /api/unit-conversion/{id}/
   */
  delete: (id: number) => api.delete<void>(`/unit-conversion/${id}/`),
};

export default { unitApi, unitConversionApi };
