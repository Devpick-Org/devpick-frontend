"use client";

import { useState, useRef, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { PlanAvatar } from "@/components/ui/plan-avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ConfirmModal } from "@/components/ui/confirm-modal";
import { cn, dedupeTags } from "@/lib/utils";
import {
  JOB_ROLES,
  JOB_ROLE_LABELS,
  LEVELS,
  LEVEL_COLORS,
  type JobRoleId,
  type LevelId,
} from "@/components/features/profile/constants";
import { ProfileTagSelector } from "@/components/features/profile/ProfileTagSelector";
import { SubscriptionSection } from "@/components/features/profile/SubscriptionSection";
import { useAuthStore } from "@/store/auth.store";
import { authEndpoints } from "@/lib/api/endpoints/auth";
import { usersEndpoints } from "@/lib/api/endpoints/users";
import { resumeEndpoints } from "@/lib/api/endpoints/resume";
import { contentFeedQueryKey } from "@/lib/content/feedQueryKeys";
import { inferJobRoleFromResume } from "@/lib/resume/resumeBasicInfoProfileAlign";
import { masterJsonToResumeData } from "@/lib/resume/masterResumeJson";
import { AlertCircle, Info } from "lucide-react";

/* ── Icons ── */

function CameraIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
      <circle cx="12" cy="13" r="3" />
    </svg>
  );
}

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function SaveIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" />
      <path d="M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7" />
      <path d="M7 3v4a1 1 0 0 0 1 1h7" />
    </svg>
  );
}

function TrashIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 6h18" />
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
      <line x1="10" x2="10" y1="11" y2="17" />
      <line x1="14" x2="14" y1="11" y2="17" />
    </svg>
  );
}

/* ── Component ── */

export function ProfileEditForm() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const updateUser = useAuthStore((s) => s.updateUser);
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [nickname, setNickname] = useState(user?.nickname ?? "");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    user?.profileImage ?? null,
  );
  const [pendingImageFile, setPendingImageFile] = useState<File | null>(null);
  const [selectedRole, setSelectedRole] = useState<JobRoleId | null>(
    (user?.job as JobRoleId) ?? null,
  );
  const [selectedLevel, setSelectedLevel] = useState<LevelId | null>(
    (user?.level as LevelId) ?? null,
  );
  const [selectedTags, setSelectedTags] = useState<string[]>(
    dedupeTags(user?.tags),
  );
  const [isRoleOpen, setIsRoleOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [resumeSuggestedJob, setResumeSuggestedJob] = useState<JobRoleId | null>(
    null,
  );
  const [resumeJobSuggestionDismissed, setResumeJobSuggestionDismissed] =
    useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  /* 스토어 user가 나중에 채워지는 경우 동기화 (예: 페이지 직접 진입) */
  useEffect(() => {
    if (user?.nickname) setNickname(user.nickname);
    if (user?.job) setSelectedRole(user.job as JobRoleId);
    if (user?.level) setSelectedLevel(user.level as LevelId);
    setSelectedTags(dedupeTags(user?.tags));
    if (user?.profileImage) setAvatarPreview(user.profileImage);
  }, [user?.nickname, user?.job, user?.level, user?.tags, user?.profileImage]);

  useEffect(() => {
    if (!user?.userId) {
      setResumeSuggestedJob(null);
      return;
    }

    let cancelled = false;
    void (async () => {
      try {
        const masterJson = await resumeEndpoints.getMasterOrNull();
        if (cancelled || !masterJson) {
          if (!cancelled) setResumeSuggestedJob(null);
          return;
        }
        const inferred = inferJobRoleFromResume(masterJsonToResumeData(masterJson));
        if (!cancelled) setResumeSuggestedJob(inferred);
      } catch {
        if (!cancelled) setResumeSuggestedJob(null);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [user?.userId]);

  useEffect(() => {
    setResumeJobSuggestionDismissed(false);
  }, [resumeSuggestedJob, user?.job]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPendingImageFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    if (selectedTags.length === 0) {
      toast.error("관심 태그를 1개 이상 선택해 주세요.");
      return;
    }

    setIsSaving(true);
    setSaveError(null);

    const previousJob = user?.job;
    const previousTags = dedupeTags(user?.tags);

    try {
      let profileImageUrl: string | undefined =
        avatarPreview?.startsWith("blob:") ? user?.profileImage ?? undefined : (avatarPreview ?? undefined);

      if (pendingImageFile) {
        const { data: uploadData } = await usersEndpoints.uploadProfileImage(pendingImageFile);
        profileImageUrl = uploadData.data.profileImage;
        setPendingImageFile(null);
      }

      const { data } = await usersEndpoints.updateMe({
        nickname: nickname.trim(),
        job: selectedRole ?? undefined,
        level: selectedLevel ?? undefined,
        tags: selectedTags,
        profileImage: profileImageUrl,
      });

      const updatedUser = data.data;

      updateUser({
        nickname: updatedUser.nickname,
        job: updatedUser.job ?? undefined,
        level: updatedUser.level ?? undefined,
        tags: dedupeTags(updatedUser.tags),
        profileImage: updatedUser.profileImage ?? undefined,
      });

      void queryClient.invalidateQueries({ queryKey: ["userProfile"] });
      void queryClient.invalidateQueries({
        queryKey: contentFeedQueryKey({
          isAuthenticated: true,
          job: updatedUser.job,
          tags: updatedUser.tags,
        }),
      });
      void queryClient.invalidateQueries({ queryKey: ["contents"] });

      const jobChanged = previousJob !== updatedUser.job;
      const tagsChanged =
        previousTags.join("|") !== dedupeTags(updatedUser.tags).join("|");

      if (jobChanged || tagsChanged) {
        toast.success("프로필이 저장되었습니다. 홈 추천 글이 갱신됩니다.");
      } else {
        toast.success("프로필이 저장되었습니다.");
      }

      if (jobChanged) {
        toast.message("채용 매칭·모의면접은 이력서 내용을 기준으로 합니다.", {
          duration: 5000,
        });
      }
    } catch (error) {
      console.error(error);
      setSaveError("프로필 저장 중 오류가 발생했습니다. 다시 시도해 주세요.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    setDeleteError(null);

    try {
      await authEndpoints.deleteMe();
      clearAuth();
      toast.success("계정이 삭제되었습니다.");
      router.push("/");
    } catch (error) {
      console.error(error);
      setDeleteError("계정 삭제 중 오류가 발생했습니다. 다시 시도해 주세요.");
    } finally {
      setIsDeleting(false);
    }
  };

  const currentRole = JOB_ROLES.find((r) => r.id === selectedRole);
  const displayInitial = (nickname || "?").charAt(0).toUpperCase();

  return (
    <div className="mx-auto max-w-3xl px-4 pt-8 pb-20 lg:px-0">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            내 프로필
          </h1>
          <p className="mt-1 text-sm font-medium text-muted-foreground">
            프로필 정보를 수정하고 관리하세요.
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {isSaving ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
            ) : (
              <SaveIcon className="h-4 w-4" />
            )}
            {isSaving ? "저장 중..." : "변경 사항 저장"}
          </Button>
          {saveError && (
            <p className="flex items-center gap-1.5 text-xs font-medium text-red-500">
              <AlertCircle className="h-3.5 w-3.5 shrink-0" />
              {saveError}
            </p>
          )}
        </div>
      </div>

      {/* Profile Avatar + Nickname */}
      <section className="mb-8 rounded-2xl bg-background p-6">
        <h2 className="mb-5 text-lg font-semibold text-foreground">
          기본 정보
        </h2>

        <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
          {/* Avatar */}
          <div className="relative shrink-0">
            <PlanAvatar
              planType={user?.planType}
              src={avatarPreview}
              alt="프로필 이미지"
              fallback={displayInitial}
              size="lg"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute -right-1 -bottom-1 flex h-8 w-8 items-center justify-center rounded-full border-2 border-card bg-secondary text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
              aria-label="사진 변경"
            >
              <CameraIcon className="h-4 w-4" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
              aria-label="프로필 이미지 업로드"
            />
          </div>

          {/* Nickname */}
          <div className="w-full flex-1">
            <label
              htmlFor="nickname"
              className="mb-1.5 block text-sm font-semibold text-foreground"
            >
              닉네임
            </label>
            <Input
              id="nickname"
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              maxLength={20}
              className="h-11 bg-secondary dark:bg-secondary text-foreground font-medium placeholder:text-muted-foreground focus-visible:!ring-0 focus-visible:!border-border focus-visible:outline-none"
              placeholder="닉네임을 입력하세요"
            />
            <p className="mt-1.5 text-xs text-muted-foreground font-medium">
              {`${nickname.length}/20자`}
            </p>
          </div>
        </div>
      </section>

      {/* Learning Info */}
      <section className="mb-8 rounded-2xl bg-background p-6">
        <h2 className="mb-5 text-lg font-semibold text-foreground">
          학습 정보
        </h2>

        {/* Job Role Dropdown */}
        <div className="mb-6">
          <label className="mb-3 block text-sm font-semibold text-foreground">
            직무
          </label>
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsRoleOpen((prev) => !prev)}
              className="flex h-11 w-full items-center justify-between rounded-lg bg-secondary px-3 text-sm text-foreground font-medium transition-colors hover:border-primary/40 focus:outline-none cursor-pointer"
            >
              <span>{currentRole?.label ?? "직무 선택"}</span>
              <ChevronDownIcon
                className={cn(
                  "h-4 w-4 text-muted-foreground transition-transform",
                  isRoleOpen && "rotate-180",
                )}
              />
            </button>
            {isRoleOpen && (
              <div className="absolute z-20 mt-1 max-h-72 w-full overflow-y-auto rounded-lg border border-border bg-card">
                {JOB_ROLES.map((role) => (
                  <button
                    key={role.id}
                    type="button"
                    onClick={() => {
                      setSelectedRole(role.id);
                      setIsRoleOpen(false);
                    }}
                    className={cn(
                      "flex w-full items-center px-3 py-2.5 text-sm font-medium transition-colors first:rounded-t-lg last:rounded-b-lg cursor-pointer",
                      selectedRole === role.id
                        ? "bg-primary/10 text-primary"
                        : "text-foreground hover:bg-secondary",
                    )}
                  >
                    {role.label}
                  </button>
                ))}
              </div>
            )}
          </div>
          <p className="mt-1.5 text-xs font-medium text-muted-foreground">
            직무를 바꾸면 홈 추천 글이 바로 갱신됩니다. 채용 매칭·모의면접은
            이력서 내용을 기준으로 합니다.
          </p>
          {resumeSuggestedJob &&
            resumeSuggestedJob !== selectedRole &&
            !resumeJobSuggestionDismissed && (
              <div className="mt-3 rounded-xl border border-primary/25 bg-primary/5 px-4 py-3">
                <div className="flex gap-2">
                  <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground">
                      이력서에는{" "}
                      <span className="text-primary">
                        {JOB_ROLE_LABELS[resumeSuggestedJob]}
                      </span>{" "}
                      쪽 내용이 보여요. 프로필 직무도 맞출까요?
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      이력서는 수정하지 않고, 프로필 선택만 바꿉니다.
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Button
                        type="button"
                        size="sm"
                        className="h-8"
                        onClick={() => {
                          setSelectedRole(resumeSuggestedJob);
                          setResumeJobSuggestionDismissed(true);
                        }}
                      >
                        프로필 직무 맞추기
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        className="h-8"
                        onClick={() => setResumeJobSuggestionDismissed(true)}
                      >
                        그대로 두기
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
        </div>

        {/* Level Selection */}
        <div className="mb-6">
          <label className="mb-3 block text-sm font-semibold text-foreground">
            경력 수준
          </label>
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
            {LEVELS.map((level) => {
              const isSelected = selectedLevel === level.id;
              const colors = LEVEL_COLORS[level.id];
              return (
                <button
                  key={level.id}
                  type="button"
                  onClick={() => setSelectedLevel(level.id)}
                  className={cn(
                    "flex flex-col items-center gap-1 rounded-xl px-3 py-3 transition-all duration-200 cursor-pointer",
                    isSelected
                      ? cn(
                          colors.replace("bg-", "border-").split(" ")[0],
                          colors,
                        )
                      : "border-border bg-secondary text-foreground hover:border-primary/30",
                  )}
                >
                  <Badge
                    variant="outline"
                    className={cn(
                      "border-0 bg-transparent px-0 text-sm font-semibold",
                      isSelected ? colors.split(" ").pop() : "text-foreground",
                    )}
                  >
                    {level.label}
                  </Badge>
                  <span className="text-xs text-muted-foreground font-medium">
                    {level.sub}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Interest Tags */}
        <div>
          <label className="mb-3 block text-sm font-semibold text-foreground">
            관심 태그
          </label>

          {/* Selected tags */}
          <ProfileTagSelector value={selectedTags} onChange={setSelectedTags} />
        </div>
      </section>

      {/* Subscription */}
      <SubscriptionSection />

      {/* Danger Zone */}
      <section className="rounded-2xl bg-red-500/5 p-6 mx-6">
        <h2 className="mb-2 text-base font-semibold text-red-400">
          Danger Zone
        </h2>
        <p className="mb-5 text-sm text-muted-foreground font-medium">
          계정을 삭제하면 모든 학습 데이터와 활동 기록이 영구적으로 삭제됩니다.
        </p>
        <Button
          variant="outline"
          className="gap-2 border-destructive/30 bg-destructive/8 font-medium text-destructive/70 hover:bg-destructive/15 hover:text-destructive dark:border-destructive/40 dark:bg-destructive/15 dark:text-destructive"
          onClick={() => { setDeleteError(null); setShowDeleteModal(true); }}
        >
          <TrashIcon className="h-4 w-4" />
          계정 삭제
        </Button>
        <ConfirmModal
          open={showDeleteModal}
          onClose={() => { setDeleteError(null); setShowDeleteModal(false); }}
          title="정말 탈퇴하시겠습니까?"
          description={
            <>
              학습 데이터가 모두 삭제됩니다. 7일 안에 재로그인 시 계정이 복구됩니다.
              {deleteError && (
                <span className="mt-2 flex items-center gap-1.5 text-xs font-medium text-red-500">
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                  {deleteError}
                </span>
              )}
            </>
          }
          cancelText="취소"
          confirmText="계정 삭제"
          onConfirm={handleDeleteAccount}
          variant="danger"
          isLoading={isDeleting}
        />
      </section>
    </div>
  );
}
