import { useMemo, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Flame, ChefHat, Users, ArrowRight, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { recipeApi } from '@/api/recipe';
import type { Ingredient } from '@/types';
import { Badge } from '@/components/ui/badge';

// Local type definition to avoid import issues
interface RecipeOverview {
  id: number;
  name: string;
  description: string;
  image: string | null;
  servings: number;
  working_time: number;
  waiting_time: number;
  keywords: Keyword[];
  nutrition?: {
    calories: number;
  } | null;
}

interface Keyword {
  id: number;
  name: string;
  label?: string;
}

interface RecipeGridProps {
  selectedIngredients: Ingredient[];
}

export function RecipeGrid({ selectedIngredients }: RecipeGridProps) {
  const [apiRecipes, setApiRecipes] = useState<RecipeOverview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch recipes from API
  useEffect(() => {
    const fetchRecipes = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await recipeApi.list({ page: 1, page_size: 50 });
        setApiRecipes(response.results);
      } catch (err) {
        console.error('Failed to fetch recipes:', err);
        setError('加载菜谱失败，请稍后重试');
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  // Convert API recipes to UI recipe format and calculate matches
  const matchedRecipes = useMemo(() => {
    const convertToUiRecipe = (apiRecipe: RecipeOverview) => ({
      id: String(apiRecipe.id),
      title: apiRecipe.name,
      description: apiRecipe.description || '',
      image: apiRecipe.image || 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=800&auto=format&fit=crop',
      cookTime: apiRecipe.working_time || 30,
      calories: apiRecipe.nutrition?.calories || 200,
      difficulty: (apiRecipe.working_time || 30) < 20 ? 'easy' : (apiRecipe.working_time || 30) < 45 ? 'medium' : 'hard' as 'easy' | 'medium' | 'hard',
      ingredients: [], // Will be populated from detailed API call if needed
      instructions: [],
      tags: apiRecipe.keywords
        ?.map((k) => k.name || k.label || '')
        .filter(Boolean) || [],
    });

    const uiRecipes = apiRecipes.map(convertToUiRecipe);

    if (selectedIngredients.length === 0) {
      return uiRecipes.map((r) => ({ ...r, matchCount: 0, matchPercentage: 0 }));
    }

    const selectedNames = selectedIngredients.map((i) => i.name.toLowerCase());

    return uiRecipes
      .map((recipe) => {
        // Match based on recipe name, description, and tags
        const searchContent = [
          recipe.title.toLowerCase(),
          recipe.description.toLowerCase(),
          ...recipe.tags.map((t: string) => t?.toLowerCase() || ''),
        ].join(' ');

        const matched = selectedNames.filter((name) =>
          searchContent.includes(name) || name.includes(searchContent.split(' ').find((w: string) => w.length > 2) || '')
        );
        const matchCount = matched.length;
        const matchPercentage = selectedNames.length > 0 ? Math.round((matchCount / selectedNames.length) * 100) : 0;
        return { ...recipe, matchCount, matchPercentage };
      })
      .sort((a, b) => {
        // Sort by match percentage first, then by match count
        if (b.matchPercentage !== a.matchPercentage) {
          return b.matchPercentage - a.matchPercentage;
        }
        return b.matchCount - a.matchCount;
      });
  }, [apiRecipes, selectedIngredients]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-[var(--fresh-green)]/10 text-[var(--fresh-green)]';
      case 'medium':
        return 'bg-[var(--warm-orange)]/10 text-[var(--warm-orange)]';
      case 'hard':
        return 'bg-[var(--tomato-red)]/10 text-[var(--tomato-red)]';
      default:
        return 'bg-[var(--warm-beige)] text-[var(--text-brown-light)]';
    }
  };

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return '简单';
      case 'medium':
        return '中等';
      case 'hard':
        return '困难';
      default:
        return difficulty;
    }
  };

  return (
    <section id="recipes" className="py-20 bg-[var(--warm-beige)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-white rounded-full px-4 py-2 mb-4 shadow-sm">
            <ChefHat className="w-4 h-4 text-[var(--warm-orange)]" />
            <span className="text-sm font-medium text-[var(--warm-orange)]">推荐菜谱</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-[var(--text-brown)] mb-4">
            为你推荐的菜谱
          </h2>
          <p className="text-[var(--text-brown-light)]/70 max-w-lg mx-auto">
            {selectedIngredients.length > 0
              ? `基于你选择的 ${selectedIngredients.length} 种食材，为你推荐以下菜谱`
              : '浏览我们的精选菜谱，找到你的下一餐灵感'}
          </p>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 text-[var(--warm-orange)] animate-spin" />
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-20">
            <p className="text-[var(--tomato-red)]">{error}</p>
          </div>
        )}

        {/* Recipe Grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {matchedRecipes.map((recipe, index) => (
              <motion.div
                key={recipe.id}
                layout
                initial={{ opacity: 0, y: 30, rotateX: 15 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.1,
                  ease: [0.16, 1, 0.3, 1],
                }}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                className="group"
              >
                <Link to={`/recipe/${recipe.id}`} target="_blank">
                  <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-warm-lg transition-all duration-300">
                    {/* Image */}
                    <div className="relative h-48 overflow-hidden">
                      <motion.img
                        src={recipe.image}
                        alt={recipe.title}
                        className="w-full h-full object-cover"
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.6 }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      
                      {/* Match Badge */}
                      {selectedIngredients.length > 0 && (recipe as any).matchPercentage > 0 && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute top-3 left-3"
                        >
                          <Badge className="bg-[var(--fresh-green)] text-white border-0">
                            匹配度 {(recipe as any).matchPercentage}%
                          </Badge>
                        </motion.div>
                      )}

                      {/* Difficulty Badge */}
                      <div className="absolute bottom-3 left-3">
                        <Badge className={`${getDifficultyColor(recipe.difficulty)} border-0`}>
                          {getDifficultyText(recipe.difficulty)}
                        </Badge>
                      </div>

                      {/* Time Badge */}
                      <div className="absolute bottom-3 right-3 flex items-center gap-1 text-white text-sm">
                        <Clock className="w-4 h-4" />
                        {recipe.cookTime}分钟
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <h3 className="text-lg font-serif font-bold text-[var(--text-brown)] mb-2 group-hover:text-[var(--warm-orange)] transition-colors">
                        {recipe.title}
                      </h3>
                      <p className="text-sm text-[var(--text-brown-light)]/70 line-clamp-2 mb-4">
                        {recipe.description}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {recipe.tags
                          .filter(Boolean)
                          .slice(0, 3)
                          .map((tag, tagIndex) => (
                          <span
                            key={`${tag}-${tagIndex}`}
                            className="text-xs px-2 py-1 bg-[var(--warm-cream)] text-[var(--text-brown-light)] rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-4 border-t border-[var(--warm-beige)]">
                        <div className="flex items-center gap-4 text-sm text-[var(--text-brown-light)]/60">
                          <span className="flex items-center gap-1">
                            <Flame className="w-4 h-4" />
                            {recipe.calories}卡
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {recipe.ingredients.length}种食材
                          </span>
                        </div>
                        <motion.div
                          className="text-[var(--warm-orange)] font-medium text-sm flex items-center gap-1"
                          whileHover={{ x: 4 }}
                        >
                          查看做法
                          <ArrowRight className="w-4 h-4" />
                        </motion.div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </section>
  );
}
