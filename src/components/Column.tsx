import { AnimatePresence } from 'framer-motion';
import type { Goal, Horizon } from '../types/goal';
import { HORIZONS } from '../utils/horizons';
import { GoalCard } from './GoalCard';

interface Props {
  horizon: Horizon;
  goals: Goal[];
}

export function Column({ horizon, goals }: Props) {
  const config = HORIZONS[horizon];

  return (
    <div className="flex flex-col gap-3 min-h-[200px]">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <span className="text-lg">{config.emoji}</span>
          <div>
            <h2 className="font-semibold text-sm text-white/90">{config.label}</h2>
            <p className="text-xs text-white/40">{config.sub}</p>
          </div>
        </div>
        <span
          className="text-xs font-medium px-2 py-0.5 rounded-full"
          style={{
            background: `${config.color}20`,
            color: config.color,
          }}
        >
          {goals.length}
        </span>
      </div>

      <div className="flex flex-col gap-3">
        <AnimatePresence mode="popLayout">
          {goals.map((goal) => (
            <GoalCard key={goal.id} goal={goal} />
          ))}
        </AnimatePresence>

        {goals.length === 0 && (
          <div className="border border-dashed border-border rounded-2xl p-6 text-center">
            <p className="text-xs text-white/30">Sin metas aquí</p>
          </div>
        )}
      </div>
    </div>
  );
}