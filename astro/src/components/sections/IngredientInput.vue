<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import Input from '../ui/Input.vue';
import Button from '../ui/Button.vue';
import { presetIngredients } from '../../data/ingredients';
import { categoryLabels, categoryIcons, type Ingredient } from '../../types';

interface Props {
  selectedIngredients: Ingredient[];
}

const props = defineProps<Props>();

const emit = defineEmits<{
  'update:selectedIngredients': [ingredients: Ingredient[]];
}>();

const inputValue = ref('');
const isFocused = ref(false);
const suggestions = ref<Ingredient[]>([]);

watch([inputValue, () => props.selectedIngredients], ([newInput]) => {
  if (newInput.trim()) {
    const filtered = presetIngredients.filter(
      (ing) =>
        ing.name.toLowerCase().includes(newInput.toLowerCase()) &&
        !props.selectedIngredients.find((s) => s.id === ing.id)
    );
    suggestions.value = filtered.slice(0, 6);
  } else {
    suggestions.value = [];
  }
});

function addIngredient(ingredient: Ingredient) {
  if (!props.selectedIngredients.find((i) => i.id === ingredient.id)) {
    emit('update:selectedIngredients', [...props.selectedIngredients, ingredient]);
  }
  inputValue.value = '';
  suggestions.value = [];
}

function removeIngredient(id: string) {
  emit('update:selectedIngredients', props.selectedIngredients.filter((i) => i.id !== id));
}

function handleKeyDown(event: KeyboardEvent) {
  if (event.key === 'Enter' && inputValue.value.trim()) {
    const existing = presetIngredients.find(
      (ing) => ing.name.toLowerCase() === inputValue.value.toLowerCase()
    );
    if (existing) {
      addIngredient(existing);
    } else {
      const newIngredient: Ingredient = {
        id: `custom-${Date.now()}`,
        name: inputValue.value.trim(),
        category: 'other',
      };
      addIngredient(newIngredient);
    }
  }
}

const groupedByCategory = computed(() => {
  return props.selectedIngredients.reduce((acc, ing) => {
    if (!acc[ing.category]) acc[ing.category] = [];
    acc[ing.category].push(ing);
    return acc;
  }, {} as Record<string, Ingredient[]>);
});
</script>

<template>
  <section id="ingredients" class="py-20 bg-white">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="text-center mb-12">
        <div class="inline-flex items-center gap-2 bg-[#e9f0ec] rounded-full px-4 py-2 mb-4">
          <svg class="w-4 h-4 text-[#2e5c41]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
          </svg>
          <span class="text-sm font-medium text-[#2e5c41]">我的冰箱</span>
        </div>
        <h2 class="text-3xl md:text-4xl font-serif font-bold text-[#12262a] mb-4">
          今天冰箱里有什么？
        </h2>
        <p class="text-[#12262a]/60 max-w-lg mx-auto">
          添加你现有的食材，我们会为你推荐最合适的菜谱
        </p>
      </div>

      <!-- Input Area -->
      <div class="relative mb-8">
        <div
          :class="[
            'relative flex items-center gap-2 bg-white border-2 rounded-2xl p-2 transition-all duration-300',
            isFocused
              ? 'border-[#2e5c41] shadow-lg shadow-[#2e5c41]/10'
              : 'border-gray-200 hover:border-gray-300'
          ]"
        >
          <svg class="w-5 h-5 text-gray-400 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <Input
            v-model="inputValue"
            type="text"
            placeholder="输入食材名称..."
            class="flex-1 border-0 bg-transparent focus-visible:ring-0 text-lg"
            @focus="isFocused = true"
            @blur="setTimeout(() => isFocused = false, 200)"
            @keydown="handleKeyDown"
          />
          <Button
            @click="inputValue && handleKeyDown({ key: 'Enter' } as KeyboardEvent)"
            class="bg-[#2e5c41] hover:bg-[#234a33] text-white rounded-xl px-6"
          >
            <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            添加
          </Button>
        </div>

        <!-- Suggestions Dropdown -->
        <Transition
          enter-active-class="transition-all duration-200"
          enter-from-class="opacity-0 -translate-y-2"
          enter-to-class="opacity-100 translate-y-0"
          leave-active-class="transition-all duration-200"
          leave-from-class="opacity-100 translate-y-0"
          leave-to-class="opacity-0 -translate-y-2"
        >
          <div
            v-if="suggestions.length > 0 && isFocused"
            class="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-20"
          >
            <button
              v-for="(ingredient, index) in suggestions"
              :key="ingredient.id"
              @click="addIngredient(ingredient)"
              class="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#e9f0ec] transition-colors text-left"
            >
              <span class="text-2xl">{{ categoryIcons[ingredient.category] }}</span>
              <span class="flex-1 text-[#12262a]">{{ ingredient.name }}</span>
              <span class="text-xs text-gray-400">{{ categoryLabels[ingredient.category] }}</span>
            </button>
          </div>
        </Transition>
      </div>

      <!-- Quick Add Tags -->
      <div class="mb-8">
        <p class="text-sm text-gray-500 mb-3">快速添加：</p>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="ingredient in presetIngredients.slice(0, 12)"
            :key="ingredient.id"
            @click="addIngredient(ingredient)"
            :disabled="selectedIngredients.some((i) => i.id === ingredient.id)"
            :class="[
              'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm transition-all',
              selectedIngredients.some((i) => i.id === ingredient.id)
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-[#e9f0ec] text-[#2e5c41] hover:bg-[#2e5c41] hover:text-white active:scale-95'
            ]"
          >
            <span>{{ categoryIcons[ingredient.category] }}</span>
            {{ ingredient.name }}
          </button>
        </div>
      </div>

      <!-- Selected Ingredients -->
      <Transition
        enter-active-class="transition-all duration-300"
        enter-from-class="opacity-0 h-0"
        enter-to-class="opacity-100 h-auto"
        leave-active-class="transition-all duration-300"
        leave-from-class="opacity-100 h-auto"
        leave-to-class="opacity-0 h-0"
      >
        <div
          v-if="selectedIngredients.length > 0"
          class="bg-[#f6f6f6] rounded-2xl p-6"
        >
          <div class="flex items-center justify-between mb-4">
            <h3 class="font-medium text-[#12262a]">已选食材</h3>
            <span class="text-sm text-[#2e5c41] font-medium">
              {{ selectedIngredients.length }} 种
            </span>
          </div>

          <div class="space-y-4">
            <div v-for="([category, ingredients], idx) in Object.entries(groupedByCategory)" :key="category">
              <p class="text-xs text-gray-500 mb-2">{{ categoryLabels[category as keyof typeof categoryLabels] }}</p>
              <div class="flex flex-wrap gap-2">
                <TransitionGroup
                  tag="div"
                  name="tag"
                  class="flex flex-wrap gap-2"
                >
                  <span
                    v-for="ingredient in ingredients"
                    :key="ingredient.id"
                    class="inline-flex items-center gap-1.5 bg-white border border-gray-200 rounded-full px-3 py-1.5 text-sm text-[#12262a] shadow-sm"
                  >
                    <span>{{ categoryIcons[ingredient.category] }}</span>
                    {{ ingredient.name }}
                    <button
                      @click="removeIngredient(ingredient.id)"
                      class="ml-1 p-0.5 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <svg class="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </span>
                </TransitionGroup>
              </div>
            </div>
          </div>

          <!-- Clear All -->
          <button
            @click="emit('update:selectedIngredients', [])"
            class="mt-4 text-sm text-gray-500 hover:text-[#2e5c41] transition-colors"
          >
            清空所有
          </button>
        </div>
      </Transition>

      <!-- Empty State -->
      <div
        v-if="selectedIngredients.length === 0"
        class="text-center py-12 text-gray-400"
      >
        <svg class="w-12 h-12 mx-auto mb-4 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
        <p>还没有添加食材，开始添加吧！</p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.tag-enter-active,
.tag-leave-active {
  transition: all 0.3s ease;
}

.tag-enter-from,
.tag-leave-to {
  opacity: 0;
  transform: scale(0);
}
</style>
