import type { ResumeBasicInfo } from "@/types/resume";
import type { UpdateMeRequest } from "@/lib/api/endpoints/users";
import type { User } from "@/types/auth";
import type {
  JobRoleId,
  LevelId,
} from "@/components/features/profile/constants";

/**
 * 이력서 basicInfo 의 직무 문구에서 프로필 직무 코드를 추정합니다 (한글·영문 키워드).
 */
export function inferJobRoleFromJobTitle(jobTitle: string): JobRoleId | null {
  const t = jobTitle.trim().toLowerCase();
  if (!t) return null;
  if (/풀스택|풀.?스택|full[\s_-]?stack|fullstack/i.test(jobTitle))
    return "FULLSTACK";
  if (/프론트|프런트|frontend|react\s*프론트/i.test(jobTitle))
    return "FRONTEND";
  if (/백엔드|백.?엔드|backend|서버\b/i.test(jobTitle))
    return "BACKEND";
  return null;
}

/**
 * 프로필의 경력 레벨(입문 ~ 시니어)과 맞추기 위한 규칙.
 * mergeProfileIntoResume 의 LEVEL→참고 연차 역매핑에 가깝게 잡습니다.
 */
export function inferLevelFromCareerYears(years: number): LevelId | null {
  if (!Number.isFinite(years) || years < 0) return null;
  const y = Math.floor(years);
  if (y <= 0) return "BEGINNER";
  if (y <= 2) return "JUNIOR";
  if (y <= 5) return "MIDDLE";
  return "SENIOR";
}

/**
 * 이력서 기본 정보 변경 시 학습 정보(프로필)와 맞출 PUT 바디입니다.
 * 기존 프로필과 같으면 포함하지 않습니다.
 */
export function buildProfileUpdatesFromResumeBasicInfo(
  user: User | null | undefined,
  basicInfo: ResumeBasicInfo,
): UpdateMeRequest {
  const out: UpdateMeRequest = {};
  if (!user?.userId) return out;

  const inferredJob = inferJobRoleFromJobTitle(basicInfo.jobTitle);
  const inferredLevel = inferLevelFromCareerYears(basicInfo.careerYears);

  if (inferredJob && inferredJob !== (user.job as JobRoleId | undefined))
    out.job = inferredJob;
  if (inferredLevel && inferredLevel !== (user.level as LevelId | undefined))
    out.level = inferredLevel;

  return out;
}
