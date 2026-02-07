/**
 * 步骤相关 API 服务
 * 对应后端 StepViewSet
 */

import { api } from './client';
import { Step, PaginationResponse } from '@/types/api';

export const stepApi = {
  /**
   * 获取步骤列表
   * GET /api/step/
   */
  list: (params?: { recipe?: number[]; query?: string }) =>
    api.get<PaginationResponse<Step>>('/step/', { params }),

  /**
   * 获取步骤详情
   * GET /api/step/{id}/
   */
  get: (id: number) => api.get<Step>(`/step/${id}/`),

  /**
   * 创建步骤
   * POST /api/step/
   */
  create: (data: Partial<Step>) => api.post<Step>('/step/', data),

  /**
   * 更新步骤
   * PUT /api/step/{id}/
   */
  update: (id: number, data: Partial<Step>) =>
    api.put<Step>(`/step/${id}/`, data),

  /**
   * 部分更新步骤
   * PATCH /api/step/{id}/
   */
  patch: (id: number, data: Partial<Step>) =>
    api.patch<Step>(`/step/${id}/`, data),

  /**
   * 删除步骤
   * DELETE /api/step/{id}/
   */
  delete: (id: number) => api.delete<void>(`/step/${id}/`),
};

export default stepApi;
