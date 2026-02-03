<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, computed } from 'vue';
import RecipeCard from './RecipeCard.vue';
import { getRecipes, searchRecipes, type RecipeListItem, type SearchParams } from '../utils/api';

interface Props {
  initialRecipes?: RecipeListItem[];
  totalCount?: number;
  apiUrl: string;
  apiToken?: string;
  searchParams?: SearchParams | null;
}

const props = withDefaults(defineProps<Props>(), {
  initialRecipes: () => [],
  totalCount: 0,
  apiToken: '',
  searchParams: undefined
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
const parsedInitialRecipes = props.initialRecipes || initialData.initialRecipes || [];
const parsedTotalCount = props.totalCount || initialData.totalCount || 0;

// 调试信息
console.log('RecipeList props:', props);
console.log('Global data:', initialData);
console.log('parsedInitialRecipes:', parsedInitialRecipes);
console.log('parsedTotalCount:', parsedTotalCount);

// 响应式状态
const recipes = ref<RecipeListItem[]>([...parsedInitialRecipes]);
const isLoading = ref(false);
const hasMore = ref(recipes.value.length < parsedTotalCount);
const currentPage = ref(1);
const pageSize = 20;

// 判断是否处于搜索模式
const isSearchMode = computed(() => props.searchParams !== null && props.searchParams !== undefined);

// 监听 recipes 变化
watch(recipes, (newRecipes) => {
  console.log('recipes updated:', newRecipes.length);
});

// 监听搜索参数变化
watch(() => props.searchParams, async (newParams, oldParams) => {
  // 只在搜索参数真正变化时重新加载
  if (JSON.stringify(newParams) !== JSON.stringify(oldParams)) {
    console.log('Search params changed:', newParams);
    currentPage.value = 1;
    recipes.value = [];
    hasMore.value = true;
    await loadRecipes();
  }
}, { deep: true });

// 加载菜谱（支持搜索和普通列表模式）
async function loadRecipes() {
  if (isLoading.value) return;

  isLoading.value = true;
  try {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (props.apiToken) {
      headers['Authorization'] = `Bearer ${props.apiToken}`;
    }

    let response: Response;
    let data: any;

    if (isSearchMode.value && props.searchParams) {
      // 搜索模式
      const params: SearchParams = {
        ...props.searchParams,
        page: currentPage.value,
        page_size: pageSize
      };
      data = await searchRecipes(params);
      console.log('Search results:', data);
    } else {
      // 普通列表模式
      response = await fetch(
        `${props.apiUrl}/api/recipe/?page=${currentPage.value}&page_size=${pageSize}`,
        { headers }
      );

      if (!response.ok) throw new Error('Failed to load recipes');
      data = await response.json();
    }

    if (currentPage.value === 1) {
      recipes.value = data.results || [];
    } else {
      recipes.value.push(...(data.results || []));
    }

    hasMore.value = recipes.value.length < (data.count || 0);
  } catch (error) {
    console.error('Error loading recipes:', error);
    currentPage.value--; // 回退页码
  } finally {
    isLoading.value = false;
  }
}

// 加载更多
async function loadMore() {
  if (isLoading.value || !hasMore.value) return;

  currentPage.value++;
  await loadRecipes();
}

// IntersectionObserver
let observer: IntersectionObserver | null = null;
const loadingTrigger = ref<HTMLElement | null>(null);

onMounted(() => {
  observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting && hasMore.value && !isLoading.value) {
        loadMore();
      }
    },
    { rootMargin: '100px', threshold: 0.1 }
  );

  if (loadingTrigger.value) {
    observer.observe(loadingTrigger.value);
  }
});

onUnmounted(() => {
  observer?.disconnect();
});
</script>

<template>
  <div id="recipe-container">
    <div id="recipe-grid" class="recipe-grid">
      <RecipeCard
        v-for="recipe in recipes"
        :key="recipe.id"
        :recipe="recipe"
      />
    </div>

    <div ref="loadingTrigger" class="loading-trigger"></div>

    <div v-if="isLoading" class="loading-spinner">
      <div class="spinner"></div>
      <p>加载中...</p>
    </div>

    <div v-if="!hasMore && recipes.length > 0" class="loaded-all">
      已加载全部菜谱
    </div>

    <!-- 调试信息 -->
    <!-- <div style="padding: 1rem; background: #f0f0f0; margin-top: 1rem;">
      <p>Recipes: {{ recipes.length }}</p>
      <p>Total Count: {{ totalCount }}</p>
      <p>Has More: {{ hasMore }}</p>
    </div> -->
  </div>
</template>

<style scoped>
#recipe-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 1rem;
}

.loading-trigger {
  height: 20px;
  margin-top: 2rem;
}

.loading-spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 2rem;
  color: #666;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #FF6B35;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loaded-all {
  text-align: center;
  padding: 2rem;
  color: #999;
  font-size: 0.875rem;
}

@media (min-width: 640px) {
  #recipe-grid {
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 2rem;
    padding: 0 2rem;
  }
}

@media (min-width: 1024px) {
  #recipe-grid {
    grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
    gap: 2rem;
  }
}
</style>
