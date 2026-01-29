<script setup lang="ts">
import type { RecipeListItem } from '../utils/api';

interface Props {
  recipe: RecipeListItem;
}

const props = defineProps<Props>();

function getDifficultyStars(level?: number | null): string {
  if (!level) return '';
  return '★'.repeat(level);
}
</script>

<template>
  <a :href="`/recipe/${recipe.id}`" class="recipe-card">
    <div v-if="recipe.image" class="recipe-image-wrapper">
      <img
        :src="recipe.image"
        :alt="recipe.name"
        class="recipe-image"
        loading="lazy"
      />
    </div>
    <div v-else class="recipe-image-placeholder">
      <svg class="placeholder-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    </div>

    <div class="recipe-content">
      <h3 class="recipe-name">{{ recipe.name }}</h3>

      <p v-if="recipe.description" class="recipe-description">
        {{ recipe.description }}
      </p>

      <div class="recipe-meta">
        <div class="meta-item">
          <svg class="meta-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <span>{{ recipe.servings }}人份</span>
        </div>

        <div v-if="recipe.difficulty" class="meta-item meta-difficulty">
          <svg class="meta-icon" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
          <span>{{ getDifficultyStars(recipe.difficulty) }}</span>
        </div>

        <div v-if="recipe.rating" class="meta-item meta-rating">
          <svg class="rating-star" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
          <span>{{ recipe.rating.toFixed(1) }}</span>
        </div>
      </div>
    </div>
  </a>
</template>

<style scoped>
.recipe-card {
  display: block;
  background: white;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 1px 3px 0 rgba(255, 107, 53, 0.08), 0 1px 2px 0 rgba(255, 107, 53, 0.04);
  transition: all 0.2s ease;
  text-decoration: none;
  border: 1px solid #FFE4D6;
}

.recipe-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgba(255, 107, 53, 0.1), 0 4px 6px -2px rgba(255, 107, 53, 0.05);
}

.recipe-image-wrapper {
  aspect-ratio: 16 / 10;
  overflow: hidden;
  background: #FFF8F3;
}

.recipe-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.recipe-card:hover .recipe-image {
  transform: scale(1.05);
}

.recipe-image-placeholder {
  aspect-ratio: 16 / 10;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #FFF8F3 0%, #FFF0E6 100%);
}

.placeholder-icon {
  width: 3rem;
  height: 3rem;
  color: #FFB347;
}

.recipe-content {
  padding: 1rem;
}

.recipe-name {
  font-size: 1.125rem;
  font-weight: 600;
  color: #2D2D2D;
  margin: 0 0 0.5rem 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.recipe-description {
  font-size: 0.875rem;
  color: #666666;
  line-height: 1.5;
  margin: 0 0 0.75rem 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.recipe-meta {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.8125rem;
  color: #666666;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.meta-icon {
  width: 0.875rem;
  height: 0.875rem;
  color: #FF6B35;
}

.meta-rating {
  color: #FFB347;
  font-weight: 500;
}

.meta-difficulty {
  color: #FF6B35;
  font-weight: 500;
}

.rating-star {
  width: 0.875rem;
  height: 0.875rem;
}

@media (min-width: 640px) {
  .recipe-content {
    padding: 1.25rem;
  }

  .recipe-name {
    font-size: 1.25rem;
  }
}
</style>
