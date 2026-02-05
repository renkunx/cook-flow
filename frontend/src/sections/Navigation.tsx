import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Calendar, ShoppingCart, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link, useLocation, useParams } from 'react-router-dom';
import { recipes } from '@/data/recipes';
import type { CookingSchedule, ShoppingItem } from '@/types';

interface NavigationProps {
  scheduleCount?: number;
  shoppingCount?: number;
  isRecipeDetail?: boolean;
  onAddToSchedule?: (schedule: CookingSchedule) => void;
  onAddToShoppingList?: (items: ShoppingItem[]) => void;
}

export function Navigation({ 
  scheduleCount = 0, 
  shoppingCount = 0,
  isRecipeDetail = false,
  onAddToSchedule,
  onAddToShoppingList,
}: NavigationProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showAddedToast, setShowAddedToast] = useState<'schedule' | 'shopping' | null>(null);
  const location = useLocation();
  const { id } = useParams<{ id: string }>();
  
  const isHomePage = location.pathname === '/';
  
  // 获取当前菜谱信息
  const currentRecipe = isRecipeDetail && id ? recipes.find(r => r.id === id) : null;

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Always show at top
      if (currentScrollY < 80) {
        setIsVisible(true);
      } else {
        // Hide when scrolling down, show when scrolling up
        if (currentScrollY > lastScrollY) {
          setIsVisible(false);
        } else {
          setIsVisible(true);
        }
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // 显示添加成功提示
  const showToast = (type: 'schedule' | 'shopping') => {
    setShowAddedToast(type);
    setTimeout(() => setShowAddedToast(null), 2000);
  };

  // 快速加入日程
  const handleQuickAddSchedule = () => {
    if (currentRecipe && onAddToSchedule) {
      const schedule: CookingSchedule = {
        id: `schedule-${Date.now()}`,
        recipeId: currentRecipe.id,
        recipeTitle: currentRecipe.title,
        recipeImage: currentRecipe.image,
        plannedDate: new Date().toISOString().split('T')[0],
        plannedTime: '18:00',
        servings: 2,
      };
      onAddToSchedule(schedule);
      showToast('schedule');
    }
  };

  // 快速加入购物清单
  const handleQuickAddShopping = () => {
    if (currentRecipe && onAddToShoppingList) {
      const items: ShoppingItem[] = currentRecipe.ingredients.map((ing, index) => ({
        id: `shopping-${Date.now()}-${index}`,
        name: ing,
        category: 'other',
        quantity: 2,
        unit: '份',
        checked: false,
        recipeId: currentRecipe.id,
        recipeTitle: currentRecipe.title,
      }));
      onAddToShoppingList(items);
      showToast('shopping');
    }
  };

  const navLinks = [
    { label: '我的冰箱', href: '#ingredients' },
    { label: '热门菜谱', href: '#recipes' },
    { label: '用户好评', href: '#testimonials' },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: isVisible ? 0 : -100 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 left-0 right-0 z-50 py-3"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="flex items-center justify-between bg-white/90 backdrop-blur-xl shadow-warm rounded-full px-5 py-2.5"
          >
            {/* Logo */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link to="/" className="flex items-center gap-3 group">
                <div className="w-10 h-10 rounded-full overflow-hidden shadow-sm">
                  <img 
                    src="/logo.jpg" 
                    alt="下厨有谱" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="font-serif text-lg font-bold text-[var(--text-brown)] leading-tight">
                    下厨有谱
                  </span>
                  <span className="text-[10px] text-[var(--text-brown-light)] leading-tight hidden sm:block">
                    承包你的一日三餐
                  </span>
                </div>
              </Link>
            </motion.div>

            {/* Desktop Navigation - Only on Home Page */}
            {isHomePage && (
              <div className="hidden md:flex items-center gap-6">
                {navLinks.map((link, index) => (
                  <motion.a
                    key={link.label}
                    href={link.href}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                    className="relative text-sm font-medium text-[var(--text-brown-light)] hover:text-[var(--warm-orange)] transition-colors"
                    whileHover={{ y: -1 }}
                  >
                    {link.label}
                    <motion.span
                      className="absolute -bottom-0.5 left-0 w-full h-0.5 bg-[var(--warm-orange)] origin-left"
                      initial={{ scaleX: 0 }}
                      whileHover={{ scaleX: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  </motion.a>
                ))}
              </div>
            )}

            {/* Action Buttons */}
            <div className="hidden md:flex items-center gap-2">
              {/* 菜谱详情页特有操作 */}
              {isRecipeDetail && currentRecipe && (
                <>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleQuickAddShopping}
                    className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-[var(--fresh-green)] bg-[var(--fresh-green)]/10 hover:bg-[var(--fresh-green)]/20 rounded-full transition-colors"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    加入购物
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleQuickAddSchedule}
                    className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-white bg-[var(--warm-orange)] hover:bg-[var(--warm-orange-dark)] rounded-full transition-colors"
                  >
                    <Calendar className="w-4 h-4" />
                    加入日程
                  </motion.button>
                </>
              )}

              {/* 全局导航按钮 */}
              <Link to="/schedule" target="_blank">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative p-2.5 text-[var(--text-brown-light)] hover:text-[var(--warm-orange)] hover:bg-[var(--warm-orange)]/10 rounded-full transition-colors"
                >
                  <Calendar className="w-5 h-5" />
                  {scheduleCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-[var(--warm-orange)] text-white text-xs rounded-full flex items-center justify-center font-medium">
                      {scheduleCount}
                    </span>
                  )}
                </motion.button>
              </Link>
              <Link to="/shopping" target="_blank">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative p-2.5 text-[var(--text-brown-light)] hover:text-[var(--fresh-green)] hover:bg-[var(--fresh-green)]/10 rounded-full transition-colors"
                >
                  <ShoppingCart className="w-5 h-5" />
                  {shoppingCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-[var(--fresh-green)] text-white text-xs rounded-full flex items-center justify-center font-medium">
                      {shoppingCount}
                    </span>
                  )}
                </motion.button>
              </Link>
              
              {!isRecipeDetail && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
                  className="ml-2"
                >
                  <Link to="/">
                    <Button
                      className="bg-[var(--warm-orange)] hover:bg-[var(--warm-orange-dark)] text-white rounded-full px-5 py-2 text-sm font-medium shadow-warm hover:shadow-warm-lg transition-all"
                    >
                      开始烹饪
                    </Button>
                  </Link>
                </motion.div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-[var(--text-brown)]"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </motion.div>
        </div>
      </motion.nav>

      {/* Toast Notification */}
      <AnimatePresence>
        {showAddedToast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-[60]"
          >
            <div className="bg-[var(--fresh-green)] text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
              <Check className="w-4 h-4" />
              <span className="text-sm font-medium">
                {showAddedToast === 'schedule' ? '已加入日程' : '已加入购物清单'}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-x-0 top-20 z-40 bg-white/95 backdrop-blur-xl shadow-warm-lg mx-4 rounded-2xl p-6 md:hidden"
          >
            <div className="flex flex-col gap-4">
              {/* 菜谱详情页特有操作 */}
              {isRecipeDetail && currentRecipe && (
                <>
                  <button
                    onClick={() => {
                      handleQuickAddSchedule();
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-3 text-lg font-medium text-[var(--warm-orange)] py-2 border-b border-[var(--warm-beige)]"
                  >
                    <Calendar className="w-5 h-5" />
                    加入做饭日程
                  </button>
                  <button
                    onClick={() => {
                      handleQuickAddShopping();
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-3 text-lg font-medium text-[var(--fresh-green)] py-2 border-b border-[var(--warm-beige)]"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    加入购物清单
                  </button>
                </>
              )}

              {isHomePage && navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-lg font-medium text-[var(--text-brown)] py-2 border-b border-[var(--warm-beige)]"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <Link
                to="/schedule"
                target="_blank"
                className="text-lg font-medium text-[var(--text-brown)] py-2 border-b border-[var(--warm-beige)] flex items-center justify-between"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-[var(--warm-orange)]" />
                  做饭日程
                </span>
                {scheduleCount > 0 && (
                  <span className="bg-[var(--warm-orange)] text-white text-xs px-2.5 py-1 rounded-full font-medium">
                    {scheduleCount}
                  </span>
                )}
              </Link>
              <Link
                to="/shopping"
                target="_blank"
                className="text-lg font-medium text-[var(--text-brown)] py-2 border-b border-[var(--warm-beige)] flex items-center justify-between"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span className="flex items-gap-2">
                  <ShoppingCart className="w-5 h-5 text-[var(--fresh-green)]" />
                  购物清单
                </span>
                {shoppingCount > 0 && (
                  <span className="bg-[var(--fresh-green)] text-white text-xs px-2.5 py-1 rounded-full font-medium">
                    {shoppingCount}
                  </span>
                )}
              </Link>
              {!isRecipeDetail && (
                <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button className="w-full bg-[var(--warm-orange)] hover:bg-[var(--warm-orange-dark)] text-white rounded-full mt-4 py-3">
                    开始烹饪
                  </Button>
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
