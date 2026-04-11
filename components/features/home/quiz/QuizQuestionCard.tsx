import { cn } from "@/lib/utils";
import type {
  MultipleChoiceQuestion,
  ShortAnswerQuestion,
  QuizQuestion,
  QuizAnswer,
} from "@/types/quiz";

// ─── 객관식 카드 ──────────────────────────────────────────────────────────────

interface QuizMultipleChoiceCardProps {
  question: MultipleChoiceQuestion;
  selectedOptionId: string | null;
  onSelect: (optionId: string) => void;
}

function QuizMultipleChoiceCard({
  question,
  selectedOptionId,
  onSelect,
}: QuizMultipleChoiceCardProps) {
  return (
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
  );
}

// ─── 주관식 카드 ──────────────────────────────────────────────────────────────

interface QuizShortAnswerCardProps {
  question: ShortAnswerQuestion;
  answerText: string;
  onChange: (text: string) => void;
}

function QuizShortAnswerCard({
  question,
  answerText,
  onChange,
}: QuizShortAnswerCardProps) {
  return (
    <div className="space-y-3">
      <input
        type="text"
        value={answerText}
        onChange={(e) => onChange(e.target.value)}
        placeholder="정답을 입력하세요 (단답형)"
        className="w-full rounded-xl border border-border bg-card px-4 py-3.5 text-sm font-medium text-foreground placeholder:text-muted-foreground/60 outline-none focus:border-primary/50 transition-colors"
      />
    </div>
  );
}

// ─── 통합 카드 ───────────────────────────────────────────────────────────────

interface QuizQuestionCardProps {
  question: QuizQuestion;
  answer: QuizAnswer | undefined;
  onAnswer: (answer: QuizAnswer) => void;
}

export function QuizQuestionCard({
  question,
  answer,
  onAnswer,
}: QuizQuestionCardProps) {
  return (
    <div className="space-y-5">
      <p className="text-base font-semibold leading-relaxed text-foreground whitespace-pre-line">
        {question.question}
      </p>

      {question.type === "multiple_choice" ? (
        <QuizMultipleChoiceCard
          question={question}
          selectedOptionId={
            answer?.type === "multiple_choice" ? answer.selectedOptionId : null
          }
          onSelect={(optionId) =>
            onAnswer({
              type: "multiple_choice",
              questionId: question.id,
              selectedOptionId: optionId,
            })
          }
        />
      ) : (
        <QuizShortAnswerCard
          question={question}
          answerText={answer?.type === "short_answer" ? answer.answerText : ""}
          onChange={(text) =>
            onAnswer({
              type: "short_answer",
              questionId: question.id,
              answerText: text,
            })
          }
        />
      )}
    </div>
  );
}
