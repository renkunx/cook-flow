/**
 * 关键词/标签相关 API 服务
 * 对应后端 KeywordViewSet
 */

import { api } from './client';
import { Keyword, PaginationResponse } from '@/types/api';

export const keywordApi = {
  /**
   * 获取关键词列表
   * GET /api/keyword/
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
  }) => api.get<PaginationResponse<Keyword>>('/keyword/', { params }),

  /**
   * 获取关键词详情
   * GET /api/keyword/{id}/
   */
  get: (id: number) => api.get<Keyword>(`/keyword/${id}/`),

  /**
   * 创建关键词
   * POST /api/keyword/
   */
  create: (data: Partial<Keyword>) => api.post<Keyword>('/keyword/', data),

  /**
   * 更新关键词
   * PUT /api/keyword/{id}/
   */
  update: (id: number, data: Partial<Keyword>) =>
    api.put<Keyword>(`/keyword/${id}/`, data),

  /**
   * 部分更新关键词
   * PATCH /api/keyword/{id}/
   */
  patch: (id: number, data: Partial<Keyword>) =>
    api.patch<Keyword>(`/keyword/${id}/`, data),

  /**
   * 删除关键词
   * DELETE /api/keyword/{id}/
   */
  delete: (id: number) => api.delete<void>(`/keyword/${id}/`),

  /**
   * 合并关键词
   * PUT /api/keyword/{id}/merge/{target}/
   */
  merge: (id: number, targetId: number) =>
    api.put<void>(`/keyword/${id}/merge/${targetId}/`),

  /**
   * 移动关键词
   * PUT /api/keyword/{id}/move/{parent}/
   */
  move: (id: number, parentId: number) =>
    api.put<void>(`/keyword/${id}/move/${parentId}/`),

  /**
   * 获取级联删除信息
   * GET /api/keyword/{id}/cascading/
   */
  getCascading: (id: number, cache?: boolean) =>
    api.get(`/keyword/${id}/cascading/`, { params: { cache } }),

  /**
   * 获取阻止删除的信息
   * GET /api/keyword/{id}/protecting/
   */
  getProtecting: (id: number, cache?: boolean) =>
    api.get(`/keyword/${id}/protecting/`, { params: { cache } }),

  /**
   * 获取置空删除信息
   * GET /api/keyword/{id}/nulling/
   */
  getNulling: (id: number, cache?: boolean) =>
    api.get(`/keyword/${id}/nulling/`, { params: { cache } }),
};

export default keywordApi;
