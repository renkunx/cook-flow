import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { TrendingUp, Clock, Flame, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { recipes } from '@/data/recipes';

export function PopularRecipes() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const x = useTransform(scrollYProgress, [0, 1], ['0%', '-50%']);

  // Get top 6 recipes as popular
  const popularRecipes = recipes.slice(0, 6);

  return (
    <section ref={containerRef} className="py-20 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-4"
        >
          <div>
            <div className="inline-flex items-center gap-2 bg-[var(--warm-orange)]/10 rounded-full px-4 py-2 mb-4">
              <TrendingUp className="w-4 h-4 text-[var(--warm-orange)]" />
              <span className="text-sm font-medium text-[var(--warm-orange)]">热门菜谱</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-[var(--text-brown)]">
              本周社区最爱
            </h2>
          </div>
          <p className="text-[var(--text-brown-light)]/70 max-w-md">
            看看大家都在做什么，发现更多美味灵感
          </p>
        </motion.div>
      </div>

      {/* Horizontal Scrolling Cards */}
      <div className="relative">
        <motion.div
          style={{ x }}
          className="flex gap-6 px-4 sm:px-6 lg:px-8"
        >
          {[...popularRecipes, ...popularRecipes].map((recipe, index) => (
            <motion.div
              key={`${recipe.id}-${index}`}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="flex-shrink-0 w-80 group cursor-pointer"
            >
              <Link to={`/recipe/${recipe.id}`} target="_blank">
              <div className="bg-[var(--warm-cream)] rounded-2xl overflow-hidden hover:shadow-warm-lg transition-all duration-300">
                {/* Image */}
                <div className="relative h-56 overflow-hidden">
                  <motion.img
                    src={recipe.image}
                    alt={recipe.title}
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  
                  {/* Rank Badge */}
                  <div className="absolute top-4 left-4">
                    <div className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm">
                      <span className="text-lg font-bold text-[var(--warm-orange)]">
                        {(index % 6) + 1}
                      </span>
                    </div>
                  </div>

                  {/* Time */}
                  <div className="absolute bottom-4 right-4 flex items-center gap-1 text-white text-sm">
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

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-sm text-[var(--text-brown-light)]/60">
                      <span className="flex items-center gap-1">
                        <Flame className="w-4 h-4" />
                        {recipe.calories}卡
                      </span>
                    </div>
                    <motion.div
                      className="text-[var(--warm-orange)] font-medium text-sm flex items-center gap-1"
                      whileHover={{ x: 4 }}
                    >
                      查看
                      <ChevronRight className="w-4 h-4" />
                    </motion.div>
                  </div>
                </div>
              </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Gradient Overlays */}
        <div className="absolute top-0 left-0 bottom-0 w-32 bg-gradient-to-r from-white to-transparent pointer-events-none z-10" />
        <div className="absolute top-0 right-0 bottom-0 w-32 bg-gradient-to-l from-white to-transparent pointer-events-none z-10" />
      </div>

      {/* View All Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mt-12"
      >
        <button className="inline-flex items-center gap-2 text-[var(--warm-orange)] font-medium hover:gap-3 transition-all">
          查看全部热门菜谱
          <ChevronRight className="w-5 h-5" />
        </button>
      </motion.div>
    </section>
  );
}
