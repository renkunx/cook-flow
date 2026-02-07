/**
 * 认证相关 API 服务
 */

import { api } from './client';
import { User } from '@/types/api';

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface TokenResponse {
  token: string;
  user: User;
}

export const authApi = {
  /**
   * 用户名密码登录
   * POST /api-token-auth/
   */
  login: (credentials: LoginCredentials) =>
    api.post<TokenResponse>('/api-token-auth/', credentials),

  /**
   * 使用邀请链接注册
   * GET /invite/{token}/
   */
  acceptInvite: (token: string) =>
    api.get<void>(`/invite/${token}/`),

  /**
   * 切换当前空间
   * POST /api/switch-active-space/{space_id}/
   */
  switchSpace: (spaceId: number) =>
    api.post<void>(`/api/switch-active-space/${spaceId}/`),

  /**
   * 设置 token
   */
  setToken: (token: string) => {
    localStorage.setItem('api_token', token);
  },

  /**
   * 清除 token
   */
  clearToken: () => {
    localStorage.removeItem('api_token');
  },

  /**
   * 获取当前 token
   */
  getToken: () => localStorage.getItem('api_token'),

  /**
   * 检查是否已登录
   */
  isAuthenticated: () => !!localStorage.getItem('api_token'),
};

export default authApi;
