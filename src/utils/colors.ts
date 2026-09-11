import type { Category } from '../types/goal';

// Colores fijos pero "vibrantes y random" por categoría
export const CATEGORY_COLORS: Record<Category, { bg: string; text: string; border: string; hex: string }> = {
  finanzas:    { bg: 'bg-emerald-500/10',  text: 'text-emerald-400',  border: 'border-emerald-500/30',  hex: '#10b981' },
  salud:       { bg: 'bg-pink-500/10',     text: 'text-pink-400',     border: 'border-pink-500/30',     hex: '#ec4899' },
  aprendizaje: { bg: 'bg-violet-500/10',   text: 'text-violet-400',   border: 'border-violet-500/30',   hex: '#8b5cf6' },
  viajes:      { bg: 'bg-orange-500/10',   text: 'text-orange-400',   border: 'border-orange-500/30',   hex: '#f97316' },
  familia:     { bg: 'bg-rose-500/10',     text: 'text-rose-400',     border: 'border-rose-500/30',     hex: '#f43f5e' },
  carrera:     { bg: 'bg-sky-500/10',      text: 'text-sky-400',      border: 'border-sky-500/30',      hex: '#0ea5e9' },
  personal:    { bg: 'bg-amber-500/10',    text: 'text-amber-400',    border: 'border-amber-500/30',    hex: '#f59e0b' },
};

export const CATEGORIES = Object.keys(CATEGORY_COLORS) as Category[];