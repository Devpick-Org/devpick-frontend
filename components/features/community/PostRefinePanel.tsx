"use client";

import { useRef, useState, type ChangeEvent, type DragEvent } from "react";
import { CheckCircle2, Paperclip, Send, Sparkles, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { LocalFileItem, PostDraft, RefinePostData } from "@/types/community";
import type { PostLevel, PostType } from "@/types/post";

// ─── 상수 ──────────────────────────────────────────────────────────────────

const TITLE_MAX = 500;
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;
const MAX_REQUEST_SIZE_BYTES = 12 * 1024 * 1024;

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
  originalPostType: PostType;
  /** 원본 첨부파일 — 개선안에 그대로 표시 */
  originalFiles: LocalFileItem[];
  isLoading: boolean;
  isSubmitting: boolean;
  submitError?: string | null;
  /** 개선안으로 게시: 편집된 draft + 패널에서 수정된 파일 목록을 객체로 전달 */
  onSubmitRefined: (source: { draft: PostDraft; files: LocalFileItem[] }) => void;
  /** 원본으로 게시: page가 savedDraft를 사용 */
  onSubmitOriginal: () => void;
}

// ─── 컴포넌트 ──────────────────────────────────────────────────────────────

export function PostRefinePanel({
  refineResult,
  originalLevel,
  originalPostType,
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

  // 패널에서 독립적으로 관리하는 파일 목록 — originalFiles 스냅샷으로 초기화
  const [refinedFiles, setRefinedFiles] = useState<LocalFileItem[]>([...originalFiles]);
  const [isDragging, setIsDragging] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragCounterRef = useRef(0);

  const validateRefined = (): boolean => {
    const next: { title?: string; content?: string } = {};
    if (!editedTitle.trim()) next.title = "제목을 입력해 주세요.";
    else if (editedTitle.length > TITLE_MAX)
      next.title = `제목은 ${TITLE_MAX}자 이하로 입력해 주세요.`;
    if (!editedContent.trim()) next.content = "본문을 입력해 주세요.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const addFiles = (fileList: FileList | null) => {
    if (!fileList) return;
    const selected = Array.from(fileList);
    const oversized = selected.filter((f) => f.size > MAX_FILE_SIZE_BYTES);
    const validSelected = selected.filter((f) => f.size <= MAX_FILE_SIZE_BYTES);
    const fileKey = (f: File) => `${f.name}__${f.size}__${f.lastModified}`;
    const existingKeys = new Set(refinedFiles.map((item) => fileKey(item.file)));
    const deduped = validSelected.filter((f) => !existingKeys.has(fileKey(f)));
    const totalSize =
      refinedFiles.reduce((sum, item) => sum + item.file.size, 0) +
      deduped.reduce((sum, f) => sum + f.size, 0);
    if (totalSize > MAX_REQUEST_SIZE_BYTES) {
      setFileError("전체 첨부 용량은 12MB를 초과할 수 없습니다.");
      return;
    }
    setFileError(
      oversized.length > 0
        ? `10MB 초과 파일 제외됨: ${oversized.map((f) => f.name).join(", ")}`
        : null,
    );
    if (deduped.length > 0) {
      const newItems: LocalFileItem[] = deduped.map((file) => ({
        id: crypto.randomUUID(),
        file,
      }));
      setRefinedFiles((prev) => [...prev, ...newItems]);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    addFiles(e.target.files);
    e.target.value = "";
  };

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    dragCounterRef.current += 1;
    setIsDragging(true);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => { e.preventDefault(); };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    dragCounterRef.current -= 1;
    if (dragCounterRef.current === 0) setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    dragCounterRef.current = 0;
    setIsDragging(false);
    addFiles(e.dataTransfer.files);
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
      <div className="flex flex-col gap-5 rounded-xl border border-border bg-card p-5">
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

        {/* 첨부파일 — 편집 가능 */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-foreground">
            첨부파일
            <span className="ml-1.5 text-xs font-normal text-muted-foreground">(선택)</span>
          </label>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,.pdf,.txt,.zip"
            className="hidden"
            onChange={handleFileChange}
          />
          {refinedFiles.length > 0 && (
            <ul className="mb-2 space-y-1.5">
              {refinedFiles.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center justify-between rounded-lg border border-border bg-secondary/40 px-3 py-2"
                >
                  <div className="flex min-w-0 items-center gap-2">
                    <Paperclip className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                    <span className="truncate text-xs font-medium text-foreground">{item.file.name}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setRefinedFiles((prev) => prev.filter((p) => p.id !== item.id))}
                    className="ml-2 shrink-0 rounded p-0.5 text-muted-foreground transition-colors hover:text-foreground"
                    aria-label="파일 제거"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </li>
              ))}
            </ul>
          )}
          <div
            role="button"
            tabIndex={0}
            onClick={() => fileInputRef.current?.click()}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") fileInputRef.current?.click(); }}
            onDragEnter={handleDragEnter}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={cn(
              "flex cursor-pointer items-center gap-1.5 rounded-lg border border-dashed px-4 py-2.5 text-sm font-medium transition-colors",
              isDragging
                ? "border-primary bg-primary/5 text-primary"
                : "border-border text-muted-foreground hover:border-border/80 hover:text-foreground",
            )}
          >
            <Paperclip className="h-4 w-4" />
            {isDragging ? "여기에 놓으세요" : "파일 추가"}
          </div>
          {fileError && (
            <p className="mt-1.5 text-xs font-medium text-destructive">{fileError}</p>
          )}
        </div>
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
          className="flex-1 gap-2 border-0 bg-secondary text-foreground hover:bg-secondary/80 hover:text-foreground"
        >
          원본으로 게시
        </Button>
        <Button
          type="button"
          onClick={() => {
            if (validateRefined()) {
              onSubmitRefined({
                draft: { postType: originalPostType, title: editedTitle, content: editedContent, level: originalLevel },
                files: refinedFiles,
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
