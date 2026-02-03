// API 配置
const API_BASE_URL = import.meta.env.PUBLIC_API_URL || 'http://localhost:8000';
const API_TOKEN = import.meta.env.PUBLIC_API_TOKEN || '';

// 请求头配置
function getHeaders(): HeadersInit {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (API_TOKEN) {
    headers['Authorization'] = `Bearer ${API_TOKEN}`;
  }
  return headers;
}

// API 响应类型定义
export interface Unit {
  id: number;
  name: string;
}

export interface Food {
  id: number;
  name: string;
  description?: string;
}

export interface Ingredient {
  id: number;
  food: Food;
  unit: Unit;
  amount: number;
  note?: string;
}

export interface Step {
  id: number;
  name?: string;
  instruction: string;
  ingredients?: Ingredient[];
  time?: number;
  order: number;
}

export interface Nutrition {
  id: number;
  calories: number;
  proteins: number;
  fats: number;
  carbohydrates: number;
  source?: string;
}

export interface Recipe {
  id: number;
  name: string;
  description?: string;
  image?: string;
  servings: number;
  working_time?: number;
  waiting_time?: number;
  difficulty?: number | null;
  steps: Step[];
  nutrition?: Nutrition;
  created_at: string;
  updated_at: string;
}

export interface RecipeListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: RecipeListItem[];
}

export interface RecipeListItem {
  id: number;
  name: string;
  description?: string;
  image?: string;
  servings: number;
  working_time?: number;
  waiting_time?: number;
  difficulty?: number | null;
  rating?: number;
  keywords?: Keyword[];
}

export interface Keyword {
  id: number;
  name: string;
  label?: string;
  description?: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// 搜索参数接口
export interface SearchParams {
  query?: string;
  keywords?: string[];
  foods?: string[];
  sort_order?: string;
  page?: number;
  page_size?: number;
}

// 获取菜谱列表
export async function getRecipes(page = 1, pageSize = 20): Promise<RecipeListResponse> {
  const response = await fetch(
    `${API_BASE_URL}/api/recipe/?page=${page}&page_size=${pageSize}`,
    { headers: getHeaders() }
  );
  if (!response.ok) throw new Error('Failed to fetch recipes');
  return response.json();
}

// 获取单个菜谱详情
export async function getRecipe(id: string): Promise<Recipe> {
  const response = await fetch(`${API_BASE_URL}/api/recipe/${id}/`, {
    headers: getHeaders(),
  });
  if (!response.ok) throw new Error('Failed to fetch recipe');
  return response.json();
}

// 从步骤中提取所有食材（去重）
export function extractIngredients(steps: Step[]): Ingredient[] {
  const ingredientMap = new Map<string, Ingredient>();

  steps.forEach((step) => {
    step.ingredients?.forEach((ing) => {
      // 使用 food.id + amount + unit.id 作为唯一键
      const key = `${ing.food?.id}-${ing.amount}-${ing.unit?.id}`;
      if (!ingredientMap.has(key)) {
        ingredientMap.set(key, ing);
      }
    });
  });

  return Array.from(ingredientMap.values());
}

// 格式化时间
export function formatTime(minutes?: number): string {
  if (!minutes) return '';
  if (minutes < 60) return `${minutes}分钟`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}小时${mins}分钟` : `${hours}小时`;
}

// ========== 搜索相关 API ==========

// 搜索菜谱
export async function searchRecipes(params: SearchParams): Promise<RecipeListResponse> {
  const queryParams = new URLSearchParams();

  // 构建查询参数
  if (params.query) queryParams.append('query', params.query);
  if (params.keywords?.length) {
    params.keywords.forEach(k => queryParams.append('keywords_or', k));
  }
  if (params.foods?.length) {
    params.foods.forEach(f => queryParams.append('foods_or', f));
  }
  if (params.sort_order) queryParams.append('sort_order', params.sort_order);
  queryParams.append('page', String(params.page || 1));
  queryParams.append('page_size', String(params.page_size || 20));

  const url = `${API_BASE_URL}/api/recipe/?${queryParams.toString()}`;
  console.log('Search URL:', url);

  const response = await fetch(url, { headers: getHeaders() });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Search failed:', response.status, errorText);
    throw new Error(`搜索失败: ${response.status}`);
  }

  return response.json();
}

// 获取标签列表
export async function getKeywords(page = 1, pageSize = 100): Promise<PaginatedResponse<Keyword>> {
  const response = await fetch(
    `${API_BASE_URL}/api/keyword/?page=${page}&page_size=${pageSize}`,
    { headers: getHeaders() }
  );

  if (!response.ok) throw new Error('Failed to fetch keywords');
  return response.json();
}

// 获取食材列表
export async function getFoods(page = 1, pageSize = 100): Promise<PaginatedResponse<Food>> {
  const response = await fetch(
    `${API_BASE_URL}/api/food/?page=${page}&page_size=${pageSize}`,
    { headers: getHeaders() }
  );

  if (!response.ok) throw new Error('Failed to fetch foods');
  return response.json();
}
