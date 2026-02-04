<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import type { Recipe, Ingredient as RecipeIngredient } from '../utils/api';
import Badge from './ui/Badge.vue';
import Button from './ui/Button.vue';
import Navigation from './sections/Navigation.vue';

interface Props {
  recipe: Recipe;
  ingredients: RecipeIngredient[];
}

const props = defineProps<Props>();

// 使用 props 作为初始值（SSR 兼容）
const recipe = ref<Recipe>(props.recipe);
const ingredients = ref<RecipeIngredient[]>(props.ingredients);

// 客户端挂载后，尝试从全局变量更新数据
onMounted(() => {
  if (typeof window !== 'undefined' && (window as any).__RECIPE_DATA__) {
    const data = (window as any).__RECIPE_DATA__;
    if (data.recipe) recipe.value = data.recipe;
    if (data.ingredients) ingredients.value = data.ingredients;
  }
});

// 计算属性
const totalTime = computed(() => {
  if (!recipe.value) return 0;
  const working = recipe.value.working_time || 0;
  const waiting = recipe.value.waiting_time || 0;
  return working + waiting;
});

function formatTime(minutes?: number): string {
  if (!minutes) return '30分钟';
  if (minutes < 60) return `${minutes}分钟`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}小时${mins}分钟` : `${hours}小时`;
}

function getDifficultyText(difficulty: number | null): string {
  if (difficulty === null) return '简单';
  if (difficulty <= 2) return '简单';
  if (difficulty <= 4) return '中等';
  return '困难';
}

function getDifficultyColor(difficulty: number | null): string {
  if (difficulty === null) return 'bg-green-100 text-green-700';
  if (difficulty <= 2) return 'bg-green-100 text-green-700';
  if (difficulty <= 4) return 'bg-yellow-100 text-yellow-700';
  return 'bg-red-100 text-red-700';
}

// 返回首页
function goBack() {
  window.location.href = '/';
}
</script>

<template>
  <div v-if="recipe" class="min-h-screen bg-white">
    <Navigation />

    <!-- Back Button -->
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-4">
      <button
        @click="goBack"
        class="flex items-center gap-2 text-[#2e5c41] hover:text-[#234a33] transition-colors"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        返回首页
      </button>
    </div>

    <!-- Hero Image -->
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
      <div class="relative h-64 md:h-96 rounded-3xl overflow-hidden shadow-2xl">
        <img
          :src="recipe.image || '/images/placeholder-recipe.jpg'"
          :alt="recipe.name || '菜谱'"
          class="w-full h-full object-cover"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        <!-- Title Overlay -->
        <div class="absolute bottom-0 left-0 right-0 p-6 md:p-10">
          <div class="flex flex-wrap items-center gap-3 mb-4">
            <Badge :class="getDifficultyColor(recipe.difficulty)">
              {{ getDifficultyText(recipe.difficulty) }}
            </Badge>
            <div class="flex items-center gap-1 text-white text-sm">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {{ formatTime(totalTime) }}
            </div>
            <div class="flex items-center gap-1 text-white text-sm">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
              </svg>
              {{ recipe.servings }}人份
            </div>
          </div>
          <h1 class="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-white">
            {{ recipe.name || '菜谱详情' }}
          </h1>
        </div>
      </div>
    </div>

    <!-- Description -->
    <div v-if="recipe.description" class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
      <p class="text-lg text-[#12262a]/70 leading-relaxed">
        {{ recipe.description }}
      </p>
    </div>

    <!-- Nutrition Info -->
    <div v-if="recipe.nutrition" class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
      <div class="bg-[#f6f6f6] rounded-2xl p-6">
        <h2 class="text-xl font-serif font-bold text-[#12262a] mb-4 flex items-center gap-2">
          <span class="w-8 h-8 rounded-full bg-[#e9f0ec] flex items-center justify-center text-[#2e5c41]">
            📊
          </span>
          营养信息
        </h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div class="text-center">
            <div class="text-2xl font-bold text-[#ff8a01]">{{ recipe.nutrition.calories }}</div>
            <div class="text-sm text-gray-500">卡路里</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-[#2e5c41]">{{ recipe.nutrition.proteins }}g</div>
            <div class="text-sm text-gray-500">蛋白质</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-[#2e5c41]">{{ recipe.nutrition.fats }}g</div>
            <div class="text-sm text-gray-500">脂肪</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-[#2e5c41]">{{ recipe.nutrition.carbohydrates }}g</div>
            <div class="text-sm text-gray-500">碳水</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Ingredients -->
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
      <div class="bg-white rounded-2xl p-6 border border-[#e9f0ec]">
        <h2 class="text-xl font-serif font-bold text-[#12262a] mb-4 flex items-center gap-2">
          <span class="w-8 h-8 rounded-full bg-[#e9f0ec] flex items-center justify-center text-[#2e5c41]">
            🥗
          </span>
          所需食材
          <span class="text-sm font-normal text-gray-400">({{ recipe.servings }}人份)</span>
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div
            v-for="(ing, idx) in ingredients"
            :key="idx"
            class="flex items-center gap-3 p-3 bg-[#f6f6f6] rounded-xl"
          >
            <span class="flex-shrink-0 w-6 h-6 rounded-full bg-[#2e5c41] text-white flex items-center justify-center text-xs font-bold">
              {{ idx + 1 }}
            </span>
            <div class="flex-1">
              <div class="font-medium text-[#12262a]">{{ ing.food?.name || '未知食材' }}</div>
              <div class="text-sm text-gray-500">
                {{ ing.amount }}{{ ing.unit?.name || '' }}
                <span v-if="ing.note" class="ml-1">({{ ing.note }})</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Steps -->
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
      <div class="bg-white rounded-2xl p-6 border border-[#e9f0ec]">
        <h2 class="text-xl font-serif font-bold text-[#12262a] mb-6 flex items-center gap-2">
          <span class="w-8 h-8 rounded-full bg-[#e9f0ec] flex items-center justify-center text-[#2e5c41]">
            👨‍🍳
          </span>
          烹饪步骤
        </h2>
        <div class="space-y-6">
          <div
            v-for="(step, idx) in recipe.steps || []"
            :key="step.id || idx"
            class="flex gap-4"
          >
            <span class="flex-shrink-0 w-10 h-10 rounded-full bg-[#2e5c41] text-white flex items-center justify-center font-bold text-lg shadow-lg shadow-[#2e5c41]/20">
              {{ idx + 1 }}
            </span>
            <div class="flex-1">
              <div v-if="step.name" class="font-semibold text-[#12262a] mb-2">{{ step.name }}</div>
              <p class="text-gray-700 leading-relaxed">{{ step.instruction }}</p>
              <div v-if="step.time" class="flex items-center gap-1 mt-2 text-sm text-gray-500">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {{ formatTime(step.time) }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- CTA -->
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
      <Button
        class="w-full bg-[#2e5c41] hover:bg-[#234a33] text-white rounded-full py-4 shadow-xl shadow-[#2e5c41]/30"
        @click="goBack"
      >
        浏览更多菜谱
      </Button>
    </div>
  </div>

  <!-- Loading State -->
  <div v-else class="min-h-screen bg-white flex items-center justify-center">
    <div class="flex flex-col items-center gap-4">
      <div class="w-12 h-12 border-4 border-gray-200 border-t-[#2e5c41] rounded-full animate-spin"></div>
      <p class="text-gray-500">加载中...</p>
    </div>
  </div>
</template>

<style scoped>
/* Add any additional animations if needed */
</style>
