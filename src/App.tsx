import { RotateCcw, Sparkles } from 'lucide-react';
import type { Horizon } from './types/goal';
import { useGoalsStore } from './store/useGoalsStore';
import { Column } from './components/Column';
import { GoalForm } from './components/GoalForm';

const HORIZONS_ORDER: Horizon[] = ['short', 'medium', 'long'];

export default function App() {
  const goals = useGoalsStore((s) => s.goals);
  const rebalanceAll = useGoalsStore((s) => s.rebalanceAll);

  const stats = {
    total: goals.length,
    completed: goals.filter((g) => g.progress === 100).length,
    invested: goals.reduce((sum, g) => sum + g.cost * (g.progress / 100), 0),
  };

  return (
    <div className="min-h-screen p-6 md:p-10 max-w-7xl mx-auto">
      {/* Header */}
      <header className="mb-10">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-violet-500/30">
              <Sparkles size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Horizon</h1>
              <p className="text-xs text-white/40">
                Tu roadmap de metas personales
              </p>
            </div>
          </div>

          <button
            onClick={rebalanceAll}
            className="flex items-center gap-2 px-4 py-2 rounded-xl glass glass-hover text-sm text-white/70 hover:text-white"
          >
            <RotateCcw size={14} />
            Rebalancear
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mt-8">
          {[
            { label: 'Metas activas', value: stats.total, suffix: '' },
            { label: 'Completadas', value: stats.completed, suffix: '' },
            { label: 'Invertido', value: `$${Math.round(stats.invested).toLocaleString()}`, suffix: '' },
          ].map((s) => (
            <div key={s.label} className="glass rounded-2xl p-4">
              <p className="text-xs text-white/40 mb-1">{s.label}</p>
              <p className="text-xl font-bold text-white/90">
                {s.value}
                {s.suffix}
              </p>
            </div>
          ))}
        </div>
      </header>

      {/* Grid de columnas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {HORIZONS_ORDER.map((horizon) => (
          <Column
            key={horizon}
            horizon={horizon}
            goals={goals.filter((g) => g.horizon === horizon)}
          />
        ))}
      </div>

      <GoalForm />
    </div>
  );
}