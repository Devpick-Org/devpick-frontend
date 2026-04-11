"use client";

import { useRef, useState, type ChangeEvent, type DragEvent } from "react";
import { Paperclip, Send, Sparkles, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { PostDraft } from "@/types/community";
import type { PostLevel } from "@/types/post";

// ─── 상수 ──────────────────────────────────────────────────────────────────

const LEVELS: { id: PostLevel; label: string; desc: string }[] = [
  { id: "BEGINNER", label: "입문", desc: "1년 미만" },
  { id: "JUNIOR", label: "주니어", desc: "1~3년차" },
  { id: "MIDDLE", label: "미들", desc: "3~5년차" },
  { id: "SENIOR", label: "시니어", desc: "5년차+" },
];

const TITLE_MAX = 500;

const CONTENT_PLACEHOLDER = `어떤 문제가 발생했는지 구체적으로 설명해 주세요.

예시 항목:
- 현재 상황: 어떤 코드를 작성하다가 어떤 문제가 생겼는지
- 환경 / 기술 스택: 사용 중인 언어, 프레임워크, 버전
- 에러 메시지: 발생하는 에러나 예외 내용
- 시도해본 것: 이미 찾아보거나 시도한 방법들
- 기대하는 결과: 어떻게 동작하기를 원하는지`;

// ─── Props ─────────────────────────────────────────────────────────────────

interface PostWriteFormProps {
  initialDraft?: PostDraft;
  /** page.tsx가 소유하는 첨부파일 목록 */
  files: File[];
  onFilesChange: (added: File[]) => void;
  onRemoveFile: (name: string) => void;
  /** 미전달 시 AI 개선 버튼 숨김 (수정 폼에서 사용) */
  onRefine?: (draft: PostDraft) => void;
  onSubmit: (draft: PostDraft) => void;
  isRefining?: boolean;
  isSubmitting: boolean;
  refineError?: string | null;
  submitError?: string | null;
  submitLabel?: string;
}

// ─── 컴포넌트 ──────────────────────────────────────────────────────────────

export function PostWriteForm({
  initialDraft,
  files,
  onFilesChange,
  onRemoveFile,
  onRefine,
  onSubmit,
  isRefining = false,
  isSubmitting,
  refineError,
  submitError,
  submitLabel,
}: PostWriteFormProps) {
  const [title, setTitle] = useState(initialDraft?.title ?? "");
  const [content, setContent] = useState(initialDraft?.content ?? "");
  const [level, setLevel] = useState<PostLevel | null>(
    initialDraft?.level ?? null,
  );
  const [errors, setErrors] = useState<{
    title?: string;
    content?: string;
    level?: string;
  }>({});
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  // dragLeave flickering 방지: 자식 요소 진입/이탈 시 카운터로 실제 드롭 존 이탈 여부 판단
  const dragCounterRef = useRef(0);

  const validate = (): boolean => {
    const next: { title?: string; content?: string; level?: string } = {};
    if (!title.trim()) next.title = "제목을 입력해 주세요.";
    else if (title.length > TITLE_MAX)
      next.title = `제목은 ${TITLE_MAX}자 이하로 입력해 주세요.`;
    if (!content.trim()) next.content = "본문을 입력해 주세요.";
    if (!level) next.level = "레벨을 선택해 주세요.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const addFiles = (fileList: FileList | null) => {
    if (!fileList) return;
    const selected = Array.from(fileList);
    const existingNames = new Set(files.map((f) => f.name));
    const deduped = selected.filter((f) => !existingNames.has(f.name));
    if (deduped.length > 0) onFilesChange(deduped);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    addFiles(e.target.files);
    // 같은 파일 재선택 가능하도록 초기화
    e.target.value = "";
  };

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    dragCounterRef.current += 1;
    setIsDragging(true);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

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

  // validate()가 level null을 차단하므로 이 시점에서 level은 항상 non-null
  const draft: PostDraft = { title, content, level: level! };
  const isPending = isRefining || isSubmitting;

  return (
    <div className="flex flex-col gap-5">
      {/* 입력 필드 카드 */}
      <div className="flex flex-col gap-5 rounded-xl border border-border bg-card p-5">
        {/* 제목 */}
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label className="text-sm font-semibold text-foreground">
              제목 <span className="text-destructive">*</span>
            </label>
            <span
              className={cn(
                "text-xs font-medium",
                title.length > TITLE_MAX
                  ? "text-destructive"
                  : "text-muted-foreground",
              )}
            >
              {title.length} / {TITLE_MAX}
            </span>
          </div>
          <input
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setErrors((p) => ({ ...p, title: undefined }));
            }}
            placeholder="예: React useState 업데이트가 즉시 반영되지 않는 이유가 궁금합니다"
            className={cn(
              "w-full rounded-xl border bg-background px-4 py-3 text-sm text-foreground font-medium placeholder:text-muted-foreground/50 outline-none transition-colors focus:border-primary",
              errors.title ? "border-destructive" : "border-border",
            )}
          />
          {errors.title && (
            <p className="mt-1.5 text-xs font-medium text-destructive">
              {errors.title}
            </p>
          )}
        </div>

        {/* 레벨 */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-foreground">
            레벨 <span className="text-destructive">*</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {LEVELS.map((l) => (
              <button
                key={l.id}
                type="button"
                onClick={() => setLevel(l.id)}
                className={cn(
                  "rounded-lg border px-4 py-2 text-sm font-medium transition-all cursor-pointer",
                  level === l.id
                    ? "bg-primary/10 text-primary"
                    : "border-border bg-background text-muted-foreground hover:border-border/80 hover:text-foreground",
                )}
              >
                {l.label}
                <span className="ml-1.5 text-xs opacity-60">{l.desc}</span>
              </button>
            ))}
          </div>
          {errors.level && (
            <p className="mt-1.5 text-xs font-medium text-destructive">
              {errors.level}
            </p>
          )}
        </div>

        {/* 본문 */}
        <div>
          <div className="mb-1.5 flex items-center gap-2">
            <label className="text-sm font-semibold text-foreground">
              본문 <span className="text-destructive">*</span>
            </label>
            <span className="text-xs font-medium text-muted-foreground">마크다운 지원</span>
          </div>
          <textarea
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
              setErrors((p) => ({ ...p, content: undefined }));
            }}
            placeholder={CONTENT_PLACEHOLDER}
            rows={14}
            className={cn(
              "w-full resize-y rounded-xl border bg-background px-4 py-3 text-sm font-medium leading-relaxed text-foreground placeholder:text-muted-foreground/40 outline-none transition-colors focus:border-primary",
              errors.content ? "border-destructive" : "border-border",
            )}
          />
          {errors.content && (
            <p className="mt-1.5 text-xs font-medium text-destructive">
              {errors.content}
            </p>
          )}
        </div>

        {/* 첨부파일 */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-foreground">
            첨부파일
            <span className="ml-1.5 text-xs font-normal text-muted-foreground">
              (선택)
            </span>
          </label>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,.pdf,.txt,.zip"
            className="hidden"
            onChange={handleFileChange}
          />
          {files.length > 0 && (
            <ul className="mb-2 space-y-1.5">
              {files.map((f) => (
                <li
                  key={f.name}
                  className="flex items-center justify-between rounded-lg border border-border bg-secondary/40 px-3 py-2"
                >
                  <div className="flex min-w-0 items-center gap-2">
                    <Paperclip className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                    <span className="truncate text-xs font-medium text-foreground">
                      {f.name}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => onRemoveFile(f.name)}
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
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ")
                fileInputRef.current?.click();
            }}
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
        </div>
      </div>
      {/* 입력 필드 카드 끝 */}

      {/* 에러 */}
      {(refineError ?? submitError) && (
        <p className="rounded-xl bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">
          {refineError ?? submitError}
        </p>
      )}

      {/* 액션 버튼 */}
      <div className="flex flex-col gap-2.5 sm:flex-row">
        <Button
          type="button"
          variant={onRefine ? "outline" : "default"}
          onClick={() => {
            if (validate()) onSubmit(draft);
          }}
          disabled={isPending}
          className={cn("flex-1 gap-2", onRefine && "hover:bg-secondary hover:text-secondary-foreground")}
        >
          <Send className="h-4 w-4" />
          {isSubmitting ? "저장 중..." : (submitLabel ?? "바로 게시하기")}
        </Button>
        {onRefine && (
          <Button
            type="button"
            onClick={() => {
              if (validate()) onRefine(draft);
            }}
            disabled={isPending}
            className="flex-1 gap-2"
          >
            <Sparkles className="h-4 w-4" />
            {isRefining ? "AI가 개선 중..." : "AI로 질문 개선하기"}
          </Button>
        )}
      </div>
    </div>
  );
}
