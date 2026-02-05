export interface Ingredient {
  id: string;
  name: string;
  category: 'vegetable' | 'meat' | 'seafood' | 'dairy' | 'grain' | 'fruit' | 'spice' | 'other';
  icon?: string;
}

export interface Recipe {
  id: string;
  title: string;
  description: string;
  image: string;
  cookTime: number;
  calories: number;
  difficulty: 'easy' | 'medium' | 'hard';
  ingredients: string[];
  instructions: string[];
  tags: string[];
  matchCount?: number;
}

export interface User {
  id: string;
  name: string;
  avatar: string;
  comment: string;
}

export interface CookingSchedule {
  id: string;
  recipeId: string;
  recipeTitle: string;
  recipeImage: string;
  plannedDate: string;
  plannedTime: string;
  servings: number;
}

export interface ShoppingItem {
  id: string;
  name: string;
  category: CategoryType;
  quantity: number;
  unit: string;
  checked: boolean;
  recipeId?: string;
  recipeTitle?: string;
}

export type CategoryType = Ingredient['category'];

export const categoryLabels: Record<CategoryType, string> = {
  vegetable: '蔬菜',
  meat: '肉类',
  seafood: '海鲜',
  dairy: '乳制品',
  grain: '主食',
  fruit: '水果',
  spice: '调味品',
  other: '其他',
};

export const categoryIcons: Record<CategoryType, string> = {
  vegetable: '🥬',
  meat: '🥩',
  seafood: '🐟',
  dairy: '🥛',
  grain: '🍚',
  fruit: '🍎',
  spice: '🧂',
  other: '📦',
};
