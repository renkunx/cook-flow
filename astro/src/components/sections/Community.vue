<script setup lang="ts">
import { users } from '../../data/recipes';

// Split users into two columns for the marquee effect
const leftColumn = users.filter((_, i) => i % 2 === 0);
const rightColumn = users.filter((_, i) => i % 2 === 1);
</script>

<template>
  <section id="community" class="py-20 overflow-hidden" style="background: #4A3728;">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <!-- Left Content -->
        <div class="text-white">
          <div class="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
            <svg class="w-4 h-4" style="color: #F5A623;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <span class="text-sm font-medium" style="color: #F5A623;">加入社区</span>
          </div>

          <h2 class="text-3xl md:text-4xl lg:text-5xl font-serif font-bold mb-6">
            与 <span style="color: #F5A623;">10,000+</span> 美食爱好者
            <br />
            分享你的烹饪作品
          </h2>

          <p class="text-white/70 text-lg mb-8 max-w-md">
            加入我们的美食社区，发现新菜谱，分享你的创意，结识志同道合的美食爱好者
          </p>

          <div class="flex flex-wrap gap-4">
            <button class="bg-[#E8913A] hover:bg-[#D4802A] text-white px-8 py-3 rounded-full font-medium transition-colors active:scale-95">
              立即加入
            </button>
            <button class="bg-white/10 hover:bg-white/20 text-white px-8 py-3 rounded-full font-medium transition-colors backdrop-blur-sm active:scale-95">
              了解更多
            </button>
          </div>

          <!-- Stats -->
          <div class="grid grid-cols-3 gap-8 mt-12">
            <div
              v-for="stat in [
                { value: '10K+', label: '活跃用户' },
                { value: '50K+', label: '分享作品' },
                { value: '100K+', label: '互动点赞' },
              ]"
              :key="stat.label"
              class="animate-scale-in"
            >
              <div class="text-2xl md:text-3xl font-serif font-bold" style="color: #F5A623;">
                {{ stat.value }}
              </div>
              <div class="text-sm text-white/60 mt-1">{{ stat.label }}</div>
            </div>
          </div>
        </div>

        <!-- Right Content - User Marquee -->
        <div class="relative h-[500px] overflow-hidden marquee-container">
          <!-- Gradient Masks -->
          <div class="absolute top-0 left-0 right-0 h-24 z-10 pointer-events-none" style="background: linear-gradient(to bottom, #4A3728, transparent);" />
          <div class="absolute bottom-0 left-0 right-0 h-24 z-10 pointer-events-none" style="background: linear-gradient(to top, #4A3728, transparent);" />

          <div class="flex gap-4 h-full">
            <!-- Left Column - Scrolls Up -->
            <div class="flex-1 flex flex-col gap-4 marquee-up">
              <div
                v-for="(user, index) in [...leftColumn, ...leftColumn]"
                :key="`left-${user.id}-${index}`"
                class="user-card bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10"
              >
                <div class="flex items-start gap-3">
                  <img
                    :src="user.avatar"
                    :alt="user.name"
                    class="w-12 h-12 rounded-full object-cover border-2"
                    style="border-color: #F5A623;"
                  />
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2 mb-1">
                      <span class="font-medium text-white">{{ user.name }}</span>
                      <svg class="w-3 h-3 text-red-400 fill-red-400" viewBox="0 0 24 24">
                        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
                      </svg>
                    </div>
                    <p class="text-sm text-white/70 line-clamp-2">{{ user.comment }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Right Column - Scrolls Down -->
            <div class="flex-1 flex flex-col gap-4 marquee-down">
              <div
                v-for="(user, index) in [...rightColumn, ...rightColumn]"
                :key="`right-${user.id}-${index}`"
                class="user-card bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10"
              >
                <div class="flex items-start gap-3">
                  <img
                    :src="user.avatar"
                    :alt="user.name"
                    class="w-12 h-12 rounded-full object-cover border-2"
                    style="border-color: #E8913A;"
                  />
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2 mb-1">
                      <span class="font-medium text-white">{{ user.name }}</span>
                      <svg class="w-3 h-3" style="color: #F5A623;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                    <p class="text-sm text-white/70 line-clamp-2">{{ user.comment }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
@keyframes scale-in {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes marquee-up {
  0% {
    transform: translateY(0%);
  }
  100% {
    transform: translateY(-50%);
  }
}

@keyframes marquee-down {
  0% {
    transform: translateY(-50%);
  }
  100% {
    transform: translateY(0%);
  }
}

.animate-scale-in {
  animation: scale-in 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.marquee-up {
  animation: marquee-up 30s linear infinite;
}

.marquee-down {
  animation: marquee-down 30s linear infinite;
}

/* Pause marquee on hover */
.marquee-container:hover .marquee-up,
.marquee-container:hover .marquee-down {
  animation-play-state: paused;
}

/* User Card Styles */
.user-card {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  position: relative;
  overflow: hidden;
}

.user-card::before {
  content: '';
  position: absolute;
  inset: 0;
  opacity: 0;
  transition: opacity 0.3s ease;
  border-radius: inherit;
  background: linear-gradient(135deg, rgba(245, 166, 35, 0.1), rgba(232, 145, 58, 0.1));
}

.user-card:hover::before {
  opacity: 1;
}

.user-card:hover {
  transform: scale(1.02);
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(245, 166, 35, 0.3);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
}

.user-card img {
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.user-card:hover img {
  transform: scale(1.1);
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
