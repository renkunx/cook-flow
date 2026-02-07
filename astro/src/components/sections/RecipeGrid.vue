<script setup lang="ts">
import { computed } from 'vue';
import type { RecipeListItem } from '../../utils/api';
import Badge from '../ui/Badge.vue';
import Button from '../ui/Button.vue';

interface Props {
  recipes: RecipeListItem[];
  selectedIngredients?: string[];
  isLoading?: boolean;
  hasMore?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  selectedIngredients: () => [],
  isLoading: false,
  hasMore: true
});

const emit = defineEmits<{
  'load-more': [];
  'search': [query: string];
}>();

// Calculate recipe matches based on selected ingredients
const matchedRecipes = computed(() => {
  if (props.selectedIngredients.length === 0) {
    return props.recipes.map((r) => ({ ...r, matchPercentage: 0 }));
  }

  return props.recipes.map((recipe) => {
    const matchCount = props.selectedIngredients.filter((ing) =>
      recipe.name.toLowerCase().includes(ing.toLowerCase()) ||
      (recipe.description && recipe.description.toLowerCase().includes(ing.toLowerCase()))
    ).length;
    const matchPercentage = Math.min(Math.round((matchCount / Math.max(props.selectedIngredients.length, 1)) * 100), 100);
    return { ...recipe, matchPercentage };
  }).sort((a, b) => {
    const aMatch = (a as any).matchPercentage || 0;
    const bMatch = (b as any).matchPercentage || 0;
    return bMatch - aMatch;
  });
});

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

function formatTime(minutes?: number): string {
  if (!minutes) return '30分钟';
  if (minutes < 60) return `${minutes}分钟`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}小时${mins}分钟` : `${hours}小时`;
}

function navigateToRecipe(id: number) {
  window.location.href = `/recipe/${id}`;
}
</script>

<template>
  <section id="recipes" class="py-20" style="background: #FDF5E6;">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="text-center mb-12">
        <div class="inline-flex items-center gap-2 bg-white rounded-full px-4 py-2 mb-4 shadow-sm">
          <svg class="w-4 h-4" style="color: #E8913A;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
          </svg>
          <span class="text-sm font-medium" style="color: #E8913A;">推荐菜谱</span>
        </div>
        <h2 class="text-3xl md:text-4xl font-serif font-bold mb-4" style="color: #4A3728;">
          为你推荐的菜谱
        </h2>
        <p class="max-w-lg mx-auto" style="color: #6B5344;">
          {{ selectedIngredients.length > 0
            ? `基于你选择的 ${selectedIngredients.length} 种食材，为你推荐以下菜谱`
            : '浏览我们的精选菜谱，找到你的下一餐灵感'
          }}
        </p>
      </div>

      <!-- Recipe Grid -->
      <div v-if="recipes.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="(recipe, index) in matchedRecipes"
          :key="recipe.id"
          @click="navigateToRecipe(recipe.id)"
          :class="['group cursor-pointer animate-scale-in', `animate-delay-${Math.min(index * 100, 1200)}`]"
        >
          <div class="recipe-card bg-white rounded-2xl overflow-hidden">
            <!-- Image -->
            <div class="relative h-48 overflow-hidden image-container">
              <img
                :src="recipe.image || '/images/placeholder-recipe.jpg'"
                :alt="recipe.name"
                class="recipe-image w-full h-full object-cover"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent transition-opacity duration-300 group-hover:from-black/60" />

              <!-- Match Badge -->
              <div
                v-if="selectedIngredients.length > 0 && (recipe as any).matchPercentage && (recipe as any).matchPercentage > 0"
                class="absolute top-3 left-3 badge-wrapper"
              >
                <Badge class="bg-[#5A9A4F] text-white">
                  匹配度 {{ (recipe as any).matchPercentage }}%
                </Badge>
              </div>

              <!-- Difficulty Badge -->
              <div class="absolute bottom-3 left-3 badge-wrapper">
                <Badge :class="getDifficultyColor(recipe.difficulty)">
                  {{ getDifficultyText(recipe.difficulty) }}
                </Badge>
              </div>

              <!-- Time Badge -->
              <div class="absolute bottom-3 right-3 flex items-center gap-1 text-white text-sm">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {{ formatTime(recipe.working_time) }}
              </div>
            </div>

            <!-- Content -->
            <div class="p-5 content-wrapper">
              <h3 class="text-lg font-serif font-bold mb-2 recipe-title" style="color: #4A3728;">
                {{ recipe.name }}
              </h3>
              <p class="text-sm line-clamp-2 mb-4 description" style="color: #6B5344;">
                {{ recipe.description || '暂无描述' }}
              </p>

              <!-- Tags -->
              <div class="flex flex-wrap gap-1.5 mb-4 tags-container">
                <span
                  v-for="tag in recipe.keywords?.slice(0, 3)"
                  :key="tag.id"
                  class="text-xs px-2 py-1 rounded-full tag-pill"
                  style="background: #FFF8E7; color: #4A3728;"
                >
                  {{ tag.label || tag.name }}
                </span>
              </div>

              <!-- Footer -->
              <div class="flex items-center justify-between pt-4 footer-content" style="border-top-color: #F5E6D3;">
                <div class="flex items-center gap-4 text-sm stat-item" style="color: #6B5344;">
                  <span class="flex items-center gap-1">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
                    </svg>
                    {{ recipe.servings }}人份
                  </span>
                </div>
                <div class="font-medium text-sm flex items-center gap-1 cta-text" style="color: #E8913A;">
                  查看做法
                  <svg class="w-4 h-4" viewBox="0 0 24 24" style="color: #E8913A;">
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="flex justify-center py-12">
        <div class="flex flex-col items-center gap-4">
          <div class="w-10 h-10 border-4 rounded-full animate-spin" style="border-color: #F5E6D3; border-top-color: #E8913A;"></div>
          <p style="color: #6B5344;">加载中...</p>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else-if="recipes.length === 0" class="text-center py-20">
        <svg class="w-20 h-20 mx-auto mb-4" style="color: #E8913A; opacity: 0.3;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 class="text-xl font-semibold mb-2" style="color: #4A3728;">暂无菜谱</h3>
        <p style="color: #6B5344;">试试调整搜索条件</p>
      </div>

      <!-- Load More Button -->
      <div v-if="hasMore && recipes.length > 0" class="text-center mt-12">
        <Button
          @click="emit('load-more')"
          :disabled="isLoading"
          size="lg"
        >
          {{ isLoading ? '加载中...' : '加载更多' }}
        </Button>
      </div>
    </div>
  </section>
</template>

<style scoped>
@keyframes scale-in {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.animate-scale-in {
  animation: scale-in 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Recipe Card Styles */
.recipe-card {
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.04);
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  position: relative;
}

.recipe-card::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 1rem;
  padding: 2px;
  background: linear-gradient(135deg, #E8913A, #F5A623);
  opacity: 0;
  transition: opacity 0.4s ease;
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
  z-index: 1;
}

.recipe-card:hover::before {
  opacity: 1;
}

.recipe-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 8px 32px rgba(232, 145, 58, 0.2);
}

/* Image Container */
.image-container {
  position: relative;
  overflow: hidden;
}

.recipe-image {
  transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

.recipe-card:hover .recipe-image {
  transform: scale(1.15);
}

/* Badge Animation */
.badge-wrapper {
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.recipe-card:hover .badge-wrapper {
  transform: scale(1.05);
}

/* Content Wrapper */
.content-wrapper {
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

/* Title Animation */
.recipe-title {
  transition: color 0.3s ease, transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.recipe-card:hover .recipe-title {
  color: #E8913A;
  transform: translateX(4px);
}

/* Description Animation */
.description {
  transition: color 0.3s ease;
}

.recipe-card:hover .description {
  color: #4A3728;
}

/* Tag Pills */
.tag-pill {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.recipe-card:hover .tag-pill {
  background: #F5E6D3;
  transform: translateY(-2px);
}

/* Footer Content */
.footer-content {
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  border-top: 1px solid #F5E6D3;
}

/* Stat Items */
.stat-item {
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), color 0.3s ease;
}

.recipe-card:hover .stat-item {
  color: #E8913A;
}

/* CTA Text */
.cta-text {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.recipe-card:hover .cta-text {
  transform: translateX(8px);
  color: #F5A623;
}

/* Animation delays */
.animate-delay-0 { animation-delay: 0s; }
.animate-delay-100 { animation-delay: 0.1s; }
.animate-delay-200 { animation-delay: 0.2s; }
.animate-delay-300 { animation-delay: 0.3s; }
.animate-delay-400 { animation-delay: 0.4s; }
.animate-delay-500 { animation-delay: 0.5s; }
.animate-delay-600 { animation-delay: 0.6s; }
.animate-delay-700 { animation-delay: 0.7s; }
.animate-delay-800 { animation-delay: 0.8s; }
.animate-delay-900 { animation-delay: 0.9s; }
.animate-delay-1000 { animation-delay: 1s; }
.animate-delay-1100 { animation-delay: 1.1s; }
.animate-delay-1200 { animation-delay: 1.2s; }
</style>
