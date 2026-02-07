/**
 * 日志相关 API 服务
 * 对应后端 CookLogViewSet, ViewLogViewSet, ImportLogViewSet, ExportLogViewSet
 */

import { api } from './client';
import {
  CookLog,
  ViewLog,
  ImportLog,
  ExportLog,
  PaginationResponse,
} from '@/types/api';

export const cookLogApi = {
  /**
   * 获取烹饪日志列表
   * GET /api/cook-log/
   */
  list: () => api.get<PaginationResponse<CookLog>>('/cook-log/'),

  /**
   * 获取烹饪日志详情
   * GET /api/cook-log/{id}/
   */
  get: (id: number) => api.get<CookLog>(`/cook-log/${id}/`),

  /**
   * 创建烹饪日志
   * POST /api/cook-log/
   */
  create: (data: Partial<CookLog>) => api.post<CookLog>('/cook-log/', data),

  /**
   * 更新烹饪日志
   * PUT /api/cook-log/{id}/
   */
  update: (id: number, data: Partial<CookLog>) =>
    api.put<CookLog>(`/cook-log/${id}/`, data),

  /**
   * 部分更新烹饪日志
   * PATCH /api/cook-log/{id}/
   */
  patch: (id: number, data: Partial<CookLog>) =>
    api.patch<CookLog>(`/cook-log/${id}/`, data),

  /**
   * 删除烹饪日志
   * DELETE /api/cook-log/{id}/
   */
  delete: (id: number) => api.delete<void>(`/cook-log/${id}/`),
};

export const viewLogApi = {
  /**
   * 获取浏览日志列表
   * GET /api/view-log/
   */
  list: () => api.get<PaginationResponse<ViewLog>>('/view-log/'),

  /**
   * 获取浏览日志详情
   * GET /api/view-log/{id}/
   */
  get: (id: number) => api.get<ViewLog>(`/view-log/${id}/`),

  /**
   * 创建浏览日志
   * POST /api/view-log/
   */
  create: (data: Partial<ViewLog>) => api.post<ViewLog>('/view-log/', data),

  /**
   * 更新浏览日志
   * PUT /api/view-log/{id}/
   */
  update: (id: number, data: Partial<ViewLog>) =>
    api.put<ViewLog>(`/view-log/${id}/`, data),

  /**
   * 部分更新浏览日志
   * PATCH /api/view-log/{id}/
   */
  patch: (id: number, data: Partial<ViewLog>) =>
    api.patch<ViewLog>(`/view-log/${id}/`, data),

  /**
   * 删除浏览日志
   * DELETE /api/view-log/{id}/
   */
  delete: (id: number) => api.delete<void>(`/view-log/${id}/`),
};

export const importLogApi = {
  /**
   * 获取导入日志列表
   * GET /api/import-log/
   */
  list: () => api.get<PaginationResponse<ImportLog>>('/import-log/'),

  /**
   * 获取导入日志详情
   * GET /api/import-log/{id}/
   */
  get: (id: number) => api.get<ImportLog>(`/import-log/${id}/`),

  /**
   * 创建导入日志
   * POST /api/import-log/
   */
  create: (data: Partial<ImportLog>) =>
    api.post<ImportLog>('/import-log/', data),

  /**
   * 更新导入日志
   * PUT /api/import-log/{id}/
   */
  update: (id: number, data: Partial<ImportLog>) =>
    api.put<ImportLog>(`/import-log/${id}/`, data),

  /**
   * 部分更新导入日志
   * PATCH /api/import-log/{id}/
   */
  patch: (id: number, data: Partial<ImportLog>) =>
    api.patch<ImportLog>(`/import-log/${id}/`, data),

  /**
   * 删除导入日志
   * DELETE /api/import-log/{id}/
   */
  delete: (id: number) => api.delete<void>(`/import-log/${id}/`),
};

export const exportLogApi = {
  /**
   * 获取导出日志列表
   * GET /api/export-log/
   */
  list: () => api.get<PaginationResponse<ExportLog>>('/export-log/'),

  /**
   * 获取导出日志详情
   * GET /api/export-log/{id}/
   */
  get: (id: number) => api.get<ExportLog>(`/export-log/${id}/`),

  /**
   * 创建导出日志
   * POST /api/export-log/
   */
  create: (data: Partial<ExportLog>) =>
    api.post<ExportLog>('/export-log/', data),

  /**
   * 更新导出日志
   * PUT /api/export-log/{id}/
   */
  update: (id: number, data: Partial<ExportLog>) =>
    api.put<ExportLog>(`/export-log/${id}/`, data),

  /**
   * 部分更新导出日志
   * PATCH /api/export-log/{id}/
   */
  patch: (id: number, data: Partial<ExportLog>) =>
    api.patch<ExportLog>(`/export-log/${id}/`, data),

  /**
   * 删除导出日志
   * DELETE /api/export-log/{id}/
   */
  delete: (id: number) => api.delete<void>(`/export-log/${id}/`),
};

export default {
  cookLogApi,
  viewLogApi,
  importLogApi,
  exportLogApi,
};
