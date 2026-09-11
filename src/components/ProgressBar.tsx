interface Props {
  value: number;
  color: string;
}

export function ProgressBar({ value, color }: Props) {
  return (
    <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
      <div
        className="h-full rounded-full transition-all duration-500 ease-out"
        style={{
          width: `${value}%`,
          background: `linear-gradient(90deg, ${color}, ${color}cc)`,
          boxShadow: `0 0 10px ${color}80`,
        }}
      />
    </div>
  );
}