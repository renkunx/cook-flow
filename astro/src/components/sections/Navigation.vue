<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue';
import Button from '../ui/Button.vue';

const isScrolled = ref(false);
const isMobileMenuOpen = ref(false);
const isNavVisible = ref(true);

const navLinks = [
  { label: '我的冰箱', href: '#ingredients' },
  { label: '热门菜谱', href: '#recipes' },
  { label: '社区', href: '#community' },
];

function handleScroll() {
  isScrolled.value = window.scrollY > 50;
}

function scrollToSection(href: string) {
  const element = document.querySelector(href);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
  isMobileMenuOpen.value = false;
}

onMounted(() => {
  // Initial slide-in animation
  setTimeout(() => {
    isNavVisible.value = true;
  }, 100);

  window.addEventListener('scroll', handleScroll, { passive: true });
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<template>
  <nav
    :class="[
      'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
      isScrolled ? 'py-3' : 'py-5',
      !isNavVisible && '-translate-y-full'
    ]"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div
        :class="[
          'flex items-center justify-between transition-all duration-500',
          isScrolled
            ? 'bg-white/80 backdrop-blur-xl shadow-lg rounded-3xl px-6 py-3'
            : 'bg-transparent px-2'
        ]"
      >
        <!-- Logo -->
        <a
          href="#"
          class="flex items-center gap-2 group hover:scale-105 active:scale-95 transition-transform duration-200"
        >
          <div class="w-10 h-10 rounded-full bg-[#2e5c41] flex items-center justify-center group-hover:shadow-lg group-hover:shadow-[#2e5c41]/30 transition-shadow duration-300">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
            </svg>
          </div>
          <span :class="[
            'font-serif text-xl font-bold transition-colors',
            isScrolled ? 'text-[#12262a]' : 'text-[#12262a]'
          ]">
            FreshPlate
          </span>
        </a>

        <!-- Desktop Navigation -->
        <div class="hidden md:flex items-center gap-8">
          <a
            v-for="(link, index) in navLinks"
            :key="link.label"
            :href="link.href"
            @click.prevent="scrollToSection(link.href)"
            :class="[
              'relative text-sm font-medium transition-all duration-300',
              'opacity-0 translate-y-4',
              isNavVisible && 'opacity-100 translate-y-0'
            ]"
            :style="{ transitionDelay: `${200 + index * 100}ms` }"
          >
            {{ link.label }}
            <span class="absolute -bottom-1 left-0 w-full h-0.5 bg-[#2e5c41] scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-300" />
          </a>
        </div>

        <!-- CTA Button -->
        <div class="hidden md:block opacity-0" :style="{ transitionDelay: '500ms' }"">
          <Button
            class="bg-[#2e5c41] hover:bg-[#234a33] text-white rounded-full px-6 shadow-lg shadow-[#2e5c41]/20"
            :class="isNavVisible && 'opacity-100'"
          >
            开始烹饪
          </Button>
        </div>

        <!-- Mobile Menu Button -->
        <button
          class="md:hidden p-2 active:scale-95"
          @click="isMobileMenuOpen = !isMobileMenuOpen"
        >
          <svg v-if="!isMobileMenuOpen" class="w-6 h-6 text-[#12262a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <svg v-else class="w-6 h-6 text-[#12262a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
        class="fixed inset-x-0 top-20 z-40 bg-white/95 backdrop-blur-xl shadow-xl mx-4 rounded-2xl p-6 md:hidden"
      >
        <div class="flex flex-col gap-4">
          <a
            v-for="link in navLinks"
            :key="link.label"
            :href="link.href"
            @click="scrollToSection(link.href)"
            class="text-lg font-medium text-[#12262a] py-2 border-b border-gray-100"
          >
            {{ link.label }}
          </a>
          <Button class="bg-[#2e5c41] hover:bg-[#234a33] text-white rounded-full mt-4">
            开始烹饪
          </Button>
        </div>
      </div>
    </Transition>
  </nav>
</template>
