import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Goal } from '../types/goal';
import { calculateHorizon } from '../utils/horizons';

interface GoalsState {
  goals: Goal[];
  addGoal: (goal: Omit<Goal, 'id' | 'createdAt' | 'horizon'>) => void;
  removeGoal: (id: string) => void;
  updateGoal: (id: string, updates: Partial<Goal>) => void;
  updateProgress: (id: string, progress: number) => void;
  rebalanceAll: () => void;
}

export const useGoalsStore = create<GoalsState>()(
  persist(
    (set) => ({
      goals: [],

      addGoal: (goalData) => {
        const horizon = calculateHorizon(goalData.cost, goalData.monthlyEffort);
        const newGoal: Goal = {
          ...goalData,
          id: crypto.randomUUID(),
          horizon,
          createdAt: Date.now(),
        };
        set((state) => ({ goals: [...state.goals, newGoal] }));
      },

      removeGoal: (id) =>
        set((state) => ({ goals: state.goals.filter((g) => g.id !== id) })),

      updateGoal: (id, updates) =>
        set((state) => ({
          goals: state.goals.map((g) => {
            if (g.id !== id) return g;
            const updated = { ...g, ...updates };
            // Recalcula horizonte automáticamente si cambió costo o esfuerzo
            if (updates.cost !== undefined || updates.monthlyEffort !== undefined) {
              updated.horizon = calculateHorizon(updated.cost, updated.monthlyEffort);
            }
            return updated;
          }),
        })),

      updateProgress: (id, progress) =>
        set((state) => ({
          goals: state.goals.map((g) =>
            g.id === id ? { ...g, progress: Math.max(0, Math.min(100, progress)) } : g
          ),
        })),

      // Reacomoda TODAS las metas según su costo/esfuerzo actual
      rebalanceAll: () =>
        set((state) => ({
          goals: state.goals.map((g) => ({
            ...g,
            horizon: calculateHorizon(g.cost, g.monthlyEffort),
          })),
        })),
    }),
    { name: 'horizon-goals' }
  )
);