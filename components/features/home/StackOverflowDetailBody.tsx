import {
  ThumbsUp,
  Eye,
  MessageSquare,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import { ContentRenderer } from "./ContentRenderer";
import type {
  StackOverflowContentDetail,
  StackOverflowAnswer,
} from "@/types/content";

function formatCount(n: number): string {
  if (n >= 1_000_000)
    return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1).replace(/\.0$/, "")}K`;
  return String(n);
}

// ─── Stats ───────────────────────────────────────────────────────────────────

interface SOStatsProps {
  score: number | null;
  viewCount: number | null;
  answerCount: number;
  isAnswered: boolean | null;
}

export function SOStats({
  score,
  viewCount,
  answerCount,
  isAnswered,
}: SOStatsProps) {
  return (
    <div className="flex flex-wrap items-center justify-end gap-x-4 gap-y-1.5">
      {score != null && (
        <span className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
          <ThumbsUp className="h-3.5 w-3.5" />
          추천 {formatCount(score)}
        </span>
      )}
      {viewCount != null && (
        <span className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
          <Eye className="h-3.5 w-3.5" />
          조회 {formatCount(viewCount)}
        </span>
      )}
      {answerCount > 0 && (
        <span className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
          <MessageSquare className="h-3.5 w-3.5" />
          답변 {answerCount}
        </span>
      )}
      {isAnswered && (
        <span className="flex items-center gap-1.5 rounded-full bg-green-500/10 px-2.5 py-0.5 text-xs font-semibold text-green-600 dark:text-green-400">
          <CheckCircle2 className="h-3.5 w-3.5" />
          해결됨
        </span>
      )}
    </div>
  );
}

// ─── Answer Card ─────────────────────────────────────────────────────────────

interface SOAnswerCardProps {
  answer: StackOverflowAnswer;
  isAccepted?: boolean;
}

function SOAnswerCard({ answer, isAccepted = false }: SOAnswerCardProps) {
  return (
    <div
      className={`rounded-2xl border p-6 ${
        isAccepted ? "border-primary/20 bg-primary/5" : "border-border bg-card"
      }`}
    >
      {isAccepted && (
        <div className="mb-4 flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-sm font-semibold text-primary">
            <CheckCircle2 className="h-4 w-4" />
            채택된 답변
          </span>
          <span className="flex items-center gap-1 text-sm font-semibold text-muted-foreground">
            <ThumbsUp className="h-3.5 w-3.5" />
            {answer.score}
          </span>
        </div>
      )}
      <div className={`flex items-start gap-4 font-medium`}>
        <div className="min-w-0 flex-1">
          <ContentRenderer content={answer.body} />
        </div>
        {!isAccepted && (
          <span className="flex shrink-0 items-center gap-1 text-sm font-semibold text-muted-foreground">
            <ThumbsUp className="h-3.5 w-3.5" />
            {answer.score}
          </span>
        )}
      </div>
    </div>
  );
}

// ─── StackOverflowDetailBody ──────────────────────────────────────────────────
// props를 StackOverflowContentDetail로 좁혔기 때문에
// SO 전용 필드는 모두 required + nullable — undefined 없이 자연스럽게 추론됨

interface StackOverflowDetailBodyProps {
  content: StackOverflowContentDetail;
}

export function StackOverflowDetailBody({
  content,
}: StackOverflowDetailBodyProps) {
  const { questionContent, acceptedAnswer, topAnswers, canonicalUrl } = content;

  return (
    <>
      {/* 질문 */}
      {questionContent && (
        <div className=" rounded-2xl bg-card p-6 -mt-10">
          <div className="font-medium">
            <ContentRenderer content={questionContent} />
          </div>
        </div>
      )}

      {/* 질문-답변 구분선 */}
      {(acceptedAnswer || (topAnswers && topAnswers.length > 0)) &&
        questionContent && <hr className="mb-8 border-border" />}

      {/* 채택 답변 */}
      {acceptedAnswer && (
        <div className="mb-6">
          <SOAnswerCard answer={acceptedAnswer} isAccepted />
        </div>
      )}

      {/* 다른 답변 */}
      {topAnswers && topAnswers.length > 0 && (
        <div className="mb-8">
          <p className="mb-3 text-md font-semibold textforeground">
            다른 답변들 ({topAnswers.length})
          </p>
          <div className="space-y-4">
            {topAnswers.map((answer, idx) => (
              <SOAnswerCard key={idx} answer={answer} />
            ))}
          </div>
        </div>
      )}

      {/* 원문 보기 */}
      <div className="flex justify-center pt-4">
        <a
          href={canonicalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2.5 rounded-xl bg-primary px-8 py-3.5 text-sm font-semibold text-primary-foreground transition-all duration-200 hover:brightness-110"
        >
          <ExternalLink className="h-4 w-4" />
          원문 보러 가기
        </a>
      </div>
    </>
  );
}
