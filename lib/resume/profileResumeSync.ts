import type { User } from "@/types/auth";
import type { ResumeData } from "@/types/resume";

const JOB_CODE_TO_TITLE: Record<string, string> = {
  FRONTEND: "프론트엔드",
  BACKEND: "백엔드",
  FULLSTACK: "풀스택",
};

/** 프로필 레벨 → 이력서 ‘경력(년)’이 비어 있을 때 채울 참고값 */
const LEVEL_TO_SUGGESTED_YEARS: Record<string, number> = {
  BEGINNER: 0,
  JUNIOR: 1,
  MIDDLE: 3,
  SENIOR: 6,
};

function dedupeStrings(arr: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const s of arr) {
    const t = s.trim();
    if (!t) continue;
    const k = t.toLowerCase();
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(t);
  }
  return out;
}

function jobCodeToTitle(job?: string | null): string {
  if (!job) return "";
  return JOB_CODE_TO_TITLE[job] ?? job;
}

/**
 * 계정 프로필(닉네임·직무·레벨·관심 태그)을 마스터 이력서에 반영합니다.
 * 사용자가 이미 입력한 값은 덮어쓰지 않습니다.
 * - 이름: 비어 있을 때만 프로필 닉네임
 * - 직무: 비어 있을 때만 프로필 직무 한글명
 * - 경력(년): 0이고 프로필 레벨이 있으면 참고 연차
 * - 기술 스택: 프로필 태그를 기존 목록에 병합(중복 제거)
 */
export function mergeProfileIntoResume(
  resume: ResumeData,
  user: User | null | undefined,
): ResumeData {
  if (!user) return resume;

  const profileJobTitle = jobCodeToTitle(user.job);
  const suggestedYears =
    user.level && LEVEL_TO_SUGGESTED_YEARS[user.level] != null
      ? LEVEL_TO_SUGGESTED_YEARS[user.level]!
      : resume.basicInfo.careerYears;

  const mergedTags = dedupeStrings([
    ...resume.techStack,
    ...(user.tags ?? []),
  ]);

  const keepJobTitle = resume.basicInfo.jobTitle.trim().length > 0;
  const keepName = resume.basicInfo.name.trim().length > 0;

  return {
    ...resume,
    basicInfo: {
      ...resume.basicInfo,
      name: keepName
        ? resume.basicInfo.name
        : user.nickname?.trim() || resume.basicInfo.name,
      jobTitle: keepJobTitle ? resume.basicInfo.jobTitle : profileJobTitle || resume.basicInfo.jobTitle,
      careerYears:
        resume.basicInfo.careerYears > 0
          ? resume.basicInfo.careerYears
          : suggestedYears,
    },
    techStack: mergedTags,
  };
}
