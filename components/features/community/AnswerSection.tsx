"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { postsEndpoints } from "@/lib/api/endpoints/posts";
import { AnswerList } from "./AnswerList";
import type { CommunityAnswer } from "@/types/community";

interface AnswerSectionProps {
  postId: string;
  postAuthorId: string;
  answers: CommunityAnswer[];
}

export function AnswerSection({
  postId,
  postAuthorId,
  answers,
}: AnswerSectionProps) {
  const queryClient = useQueryClient();
  const [newAnswerContent, setNewAnswerContent] = useState("");

  const invalidateAnswers = () =>
    queryClient.invalidateQueries({ queryKey: ["post-answers", postId] });

  // 답변 생성/삭제 시 post detail도 함께 갱신 (answerCount 동기화)
  const invalidatePost = () =>
    queryClient.invalidateQueries({ queryKey: ["post", postId] });

  const createAnswerMutation = useMutation({
    mutationFn: (content: string) =>
      postsEndpoints.createAnswer(postId, content),
    onSuccess: () => {
      setNewAnswerContent("");
      invalidateAnswers();
      invalidatePost();
      toast.success("답변이 등록되었습니다.");
    },
    onError: () => toast.error("답변 등록에 실패했습니다."),
  });

  const updateAnswerMutation = useMutation({
    mutationFn: ({
      answerId,
      content,
    }: {
      answerId: string;
      content: string;
    }) => postsEndpoints.updateAnswer(postId, answerId, content),
    onSuccess: () => {
      invalidateAnswers();
      toast.success("답변이 수정되었습니다.");
    },
    onError: () => toast.error("답변 수정에 실패했습니다."),
  });

  const deleteAnswerMutation = useMutation({
    mutationFn: (answerId: string) =>
      postsEndpoints.deleteAnswer(postId, answerId),
    onSuccess: () => {
      invalidateAnswers();
      invalidatePost();
      toast.success("답변이 삭제되었습니다.");
    },
    onError: () => toast.error("답변 삭제에 실패했습니다."),
  });

  const adoptAnswerMutation = useMutation({
    mutationFn: (answerId: string) =>
      postsEndpoints.adoptAnswer(postId, answerId),
    onSuccess: () => {
      invalidateAnswers();
      toast.success("답변이 채택되었습니다.");
    },
    onError: () => toast.error("답변 채택에 실패했습니다."),
  });

  const createCommentMutation = useMutation({
    mutationFn: ({
      answerId,
      content,
    }: {
      answerId: string;
      content: string;
    }) => postsEndpoints.createComment(postId, answerId, content),
    onSuccess: () => {
      invalidateAnswers();
      toast.success("댓글이 등록되었습니다.");
    },
    onError: () => toast.error("댓글 등록에 실패했습니다."),
  });

  const deleteCommentMutation = useMutation({
    mutationFn: ({
      answerId,
      commentId,
    }: {
      answerId: string;
      commentId: string;
    }) => postsEndpoints.deleteComment(postId, answerId, commentId),
    onSuccess: () => {
      invalidateAnswers();
      toast.success("댓글이 삭제되었습니다.");
    },
    onError: () => toast.error("댓글 삭제에 실패했습니다."),
  });

  const handleSubmitAnswer = () => {
    if (!newAnswerContent.trim() || createAnswerMutation.isPending) return;
    createAnswerMutation.mutate(newAnswerContent.trim());
  };

  return (
    <section>
      <h2 className="mb-6 text-lg font-bold text-foreground">
        답변 <span className="text-primary">{answers.length}</span>
      </h2>

      <AnswerList
        answers={answers}
        postAuthorId={postAuthorId}
        onAdopt={(answerId) => adoptAnswerMutation.mutate(answerId)}
        onDeleteAnswer={(answerId) => deleteAnswerMutation.mutate(answerId)}
        onUpdateAnswer={(answerId, content) =>
          updateAnswerMutation.mutate({ answerId, content })
        }
        onAddComment={(answerId, content) =>
          createCommentMutation.mutate({ answerId, content })
        }
        onDeleteComment={(answerId, commentId) =>
          deleteCommentMutation.mutate({ answerId, commentId })
        }
      />

      {/* 답변 작성 폼 */}
      <div className="mt-10 border-t border-border/60 pt-8">
        <h3 className="mb-4 font-semibold text-foreground">답변 작성</h3>
        <textarea
          value={newAnswerContent}
          onChange={(e) => setNewAnswerContent(e.target.value)}
          placeholder="답변을 작성해 주세요..."
          className="w-full min-h-[140px] resize-y rounded-xl border border-border bg-card px-4 py-3 text-sm leading-6 text-foreground font-medium placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30 transition-colors"
        />
        <div className="mt-3 flex justify-end">
          <button
            onClick={handleSubmitAnswer}
            disabled={
              !newAnswerContent.trim() || createAnswerMutation.isPending
            }
            className="rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-40 cursor-pointer"
          >
            {createAnswerMutation.isPending ? "등록 중..." : "답변 등록"}
          </button>
        </div>
      </div>
    </section>
  );
}
