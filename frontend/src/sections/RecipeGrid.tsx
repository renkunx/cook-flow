import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Flame, ChefHat, Users, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { recipes } from '@/data/recipes';
import type { Ingredient } from '@/types';
import { Badge } from '@/components/ui/badge';

interface RecipeGridProps {
  selectedIngredients: Ingredient[];
}

export function RecipeGrid({ selectedIngredients }: RecipeGridProps) {
  // Calculate recipe matches based on selected ingredients
  const matchedRecipes = useMemo(() => {
    if (selectedIngredients.length === 0) {
      return recipes.map((r) => ({ ...r, matchCount: 0, matchPercentage: 0 }));
    }

    const selectedNames = selectedIngredients.map((i) => i.name.toLowerCase());

    return recipes
      .map((recipe) => {
        const matched = recipe.ingredients.filter((ing) =>
          selectedNames.some((name) => ing.toLowerCase().includes(name) || name.includes(ing.toLowerCase()))
        );
        const matchCount = matched.length;
        const matchPercentage = Math.round((matchCount / recipe.ingredients.length) * 100);
        return { ...recipe, matchCount, matchPercentage };
      })
      .sort((a, b) => {
        // Sort by match percentage first, then by match count
        if (b.matchPercentage !== a.matchPercentage) {
          return b.matchPercentage - a.matchPercentage;
        }
        return b.matchCount - a.matchCount;
      });
  }, [selectedIngredients]);

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

        {/* Recipe Grid */}
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
                        {recipe.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
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
      </div>
    </section>
  );
}
