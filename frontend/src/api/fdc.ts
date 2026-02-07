/**
 * FDC (FoodData Central) API 服务
 * 美国农业部食品数据中心
 */

import { api } from './client';

export interface FdcFood {
  fdcId: number;
  description: string;
  foodNutrients: {
    nutrientId: number;
    nutrientName: string;
    value: number;
    unitName: string;
  }[];
}

export const fdcApi = {
  /**
   * 搜索 FDC 食品
   * GET /api/fdc-search/
   */
  search: (params: { query: string; page?: number }) =>
    api.get<{
      foods: FdcFood[];
      totalHits: number;
    }>('/fdc-search/', { params }),

  /**
   * 更新食物的 FDC 数据
   * POST /api/food/{id}/fdc/
   */
  updateFood: (foodId: number, fdcId?: number) =>
    api.post(`/food/${foodId}/fdc/`, { fdc_id: fdcId }),
};

export default fdcApi;
