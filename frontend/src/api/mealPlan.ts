/**
 * 膳食计划相关 API 服务
 * 对应后端 MealPlanViewSet 和 AutoPlanViewSet
 */

import { api } from './client';
import {
  MealPlan,
  MealType,
  AutoMealPlanRequest,
  PaginationResponse,
} from '@/types/api';

export const mealPlanApi = {
  /**
   * 获取膳食计划列表
   * GET /api/meal-plan/
   */
  list: (params?: {
    from_date?: string;
    to_date?: string;
    meal_type?: number[];
  }) => api.get<PaginationResponse<MealPlan>>('/meal-plan/', { params }),

  /**
   * 获取膳食计划详情
   * GET /api/meal-plan/{id}/
   */
  get: (id: number) => api.get<MealPlan>(`/meal-plan/${id}/`),

  /**
   * 创建膳食计划
   * POST /api/meal-plan/
   */
  create: (data: Partial<MealPlan>) => api.post<MealPlan>('/meal-plan/', data),

  /**
   * 更新膳食计划
   * PUT /api/meal-plan/{id}/
   */
  update: (id: number, data: Partial<MealPlan>) =>
    api.put<MealPlan>(`/meal-plan/${id}/`, data),

  /**
   * 部分更新膳食计划
   * PATCH /api/meal-plan/{id}/
   */
  patch: (id: number, data: Partial<MealPlan>) =>
    api.patch<MealPlan>(`/meal-plan/${id}/`, data),

  /**
   * 删除膳食计划
   * DELETE /api/meal-plan/{id}/
   */
  delete: (id: number) => api.delete<void>(`/meal-plan/${id}/`),

  /**
   * 导出 iCal
   * GET /api/meal-plan/ical/
   */
  getIcal: (params?: { from_date?: string; to_date?: string }) =>
    api.get<string>('/meal-plan/ical/', { params }),

  /**
   * 自动生成膳食计划
   * POST /api/auto-plan/
   */
  autoPlan: (data: AutoMealPlanRequest) =>
    api.post<AutoMealPlanRequest>('/auto-plan/', data),
};

export const mealTypeApi = {
  /**
   * 获取膳食类型列表
   * GET /api/meal-type/
   */
  list: () => api.get<PaginationResponse<MealType>>('/meal-type/'),

  /**
   * 获取膳食类型详情
   * GET /api/meal-type/{id}/
   */
  get: (id: number) => api.get<MealType>(`/meal-type/${id}/`),

  /**
   * 创建膳食类型
   * POST /api/meal-type/
   */
  create: (data: Partial<MealType>) => api.post<MealType>('/meal-type/', data),

  /**
   * 更新膳食类型
   * PUT /api/meal-type/{id}/
   */
  update: (id: number, data: Partial<MealType>) =>
    api.put<MealType>(`/meal-type/${id}/`, data),

  /**
   * 部分更新膳食类型
   * PATCH /api/meal-type/{id}/
   */
  patch: (id: number, data: Partial<MealType>) =>
    api.patch<MealType>(`/meal-type/${id}/`, data),

  /**
   * 删除膳食类型
   * DELETE /api/meal-type/{id}/
   */
  delete: (id: number) => api.delete<void>(`/meal-type/${id}/`),

  /**
   * 获取级联删除信息
   * GET /api/meal-type/{id}/cascading/
   */
  getCascading: (id: number, cache?: boolean) =>
    api.get(`/meal-type/${id}/cascading/`, { params: { cache } }),

  /**
   * 获取阻止删除的信息
   * GET /api/meal-type/{id}/protecting/
   */
  getProtecting: (id: number, cache?: boolean) =>
    api.get(`/meal-type/${id}/protecting/`, { params: { cache } }),

  /**
   * 获取置空删除信息
   * GET /api/meal-type/{id}/nulling/
   */
  getNulling: (id: number, cache?: boolean) =>
    api.get(`/meal-type/${id}/nulling/`, { params: { cache } }),
};

export default { mealPlanApi, mealTypeApi };
