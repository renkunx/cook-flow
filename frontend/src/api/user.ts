/**
 * 用户相关 API 服务
 * 对应后端 UserViewSet, UserSpaceViewSet, UserPreferenceViewSet, SpaceViewSet
 */

import { api } from './client';
import {
  User,
  UserSpace,
  UserPreference,
  Space,
  Group,
  PaginationResponse,
} from '@/types/api';

export const userApi = {
  /**
   * 获取用户列表
   * GET /api/user/
   */
  list: (params?: { filter_list?: string }) =>
    api.get<User[]>('/user/', { params }),

  /**
   * 获取用户详情
   * GET /api/user/{id}/
   */
  get: (id: number) => api.get<User>(`/user/${id}/`),

  /**
   * 更新用户
   * PUT /api/user/{id}/
   */
  update: (id: number, data: Partial<User>) =>
    api.put<User>(`/user/${id}/`, data),

  /**
   * 部分更新用户
   * PATCH /api/user/{id}/
   */
  patch: (id: number, data: Partial<User>) =>
    api.patch<User>(`/user/${id}/`, data),
};

export const userSpaceApi = {
  /**
   * 获取用户空间列表
   * GET /api/user-space/
   */
  list: (params?: { internal_note?: string }) =>
    api.get<PaginationResponse<UserSpace>>('/user-space/', { params }),

  /**
   * 获取用户空间详情
   * GET /api/user-space/{id}/
   */
  get: (id: number) => api.get<UserSpace>(`/user-space/${id}/`),

  /**
   * 更新用户空间
   * PUT /api/user-space/{id}/
   */
  update: (id: number, data: Partial<UserSpace>) =>
    api.put<UserSpace>(`/user-space/${id}/`, data),

  /**
   * 部分更新用户空间
   * PATCH /api/user-space/{id}/
   */
  patch: (id: number, data: Partial<UserSpace>) =>
    api.patch<UserSpace>(`/user-space/${id}/`, data),

  /**
   * 删除用户空间
   * DELETE /api/user-space/{id}/
   */
  delete: (id: number) => api.delete<void>(`/user-space/${id}/`),

  /**
   * 获取所有个人空间
   * GET /api/user-space/all_personal/
   */
  getAllPersonal: () => api.get<UserSpace[]>('/user-space/all_personal/'),
};

export const userPreferenceApi = {
  /**
   * 获取用户偏好设置
   * GET /api/user-preference/
   */
  list: () => api.get<UserPreference[]>('/user-preference/'),

  /**
   * 获取用户偏好设置详情
   * GET /api/user-preference/{id}/
   */
  get: (id: number) => api.get<UserPreference>(`/user-preference/${id}/`),

  /**
   * 部分更新用户偏好设置
   * PATCH /api/user-preference/{id}/
   */
  patch: (id: number, data: Partial<UserPreference>) =>
    api.patch<UserPreference>(`/user-preference/${id}/`, data),
};

export const spaceApi = {
  /**
   * 获取空间列表
   * GET /api/space/
   */
  list: () => api.get<PaginationResponse<Space>>('/space/'),

  /**
   * 获取空间详情
   * GET /api/space/{id}/
   */
  get: (id: number) => api.get<Space>(`/space/${id}/`),

  /**
   * 创建空间
   * POST /api/space/
   */
  create: (data: Partial<Space>) => api.post<Space>('/space/', data),

  /**
   * 更新空间
   * PUT /api/space/{id}/
   */
  update: (id: number, data: Partial<Space>) =>
    api.put<Space>(`/space/${id}/`, data),

  /**
   * 部分更新空间
   * PATCH /api/space/{id}/
   */
  patch: (id: number, data: Partial<Space>) =>
    api.patch<Space>(`/space/${id}/`, data),

  /**
   * 获取当前空间
   * GET /api/space/current/
   */
  getCurrent: () => api.get<Space>('/space/current/'),
};

export const groupApi = {
  /**
   * 获取用户组列表
   * GET /api/group/
   */
  list: () => api.get<Group[]>('/group/'),
};

export default {
  userApi,
  userSpaceApi,
  userPreferenceApi,
  spaceApi,
  groupApi,
};
