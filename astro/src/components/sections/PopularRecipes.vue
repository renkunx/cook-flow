<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import type { RecipeListItem } from '../../utils/api';

interface Props {
  recipes: RecipeListItem[];
}

const props = defineProps<Props>();

const containerRef = ref<HTMLElement | null>(null);
const scrollProgress = ref(0);

function handleScroll() {
  if (!containerRef.value) return;
  const rect = containerRef.value.getBoundingClientRect();
  const windowHeight = window.innerHeight;

  // Calculate how much of the section has been scrolled through
  const sectionTop = rect.top;
  const sectionHeight = rect.height;
  const scrollableDistance = sectionHeight - windowHeight;

  // Calculate progress (0 to 1) as user scrolls through the section
  if (scrollableDistance > 0) {
    const scrolledIntoView = -sectionTop;
    scrollProgress.value = Math.max(0, Math.min(1, scrolledIntoView / scrollableDistance));
  } else {
    // Section is shorter than viewport, just check if it's in view
    scrollProgress.value = sectionTop < windowHeight && sectionTop + sectionHeight > 0 ? 1 : 0;
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});

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
  <section ref="containerRef" class="py-20 bg-white overflow-hidden">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <div class="inline-flex items-center gap-2 bg-[#fff3e0] rounded-full px-4 py-2 mb-4">
            <svg class="w-4 h-4 text-[#ff8a01]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            <span class="text-sm font-medium text-[#ff8a01]">热门菜谱</span>
          </div>
          <h2 class="text-3xl md:text-4xl font-serif font-bold text-[#12262a]">
            本周社区最爱
          </h2>
        </div>
        <p class="text-[#12262a]/60 max-w-md">
          看看大家都在做什么，发现更多美味灵感
        </p>
      </div>
    </div>

    <!-- Horizontal Scrolling Cards -->
    <div class="relative overflow-hidden">
      <div
        class="flex gap-6 px-4 sm:px-6 lg:px-8 cards-container"
        :style="{ transform: `translateX(${-scrollProgress * 15}%)` }"
      >
        <div
          v-for="(recipe, index) in [...recipes, ...recipes]"
          :key="`${recipe.id}-${index}`"
          @click="navigateToRecipe(recipe.id)"
          :class="['flex-shrink-0 w-80 group cursor-pointer animate-scale-in', `animate-delay-${Math.min(index * 100, 600)}`]"
        >
          <div class="recipe-card bg-[#f6f6f6] rounded-2xl overflow-hidden">
            <!-- Image -->
            <div class="relative h-56 overflow-hidden image-container">
              <img
                :src="recipe.image || '/images/placeholder-recipe.jpg'"
                :alt="recipe.name"
                class="recipe-image w-full h-full object-cover"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent transition-opacity duration-300 group-hover:from-black/60" />

              <!-- Rank Badge -->
              <div class="absolute top-4 left-4 badge-wrapper">
                <div class="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center">
                  <span class="text-lg font-bold text-[#ff8a01]">
                    {{ (index % recipes.length) + 1 }}
                  </span>
                </div>
              </div>

              <!-- Time -->
              <div class="absolute bottom-4 right-4 flex items-center gap-1 text-white text-sm">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {{ formatTime(recipe.working_time) }}
              </div>
            </div>

            <!-- Content -->
            <div class="p-5 content-wrapper">
              <h3 class="text-lg font-serif font-bold text-[#12262a] mb-2 recipe-title">
                {{ recipe.name }}
              </h3>
              <p class="text-sm text-gray-500 line-clamp-2 mb-4 description">
                {{ recipe.description || '暂无描述' }}
              </p>

              <div class="flex items-center justify-between footer-content">
                <div class="flex items-center gap-3 text-sm text-gray-500">
                  <span class="flex items-center gap-1 stat-item">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
                    </svg>
                    {{ recipe.servings }}人份
                  </span>
                </div>
                <div class="text-[#2e5c41] font-medium text-sm flex items-center gap-1 cta-text">
                  查看
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Gradient Overlays -->
      <div class="absolute top-0 left-0 bottom-0 w-32 bg-gradient-to-r from-white to-transparent pointer-events-none z-10" />
      <div class="absolute top-0 right-0 bottom-0 w-32 bg-gradient-to-l from-white to-transparent pointer-events-none z-10" />
    </div>

    <!-- View All Button -->
    <div class="text-center mt-12 animate-scale-in">
      <button @click="window.location.href='#recipes'" class="inline-flex items-center gap-2 text-[#2e5c41] font-medium hover:gap-3 transition-all">
        查看全部热门菜谱
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  </section>
</template>

<style scoped>
@keyframes scale-in {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.animate-scale-in {
  animation: scale-in 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Recipe Card Styles */
.recipe-card {
  box-shadow: 0 1px 3px rgba(18, 38, 42, 0.08), 0 1px 2px rgba(18, 38, 42, 0.04);
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  position: relative;
}

.recipe-card::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 1rem;
  padding: 2px;
  background: linear-gradient(135deg, #ff8a01, #2e5c41);
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
  box-shadow:
    0 20px 40px rgba(18, 38, 42, 0.12),
    0 8px 16px rgba(18, 38, 42, 0.08),
    0 0 0 1px rgba(255, 138, 1, 0.1);
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
  transform: scale(1.1);
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
  color: #2e5c41;
  transform: translateX(4px);
}

/* Description Animation */
.description {
  transition: color 0.3s ease;
}

.recipe-card:hover .description {
  color: #666;
}

/* Footer Content */
.footer-content {
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

/* Stat Items */
.stat-item {
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), color 0.3s ease;
}

.recipe-card:hover .stat-item {
  color: #2e5c41;
}

/* CTA Text */
.cta-text {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.recipe-card:hover .cta-text {
  transform: translateX(8px);
  color: #ff8a01;
}

/* Cards Container Parallax */
.cards-container {
  transition: transform 0.1s linear;
  will-change: transform;
}

/* Animation delays */
.animate-delay-0 { animation-delay: 0s; }
.animate-delay-100 { animation-delay: 0.1s; }
.animate-delay-200 { animation-delay: 0.2s; }
.animate-delay-300 { animation-delay: 0.3s; }
.animate-delay-400 { animation-delay: 0.4s; }
.animate-delay-500 { animation-delay: 0.5s; }
.animate-delay-600 { animation-delay: 0.6s; }
</style>
