<script setup lang="ts">
import { computed } from 'vue';
import { cn } from '../../lib/utils';

interface Props {
  variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  class?: string;
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  size: 'default',
  class: '',
});

const buttonClasses = computed(() => {
  const base = 'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 outline-none focus-visible:ring-2 focus-visible:ring-offset-2';

  const variants = {
    default: 'bg-[#E8913A] text-white hover:bg-[#D4802A] shadow-warm hover:shadow-warm-lg',
    outline: 'border-2 bg-white text-[#4A3728] hover:bg-[#FFF8E7]',
    secondary: 'bg-[#5A9A4F] text-white hover:bg-[#3D7A35] shadow-warm hover:shadow-warm-lg',
    ghost: 'hover:bg-[#FFF8E7] hover:text-[#E8913A]',
    link: 'text-[#E8913A] underline-offset-4 hover:underline',
  };

  const sizes = {
    default: 'h-10 px-4 py-2',
    sm: 'h-9 px-3 py-2',
    lg: 'h-12 px-6 py-3 text-base',
    icon: 'h-10 w-10',
  };

  return cn(base, variants[props.variant], sizes[props.size], props.class);
});
</script>

<template>
  <button :class="buttonClasses">
    <slot />
  </button>
</template>
