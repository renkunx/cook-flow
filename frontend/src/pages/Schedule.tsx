import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  Clock,
  Users,
  Trash2,
  ChefHat,
  Check,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { CookingSchedule } from '@/types';

interface ScheduleProps {
  schedules: CookingSchedule[];
  onRemoveSchedule: (id: string) => void;
}

export function Schedule({ schedules, onRemoveSchedule }: ScheduleProps) {
  const [filter, setFilter] = useState<'all' | 'today' | 'upcoming'>('all');

  const today = new Date().toISOString().split('T')[0];

  const filteredSchedules = schedules.filter((s) => {
    if (filter === 'today') return s.plannedDate === today;
    if (filter === 'upcoming') return s.plannedDate > today;
    return true;
  });

  const groupedByDate = filteredSchedules.reduce((acc, schedule) => {
    if (!acc[schedule.plannedDate]) acc[schedule.plannedDate] = [];
    acc[schedule.plannedDate].push(schedule);
    return acc;
  }, {} as Record<string, CookingSchedule[]>);

  const sortedDates = Object.keys(groupedByDate).sort();

  const getDateLabel = (dateStr: string) => {
    if (dateStr === today) return '今天';
    const date = new Date(dateStr);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    if (dateStr === tomorrow.toISOString().split('T')[0]) return '明天';
    return date.toLocaleDateString('zh-CN', {
      month: 'long',
      day: 'numeric',
      weekday: 'short',
    });
  };

  return (
    <div className="min-h-screen bg-[var(--warm-cream)]">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border-b border-[var(--warm-beige)]"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-center">
            <h1 className="text-xl font-serif font-bold text-[var(--text-brown)]">做饭日程</h1>
          </div>
        </div>
      </motion.div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filter Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex gap-2 mb-8"
        >
          {[
            { key: 'all', label: '全部', count: schedules.length },
            { key: 'today', label: '今天', count: schedules.filter((s) => s.plannedDate === today).length },
            { key: 'upcoming', label: ' upcoming', count: schedules.filter((s) => s.plannedDate > today).length },
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

        {/* Empty State */}
        {schedules.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="w-24 h-24 rounded-full bg-[var(--warm-cream)] flex items-center justify-center mx-auto mb-6">
              <Calendar className="w-12 h-12 text-[var(--warm-orange)]" />
            </div>
            <h2 className="text-2xl font-serif font-bold text-[var(--text-brown)] mb-2">
              还没有安排做饭计划
            </h2>
            <p className="text-[var(--text-brown-light)]/60 mb-6">从菜谱中选择想做的菜，加入你的日程吧</p>
            <Link to="/" target="_blank">
              <Button
                className="bg-[var(--warm-orange)] hover:bg-[var(--warm-orange-dark)] text-white rounded-full"
              >
                浏览菜谱
              </Button>
            </Link>
          </motion.div>
        )}

        {/* Schedule List */}
        <AnimatePresence mode="popLayout">
          {sortedDates.map((date, dateIndex) => (
            <motion.div
              key={date}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: dateIndex * 0.1 }}
              className="mb-8"
            >
              {/* Date Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-[var(--warm-orange)] flex items-center justify-center text-white font-bold">
                  {new Date(date).getDate()}
                </div>
                <div>
                  <p className="font-medium text-[var(--text-brown)]">{getDateLabel(date)}</p>
                  <p className="text-sm text-[var(--text-brown-light)]/60">
                    {groupedByDate[date].length} 道菜
                  </p>
                </div>
              </div>

              {/* Recipes for this date */}
              <div className="space-y-3 ml-6 border-l-2 border-[var(--warm-beige)] pl-6">
                {groupedByDate[date].map((schedule, idx) => (
                  <motion.div
                    key={schedule.id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: idx * 0.05 }}
                    className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-warm transition-shadow"
                  >
                    <div className="flex gap-4">
                      <img
                        src={schedule.recipeImage}
                        alt={schedule.recipeTitle}
                        className="w-24 h-24 rounded-xl object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-medium text-[var(--text-brown)]">
                              {schedule.recipeTitle}
                            </h3>
                            <div className="flex items-center gap-4 mt-2 text-sm text-[var(--text-brown-light)]/60">
                              <span className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {schedule.plannedTime}
                              </span>
                              <span className="flex items-center gap-1">
                                <Users className="w-4 h-4" />
                                {schedule.servings} 人份
                              </span>
                            </div>
                          </div>
                          <button
                            onClick={() => onRemoveSchedule(schedule.id)}
                            className="p-2 text-[var(--text-brown-light)]/40 hover:text-[var(--tomato-red)] hover:bg-[var(--tomato-red)]/10 rounded-full transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="flex gap-2 mt-3">
                          <Badge
                            variant="outline"
                            className="text-[var(--fresh-green)] border-[var(--fresh-green)]/30"
                          >
                            <Check className="w-3 h-3 mr-1" />
                            已计划
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Summary */}
        {schedules.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-12 p-6 bg-white rounded-2xl shadow-warm"
          >
            <h3 className="font-medium text-[var(--text-brown)] mb-4 flex items-center gap-2">
              <ChefHat className="w-5 h-5 text-[var(--warm-orange)]" />
              本周统计
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-[var(--warm-cream)] rounded-xl">
                <p className="text-2xl font-bold text-[var(--fresh-green)]">{schedules.length}</p>
                <p className="text-sm text-[var(--text-brown-light)]/60">计划菜品</p>
              </div>
              <div className="text-center p-4 bg-[var(--warm-cream)] rounded-xl">
                <p className="text-2xl font-bold text-[var(--warm-orange)]">
                  {new Set(schedules.map((s) => s.plannedDate)).size}
                </p>
                <p className="text-sm text-[var(--text-brown-light)]/60">做饭天数</p>
              </div>
              <div className="text-center p-4 bg-[var(--warm-cream)] rounded-xl">
                <p className="text-2xl font-bold text-[var(--tomato-red)]">
                  {schedules.reduce((sum, s) => sum + s.servings, 0)}
                </p>
                <p className="text-sm text-[var(--text-brown-light)]/60">总份数</p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
