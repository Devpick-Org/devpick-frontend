import type {
  TrendRange,
  TrendTopPost,
  TrendKeywordItem,
  HomeTrendData,
} from "@/types/search";
export type { TrendRange, TrendTopPost, TrendKeywordItem, HomeTrendData };

const MOCK_HOME_TREND: Record<TrendRange, HomeTrendData> = {
  daily: {
    unit: "daily",
    periodStart: "2026-04-28",
    periodEnd: "2026-04-28",
    dateLabel: "4월 28일",
    topPosts: [
      {
        rank: 1,
        id: "trend-day-1",
        title:
          "Understanding the Boundary Between React Server and Client Components",
        translatedTitle:
          "리액트 서버 컴포넌트와 클라이언트 컴포넌트 경계 완전 이해",
        sourceName: "velog",
        tags: ["React", "Next.js"],
        viewCount: 1247,
        thumbnailUrl: "https://picsum.photos/seed/react-server/400/225",
        category: "Frontend",
        changeRate: 18.4,
        isMyInterest: false,
      },
      {
        rank: 2,
        id: "trend-day-2",
        title: "Deep Dive into TypeScript 5.4 NoInfer Utility Type",
        translatedTitle: "타입스크립트 5.4 NoInfer 유틸리티 타입 파헤치기",
        sourceName: "toss_tech",
        tags: ["TypeScript"],
        viewCount: 982,
        thumbnailUrl: null,
        category: "Frontend",
        changeRate: 7.2,
        isMyInterest: false,
      },
      {
        rank: 3,
        id: "trend-day-3",
        title:
          "Building Serverless Architecture with AWS Lambda and API Gateway",
        translatedTitle:
          "AWS Lambda + API Gateway로 서버리스 아키텍처 구축하기",
        sourceName: "naver_d2",
        tags: ["AWS", "Serverless"],
        viewCount: 834,
        thumbnailUrl: "https://picsum.photos/seed/aws-lambda/400/225",
        category: "DevOps",
        changeRate: -3.1,
        isMyInterest: false,
      },
      {
        rank: 4,
        id: "trend-day-4",
        title: "Practical Guide to Tailwind CSS v4 Migration",
        translatedTitle: "Tailwind CSS v4 마이그레이션 실전 가이드",
        sourceName: "velog",
        tags: ["Tailwind", "CSS"],
        viewCount: 721,
        thumbnailUrl: null,
        category: "Frontend",
        changeRate: 24.6,
        isMyInterest: false,
      },
      {
        rank: 5,
        id: "trend-day-5",
        title: "PostgreSQL Query Performance Analysis and Index Strategy",
        translatedTitle: "PostgreSQL 쿼리 성능 분석과 인덱스 전략",
        sourceName: "kakao_tech",
        tags: ["PostgreSQL", "DB"],
        viewCount: 658,
        thumbnailUrl: "https://picsum.photos/seed/postgresql/400/225",
        category: "Backend",
        changeRate: 0,
        isMyInterest: false,
      },
    ],
    topPostsSummary:
      "오늘은 React 서버 컴포넌트와 TypeScript 5.4 관련 글이 조회수 1위를 다투고 있습니다. AWS 서버리스 구축 가이드와 Tailwind CSS v4 마이그레이션 글도 빠르게 조회수가 오르고 있으며, PostgreSQL 인덱스 최적화 글이 백엔드 개발자들 사이에서 주목받고 있습니다.",
    collectionSummary: null,
    trendingTags: [
      { rank: 1, keyword: "React", count: 124, state: "up", rankChange: 3 },
      { rank: 2, keyword: "TypeScript", count: 98, state: "new", rankChange: 0 },
      { rank: 3, keyword: "AWS", count: 84, state: "down", rankChange: 2 },
      { rank: 4, keyword: "Next.js", count: 79, state: "same", rankChange: 0 },
      { rank: 5, keyword: "Tailwind", count: 63, state: "up", rankChange: 1 },
      { rank: 6, keyword: "PostgreSQL", count: 58, state: "new", rankChange: 0 },
      { rank: 7, keyword: "Python", count: 52, state: "up", rankChange: 5 },
      { rank: 8, keyword: "Docker", count: 47, state: "down", rankChange: 1 },
      { rank: 9, keyword: "Kotlin", count: 38, state: "same", rankChange: 0 },
      { rank: 10, keyword: "Redis", count: 31, state: "up", rankChange: 2 },
    ],
  },

  weekly: {
    unit: "weekly",
    periodStart: "2026-04-22",
    periodEnd: "2026-04-28",
    dateLabel: "4월 22일 주간",
    topPosts: [
      {
        rank: 1,
        id: "trend-week-1",
        title:
          "2025 Frontend Ecosystem Overview — In-Depth React, Vue, Svelte Comparison",
        translatedTitle:
          "2025년 프론트엔드 생태계 총정리 — React, Vue, Svelte 심층 비교",
        sourceName: "naver_d2",
        tags: ["Frontend", "React"],
        viewCount: 8412,
        thumbnailUrl: "https://picsum.photos/seed/frontend-ecosystem/400/225",
        category: "Frontend",
        changeRate: 32.1,
        isMyInterest: false,
      },
      {
        rank: 2,
        id: "trend-week-2",
        title:
          "Spring Boot 3 + Kotlin in Practice — 6 Months After Team Migration",
        translatedTitle:
          "Spring Boot 3 + Kotlin 실전 도입기 — 팀 전환 6개월 후기",
        sourceName: "우아한형제들",
        tags: ["Spring", "Kotlin"],
        viewCount: 6238,
        thumbnailUrl: null,
        category: "Backend",
        changeRate: 14.7,
        isMyInterest: false,
      },
      {
        rank: 3,
        id: "trend-week-3",
        title: "Setting Up a Local Kubernetes Dev Environment Without Docker",
        translatedTitle: "Docker 없이 Kubernetes 로컬 개발 환경 구성하는 법",
        sourceName: "kakao_tech",
        tags: ["Kubernetes", "Docker"],
        viewCount: 5847,
        thumbnailUrl: "https://picsum.photos/seed/kubernetes-local/400/225",
        category: "DevOps",
        changeRate: -5.3,
        isMyInterest: false,
      },
      {
        rank: 4,
        id: "trend-week-4",
        title: "Build a RAG System with LLM API — LangChain + ChromaDB",
        translatedTitle:
          "LLM API로 RAG 시스템 직접 만들기 — LangChain + ChromaDB",
        sourceName: "toss_tech",
        tags: ["AI", "Python", "LLM"],
        viewCount: 4921,
        thumbnailUrl: "https://picsum.photos/seed/rag-langchain/400/225",
        category: "AI",
        changeRate: 61.8,
        isMyInterest: false,
      },
      {
        rank: 5,
        id: "trend-week-5",
        title:
          "Monorepo Migration — 70% Faster Builds After Adopting Turborepo",
        translatedTitle:
          "모노레포 전환기 — Turborepo 도입 후 빌드 시간 70% 단축",
        sourceName: "oliveyoung_tech",
        tags: ["DevOps", "Monorepo"],
        viewCount: 4103,
        thumbnailUrl: null,
        category: "DevOps",
        changeRate: 9.2,
        isMyInterest: false,
      },
    ],
    topPostsSummary:
      "이번 주는 프론트엔드 생태계 비교 글과 Spring Boot + Kotlin 조합 글이 높은 조회수를 기록했습니다. 특히 AI/LLM 관련 실전 구현 글의 성장세가 두드러지며, RAG 시스템 구축 가이드가 빠르게 상위권에 진입했습니다. Kubernetes 로컬 환경 구성과 모노레포 전환 후기 등 인프라·DevOps 분야도 꾸준한 관심을 받고 있습니다.",
    collectionSummary:
      "이번 주 총 312개의 새로운 콘텐츠가 수집되었습니다. Velog 출처가 38%로 가장 많았으며, Naver D2와 Kakao Tech 블로그의 심층 기술 글이 고르게 수집되었습니다. AI·DevOps 분야 콘텐츠가 전주 대비 23% 증가했으며, Rust와 Go 관련 글도 꾸준히 유입되고 있습니다.",
    trendingTags: [
      { rank: 1, keyword: "React", count: 841, state: "up", rankChange: 2 },
      {
        rank: 2,
        keyword: "TypeScript",
        count: 762,
        state: "same",
        rankChange: 0,
      },
      { rank: 3, keyword: "Next.js", count: 695, state: "up", rankChange: 1 },
      { rank: 4, keyword: "AI", count: 643, state: "up", rankChange: 4 },
      { rank: 5, keyword: "Docker", count: 521, state: "down", rankChange: 1 },
      {
        rank: 6,
        keyword: "Kubernetes",
        count: 482,
        state: "new",
        rankChange: 0,
      },
      { rank: 7, keyword: "Python", count: 438, state: "up", rankChange: 3 },
      { rank: 8, keyword: "Spring", count: 401, state: "down", rankChange: 2 },
      { rank: 9, keyword: "AWS", count: 378, state: "up", rankChange: 1 },
      { rank: 10, keyword: "LLM", count: 325, state: "new", rankChange: 0 },
      { rank: 11, keyword: "Kotlin", count: 287, state: "same", rankChange: 0 },
      { rank: 12, keyword: "Monorepo", count: 241, state: "up", rankChange: 2 },
      {
        rank: 13,
        keyword: "PostgreSQL",
        count: 198,
        state: "down",
        rankChange: 3,
      },
      { rank: 14, keyword: "Redis", count: 154, state: "same", rankChange: 0 },
      {
        rank: 15,
        keyword: "GraphQL",
        count: 121,
        state: "down",
        rankChange: 1,
      },
    ],
  },

  monthly: {
    unit: "monthly",
    periodStart: "2026-04-01",
    periodEnd: "2026-04-28",
    dateLabel: "4월",
    topPosts: [
      {
        rank: 1,
        id: "trend-month-1",
        title:
          "AI Coding Assistant in Practice — How We Doubled Team Productivity",
        translatedTitle:
          "AI 코딩 어시스턴트 실전 도입기 — 팀 생산성 2배 올린 방법",
        sourceName: "naver_d2",
        tags: ["AI", "DevOps"],
        viewCount: 52341,
        thumbnailUrl: "https://picsum.photos/seed/ai-coding-assistant/400/225",
        category: "AI",
        changeRate: 89.3,
        isMyInterest: false,
      },
      {
        rank: 2,
        id: "trend-month-2",
        title: "Mastering Next.js 16 App Router Migration",
        translatedTitle: "Next.js 16 App Router 실전 마이그레이션 완전 정복",
        sourceName: "kakao_tech",
        tags: ["Next.js", "React"],
        viewCount: 41827,
        thumbnailUrl: null,
        category: "Frontend",
        changeRate: 27.4,
        isMyInterest: false,
      },
      {
        rank: 3,
        id: "trend-month-3",
        title: "3 Years of MSA Migration — What Worked and What Failed",
        translatedTitle: "MSA 전환 3년 후기 — 잘한 것과 실패한 것",
        sourceName: "우아한형제들",
        tags: ["MSA", "Backend"],
        viewCount: 38452,
        thumbnailUrl: "https://picsum.photos/seed/msa-migration/400/225",
        category: "Backend",
        changeRate: -8.6,
        isMyInterest: false,
      },
      {
        rank: 4,
        id: "trend-month-4",
        title: "Mastering Python asyncio — Everything About Async Programming",
        translatedTitle:
          "Python asyncio 완전 정복 — 비동기 프로그래밍의 모든 것",
        sourceName: "velog",
        tags: ["Python", "Async"],
        viewCount: 29873,
        thumbnailUrl: null,
        category: "Backend",
        changeRate: 11.2,
        isMyInterest: false,
      },
      {
        rank: 5,
        id: "trend-month-5",
        title: "Cloud Cost Optimization — How We Cut AWS Bills by 50%",
        translatedTitle: "클라우드 비용 최적화 — AWS 청구서를 50% 줄인 방법",
        sourceName: "toss_tech",
        tags: ["AWS", "Cloud"],
        viewCount: 24561,
        thumbnailUrl: "https://picsum.photos/seed/cloud-cost-aws/400/225",
        category: "DevOps",
        changeRate: 43.7,
        isMyInterest: false,
      },
    ],
    topPostsSummary:
      "이번 달은 AI 코딩 어시스턴트 도입과 Next.js 마이그레이션 관련 글이 압도적인 조회수를 기록했습니다. MSA 전환 후기와 같은 실전 경험 글이 꾸준히 높은 관심을 받았으며, 클라우드 비용 최적화 주제가 새롭게 주목받고 있습니다. Python 비동기 프로그래밍 심층 가이드도 꾸준한 인기를 유지했습니다.",
    collectionSummary:
      "이번 달 총 1,284개의 새로운 콘텐츠가 수집되었습니다. AI/ML 분야 콘텐츠가 전월 대비 41% 급증하며 가장 빠른 성장세를 보였습니다. Next.js, TypeScript 관련 글은 꾸준한 생산량을 유지하고 있으며, Rust와 MLOps 분야 콘텐츠가 새롭게 증가하고 있습니다. 국내 기업 기술 블로그 출처 비율이 처음으로 45%를 넘었습니다.",
    trendingTags: [
      { rank: 1, keyword: "AI", count: 5241, state: "up", rankChange: 2 },
      { rank: 2, keyword: "React", count: 4827, state: "same", rankChange: 0 },
      { rank: 3, keyword: "Next.js", count: 4312, state: "up", rankChange: 1 },
      {
        rank: 4,
        keyword: "TypeScript",
        count: 3987,
        state: "up",
        rankChange: 1,
      },
      { rank: 5, keyword: "Docker", count: 3621, state: "down", rankChange: 1 },
      { rank: 6, keyword: "AWS", count: 3284, state: "up", rankChange: 2 },
      { rank: 7, keyword: "Python", count: 2951, state: "up", rankChange: 1 },
      {
        rank: 8,
        keyword: "Kubernetes",
        count: 2614,
        state: "new",
        rankChange: 0,
      },
      { rank: 9, keyword: "Spring", count: 2341, state: "down", rankChange: 3 },
      { rank: 10, keyword: "LLM", count: 2087, state: "up", rankChange: 5 },
      { rank: 11, keyword: "MLOps", count: 1854, state: "new", rankChange: 0 },
      { rank: 12, keyword: "Rust", count: 1621, state: "up", rankChange: 3 },
      {
        rank: 13,
        keyword: "GraphQL",
        count: 1387,
        state: "down",
        rankChange: 2,
      },
      { rank: 14, keyword: "Redis", count: 1154, state: "same", rankChange: 0 },
      {
        rank: 15,
        keyword: "PostgreSQL",
        count: 987,
        state: "down",
        rankChange: 1,
      },
      { rank: 16, keyword: "Kafka", count: 824, state: "up", rankChange: 2 },
      { rank: 17, keyword: "MSA", count: 741, state: "down", rankChange: 4 },
      { rank: 18, keyword: "Kotlin", count: 654, state: "same", rankChange: 0 },
      {
        rank: 19,
        keyword: "Flutter",
        count: 521,
        state: "down",
        rankChange: 2,
      },
      { rank: 20, keyword: "Svelte", count: 387, state: "up", rankChange: 1 },
    ],
  },
};

function getDayDateLabel(): string {
  const now = new Date();
  const month = now.getMonth() + 1;
  const day = now.getDate();
  return `${month}월 ${day}일`;
}

/** 탭 전환 시 로딩 상태가 보이도록 딜레이 포함 */
export async function fetchHomeTrend(unit: TrendRange): Promise<HomeTrendData> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  if (unit === "daily") {
    return { ...MOCK_HOME_TREND.daily, dateLabel: getDayDateLabel() };
  }
  return MOCK_HOME_TREND[unit];
}
