import { RefreshCw } from "lucide-react";
import { ContentRenderer } from "./ContentRenderer";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type AiAnswerStatus = "loading" | "success" | "error" | "empty";

interface AiAnswerSectionProps {
  status: AiAnswerStatus;
  content?: string;
  onRetry?: () => void;
  isRetrying?: boolean;
}

export function AiAnswerSection({
  status,
  content,
  onRetry,
  isRetrying = false,
}: AiAnswerSectionProps) {
  return (
    <section className="mb-8">
      <div className="mb-3 flex items-center gap-2">
        <h2 className="text-lg font-bold text-foreground">AI 1차 답변</h2>
      </div>
      <div className="rounded-xl bg-primary/5 p-5">
        {status === "loading" && <AiAnswerLoading />}
        {status === "success" && content && (
          <ContentRenderer
            content={content}
            className="space-y-3 text-[15px] leading-7 text-foreground/85 font-medium"
          />
        )}
        {status === "error" && (
          <AiAnswerError onRetry={onRetry} isRetrying={isRetrying} />
        )}
        {status === "empty" && <AiAnswerEmpty />}
      </div>
    </section>
  );
}

function AiAnswerLoading() {
  return (
    <div className="min-h-[72px] space-y-2.5">
      <Skeleton className="h-3.5 w-full rounded" />
      <Skeleton className="h-3.5 w-5/6 rounded" />
      <Skeleton className="h-3.5 w-4/6 rounded" />
    </div>
  );
}

function AiAnswerError({
  onRetry,
  isRetrying,
}: {
  onRetry?: () => void;
  isRetrying?: boolean;
}) {
  return (
    <div className="flex min-h-[72px] items-center justify-center gap-4">
      <p className="text-sm text-muted-foreground font-medium">
        AI 답변을 불러오지 못했습니다.
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          disabled={isRetrying}
          className={cn(
            "flex shrink-0 items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer",
            isRetrying
              ? "cursor-not-allowed text-muted-foreground/50"
              : "text-muted-foreground hover:text-primary",
          )}
        >
          <RefreshCw className={cn("h-3 w-3", isRetrying && "animate-spin")} />
          {isRetrying ? "다시 시도 중..." : "다시 시도"}
        </button>
      )}
    </div>
  );
}

function AiAnswerEmpty() {
  return (
    <div className="flex min-h-[72px] items-center">
      <p className="text-sm text-muted-foreground font-medium">
        아직 생성된 AI 답변이 없습니다.
      </p>
    </div>
  );
}
