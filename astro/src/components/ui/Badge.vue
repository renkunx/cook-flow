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
  const base = 'inline-flex items-center justify-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-[#E8913A] focus:ring-offset-2';

  const variants = {
    default: 'border-transparent bg-[#E8913A] text-white',
    secondary: 'border-transparent bg-[#FFF8E7] text-[#E8913A]',
    destructive: 'border-transparent bg-[#E85D4C] text-white',
    outline: 'text-[#E8913A] border-[#E8913A]/20 hover:bg-[#FFF8E7]',
  };

  return cn(base, variants[props.variant], props.class);
});
</script>

<template>
  <span :class="badgeClasses">
    <slot />
  </span>
</template>
