/**
 * 导入导出相关 API 服务
 */

import { api } from './client';
import { Recipe, ImportLog, ExportLog, SyncLog } from '@/types/api';

export interface ImportResponse {
  msg: string;
  recipes?: Recipe[];
}

export const importExportApi = {
  /**
   * 从 URL 导入食谱
   * POST /api/recipe-from-source/
   */
  importFromSource: (data: {
    url?: string;
    data?: string;
    auto?: boolean;
    private?: boolean;
  }) => api.post<Recipe>('/recipe-from-source/', data),

  /**
   * AI 导入食谱
   * POST /api/ai-import/
   */
  aiImport: (data: { image?: string; text?: string }) =>
    api.post<Recipe>('/ai-import/', data),

  /**
   * 导入应用数据
   * POST /api/import/
   */
  importData: (data: FormData) =>
    api.post<ImportLog>('/import/', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  /**
   * 导出应用数据
   * POST /api/export/
   */
  exportData: (data: {
    type: string;
    recipes?: number[];
  }) => api.post<ExportLog>('/export/', data),

  /**
   * 同步所有存储
   * POST /api/sync_all/
   */
  syncAll: () => api.post<{ msg: string }>('/sync_all/'),

  /**
   * 查询同步文件夹
   * POST /api/sync/{id}/query_synced_folder/
   */
  querySyncFolder: (syncId: number) =>
    api.post<SyncLog>(`/sync/${syncId}/query_synced_folder/`),

  /**
   * 导入开放数据
   * POST /api/import-open-data/
   */
  importOpenData: (data: {
    type: string;
    filter?: string;
  }) => api.post('/import-open-data/', data),

  /**
   * 重置食物继承
   * POST /api/reset-food-inheritance/
   */
  resetFoodInheritance: () =>
    api.post('/reset-food-inheritance/'),

  /**
   * 获取外部文件链接
   * GET /api/get_external_file_link/{pk}/
   */
  getExternalFileLink: (pk: number) =>
    api.get<string>(`/get_external_file_link/${pk}/`),

  /**
   * 获取食谱文件
   * GET /api/get_recipe_file/{pk}/
   */
  getRecipeFile: (pk: number) =>
    api.get<Blob>(`/get_recipe_file/${pk}/`, { responseType: 'blob' }),

  /**
   * 下载文件
   * GET /api/download-file/{file_id}/
   */
  downloadFile: (fileId: number) =>
    api.get<Blob>(`/download-file/${fileId}/`, { responseType: 'blob' }),
};

export default importExportApi;
