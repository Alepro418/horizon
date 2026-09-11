export type Horizon = 'short' | 'medium' | 'long';

export type Category = 
  | 'finanzas' 
  | 'salud' 
  | 'aprendizaje' 
  | 'viajes' 
  | 'familia' 
  | 'carrera' 
  | 'personal';

export interface Goal {
  id: string;
  title: string;
  description?: string;
  category: Category;
  horizon: Horizon;
  cost: number;          // Costo total estimado
  monthlyEffort: number; // Cuánto puedes aportar al mes
  progress: number;      // 0-100
  createdAt: number;
}