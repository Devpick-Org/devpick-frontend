"use client";

import { useState, useEffect } from "react";
import { useHydrated } from "@/lib/hooks/useHydrated";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useAuthStore } from "@/store/auth.store";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postsEndpoints } from "@/lib/api/endpoints/posts";
import { extractApiError } from "@/lib/api/extractApiError";
import { PostWriteForm } from "@/components/features/community/PostWriteForm";
import { PostRefinePanel } from "@/components/features/community/PostRefinePanel";
import type { PostDraft, RefinePostData } from "@/types/community";

// ─── 첨부파일 업로드 ──────────────────────────────────────────────────────────
// 파일 배열을 S3에 업로드하고 URL 배열을 반환한다.
async function uploadFiles(files: File[]): Promise<string[]> {
  if (files.length === 0) return [];
  const results = await Promise.all(
    files.map((file) => postsEndpoints.uploadAttachment(file)),
  );
  return results.map((r) => r.url);
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CommunityWritePage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isInitialized = useAuthStore((s) => s.isInitialized);
  const mounted = useHydrated();

  // ─── 첨부파일 — source of truth ────────────────────────────────────────────
  // 왼쪽 폼의 현재 파일 목록. 오른쪽 패널에는 refine 시점 스냅샷(savedFiles)을 전달한다.
  const [files, setFiles] = useState<File[]>([]);

  // ─── 개선 결과 / 원본 스냅샷 ───────────────────────────────────────────────
  // savedDraft/savedFiles는 refine 트리거 시점에 고정 → "원본으로 게시"에 사용
  // refineKey와 refineResult를 하나의 state로 묶어 단일 렌더에서 업데이트.
  // key와 result가 항상 동시에 바뀌므로, PostRefinePanel의 useState 초기값이
  // 올바른 refineResult를 받아 초기화된다.
  const [refineState, setRefineState] = useState<{
    key: number;
    result: RefinePostData | null;
  }>({ key: 0, result: null });
  const [savedDraft, setSavedDraft] = useState<PostDraft | null>(null);
  const [savedFiles, setSavedFiles] = useState<File[]>([]);

  // ─── Mutations ──────────────────────────────────────────────────────────────

  const refineMutation = useMutation({
    mutationFn: postsEndpoints.refinePost,
    onSuccess: (res) => {
      setRefineState((prev) => ({ key: prev.key + 1, result: res }));
    },
  });

  const createMutation = useMutation({
    mutationFn: postsEndpoints.createPost,
    onSuccess: (res) => {
      // ["post", id] 캐시는 ApiResponse<PostDetailDTO> 전체를 저장한다.
      // getPostDetail 쿼리와 shape가 동일(PostDetailResponse = ApiResponse<PostDetailDTO>)하므로
      // res를 그대로 선세팅하면 상세 페이지 진입 시 즉시 캐시 히트된다.
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
      queryClient.setQueryData(["post", res.data.id], res);
      router.replace(`/community/${res.data.id}`);
    },
  });

  // ─── 인증 가드 ──────────────────────────────────────────────────────────────

  useEffect(() => {
    if (mounted && isInitialized && !isAuthenticated) {
      router.replace("/community");
    }
  }, [mounted, isInitialized, isAuthenticated, router]);

  if (!mounted || !isInitialized || !isAuthenticated) return null;

  // ─── 핸들러 ─────────────────────────────────────────────────────────────────

  const handleFilesChange = (added: File[]) =>
    setFiles((prev) => [...prev, ...added]);

  const handleRemoveFile = (name: string) =>
    setFiles((prev) => prev.filter((f) => f.name !== name));

  /** 왼쪽 폼: AI로 질문 개선하기
   * savedDraft/savedFiles를 mutate 호출 전에 먼저 고정해야
   * 로딩 중 files가 변경되더라도 오른쪽 패널의 원본 기준이 흔들리지 않는다.
   */
  const handleRefine = (draft: PostDraft) => {
    setSavedDraft(draft);
    setSavedFiles([...files]);
    refineMutation.mutate(draft);
  };

  /** 왼쪽 폼: 바로 게시하기 — 현재 files 기준 */
  const handleSubmitDirect = async (draft: PostDraft) => {
    const attachmentUrls = await uploadFiles(files);
    createMutation.mutate({ ...draft, attachmentUrls });
  };

  /** 오른쪽 패널: 개선안으로 게시 — savedFiles 기준 */
  const handleSubmitRefined = async (draft: PostDraft) => {
    const attachmentUrls = await uploadFiles(savedFiles);
    createMutation.mutate({ ...draft, attachmentUrls });
  };

  /** 오른쪽 패널: 원본으로 게시 — savedDraft + savedFiles 기준 */
  const handleSubmitOriginal = async () => {
    if (!savedDraft) return;
    const attachmentUrls = await uploadFiles(savedFiles);
    createMutation.mutate({ ...savedDraft, attachmentUrls });
  };

  // ─── 렌더 ───────────────────────────────────────────────────────────────────

  return (
    <div className="w-full px-4 py-8 lg:px-8">
      {/* 게시 중 모달 */}
      {createMutation.isPending && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-4 rounded-2xl bg-card px-20 py-14 shadow-lg">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm font-semibold text-foreground">게시 중...</p>
          </div>
        </div>
      )}
      <div className="mx-auto max-w-6xl">
        {/* 뒤로가기 */}
        <Link
          href="/community"
          className="group/back -ml-3 mb-8 inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover/back:-translate-x-0.5" />
          커뮤니티로
        </Link>

        {/* 페이지 헤더 */}
        <header className="mb-8">
          <h1 className="text-2xl font-bold tracking-[-0.01em] text-foreground">
            질문하기
          </h1>
          <p className="mt-1 text-sm font-medium text-muted-foreground">
            막히는 부분을 자유롭게 질문해 보세요. AI가 질문을 더 명확하게 다듬어
            드릴 수 있어요.
          </p>
        </header>

        {/* 2컬럼 레이아웃 — 모바일은 세로 스택 */}
        <div className="grid gap-8 lg:grid-cols-2">
          {/* 왼쪽: 입력 폼 */}
          <section>
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              내 질문
            </h2>
            <PostWriteForm
              files={files}
              onFilesChange={handleFilesChange}
              onRemoveFile={handleRemoveFile}
              onRefine={handleRefine}
              onSubmit={handleSubmitDirect}
              isRefining={refineMutation.isPending}
              isSubmitting={createMutation.isPending}
              refineError={
                refineMutation.isError
                  ? "AI 개선 중 문제가 발생했습니다. 다시 시도해 주세요."
                  : null
              }
              submitError={
                createMutation.isError
                  ? extractApiError(createMutation.error).code === "COMMUNITY_013"
                    ? "잠시 후 다시 시도해 주세요."
                    : "게시 중 문제가 발생했습니다. 다시 시도해 주세요."
                  : null
              }
            />
          </section>

          {/* 오른쪽: AI 개선 결과 패널 */}
          <section>
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              AI 개선 결과
            </h2>
            <PostRefinePanel
              key={refineState.key}
              refineResult={refineState.result}
              originalLevel={savedDraft?.level ?? "JUNIOR"}
              originalFiles={savedFiles}
              isLoading={refineMutation.isPending}
              isSubmitting={createMutation.isPending}
              submitError={
                createMutation.isError
                  ? extractApiError(createMutation.error).code === "COMMUNITY_013"
                    ? "잠시 후 다시 시도해 주세요."
                    : "게시 중 문제가 발생했습니다. 다시 시도해 주세요."
                  : null
              }
              onSubmitRefined={handleSubmitRefined}
              onSubmitOriginal={handleSubmitOriginal}
            />
          </section>
        </div>
      </div>
    </div>
  );
}
