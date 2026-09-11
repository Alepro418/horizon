import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Lightbulb } from 'lucide-react';
import type { Category } from '../types/goal';
import { CATEGORIES, CATEGORY_COLORS } from '../utils/colors';
import { useGoalsStore } from '../store/useGoalsStore';
import { HORIZON_LIMITS, HORIZONS, getAdvice } from '../utils/horizons';

const fmtMoney = (n: number) => Math.round(n).toLocaleString('en-US');

export function GoalForm() {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Category>('personal');
  const [cost, setCost] = useState(1000);
  const [income, setIncome] = useState('');
  const [fixedExpenses, setFixedExpenses] = useState('');
  const [monthlyEffort, setMonthlyEffort] = useState(200);
  const addGoal = useGoalsStore((s) => s.addGoal);

  // Si se indican ingreso y gastos fijos, el ahorro real se calcula solo.
  // (Se deriva en lugar de usar un efecto para no causar renders en cascada.)
  const hasBudget = income !== '' && fixedExpenses !== '';
  const effectiveEffort = hasBudget
    ? Math.max(0, Number(income) - Number(fixedExpenses))
    : monthlyEffort;

  const advice = getAdvice(cost, effectiveEffort);
  const previewHorizon = advice.horizon;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    addGoal({ title, description, category, cost, monthlyEffort: effectiveEffort, progress: 0 });
    setTitle('');
    setDescription('');
    setCost(1000);
    setIncome('');
    setFixedExpenses('');
    setMonthlyEffort(200);
    setOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-8 right-8 z-40 flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-600 text-white font-medium shadow-2xl shadow-violet-500/30 hover:shadow-violet-500/50 hover:scale-105 transition-all"
      >
        <Plus size={18} />
        Nueva Meta
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          >
            <motion.form
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              onSubmit={handleSubmit}
              className="w-full max-w-lg glass rounded-3xl p-6 space-y-5"
            >
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">Nueva Meta</h2>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-white/5 text-white/50"
                >
                  <X size={18} />
                </button>
              </div>

              <input
                autoFocus
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ej: Comprar mi primer departamento"
                className="w-full bg-white/5 border border-border rounded-xl px-4 py-3 text-sm placeholder-white/30 focus:outline-none focus:border-violet-500/50 transition-colors"
              />

              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Descripción opcional..."
                rows={2}
                className="w-full bg-white/5 border border-border rounded-xl px-4 py-3 text-sm placeholder-white/30 focus:outline-none focus:border-violet-500/50 transition-colors resize-none"
              />

              <div>
                <label className="text-xs text-white/50 mb-2 block">Categoría</label>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map((cat) => {
                    const c = CATEGORY_COLORS[cat];
                    const active = category === cat;
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setCategory(cat)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                          active
                            ? `${c.bg} ${c.text} ${c.border} scale-105`
                            : 'border-border text-white/50 hover:border-white/20'
                        }`}
                      >
                        {cat}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-white/50 mb-2 block">
                    Costo total ($)
                  </label>
                  <input
                    type="number"
                    value={cost}
                    onChange={(e) => setCost(Number(e.target.value))}
                    className="w-full bg-white/5 border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-violet-500/50"
                  />
                </div>
                <div>
                  <label className="text-xs text-white/50 mb-2 block">
                    Ingreso mensual ($) · opcional
                  </label>
                  <input
                    type="number"
                    value={income}
                    onChange={(e) => setIncome(e.target.value)}
                    placeholder="Ej: 1200"
                    className="w-full bg-white/5 border border-border rounded-xl px-4 py-2.5 text-sm placeholder-white/20 focus:outline-none focus:border-violet-500/50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-white/50 mb-2 block">
                    Gastos fijos mensuales ($) · opcional
                  </label>
                  <input
                    type="number"
                    value={fixedExpenses}
                    onChange={(e) => setFixedExpenses(e.target.value)}
                    placeholder="Ej: 900"
                    className="w-full bg-white/5 border border-border rounded-xl px-4 py-2.5 text-sm placeholder-white/20 focus:outline-none focus:border-violet-500/50"
                  />
                </div>
                <div>
                  <label className="text-xs text-white/50 mb-2 block">
                    Ahorro real mensual ($)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={effectiveEffort}
                      onChange={(e) => setMonthlyEffort(Number(e.target.value))}
                      disabled={hasBudget}
                      className="w-full bg-white/5 border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-violet-500/50 disabled:opacity-60"
                    />
                    {hasBudget && (
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-medium px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400">
                        auto
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <p className="text-[11px] text-white/30 -mt-2">
                Tu ingreso no es tu capacidad de ahorro. Si pones ingreso y gastos
                fijos, el ahorro real se calcula solo y la clasificación es honesta.
              </p>

              {/* Clasificación */}
              <div
                className="rounded-xl p-3 text-xs flex items-center justify-between border"
                style={{
                  background: `${HORIZONS[previewHorizon].color}10`,
                  borderColor: `${HORIZONS[previewHorizon].color}40`,
                }}
              >
                <span className="text-white/60">
                  Se ubicará en:
                </span>
                <span
                  className="font-semibold"
                  style={{ color: HORIZONS[previewHorizon].color }}
                >
                  {HORIZONS[previewHorizon].emoji} {HORIZONS[previewHorizon].label}
                </span>
              </div>

              {/* Asesoría */}
              <div className="rounded-xl p-3 text-xs border border-border bg-white/5 space-y-1.5">
                <div className="flex items-center gap-1.5 text-white/70 font-medium">
                  <Lightbulb size={12} className="text-yellow-400" />
                  Asesoría
                </div>

                {effectiveEffort > 0 ? (
                  <>
                    <p className="text-white/60">
                      Con <b className="text-white/90">${fmtMoney(effectiveEffort)}/mes</b> lo
                      lograrías en <b className="text-white/90">~{advice.months} meses</b>.
                    </p>
                    {previewHorizon !== 'short' && (
                      <p className="text-white/60">
                        Para lograrlo a <b>Corto Plazo</b> ({HORIZON_LIMITS.short.maxMonths}{' '}
                        meses), necesitas apartar{' '}
                        <b style={{ color: '#10b981' }}>${fmtMoney(advice.toShort)}/mes</b>.
                      </p>
                    )}
                    {previewHorizon === 'long' && (
                      <p className="text-white/60">
                        Para lograrlo a <b>Mediano Plazo</b> ({HORIZON_LIMITS.medium.maxMonths}{' '}
                        meses), aparta{' '}
                        <b style={{ color: '#f59e0b' }}>${fmtMoney(advice.toMedium)}/mes</b>.
                      </p>
                    )}
                  </>
                ) : (
                  <p className="text-yellow-400/80">
                    Aún no defines cuánto puedes apartar realmente al mes, así que no se
                    puede clasificar la meta.
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-medium hover:opacity-90 transition-opacity"
              >
                Crear Meta
              </button>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}