"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useHydrated } from "@/lib/hooks/useHydrated";
import { useAuthStore } from "@/store/auth.store";
import { postsEndpoints } from "@/lib/api/endpoints/posts";
import { PostWriteForm } from "./PostWriteForm";
import type { PostDraft } from "@/types/community";

interface Props {
  postId: string;
}

export function CommunityEditPage({ postId }: Props) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const user = useAuthStore((s) => s.user);
  const mounted = useHydrated();

  const [files, setFiles] = useState<File[]>([]);

  const { data: postRes, isLoading, isError } = useQuery({
    queryKey: ["post", postId],
    queryFn: () => postsEndpoints.getPostDetail(postId),
  });

  const post = postRes?.data;

  const updateMutation = useMutation({
    mutationFn: (draft: PostDraft) =>
      postsEndpoints.updatePost(postId, {
        title: draft.title,
        content: draft.content,
        level: draft.level,
      }),
    onSuccess: (res) => {
      queryClient.setQueryData(["post", postId], res);
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast.success("게시글이 수정되었습니다.");
      router.replace(`/community/${postId}`);
    },
    onError: () => {
      toast.error("수정 중 문제가 발생했습니다. 다시 시도해 주세요.");
    },
  });

  // 인증 가드
  useEffect(() => {
    if (mounted && !user) {
      router.replace("/community");
    }
  }, [mounted, user, router]);

  // 작성자 가드 — 데이터 로드 후 본인 여부 확인
  useEffect(() => {
    if (post && user && post.authorId !== user.userId) {
      toast.error("수정 권한이 없습니다.");
      router.replace(`/community/${postId}`);
    }
  }, [post, user, postId, router]);

  if (!mounted || !user) return null;

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isError || !post) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <p className="text-sm text-muted-foreground">게시글을 불러올 수 없습니다.</p>
      </div>
    );
  }

  const initialDraft: PostDraft = {
    title: post.title,
    content: post.content,
    level: post.level,
  };

  return (
    <div className="w-full px-4 py-8 lg:px-8">
      {updateMutation.isPending && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-4 rounded-2xl bg-card px-20 py-14 shadow-lg">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm font-semibold text-foreground">수정 중...</p>
          </div>
        </div>
      )}

      <div className="mx-auto max-w-2xl">
        <Link
          href={`/community/${postId}`}
          className="group/back -ml-3 mb-8 inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover/back:-translate-x-0.5" />
          게시글로
        </Link>

        <header className="mb-8">
          <h1 className="text-2xl font-bold tracking-[-0.01em] text-foreground">
            게시글 수정
          </h1>
        </header>

        <PostWriteForm
          initialDraft={initialDraft}
          files={files}
          onFilesChange={(added) => setFiles((prev) => [...prev, ...added])}
          onRemoveFile={(name) =>
            setFiles((prev) => prev.filter((f) => f.name !== name))
          }
          onSubmit={(draft) => updateMutation.mutate(draft)}
          isSubmitting={updateMutation.isPending}
          submitLabel="수정 완료"
          submitError={
            updateMutation.isError
              ? "수정 중 문제가 발생했습니다. 다시 시도해 주세요."
              : null
          }
        />
      </div>
    </div>
  );
}
