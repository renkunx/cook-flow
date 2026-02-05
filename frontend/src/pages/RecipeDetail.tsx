import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Clock,
  Flame,
  ChefHat,
  Check,
  Plus,
  Minus,
  AlertCircle,
} from 'lucide-react';
import { recipes } from '@/data/recipes';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import type { Ingredient, CookingSchedule, ShoppingItem } from '@/types';
import { categoryIcons } from '@/types';

interface RecipeDetailProps {
  fridgeIngredients: Ingredient[];
  onAddToSchedule: (schedule: CookingSchedule) => void;
  onAddToShoppingList: (items: ShoppingItem[]) => void;
}

export function RecipeDetail({
  fridgeIngredients,
  onAddToSchedule,
  onAddToShoppingList,
}: RecipeDetailProps) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [showScheduleDialog, setShowScheduleDialog] = useState(false);
  const [showShoppingDialog, setShowShoppingDialog] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState('18:00');
  const [servings, setServings] = useState(2);

  const recipe = recipes.find((r) => r.id === id);

  useEffect(() => {
    if (!recipe) {
      navigate('/');
    }
  }, [recipe, navigate]);

  if (!recipe) return null;

  // Compare recipe ingredients with fridge ingredients
  const ingredientComparison = useMemo(() => {
    return recipe.ingredients.map((ing) => {
      const matched = fridgeIngredients.find(
        (fi) =>
          fi.name.toLowerCase().includes(ing.toLowerCase()) ||
          ing.toLowerCase().includes(fi.name.toLowerCase())
      );
      return {
        name: ing,
        inFridge: !!matched,
        matchedIngredient: matched,
      };
    });
  }, [recipe.ingredients, fridgeIngredients]);

  const missingIngredients = ingredientComparison.filter((i) => !i.inFridge);
  const hasIngredients = ingredientComparison.filter((i) => i.inFridge);

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

  const handleAddToSchedule = () => {
    if (selectedDate) {
      const schedule: CookingSchedule = {
        id: `schedule-${Date.now()}`,
        recipeId: recipe.id,
        recipeTitle: recipe.title,
        recipeImage: recipe.image,
        plannedDate: selectedDate.toISOString().split('T')[0],
        plannedTime: selectedTime,
        servings,
      };
      onAddToSchedule(schedule);
      setShowScheduleDialog(false);
    }
  };

  const handleAddMissingToShoppingList = () => {
    const items: ShoppingItem[] = missingIngredients.map((ing, index) => ({
      id: `shopping-${Date.now()}-${index}`,
      name: ing.name,
      category: 'other',
      quantity: servings,
      unit: '份',
      checked: false,
      recipeId: recipe.id,
      recipeTitle: recipe.title,
    }));
    onAddToShoppingList(items);
    setShowShoppingDialog(false);
  };

  return (
    <div className="min-h-screen bg-[var(--warm-cream)]">
      {/* Hero Image */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative h-[50vh] max-h-[500px]"
      >
        <img
          src={recipe.image}
          alt={recipe.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex flex-wrap gap-2 mb-4">
                {recipe.tags.map((tag) => (
                  <Badge
                    key={tag}
                    className="bg-white/20 backdrop-blur-sm text-white border-0"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">
                {recipe.title}
              </h1>
              <p className="text-white/80 text-lg max-w-2xl">{recipe.description}</p>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column - Instructions */}
          <div className="lg:col-span-2">
            {/* Quick Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap gap-6 mb-8 p-6 bg-white rounded-2xl shadow-warm"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[var(--warm-cream)] flex items-center justify-center">
                  <Clock className="w-5 h-5 text-[var(--warm-orange)]" />
                </div>
                <div>
                  <p className="text-sm text-[var(--text-brown-light)]/60">烹饪时间</p>
                  <p className="font-medium text-[var(--text-brown)]">{recipe.cookTime} 分钟</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[var(--warm-cream)] flex items-center justify-center">
                  <Flame className="w-5 h-5 text-[var(--tomato-red)]" />
                </div>
                <div>
                  <p className="text-sm text-[var(--text-brown-light)]/60">卡路里</p>
                  <p className="font-medium text-[var(--text-brown)]">{recipe.calories} 卡</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[var(--warm-cream)] flex items-center justify-center">
                  <ChefHat className="w-5 h-5 text-[var(--fresh-green)]" />
                </div>
                <div>
                  <p className="text-sm text-[var(--text-brown-light)]/60">难度</p>
                  <Badge className={`${getDifficultyColor(recipe.difficulty)} border-0 mt-1`}>
                    {getDifficultyText(recipe.difficulty)}
                  </Badge>
                </div>
              </div>
            </motion.div>

            {/* Instructions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h2 className="text-2xl font-serif font-bold text-[var(--text-brown)] mb-6">
                烹饪步骤
              </h2>
              <div className="space-y-6">
                {recipe.instructions.map((step, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="flex gap-4"
                  >
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[var(--warm-orange)] text-white flex items-center justify-center font-bold">
                      {index + 1}
                    </div>
                    <div className="flex-1 pt-2">
                      <p className="text-[var(--text-brown)]/80 leading-relaxed">{step}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Column - Ingredients */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="lg:sticky lg:top-24 lg:self-start"
          >
            <div className="bg-white rounded-2xl p-6 shadow-warm">
              <h2 className="text-xl font-serif font-bold text-[var(--text-brown)] mb-4">
                所需食材
              </h2>

              {/* Ingredient Stats */}
              <div className="flex items-center gap-4 mb-6 p-4 bg-[var(--warm-cream)] rounded-xl">
                <div className="flex-1 text-center">
                  <p className="text-2xl font-bold text-[var(--fresh-green)]">{hasIngredients.length}</p>
                  <p className="text-xs text-[var(--text-brown-light)]/60">已有</p>
                </div>
                <div className="w-px h-10 bg-[var(--warm-beige)]" />
                <div className="flex-1 text-center">
                  <p className="text-2xl font-bold text-[var(--warm-orange)]">{missingIngredients.length}</p>
                  <p className="text-xs text-[var(--text-brown-light)]/60">需购买</p>
                </div>
              </div>

              {/* Ingredient List */}
              <div className="space-y-3">
                {/* Has Ingredients */}
                {hasIngredients.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-[var(--fresh-green)] mb-2 flex items-center gap-2">
                      <Check className="w-4 h-4" />
                      冰箱已有
                    </p>
                    <div className="space-y-2">
                      {hasIngredients.map((ing, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2 p-3 bg-[var(--warm-cream)] rounded-lg"
                        >
                          <span className="text-lg">
                            {ing.matchedIngredient
                              ? categoryIcons[ing.matchedIngredient.category]
                              : '📦'}
                          </span>
                          <span className="flex-1 text-[var(--text-brown)]">{ing.name}</span>
                          <Check className="w-4 h-4 text-[var(--fresh-green)]" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Missing Ingredients */}
                {missingIngredients.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-[var(--warm-orange)] mb-2 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      需要购买
                    </p>
                    <div className="space-y-2">
                      {missingIngredients.map((ing, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2 p-3 bg-[var(--warm-cream)] rounded-lg border border-[var(--warm-orange)]/20"
                        >
                          <span className="text-lg">📦</span>
                          <span className="flex-1 text-[var(--text-brown)]">{ing.name}</span>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-[var(--warm-orange)] hover:text-[var(--warm-orange)] hover:bg-[var(--warm-orange)]/10"
                            onClick={() => {
                              const item: ShoppingItem = {
                                id: `shopping-${Date.now()}-${idx}`,
                                name: ing.name,
                                category: 'other',
                                quantity: servings,
                                unit: '份',
                                checked: false,
                                recipeId: recipe.id,
                                recipeTitle: recipe.title,
                              };
                              onAddToShoppingList([item]);
                            }}
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Add All to Shopping List */}
              {missingIngredients.length > 0 && (
                <Button
                  className="w-full mt-4 bg-[var(--warm-orange)] hover:bg-[var(--warm-orange-dark)] text-white rounded-xl"
                  onClick={() => setShowShoppingDialog(true)}
                >
                  将缺失食材加入购物清单
                </Button>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Schedule Dialog */}
      <Dialog open={showScheduleDialog} onOpenChange={setShowScheduleDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-serif text-[var(--text-brown)]">加入做饭日程</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4">
            {/* Date Selection */}
            <div>
              <label className="text-sm font-medium text-[var(--text-brown)] mb-2 block">
                选择日期
              </label>
              <CalendarComponent
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border border-[var(--warm-beige)]"
              />
            </div>

            {/* Time Selection */}
            <div>
              <label className="text-sm font-medium text-[var(--text-brown)] mb-2 block">
                用餐时间
              </label>
              <select
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="w-full p-3 border border-[var(--warm-beige)] rounded-xl bg-white text-[var(--text-brown)]"
              >
                <option value="07:00">早餐 (07:00)</option>
                <option value="12:00">午餐 (12:00)</option>
                <option value="18:00">晚餐 (18:00)</option>
                <option value="20:00">夜宵 (20:00)</option>
              </select>
            </div>

            {/* Servings */}
            <div>
              <label className="text-sm font-medium text-[var(--text-brown)] mb-2 block">
                用餐人数
              </label>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setServings(Math.max(1, servings - 1))}
                  className="w-10 h-10 rounded-full bg-[var(--warm-cream)] flex items-center justify-center hover:bg-[var(--warm-beige)] transition-colors"
                >
                  <Minus className="w-4 h-4 text-[var(--text-brown)]" />
                </button>
                <span className="text-xl font-medium w-8 text-center text-[var(--text-brown)]">{servings}</span>
                <button
                  onClick={() => setServings(servings + 1)}
                  className="w-10 h-10 rounded-full bg-[var(--warm-cream)] flex items-center justify-center hover:bg-[var(--warm-beige)] transition-colors"
                >
                  <Plus className="w-4 h-4 text-[var(--text-brown)]" />
                </button>
              </div>
            </div>

            <Button
              className="w-full bg-[var(--warm-orange)] hover:bg-[var(--warm-orange-dark)] text-white rounded-xl"
              onClick={handleAddToSchedule}
              disabled={!selectedDate}
            >
              确认加入日程
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Shopping Dialog */}
      <Dialog open={showShoppingDialog} onOpenChange={setShowShoppingDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-serif text-[var(--text-brown)]">加入购物清单</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-[var(--text-brown-light)] mb-4">
              以下 {missingIngredients.length} 种食材将加入购物清单：
            </p>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {missingIngredients.map((ing, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 p-3 bg-[var(--warm-cream)] rounded-lg"
                >
                  <span className="text-lg">📦</span>
                  <span className="flex-1 text-[var(--text-brown)]">{ing.name}</span>
                  <span className="text-sm text-[var(--text-brown-light)]/60">{servings}份</span>
                </div>
              ))}
            </div>
            <Button
              className="w-full mt-6 bg-[var(--warm-orange)] hover:bg-[var(--warm-orange-dark)] text-white rounded-xl"
              onClick={handleAddMissingToShoppingList}
            >
              加入购物清单
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
