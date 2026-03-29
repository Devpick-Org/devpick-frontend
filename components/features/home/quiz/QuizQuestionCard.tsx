import { cn } from "@/lib/utils";
import type { QuizQuestion } from "@/types/quiz";

interface QuizQuestionCardProps {
  question: QuizQuestion;
  selectedOptionId: string | null;
  onSelect: (optionId: string) => void;
}

export function QuizQuestionCard({
  question,
  selectedOptionId,
  onSelect,
}: QuizQuestionCardProps) {
  return (
    <div className="space-y-5">
      <p className="text-base font-semibold leading-relaxed text-foreground whitespace-pre-line">
        {question.question}
      </p>

      <div className="space-y-2.5">
        {question.options.map((option) => {
          const isSelected = selectedOptionId === option.id;
          return (
            <button
              key={option.id}
              onClick={() => onSelect(option.id)}
              className={cn(
                "w-full rounded-xl border px-4 py-3.5 text-left text-sm font-medium transition-all duration-150 cursor-pointer",
                isSelected
                  ? "border-border bg-primary/5 text-primary"
                  : "border-border bg-card text-foreground",
              )}
            >
              <span
                className={cn(
                  "mr-3 font-semibold",
                  isSelected ? "text-primary" : "text-muted-foreground",
                )}
              >
                {option.id.toUpperCase()}.
              </span>
              {option.text}
            </button>
          );
        })}
      </div>
    </div>
  );
}
