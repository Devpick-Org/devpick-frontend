"use client";

import { useState } from "react";
import { CheckCircle2, Paperclip, Send, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { PostDraft, RefinePostData } from "@/types/community";
import type { PostLevel } from "@/types/post";

// ─── 상수 ──────────────────────────────────────────────────────────────────

const TITLE_MAX = 500;

const LEVEL_LABELS: Record<PostLevel, string> = {
  BEGINNER: "입문",
  JUNIOR: "주니어",
  MIDDLE: "미들",
  SENIOR: "시니어",
};

// ─── Props ─────────────────────────────────────────────────────────────────

interface PostRefinePanelProps {
  refineResult: RefinePostData | null;
  /** 원본 레벨 — 개선안에 그대로 사용, read-only 표시 */
  originalLevel: PostLevel;
  /** 원본 첨부파일 — 개선안에 그대로 표시 */
  originalFiles: File[];
  isLoading: boolean;
  isSubmitting: boolean;
  submitError?: string | null;
  /** 개선안으로 게시: 현재 편집된 값 전달 */
  onSubmitRefined: (draft: PostDraft) => void;
  /** 원본으로 게시: page가 savedDraft를 사용 */
  onSubmitOriginal: () => void;
}

// ─── 컴포넌트 ──────────────────────────────────────────────────────────────

export function PostRefinePanel({
  refineResult,
  originalLevel,
  originalFiles,
  isLoading,
  isSubmitting,
  submitError,
  onSubmitRefined,
  onSubmitOriginal,
}: PostRefinePanelProps) {
  const [editedTitle, setEditedTitle] = useState(
    refineResult?.refinedTitle ?? "",
  );
  const [editedContent, setEditedContent] = useState(
    refineResult?.refinedContent ?? "",
  );
  const [errors, setErrors] = useState<{ title?: string; content?: string }>(
    {},
  );

  const validateRefined = (): boolean => {
    const next: { title?: string; content?: string } = {};
    if (!editedTitle.trim()) next.title = "제목을 입력해 주세요.";
    else if (editedTitle.length > TITLE_MAX)
      next.title = `제목은 ${TITLE_MAX}자 이하로 입력해 주세요.`;
    if (!editedContent.trim()) next.content = "본문을 입력해 주세요.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  // ─── 로딩 ──────────────────────────────────────────────────────────────

  if (isLoading) {
    return (
      <div className="flex flex-col gap-5">
        <div>
          <Skeleton className="mb-1.5 h-4 w-20 rounded" />
          <Skeleton className="h-[46px] w-full rounded-xl" />
        </div>
        <div>
          <Skeleton className="mb-2 h-4 w-16 rounded" />
          <Skeleton className="h-[38px] w-24 rounded-lg" />
        </div>
        <div>
          <Skeleton className="mb-1.5 h-4 w-20 rounded" />
          <Skeleton className="h-[280px] w-full rounded-xl" />
        </div>
        <div>
          <Skeleton className="mb-3 h-3.5 w-20 rounded" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full rounded" />
            <Skeleton className="h-4 w-4/5 rounded" />
          </div>
        </div>
      </div>
    );
  }

  // ─── 초기 상태 (결과 없음) ─────────────────────────────────────────────

  if (!refineResult) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <Sparkles className="mb-3 h-8 w-8 text-primary/20" />
        <p className="text-sm font-medium text-muted-foreground">
          AI로 질문 개선하기를 누르면
          <br />
          여기에 개선 결과가 표시돼요.
        </p>
      </div>
    );
  }

  // ─── 결과 표시 ─────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col gap-5">
      {/* 입력 필드 카드 */}
      <div className="flex flex-col gap-5 rounded-xl border border-primary/30 bg-primary/5 p-5">
        {/* 개선된 제목 */}
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label className="text-sm font-semibold text-foreground">
              제목
            </label>
            <span
              className={cn(
                "text-xs font-medium",
                editedTitle.length > TITLE_MAX
                  ? "text-destructive"
                  : "text-muted-foreground",
              )}
            >
              {editedTitle.length} / {TITLE_MAX}
            </span>
          </div>
          <input
            type="text"
            value={editedTitle}
            onChange={(e) => {
              setEditedTitle(e.target.value);
              setErrors((p) => ({ ...p, title: undefined }));
            }}
            className={cn(
              "w-full rounded-xl border bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-primary",
              errors.title ? "border-destructive" : "border-border",
            )}
          />
          {errors.title && (
            <p className="mt-1.5 text-xs font-medium text-destructive">
              {errors.title}
            </p>
          )}
        </div>

        {/* 레벨 — read-only */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-foreground">
            레벨
          </label>
          <span className="inline-block rounded-lg bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
            {LEVEL_LABELS[originalLevel]}
          </span>
        </div>

        {/* 개선된 본문 */}
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-foreground">
            본문
          </label>
          <textarea
            value={editedContent}
            onChange={(e) => {
              setEditedContent(e.target.value);
              setErrors((p) => ({ ...p, content: undefined }));
            }}
            rows={14}
            className={cn(
              "w-full resize-y rounded-xl border bg-background px-4 py-3 text-sm leading-relaxed text-foreground outline-none transition-colors focus:border-primary",
              errors.content ? "border-destructive" : "border-border",
            )}
          />
          {errors.content && (
            <p className="mt-1.5 text-xs font-medium text-destructive">
              {errors.content}
            </p>
          )}
        </div>

        {/* 첨부파일 — 원본 그대로 표시 */}
        {originalFiles.length > 0 && (
          <div>
            <label className="mb-2 block text-sm font-semibold text-foreground">
              첨부파일
            </label>
            <ul className="space-y-1.5">
              {originalFiles.map((f) => (
                <li
                  key={f.name}
                  className="flex items-center gap-2 rounded-lg border border-border bg-secondary/40 px-3 py-2"
                >
                  <Paperclip className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                  <span className="truncate text-xs font-medium text-foreground">
                    {f.name}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      {/* 입력 필드 카드 끝 */}

      {/* Suggestions */}
      {refineResult.suggestions.length > 0 && (
        <div className="rounded-xl border border-border bg-card px-5 py-4">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            개선 포인트
          </p>
          <ul className="space-y-2">
            {refineResult.suggestions.map((s, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-sm font-medium text-foreground/80"
              >
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary/60" />
                {s}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 에러 */}
      {submitError && (
        <p className="rounded-xl bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">
          {submitError}
        </p>
      )}

      {/* 게시 버튼 */}
      <div className="flex flex-col gap-2.5 sm:flex-row">
        <Button
          type="button"
          variant="outline"
          onClick={onSubmitOriginal}
          disabled={isSubmitting}
          className="flex-1 gap-2 hover:bg-secondary hover:text-secondary-foreground"
        >
          <Send className="h-4 w-4" />
          원본으로 게시
        </Button>
        <Button
          type="button"
          onClick={() => {
            if (validateRefined()) {
              onSubmitRefined({
                title: editedTitle,
                content: editedContent,
                level: originalLevel,
              });
            }
          }}
          disabled={isSubmitting}
          className="flex-1 gap-2"
        >
          <Sparkles className="h-4 w-4" />
          {isSubmitting ? "게시 중..." : "개선안으로 게시"}
        </Button>
      </div>
    </div>
  );
}
