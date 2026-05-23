import type { ResumeBasicInfo, ResumeData } from "@/types/resume";
import type { UpdateMeRequest } from "@/lib/api/endpoints/users";
import type { User } from "@/types/auth";
import type {
  JobRoleId,
  LevelId,
} from "@/components/features/profile/constants";

const ROLE_STACK_PATTERNS: Partial<Record<JobRoleId, RegExp[]>> = {
  AI_ML: [
    /pytorch/i,
    /tensorflow/i,
    /keras/i,
    /scikit/i,
    /hugging\s*face/i,
    /transformers/i,
    /\bllm\b/i,
    /ai\/ml/i,
    /머신러닝/i,
    /딥러닝/i,
  ],
  DEVOPS: [
    /docker/i,
    /kubernetes/i,
    /\bk8s\b/i,
    /terraform/i,
    /ansible/i,
    /helm/i,
    /argocd/i,
    /prometheus/i,
    /grafana/i,
  ],
  MOBILE: [
    /flutter/i,
    /react native/i,
    /\bswift\b/i,
    /\bkotlin\b/i,
    /\bios\b/i,
    /android/i,
    /jetpack compose/i,
  ],
  DATA: [
    /apache spark/i,
    /\bspark\b/i,
    /airflow/i,
    /\bdbt\b/i,
    /bigquery/i,
    /snowflake/i,
    /pandas/i,
    /numpy/i,
  ],
  FRONTEND: [/react/i, /next\.js/i, /vue/i, /typescript/i, /tailwind/i],
  BACKEND: [/spring boot/i, /spring\b/i, /node\.js/i, /django/i, /fastapi/i, /nestjs/i],
};

/**
 * 이력서 basicInfo 의 직무 문구에서 프로필 직무 코드를 추정합니다 (한글·영문 키워드).
 */
export function inferJobRoleFromJobTitle(jobTitle: string): JobRoleId | null {
  const t = jobTitle.trim().toLowerCase();
  if (!t) return null;
  if (/devops|dev\s*ops|데브옵스|sre|site reliability|platform|인프라|클라우드|cloud/i.test(jobTitle))
    return "DEVOPS";
  if (/ai|ml|machine learning|머신러닝|인공지능|딥러닝|llm|모델/i.test(jobTitle))
    return "AI_ML";
  if (/모바일|mobile|android|안드로이드|ios|아이오에스|react native|flutter|kotlin|swift/i.test(jobTitle))
    return "MOBILE";
  if (/데이터|data|analytics|분석|etl|elt|engineer.*data|data.*engineer|데이터.?엔지니어/i.test(jobTitle))
    return "DATA";
  if (/풀스택|풀.?스택|full[\s_-]?stack|fullstack/i.test(jobTitle))
    return "FULLSTACK";
  if (/프론트|프런트|frontend|react\s*프론트/i.test(jobTitle))
    return "FRONTEND";
  if (/백엔드|백.?엔드|backend|서버\b/i.test(jobTitle))
    return "BACKEND";
  return null;
}

/** 이력서 techStack·프로젝트 스택에서 프로필 직무 코드를 추정합니다. */
export function inferJobRoleFromTechSignals(resume: ResumeData): JobRoleId | null {
  const stackText = [
    ...resume.techStack,
    ...resume.projects.flatMap((p) => p.techStack),
  ]
    .join(" ")
    .trim();
  if (!stackText) return null;

  let bestRole: JobRoleId | null = null;
  let bestScore = 0;

  for (const [role, patterns] of Object.entries(ROLE_STACK_PATTERNS) as [
    JobRoleId,
    RegExp[],
  ][]) {
    const score = patterns.filter((pattern) => pattern.test(stackText)).length;
    if (score > bestScore) {
      bestScore = score;
      bestRole = role;
    }
  }

  return bestScore > 0 ? bestRole : null;
}

/** 이력서 직무 문구 → 없으면 스택 신호 순으로 프로필 직무를 추정합니다. */
export function inferJobRoleFromResume(resume: ResumeData): JobRoleId | null {
  return (
    inferJobRoleFromJobTitle(resume.basicInfo.jobTitle) ??
    inferJobRoleFromTechSignals(resume)
  );
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
