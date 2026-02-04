<script setup lang="ts">
import { ref } from 'vue';
import Button from '../ui/Button.vue';

const floatingIngredients = [
  { icon: '🍅', delay: 0, x: '10%', y: '20%', duration: 6 },
  { icon: '🥬', delay: 1, x: '85%', y: '15%', duration: 7 },
  { icon: '🥕', delay: 2, x: '75%', y: '70%', duration: 5 },
  { icon: '🧄', delay: 0.5, x: '15%', y: '65%', duration: 8 },
  { icon: '🥚', delay: 1.5, x: '50%', y: '10%', duration: 6.5 },
  { icon: '🧅', delay: 2.5, x: '90%', y: '50%', duration: 7.5 },
  { icon: '🥦', delay: 0.8, x: '5%', y: '40%', duration: 5.5 },
  { icon: '🍋', delay: 1.8, x: '60%', y: '75%', duration: 6.8 },
];

function scrollToIngredients() {
  const element = document.getElementById('ingredients');
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
}
</script>

<template>
  <section class="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#e9f0ec] via-white to-[#f6f6f6]">
    <!-- Animated Background Pattern -->
    <div class="absolute inset-0 overflow-hidden">
      <svg class="absolute w-full h-full opacity-5" viewBox="0 0 100 100" preserveAspectRatio="none">
        <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="1" fill="#2e5c41" />
        </pattern>
        <rect width="100" height="100" fill="url(#grid)" />
      </svg>

      <!-- Gradient Orbs -->
      <div
        class="absolute w-[600px] h-[600px] rounded-full bg-[#2e5c41]/10 blur-3xl gradient-orb"
        style="top: '-10%', left: '-10%'"
      />
      <div
        class="absolute w-[500px] h-[500px] rounded-full bg-[#ff8a01]/10 blur-3xl gradient-orb"
        style="bottom: '-5%', right: '-5%'; animation-delay: 1s;"
      />
    </div>

    <!-- Floating Ingredients -->
    <div
      v-for="(item, index) in floatingIngredients"
      :key="index"
      class="absolute text-5xl md:text-6xl select-none pointer-events-none floating-ingredient"
      :style="{
        left: item.x,
        top: item.y,
        animationDelay: `${item.delay}s`,
        animationDuration: `${item.duration}s`
      }"
    >
      {{ item.icon }}
    </div>

    <!-- Main Content -->
    <div class="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <!-- Badge -->
      <div class="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg mb-8 animate-fade-in">
        <svg class="w-4 h-4 text-[#ff8a01]" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
        </svg>
        <span class="text-sm font-medium text-[#12262a]">AI 智能菜谱推荐</span>
      </div>

      <!-- Title -->
      <h1 class="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-[#12262a] leading-tight mb-6 animate-slide-up">
        看看你的冰箱里
        <br />
        <span class="text-gradient">能做些什么</span>
      </h1>

      <!-- Description -->
      <p class="text-lg md:text-xl text-[#12262a]/70 max-w-2xl mx-auto mb-10 animate-slide-up-delay-200">
        输入你现有的食材，获取AI驱动的菜谱推荐。
        <br class="hidden sm:block" />
        让每一餐都充满惊喜，告别浪费。
      </p>

      <!-- CTA Buttons -->
      <div class="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up-delay-400">
        <Button
          size="lg"
          @click="scrollToIngredients"
          class="!rounded-full px-10 py-6 !text-lg shadow-xl shadow-[#2e5c41]/30 !bg-[#2e5c41] hover:!bg-[#234a33] !text-white"
        >
          添加食材
          <span class="ml-2 inline-block animate-bounce">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </span>
        </Button>
        <Button
          size="lg"
          variant="outline"
          class="!rounded-full px-10 py-6 !text-lg border-2 border-[#2e5c41]/20 text-[#2e5c41] hover:bg-[#2e5c41]/5"
        >
          浏览热门菜谱
        </Button>
      </div>

      <!-- Stats -->
      <div class="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto">
        <div
          v-for="(stat, index) in [
            { value: '1000+', label: '精选菜谱' },
            { value: '50+', label: '食材种类' },
            { value: '10万+', label: '快乐用户' },
          ]"
          :key="stat.label"
          :class="['text-center animate-scale-in', `animate-delay-${index * 100}`]"
        >
          <div class="text-2xl md:text-3xl font-serif font-bold text-[#2e5c41]">{{ stat.value }}</div>
          <div class="text-sm text-[#12262a]/60 mt-1">{{ stat.label }}</div>
        </div>
      </div>
    </div>

    <!-- Bottom Gradient Fade -->
    <div class="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
  </section>
</template>

<style scoped>
@keyframes float {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
  }
  25% {
    transform: translateY(-15px) rotate(-2deg);
  }
  50% {
    transform: translateY(-25px) rotate(0deg);
  }
  75% {
    transform: translateY(-15px) rotate(2deg);
  }
}

@keyframes pulse-slow {
  0%, 100% {
    transform: scale(1);
    opacity: 0.25;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.4;
  }
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 0.3;
  }
  50% {
    transform: scale(1.2);
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
    transform: scale(0.95);
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

@keyframes shimmer {
  0% {
    background-position: -200% center;
  }
  100% {
    background-position: 200% center;
  }
}

.floating-ingredient {
  animation: float var(--float-duration, 6s) ease-in-out infinite;
}

.animate-fade-in {
  animation: fade-in 0.6s ease-out forwards;
}

.animate-slide-up {
  animation: slide-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.animate-slide-up-delay-200 {
  animation: slide-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s forwards;
  opacity: 0;
}

.animate-slide-up-delay-400 {
  animation: slide-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.4s forwards;
  opacity: 0;
}

.animate-scale-in {
  animation: scale-in 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.animate-bounce {
  animation: bounce 1.5s ease-in-out infinite;
}

.animate-delay-0 {
  animation-delay: 0s;
}

.animate-delay-100 {
  animation-delay: 0.1s;
}

.animate-delay-200 {
  animation-delay: 0.2s;
}

/* Gradient orbs with enhanced animation */
.gradient-orb {
  animation: pulse-slow 8s ease-in-out infinite;
}

.text-gradient {
  background: linear-gradient(135deg, #2e5c41 0%, #ff8a01 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
</style>
