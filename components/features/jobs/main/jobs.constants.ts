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

export const LOCATION_OPTIONS: string[] = [
  "서울 전체",
  "서울 강남구",
  "서울 서초구",
  "서울 마포구",
  "서울 송파구",
  "경기 성남시 분당구",
  "부산",
  "대전",
  "원격 (Remote)",
];

export const TECH_STACK_OPTIONS: string[] = [
  "React",
  "Vue.js",
  "Next.js",
  "TypeScript",
  "JavaScript",
  "Node.js",
  "Java",
  "Spring Boot",
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
