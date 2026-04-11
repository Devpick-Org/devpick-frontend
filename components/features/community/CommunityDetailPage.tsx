"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { postsEndpoints } from "@/lib/api/endpoints/posts";
import { useAuthStore } from "@/store/auth.store";
import { ConfirmModal } from "@/components/ui/confirm-modal";
import { PostDetail } from "./PostDetail";
import { AiAnswerSection } from "./AiAnswerSection";
import { AnswerSection } from "./AnswerSection";
import { SimilarPosts } from "./SimilarPosts";
import { Skeleton } from "@/components/ui/skeleton";

interface Props {
  postId: string;
}

export function CommunityDetailPage({ postId }: Props) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const userId = useAuthStore((s) => s.user?.userId);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  const {
    data: postRes,
    isLoading: isPostLoading,
    isError: isPostError,
  } = useQuery({
    queryKey: ["post", postId],
    queryFn: () => postsEndpoints.getPostDetail(postId),
  });

  const deleteMutation = useMutation({
    mutationFn: () => postsEndpoints.deletePost(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast.success("게시글이 삭제되었습니다.");
      router.replace("/community");
    },
    onError: () => {
      toast.error("삭제 중 문제가 발생했습니다. 다시 시도해 주세요.");
    },
  });

  const { data: answersRes } = useQuery({
    queryKey: ["post-answers", postId],
    queryFn: () => postsEndpoints.getPostAnswers(postId),
    enabled: !!postRes?.data,
  });

  const {
    data: aiAnswerRes,
    isLoading: isAiLoading,
    isError: isAiError,
    isFetching: isAiFetching,
    refetch: refetchAiAnswer,
  } = useQuery({
    queryKey: ["post-ai-answer", postId],
    queryFn: () => postsEndpoints.getAiAnswer(postId),
    enabled: !!postRes?.data,
    retry: 0,
  });

  const { data: similarRes } = useQuery({
    queryKey: ["post-similar", postId],
    queryFn: () => postsEndpoints.getSimilarPosts(postId),
    enabled: !!postRes?.data,
  });

  const post = postRes?.data;
  const answers = answersRes?.data?.answers ?? [];
  const similarPosts = similarRes?.data?.posts ?? [];
  const isAuthor = !!userId && !!post && userId === post.authorId;

  const handleEdit = () => router.push(`/community/${postId}/edit`);
  const handleDelete = () => setDeleteConfirmOpen(true);

  const aiStatus = isAiLoading
    ? "loading"
    : isAiError
      ? "error"
      : aiAnswerRes?.data?.content
        ? "success"
        : "empty";
  const aiContent = aiAnswerRes?.data?.content;
  // isLoading은 캐시가 없는 최초 fetch, isFetching은 refetch 포함 모든 fetch
  const isAiRetrying = isAiError && isAiFetching;

  if (isPostLoading) {
    return <CommunityDetailSkeleton />;
  }

  if (isPostError || !post) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-muted-foreground">게시글을 찾을 수 없습니다.</p>
      </div>
    );
  }

  return (
    <>
      <ConfirmModal
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        title="게시글을 삭제하시겠습니까?"
        description="삭제한 게시글은 복구할 수 없습니다."
        confirmText="삭제"
        variant="danger"
        isLoading={deleteMutation.isPending}
        onConfirm={() => deleteMutation.mutate()}
      />
      <div className="mx-auto w-full max-w-7xl px-4 py-8 lg:px-8">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px]">
        {/* 메인 콘텐츠 */}
        <main className="min-w-0">
          <PostDetail
            post={post}
            isAuthor={isAuthor}
            onEdit={handleEdit}
            onDelete={handleDelete}
            isDeleting={deleteMutation.isPending}
          />
          <AiAnswerSection
            status={aiStatus}
            content={aiContent}
            onRetry={() => refetchAiAnswer()}
            isRetrying={isAiRetrying}
          />
          <AnswerSection
            postId={postId}
            postAuthorId={post.authorId}
            answers={answers}
          />
        </main>

        {/* 사이드바 — 데스크탑 */}
        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <SimilarPosts posts={similarPosts} />
          </div>
        </aside>
      </div>

      {/* 사이드바 — 모바일 */}
      <div className="mt-8 lg:hidden">
        <SimilarPosts posts={similarPosts} />
      </div>
    </div>
    </>
  );
}

function CommunityDetailSkeleton() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 lg:px-8">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px]">

        {/* 메인 */}
        <div className="min-w-0">
          {/* 뒤로가기 */}
          <Skeleton className="mb-6 h-4 w-24" />

          {/* 메타: 작성자 · 레벨 · 시간 */}
          <div className="mb-4 flex items-center gap-2">
            <Skeleton className="h-3.5 w-3.5 rounded-full" />
            <Skeleton className="h-3.5 w-16" />
            <Skeleton className="h-3.5 w-10" />
            <Skeleton className="h-3.5 w-14" />
          </div>

          {/* 제목 */}
          <Skeleton className="mb-6 h-7 w-4/5" />

          {/* 본문 */}
          <div className="mb-8 space-y-2.5">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-[92%]" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-[85%]" />
            <Skeleton className="h-20 w-full rounded-lg" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-[78%]" />
          </div>

          {/* 첨부 파일 자리 */}
          <Skeleton className="mb-8 h-14 w-full rounded-lg" />

          {/* AI 답변 카드 */}
          <div className="mb-8 rounded-xl border border-border p-5 space-y-3">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-[70%]" />
          </div>

          {/* 답변 섹션 제목 */}
          <Skeleton className="mb-6 h-5 w-16" />

          {/* 답변 카드 1 */}
          <div className="mb-5 rounded-xl bg-card p-5 space-y-3">
            <div className="flex items-center gap-2">
              <Skeleton className="h-3.5 w-3.5 rounded-full" />
              <Skeleton className="h-3.5 w-20" />
              <Skeleton className="h-3.5 w-14" />
            </div>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-[80%]" />
          </div>

          {/* 답변 카드 2 */}
          <div className="rounded-xl bg-card p-5 space-y-3">
            <div className="flex items-center gap-2">
              <Skeleton className="h-3.5 w-3.5 rounded-full" />
              <Skeleton className="h-3.5 w-24" />
              <Skeleton className="h-3.5 w-14" />
            </div>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-[88%]" />
          </div>
        </div>

        {/* 사이드바 */}
        <div className="hidden lg:block">
          <div className="sticky top-24 space-y-4">
            {/* 유사 질문 제목 */}
            <Skeleton className="h-5 w-20" />

            {/* 유사 질문 카드 5개 */}
            <div className="rounded-xl border border-border p-4 space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-[75%]" />
              <Skeleton className="h-3.5 w-16" />
            </div>
            <div className="rounded-xl border border-border p-4 space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-[60%]" />
              <Skeleton className="h-3.5 w-16" />
            </div>
            <div className="rounded-xl border border-border p-4 space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-[80%]" />
              <Skeleton className="h-3.5 w-16" />
            </div>
            <div className="rounded-xl border border-border p-4 space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-[70%]" />
              <Skeleton className="h-3.5 w-16" />
            </div>
            <div className="rounded-xl border border-border p-4 space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-[85%]" />
              <Skeleton className="h-3.5 w-16" />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
