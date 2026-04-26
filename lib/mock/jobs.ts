import type { Job, JobDetail, JobParseStatus, QACategory } from "@/types/jobs";

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
    deadline: "채용 시 마감",
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
    deadline: "채용 시 마감",
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
    deadline: "채용 시 마감",
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
    deadline: "채용 시 마감",
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

// ─────────────────────────────────────────────────────────────────────────────
// 상세 mock 데이터 (req 45점 + preferred 35점 + experience 20점 = 100점)
// ─────────────────────────────────────────────────────────────────────────────

type JobDetailCoreExtra = Omit<JobDetail, keyof Job | "jdImageUrls" | "parseStatus">;

type JobDetailExtra = JobDetailCoreExtra & {
  jdImageUrls?: string[];
  parseStatus?: JobParseStatus;
};

const MOCK_JOB_DETAILS: Record<string, JobDetailExtra> = {
  "1": {
    salary: "4,000 ~ 7,000만원",
    applyUrl: "https://toss.im/career",
    responsibilities: [
      "React, Next.js 기반 프로덕트 개발 및 유지보수",
      "디자인 시스템 컴포넌트 설계 및 구현",
      "웹 성능 최적화 및 접근성(a11y) 개선",
      "백엔드 API 연동 및 데이터 흐름 설계",
      "코드 리뷰 및 팀 기술 공유 문화 기여",
    ],
    requirements: [
      "React, TypeScript 실무 경험 1년 이상",
      "Next.js 기반 서비스 개발 경험",
      "REST API 연동 및 비동기 처리 능력",
      "Git 기반 협업 및 코드 리뷰 경험",
      "컴포넌트 중심의 UI 설계 이해",
    ],
    preferredQualifications: [
      "TailwindCSS 또는 CSS-in-JS 활용 경험",
      "Storybook을 통한 컴포넌트 문서화 경험",
      "Jest / React Testing Library 테스트 작성 경험",
      "CI/CD 파이프라인 구축 또는 운영 경험",
    ],
    benefits: ["스톡옵션", "자율 출퇴근", "재택근무", "교육비 지원", "건강검진", "장비 지원", "간식 무제한", "개발 도서 지원"],
    hiringProcess: ["서류 전형", "코딩 테스트", "기술 면접", "문화 면접", "최종 합격"],
    matchBreakdown: {
      requirements: {
        score: 40, maxScore: 45,
        summary: "핵심 기술 스택 대부분 충족. 실무 경력 기간 보완 권장",
        items: [
          { label: "React / TypeScript 실무 경험", status: "MET" },
          { label: "Next.js 개발 경험", status: "MET" },
          { label: "REST API 연동 능력", status: "MET" },
          { label: "Git 협업 / 코드 리뷰 경험", status: "MET" },
          { label: "1년 이상 실무 경력", status: "PARTIAL" },
        ],
      },
      preferred: {
        score: 34, maxScore: 35,
        summary: "우대 역량 전반적으로 우수. 테스트 작성 경험 보완 권장",
        items: [
          { label: "TailwindCSS 활용", status: "MET" },
          { label: "Storybook 컴포넌트 문서화", status: "MET" },
          { label: "Jest / Testing Library", status: "PARTIAL" },
          { label: "CI/CD 파이프라인 경험", status: "MET" },
        ],
      },
      experience: {
        score: 18, maxScore: 20,
        summary: "주니어 포지션에 적합. 사이드 프로젝트 경험이 강점",
        items: [
          { label: "주니어 수준 경력 부합", status: "MET" },
          { label: "팀 협업 및 코드 리뷰 참여", status: "MET" },
          { label: "실무 프로덕션 배포 경험", status: "PARTIAL" },
        ],
      },
    },
  },
  "2": {
    salary: "4,500 ~ 8,000만원",
    applyUrl: "https://careers.kakao.com",
    responsibilities: [
      "Java / Spring Boot 기반 백엔드 API 개발",
      "대규모 트래픽 처리 및 성능 개선",
      "Kafka를 활용한 이벤트 드리븐 아키텍처 설계",
      "데이터베이스 쿼리 최적화 및 인덱스 설계",
      "마이크로서비스 간 통신 및 장애 격리 설계",
    ],
    requirements: [
      "Java, Spring Boot 실무 경험 3년 이상",
      "MySQL 설계 및 쿼리 최적화 경험",
      "REST API 설계 및 구현 경험",
      "Redis 캐싱 전략 이해 및 활용 경험",
      "Kafka 또는 메시지 큐 운영 경험",
    ],
    preferredQualifications: [
      "MSA(마이크로서비스) 아키텍처 설계 경험",
      "대용량 트래픽 처리 및 부하 테스트 경험",
      "Kubernetes, Docker 기반 컨테이너 운영 경험",
      "기술 문서 작성 및 팀 내 공유 경험",
    ],
    benefits: ["스톡옵션", "유연근무제", "원격근무", "자기계발비", "건강검진", "사내 카페테리아", "반반차 사용"],
    hiringProcess: ["서류 전형", "코딩 테스트", "기술 면접 1차", "기술 면접 2차", "최종 합격"],
    matchBreakdown: {
      requirements: {
        score: 27, maxScore: 45,
        summary: "Java/Spring/MySQL은 충족. Redis·Kafka 경험 보완 필요",
        items: [
          { label: "Java / Spring Boot 실무 경험", status: "MET" },
          { label: "MySQL 설계 및 최적화", status: "MET" },
          { label: "REST API 설계 경험", status: "MET" },
          { label: "Redis 캐싱 경험", status: "UNMET" },
          { label: "Kafka / 메시지 큐 경험", status: "UNMET" },
        ],
      },
      preferred: {
        score: 25, maxScore: 35,
        summary: "API 설계 역량 우수. 대용량 트래픽·MSA 경험이 약점",
        items: [
          { label: "MSA 아키텍처 경험", status: "PARTIAL" },
          { label: "대용량 트래픽 처리 경험", status: "UNMET" },
          { label: "Docker / Kubernetes 경험", status: "PARTIAL" },
          { label: "기술 문서 작성 경험", status: "MET" },
        ],
      },
      experience: {
        score: 16, maxScore: 20,
        summary: "미들 포지션 요구 경력에 근접. 대규모 서비스 경험 쌓기 권장",
        items: [
          { label: "3년 이상 백엔드 경력", status: "PARTIAL" },
          { label: "팀 리드 또는 멘토링 경험", status: "MET" },
          { label: "프로덕션 서비스 운영 경험", status: "MET" },
        ],
      },
    },
  },
  "3": {
    salary: "5,000 ~ 9,000만원",
    applyUrl: "https://recruit.navercorp.com",
    responsibilities: [
      "Node.js + React 기반 풀스택 서비스 개발",
      "PostgreSQL 스키마 설계 및 쿼리 최적화",
      "Docker 기반 개발 환경 구성 및 CI/CD 설계",
      "신규 기능 기획부터 배포까지 전 과정 주도",
      "주니어 개발자 코드 리뷰 및 기술 멘토링",
    ],
    requirements: [
      "Node.js, React, TypeScript 실무 경험 5년 이상",
      "PostgreSQL 또는 관계형 DB 설계 경험",
      "Docker 기반 컨테이너화 경험",
      "REST API 또는 GraphQL 설계 경험",
      "풀스택 아키텍처 설계 및 구현 경험",
    ],
    preferredQualifications: [
      "GraphQL 스키마 설계 및 운영 경험",
      "Kubernetes 또는 클라우드 인프라 관리 경험",
      "모노레포 구조 경험 (Nx, Turborepo 등)",
      "오픈소스 기여 또는 기술 블로그 운영",
    ],
    benefits: ["스톡옵션", "자율 출퇴근", "리모트 근무", "교육 지원", "건강검진", "식대 지원", "복지 포인트", "사내 동호회"],
    hiringProcess: ["서류 전형", "코딩 테스트", "기술 면접", "임원 면접", "최종 합격"],
    matchBreakdown: {
      requirements: {
        score: 33, maxScore: 45,
        summary: "Node.js / React / TypeScript 충족. PostgreSQL·Docker 보완 필요",
        items: [
          { label: "Node.js 실무 경험", status: "MET" },
          { label: "React / TypeScript 경험", status: "MET" },
          { label: "PostgreSQL 설계 경험", status: "PARTIAL" },
          { label: "Docker 컨테이너화 경험", status: "UNMET" },
          { label: "5년 이상 풀스택 경력", status: "UNMET" },
        ],
      },
      preferred: {
        score: 29, maxScore: 35,
        summary: "모노레포·GraphQL 경험 우수. Kubernetes 경험 보완 필요",
        items: [
          { label: "GraphQL 설계 경험", status: "PARTIAL" },
          { label: "Kubernetes 인프라 관리", status: "UNMET" },
          { label: "모노레포 구조 경험", status: "MET" },
          { label: "오픈소스 기여 경험", status: "MET" },
        ],
      },
      experience: {
        score: 16, maxScore: 20,
        summary: "시니어 요구 경력 미충족. 풀스택 프로젝트 경험이 강점",
        items: [
          { label: "5년 이상 시니어 경력", status: "UNMET" },
          { label: "풀스택 프로젝트 리드 경험", status: "MET" },
          { label: "주니어 멘토링 경험", status: "PARTIAL" },
        ],
      },
    },
  },
  "4": {
    salary: "3,500 ~ 6,000만원",
    applyUrl: "https://about.daangn.com/jobs",
    responsibilities: [
      "Swift, SwiftUI 기반 iOS 앱 개발 및 유지보수",
      "UIKit 레거시 코드 SwiftUI 마이그레이션",
      "Combine 기반 반응형 데이터 흐름 설계",
      "iOS 앱 성능 측정 및 최적화",
      "디자이너·백엔드와 협업하여 기능 구현",
    ],
    requirements: [
      "Swift 기반 iOS 앱 개발 경험",
      "UIKit 또는 SwiftUI 실무 경험",
      "Combine 또는 RxSwift 활용 경험",
      "앱스토어 출시 또는 배포 경험",
      "iOS 앱 아키텍처(MVC, MVVM) 이해",
    ],
    preferredQualifications: [
      "SwiftUI 기반 신규 화면 개발 경험",
      "Tuist 또는 모듈화 아키텍처 경험",
      "접근성(Accessibility) API 활용 경험",
      "RxSwift 또는 Combine 활용 경험",
    ],
    benefits: ["스톡옵션", "자율 출퇴근", "원격근무 가능", "교육비 지원", "건강검진", "간식 제공"],
    hiringProcess: ["서류 전형", "기술 과제", "기술 면접", "최종 합격"],
    matchBreakdown: {
      requirements: {
        score: 14, maxScore: 45,
        summary: "Swift 기초 경험 보유. iOS 실무 스택 전반적 보완 필요",
        items: [
          { label: "Swift 개발 경험", status: "PARTIAL" },
          { label: "UIKit 실무 경험", status: "UNMET" },
          { label: "SwiftUI 활용 경험", status: "UNMET" },
          { label: "Combine 활용 경험", status: "UNMET" },
          { label: "앱스토어 배포 경험", status: "UNMET" },
        ],
      },
      preferred: {
        score: 10, maxScore: 35,
        summary: "iOS 우대 역량 대부분 미충족. 집중 학습 필요",
        items: [
          { label: "SwiftUI 화면 개발 경험", status: "UNMET" },
          { label: "모듈화 아키텍처 경험", status: "UNMET" },
          { label: "접근성 API 경험", status: "PARTIAL" },
          { label: "Combine / RxSwift 경험", status: "UNMET" },
        ],
      },
      experience: {
        score: 16, maxScore: 20,
        summary: "주니어 수준 적합. 개인 앱 개발 경험이 긍정적",
        items: [
          { label: "주니어 수준 경력 부합", status: "MET" },
          { label: "개인 iOS 앱 개발 경험", status: "MET" },
          { label: "팀 협업 및 소통 경험", status: "PARTIAL" },
        ],
      },
    },
  },
  "5": {
    salary: "4,000 ~ 7,000만원",
    applyUrl: "https://www.coupang.jobs",
    responsibilities: [
      "Kubernetes 클러스터 운영 및 모니터링",
      "Terraform IaC 기반 인프라 자동화",
      "CI/CD 파이프라인 설계 및 운영",
      "AWS 클라우드 비용 최적화 및 아키텍처 개선",
      "장애 대응 및 사후 분석(RCA) 문서화",
    ],
    requirements: [
      "Docker, Kubernetes 운영 경험 3년 이상",
      "AWS 주요 서비스(EC2, S3, RDS, EKS) 운영 경험",
      "Terraform 또는 CloudFormation IaC 경험",
      "GitHub Actions / Jenkins CI/CD 구축 경험",
      "Linux 서버 운영 및 장애 대응 경험",
    ],
    preferredQualifications: [
      "Prometheus, Grafana 모니터링 스택 구축 경험",
      "클라우드 비용 분석 및 최적화 경험",
      "쿠버네티스 보안 정책(RBAC, NetworkPolicy) 경험",
      "멀티 클라우드 또는 온프레미스 혼합 환경 경험",
    ],
    benefits: ["스톡옵션", "유연근무제", "건강검진 지원", "교육비 지원", "장비 지원", "식대 지원"],
    hiringProcess: ["서류 전형", "기술 면접 1차", "기술 면접 2차", "최종 합격"],
    matchBreakdown: {
      requirements: {
        score: 20, maxScore: 45,
        summary: "Docker·AWS 경험 보유. Kubernetes·Terraform 실무 경험 필요",
        items: [
          { label: "Docker 운영 경험", status: "MET" },
          { label: "AWS 주요 서비스 운영", status: "MET" },
          { label: "Kubernetes 운영 경험", status: "PARTIAL" },
          { label: "Terraform IaC 경험", status: "UNMET" },
          { label: "CI/CD 파이프라인 구축", status: "PARTIAL" },
        ],
      },
      preferred: {
        score: 15, maxScore: 35,
        summary: "기본 모니터링 경험 보유. 고급 운영 역량 강화 필요",
        items: [
          { label: "Prometheus / Grafana 구축", status: "PARTIAL" },
          { label: "클라우드 비용 최적화", status: "UNMET" },
          { label: "Kubernetes 보안 정책 경험", status: "UNMET" },
          { label: "멀티 클라우드 환경 경험", status: "PARTIAL" },
        ],
      },
      experience: {
        score: 20, maxScore: 20,
        summary: "미들 포지션 경력 적합. 인프라 운영 경험이 강점",
        items: [
          { label: "3년 이상 인프라 경력", status: "MET" },
          { label: "운영 환경 장애 대응 경험", status: "MET" },
          { label: "팀 내 인프라 개선 기여", status: "MET" },
        ],
      },
    },
  },
  "6": {
    salary: "5,000 ~ 10,000만원",
    applyUrl: "https://linepluscorp.com/careers",
    responsibilities: [
      "PyTorch 기반 ML 모델 학습 및 최적화",
      "FastAPI 기반 ML 서빙 API 설계 및 운영",
      "MLflow를 활용한 실험 추적 및 모델 관리",
      "대규모 데이터 파이프라인 설계 및 구현",
      "A/B 테스트 설계 및 모델 성능 평가",
    ],
    requirements: [
      "Python 기반 ML/DL 모델 개발 경험 3년 이상",
      "PyTorch 또는 TensorFlow 실무 경험",
      "ML 서빙 파이프라인 설계 및 운영 경험",
      "MLflow 또는 유사 실험 관리 툴 경험",
      "Kubernetes 기반 ML 워크로드 운영 경험",
    ],
    preferredQualifications: [
      "NLP 또는 CV 도메인 논문 구현 경험",
      "분산 학습(DDP, FSDP) 경험",
      "데이터 전처리 파이프라인(Spark, Beam) 경험",
      "모델 경량화(Quantization, Pruning) 경험",
    ],
    benefits: ["스톡옵션", "자율 출퇴근", "원격근무", "논문 게재 지원", "컨퍼런스 참가비", "교육비 지원", "건강검진"],
    hiringProcess: ["서류 전형", "기술 과제", "기술 면접", "임원 면접", "최종 합격"],
    matchBreakdown: {
      requirements: {
        score: 22, maxScore: 45,
        summary: "Python·FastAPI 경험 보유. PyTorch·MLflow 실무 경험 보완 필요",
        items: [
          { label: "Python 기반 ML 개발 경험", status: "MET" },
          { label: "PyTorch 실무 경험", status: "UNMET" },
          { label: "ML 서빙 파이프라인 경험", status: "PARTIAL" },
          { label: "MLflow 실험 관리 경험", status: "UNMET" },
          { label: "Kubernetes ML 워크로드 운영", status: "UNMET" },
        ],
      },
      preferred: {
        score: 20, maxScore: 35,
        summary: "데이터 파이프라인 경험 우수. 논문 구현·분산 학습 경험 필요",
        items: [
          { label: "논문 구현 / NLP·CV 경험", status: "UNMET" },
          { label: "분산 학습 경험", status: "UNMET" },
          { label: "데이터 전처리 파이프라인", status: "MET" },
          { label: "모델 경량화 경험", status: "PARTIAL" },
        ],
      },
      experience: {
        score: 20, maxScore: 20,
        summary: "AI/ML 관련 실무 배경 탄탄. 경력 연수 적합",
        items: [
          { label: "3년 이상 AI/ML 관련 경력", status: "MET" },
          { label: "연구 또는 프로덕션 ML 경험", status: "MET" },
          { label: "기술 발표 또는 공유 경험", status: "MET" },
        ],
      },
    },
  },
  "7": {
    salary: "3,000 ~ 5,000만원",
    applyUrl: "https://www.zigbang.com/company/jobs",
    responsibilities: [
      "Vue.js, Nuxt.js 기반 부동산 서비스 개발",
      "GraphQL API 연동 및 데이터 레이어 설계",
      "반응형 UI 컴포넌트 개발 및 유지보수",
      "레거시 JavaScript 코드 TypeScript 마이그레이션",
      "SEO 최적화 및 서버사이드 렌더링 구현",
    ],
    requirements: [
      "Vue.js 실무 경험 1년 이상",
      "Nuxt.js SSR 개발 경험",
      "JavaScript / ES6+ 깊은 이해",
      "GraphQL 클라이언트 연동 경험",
      "반응형 레이아웃 구현 능력",
    ],
    preferredQualifications: [
      "TypeScript 마이그레이션 경험",
      "Pinia 또는 Vuex 상태 관리 경험",
      "부동산 도메인 서비스 개발 경험",
      "Playwright 또는 Cypress E2E 테스트 경험",
    ],
    benefits: ["유연근무제", "재택근무", "교육비 지원", "건강검진", "식대 지원", "경조금 지원"],
    hiringProcess: ["서류 전형", "기술 면접", "임원 면접", "최종 합격"],
    matchBreakdown: {
      requirements: {
        score: 10, maxScore: 45,
        summary: "JavaScript 기반 공통 역량 보유. Vue.js 스택 전반 학습 필요",
        items: [
          { label: "Vue.js 실무 경험", status: "UNMET" },
          { label: "Nuxt.js SSR 경험", status: "UNMET" },
          { label: "JavaScript / ES6+ 이해", status: "MET" },
          { label: "GraphQL 클라이언트 연동", status: "UNMET" },
          { label: "반응형 레이아웃 구현", status: "PARTIAL" },
        ],
      },
      preferred: {
        score: 5, maxScore: 35,
        summary: "우대 역량 대부분 미충족. Vue 생태계 집중 학습 권장",
        items: [
          { label: "TypeScript 마이그레이션", status: "PARTIAL" },
          { label: "Pinia / Vuex 상태 관리", status: "UNMET" },
          { label: "부동산 도메인 경험", status: "UNMET" },
          { label: "E2E 테스트 경험", status: "UNMET" },
        ],
      },
      experience: {
        score: 20, maxScore: 20,
        summary: "경력 무관 포지션으로 현재 역량 수준 적합",
        items: [
          { label: "경력 무관 포지션 부합", status: "MET" },
          { label: "프론트엔드 기초 역량 보유", status: "MET" },
          { label: "자기 주도 학습 의지", status: "MET" },
        ],
      },
    },
  },
  "8": {
    salary: "3,500 ~ 6,000만원",
    applyUrl: "https://careers.yanolja.co",
    responsibilities: [
      "Python 기반 데이터 파이프라인 설계 및 구현",
      "Apache Spark를 활용한 대용량 데이터 처리",
      "Airflow DAG 작성 및 스케줄링 관리",
      "BigQuery / dbt 기반 데이터 마트 구축",
      "데이터 품질 모니터링 및 이상 탐지 로직 구현",
    ],
    requirements: [
      "Python 기반 데이터 엔지니어링 경험 1년 이상",
      "Apache Spark 또는 대용량 처리 프레임워크 경험",
      "Airflow 기반 파이프라인 작성 경험",
      "BigQuery 또는 클라우드 DW 경험",
      "dbt를 활용한 데이터 변환 경험",
    ],
    preferredQualifications: [
      "스트리밍 파이프라인(Kafka, Flink) 경험",
      "데이터 품질 프레임워크(Great Expectations) 경험",
      "GCP 또는 AWS 데이터 서비스 운영 경험",
      "데이터 카탈로그 구축 경험",
    ],
    benefits: ["유연근무제", "원격근무", "교육비 지원", "건강검진", "식대 지원", "복지 포인트"],
    hiringProcess: ["서류 전형", "기술 과제", "기술 면접", "최종 합격"],
    matchBreakdown: {
      requirements: {
        score: 15, maxScore: 45,
        summary: "Python 경험 보유. Spark·Airflow·dbt 실무 역량 보완 필요",
        items: [
          { label: "Python 데이터 엔지니어링 경험", status: "PARTIAL" },
          { label: "Apache Spark 활용 경험", status: "UNMET" },
          { label: "Airflow 파이프라인 경험", status: "UNMET" },
          { label: "BigQuery / 클라우드 DW 경험", status: "UNMET" },
          { label: "dbt 데이터 변환 경험", status: "UNMET" },
        ],
      },
      preferred: {
        score: 15, maxScore: 35,
        summary: "클라우드 데이터 서비스 기초 경험 보유. 심화 도구 학습 필요",
        items: [
          { label: "스트리밍 파이프라인 경험", status: "UNMET" },
          { label: "데이터 품질 프레임워크", status: "UNMET" },
          { label: "GCP / AWS 데이터 서비스", status: "PARTIAL" },
          { label: "데이터 카탈로그 경험", status: "PARTIAL" },
        ],
      },
      experience: {
        score: 18, maxScore: 20,
        summary: "주니어 포지션 경력 부합. Python 분석 배경이 긍정적",
        items: [
          { label: "주니어 수준 경력 부합", status: "MET" },
          { label: "Python 데이터 분석 경험", status: "MET" },
          { label: "파이프라인 설계 참여 경험", status: "PARTIAL" },
        ],
      },
    },
  },
  "9": {
    salary: "4,000 ~ 7,000만원",
    applyUrl: "https://woowacourse.github.io/tecoble/",
    responsibilities: [
      "Kotlin, Jetpack Compose 기반 안드로이드 앱 개발",
      "Hilt DI 프레임워크 기반 모듈화 아키텍처 구성",
      "Coroutines / Flow를 활용한 비동기 처리",
      "앱 성능 측정 및 ANR / Crash 분석 및 개선",
      "디자이너 및 서버 개발자와 협업하여 기능 구현",
    ],
    requirements: [
      "Kotlin 기반 안드로이드 앱 개발 경험 3년 이상",
      "Jetpack Compose 실무 적용 경험",
      "Coroutines / Flow 기반 비동기 처리 경험",
      "Hilt 또는 Dagger2 DI 경험",
      "Google Play Store 앱 출시 및 운영 경험",
    ],
    preferredQualifications: [
      "멀티 모듈 아키텍처 설계 경험",
      "MVI 또는 Clean Architecture 적용 경험",
      "성능 프로파일링(Tracing, Memory) 경험",
      "배달·커머스 도메인 서비스 개발 경험",
    ],
    benefits: ["스톡옵션", "자율 출퇴근", "원격근무", "교육비 지원", "건강검진", "식대 지원", "간식 제공"],
    hiringProcess: ["서류 전형", "코딩 테스트", "기술 면접", "임원 면접", "최종 합격"],
    matchBreakdown: {
      requirements: {
        score: 14, maxScore: 45,
        summary: "Kotlin 기초 경험 보유. Compose·Hilt 실무 경험 대폭 보완 필요",
        items: [
          { label: "Kotlin 개발 경험", status: "PARTIAL" },
          { label: "Jetpack Compose 경험", status: "UNMET" },
          { label: "Coroutines / Flow 경험", status: "UNMET" },
          { label: "Hilt / DI 프레임워크 경험", status: "UNMET" },
          { label: "Play Store 앱 출시 경험", status: "UNMET" },
        ],
      },
      preferred: {
        score: 10, maxScore: 35,
        summary: "안드로이드 우대 역량 대부분 미충족. 집중 학습 필요",
        items: [
          { label: "멀티 모듈 아키텍처 경험", status: "UNMET" },
          { label: "MVI / Clean Architecture", status: "PARTIAL" },
          { label: "성능 프로파일링 경험", status: "UNMET" },
          { label: "배달·커머스 도메인 경험", status: "UNMET" },
        ],
      },
      experience: {
        score: 20, maxScore: 20,
        summary: "미들 포지션이지만 경력 배경 긍정적. 안드로이드 전환 의지 중요",
        items: [
          { label: "개발 경력 3년 이상 보유", status: "MET" },
          { label: "모바일 앱 사용자 경험 이해", status: "MET" },
          { label: "팀 협업 및 애자일 경험", status: "MET" },
        ],
      },
    },
  },
  "10": {
    salary: "3,500 ~ 6,000만원",
    applyUrl: "https://careers.musinsa.com",
    responsibilities: [
      "Python / Django 기반 커머스 백엔드 API 개발",
      "PostgreSQL 쿼리 최적화 및 인덱스 설계",
      "Redis 캐싱 전략 설계 및 적용",
      "Celery를 활용한 비동기 작업 처리",
      "상품·주문·결제 도메인 비즈니스 로직 구현",
    ],
    requirements: [
      "Python, Django 실무 경험 1년 이상",
      "PostgreSQL 설계 및 쿼리 최적화 경험",
      "REST API 설계 및 문서화 경험",
      "Redis 캐싱 또는 세션 관리 경험",
      "Celery 비동기 태스크 처리 경험",
    ],
    preferredQualifications: [
      "Django REST Framework 기반 API 개발 경험",
      "커머스(상품/주문/결제) 도메인 경험",
      "Docker 기반 개발 환경 구성 경험",
      "테스트 코드 작성(pytest) 경험",
    ],
    benefits: ["임직원 할인", "유연근무제", "재택근무", "교육비 지원", "건강검진", "복지 포인트"],
    hiringProcess: ["서류 전형", "코딩 테스트", "기술 면접", "최종 합격"],
    matchBreakdown: {
      requirements: {
        score: 28, maxScore: 45,
        summary: "Python·PostgreSQL 역량 우수. Django·Redis·Celery 보완 필요",
        items: [
          { label: "Python 실무 경험", status: "MET" },
          { label: "Django 실무 경험", status: "PARTIAL" },
          { label: "PostgreSQL 설계 / 최적화", status: "MET" },
          { label: "Redis 캐싱 경험", status: "UNMET" },
          { label: "Celery 비동기 처리 경험", status: "UNMET" },
        ],
      },
      preferred: {
        score: 25, maxScore: 35,
        summary: "DRF·테스트 경험 보유. 커머스 도메인 경험 보완 권장",
        items: [
          { label: "Django REST Framework", status: "MET" },
          { label: "커머스 도메인 경험", status: "UNMET" },
          { label: "Docker 개발 환경 구성", status: "PARTIAL" },
          { label: "pytest 테스트 코드 작성", status: "MET" },
        ],
      },
      experience: {
        score: 18, maxScore: 20,
        summary: "주니어 포지션에 적합. Python 백엔드 기반이 강점",
        items: [
          { label: "1년 이상 백엔드 경력", status: "MET" },
          { label: "프로덕션 API 개발 경험", status: "MET" },
          { label: "커머스 서비스 이해도", status: "PARTIAL" },
        ],
      },
    },
  },
  "11": {
    salary: "4,500 ~ 8,000만원",
    applyUrl: "https://kakaopay.recruiter.co.kr/career",
    responsibilities: [
      "React Native 기반 카카오페이 앱 개발",
      "TypeScript로 안정적인 금융 서비스 UI 구현",
      "Redux Toolkit 기반 상태 관리 최적화",
      "GraphQL API 연동 및 캐싱 전략 설계",
      "iOS / Android 플랫폼 네이티브 모듈 연동",
    ],
    requirements: [
      "React Native 실무 경험 3년 이상",
      "TypeScript 기반 프로젝트 경험",
      "Redux 또는 상태 관리 라이브러리 실무 경험",
      "GraphQL 클라이언트(Apollo, Relay) 경험",
      "iOS / Android 빌드 및 배포 프로세스 이해",
    ],
    preferredQualifications: [
      "핀테크 또는 금융 서비스 도메인 경험",
      "React Native 성능 최적화 경험",
      "네이티브 모듈 작성(Swift/Kotlin) 경험",
      "E2E 테스트 자동화(Detox) 경험",
    ],
    benefits: ["스톡옵션", "자율 출퇴근", "재택근무", "교육비 지원", "건강검진", "복지 포인트", "간식 제공"],
    hiringProcess: ["서류 전형", "코딩 테스트", "기술 면접", "임원 면접", "최종 합격"],
    matchBreakdown: {
      requirements: {
        score: 37, maxScore: 45,
        summary: "TypeScript·Redux·GraphQL 충족. React Native 실무 경험 보완 필요",
        items: [
          { label: "React Native 실무 경험", status: "UNMET" },
          { label: "TypeScript 프로젝트 경험", status: "MET" },
          { label: "Redux 상태 관리 경험", status: "MET" },
          { label: "GraphQL 클라이언트 경험", status: "MET" },
          { label: "iOS / Android 빌드 이해", status: "PARTIAL" },
        ],
      },
      preferred: {
        score: 28, maxScore: 35,
        summary: "핀테크 도메인·성능 최적화 역량 우수. 네이티브 모듈 경험 부족",
        items: [
          { label: "핀테크 / 금융 서비스 경험", status: "MET" },
          { label: "React Native 성능 최적화", status: "MET" },
          { label: "네이티브 모듈 작성 경험", status: "UNMET" },
          { label: "E2E 테스트 자동화(Detox)", status: "PARTIAL" },
        ],
      },
      experience: {
        score: 18, maxScore: 20,
        summary: "미들 포지션에 근접. 웹 프론트엔드 경험이 전환에 유리",
        items: [
          { label: "3년 이상 프론트엔드 경력", status: "PARTIAL" },
          { label: "금융 서비스 개발 참여 경험", status: "MET" },
          { label: "모바일 UX 이해도", status: "MET" },
        ],
      },
    },
  },
  "12": {
    salary: "5,000 ~ 9,000만원",
    applyUrl: "https://krafton.com/careers",
    responsibilities: [
      "AWS 기반 글로벌 게임 인프라 설계 및 운영",
      "Terraform IaC로 멀티 리전 인프라 자동화",
      "Kubernetes 클러스터 운영 및 스케일링 전략 수립",
      "Prometheus / Grafana 기반 모니터링 시스템 구축",
      "Go 기반 내부 인프라 자동화 툴 개발",
    ],
    requirements: [
      "AWS 인프라 설계 및 운영 경험 5년 이상",
      "Terraform 기반 IaC 실무 경험",
      "Kubernetes 프로덕션 운영 경험",
      "Prometheus, Grafana 모니터링 구축 경험",
      "Go 또는 Python 기반 자동화 스크립트 작성 경험",
    ],
    preferredQualifications: [
      "글로벌 멀티 리전 아키텍처 경험",
      "게임 서버 인프라 특화 경험",
      "FinOps / 클라우드 비용 최적화 경험",
      "AWS 자격증(SA, SysOps) 보유",
    ],
    benefits: ["스톡옵션", "자율 출퇴근", "원격근무", "교육비 지원", "건강검진", "게임 제공", "장비 지원"],
    hiringProcess: ["서류 전형", "기술 면접 1차", "기술 면접 2차", "임원 면접", "최종 합격"],
    matchBreakdown: {
      requirements: {
        score: 18, maxScore: 45,
        summary: "AWS·Kubernetes 기초 경험 보유. Terraform·Prometheus·Go 보완 필요",
        items: [
          { label: "AWS 인프라 운영 경험", status: "PARTIAL" },
          { label: "Terraform IaC 경험", status: "UNMET" },
          { label: "Kubernetes 프로덕션 운영", status: "PARTIAL" },
          { label: "Prometheus / Grafana 구축", status: "UNMET" },
          { label: "Go 자동화 스크립트 작성", status: "UNMET" },
        ],
      },
      preferred: {
        score: 14, maxScore: 35,
        summary: "클라우드 기본기 보유. 글로벌·게임 특화 경험 대폭 보완 필요",
        items: [
          { label: "글로벌 멀티 리전 아키텍처", status: "UNMET" },
          { label: "게임 서버 인프라 경험", status: "UNMET" },
          { label: "FinOps / 비용 최적화 경험", status: "PARTIAL" },
          { label: "AWS 자격증 보유", status: "MET" },
        ],
      },
      experience: {
        score: 20, maxScore: 20,
        summary: "시니어 포지션이지만 인프라 경력 배경 탄탄",
        items: [
          { label: "5년 이상 인프라 관련 경력", status: "MET" },
          { label: "클라우드 운영 실무 참여", status: "MET" },
          { label: "장애 대응 및 RCA 경험", status: "MET" },
        ],
      },
    },
  },
};

const MOCK_JOB_QA_SET_1: QACategory[] = [
  {
    title: "자기소개",
    items: [
      {
        question: "본인의 개발 경험과 주요 강점을 간략히 소개해 주세요.",
        answer:
          "저는 React와 TypeScript를 중심으로 3년간 프론트엔드 개발을 해왔습니다. 사용자 경험을 최우선으로 생각하며, 컴포넌트 설계와 성능 최적화에 특히 강점이 있습니다. 최근에는 Next.js App Router를 활용한 서비스를 개발하며 서버 컴포넌트와 스트리밍 렌더링에도 깊이 공부했습니다.",
        followUps: [
          "성능 최적화를 통해 실질적인 개선을 이룬 사례를 구체적으로 말씀해 주시겠어요?",
          "팀 협업 상황에서 컴포넌트 설계 원칙을 어떻게 팀원들과 공유하셨나요?",
        ],
      },
      {
        question: "지금까지 가장 도전적이었던 프로젝트는 무엇이고, 어떻게 극복했나요?",
        answer:
          "실시간 협업 기능이 있는 에디터 개발이 가장 도전적이었습니다. 여러 사용자가 동시에 편집할 때 충돌을 방지하기 위해 Operational Transformation 알고리즘을 학습하고 적용했습니다. 기술 문서가 부족해 오픈소스 코드를 직접 분석하며 해결했습니다.",
        followUps: [
          "그 과정에서 팀원과 의견 충돌은 없었나요?",
          "같은 문제를 지금 다시 해결한다면 어떻게 접근하시겠어요?",
        ],
      },
      {
        question: "왜 저희 회사에 지원하셨나요?",
        answer:
          "개발자 성장에 집중한 플랫폼을 만들고 있다는 점이 저의 관심사와 정확히 맞았습니다. 실제 서비스를 사용하면서 제품의 완성도와 사용자에 대한 깊은 이해를 느꼈고, 이런 팀에서 함께 성장하고 싶다고 생각했습니다.",
        followUps: [
          "저희 서비스에서 개선하고 싶은 부분이 있다면요?",
          "입사 후 6개월 안에 기여하고 싶은 부분은 무엇인가요?",
        ],
      },
    ],
  },
  {
    title: "프로젝트",
    items: [
      {
        question: "최근 진행한 프로젝트에서 기술적으로 가장 복잡했던 부분을 설명해 주세요.",
        answer:
          "무한 스크롤과 가상화(Virtualization)를 함께 구현하는 것이 복잡했습니다. 수천 개의 아이템을 렌더링할 때 성능 저하가 발생해 TanStack Virtual을 도입했고, TanStack Query의 무한 쿼리와 연동하여 매끄러운 UX를 구현했습니다. 결과적으로 초기 렌더링 속도가 약 60% 향상되었습니다.",
        followUps: [
          "가상화 도입 전에 다른 최적화 방법을 먼저 시도해 보셨나요?",
          "그 수치(60%)는 어떤 방법으로 측정하셨나요?",
        ],
      },
      {
        question: "프로젝트에서 상태 관리를 어떻게 설계했나요?",
        answer:
          "서버 상태는 TanStack Query로, 클라이언트 전역 상태는 Zustand로, 컴포넌트 로컬 상태는 useState로 명확히 분리했습니다. 이 원칙 덕분에 불필요한 전역 상태를 줄이고 캐시 무효화 로직을 한 곳에서 관리할 수 있었습니다.",
        followUps: [
          "상태를 어디에 둘지 팀 내 기준은 어떻게 정하셨나요?",
          "이 방식에서 겪었던 단점이나 한계는 없었나요?",
        ],
      },
      {
        question: "코드 리뷰에서 본인의 코드가 대폭 수정된 경험이 있나요? 어떻게 대응했나요?",
        answer:
          "컴포넌트 구조를 완전히 재설계하자는 피드백을 받은 적 있습니다. 처음엔 당혹스러웠지만 리뷰어의 관점을 이해하기 위해 페어 프로그래밍을 요청했습니다. 그 결과 더 나은 설계를 배웠고, 이후 먼저 설계 문서를 공유하는 습관을 갖게 됐습니다.",
        followUps: [
          "그 이후 설계 단계에서 팀원들과 소통하는 방식이 어떻게 바뀌었나요?",
          "반대로 다른 팀원에게 피드백을 줄 때 어떤 방식으로 전달하시나요?",
        ],
      },
    ],
  },
  {
    title: "기술",
    items: [
      {
        question: "React의 렌더링 최적화 방법에 대해 설명해 주세요.",
        answer:
          "불필요한 리렌더링을 막기 위해 React.memo, useMemo, useCallback을 사용합니다. 단, 과도한 메모이제이션은 오히려 역효과를 낼 수 있어 Profiler로 실제 병목을 확인한 후 적용합니다. 또한 상태를 필요한 컴포넌트에 최대한 가깝게 두는 State Colocation 원칙을 준수합니다.",
        followUps: [
          "React Compiler가 도입되면 이런 최적화 방식이 어떻게 바뀔 것 같나요?",
          "가장 최근에 리렌더링 문제를 해결한 실제 사례가 있나요?",
        ],
      },
      {
        question: "TypeScript를 사용하면서 타입 안전성을 높이기 위해 어떤 노력을 하셨나요?",
        answer:
          "any 타입을 엄격히 금지하고, unknown을 사용한 후 타입 가드로 좁히는 방식을 팀 컨벤션으로 정했습니다. API 응답 타입은 Zod로 런타임 검증까지 추가하여 서버-클라이언트 간 타입 불일치를 사전에 방지했습니다.",
        followUps: [
          "Zod 외 다른 런타임 검증 라이브러리와 비교해 보신 적 있나요?",
          "타입 안전성과 개발 속도 사이의 트레이드오프를 어떻게 조율하시나요?",
        ],
      },
      {
        question: "CSR, SSR, SSG의 차이와 각각 어떤 상황에 사용하는지 설명해 주세요.",
        answer:
          "CSR은 인터랙션이 많고 SEO가 불필요한 대시보드에, SSR은 사용자 개인화 데이터가 필요하거나 SEO가 중요한 페이지에, SSG는 자주 변경되지 않는 마케팅 페이지나 문서에 적합합니다. Next.js에서는 이 세 가지를 페이지 단위로 혼용할 수 있어 상황에 맞게 선택합니다.",
        followUps: [
          "ISR(Incremental Static Regeneration)은 어떤 경우에 선택하시나요?",
          "현재 프로젝트에서 각 방식을 어떤 기준으로 선택하셨나요?",
        ],
      },
    ],
  },
  {
    title: "커뮤니케이션",
    items: [
      {
        question: "비개발자(기획자, 디자이너)와 의견 충돌이 생겼을 때 어떻게 해결하셨나요?",
        answer:
          "애니메이션 구현 범위에 대해 디자이너와 의견 차이가 있었습니다. 기술적 제약을 바로 설명하기보다 먼저 디자이너의 의도를 충분히 듣고, '사용자가 인지하는 가치'를 기준으로 대안을 함께 탐색했습니다. 구현 가능한 범위 내에서 핵심 인터랙션을 살리는 방향으로 합의했고, 이후 디자이너가 먼저 기술 제약을 물어봐 주는 관계가 됐습니다.",
        followUps: [
          "그 경험 이후 협업 방식이 어떻게 달라졌나요?",
          "기술적 제약을 비개발자에게 설명할 때 주로 어떤 방법을 사용하시나요?",
        ],
      },
    ],
  },
];

const MOCK_JOB_QA_SET_2: QACategory[] = [
  {
    title: "자기소개",
    items: [
      {
        question: "개발자가 된 계기와 앞으로의 커리어 방향성에 대해 말씀해 주세요.",
        answer:
          "대학 시절 직접 만든 웹 서비스가 실제 사용자의 반응을 받았을 때 큰 보람을 느끼며 개발자의 길을 선택했습니다. 앞으로는 단순 구현을 넘어 사용자 경험과 비즈니스 임팩트를 함께 고민하는 프론트엔드 엔지니어로 성장하고 싶습니다.",
        followUps: [
          "그 서비스에서 가장 기억에 남는 사용자 피드백은 무엇인가요?",
          "커리어 방향성을 위해 지금 어떤 준비를 하고 계신가요?",
        ],
      },
      {
        question: "팀에서 본인의 역할은 주로 어떤 포지션인가요? 리더 경험이 있다면 공유해 주세요.",
        answer:
          "주로 기술적 방향성을 제안하고 팀원의 온보딩을 돕는 역할을 맡아왔습니다. 3명 규모의 프론트엔드 팀을 리드하며 코드 리뷰 문화를 정착시키고, 주요 아키텍처 결정을 문서화하는 작업을 했습니다.",
        followUps: [
          "리드 역할에서 가장 어려웠던 부분은 무엇이었나요?",
          "팀원의 성장을 어떻게 지원하셨나요?",
        ],
      },
      {
        question: "최근 가장 관심 있게 공부하고 있는 기술이나 트렌드가 있다면 말씀해 주세요.",
        answer:
          "React Server Components와 Streaming SSR을 깊이 공부하고 있습니다. 특히 서버와 클라이언트 컴포넌트의 경계를 어떻게 설계하느냐에 따라 성능과 개발 경험이 크게 달라진다는 것을 느끼며, 실제 프로젝트에 적용해 보고 있습니다.",
        followUps: [
          "공부한 내용을 실제 업무에 적용한 사례가 있나요?",
          "기술 트렌드를 따라가기 위해 주로 어떤 채널을 활용하시나요?",
        ],
      },
    ],
  },
  {
    title: "프로젝트",
    items: [
      {
        question: "가장 많은 사용자가 이용한 서비스나 프로젝트에 대해 설명해 주세요.",
        answer:
          "MAU 10만 이상의 SaaS 대시보드 개발에 참여했습니다. 다양한 디바이스에서 일관된 경험을 제공하기 위해 반응형 레이아웃 시스템을 처음부터 설계했고, 핵심 차트 컴포넌트를 추상화해 여러 팀이 재사용할 수 있도록 구조화했습니다.",
        followUps: [
          "그 규모의 서비스에서 특히 신경 썼던 기술적 도전은 무엇인가요?",
          "다양한 팀이 컴포넌트를 재사용하는 과정에서 생긴 이슈는 없었나요?",
        ],
      },
      {
        question: "기술 부채를 경험하거나 해소한 사례가 있다면 말씀해 주세요.",
        answer:
          "레거시 JavaScript 코드베이스를 TypeScript로 마이그레이션하는 프로젝트를 주도했습니다. 한 번에 전환하기 어려워 파일 단위로 점진적으로 적용하고, any 타입 허용 기간을 정해 팀원들의 부담을 줄였습니다. 3개월 만에 전체 90%를 TypeScript로 전환했습니다.",
        followUps: [
          "마이그레이션 과정에서 팀원들의 반응은 어땠나요?",
          "기술 부채와 신규 기능 개발 사이의 우선순위를 어떻게 조율하셨나요?",
        ],
      },
      {
        question: "마감 기한 압박 속에서 품질과 속도를 어떻게 균형잡았나요?",
        answer:
          "먼저 핵심 기능과 부가 기능을 명확히 구분하고, 핵심 기능에 집중해 출시 후 부가 기능을 단계적으로 추가하는 방식을 택했습니다. 출시 전에는 E2E 테스트를 통한 핵심 플로우 검증에 집중하고, 단위 테스트는 출시 후 안정화 스프린트에서 보완했습니다.",
        followUps: [
          "그렇게 결정했을 때 이해관계자들의 반응은 어땠나요?",
          "출시 후 발생한 이슈가 있었다면 어떻게 대응하셨나요?",
        ],
      },
    ],
  },
  {
    title: "기술",
    items: [
      {
        question: "웹 접근성(a11y)에 대해 어느 정도 이해하고 있고, 실제 적용 사례가 있나요?",
        answer:
          "WCAG 2.1 가이드라인을 기준으로 키보드 네비게이션, ARIA 레이블, 색상 대비 비율을 점검하는 방식을 적용해 왔습니다. 특히 스크린 리더 사용자를 위해 동적으로 변하는 콘텐츠에 aria-live 영역을 추가한 경험이 있습니다.",
        followUps: [
          "접근성 검수 도구로 무엇을 사용하셨나요?",
          "접근성 개선이 일반 사용자 경험에도 긍정적인 영향을 준 사례가 있나요?",
        ],
      },
      {
        question: "브라우저 렌더링 과정(Critical Rendering Path)에 대해 설명해 주세요.",
        answer:
          "HTML 파싱 → DOM 생성 → CSS 파싱 → CSSOM 생성 → Render Tree 구성 → Layout → Paint → Composite 순서로 진행됩니다. 이를 최적화하기 위해 렌더링 블로킹 리소스를 최소화하고, 무거운 CSS는 미디어 쿼리로 분리하며, 레이아웃 트리거가 되는 JS 작업은 requestAnimationFrame을 통해 처리합니다.",
        followUps: [
          "레이아웃 쓰래싱(Layout Thrashing)을 방지하기 위해 어떤 방법을 사용하셨나요?",
          "Composite 단계에서 성능을 개선한 경험이 있나요?",
        ],
      },
      {
        question: "모노레포와 멀티레포의 장단점을 비교하고 어떤 상황에서 선택하시겠어요?",
        answer:
          "모노레포는 코드 공유와 일관된 버전 관리에 유리하지만 빌드 복잡도가 높아집니다. 멀티레포는 팀 자율성이 높고 배포가 독립적이지만 중복 코드가 발생하기 쉽습니다. 디자인 시스템이나 공통 유틸이 많은 경우 모노레포를, 팀 간 의존성이 낮고 배포 사이클이 다른 경우 멀티레포를 선택합니다.",
        followUps: [
          "Turborepo나 Nx 같은 모노레포 도구를 사용해 보신 경험이 있나요?",
          "현재 팀 구조라면 어떤 방식을 선택하시겠어요?",
        ],
      },
    ],
  },
  {
    title: "커뮤니케이션",
    items: [
      {
        question: "일정이 촉박한 상황에서 요구사항이 추가됐을 때 어떻게 대처하셨나요?",
        answer:
          "먼저 기존 스코프와 추가 요구사항의 영향 범위를 정리해 PO와 공유했습니다. '이번 스프린트에 포함하려면 A를 다음으로 미뤄야 한다'는 식으로 트레이드오프를 명확히 제시했고, 결국 팀이 우선순위를 함께 결정하도록 유도했습니다. 감정적 대응보다 데이터 기반 협의가 더 빠른 해결책이라는 것을 배웠습니다.",
        followUps: [
          "요구사항 추가가 반복적으로 발생한다면 구조적으로 어떻게 대응하시겠어요?",
          "그 과정에서 PO나 기획자와의 신뢰를 어떻게 유지하셨나요?",
        ],
      },
    ],
  },
];

export const MOCK_JOB_QA_SETS: QACategory[][] = [MOCK_JOB_QA_SET_1, MOCK_JOB_QA_SET_2];

export async function fetchJobDetailById(id: string): Promise<JobDetail | null> {
  await new Promise((resolve) => setTimeout(resolve, 400));
  const base = MOCK_JOBS.find((j) => j.id === id);
  if (!base) return null;
  const extra = MOCK_JOB_DETAILS[id];
  if (!extra) return null;
  return {
    ...base,
    ...extra,
    jdImageUrls: extra.jdImageUrls ?? [],
    parseStatus: extra.parseStatus ?? "PENDING",
  };
}
