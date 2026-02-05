import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Search, Refrigerator, Sparkles } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { presetIngredients } from '@/data/ingredients';
import { categoryLabels, categoryIcons, type Ingredient } from '@/types';

interface IngredientInputProps {
  selectedIngredients: Ingredient[];
  onIngredientsChange: (ingredients: Ingredient[]) => void;
}

export function IngredientInput({ selectedIngredients, onIngredientsChange }: IngredientInputProps) {
  const [inputValue, setInputValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [suggestions, setSuggestions] = useState<Ingredient[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputValue.trim()) {
      const filtered = presetIngredients.filter(
        (ing) =>
          ing.name.toLowerCase().includes(inputValue.toLowerCase()) &&
          !selectedIngredients.find((s) => s.id === ing.id)
      );
      setSuggestions(filtered.slice(0, 6));
    } else {
      setSuggestions([]);
    }
  }, [inputValue, selectedIngredients]);

  const addIngredient = (ingredient: Ingredient) => {
    if (!selectedIngredients.find((i) => i.id === ingredient.id)) {
      onIngredientsChange([...selectedIngredients, ingredient]);
    }
    setInputValue('');
    setSuggestions([]);
    inputRef.current?.focus();
  };

  const removeIngredient = (id: string) => {
    onIngredientsChange(selectedIngredients.filter((i) => i.id !== id));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      const existing = presetIngredients.find(
        (ing) => ing.name.toLowerCase() === inputValue.toLowerCase()
      );
      if (existing) {
        addIngredient(existing);
      } else {
        // Create custom ingredient
        const newIngredient: Ingredient = {
          id: `custom-${Date.now()}`,
          name: inputValue.trim(),
          category: 'other',
        };
        addIngredient(newIngredient);
      }
    }
  };

  const groupedByCategory = selectedIngredients.reduce((acc, ing) => {
    if (!acc[ing.category]) acc[ing.category] = [];
    acc[ing.category].push(ing);
    return acc;
  }, {} as Record<string, Ingredient[]>);

  return (
    <section id="ingredients" className="py-20 bg-[var(--warm-cream)]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-[var(--warm-orange)]/10 rounded-full px-4 py-2 mb-4">
            <Refrigerator className="w-4 h-4 text-[var(--warm-orange)]" />
            <span className="text-sm font-medium text-[var(--warm-orange)]">我的冰箱</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-[var(--text-brown)] mb-4">
            今天冰箱里有什么？
          </h2>
          <p className="text-[var(--text-brown-light)]/70 max-w-lg mx-auto">
            添加你现有的食材，我们会为你推荐最合适的菜谱
          </p>
        </motion.div>

        {/* Input Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative mb-8"
        >
          <div
            className={`relative flex items-center gap-2 bg-white border-2 rounded-2xl p-2 transition-all duration-300 ${
              isFocused
                ? 'border-[var(--warm-orange)] shadow-warm'
                : 'border-[var(--warm-beige)] hover:border-[var(--warm-orange)]/30'
            }`}
          >
            <Search className="w-5 h-5 text-[var(--text-brown-light)]/50 ml-3" />
            <Input
              ref={inputRef}
              type="text"
              placeholder="输入食材名称..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setTimeout(() => setIsFocused(false), 200)}
              onKeyDown={handleKeyDown}
              className="flex-1 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-lg placeholder:text-[var(--text-brown-light)]/40"
            />
            <Button
              onClick={() => {
                if (inputValue.trim()) {
                  handleKeyDown({ key: 'Enter' } as React.KeyboardEvent);
                }
              }}
              className="bg-[var(--warm-orange)] hover:bg-[var(--warm-orange-dark)] text-white rounded-xl px-6"
            >
              <Plus className="w-5 h-5 mr-1" />
              添加
            </Button>
          </div>

          {/* Suggestions Dropdown */}
          <AnimatePresence>
            {suggestions.length > 0 && isFocused && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-warm-lg border border-[var(--warm-beige)] overflow-hidden z-20"
              >
                {suggestions.map((ingredient, index) => (
                  <motion.button
                    key={ingredient.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => addIngredient(ingredient)}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[var(--warm-cream)] transition-colors text-left"
                  >
                    <span className="text-2xl">{categoryIcons[ingredient.category]}</span>
                    <span className="flex-1 text-[var(--text-brown)]">{ingredient.name}</span>
                    <span className="text-xs text-[var(--text-brown-light)]/60">{categoryLabels[ingredient.category]}</span>
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Quick Add Tags */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-8"
        >
          <p className="text-sm text-[var(--text-brown-light)]/60 mb-3">快速添加：</p>
          <div className="flex flex-wrap gap-2">
            {presetIngredients.slice(0, 12).map((ingredient) => (
              <motion.button
                key={ingredient.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => addIngredient(ingredient)}
                disabled={selectedIngredients.some((i) => i.id === ingredient.id)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm transition-all ${
                  selectedIngredients.some((i) => i.id === ingredient.id)
                    ? 'bg-[var(--warm-beige)] text-[var(--text-brown-light)]/50 cursor-not-allowed'
                    : 'bg-white text-[var(--text-brown)] hover:bg-[var(--warm-orange)] hover:text-white shadow-sm hover:shadow-warm'
                }`}
              >
                <span>{categoryIcons[ingredient.category]}</span>
                {ingredient.name}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Selected Ingredients */}
        <AnimatePresence mode="wait">
          {selectedIngredients.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white rounded-2xl p-6 shadow-warm"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-[var(--text-brown)]">已选食材</h3>
                <span className="text-sm text-[var(--warm-orange)] font-medium">
                  {selectedIngredients.length} 种
                </span>
              </div>

              <div className="space-y-4">
                {Object.entries(groupedByCategory).map(([category, ingredients]) => (
                  <div key={category}>
                    <p className="text-xs text-[var(--text-brown-light)]/60 mb-2">{categoryLabels[category as keyof typeof categoryLabels]}</p>
                    <div className="flex flex-wrap gap-2">
                      <AnimatePresence>
                        {ingredients.map((ingredient) => (
                          <motion.span
                            key={ingredient.id}
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0 }}
                            layout
                            className="inline-flex items-center gap-1.5 bg-[var(--warm-cream)] border border-[var(--warm-beige)] rounded-full px-3 py-1.5 text-sm text-[var(--text-brown)]"
                          >
                            <span>{categoryIcons[ingredient.category]}</span>
                            {ingredient.name}
                            <button
                              onClick={() => removeIngredient(ingredient.id)}
                              className="ml-1 p-0.5 hover:bg-[var(--warm-orange)]/10 rounded-full transition-colors"
                            >
                              <X className="w-3.5 h-3.5 text-[var(--text-brown-light)]" />
                            </button>
                          </motion.span>
                        ))}
                      </AnimatePresence>
                    </div>
                  </div>
                ))}
              </div>

              {/* Clear All */}
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={() => onIngredientsChange([])}
                className="mt-4 text-sm text-[var(--text-brown-light)]/60 hover:text-[var(--warm-orange)] transition-colors"
              >
                清空所有
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty State */}
        {selectedIngredients.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-[var(--warm-cream)] flex items-center justify-center">
              <Sparkles className="w-10 h-10 text-[var(--warm-orange)]/40" />
            </div>
            <p className="text-[var(--text-brown-light)]/60">还没有添加食材，开始添加吧！</p>
          </motion.div>
        )}
      </div>
    </section>
  );
}
