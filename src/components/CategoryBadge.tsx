import type { Category } from '../types/goal';
import { CATEGORY_COLORS } from '../utils/colors';

export function CategoryBadge({ category }: { category: Category }) {
  const colors = CATEGORY_COLORS[category];
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${colors.bg} ${colors.text} border ${colors.border}`}
    >
      <span
        className="w-1.5 h-1.5 rounded-full"
        style={{ backgroundColor: colors.hex }}
      />
      {category}
    </span>
  );
}