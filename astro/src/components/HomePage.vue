<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { searchRecipes, getKeywords, getFoods, type Keyword, type Food, type SearchParams } from '../utils/api';
import SearchBar from './SearchBar.vue';
import QuickTags from './QuickTags.vue';
import FilterPanel from './FilterPanel.vue';
import RecipeList from './RecipeList.vue';

interface Props {
  apiUrl: string;
  apiToken?: string;
}

const props = withDefaults(defineProps<Props>(), {
  apiToken: ''
});

// 从全局变量获取初始数据
const getInitialData = () => {
  if (typeof window !== 'undefined' && (window as any).__INITIAL_DATA__) {
    return (window as any).__INITIAL_DATA__;
  }
  return {
    initialRecipes: [],
    totalCount: 0
  };
};

const initialData = getInitialData();

// 搜索状态
const searchQuery = ref('');
const selectedKeywords = ref<number[]>([]);
const selectedFoods = ref<number[]>([]);
const sortOrder = ref('name');
const showFilters = ref(false);

// 筛选数据
const keywords = ref<Keyword[]>([]);
const foods = ref<Food[]>([]);
const isLoadingFilters = ref(false);

// 计算搜索参数
const searchParams = computed(() => {
  const params: SearchParams = {};
  if (searchQuery.value) params.query = searchQuery.value;
  if (selectedKeywords.value.length > 0) {
    params.keywords = selectedKeywords.value.map(String);
  }
  if (selectedFoods.value.length > 0) {
    params.foods = selectedFoods.value.map(String);
  }
  if (sortOrder.value !== 'name') {
    params.sort_order = sortOrder.value;
  }
  return Object.keys(params).length > 0 ? params : null;
});

// 监听搜索参数变化，自动展开筛选面板
watch(searchParams, (newParams) => {
  // 如果有筛选条件但面板未展开，则自动展开
  if (newParams && !showFilters.value) {
    const hasAdvancedFilters = selectedFoods.value.length > 0 || sortOrder.value !== 'name';
    if (hasAdvancedFilters) {
      showFilters.value = true;
    }
  }
}, { deep: true });

// 加载筛选数据
onMounted(async () => {
  console.log('HomePage mounted, loading filter data...');
  isLoadingFilters.value = true;
  try {
    const [kwData, foodData] = await Promise.all([
      getKeywords(1, 100),
      getFoods(1, 100)
    ]);
    keywords.value = kwData.results || [];
    foods.value = foodData.results || [];
    console.log('Filters loaded:', { keywords: keywords.value.length, foods: foods.value.length });
  } catch (error) {
    console.error('Failed to load filters:', error);
  } finally {
    isLoadingFilters.value = false;
  }
});

// 清空筛选
function clearFilters() {
  console.log('HomePage: clearFilters called');
  searchQuery.value = '';
  selectedKeywords.value = [];
  selectedFoods.value = [];
  sortOrder.value = 'name';
  showFilters.value = false;
}

// 切换筛选面板
function toggleFilters() {
  console.log('HomePage: toggleFilters called, current:', showFilters.value);
  showFilters.value = !showFilters.value;
}

// 计算是否有活动筛选
const hasActiveFilters = computed(() => {
  return searchQuery.value.length > 0 ||
         selectedKeywords.value.length > 0 ||
         selectedFoods.value.length > 0 ||
         sortOrder.value !== 'name';
});
</script>

<template>
  <div class="home-page">
    <!-- 页面标题 -->
    <div class="page-hero">
      <h1 class="page-title">家常美味</h1>
      <p class="page-subtitle">用心做好每一道菜，分享家的味道</p>
    </div>

    <!-- 顶部搜索栏 -->
    <SearchBar
      v-model="searchQuery"
      :show-filters="showFilters"
      @toggle-filters="toggleFilters"
    />

    <!-- 快速标签栏 -->
    <div v-if="isLoadingFilters" class="loading-filters">
      <div class="spinner-small"></div>
      <span>加载筛选条件...</span>
    </div>
    <QuickTags
      v-else-if="keywords.length > 0"
      v-model="selectedKeywords"
      :keywords="keywords"
    />

    <!-- 高级筛选面板 -->
    <FilterPanel
      v-if="foods.length > 0"
      :show="showFilters"
      :foods="foods"
      v-model:selected-foods="selectedFoods"
      v-model:sort-order="sortOrder"
      @clear-filters="clearFilters"
    />

    <!-- 菜谱列表 -->
    <RecipeList
      :initial-recipes="initialData.initialRecipes"
      :total-count="initialData.totalCount"
      :api-url="apiUrl"
      :api-token="apiToken"
      :search-params="searchParams"
    />
  </div>
</template>

<style scoped>
.home-page {
  max-width: 80rem;
  margin: 0 auto;
}

.page-hero {
  text-align: center;
  margin-bottom: 2rem;
  padding: 2rem 1rem;
  background: linear-gradient(135deg, #FFF0E6 0%, #FFF8F3 100%);
  border-radius: 1rem;
  border: 1px solid #FFE4D6;
}

.page-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #FF6B35;
  margin: 0 0 0.5rem 0;
}

.page-subtitle {
  font-size: 0.9375rem;
  color: #666666;
  margin: 0;
}

@media (min-width: 768px) {
  .home-page {
    padding: 0 1rem;
  }

  .page-title {
    font-size: 2rem;
  }

  .page-subtitle {
    font-size: 1rem;
  }
}

.loading-filters {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 1rem;
  color: #999;
  font-size: 0.875rem;
}

.spinner-small {
  width: 20px;
  height: 20px;
  border: 2px solid #F3F3F3;
  border-top: 2px solid #FF6B35;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
