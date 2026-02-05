import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingCart,
  Check,
  Trash2,
  Download,
  Share2,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import type { ShoppingItem } from '@/types';
import { categoryLabels, categoryIcons } from '@/types';

interface ShoppingListProps {
  items: ShoppingItem[];
  onToggleItem: (id: string) => void;
  onRemoveItem: (id: string) => void;
  onClearChecked: () => void;
}

export function ShoppingList({
  items,
  onToggleItem,
  onRemoveItem,
  onClearChecked,
}: ShoppingListProps) {
  const [filter, setFilter] = useState<'all' | 'unchecked' | 'checked'>('all');

  const filteredItems = items.filter((item) => {
    if (filter === 'unchecked') return !item.checked;
    if (filter === 'checked') return item.checked;
    return true;
  });

  // Group by category
  const groupedByCategory = filteredItems.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, ShoppingItem[]>);

  const checkedCount = items.filter((i) => i.checked).length;
  const uncheckedCount = items.filter((i) => !i.checked).length;

  // Generate shopping list text
  const generateListText = () => {
    let text = '🛒 购物清单\n\n';
    Object.entries(groupedByCategory).forEach(([category, categoryItems]) => {
      text += `${categoryIcons[category as keyof typeof categoryIcons]} ${categoryLabels[category as keyof typeof categoryLabels]}\n`;
      categoryItems.forEach((item) => {
        text += `  ${item.checked ? '✓' : '○'} ${item.name} ${item.quantity}${item.unit}\n`;
      });
      text += '\n';
    });
    text += `\n总计: ${items.length} 项，已完成 ${checkedCount} 项`;
    return text;
  };

  const handleShare = () => {
    const text = generateListText();
    if (navigator.share) {
      navigator.share({
        title: '我的购物清单',
        text,
      });
    } else {
      navigator.clipboard.writeText(text);
      alert('购物清单已复制到剪贴板');
    }
  };

  const handleDownload = () => {
    const text = generateListText();
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = '购物清单.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[var(--warm-cream)] pt-20">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border-b border-[var(--warm-beige)]"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-serif font-bold text-[var(--text-brown)]">购物清单</h1>
            <div className="flex items-center gap-2">
              {items.length > 0 && (
                <>
                  <button
                    onClick={handleShare}
                    className="p-2 text-[var(--text-brown-light)] hover:text-[var(--warm-orange)] hover:bg-[var(--warm-orange)]/10 rounded-full transition-colors"
                  >
                    <Share2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleDownload}
                    className="p-2 text-[var(--text-brown-light)] hover:text-[var(--fresh-green)] hover:bg-[var(--fresh-green)]/10 rounded-full transition-colors"
                  >
                    <Download className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress */}
        {items.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="bg-white rounded-2xl p-6 shadow-warm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-[var(--text-brown-light)]/60">采购进度</p>
                  <p className="text-2xl font-bold text-[var(--text-brown)]">
                    {checkedCount} <span className="text-[var(--text-brown-light)]/40">/ {items.length}</span>
                  </p>
                </div>
                <div className="w-24 h-24 relative">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="var(--warm-beige)"
                      strokeWidth="3"
                    />
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="var(--warm-orange)"
                      strokeWidth="3"
                      strokeDasharray={`${(checkedCount / items.length) * 100}, 100`}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-lg font-bold text-[var(--warm-orange)]">
                      {Math.round((checkedCount / items.length) * 100)}%
                    </span>
                  </div>
                </div>
              </div>
              <div className="w-full h-2 bg-[var(--warm-beige)] rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-[var(--warm-orange)] rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${(checkedCount / items.length) * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
          </motion.div>
        )}

        {/* Filter Tabs */}
        {items.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-2 mb-6"
          >
            {[
              { key: 'all', label: '全部', count: items.length },
              { key: 'unchecked', label: '待购买', count: uncheckedCount },
              { key: 'checked', label: '已购买', count: checkedCount },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key as any)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  filter === tab.key
                    ? 'bg-[var(--warm-orange)] text-white'
                    : 'bg-white text-[var(--text-brown)] hover:bg-[var(--warm-cream)]'
                }`}
              >
                {tab.label}
                <span className="ml-1 text-xs opacity-70">({tab.count})</span>
              </button>
            ))}
          </motion.div>
        )}

        {/* Empty State */}
        {items.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="w-24 h-24 rounded-full bg-[var(--warm-cream)] flex items-center justify-center mx-auto mb-6">
              <ShoppingCart className="w-12 h-12 text-[var(--warm-orange)]" />
            </div>
            <h2 className="text-2xl font-serif font-bold text-[var(--text-brown)] mb-2">
              购物清单是空的
            </h2>
            <p className="text-[var(--text-brown-light)]/60 mb-6">从菜谱中添加缺失的食材，生成你的购物清单</p>
            <Link to="/" target="_blank">
              <Button
                className="bg-[var(--warm-orange)] hover:bg-[var(--warm-orange-dark)] text-white rounded-full"
              >
                浏览菜谱
              </Button>
            </Link>
          </motion.div>
        )}

        {/* Shopping List */}
        <AnimatePresence mode="popLayout">
          {Object.entries(groupedByCategory).map(([category, categoryItems], catIndex) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: catIndex * 0.1 }}
              className="mb-6"
            >
              {/* Category Header */}
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">{categoryIcons[category as keyof typeof categoryIcons]}</span>
                <span className="font-medium text-[var(--text-brown)]">
                  {categoryLabels[category as keyof typeof categoryLabels]}
                </span>
                <span className="text-sm text-[var(--text-brown-light)]/60">({categoryItems.length})</span>
              </div>

              {/* Items */}
              <div className="space-y-2">
                <AnimatePresence>
                  {categoryItems.map((item, idx) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: idx * 0.05 }}
                      className={`flex items-center gap-3 p-4 bg-white rounded-xl transition-all ${
                        item.checked ? 'opacity-60' : ''
                      }`}
                    >
                      <button
                        onClick={() => onToggleItem(item.id)}
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                          item.checked
                            ? 'bg-[var(--fresh-green)] border-[var(--fresh-green)]'
                            : 'border-[var(--warm-beige)] hover:border-[var(--fresh-green)]'
                        }`}
                      >
                        {item.checked && <Check className="w-4 h-4 text-white" />}
                      </button>
                      <div className="flex-1">
                        <p
                          className={`font-medium ${
                            item.checked ? 'line-through text-[var(--text-brown-light)]/40' : 'text-[var(--text-brown)]'
                          }`}
                        >
                          {item.name}
                        </p>
                        {item.recipeTitle && (
                          <p className="text-xs text-[var(--text-brown-light)]/60">来自: {item.recipeTitle}</p>
                        )}
                      </div>
                      <span className="text-sm text-[var(--text-brown-light)]/60">
                        {item.quantity}
                        {item.unit}
                      </span>
                      <button
                        onClick={() => onRemoveItem(item.id)}
                        className="p-2 text-[var(--text-brown-light)]/40 hover:text-[var(--tomato-red)] hover:bg-[var(--tomato-red)]/10 rounded-full transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Clear Checked Button */}
        {checkedCount > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-8 text-center"
          >
            <button
              onClick={onClearChecked}
              className="text-[var(--text-brown-light)]/60 hover:text-[var(--tomato-red)] text-sm flex items-center gap-2 mx-auto"
            >
              <Trash2 className="w-4 h-4" />
              清除已购买的物品
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
