/**
 * AI 相关 API 服务
 * 对应后端 AiProviderViewSet, AiLogViewSet 和其他 AI 端点
 */

import { api } from './client';
import {
  AiProvider,
  AiLog,
  Recipe,
  Food,
  RecipeFromSourceResponse,
  PaginationResponse,
} from '@/types/api';

export const aiProviderApi = {
  /**
   * 获取 AI 提供商列表
   * GET /api/ai-provider/
   */
  list: () => api.get<PaginationResponse<AiProvider>>('/ai-provider/'),

  /**
   * 获取 AI 提供商详情
   * GET /api/ai-provider/{id}/
   */
  get: (id: number) => api.get<AiProvider>(`/ai-provider/${id}/`),

  /**
   * 创建 AI 提供商
   * POST /api/ai-provider/
   */
  create: (data: Partial<AiProvider>) =>
    api.post<AiProvider>('/ai-provider/', data),

  /**
   * 更新 AI 提供商
   * PUT /api/ai-provider/{id}/
   */
  update: (id: number, data: Partial<AiProvider>) =>
    api.put<AiProvider>(`/ai-provider/${id}/`, data),

  /**
   * 部分更新 AI 提供商
   * PATCH /api/ai-provider/{id}/
   */
  patch: (id: number, data: Partial<AiProvider>) =>
    api.patch<AiProvider>(`/ai-provider/${id}/`, data),

  /**
   * 删除 AI 提供商
   * DELETE /api/ai-provider/{id}/
   */
  delete: (id: number) => api.delete<void>(`/ai-provider/${id}/`),

  /**
   * 获取级联删除信息
   * GET /api/ai-provider/{id}/cascading/
   */
  getCascading: (id: number, cache?: boolean) =>
    api.get(`/ai-provider/${id}/cascading/`, { params: { cache } }),

  /**
   * 获取阻止删除的信息
   * GET /api/ai-provider/{id}/protecting/
   */
  getProtecting: (id: number, cache?: boolean) =>
    api.get(`/ai-provider/${id}/protecting/`, { params: { cache } }),

  /**
   * 获取置空删除信息
   * GET /api/ai-provider/{id}/nulling/
   */
  getNulling: (id: number, cache?: boolean) =>
    api.get(`/ai-provider/${id}/nulling/`, { params: { cache } }),
};

export const aiLogApi = {
  /**
   * 获取 AI 日志列表
   * GET /api/ai-log/
   */
  list: () => api.get<PaginationResponse<AiLog>>('/ai-log/'),

  /**
   * 获取 AI 日志详情
   * GET /api/ai-log/{id}/
   */
  get: (id: number) => api.get<AiLog>(`/ai-log/${id}/`),
};

export const aiImportApi = {
  /**
   * AI 导入食谱（从图片或文本）
   * POST /api/ai-import/
   */
  import: (data: { image?: string; text?: string }) =>
    api.post<RecipeFromSourceResponse>('/ai-import/', data),

  /**
   * AI 排序步骤
   * POST /api/ai-step-sort/
   */
  sortSteps: (data: { steps: string[] }) =>
    api.post<{ steps: string[] }>('/ai-step-sort/', data),

  /**
   * AI 生成食谱图片
   * POST /api/ai-recipe-image/
   */
  generateImage: (data: { name: string; description?: string }) =>
    api.post<{ image_url: string }>('/ai-recipe-image/', data),
};

export default {
  aiProviderApi,
  aiLogApi,
  aiImportApi,
};
