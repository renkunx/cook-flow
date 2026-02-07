<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue';

const isScrolled = ref(false);
const isMobileMenuOpen = ref(false);
const lastScrollY = ref(0);
const isNavVisible = ref(true);

const navLinks = [
  { label: '我的冰箱', href: '#ingredients' },
  { label: '热门菜谱', href: '#recipes' },
  { label: '社区', href: '#community' },
];

function handleScroll() {
  const currentScrollY = window.scrollY;

  // Always show at top
  if (currentScrollY < 80) {
    isNavVisible.value = true;
  } else {
    // Hide when scrolling down, show when scrolling up
    if (currentScrollY > lastScrollY.value) {
      isNavVisible.value = false;
    } else {
      isNavVisible.value = true;
    }
  }

  isScrolled.value = currentScrollY > 50;
  lastScrollY.value = currentScrollY;
}

function scrollToSection(href: string) {
  const element = document.querySelector(href);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
  isMobileMenuOpen.value = false;
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true });
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<template>
  <nav
    :class="[
      'fixed top-0 left-0 right-0 z-50 py-3 transition-all duration-300',
      !isNavVisible && '-translate-y-full'
    ]"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div
        :class="[
          'flex items-center justify-between transition-all duration-500',
          isScrolled
            ? 'bg-white/90 backdrop-blur-xl shadow-warm rounded-full px-5 py-2.5'
            : 'bg-transparent px-2'
        ]"
      >
        <!-- Logo -->
        <a
          href="/"
          class="flex items-center gap-3 group hover:scale-105 active:scale-95 transition-transform duration-200"
        >
          <div class="w-10 h-10 rounded-full overflow-hidden shadow-sm">
            <img
              src="/logo.jpg"
              alt="下厨有谱"
              class="w-full h-full object-cover"
            />
          </div>
          <div class="flex flex-col">
            <span class="font-serif text-lg font-bold text-[#4A3728] leading-tight">
              下厨有谱
            </span>
            <span
              :class="[
                'text-[10px] leading-tight hidden sm:block transition-colors',
                isScrolled ? 'text-[#6B5344]' : 'text-[#6B5344]'
              ]"
            >
              承包你的一日三餐
            </span>
          </div>
        </a>

        <!-- Desktop Navigation -->
        <div class="hidden md:flex items-center gap-6">
          <a
            v-for="(link, index) in navLinks"
            :key="link.label"
            :href="link.href"
            @click.prevent="scrollToSection(link.href)"
            :class="[
              'relative text-sm font-medium transition-colors',
              'opacity-0 animate-slide-up',
              isScrolled ? 'text-[#6B5344] hover:text-[#E8913A]' : 'text-[#6B5344] hover:text-[#E8913A]'
            ]"
            :style="{ animationDelay: `${200 + index * 100}ms` }"
          >
            {{ link.label }}
            <span class="absolute -bottom-0.5 left-0 w-full h-0.5 bg-[#E8913A] scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-300" />
          </a>
        </div>

        <!-- CTA Button -->
        <div class="hidden md:flex items-center gap-2">
          <div class="opacity-0 animate-scale-in" style="animation-delay: 500ms">
            <button
              class="bg-[#E8913A] hover:bg-[#D4802A] text-white rounded-full px-5 py-2 text-sm font-medium shadow-warm hover:shadow-warm-lg transition-all"
            >
              开始烹饪
            </button>
          </div>
        </div>

        <!-- Mobile Menu Button -->
        <button
          class="md:hidden p-2 text-[#4A3728] active:scale-95 transition-transform"
          @click="isMobileMenuOpen = !isMobileMenuOpen"
        >
          <svg v-if="!isMobileMenuOpen" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Mobile Menu -->
    <Transition
      enter-active-class="transition-all duration-200"
      enter-from-class="opacity-0 -translate-y-5"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-200"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-5"
    >
      <div
        v-if="isMobileMenuOpen"
        class="fixed inset-x-0 top-20 z-40 bg-white/95 backdrop-blur-xl shadow-warm-lg mx-4 rounded-2xl p-6 md:hidden"
      >
        <div class="flex flex-col gap-4">
          <a
            v-for="link in navLinks"
            :key="link.label"
            :href="link.href"
            @click="scrollToSection(link.href)"
            class="text-lg font-medium text-[#4A3728] py-2 border-b border-[#FDF5E6]"
          >
            {{ link.label }}
          </a>
          <button class="w-full bg-[#E8913A] hover:bg-[#D4802A] text-white rounded-full mt-4 py-3 font-medium transition-all">
            开始烹饪
          </button>
        </div>
      </div>
    </Transition>
  </nav>
</template>
