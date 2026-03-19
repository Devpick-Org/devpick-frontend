"use client";

import { useQuery } from "@tanstack/react-query";
import { postsEndpoints } from "@/lib/api/endpoints/posts";
import { PostDetail } from "./PostDetail";
import { AiAnswerSection } from "./AiAnswerSection";
import { AnswerSection } from "./AnswerSection";
import { SimilarPosts } from "./SimilarPosts";
import { Skeleton } from "@/components/ui/skeleton";

interface Props {
  postId: string;
}

export function CommunityDetailPage({ postId }: Props) {
  const {
    data: postRes,
    isLoading: isPostLoading,
    isError: isPostError,
  } = useQuery({
    queryKey: ["post", postId],
    queryFn: () => postsEndpoints.getPostDetail(postId),
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
  const similarPosts = similarRes?.data ?? [];

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
    <div className="mx-auto w-full max-w-7xl px-4 py-8 lg:px-8">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px]">
        {/* 메인 콘텐츠 */}
        <main className="min-w-0">
          <PostDetail post={post} />
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
  );
}

function CommunityDetailSkeleton() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 lg:px-8">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="min-w-0 flex-1 space-y-4">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-7 w-3/4" />
          <Skeleton className="h-48 w-full rounded-xl" />
        </div>
        <div className="hidden space-y-3 lg:block">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-20 w-full rounded-xl" />
          <Skeleton className="h-20 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
}
