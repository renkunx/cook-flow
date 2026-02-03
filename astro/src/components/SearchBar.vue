<script setup lang="ts">
import { ref, watch } from 'vue';
interface Props {
  modelValue: string;
  showFilters: boolean;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  'update:modelValue': [value: string];
  'toggleFilters': [];
}>();

const localInput = ref(props.modelValue);
let timeout: ReturnType<typeof setTimeout> | undefined;

watch(localInput, (val) => {
  clearTimeout(timeout);
  timeout = setTimeout(() => {
    emit('update:modelValue', val);
  }, 300);
});

// Sync with external changes
watch(() => props.modelValue, (val) => {
  localInput.value = val;
});

function handleToggleFilters() {
  console.log('SearchBar: toggleFilters clicked');
  emit('toggleFilters');
}
</script>

<template>
  <div class="search-bar">
    <div class="search-input-wrapper">
      <svg class="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <input
        v-model="localInput"
        type="text"
        placeholder="搜索菜谱名称、食材..."
        class="search-input"
      />
      <button
        @click="handleToggleFilters"
        class="filter-toggle"
        :class="{ active: showFilters }"
      >
        <span>筛选</span>
        <span class="arrow">{{ showFilters ? '▲' : '▼' }}</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.search-bar {
  background: white;
  border-radius: 1rem;
  padding: 1rem 1.25rem;
  box-shadow: 0 1px 3px rgba(255, 107, 53, 0.08);
  margin-bottom: 1.5rem;
}

.search-input-wrapper {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.search-icon {
  width: 1.25rem;
  height: 1.25rem;
  color: #999;
  flex-shrink: 0;
}

.search-input {
  flex: 1;
  padding: 0.75rem 1rem;
  border: 2px solid #FFE4D6;
  border-radius: 0.5rem;
  font-size: 1rem;
  transition: border-color 0.2s;
}

.search-input:focus {
  outline: none;
  border-color: #FF6B35;
}

.filter-toggle {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.625rem 1rem;
  background: #FFF8F3;
  border: 1px solid #FFE4D6;
  border-radius: 0.5rem;
  color: #FF6B35;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.filter-toggle:hover {
  background: #FFF0E6;
}

.filter-toggle.active {
  background: #FF6B35;
  color: white;
}

.arrow {
  font-size: 0.75rem;
}

@media (max-width: 640px) {
  .search-input-wrapper {
    flex-wrap: wrap;
  }

  .search-input {
    width: 100%;
    order: 2;
  }

  .filter-toggle {
    order: 3;
  }

  .search-icon {
    order: 1;
  }
}
</style>
