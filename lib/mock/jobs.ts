import type { Job } from "@/types/jobs";

const MOCK_JOBS: Job[] = [
  {
    id: "1",
    companyName: "토스",
    companyLogo: "https://avatars.githubusercontent.com/u/58246064",
    title: "프론트엔드 개발자 (React)",
    employmentType: "FULL_TIME",
    jobCategory: "FRONTEND",
    experienceLevel: "JUNIOR",
    location: "서울 강남구",
    deadline: "2026-05-10",
    techStack: ["React", "TypeScript", "Next.js", "TailwindCSS"],
    matchScore: 92,
    matchedTags: ["React", "TypeScript", "Next.js"],
    missingTags: ["TailwindCSS"],
  },
  {
    id: "2",
    companyName: "카카오",
    companyLogo: "https://avatars.githubusercontent.com/u/6457308",
    title: "백엔드 엔지니어 (Java/Spring)",
    employmentType: "FULL_TIME",
    jobCategory: "BACKEND",
    experienceLevel: "MIDDLE",
    location: "경기 성남시 분당구",
    deadline: "2026-05-15",
    techStack: ["Java", "Spring Boot", "MySQL", "Redis", "Kafka"],
    matchScore: 68,
    matchedTags: ["Java", "Spring Boot", "MySQL"],
    missingTags: ["Redis", "Kafka"],
  },
  {
    id: "3",
    companyName: "네이버",
    companyLogo: "https://avatars.githubusercontent.com/u/581687",
    title: "풀스택 개발자 (Node.js + React)",
    employmentType: "FULL_TIME",
    jobCategory: "FULLSTACK",
    experienceLevel: "SENIOR",
    location: "경기 성남시 분당구",
    deadline: "2026-05-20",
    techStack: ["Node.js", "React", "TypeScript", "PostgreSQL", "Docker"],
    matchScore: 78,
    matchedTags: ["React", "TypeScript", "Node.js"],
    missingTags: ["PostgreSQL", "Docker"],
  },
  {
    id: "4",
    companyName: "당근마켓",
    companyLogo: "https://avatars.githubusercontent.com/u/16316346",
    title: "iOS 개발자",
    employmentType: "FULL_TIME",
    jobCategory: "MOBILE",
    experienceLevel: "JUNIOR",
    location: "서울 서초구",
    deadline: "2026-04-30",
    techStack: ["Swift", "UIKit", "SwiftUI", "Combine"],
    matchScore: 40,
    matchedTags: ["Swift"],
    missingTags: ["UIKit", "SwiftUI", "Combine"],
  },
  {
    id: "5",
    companyName: "쿠팡",
    companyLogo: "https://avatars.githubusercontent.com/u/7545988",
    title: "DevOps 엔지니어",
    employmentType: "FULL_TIME",
    jobCategory: "DEVOPS",
    experienceLevel: "MIDDLE",
    location: "서울 송파구",
    deadline: "2026-06-01",
    techStack: ["Kubernetes", "Docker", "Terraform", "AWS", "CI/CD"],
    matchScore: 55,
    matchedTags: ["Docker", "AWS"],
    missingTags: ["Kubernetes", "Terraform", "CI/CD"],
  },
  {
    id: "6",
    companyName: "라인",
    companyLogo: "https://avatars.githubusercontent.com/u/9263294",
    title: "AI/ML 엔지니어",
    employmentType: "FULL_TIME",
    jobCategory: "AI_ML",
    experienceLevel: "SENIOR",
    location: "서울 강남구",
    deadline: "2026-05-25",
    techStack: ["Python", "PyTorch", "FastAPI", "MLflow", "Kubernetes"],
    matchScore: 62,
    matchedTags: ["Python", "FastAPI"],
    missingTags: ["PyTorch", "MLflow", "Kubernetes"],
  },
  {
    id: "7",
    companyName: "직방",
    companyLogo: "https://avatars.githubusercontent.com/u/9982249",
    title: "프론트엔드 개발자 (Vue.js)",
    employmentType: "CONTRACT",
    jobCategory: "FRONTEND",
    experienceLevel: "ANY",
    location: "서울 마포구",
    deadline: "2026-05-05",
    techStack: ["Vue.js", "Nuxt.js", "JavaScript", "GraphQL"],
    matchScore: 35,
    matchedTags: ["JavaScript"],
    missingTags: ["Vue.js", "Nuxt.js", "GraphQL"],
  },
  {
    id: "8",
    companyName: "야놀자",
    companyLogo: "https://avatars.githubusercontent.com/u/31956955",
    title: "데이터 엔지니어",
    employmentType: "FULL_TIME",
    jobCategory: "DATA",
    experienceLevel: "JUNIOR",
    location: "서울 강남구",
    deadline: "2026-05-18",
    techStack: ["Python", "Spark", "Airflow", "BigQuery", "dbt"],
    matchScore: 48,
    matchedTags: ["Python"],
    missingTags: ["Spark", "Airflow", "BigQuery", "dbt"],
  },
  {
    id: "9",
    companyName: "배달의민족",
    companyLogo: "https://avatars.githubusercontent.com/u/24539765",
    title: "안드로이드 개발자",
    employmentType: "FULL_TIME",
    jobCategory: "MOBILE",
    experienceLevel: "MIDDLE",
    location: "서울 송파구",
    deadline: "2026-05-30",
    techStack: ["Kotlin", "Jetpack Compose", "Coroutines", "Hilt"],
    matchScore: 44,
    matchedTags: ["Kotlin"],
    missingTags: ["Jetpack Compose", "Coroutines", "Hilt"],
  },
  {
    id: "10",
    companyName: "무신사",
    companyLogo: "https://avatars.githubusercontent.com/u/41753785",
    title: "백엔드 개발자 (Python/Django)",
    employmentType: "FULL_TIME",
    jobCategory: "BACKEND",
    experienceLevel: "JUNIOR",
    location: "서울 성동구",
    deadline: "2026-06-10",
    techStack: ["Python", "Django", "PostgreSQL", "Redis", "Celery"],
    matchScore: 71,
    matchedTags: ["Python", "PostgreSQL"],
    missingTags: ["Django", "Redis", "Celery"],
  },
  {
    id: "11",
    companyName: "카카오페이",
    companyLogo: "https://avatars.githubusercontent.com/u/94585167",
    title: "프론트엔드 개발자 (React Native)",
    employmentType: "FULL_TIME",
    jobCategory: "FRONTEND",
    experienceLevel: "MIDDLE",
    location: "서울 강남구",
    deadline: "2026-05-28",
    techStack: ["React Native", "TypeScript", "Redux", "GraphQL"],
    matchScore: 83,
    matchedTags: ["TypeScript", "Redux", "GraphQL"],
    missingTags: ["React Native"],
  },
  {
    id: "12",
    companyName: "크래프톤",
    companyLogo: "https://avatars.githubusercontent.com/u/74929780",
    title: "클라우드 인프라 엔지니어",
    employmentType: "FULL_TIME",
    jobCategory: "DEVOPS",
    experienceLevel: "SENIOR",
    location: "서울 강남구",
    deadline: "2026-06-15",
    techStack: ["AWS", "Terraform", "Kubernetes", "Prometheus", "Go"],
    matchScore: 52,
    matchedTags: ["AWS", "Kubernetes"],
    missingTags: ["Terraform", "Prometheus", "Go"],
  },
];

export async function fetchJobs(): Promise<Job[]> {
  await new Promise((resolve) => setTimeout(resolve, 600));
  return MOCK_JOBS;
}

export async function fetchJobById(id: string): Promise<Job | null> {
  await new Promise((resolve) => setTimeout(resolve, 400));
  return MOCK_JOBS.find((j) => j.id === id) ?? null;
}

export interface JobsPage {
  jobs: Job[];
  page: number;
  totalPages: number;
  totalCount: number;
}

export type JobSortBy = "MATCH" | "LATEST" | "DEADLINE";

export async function fetchJobsPaginated(params: {
  page: number;
  size: number;
  searchQuery?: string;
  category?: string;
  experienceLevel?: string;
  location?: string;
  techStack?: string[];
  sortBy?: JobSortBy;
}): Promise<JobsPage> {
  await new Promise((resolve) => setTimeout(resolve, 500));

  let filtered = [...MOCK_JOBS];

  const q = params.searchQuery?.trim().toLowerCase();
  if (q) {
    filtered = filtered.filter(
      (j) =>
        j.companyName.toLowerCase().includes(q) ||
        j.title.toLowerCase().includes(q) ||
        j.techStack.some((t) => t.toLowerCase().includes(q)),
    );
  }
  if (params.category && params.category !== "ALL")
    filtered = filtered.filter((j) => j.jobCategory === params.category);
  if (params.experienceLevel && params.experienceLevel !== "ALL")
    filtered = filtered.filter((j) => j.experienceLevel === params.experienceLevel);
  if (params.location && params.location !== "ALL")
    filtered = filtered.filter((j) => j.location === params.location);
  if (params.techStack?.length)
    filtered = filtered.filter((j) =>
      params.techStack!.every((t) => j.techStack.includes(t)),
    );

  const sortBy = params.sortBy ?? "MATCH";
  if (sortBy === "MATCH") {
    filtered.sort((a, b) => b.matchScore - a.matchScore);
  } else if (sortBy === "LATEST") {
    filtered.sort((a, b) => Number(b.id) - Number(a.id));
  } else if (sortBy === "DEADLINE") {
    filtered.sort((a, b) => a.deadline.localeCompare(b.deadline));
  }

  const totalCount = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / params.size));
  const jobs = filtered.slice(
    params.page * params.size,
    (params.page + 1) * params.size,
  );

  return { jobs, page: params.page, totalPages, totalCount };
}
