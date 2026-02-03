<script setup lang="ts">
import { computed } from 'vue';
import type { Food } from '../utils/api';

interface Props {
  show: boolean;
  foods: Food[];
  selectedFoods: number[];
  sortOrder: string;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  'update:selectedFoods': [ids: number[]];
  'update:sortOrder': [order: string];
  'clearFilters': [];
}>();

function toggleFood(id: number) {
  const index = props.selectedFoods.indexOf(id);
  if (index > -1) {
    emit('update:selectedFoods', props.selectedFoods.filter(x => x !== id));
  } else {
    emit('update:selectedFoods', [...props.selectedFoods, id]);
  }
}

const hasActiveFilters = computed(() => {
  return props.selectedFoods.length > 0 || props.sortOrder !== 'name';
});
</script>

<template>
  <Transition name="filter-slide">
    <div v-show="show" class="filter-panel">
      <div class="filter-section">
        <label class="filter-label">主要食材</label>
        <div class="food-list">
          <button
            v-for="food in foods.slice(0, 30)"
            :key="food.id"
            @click="toggleFood(food.id)"
            :class="{ active: selectedFoods.includes(food.id) }"
            class="food-button"
          >
            {{ food.name }}
          </button>
        </div>
      </div>

      <div class="filter-section">
        <label class="filter-label">排序方式</label>
        <select
          :value="sortOrder"
          @change="$emit('update:sortOrder', ($event.target as HTMLSelectElement).value)"
          class="sort-select"
        >
          <option value="name">名称</option>
          <option value="-created_at">最新添加</option>
          <option value="-rating">评分最高</option>
          <option value="working_time">烹饪时间</option>
        </select>
      </div>

      <button
        v-if="hasActiveFilters"
        @click="$emit('clearFilters')"
        class="clear-btn"
      >
        清空筛选
      </button>
    </div>
  </Transition>
</template>

<style scoped>
.filter-panel {
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  border: 1px solid #FFE4D6;
}

.filter-section {
  margin-bottom: 1.25rem;
}

.filter-section:last-child {
  margin-bottom: 0;
}

.filter-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  color: #2D2D2D;
  margin-bottom: 0.75rem;
}

.food-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.food-button {
  padding: 0.375rem 0.75rem;
  background: #FFF8F3;
  border: 1px solid #FFE4D6;
  border-radius: 0.375rem;
  font-size: 0.8125rem;
  color: #666;
  cursor: pointer;
  transition: all 0.2s;
}

.food-button:hover {
  background: #FFF0E6;
  border-color: #FFB347;
}

.food-button.active {
  background: #FF6B35;
  border-color: #FF6B35;
  color: white;
}

.sort-select {
  width: 100%;
  padding: 0.625rem;
  border: 1px solid #FFE4D6;
  border-radius: 0.375rem;
  font-size: 0.9375rem;
  color: #2D2D2D;
  background: white;
  cursor: pointer;
}

.sort-select:focus {
  outline: none;
  border-color: #FF6B35;
}

.clear-btn {
  width: 100%;
  padding: 0.75rem;
  background: white;
  border: 1px dashed #FFE4D6;
  border-radius: 0.5rem;
  color: #999;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
}

.clear-btn:hover {
  border-color: #FF6B35;
  color: #FF6B35;
}

/* Transitions */
.filter-slide-enter-active,
.filter-slide-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}

.filter-slide-enter-from,
.filter-slide-leave-to {
  opacity: 0;
  max-height: 0;
  margin-bottom: 0;
}

.filter-slide-enter-to,
.filter-slide-leave-from {
  opacity: 1;
  max-height: 500px;
  margin-bottom: 1.5rem;
}

@media (max-width: 640px) {
  .filter-panel {
    padding: 1rem;
  }

  .food-button {
    font-size: 0.75rem;
    padding: 0.3125rem 0.625rem;
  }
}
</style>
