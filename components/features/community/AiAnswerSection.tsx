import { AlertTriangle, RefreshCw } from "lucide-react";
import { ContentRenderer } from "./ContentRenderer";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type AiAnswerStatus = "loading" | "success" | "error" | "empty";

interface AiAnswerSectionProps {
  status: AiAnswerStatus;
  content?: string;
  keyPoints?: string[] | null;
  suggestedTags?: string[] | null;
  confidence?: number | null;
  onRetry?: () => void;
  isRetrying?: boolean;
}

export function AiAnswerSection({
  status,
  content,
  keyPoints,
  suggestedTags,
  confidence,
  onRetry,
  isRetrying = false,
}: AiAnswerSectionProps) {
  return (
    <section className="mb-8">
      <div className="mb-3 flex items-center gap-2">
        <h2 className="text-lg font-bold text-foreground">AI 1차 답변</h2>
      </div>
      <div className="rounded-xl border border-border bg-card p-5">
        {status === "loading" && <AiAnswerLoading />}
        {status === "success" && content && (
          <div className="space-y-4">
            {confidence !== null &&
              confidence !== undefined &&
              confidence < 0.5 && (
                <div className="flex items-center gap-1.5 rounded-lg bg-amber-50 px-3 py-2 text-xs font-medium text-amber-700 dark:bg-amber-950/30 dark:text-amber-400">
                  <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                  AI 답변이 불확실할 수 있습니다
                </div>
              )}
            {keyPoints && keyPoints.length > 0 && (
              <div className="border-b border-border pb-4">
                <p className="mb-2 text-sm font-bold text-foreground">핵심 포인트</p>
                <ul className="space-y-1.5">
                  {keyPoints.map((point, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-[15px] leading-7 text-foreground/85 font-medium"
                    >
                      <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <ContentRenderer
              content={content}
              className="space-y-3 text-[15px] leading-7 text-foreground/85 font-medium"
            />
            {suggestedTags && suggestedTags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 border-t border-border pt-4">
                {suggestedTags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
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
              : "text-muted-foreground hover:bg-muted hover:text-foreground",
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
    <div className="flex min-h-[72px] items-center justify-center">
      <p className="text-sm text-muted-foreground font-medium">
        아직 생성된 AI 답변이 없습니다.
      </p>
    </div>
  );
}
