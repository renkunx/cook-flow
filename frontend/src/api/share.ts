/**
 * 分享相关 API 服务
 * 对应后端 ShareLink, InviteLink
 */

import { api } from './client';
import { ShareLink, InviteLink, PaginationResponse } from '@/types/api';

export const shareLinkApi = {
  /**
   * 获取分享链接列表
   * GET /api/share-link/
   */
  list: () => api.get<PaginationResponse<ShareLink>>('/share-link/'),

  /**
   * 获取分享链接详情
   * GET /api/share-link/{id}/
   */
  get: (id: number) => api.get<ShareLink>(`/share-link/${id}/`),

  /**
   * 创建分享链接
   * POST /api/share-link/
   */
  create: (data: Partial<ShareLink>) =>
    api.post<ShareLink>('/share-link/', data),

  /**
   * 更新分享链接
   * PUT /api/share-link/{id}/
   */
  update: (id: number, data: Partial<ShareLink>) =>
    api.put<ShareLink>(`/share-link/${id}/`, data),

  /**
   * 部分更新分享链接
   * PATCH /api/share-link/{id}/
   */
  patch: (id: number, data: Partial<ShareLink>) =>
    api.patch<ShareLink>(`/share-link/${id}/`, data),

  /**
   * 删除分享链接
   * DELETE /api/share-link/{id}/
   */
  delete: (id: number) => api.delete<void>(`/share-link/${id}/`),
};

export const inviteLinkApi = {
  /**
   * 获取邀请链接列表
   * GET /api/invite-link/
   */
  list: () => api.get<PaginationResponse<InviteLink>>('/invite-link/'),

  /**
   * 获取邀请链接详情
   * GET /api/invite-link/{id}/
   */
  get: (id: number) => api.get<InviteLink>(`/invite-link/${id}/`),

  /**
   * 创建邀请链接
   * POST /api/invite-link/
   */
  create: (data: Partial<InviteLink>) =>
    api.post<InviteLink>('/invite-link/', data),

  /**
   * 更新邀请链接
   * PUT /api/invite-link/{id}/
   */
  update: (id: number, data: Partial<InviteLink>) =>
    api.put<InviteLink>(`/invite-link/${id}/`, data),

  /**
   * 部分更新邀请链接
   * PATCH /api/invite-link/{id}/
   */
  patch: (id: number, data: Partial<InviteLink>) =>
    api.patch<InviteLink>(`/invite-link/${id}/`, data),

  /**
   * 删除邀请链接
   * DELETE /api/invite-link/{id}/
   */
  delete: (id: number) => api.delete<void>(`/invite-link/${id}/`),
};

/**
 * 获取分享链接
 * GET /api/share-link/{pk}
 */
export const getShareLink = (pk: number) =>
  api.get<ShareLink>(`/share-link/${pk}`);

/**
 * 报告分享链接滥用
 * GET /abuse/{token}
 */
export const reportAbuse = (token: string) =>
  api.get(`/abuse/${token}`);

export default {
  shareLinkApi,
  inviteLinkApi,
  getShareLink,
  reportAbuse,
};
