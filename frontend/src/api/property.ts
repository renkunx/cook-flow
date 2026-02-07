/**
 * 属性/营养相关 API 服务
 * 对应后端 PropertyViewSet, PropertyTypeViewSet
 */

import { api } from './client';
import { Property, PropertyType, PaginationResponse } from '@/types/api';

export const propertyApi = {
  /**
   * 获取属性列表
   * GET /api/property/
   */
  list: () => api.get<PaginationResponse<Property>>('/property/'),

  /**
   * 获取属性详情
   * GET /api/property/{id}/
   */
  get: (id: number) => api.get<Property>(`/property/${id}/`),

  /**
   * 创建属性
   * POST /api/property/
   */
  create: (data: Partial<Property>) =>
    api.post<Property>('/property/', data),

  /**
   * 更新属性
   * PUT /api/property/{id}/
   */
  update: (id: number, data: Partial<Property>) =>
    api.put<Property>(`/property/${id}/`, data),

  /**
   * 部分更新属性
   * PATCH /api/property/{id}/
   */
  patch: (id: number, data: Partial<Property>) =>
    api.patch<Property>(`/property/${id}/`, data),

  /**
   * 删除属性
   * DELETE /api/property/{id}/
   */
  delete: (id: number) => api.delete<void>(`/property/${id}/`),
};

export const propertyTypeApi = {
  /**
   * 获取属性类型列表
   * GET /api/property-type/
   */
  list: (params?: { category?: string[] }) =>
    api.get<PaginationResponse<PropertyType>>('/property-type/', { params }),

  /**
   * 获取属性类型详情
   * GET /api/property-type/{id}/
   */
  get: (id: number) => api.get<PropertyType>(`/property-type/${id}/`),

  /**
   * 创建属性类型
   * POST /api/property-type/
   */
  create: (data: Partial<PropertyType>) =>
    api.post<PropertyType>('/property-type/', data),

  /**
   * 更新属性类型
   * PUT /api/property-type/{id}/
   */
  update: (id: number, data: Partial<PropertyType>) =>
    api.put<PropertyType>(`/property-type/${id}/`, data),

  /**
   * 部分更新属性类型
   * PATCH /api/property-type/{id}/
   */
  patch: (id: number, data: Partial<PropertyType>) =>
    api.patch<PropertyType>(`/property-type/${id}/`, data),

  /**
   * 删除属性类型
   * DELETE /api/property-type/{id}/
   */
  delete: (id: number) => api.delete<void>(`/property-type/${id}/`),

  /**
   * 获取级联删除信息
   * GET /api/property-type/{id}/cascading/
   */
  getCascading: (id: number, cache?: boolean) =>
    api.get(`/property-type/${id}/cascading/`, { params: { cache } }),

  /**
   * 获取阻止删除的信息
   * GET /api/property-type/{id}/protecting/
   */
  getProtecting: (id: number, cache?: boolean) =>
    api.get(`/property-type/${id}/protecting/`, { params: { cache } }),

  /**
   * 获取置空删除信息
   * GET /api/property-type/{id}/nulling/
   */
  getNulling: (id: number, cache?: boolean) =>
    api.get(`/property-type/${id}/nulling/`, { params: { cache } }),
};

export default { propertyApi, propertyTypeApi };
