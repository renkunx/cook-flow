<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { getRecipes, type RecipeListItem } from '../../utils/api';
import Navigation from '../sections/Navigation.vue';
import Hero from '../sections/Hero.vue';
import IngredientInput from '../sections/IngredientInput.vue';
import RecipeGrid from '../sections/RecipeGrid.vue';
import PopularRecipes from '../sections/PopularRecipes.vue';
import Community from '../sections/Community.vue';
import Footer from '../sections/Footer.vue';

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

// 选中的食材（用于冰箱功能）
const selectedIngredients = ref<string[]>([]);

// 菜谱数据
const recipes = ref<RecipeListItem[]>(initialData.initialRecipes || []);
const totalCount = ref(initialData.totalCount || 0);
const isLoading = ref(false);
const currentPage = ref(1);

// 加载更多菜谱
async function loadMoreRecipes() {
  if (isLoading.value) return;
  isLoading.value = true;
  try {
    const response = await getRecipes(currentPage.value + 1, 12);
    recipes.value.push(...response.results);
    totalCount.value = response.count;
    currentPage.value++;
  } catch (error) {
    console.error('Failed to load recipes:', error);
  } finally {
    isLoading.value = false;
  }
}

// 根据搜索查询获取菜谱
async function searchRecipes(query: string) {
  isLoading.value = true;
  try {
    const response = await fetch(`${props.apiUrl}/api/recipe/?query=${encodeURIComponent(query)}&page_size=20`, {
      headers: {
        'Content-Type': 'application/json',
        ...(props.apiToken && { 'Authorization': `Bearer ${props.apiToken}` })
      }
    });
    if (response.ok) {
      const data = await response.json();
      recipes.value = data.results;
      totalCount.value = data.count;
      currentPage.value = 1;
    }
  } catch (error) {
    console.error('Failed to search recipes:', error);
  } finally {
    isLoading.value = false;
  }
}

// 计算是否还有更多
const hasMore = computed(() => recipes.value.length < totalCount.value);
</script>

<template>
  <div class="min-h-screen bg-white">
    <Navigation />
    <main>
      <Hero />
      <IngredientInput v-model:selected-ingredients="selectedIngredients" />
      <RecipeGrid
        :recipes="recipes"
        :selected-ingredients="selectedIngredients"
        :is-loading="isLoading"
        :has-more="hasMore"
        @load-more="loadMoreRecipes"
        @search="searchRecipes"
      />
      <PopularRecipes :recipes="recipes.slice(0, 6)" />
      <Community />
    </main>
    <Footer />
  </div>
</template>
