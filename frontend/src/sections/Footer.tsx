import { motion } from 'framer-motion';
import { Instagram, Twitter, Youtube, Mail, MapPin, Phone } from 'lucide-react';

export function Footer() {
  const footerLinks = {
    product: {
      title: '产品',
      links: ['菜谱推荐', '食材管理', '营养分析', '购物清单'],
    },
    company: {
      title: '公司',
      links: ['关于我们', '加入团队', '新闻动态', '联系我们'],
    },
    resources: {
      title: '资源',
      links: ['帮助中心', '社区指南', '隐私政策', '服务条款'],
    },
  };

  return (
    <footer className="bg-[var(--text-brown)] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2"
          >
            <a href="#" className="flex items-center gap-3 mb-6">
              <div className="w-14 h-14 rounded-2xl overflow-hidden shadow-lg">
                <img 
                  src="/logo.jpg" 
                  alt="下厨有谱" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-2xl font-bold">下厨有谱</span>
                <span className="text-xs text-white/50">承包你的一日三餐与四季风味</span>
              </div>
            </a>
            <p className="text-white/60 mb-6 max-w-sm">
              让每一餐都充满家的味道，用AI智能推荐帮你发现冰箱里的无限可能。
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3 text-sm text-white/60">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>hello@xiachuyoupu.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>400-123-4567</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>上海市浦东新区</span>
              </div>
            </div>
          </motion.div>

          {/* Links */}
          {Object.entries(footerLinks).map(([key, section], index) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 * (index + 1) }}
            >
              <h3 className="font-bold text-white mb-4">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-white/60 hover:text-[var(--warm-orange)] transition-colors text-sm"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Bottom */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4"
        >
          <p className="text-white/40 text-sm">
            © 2024 下厨有谱. All rights reserved.
          </p>
          
          {/* Social Links */}
          <div className="flex items-center gap-4">
            {[
              { icon: Instagram, label: 'Instagram' },
              { icon: Twitter, label: 'Twitter' },
              { icon: Youtube, label: 'Youtube' },
            ].map(({ icon: Icon, label }) => (
              <motion.a
                key={label}
                href="#"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[var(--warm-orange)] transition-colors"
              >
                <Icon className="w-5 h-5" />
              </motion.a>
            ))}
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
