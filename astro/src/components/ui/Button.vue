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
  const base = 'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 outline-none focus-visible:ring-2 focus-visible:ring-offset-2';

  const variants = {
    default: 'bg-[#2e5c41] text-white hover:bg-[#234a33] shadow-lg shadow-[#2e5c41]/20',
    outline: 'border-2 border-[#2e5c41]/20 text-[#2e5c41] hover:bg-[#2e5c41]/5',
    secondary: 'bg-[#e9f0ec] text-[#2e5c41] hover:bg-[#d0e0d8]',
    ghost: 'hover:bg-[#e9f0ec] hover:text-[#2e5c41]',
    link: 'text-[#2e5c41] underline-offset-4 hover:underline',
  };

  const sizes = {
    default: 'h-10 px-4 py-2',
    sm: 'h-9 px-3 py-2 rounded-md',
    lg: 'h-12 px-6 py-3 text-base rounded-md',
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
