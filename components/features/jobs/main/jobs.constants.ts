import type { EmploymentType, JobCategory, ExperienceLevel } from "@/types/jobs";

export const EMPLOYMENT_TYPE_LABEL: Record<EmploymentType, string> = {
  FULL_TIME: "정규직",
  PART_TIME: "파트타임",
  CONTRACT: "계약직",
  INTERNSHIP: "인턴",
};

export const JOB_CATEGORY_LABEL: Record<JobCategory, string> = {
  FRONTEND: "프론트엔드",
  BACKEND: "백엔드",
  FULLSTACK: "풀스택",
  DEVOPS: "DevOps",
  AI_ML: "AI/ML",
  MOBILE: "모바일",
  DATA: "데이터",
};

export const EXPERIENCE_LEVEL_LABEL: Record<ExperienceLevel, string> = {
  NEW: "신입",
  JUNIOR: "주니어",
  MIDDLE: "미들",
  SENIOR: "시니어",
  ANY: "무관",
};

export const JOB_CATEGORY_OPTIONS: { value: JobCategory | "ALL"; label: string }[] = [
  { value: "ALL", label: "전체" },
  ...(Object.entries(JOB_CATEGORY_LABEL) as [JobCategory, string][]).map(
    ([value, label]) => ({ value, label })
  ),
];

export const EXPERIENCE_LEVEL_OPTIONS: { value: ExperienceLevel | "ALL"; label: string }[] = [
  { value: "ALL", label: "전체" },
  ...(Object.entries(EXPERIENCE_LEVEL_LABEL) as [ExperienceLevel, string][]).map(
    ([value, label]) => ({ value, label })
  ),
];

export const EMPLOYMENT_TYPE_OPTIONS: { value: EmploymentType | "ALL"; label: string }[] = [
  { value: "ALL", label: "전체" },
  ...(Object.entries(EMPLOYMENT_TYPE_LABEL) as [EmploymentType, string][]).map(
    ([value, label]) => ({ value, label })
  ),
];

/**
 * 근무지 필터: `value`는 API location 파라미터(LIKE %%)에 그대로 쓰입니다.
 * 크롤 원문은 "서울특별시 강남구", "재택근무", "원격 근무" 등 제각각이라 짧은 토큰으로 맞춥니다.
 */
export const LOCATION_FILTER_OPTIONS: { value: string; label: string }[] = [
  { value: "서울", label: "서울" },
  { value: "강남", label: "강남구" },
  { value: "서초", label: "서초구" },
  { value: "마포", label: "마포구" },
  { value: "송파", label: "송파구" },
  { value: "분당", label: "성남·분당" },
  { value: "판교", label: "판교" },
  { value: "부산", label: "부산" },
  { value: "대전", label: "대전" },
  { value: "재택", label: "재택" },
  { value: "원격", label: "원격" },
];

export function locationFilterLabel(value: string): string {
  const hit = LOCATION_FILTER_OPTIONS.find((o) => o.value === value);
  return hit?.label ?? value;
}

export const TECH_STACK_OPTIONS: string[] = [
  "React",
  "Vue.js",
  "Next.js",
  "TypeScript",
  "JavaScript",
  "Node.js",
  "Java",
  "Spring Boot",
  "C#",
  ".NET",
  "ASP.NET",
  "WPF",
  "Unity",
  "Python",
  "FastAPI",
  "Docker",
  "Kubernetes",
  "AWS",
  "MySQL",
  "PostgreSQL",
  "MongoDB",
  "Redis",
  "Swift",
  "Kotlin",
  "Go",
];
