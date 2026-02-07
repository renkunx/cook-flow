<script setup lang="ts">
import { computed } from 'vue';
import { cn } from '../../lib/utils';

interface Props {
  class?: string;
  type?: string;
  modelValue?: string;
  placeholder?: string;
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  class: '',
});

const emit = defineEmits<{
  'update:modelValue': [value: string];
  focus: [event: FocusEvent];
  blur: [event: FocusEvent];
}>();

const inputClasses = computed(() => {
  return cn(
    'flex h-10 w-full rounded-md border bg-white px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
    'border-[#F5E6D3] focus-visible:border-[#E8913A] focus-visible:ring-2 focus-visible:ring-[#E8913A]/20',
    props.class
  );
});

function onInput(event: Event) {
  emit('update:modelValue', (event.target as HTMLInputElement).value);
}
</script>

<template>
  <input
    :type="type"
    :class="inputClasses"
    :value="modelValue"
    :placeholder="placeholder"
    @input="onInput"
    @focus="emit('focus', $event)"
    @blur="emit('blur', $event)"
  />
</template>
