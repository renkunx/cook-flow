import { motion } from 'framer-motion';
import { MessageCircle, Heart, Users } from 'lucide-react';
import { users } from '@/data/recipes';

export function Community() {
  // Split users into two columns for the marquee effect
  const leftColumn = users.filter((_, i) => i % 2 === 0);
  const rightColumn = users.filter((_, i) => i % 2 === 1);

  return (
    <section id="community" className="py-20 bg-[#12262a] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-white"
          >
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <Users className="w-4 h-4 text-[#ffd15c]" />
              <span className="text-sm font-medium text-[#ffd15c]">加入社区</span>
            </div>
            
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold mb-6">
              与 <span className="text-[#ffd15c]">10,000+</span> 美食爱好者
              <br />
              分享你的烹饪作品
            </h2>
            
            <p className="text-white/70 text-lg mb-8 max-w-md">
              加入我们的美食社区，发现新菜谱，分享你的创意，结识志同道合的美食爱好者
            </p>

            <div className="flex flex-wrap gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-[#2e5c41] hover:bg-[#3d7a56] text-white px-8 py-3 rounded-full font-medium transition-colors"
              >
                立即加入
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white/10 hover:bg-white/20 text-white px-8 py-3 rounded-full font-medium transition-colors backdrop-blur-sm"
              >
                了解更多
              </motion.button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 mt-12">
              {[
                { value: '10K+', label: '活跃用户' },
                { value: '50K+', label: '分享作品' },
                { value: '100K+', label: '互动点赞' },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                >
                  <div className="text-2xl md:text-3xl font-serif font-bold text-[#ffd15c]">
                    {stat.value}
                  </div>
                  <div className="text-sm text-white/60 mt-1">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right Content - User Marquee */}
          <div className="relative h-[500px] overflow-hidden">
            {/* Gradient Masks */}
            <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-[#12262a] to-transparent z-10 pointer-events-none" />
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#12262a] to-transparent z-10 pointer-events-none" />

            <div className="flex gap-4 h-full">
              {/* Left Column - Scrolls Up */}
              <motion.div
                animate={{ y: ['0%', '-50%'] }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: 'linear',
                }}
                className="flex-1 flex flex-col gap-4"
              >
                {[...leftColumn, ...leftColumn].map((user, index) => (
                  <motion.div
                    key={`left-${user.id}-${index}`}
                    whileHover={{ scale: 1.02 }}
                    className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10"
                  >
                    <div className="flex items-start gap-3">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-12 h-12 rounded-full object-cover border-2 border-[#ffd15c]"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-white">{user.name}</span>
                          <Heart className="w-3 h-3 text-red-400 fill-red-400" />
                        </div>
                        <p className="text-sm text-white/70 line-clamp-2">{user.comment}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              {/* Right Column - Scrolls Down */}
              <motion.div
                animate={{ y: ['-50%', '0%'] }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: 'linear',
                }}
                className="flex-1 flex flex-col gap-4"
              >
                {[...rightColumn, ...rightColumn].map((user, index) => (
                  <motion.div
                    key={`right-${user.id}-${index}`}
                    whileHover={{ scale: 1.02 }}
                    className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10"
                  >
                    <div className="flex items-start gap-3">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-12 h-12 rounded-full object-cover border-2 border-[#2e5c41]"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-white">{user.name}</span>
                          <MessageCircle className="w-3 h-3 text-[#ffd15c]" />
                        </div>
                        <p className="text-sm text-white/70 line-clamp-2">{user.comment}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
