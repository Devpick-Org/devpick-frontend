"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { cn, dedupeTags } from "@/lib/utils";
import {
  JOB_ROLES,
  LEVELS,
  LEVEL_COLORS,
  type JobRoleId,
  type LevelId,
} from "@/components/features/profile/constants";
import { ProfileTagSelector } from "@/components/features/profile/ProfileTagSelector";
import { useAuthStore } from "@/store/auth.store";
import { authEndpoints } from "@/lib/api/endpoints/auth";
import { usersEndpoints } from "@/lib/api/endpoints/users";

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

function SearchIcon({ className }: { className?: string }) {
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
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function XIcon({ className }: { className?: string }) {
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
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
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
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [nickname, setNickname] = useState(user?.nickname ?? "");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    user?.profileImage ?? null,
  );
  const [selectedRole, setSelectedRole] = useState<JobRoleId | null>(
    (user?.job as JobRoleId) ?? null,
  );
  const [selectedLevel, setSelectedLevel] = useState<LevelId | null>(
    (user?.level as LevelId) ?? null,
  );
  const [selectedTags, setSelectedTags] = useState<string[]>(dedupeTags(user?.tags));
  const [tagSearch, setTagSearch] = useState("");
  const [isRoleOpen, setIsRoleOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  /* 스토어 user가 나중에 채워지는 경우 동기화 (예: 페이지 직접 진입) */
  useEffect(() => {
    if (user?.nickname) setNickname(user.nickname);
    if (user?.job) setSelectedRole(user.job as JobRoleId);
    if (user?.level) setSelectedLevel(user.level as LevelId);
    setSelectedTags(dedupeTags(user?.tags));
    if (user?.profileImage) setAvatarPreview(user.profileImage);
  }, [
    user?.nickname,
    user?.job,
    user?.level,
    user?.tags,
    user?.profileImage,
  ]);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  const removeTag = (tag: string) => {
    setSelectedTags((prev) => prev.filter((t) => t !== tag));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setAvatarPreview(url);
  };

  const handleSave = async () => {
    setIsSaving(true);

    try {
      const { data } = await usersEndpoints.updateMe({
        nickname: nickname.trim(),
        job: selectedRole ?? undefined,
        level: selectedLevel ?? undefined,
        tags: selectedTags,
        profileImage: avatarPreview ?? undefined,
      });

      const updatedUser = data.data;

      updateUser({
        nickname: updatedUser.nickname,
        job: updatedUser.job ?? undefined,
        level: updatedUser.level ?? undefined,
        tags: dedupeTags(updatedUser.tags),
        profileImage: updatedUser.profileImage ?? undefined,
      });

      toast.success("프로필이 저장되었습니다.");
    } catch (error) {
      console.error(error);
      toast.error("프로필 저장 중 오류가 발생했습니다.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await authEndpoints.deleteMe();
      clearAuth();
      toast.success("계정이 삭제되었습니다.");
      router.push("/");
    } catch (error) {
      console.error(error);
      toast.error("계정 삭제 중 오류가 발생했습니다.");
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
          <p className="mt-1 text-sm text-muted-foreground">
            프로필 정보를 수정하고 관리하세요.
          </p>
        </div>
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
      </div>

      {/* Profile Avatar + Nickname */}
      <section className="mb-8 rounded-2xl bg-card p-6">
        <h2 className="mb-5 text-base font-semibold text-foreground">
          기본 정보
        </h2>

        <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
          {/* Avatar */}
          <div className="relative shrink-0">
            <Avatar className="h-24 w-24">
              <AvatarImage src={avatarPreview ?? ""} alt="프로필 이미지" />
              <AvatarFallback className="bg-primary/15 text-2xl font-bold text-primary">
                {displayInitial}
              </AvatarFallback>
            </Avatar>
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
              className="mb-1.5 block text-sm font-medium text-foreground"
            >
              닉네임
            </label>
            <Input
              id="nickname"
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              maxLength={20}
              className="h-11 bg-secondary text-foreground placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-primary/50"
              placeholder="닉네임을 입력하세요"
            />
            <p className="mt-1.5 text-xs text-muted-foreground">
              {`${nickname.length}/20자`}
            </p>
          </div>
        </div>
      </section>

      {/* Learning Info */}
      <section className="mb-8 rounded-2xl bg-card p-6">
        <h2 className="mb-5 text-base font-semibold text-foreground">
          학습 정보
        </h2>

        {/* Job Role Dropdown */}
        <div className="mb-6">
          <label className="mb-1.5 block text-sm font-medium text-foreground">
            직무
          </label>
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsRoleOpen((prev) => !prev)}
              className="flex h-11 w-full items-center justify-between rounded-lg bg-secondary px-3 text-sm text-foreground transition-colors hover:border-primary/40 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/50"
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
              <div className="absolute z-20 mt-1 w-full rounded-lg bg-card shadow-lg">
                {JOB_ROLES.map((role) => (
                  <button
                    key={role.id}
                    type="button"
                    onClick={() => {
                      setSelectedRole(role.id);
                      setIsRoleOpen(false);
                    }}
                    className={cn(
                      "flex w-full items-center px-3 py-2.5 text-sm transition-colors first:rounded-t-lg last:rounded-b-lg",
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
        </div>

        {/* Level Selection */}
        <div className="mb-6">
          <label className="mb-1.5 block text-sm font-medium text-foreground">
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
                    "flex flex-col items-center gap-1 rounded-xl px-3 py-3 transition-all duration-200",
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
                  <span className="text-xs text-muted-foreground">
                    {level.sub}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Interest Tags */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">
            관심 태그
          </label>

          {/* Selected tags */}
          <ProfileTagSelector
            value={selectedTags}
            onChange={setSelectedTags}
          />
        </div>
      </section>

      {/* Danger Zone */}
      <section className="rounded-2xl  bg-red-500/5 p-6">
        <h2 className="mb-2 text-base font-semibold text-red-400">
          Danger Zone
        </h2>
        <p className="mb-5 text-sm text-muted-foreground">
          계정을 삭제하면 모든 학습 데이터와 활동 기록이 영구적으로 삭제됩니다.
        </p>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="outline"
              className="gap-2 border-red-500/40 bg-transparent text-red-400 hover:border-red-500 hover:bg-red-500/10 hover:text-red-300"
            >
              <TrashIcon className="h-4 w-4" />
              계정 삭제
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="border-border bg-card">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-foreground">
                정말 탈퇴하시겠습니까?
              </AlertDialogTitle>
              <AlertDialogDescription className="text-muted-foreground">
                학습 데이터가 모두 삭제됩니다. 이 작업은 되돌릴 수 없습니다.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="border-border bg-secondary text-foreground hover:bg-muted">
                취소
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteAccount}
                className="border-0 bg-red-500 text-foreground hover:bg-red-600"
              >
                계정 삭제
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </section>
    </div>
  );
}
