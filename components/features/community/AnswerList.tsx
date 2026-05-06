"use client";

import { useState } from "react";
import {
  Check,
  Trash2,
  Pencil,
  MessageSquare,
  Send,
  X,
  ChevronDown,
} from "lucide-react";
import { cn, formatDateTime } from "@/lib/utils";
import { useAuthStore } from "@/store/auth.store";
import { ContentRenderer } from "./ContentRenderer";
import { UserProfileModal } from "./UserProfileModal";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
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
  const [profileInfo, setProfileInfo] = useState<{
    userId: string;
    nickname: string;
  } | null>(null);
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
    <>
      <UserProfileModal
        userId={profileInfo?.userId ?? null}
        nickname={profileInfo?.nickname}
        onClose={() => setProfileInfo(null)}
      />
      <div className="divide-y divide-border border-b border-border">
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
            openUserProfile={(userId, nickname) =>
              setProfileInfo({ userId, nickname })
            }
          />
        ))}
      </div>
    </>
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
  openUserProfile: (userId: string, nickname: string) => void;
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
  openUserProfile,
}: AnswerItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(answer.content);
  const [commentInput, setCommentInput] = useState("");
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [showComments, setShowComments] = useState(false);

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
    <div id={`answer-${answer.id}`} className="py-7">
      {/* 채택 배지 — 모바일에서 작성자 위에 표시 */}
      {answer.isAdopted && (
        <div className="mb-2 flex items-center gap-1 text-sm font-semibold text-primary sm:hidden">
          <Check className="h-3.5 w-3.5" />
          채택된 답변
        </div>
      )}

      {/* 헤더: 작성자 + 액션 버튼 */}
      <div className="mb-3 flex items-start justify-between gap-2">
        <div className="flex items-start gap-3">
          <button
            type="button"
            onClick={() =>
              openUserProfile(answer.authorId, answer.authorNickname)
            }
            className="shrink-0 cursor-pointer rounded-full transition-opacity hover:opacity-70"
          >
            <Avatar className="h-9 w-9">
              {answer.authorProfileImage && (
                <AvatarImage
                  src={answer.authorProfileImage}
                  alt={answer.authorNickname}
                />
              )}
              <AvatarFallback>
                {answer.authorNickname.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </button>
          <div className="flex flex-col gap-0.5">
            <button
              type="button"
              onClick={() =>
                openUserProfile(answer.authorId, answer.authorNickname)
              }
              className="cursor-pointer text-left text-sm font-semibold text-foreground transition-opacity hover:opacity-70"
            >
              {answer.authorNickname}
            </button>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              {[
                answer.authorJob
                  ? (JOB_LABELS[answer.authorJob] ?? answer.authorJob)
                  : null,
                answer.authorLevel
                  ? (LEVEL_LABELS[answer.authorLevel] ?? answer.authorLevel)
                  : null,
                formatDateTime(answer.createdAt),
              ]
                .filter(Boolean)
                .join(" · ")}
              {answer.updatedAt !== answer.createdAt && (
                <span className="text-muted-foreground/50">(수정됨)</span>
              )}
            </div>
          </div>
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
              className="cursor-pointer rounded-md bg-primary px-2.5 py-1 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
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
                className="cursor-pointer rounded-md p-1.5 text-muted-foreground transition-colors hover:text-foreground"
                aria-label="답변 수정"
              >
                <Pencil className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => onDelete(answer.id)}
                className="cursor-pointer rounded-md p-1.5 text-muted-foreground transition-colors hover:text-destructive"
                aria-label="답변 삭제"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </>
          )}
        </div>
      </div>

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
              className="cursor-pointer rounded-lg px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground"
            >
              취소
            </button>
            <button
              onClick={handleSaveEdit}
              disabled={!editContent.trim()}
              className="cursor-pointer rounded-lg bg-primary px-4 py-1.5 text-xs font-semibold text-white disabled:opacity-40 hover:opacity-90"
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
          {/* 하단 버튼 행 */}
          <div className="mt-4 space-y-4 pt-3">
            {/* 댓글 달기 */}
            {answer.comments.length > 0 ? (
              <button
                onClick={() => {
                  setShowCommentForm(true);
                  setShowComments(true);
                }}
                className="flex items-center gap-1.5 rounded-full border border-border px-3.5 py-1.5 text-sm font-semibold text-muted-foreground transition-colors hover:bg-muted/40 cursor-pointer"
              >
                <MessageSquare className="h-3.5 w-3.5" />
                댓글 달기
              </button>
            ) : !showCommentForm ? (
              <button
                onClick={() => setShowCommentForm(true)}
                className="flex items-center gap-1.5 rounded-full border border-border px-3.5 py-1.5 text-sm font-semibold text-muted-foreground transition-colors hover:bg-muted/40 cursor-pointer"
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
                  className="flex-1 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors"
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
            {/* 댓글 N개 토글 */}
            {answer.comments.length > 0 && (
              <button
                onClick={() => setShowComments((v) => !v)}
                className="flex items-center gap-1 text-sm font-semibold text-primary transition-colors hover:text-primary/90 cursor-pointer"
              >
                <ChevronDown
                  className={cn(
                    "h-3 w-3 transition-transform duration-200",
                    showComments && "rotate-180",
                  )}
                />
                댓글 {answer.comments.length}개
              </button>
            )}
          </div>

          {/* 댓글 목록 (토글) */}
          {showComments && answer.comments.length > 0 && (
            <div className="mt-5 space-y-6">
              {answer.comments.map((comment) => (
                <div key={comment.id} className="flex items-start gap-2">
                  <div className="ml-3 mt-0 h-3 w-3 shrink-0 rounded-bl border-b-2 border-l-2 border-border/50" />
                  <div className="flex-1 min-w-0">
                    <CommentItem
                      comment={comment}
                      currentUserId={currentUserId}
                      onDelete={(commentId) =>
                        onDeleteComment(answer.id, commentId)
                      }
                      onOpenProfile={(userId) =>
                        openUserProfile(userId, comment.nickname)
                      }
                    />
                  </div>
                </div>
              ))}
              <div className="flex items-start gap-2 pt-1">
                <div className="ml-3 w-3 shrink-0" />
                <div className="flex-1">
                  {!showCommentForm ? (
                    <button
                      onClick={() => setShowCommentForm(true)}
                      className="flex items-center gap-1.5 rounded-full border border-border px-3.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground cursor-pointer"
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
                        className="flex-1 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors"
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
              </div>
            </div>
          )}
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
  onOpenProfile: (userId: string) => void;
}

function CommentItem({
  comment,
  currentUserId,
  onDelete,
  onOpenProfile,
}: CommentItemProps) {
  const isMyComment = currentUserId === comment.userId;

  return (
    <div className="flex items-start gap-2.5">
      <button
        type="button"
        onClick={() => onOpenProfile(comment.userId)}
        className="shrink-0 cursor-pointer rounded-full transition-opacity hover:opacity-70"
      >
        <Avatar className="h-8 w-8">
          {comment.profileImage && (
            <AvatarImage src={comment.profileImage} alt={comment.nickname} />
          )}
          <AvatarFallback className="text-xs">
            {comment.nickname.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </button>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => onOpenProfile(comment.userId)}
            className="text-sm font-semibold text-foreground cursor-pointer transition-opacity hover:opacity-70"
          >
            {comment.nickname}
          </button>
          {isMyComment && (
            <button
              onClick={() => onDelete(comment.id)}
              className="cursor-pointer shrink-0 text-muted-foreground/50 transition-colors hover:text-destructive"
              aria-label="댓글 삭제"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
        <p className="mb-1 text-[11px] text-muted-foreground">
          {formatDateTime(comment.createdAt)}
        </p>
        <p className="text-sm text-foreground/90 break-words leading-5">
          {comment.content}
        </p>
      </div>
    </div>
  );
}
