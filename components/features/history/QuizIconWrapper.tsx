import { Icon } from "@iconify/react";

export function QuizIconWrapper({ className }: { className?: string }) {
  return (
    <Icon
      icon="material-symbols:quiz-outline-rounded"
      className={className}
      width={16}
      height={16}
      style={{ filter: "drop-shadow(0 0 0.4px currentColor)" }}
    />
  );
}
