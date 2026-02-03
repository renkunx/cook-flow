<script setup lang="ts">
import { computed } from 'vue';
import type { Keyword } from '../utils/api';

interface Props {
  modelValue: number[];
  keywords: Keyword[];
}

const props = defineProps<Props>();

const emit = defineEmits<{
  'update:modelValue': [ids: number[]];
}>();

const MEAL_TYPES = ['全部', '早餐', '午餐', '晚餐', '点心', '主食', '宵夜', '中餐', '西餐'];

const quickTags = computed(() => {
  const tags = [{ id: 0, name: '全部' }];
  props.keywords.forEach(k => {
    if (MEAL_TYPES.some(type => k.name.includes(type))) {
      tags.push(k);
    }
  });
  return tags;
});

function toggleTag(id: number) {
  if (id === 0) {
    emit('update:modelValue', []);
  } else {
    const currentIndex = props.modelValue.indexOf(id);
    if (currentIndex > -1) {
      emit('update:modelValue', props.modelValue.filter(x => x !== id));
    } else {
      emit('update:modelValue', [...props.modelValue, id]);
    }
  }
}
</script>

<template>
  <div class="quick-tags">
    <button
      v-for="tag in quickTags"
      :key="tag.id"
      @click="toggleTag(tag.id)"
      :class="{ active: tag.id === 0 ? modelValue.length === 0 : modelValue.includes(tag.id) }"
      class="tag-button"
    >
      {{ tag.name }}
    </button>
  </div>
</template>

<style scoped>
.quick-tags {
  display: flex;
  gap: 0.75rem;
  overflow-x: auto;
  padding: 0.5rem 0;
  margin-bottom: 1.5rem;
  scrollbar-width: none;
}

.quick-tags::-webkit-scrollbar {
  display: none;
}

.tag-button {
  white-space: nowrap;
  padding: 0.5rem 1rem;
  background: white;
  border: 1px solid #FFE4D6;
  border-radius: 2rem;
  font-size: 0.875rem;
  color: #666;
  cursor: pointer;
  transition: all 0.2s;
}

.tag-button:hover {
  border-color: #FF6B35;
  color: #FF6B35;
}

.tag-button.active {
  background: #FF6B35;
  border-color: #FF6B35;
  color: white;
}

@media (max-width: 640px) {
  .quick-tags {
    gap: 0.5rem;
  }

  .tag-button {
    padding: 0.4375rem 0.875rem;
    font-size: 0.8125rem;
  }
}
</style>
