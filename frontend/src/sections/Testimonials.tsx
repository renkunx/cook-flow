import { motion } from 'framer-motion';
import { Star, Quote, Heart } from 'lucide-react';
import { users } from '@/data/recipes';

export function Testimonials() {
  const testimonials = [
    {
      ...users[0],
      rating: 5,
      dish: '西红柿炒蛋',
      date: '3天前',
    },
    {
      ...users[1],
      rating: 5,
      dish: '土豆炖牛肉',
      date: '1周前',
    },
    {
      ...users[2],
      rating: 5,
      dish: '蛋炒饭',
      date: '2周前',
    },
    {
      ...users[3],
      rating: 4,
      dish: '蒜蓉西兰花',
      date: '3周前',
    },
    {
      ...users[4],
      rating: 5,
      dish: '可乐鸡翅',
      date: '1月前',
    },
    {
      ...users[5],
      rating: 5,
      dish: '虾仁炒蛋',
      date: '1月前',
    },
  ];

  return (
    <section id="testimonials" className="py-20 bg-[var(--warm-cream)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-[var(--tomato-red)]/10 rounded-full px-4 py-2 mb-4">
            <Heart className="w-4 h-4 text-[var(--tomato-red)]" />
            <span className="text-sm font-medium text-[var(--tomato-red)]">用户好评</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-[var(--text-brown)] mb-4">
            看看大家怎么说
          </h2>
          <p className="text-[var(--text-brown-light)]/70 max-w-lg mx-auto">
            来自真实用户的反馈，见证他们的烹饪喜悦
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{
                duration: 0.6,
                delay: index * 0.1,
                ease: [0.16, 1, 0.3, 1],
              }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="group"
            >
              <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-warm-lg transition-all duration-300 h-full flex flex-col">
                {/* Quote Icon */}
                <div className="mb-4">
                  <Quote className="w-8 h-8 text-[var(--warm-beige)] group-hover:text-[var(--warm-orange)]/20 transition-colors" />
                </div>

                {/* Comment */}
                <p className="text-[var(--text-brown)]/80 mb-6 flex-1">
                  "{testimonial.comment}"
                </p>

                {/* Rating */}
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < testimonial.rating
                          ? 'fill-[var(--warm-orange)] text-[var(--warm-orange)]'
                          : 'text-[var(--warm-beige)]'
                      }`}
                    />
                  ))}
                </div>

                {/* User Info */}
                <div className="flex items-center gap-3 pt-4 border-t border-[var(--warm-beige)]">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-[var(--warm-cream)]"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-[var(--text-brown)]">{testimonial.name}</p>
                    <p className="text-sm text-[var(--text-brown-light)]/60">
                      做了 <span className="text-[var(--warm-orange)] font-medium">{testimonial.dish}</span> · {testimonial.date}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8"
        >
          {[
            { value: '4.9', label: '平均评分', suffix: '/5', color: 'text-[var(--warm-orange)]' },
            { value: '10万+', label: '好评数量', color: 'text-[var(--fresh-green)]' },
            { value: '98%', label: '推荐率', color: 'text-[var(--tomato-red)]' },
            { value: '50万+', label: '成功做菜', color: 'text-[var(--carrot-orange)]' },
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 + index * 0.1, type: 'spring' }}
              className="text-center"
            >
              <div className={`text-3xl md:text-4xl font-serif font-bold ${stat.color}`}>
                {stat.value}
                <span className="text-xl">{stat.suffix}</span>
              </div>
              <div className="text-sm text-[var(--text-brown-light)]/60 mt-1">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
