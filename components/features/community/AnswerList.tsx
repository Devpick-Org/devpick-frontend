"use client";

import { useState } from "react";
import {
  User,
  Check,
  Trash2,
  Pencil,
  MessageSquare,
  Send,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth.store";
import { formatRelativeDate } from "./CommunityCard";
import { ContentRenderer } from "./ContentRenderer";
import type { CommunityAnswer, CommentDTO } from "@/types/community";

const JOB_LABELS: Record<string, string> = {
  FRONTEND: "프론트엔드",
  BACKEND: "백엔드",
  FULLSTACK: "풀스택",
};

const LEVEL_LABELS: Record<string, string> = {
  BEGINNER: "입문",
  JUNIOR: "주니어",
  MIDDLE: "미들",
  SENIOR: "시니어",
};

interface AnswerListProps {
  answers: CommunityAnswer[];
  postAuthorId: string;
  onAdopt: (answerId: string) => void;
  onDeleteAnswer: (answerId: string) => void;
  onUpdateAnswer: (answerId: string, content: string) => void;
  onAddComment: (answerId: string, content: string) => void;
  onDeleteComment: (answerId: string, commentId: string) => void;
}

export function AnswerList({
  answers,
  postAuthorId,
  onAdopt,
  onDeleteAnswer,
  onUpdateAnswer,
  onAddComment,
  onDeleteComment,
}: AnswerListProps) {
  const { user } = useAuthStore();
  const hasAdopted = answers.some((a) => a.isAdopted);
  const isPostAuthor = user?.userId === postAuthorId;

  if (answers.length === 0) {
    return (
      <p className="py-10 text-center text-sm text-muted-foreground font-medium">
        아직 답변이 없습니다. 첫 번째 답변을 작성해 보세요!
      </p>
    );
  }

  return (
    <div className="space-y-5">
      {answers.map((answer) => (
        <AnswerItem
          key={answer.id}
          answer={answer}
          currentUserId={user?.userId}
          canAdopt={isPostAuthor && !hasAdopted && !answer.isAdopted}
          onAdopt={onAdopt}
          onDelete={onDeleteAnswer}
          onUpdate={onUpdateAnswer}
          onAddComment={onAddComment}
          onDeleteComment={onDeleteComment}
        />
      ))}
    </div>
  );
}

// ─── AnswerItem ────────────────────────────────────────────────────────────────

interface AnswerItemProps {
  answer: CommunityAnswer;
  currentUserId: string | undefined;
  canAdopt: boolean;
  onAdopt: (answerId: string) => void;
  onDelete: (answerId: string) => void;
  onUpdate: (answerId: string, content: string) => void;
  onAddComment: (answerId: string, content: string) => void;
  onDeleteComment: (answerId: string, commentId: string) => void;
}

function AnswerItem({
  answer,
  currentUserId,
  canAdopt,
  onAdopt,
  onDelete,
  onUpdate,
  onAddComment,
  onDeleteComment,
}: AnswerItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(answer.content);
  const [commentInput, setCommentInput] = useState("");
  const [showCommentForm, setShowCommentForm] = useState(false);

  const isMyAnswer = currentUserId === answer.authorId;

  const handleSaveEdit = () => {
    if (!editContent.trim()) return;
    onUpdate(answer.id, editContent.trim());
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditContent(answer.content);
    setIsEditing(false);
  };

  const handleCommentSubmit = () => {
    if (!commentInput.trim()) return;
    onAddComment(answer.id, commentInput.trim());
    setCommentInput("");
    setShowCommentForm(false);
  };

  return (
    <div
      className={cn(
        "rounded-xl p-5",
        answer.isAdopted
          ? "bg-card border border-border"
          : "bg-card border border-border",
      )}
    >
      {/* 채택 배지 — 모바일에서 작성자 위에 표시 */}
      {answer.isAdopted && (
        <div className="mb-2 flex items-center gap-1 text-sm font-semibold text-primary sm:hidden">
          <Check className="h-3.5 w-3.5" />
          채택된 답변
        </div>
      )}

      {/* 헤더: 작성자 + 액션 버튼 */}
      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-xs font-medium text-foreground">
          <User className="h-3.5 w-3.5 shrink-0" />
          <span className="text-foreground">{answer.authorNickname}</span>
          {(answer.authorJob || answer.authorLevel) && (
            <>
              <span className="text-muted-foreground">·</span>
              <span className="font-medium">
                {[
                  answer.authorJob
                    ? (JOB_LABELS[answer.authorJob] ?? answer.authorJob)
                    : null,
                  answer.authorLevel
                    ? (LEVEL_LABELS[answer.authorLevel] ?? answer.authorLevel)
                    : null,
                ]
                  .filter(Boolean)
                  .join(" · ")}
              </span>
            </>
          )}
          <span className="text-muted-foreground/40">·</span>
          <span>{formatRelativeDate(answer.createdAt)}</span>
          {answer.updatedAt !== answer.createdAt && (
            <span className="text-muted-foreground/50">(수정됨)</span>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-1.5">
          {/* 채택 배지 — 데스크탑에서 오른쪽 위에 표시 */}
          {answer.isAdopted && (
            <div className="hidden items-center gap-1 text-sm font-semibold text-primary sm:flex">
              <Check className="h-3.5 w-3.5" />
              채택된 답변
            </div>
          )}
          {canAdopt && (
            <button
              onClick={() => onAdopt(answer.id)}
              className="rounded-md border border-primary/30 px-2.5 py-1 text-sm font-semibold text-primary transition-colors hover:bg-primary/10"
            >
              채택
            </button>
          )}
          {isMyAnswer && !isEditing && (
            <>
              <button
                onClick={() => {
                  setEditContent(answer.content);
                  setIsEditing(true);
                }}
                className="rounded-md p-1.5 text-muted-foreground transition-colors hover:text-foreground"
                aria-label="답변 수정"
              >
                <Pencil className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => onDelete(answer.id)}
                className="rounded-md p-1.5 text-muted-foreground transition-colors hover:text-destructive"
                aria-label="답변 삭제"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </>
          )}
        </div>
      </div>

      <div className="border-t border-border" />

      {/* 본문 또는 편집 폼 */}
      {isEditing ? (
        <div className="pt-3">
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="w-full min-h-[120px] resize-y rounded-xl border border-border bg-background px-4 py-3 text-sm leading-6 text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30 transition-colors"
          />
          <div className="mt-2 flex justify-end gap-2">
            <button
              onClick={handleCancelEdit}
              className="rounded-lg px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground"
            >
              취소
            </button>
            <button
              onClick={handleSaveEdit}
              disabled={!editContent.trim()}
              className="rounded-lg bg-primary px-4 py-1.5 text-xs font-semibold text-white disabled:opacity-40 hover:opacity-90"
            >
              저장
            </button>
          </div>
        </div>
      ) : (
        <div className="pt-3">
          <ContentRenderer content={answer.content} />
        </div>
      )}

      {/* 댓글 영역 */}
      {!isEditing && (
        <>
          {answer.comments.length > 0 && (
            <div className="mt-5 space-y-3 border-t border-border/50 pt-4">
              {answer.comments.map((comment) => (
                <CommentItem
                  key={comment.id}
                  comment={comment}
                  currentUserId={currentUserId}
                  onDelete={(commentId) =>
                    onDeleteComment(answer.id, commentId)
                  }
                />
              ))}
            </div>
          )}

          <div className="mt-4">
            {!showCommentForm ? (
              <button
                onClick={() => setShowCommentForm(true)}
                className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium transition-colors hover:text-foreground cursor-pointer"
              >
                <MessageSquare className="h-3.5 w-3.5" />
                댓글 달기
              </button>
            ) : (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleCommentSubmit();
                    if (e.key === "Escape") {
                      setShowCommentForm(false);
                      setCommentInput("");
                    }
                  }}
                  placeholder="댓글을 입력하세요..."
                  className="flex-1 rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground font-medium placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors"
                  autoFocus
                />
                <button
                  onClick={handleCommentSubmit}
                  disabled={!commentInput.trim()}
                  className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-40 cursor-pointer"
                  aria-label="댓글 등록"
                >
                  <Send className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => {
                    setShowCommentForm(false);
                    setCommentInput("");
                  }}
                  className="rounded-lg p-1.5 text-muted-foreground hover:text-foreground cursor-pointer"
                  aria-label="취소"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

// ─── CommentItem ───────────────────────────────────────────────────────────────

interface CommentItemProps {
  comment: CommentDTO;
  currentUserId: string | undefined;
  onDelete: (commentId: string) => void;
}

function CommentItem({ comment, currentUserId, onDelete }: CommentItemProps) {
  const isMyComment = currentUserId === comment.userId;

  return (
    <div className="flex items-start justify-between gap-3">
      <div className="flex-1 text-xs leading-5">
        <span className="mr-2 font-semibold text-foreground/80">
          {comment.nickname}
        </span>
        <span className="text-muted-foreground">{comment.content}</span>
      </div>
      {isMyComment && (
        <button
          onClick={() => onDelete(comment.id)}
          className="shrink-0 text-muted-foreground/50 transition-colors hover:text-destructive"
          aria-label="댓글 삭제"
        >
          <Trash2 className="h-3 w-3" />
        </button>
      )}
    </div>
  );
}
