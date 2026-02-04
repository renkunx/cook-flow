<script setup lang="ts">
import { computed, watch, onMounted, onUnmounted } from 'vue';
import { cn } from '../../lib/utils';

interface Props {
  open?: boolean;
  class?: string;
  showCloseButton?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  open: false,
  class: '',
  showCloseButton: true,
});

const emit = defineEmits<{
  'update:open': [value: boolean];
  close: [];
}>();

const isOpen = computed({
  get: () => props.open,
  set: (value) => emit('update:open', value),
});

function close() {
  isOpen.value = false;
  emit('close');
}

// Close on escape key
function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    close();
  }
}

// Close on backdrop click
function handleBackdropClick(e: MouseEvent) {
  if (e.target === e.currentTarget) {
    close();
  }
}

// Manage body scroll on client side only
const isClient = typeof window !== 'undefined';

watch(() => props.open, (newValue) => {
  if (!isClient) return;

  if (newValue) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
});

// Cleanup on unmount
onUnmounted(() => {
  if (isClient) {
    document.body.style.overflow = '';
  }
});
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-all duration-200"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-all duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isOpen"
        class="fixed inset-0 z-50 bg-black/50"
        @click="handleBackdropClick"
        @keydown="handleKeydown"
      />
    </Transition>

    <Transition
      enter-active-class="transition-all duration-200"
      enter-from-class="opacity-0 scale-95 translate-x-[-50%] translate-y-[-50%]"
      enter-to-class="opacity-100 scale-100 translate-x-[-50%] translate-y-[-50%]"
      leave-active-class="transition-all duration-200"
      leave-from-class="opacity-100 scale-100 translate-x-[-50%] translate-y-[-50%]"
      leave-to-class="opacity-0 scale-95 translate-x-[-50%] translate-y-[-50%]"
    >
      <div
        v-if="isOpen"
        :class="cn(
          'fixed left-1/2 top-1/2 z-50 w-full max-w-[calc(100%-2rem)] bg-white rounded-lg shadow-lg p-6',
          props.class
        )"
      >
        <button
          v-if="showCloseButton"
          @click="close"
          class="absolute top-4 right-4 rounded-md p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <slot />
      </div>
    </Transition>
  </Teleport>
</template>
