/**
 * API 类型定义
 * 与后端 Django REST Framework API 对应
 */

// ==================== 通用类型 ====================

export interface PaginationResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  timestamp: string;
  results: T[];
}

export interface ApiError {
  error: boolean;
  msg: string;
}

// ==================== 用户相关 ====================

export interface User {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  display_name: string;
  is_staff: boolean;
  is_superuser: boolean;
  is_active: boolean;
}

export interface UserSpace {
  id: number;
  user: User;
  space: Space;
  groups: number[];
  internal_note: string | null;
}

export interface UserPreference {
  id: number;
  user: number;
  theme: string;
  nav_color: string;
  default_unit: number | null;
  default_page: string;
  search_style: string;
  show_recent: boolean;
  ingredient_decimals: number;
  use_fractions: boolean;
  use_kj: boolean;
  csv_delim: string;
  shopping_add_onhand: boolean;
  left_handed: boolean;
  nav_sticky: boolean;
  max_owned_spaces: number;
}

// ==================== Space 相关 ====================

export interface Space {
  id: number;
  name: string;
  created_by: User;
  created_at: string;
  max_recipes: number;
  max_file_storage_mb: number;
  max_users: number;
  allow_sharing: boolean;
  demo: boolean;
  internal_note: string | null;
  image: string | null;
  logo_color_128: string | null;
  logo_color_144: string | null;
  logo_color_152: string | null;
  logo_color_192: string | null;
  logo_color_384: string | null;
  logo_color_512: string | null;
  logo_color_72: string | null;
  logo_color_96: string | null;
  app_name: string | null;
  ai_enabled: boolean;
  ai_credits_balance: number;
  ai_credits_monthly: number;
  ai_default_provider: number | null;
  space_setup_completed: boolean;
}

// ==================== 食谱相关 ====================

export interface Recipe {
  id: number;
  name: string;
  description: string;
  image: string | null;
  servings: number;
  servings_text: string;
  working_time: number;
  waiting_time: number;
  source_url: string;
  internal: boolean;
  private: boolean;
  show_ingredient_overview: boolean;
  created_by: User;
  created_at: string;
  updated_at: string;
  keywords: Keyword[];
  steps: Step[];
  properties: Property[];
  shared: User[];
  nutrition: NutritionInformation | null;
}

export interface RecipeOverview {
  id: number;
  name: string;
  description: string;
  image: string | null;
  servings: number;
  working_time: number;
  waiting_time: number;
  created_by: User;
  keywords: Keyword[];
}

export interface RecipeSimple {
  id: number;
  name: string;
}

export interface Step {
  id: number;
  name: string;
  instruction: string;
  instruction_markdown: string;
  time: number;
  order: number;
  show_as_header: boolean;
  show_ingredients_table: boolean;
  ingredients: Ingredient[];
  file: UserFile | null;
}

export interface Ingredient {
  id: number;
  food: Food;
  unit: Unit | null;
  amount: number;
  amount_custom: number | null;
  note: string;
  original_text: string;
  always_use_plural_food: boolean;
}

export interface IngredientSimple {
  id: number;
  food: number;
  unit: number | null;
  amount: number;
}

// ==================== Food 相关 ====================

export interface Food {
  id: number;
  name: string;
  plural_name: string | null;
  description: string;
  url: string | null;
  recipe: RecipeSimple | null;
  supermarket_category: SupermarketCategory | null;
  ignore_shopping: boolean;
  onhand_users: User[];
  inherit_fields: FoodInheritField[];
  child_inherit_fields: FoodInheritField[];
  substitute: Food[];
  substitute_children: boolean;
  substitute_siblings: boolean;
  properties_food_amount: number;
  properties_food_unit: Unit | null;
  fdc_id: number | null;
  open_data_slug: string | null;
  shopping_status?: boolean;
  numrecipe?: number;
  recipe_image?: string | null;
}

export interface FoodSimple {
  id: number;
  name: string;
}

export interface FoodInheritField {
  id: number;
  name: string;
  field: string;
}

// ==================== Unit 相关 ====================

export interface Unit {
  id: number;
  name: string;
  plural_name: string | null;
  description: string;
  base_unit: string | null;
  open_data_slug: string | null;
}

export interface UnitConversion {
  id: number;
  food: Food | null;
  base_unit: Unit;
  converted_unit: Unit;
  base_amount: number;
  converted_amount: number;
  open_data_slug: string | null;
}

// ==================== Keyword 相关 ====================

export interface Keyword {
  id: number;
  name: string;
  description: string;
  numrecipe?: number;
  recipe_image?: string | null;
}

// ==================== 食谱书相关 ====================

export interface RecipeBook {
  id: number;
  name: string;
  description: string;
  created_by: User;
  shared: User[];
  order: number;
}

export interface RecipeBookEntry {
  id: number;
  book: RecipeBook;
  recipe: Recipe;
}

// ==================== 膳食计划相关 ====================

export interface MealPlan {
  id: number;
  recipe: Recipe | null;
  servings: number;
  note: string;
  from_date: string;
  to_date: string;
  meal_type: MealType;
  created_by: User;
  shared: User[];
}

export interface MealType {
  id: number;
  name: string;
  order: number;
  time: string | null;
  default: boolean;
}

export interface AutoMealPlanRequest {
  meal_type_id: number;
  keyword_ids: number[];
  servings: number;
  start_date: string;
  end_date: string;
  shared: number[];
  addshopping: boolean;
}

// ==================== 购物清单相关 ====================

export interface ShoppingList {
  id: number;
  name: string;
  description: string;
  created_by: User;
  shared: User[];
  supermarket: Supermarket | null;
  entries: ShoppingListEntry[];
  finished: boolean;
  created_at: string;
  updated_at: string;
}

export interface ShoppingListEntry {
  id: number;
  list_recipe: ShoppingListRecipe | null;
  food: Food;
  unit: Unit | null;
  amount: number;
  amount_decimal: number;
  order: number;
  checked: boolean;
  created_by: User;
  created_at: string;
  updated_at: string;
}

export interface ShoppingListRecipe {
  id: number;
  recipe: Recipe;
  servings: number;
  mealplan: MealPlan | null;
  created_by: User;
  entries: ShoppingListEntry[];
}

export interface ShoppingListEntryBulkCreate {
  entries: {
    food_id: number;
    unit_id: number | null;
    amount: number;
    ingredient_id: number | null;
  }[];
}

// ==================== 超市相关 ====================

export interface Supermarket {
  id: number;
  name: string;
  description: string;
}

export interface SupermarketCategory {
  id: number;
  name: string;
  description: string;
}

export interface SupermarketCategoryRelation {
  id: number;
  supermarket: Supermarket;
  category: SupermarketCategory;
  order: number;
}

// ==================== 属性相关 ====================

export interface PropertyType {
  id: number;
  name: string;
  description: string;
  unit: string | null;
  category: string;
  fdc_id: number | null;
  order: number;
}

export interface Property {
  id: number;
  property_type: PropertyType;
  property_amount: number;
  food: Food | null;
}

export interface NutritionInformation {
  id: number;
  fats: number;
  carbohydrates: number;
  proteins: number;
  calories: number;
}

// ==================== AI 相关 ====================

export interface AiProvider {
  id: number;
  name: string;
  provider: string;
  config: Record<string, any>;
  is_global: boolean;
}

export interface AiLog {
  id: number;
  created_at: string;
  feature: string;
  prompt_tokens: number;
  completion_tokens: number;
  cost: number;
}

// ==================== 其他 ====================

export interface UserFile {
  id: number;
  name: string;
  file: string;
  file_download: string;
  preview: string;
  file_size_kb: number;
  created_by: User;
  created_at: string;
}

export interface Storage {
  id: number;
  name: string;
  method: string;
  username: string;
  password: string;
  token: string;
  host_url: string;
  skip_ssl: boolean;
}

export interface Sync {
  id: number;
  storage: Storage;
  path: string;
  last_synced: string | null;
}

export interface SyncLog {
  id: number;
  sync: Sync;
  status: string;
  msg: string;
  created_at: string;
}

export interface ImportLog {
  id: number;
  type: string;
  msg: string;
  running: boolean;
  created_at: string;
}

export interface ExportLog {
  id: number;
  type: string;
  msg: string;
  created_at: string;
}

export interface ConnectorConfig {
  id: number;
  name: string;
  connector: string;
  config: Record<string, any>;
  supports_description_field: boolean;
}

export interface CustomFilter {
  id: number;
  name: string;
  search: string;
}

export interface CookLog {
  id: number;
  recipe: Recipe;
  rating: number;
  servings: number;
  comment: string;
  created_at: string;
  updated_at: string;
}

export interface ViewLog {
  id: number;
  recipe: Recipe;
  created_at: string;
}

export interface InviteLink {
  id: number;
  uuid: string;
  email: string | null;
  group: string;
  valid_until: string;
  used_by: User | null;
  reusable: boolean;
  internal_note: string | null;
}

export interface ShareLink {
  id: number;
  uuid: string;
  recipe: Recipe;
  note: string;
  created_by: User;
  request_count: number;
  abuse_blocked: boolean;
}

export interface Automation {
  id: number;
  name: string;
  type: string;
  config: Record<string, any>;
  order: number;
}

export interface SearchPreference {
  id: number;
  user: number;
  lookup: boolean;
  unaccent: number[];
  trigram: number[];
  icontains: number[];
  trigram_threshold: number;
}

export interface SearchFields {
  id: number;
  name: string;
  field: string;
}

// ==================== 请求类型 ====================

export interface RecipeSearchParams {
  query?: string;
  keywords?: number[];
  keywords_or?: number[];
  keywords_and?: number[];
  keywords_or_not?: number[];
  keywords_and_not?: number[];
  foods?: number[];
  foods_or?: number[];
  foods_and?: number[];
  foods_or_not?: number[];
  foods_and_not?: number[];
  books?: number[];
  books_or?: number[];
  books_and?: number[];
  books_or_not?: number[];
  books_and_not?: number[];
  units?: number;
  rating?: number;
  rating_gte?: number;
  rating_lte?: number;
  timescooked?: number;
  timescooked_gte?: number;
  timescooked_lte?: number;
  createdon?: string;
  createdon_gte?: string;
  createdon_lte?: string;
  updatedon?: string;
  updatedon_gte?: string;
  updatedon_lte?: string;
  cookedon_gte?: string;
  cookedon_lte?: string;
  viewedon_gte?: string;
  viewedon_lte?: string;
  createdby?: number;
  internal?: boolean;
  random?: boolean;
  sort_order?: string;
  new?: boolean;
  num_recent?: number;
  filter?: number;
  makenow?: boolean;
  page?: number;
  page_size?: number;
}

export interface RecipeBatchUpdate {
  recipes: number[];
  keywords_add?: number[];
  keywords_remove?: number[];
  keywords_set?: number[];
  keywords_remove_all?: boolean;
  working_time?: number;
  waiting_time?: number;
  servings?: number;
  servings_text?: string;
  private?: boolean;
  shared_add?: number[];
  shared_remove?: number[];
  shared_set?: number[];
  shared_remove_all?: boolean;
  clear_description?: boolean;
  show_ingredient_overview?: boolean;
}

export interface FoodBatchUpdate {
  foods: number[];
  category?: number | null;
  ignore_shopping?: boolean;
  on_hand?: boolean;
  substitute_children?: boolean;
  substitute_siblings?: boolean;
  substitute_add?: number[];
  substitute_remove?: number[];
  substitute_set?: number[];
  substitute_remove_all?: boolean;
  inherit_fields_add?: number[];
  inherit_fields_remove?: number[];
  inherit_fields_set?: number[];
  inherit_fields_remove_all?: boolean;
  child_inherit_fields_add?: number[];
  child_inherit_fields_remove?: number[];
  child_inherit_fields_set?: number[];
  child_inherit_fields_remove_all?: boolean;
  parent_remove?: boolean;
  parent_set?: number | null;
}

export interface RecipeFromSource {
  url?: string;
  data?: string;
  auto?: boolean;
  private?: boolean;
}

export interface RecipeFromSourceResponse {
  recipe: Recipe;
  mealie: boolean;
  nextcloud: boolean;
  recipekeeper: boolean;
  chowdown: boolean;
  saffron: boolean;
  paprika: boolean;
  plantoeat: boolean;
  tandoor: boolean;
  cookmate: boolean;
}

export interface AiImportRequest {
  image?: string;
  text?: string;
}

export interface FdcSearchParams {
  query: string;
  page?: number;
}

export interface Localization {
  count: number;
  locale: string;
}

export interface ServerSettings {
  debug: boolean;
  demo: boolean;
  version: string;
  allow_registration: boolean;
  ai_enabled: boolean;
  fdc_enabled: boolean;
  email_enabled: boolean;
}

export interface AccessToken {
  id: number;
  token: string;
  scope: string;
  expires: string;
}
