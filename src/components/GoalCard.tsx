import { motion } from 'framer-motion';
import { Trash2, Clock } from 'lucide-react';
import type { Goal } from '../types/goal';
import { CategoryBadge } from './CategoryBadge';
import { ProgressBar } from './ProgressBar';
import { CATEGORY_COLORS } from '../utils/colors';
import { monthsToGoal } from '../utils/horizons';
import { useGoalsStore } from '../store/useGoalsStore';

export function GoalCard({ goal }: { goal: Goal }) {
  const { removeGoal, updateProgress } = useGoalsStore();
  const colors = CATEGORY_COLORS[goal.category];
  const months = monthsToGoal(goal.cost, goal.monthlyEffort);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="group relative glass glass-hover rounded-2xl p-4 cursor-pointer overflow-hidden"
      style={{ boxShadow: `inset 0 1px 0 0 rgba(255,255,255,0.05)` }}
    >
      {/* Glow lateral según categoría */}
      <div
        className="absolute left-0 top-0 bottom-0 w-1 opacity-60"
        style={{ background: colors.hex }}
      />

      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm text-white/95 leading-tight truncate">
            {goal.title}
          </h3>
          {goal.description && (
            <p className="text-xs text-white/40 mt-1 line-clamp-2">
              {goal.description}
            </p>
          )}
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            removeGoal(goal.id);
          }}
          className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg hover:bg-red-500/10 text-white/40 hover:text-red-400"
        >
          <Trash2 size={14} />
        </button>
      </div>

      <div className="flex items-center gap-2 mb-3 flex-wrap">
        <CategoryBadge category={goal.category} />
        {months !== Infinity && (
          <span className="inline-flex items-center gap-1 text-xs text-white/40">
            <Clock size={11} />
            {months}m
          </span>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-xs text-white/50">
          <span>${goal.cost.toLocaleString()}</span>
          <span className="font-medium" style={{ color: colors.hex }}>
            {goal.progress}%
          </span>
        </div>
        <ProgressBar value={goal.progress} color={colors.hex} />
      </div>

      {/* Slider de progreso oculto que aparece en hover */}
      <input
        type="range"
        min="0"
        max="100"
        value={goal.progress}
        onChange={(e) => updateProgress(goal.id, Number(e.target.value))}
        onClick={(e) => e.stopPropagation()}
        className="w-full mt-3 opacity-0 group-hover:opacity-100 transition-opacity accent-violet-500 cursor-pointer"
      />
    </motion.div>
  );
}