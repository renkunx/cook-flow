<script setup lang="ts">
import { ref } from 'vue';

const floatingIngredients = [
  { icon: '🍅', delay: 0, x: '8%', y: '15%', duration: 5 },
  { icon: '🥬', delay: 0.5, x: '88%', y: '12%', duration: 6 },
  { icon: '🥕', delay: 1, x: '80%', y: '75%', duration: 5.5 },
  { icon: '🧄', delay: 1.5, x: '12%', y: '70%', duration: 7 },
  { icon: '🥚', delay: 2, x: '45%', y: '8%', duration: 6.2 },
  { icon: '🧅', delay: 0.8, x: '92%', y: '45%', duration: 5.8 },
  { icon: '🥦', delay: 1.2, x: '5%', y: '50%', duration: 6.5 },
  { icon: '🍋', delay: 2.5, x: '65%', y: '80%', duration: 7.2 },
];

function scrollToIngredients() {
  const element = document.getElementById('ingredients');
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
}
</script>

<template>
  <section class="relative min-h-screen flex items-center justify-center overflow-hidden" style="background: linear-gradient(180deg, #FFF8E7 0%, #FDF5E6 100%)">
    <!-- Animated Background Pattern -->
    <div class="absolute inset-0 overflow-hidden">
      <!-- Gradient Orbs - Warm Orange Theme -->
      <div
        class="absolute w-[500px] h-[500px] rounded-full orb-animation"
        style="top: '-10%', left: '-10%', background: rgba(232, 145, 58, 0.08); filter: blur(60px);"
      />
      <div
        class="absolute w-[500px] h-[500px] rounded-full orb-animation"
        style="bottom: '-5%', right: '-5%; animation-delay: 2s; background: rgba(245, 166, 35, 0.08); filter: blur(60px);"
      />
      <div
        class="absolute w-[300px] h-[300px] rounded-full orb-animation-small"
        style="top: '40%', left: '50%'; transform: translate(-50%, -50%); background: rgba(90, 154, 79, 0.06); filter: blur(50px);"
      />
    </div>

    <!-- Floating Ingredients -->
    <div
      v-for="(item, index) in floatingIngredients"
      :key="index"
      class="absolute text-5xl md:text-6xl select-none pointer-events-none"
      :style="{
        left: item.x,
        top: item.y,
        animation: `float ${item.duration}s ease-in-out ${item.delay}s infinite`
      }"
    >
      {{ item.icon }}
    </div>

    <!-- Main Content -->
    <div class="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <!-- Badge -->
      <div class="inline-flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-sm mb-8 animate-fade-in">
        <svg class="w-4 h-4" style="color: #E8913A;" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
        </svg>
        <span class="text-sm font-medium" style="color: #E8913A;">智能菜谱推荐</span>
      </div>

      <!-- Title -->
      <h1 class="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-bold leading-tight mb-6 animate-slide-up" style="color: #4A3728;">
        看看你的冰箱里
        <br />
        <span class="text-gradient-orange">能做些什么</span>
      </h1>

      <!-- Description -->
      <p class="text-lg md:text-xl max-w-2xl mx-auto mb-10 animate-slide-up" style="color: #6B5344; animation-delay: 0.2s; opacity: 0;">
        添加你现有的食材，获取AI驱动的菜谱推荐。
        <br class="hidden sm:block" />
        让每一餐都充满惊喜，告别浪费。
      </p>

      <!-- CTA Buttons -->
      <div class="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up" style="animation-delay: 0.4s; opacity: 0;">
        <button
          @click="scrollToIngredients"
          class="bg-[#E8913A] hover:bg-[#D4802A] text-white rounded-full px-10 py-4 text-lg font-medium shadow-warm hover:shadow-warm-lg transition-all flex items-center gap-2"
        >
          添加食材
          <span class="inline-block animate-bounce">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </span>
        </button>
        <button
          class="bg-white hover:bg-[#FFF8E7] rounded-full px-10 py-4 text-lg font-medium border-2 transition-all flex items-center gap-2"
          style="border-color: #F5E6D3; color: #4A3728;"
        >
          浏览热门菜谱
        </button>
      </div>

      <!-- Stats -->
      <div class="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto">
        <div
          v-for="(stat, index) in [
            { value: '1000+', label: '精选菜谱', color: '#E8913A' },
            { value: '50+', label: '食材种类', color: '#5A9A4F' },
            { value: '10万+', label: '快乐用户', color: '#E85D4C' },
          ]"
          :key="stat.label"
          class="text-center animate-scale-in"
          :style="{ animationDelay: `${0.6 + index * 0.1}s`, opacity: 0 }"
        >
          <div class="text-2xl md:text-3xl font-serif font-bold" :style="{ color: stat.color }">{{ stat.value }}</div>
          <div class="text-sm mt-1" style="color: #6B5344;">{{ stat.label }}</div>
        </div>
      </div>
    </div>

    <!-- Bottom Gradient Fade -->
    <div class="absolute bottom-0 left-0 right-0 h-32" style="background: linear-gradient(to top, #FDF5E6, transparent);" />
  </section>
</template>

<style scoped>
@keyframes float {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-15px) rotate(1deg);
  }
}

@keyframes orb-animation {
  0%, 100% {
    transform: scale(1);
    opacity: 0.4;
  }
  50% {
    transform: scale(1.15);
    opacity: 0.6;
  }
}

@keyframes orb-animation-small {
  0%, 100% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.3;
  }
  50% {
    transform: translate(-50%, -50%) scale(1.1);
    opacity: 0.5;
  }
}

@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slide-up {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes scale-in {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(4px);
  }
}

.animate-fade-in {
  animation: fade-in 0.6s ease-out forwards;
}

.animate-slide-up {
  animation: slide-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.animate-scale-in {
  animation: scale-in 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.animate-bounce {
  animation: bounce 1.5s ease-in-out infinite;
}

.orb-animation {
  animation: orb-animation 8s ease-in-out infinite;
}

.orb-animation-small {
  animation: orb-animation-small 6s ease-in-out infinite;
}
</style>
