interface QuizProgressProps {
  current: number; // 1-based
  total: number;
}

export function QuizProgress({ current, total }: QuizProgressProps) {
  const percent = (current / total) * 100;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
        <span>문제 {current} / {total}</span>
        <span>{Math.round(percent)}%</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
        <div
          className="h-full rounded-full bg-primary transition-all duration-300"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
