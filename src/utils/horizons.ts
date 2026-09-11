import type { Horizon } from '../types/goal';

/**
 * Límites EXPLÍCITOS de cada plazo, en meses.
 * - Corto: hasta 6 meses
 * - Mediano: de 7 a 24 meses
 * - Largo: 25 meses o más
 *
 * Si quieres cambiar la definición de los plazos, edita SOLO estos
 * valores y toda la clasificación (y la asesoría) se ajusta sola.
 */
export const HORIZON_LIMITS = {
  short: { maxMonths: 6 },
  medium: { maxMonths: 24 },
  long: { minMonths: 25 },
};

export const HORIZONS: Record<Horizon, { label: string; sub: string; color: string; emoji: string }> = {
  short:  { label: 'Corto Plazo',  sub: '0 - 6 meses',   color: '#10b981', emoji: '⚡' },
  medium: { label: 'Mediano Plazo', sub: '6 - 24 meses',  color: '#f59e0b', emoji: '🎯' },
  long:   { label: 'Largo Plazo',   sub: 'Más de 2 años', color: '#ef4444', emoji: '🏔️' },
};

/**
 * Calcula el horizonte basándose en costo real / CAPACIDAD REAL de ahorro.
 *
 * IMPORTANTE: "mensualEffort" (ahorro mensual) NO es el ingreso. Debe ser lo
 * que la persona realmente puede apartar al mes después de sus gastos fijos.
 * El ingreso sin gastos infla la capacidad y engaña la clasificación.
 */
export function calculateHorizon(cost: number, monthlyEffort: number): Horizon {
  const months = monthsToGoal(cost, monthlyEffort);
  if (months <= HORIZON_LIMITS.short.maxMonths) return 'short';
  if (months <= HORIZON_LIMITS.medium.maxMonths) return 'medium';
  return 'long';
}

/** Meses que tomaría alcanzar la meta con el ahorro mensual dado (redondeado hacia arriba). */
export function monthsToGoal(cost: number, monthlyEffort: number): number {
  if (monthlyEffort <= 0) return Infinity;
  return Math.ceil(cost / monthlyEffort);
}

export interface HorizonAdvice {
  /** Meses estimados con el ahorro actual. */
  months: number;
  /** Clasificación con el ahorro actual. */
  horizon: Horizon;
  /** Lo que hay que apartar al mes para lograrlo a corto plazo (≤6 meses). */
  toShort: number;
  /** Lo que hay que apartar al mes para lograrlo a mediano plazo (≤24 meses). */
  toMedium: number;
}

/**
 * Modo "asesor": no solo clasifica, sino que dice cuánto hay que apartar
 * al mes para alcanzar cada plazo.
 */
export function getAdvice(cost: number, monthlyEffort: number): HorizonAdvice {
  return {
    months: monthsToGoal(cost, monthlyEffort),
    horizon: calculateHorizon(cost, monthlyEffort),
    toShort: Math.ceil(cost / HORIZON_LIMITS.short.maxMonths),
    toMedium: Math.ceil(cost / HORIZON_LIMITS.medium.maxMonths),
  };
}