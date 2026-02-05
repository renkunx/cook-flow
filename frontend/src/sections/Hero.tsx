// Hero section component
import { motion } from 'framer-motion';
import { ArrowDown, Sparkles, ChefHat } from 'lucide-react';
import { Button } from '@/components/ui/button';

const floatingIngredients = [
  { icon: '🍅', delay: 0, x: '8%', y: '15%', duration: 5 },
  { icon: '🥬', delay: 0.5, x: '88%', y: '12%', duration: 6 },
  { icon: '🥕', delay: 1, x: '82%', y: '65%', duration: 4.5 },
  { icon: '🧄', delay: 0.3, x: '12%', y: '60%', duration: 7 },
  { icon: '🥚', delay: 0.8, x: '48%', y: '8%', duration: 5.5 },
  { icon: '🧅', delay: 1.2, x: '92%', y: '45%', duration: 6.5 },
  { icon: '🥦', delay: 0.6, x: '5%', y: '38%', duration: 5 },
  { icon: '🍋', delay: 1.5, x: '58%', y: '72%', duration: 6 },
];

export function Hero() {
  const scrollToIngredients = () => {
    document.getElementById('ingredients')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-[var(--warm-cream)] via-[#FFF5E0] to-[var(--warm-beige)]"
    >
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Subtle pattern */}
        <svg className="absolute w-full h-full opacity-[0.03]" viewBox="0 0 100 100" preserveAspectRatio="none">
          <pattern id="dots" width="8" height="8" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1" fill="#E8913A" />
          </pattern>
          <rect width="100" height="100" fill="url(#dots)" />
        </svg>
        
        {/* Warm gradient orbs */}
        <motion.div
          className="absolute w-[500px] h-[500px] rounded-full bg-[var(--warm-orange)]/8 blur-3xl"
          style={{ top: '-5%', left: '-10%' }}
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.4, 0.6, 0.4],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute w-[400px] h-[400px] rounded-full bg-[var(--fresh-green)]/8 blur-3xl"
          style={{ bottom: '-5%', right: '-5%' }}
          animate={{
            scale: [1.1, 1, 1.1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      {/* Floating Ingredients */}
      {floatingIngredients.map((item, index) => (
        <motion.div
          key={index}
          className="absolute text-4xl md:text-5xl select-none pointer-events-none"
          style={{
            left: item.x,
            top: item.y,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: 1,
            scale: 1,
            y: [0, -15, 0],
            rotate: [0, 3, -3, 0],
          }}
          transition={{
            opacity: { delay: item.delay + 0.3, duration: 0.5 },
            scale: { delay: item.delay + 0.3, duration: 0.5, type: 'spring' },
            y: { delay: item.delay, duration: item.duration, repeat: Infinity, ease: 'easeInOut' },
            rotate: { delay: item.delay, duration: item.duration * 1.3, repeat: Infinity, ease: 'easeInOut' },
          }}
        >
          {item.icon}
        </motion.div>
      ))}

      {/* Main Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Logo Display */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8"
        >
          <div className="relative inline-block">
            <motion.div
              className="w-28 h-28 md:w-36 md:h-36 mx-auto rounded-3xl overflow-hidden shadow-warm-lg"
              whileHover={{ scale: 1.05, rotate: 2 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <img 
                src="/logo.jpg" 
                alt="下厨有谱" 
                className="w-full h-full object-cover"
              />
            </motion.div>
            {/* Steam animation */}
            <motion.div
              className="absolute -top-4 left-1/2 -translate-x-1/2"
              animate={{ opacity: [0, 0.6, 0], y: [0, -20] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeOut' }}
            >
              <span className="text-2xl">💨</span>
            </motion.div>
          </div>
        </motion.div>

        {/* Brand Name */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-5xl sm:text-6xl md:text-7xl font-serif font-bold text-[var(--text-brown)] mb-4 tracking-tight"
        >
          下厨有谱
        </motion.h1>

        {/* Slogan */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-xl md:text-2xl text-[var(--text-brown-light)] mb-6 font-light"
        >
          承包你的一日三餐与四季风味
        </motion.p>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-base md:text-lg text-[var(--text-brown-light)]/80 max-w-xl mx-auto mb-10 leading-relaxed"
        >
          输入冰箱里的食材，AI智能推荐最适合的菜谱
          <br className="hidden sm:block" />
          让每一餐都充满家的味道
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Button
            size="lg"
            onClick={scrollToIngredients}
            className="bg-[var(--warm-orange)] hover:bg-[var(--warm-orange-dark)] text-white rounded-full px-8 py-6 text-base font-medium shadow-warm hover:shadow-warm-lg transition-all group"
          >
            <ChefHat className="w-5 h-5 mr-2" />
            开始烹饪
            <motion.span
              className="ml-2 inline-block"
              animate={{ y: [0, 3, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <ArrowDown className="w-4 h-4" />
            </motion.span>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-2 border-[var(--fresh-green)]/30 text-[var(--fresh-green)] hover:bg-[var(--fresh-green)]/5 rounded-full px-8 py-6 text-base font-medium"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            浏览热门菜谱
          </Button>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="mt-16 grid grid-cols-3 gap-6 max-w-md mx-auto"
        >
          {[
            { value: '1000+', label: '精选菜谱', color: 'text-[var(--warm-orange)]' },
            { value: '50+', label: '食材种类', color: 'text-[var(--fresh-green)]' },
            { value: '10万+', label: '快乐家庭', color: 'text-[var(--tomato-red)]' },
          ].map((stat, index) => (
            <motion.div
              key={index}
              className="text-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1 + index * 0.1, type: 'spring' }}
            >
              <div className={`text-2xl md:text-3xl font-serif font-bold ${stat.color}`}>{stat.value}</div>
              <div className="text-sm text-[var(--text-brown-light)]/70 mt-1">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[var(--warm-cream)] to-transparent" />
    </section>
  );
}
