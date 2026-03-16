"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn, dedupeTags } from "@/lib/utils";
import { useAuthStore } from "@/store/auth.store";
import { usersEndpoints } from "@/lib/api/endpoints/users";
import { authEndpoints } from "@/lib/api/endpoints/auth";
import { ProfileNicknameInput } from "@/components/features/profile/ProfileNicknameInput";
import { ProfileRoleSelector } from "@/components/features/profile/ProfileRoleSelector";
import { ProfileLevelSelector } from "@/components/features/profile/ProfileLevelSelector";
import { ProfileTagSelector } from "@/components/features/profile/ProfileTagSelector";
import type { JobRoleId, LevelId } from "@/components/features/profile/constants";
import { ChevronLeft, ChevronRight } from "lucide-react";

function SectionBadge({ number }: { number: number }) {
  return (
    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
      {number}
    </span>
  );
}

export function OnboardingForm() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const updateUser = useAuthStore((state) => state.updateUser);

  const [step, setStep] = useState(1);

  const [nickname, setNickname] = useState(user?.nickname ?? "");
  const [selectedRole, setSelectedRole] = useState<JobRoleId | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<LevelId | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canGoNext = () => {
    switch (step) {
      case 1:
        return nickname.trim().length >= 2;
      case 2:
        return selectedRole !== null;
      case 3:
        return selectedLevel !== null;
      case 4:
        return selectedTags.length > 0;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (canGoNext() && step < 4) {
      setStep((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (step > 1) {
      setStep((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    if (!canGoNext() || !selectedRole || !selectedLevel) return;

    setIsSubmitting(true);

    try {
      await usersEndpoints.updateMe({
        nickname: nickname.trim(),
        job: selectedRole,
        level: selectedLevel,
        tags: selectedTags,
      });

      // PUT 응답의 tags가 빈 배열로 올 수 있으므로, GET /users/me로 최신 정보를 다시 조회
      const { data: meData } = await authEndpoints.getMe();
      updateUser({
        nickname: meData.data.nickname,
        job: meData.data.job ?? undefined,
        level: meData.data.level ?? undefined,
        profileImage: meData.data.profileImage ?? undefined,
        tags: dedupeTags(meData.data.tags?.length ? meData.data.tags : selectedTags),
      });

      router.push("/home");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-2xl -mt-16">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/20">
          <svg
            className="h-7 w-7 text-primary"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="16 18 22 12 16 6" />
            <polyline points="8 6 2 12 8 18" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground text-balance">
          DevPick에 오신 것을 환영합니다!
        </h1>
        <p className="mt-2 text-sm text-muted-foreground text-balance">
          맞춤형 피드를 위해 정보를 입력해 주세요.
        </p>
      </div>

      {/* Main Card */}
      <div className="relative rounded-2xl bg-card p-6 md:p-8">
        
        {/* 폼 영역 크기 고정: min-h-[280px] 부여 */}
        <div className="min-h-[120px]">
          {/* Step 1: Nickname */}
          {step === 1 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="mb-4 flex items-center gap-2">
                <SectionBadge number={1} />
                <h2 className="text-base font-semibold text-foreground">
                  닉네임을 입력해 주세요
                </h2>
              </div>
              <ProfileNicknameInput value={nickname} onChange={setNickname} />
            </div>
          )}

          {/* Step 2: Job Role */}
          {step === 2 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="mb-4 flex items-center gap-2">
                <SectionBadge number={2} />
                <h2 className="text-base font-semibold text-foreground">
                  어떤 직무를 맡고 계신가요?
                </h2>
              </div>
              <ProfileRoleSelector value={selectedRole} onChange={setSelectedRole} />
            </div>
          )}

          {/* Step 3: Experience Level */}
          {step === 3 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="mb-4 flex items-center gap-2">
                <SectionBadge number={3} />
                <h2 className="text-base font-semibold text-foreground">
                  경력 수준을 알려주세요
                </h2>
              </div>
              <ProfileLevelSelector value={selectedLevel} onChange={setSelectedLevel} />
            </div>
          )}

          {/* Step 4: Interest Tags */}
          {step === 4 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="mb-4 flex items-center gap-2">
                <SectionBadge number={4} />
                <h2 className="text-base font-semibold text-foreground">
                  관심 있는 기술 태그를 선택해 주세요
                </h2>
              </div>
              {/* 태그 영역은 내용이 길어지면 min-h-[280px] 이상으로 자연스럽게 늘어납니다. */}
              <ProfileTagSelector value={selectedTags} onChange={setSelectedTags} />
            </div>
          )}
        </div>

        {/* 이전 / 다음 버튼 영역 (하단 배치) */}
        <div className="mt-8 flex items-center justify-between">
          {/* 왼쪽: 이전 버튼 (<) */}
          {step > 1 ? (
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={handlePrev}
              className="h-12 w-12 rounded-full border-border text-muted-foreground hover:text-foreground hover:bg-muted/50"
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
          ) : (
            <div className="h-12 w-12" /> // 1단계일 때 오른쪽 버튼을 우측 끝으로 밀기 위한 투명 박스
          )}

          {/* 오른쪽: 다음 (>) / 완료 버튼 */}
          {step < 4 ? (
            <Button
              type="button"
              onClick={handleNext}
              disabled={!canGoNext()}
              size="icon"
              className={cn(
                "h-12 w-12 rounded-full transition-all duration-200",
                canGoNext()
                  ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-primary/25"
                  : "bg-muted text-muted-foreground cursor-not-allowed",
              )}
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          ) : (
            // 4단계에서는 '완료'라는 걸 명확히 알 수 있게 텍스트 포함
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={!canGoNext() || isSubmitting}
              className={cn(
                "h-12 px-6 text-base font-semibold transition-all duration-200",
                canGoNext()
                  ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-primary/25"
                  : "bg-muted text-muted-foreground cursor-not-allowed",
              )}
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                  설정 중...
                </span>
              ) : (
                <span className="flex items-center gap-1">
                  시작하기
                </span>
              )}
            </Button>
          )}
        </div>

        {/* Progress Dots (진행도 표시기) - 간격 미세조정 */}
        <div className="mt-6 flex items-center justify-center gap-2">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                i === step ? "w-8 bg-primary" : "w-2 bg-muted",
                i < step && "bg-primary/40"
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
