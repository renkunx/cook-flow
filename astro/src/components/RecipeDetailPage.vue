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
  if (difficulty === null) return 'bg-[#5A9A4F]/10 text-[#5A9A4F]';
  if (difficulty <= 2) return 'bg-[#5A9A4F]/10 text-[#5A9A4F]';
  if (difficulty <= 4) return 'bg-[#E8913A]/10 text-[#E8913A]';
  return 'bg-[#E85D4C]/10 text-[#E85D4C]';
}

// 返回首页
function goBack() {
  window.location.href = '/';
}
</script>

<template>
  <div v-if="recipe" style="min-height: 100vh; background: #FFF8E7;">
    <Navigation />

    <!-- Back Button -->
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-4">
      <button
        @click="goBack"
        class="flex items-center gap-2 transition-colors"
        style="color: #E8913A;"
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
      <p class="text-lg leading-relaxed" style="color: #6B5344;">
        {{ recipe.description }}
      </p>
    </div>

    <!-- Nutrition Info -->
    <div v-if="recipe.nutrition" class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
      <div class="rounded-2xl p-6" style="background: #FFF8E7;">
        <h2 class="text-xl font-serif font-bold mb-4 flex items-center gap-2" style="color: #4A3728;">
          <span class="w-8 h-8 rounded-full flex items-center justify-center" style="background: rgba(232, 145, 58, 0.1);">
            <span style="color: #E8913A;">📊</span>
          </span>
          营养信息
        </h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div class="text-center">
            <div class="text-2xl font-bold" style="color: #F5A623;">{{ recipe.nutrition.calories }}</div>
            <div class="text-sm" style="color: #6B5344;">卡路里</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold" style="color: #5A9A4F;">{{ recipe.nutrition.proteins }}g</div>
            <div class="text-sm" style="color: #6B5344;">蛋白质</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold" style="color: #E8913A;">{{ recipe.nutrition.fats }}g</div>
            <div class="text-sm" style="color: #6B5344;">脂肪</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold" style="color: #F5A623;">{{ recipe.nutrition.carbohydrates }}g</div>
            <div class="text-sm" style="color: #6B5344;">碳水</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Ingredients -->
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
      <div class="bg-white rounded-2xl p-6 shadow-warm" style="border: 1px solid #F5E6D3;">
        <h2 class="text-xl font-serif font-bold mb-4 flex items-center gap-2" style="color: #4A3728;">
          <span class="w-8 h-8 rounded-full flex items-center justify-center" style="background: #FFF8E7;">
            <span style="color: #E8913A;">🥗</span>
          </span>
          所需食材
          <span class="text-sm font-normal" style="color: #6B5344;">({{ recipe.servings }}人份)</span>
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div
            v-for="(ing, idx) in ingredients"
            :key="idx"
            class="flex items-center gap-3 p-3 rounded-xl"
            style="background: #FFF8E7;"
          >
            <span class="flex-shrink-0 w-6 h-6 rounded-full text-white flex items-center justify-center text-xs font-bold" style="background: #E8913A;">
              {{ idx + 1 }}
            </span>
            <div class="flex-1">
              <div class="font-medium" style="color: #4A3728;">{{ ing.food?.name || '未知食材' }}</div>
              <div class="text-sm" style="color: #6B5344;">
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
      <div class="bg-white rounded-2xl p-6 shadow-warm" style="border: 1px solid #F5E6D3;">
        <h2 class="text-xl font-serif font-bold mb-6 flex items-center gap-2" style="color: #4A3728;">
          <span class="w-8 h-8 rounded-full flex items-center justify-center" style="background: #FFF8E7;">
            <span style="color: #E8913A;">👨‍🍳</span>
          </span>
          烹饪步骤
        </h2>
        <div class="space-y-6">
          <div
            v-for="(step, idx) in recipe.steps || []"
            :key="step.id || idx"
            class="flex gap-4"
          >
            <span class="flex-shrink-0 w-10 h-10 rounded-full text-white flex items-center justify-center font-bold text-lg" style="background: #E8913A;">
              {{ idx + 1 }}
            </span>
            <div class="flex-1">
              <div v-if="step.name" class="font-semibold mb-2" style="color: #4A3728;">{{ step.name }}</div>
              <p class="leading-relaxed" style="color: #6B5344;">{{ step.instruction }}</p>
              <div v-if="step.time" class="flex items-center gap-1 mt-2 text-sm" style="color: #6B5344;">
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
        size="lg"
        class="w-full"
        @click="goBack"
      >
        浏览更多菜谱
      </Button>
    </div>
  </div>

  <!-- Loading State -->
  <div v-else class="min-h-screen bg-white flex items-center justify-center">
    <div class="flex flex-col items-center gap-4">
      <div class="w-12 h-12 border-4 rounded-full animate-spin" style="border-color: #F5E6D3; border-top-color: #E8913A;"></div>
      <p style="color: #6B5344;">加载中...</p>
    </div>
  </div>
</template>

<style scoped>
/* Add any additional animations if needed */
</style>
