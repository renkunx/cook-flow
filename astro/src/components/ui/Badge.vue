<script setup lang="ts">
import { computed } from 'vue';
import { cn } from '../../lib/utils';

interface Props {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline';
  class?: string;
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  class: '',
});

const badgeClasses = computed(() => {
  const base = 'inline-flex items-center justify-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-[#2e5c41] focus:ring-offset-2';

  const variants = {
    default: 'border-transparent bg-[#2e5c41] text-white',
    secondary: 'border-transparent bg-[#e9f0ec] text-[#2e5c41]',
    destructive: 'border-transparent bg-red-500 text-white',
    outline: 'text-[#2e5c41] border-[#2e5c41]/20 hover:bg-[#e9f0ec]',
  };

  return cn(base, variants[props.variant], props.class);
});
</script>

<template>
  <span :class="badgeClasses">
    <slot />
  </span>
</template>
