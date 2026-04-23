import type { SearchResultItem } from "@/types/search";

const MOCK_SEARCH_RESULTS: SearchResultItem[] = [
  {
    id: "sr-001",
    title: "React 19 새로운 기능 완전 정복 — use, Server Actions, 그리고 더",
    sourceName: "velog",
    publishedAt: "2026-04-20",
    thumbnailUrl: "https://picsum.photos/seed/react19/400/225",
    summary:
      "React 19에서 도입된 use 훅, Server Actions, 향상된 에러 처리 등 주요 변경 사항을 코드 예제와 함께 정리했습니다. 기존 코드베이스에서의 마이그레이션 포인트도 함께 안내합니다.",
    tags: ["React", "Frontend", "JavaScript"],
    url: "/home/sr-001",
  },
  {
    id: "sr-002",
    title: "TypeScript 제네릭 완벽 가이드 — 실무에서 쓰는 패턴 10가지",
    sourceName: "toss_tech",
    publishedAt: "2026-04-18",
    thumbnailUrl: null,
    summary:
      "TypeScript 제네릭을 실무에서 어떻게 활용하는지 10가지 패턴으로 정리했습니다. 조건부 타입, 매핑 타입, infer 키워드 등을 예제 중심으로 설명합니다.",
    tags: ["TypeScript", "Frontend"],
    url: "/home/sr-002",
  },
  {
    id: "sr-003",
    title: "Next.js App Router 완전 정복 — 서버 컴포넌트부터 캐싱 전략까지",
    sourceName: "naver_d2",
    publishedAt: "2026-04-15",
    thumbnailUrl: "https://picsum.photos/seed/nextjs-app/400/225",
    summary:
      "Next.js 13 이후 도입된 App Router의 핵심 개념을 정리합니다. 서버·클라이언트 컴포넌트 경계, fetch 캐싱, revalidate 전략을 실전 예제로 살펴봅니다.",
    tags: ["Next.js", "React", "Frontend"],
    url: "/home/sr-003",
  },
  {
    id: "sr-004",
    title: "Docker Compose로 로컬 개발 환경 완전 자동화하기",
    sourceName: "kakao_tech",
    publishedAt: "2026-04-13",
    thumbnailUrl: "https://picsum.photos/seed/docker-compose/400/225",
    summary:
      "Docker Compose를 활용해 DB, 캐시, 백엔드 서버를 포함한 로컬 개발 환경을 한 번에 구성하는 방법을 안내합니다. 볼륨 마운트, 네트워크 설정, healthcheck 활용법도 포함합니다.",
    tags: ["Docker", "DevOps", "Backend"],
    url: "/home/sr-004",
  },
  {
    id: "sr-005",
    title: "AWS S3 + CloudFront로 정적 사이트 배포 자동화 완전 가이드",
    sourceName: "velog",
    publishedAt: "2026-04-12",
    thumbnailUrl: null,
    summary:
      "AWS S3와 CloudFront를 이용한 정적 사이트 배포 파이프라인 구성 방법을 설명합니다. GitHub Actions와 연동한 CI/CD 자동화까지 단계별로 설명합니다.",
    tags: ["AWS", "DevOps", "CI/CD"],
    url: "/home/sr-005",
  },
  {
    id: "sr-006",
    title: "Spring Boot + JPA 성능 최적화 — N+1 문제부터 쿼리 튜닝까지",
    sourceName: "우아한형제들",
    publishedAt: "2026-04-10",
    thumbnailUrl: "https://picsum.photos/seed/spring-jpa/400/225",
    summary:
      "Spring Boot와 JPA를 사용할 때 자주 마주치는 N+1 문제와 쿼리 성능 이슈를 실제 사례와 함께 분석하고 해결책을 제시합니다. Fetch Join, EntityGraph, 배치 사이즈 설정 등 다양한 최적화 기법을 다룹니다.",
    tags: ["Spring", "JPA", "Backend", "Java"],
    url: "/home/sr-006",
  },
  {
    id: "sr-007",
    title: "Kubernetes 입문 — Pod부터 Deployment, Service까지 한 번에 이해하기",
    sourceName: "naver_d2",
    publishedAt: "2026-04-09",
    thumbnailUrl: null,
    summary:
      "Kubernetes의 핵심 개념인 Pod, Deployment, Service, Ingress를 예제 YAML과 함께 설명합니다. 로컬 minikube 환경에서 직접 따라하며 배울 수 있도록 구성했습니다.",
    tags: ["Kubernetes", "DevOps", "Docker"],
    url: "/home/sr-007",
  },
  {
    id: "sr-008",
    title: "Python asyncio 실전 — 비동기 크롤러 직접 만들어보기",
    sourceName: "velog",
    publishedAt: "2026-04-08",
    thumbnailUrl: "https://picsum.photos/seed/python-async/400/225",
    summary:
      "Python asyncio를 활용해 비동기 웹 크롤러를 직접 구현해보는 튜토리얼입니다. aiohttp, asyncio.gather, 세마포어를 활용한 동시성 제어까지 실전 코드로 설명합니다.",
    tags: ["Python", "Async", "Backend"],
    url: "/home/sr-008",
  },
  {
    id: "sr-009",
    title: "Redis 캐싱 전략 총정리 — Cache-Aside, Write-Through, TTL 설계",
    sourceName: "kakao_tech",
    publishedAt: "2026-04-07",
    thumbnailUrl: null,
    summary:
      "실무에서 Redis를 활용한 캐싱 전략을 패턴별로 정리합니다. Cache-Aside, Write-Through, Read-Through의 장단점과 TTL 설계 원칙, 캐시 스탬피드 방지 기법을 다룹니다.",
    tags: ["Redis", "Backend", "Architecture"],
    url: "/home/sr-009",
  },
  {
    id: "sr-010",
    title: "GraphQL vs REST — 실무 프로젝트에서 선택 기준과 트레이드오프",
    sourceName: "toss_tech",
    publishedAt: "2026-04-06",
    thumbnailUrl: "https://picsum.photos/seed/graphql-rest/400/225",
    summary:
      "GraphQL과 REST API의 실무 적용 사례를 바탕으로 각각의 장단점과 선택 기준을 정리합니다. 오버페칭, 언더페칭, 타입 안전성, 클라이언트 복잡도 등을 비교합니다.",
    tags: ["GraphQL", "REST", "API", "Backend"],
    url: "/home/sr-010",
  },
  {
    id: "sr-011",
    title: "Tailwind CSS v4 마이그레이션 실전 — 변경점과 주의사항 정리",
    sourceName: "velog",
    publishedAt: "2026-04-05",
    thumbnailUrl: null,
    summary:
      "Tailwind CSS v3에서 v4로 마이그레이션할 때 반드시 확인해야 할 변경 사항을 정리했습니다. @theme 블록, CSS 변수 방식, 플러그인 API 변화 등을 실제 마이그레이션 경험을 바탕으로 설명합니다.",
    tags: ["Tailwind", "CSS", "Frontend"],
    url: "/home/sr-011",
  },
  {
    id: "sr-012",
    title: "LLM 기반 RAG 시스템 구축 — LangChain + Pinecone 실전 튜토리얼",
    sourceName: "oliveyoung_tech",
    publishedAt: "2026-04-04",
    thumbnailUrl: "https://picsum.photos/seed/llm-rag/400/225",
    summary:
      "LangChain과 Pinecone 벡터 DB를 활용해 사내 문서 기반 RAG 시스템을 구축하는 과정을 단계별로 설명합니다. 임베딩, 청크 전략, 리트리버 설정까지 실전 코드로 구현합니다.",
    tags: ["LLM", "AI", "Python", "RAG"],
    url: "/home/sr-012",
  },
  {
    id: "sr-013",
    title: "Kotlin 코루틴 완전 정복 — 실무에서 자주 쓰는 패턴 모음",
    sourceName: "우아한형제들",
    publishedAt: "2026-04-03",
    thumbnailUrl: null,
    summary:
      "Kotlin 코루틴의 핵심 개념인 suspend, CoroutineScope, Dispatcher를 정리하고 실무에서 자주 사용하는 패턴을 코드 예제와 함께 소개합니다. 에러 처리, 취소, 타임아웃 처리도 포함합니다.",
    tags: ["Kotlin", "Coroutine", "Backend", "Android"],
    url: "/home/sr-013",
  },
  {
    id: "sr-014",
    title: "PostgreSQL 인덱스 전략 — 실행 계획 분석으로 쿼리 10배 빠르게",
    sourceName: "kakao_tech",
    publishedAt: "2026-04-02",
    thumbnailUrl: "https://picsum.photos/seed/postgres-index/400/225",
    summary:
      "PostgreSQL EXPLAIN ANALYZE를 활용해 느린 쿼리의 원인을 찾고 인덱스로 개선하는 방법을 실제 사례 중심으로 설명합니다. 복합 인덱스, 부분 인덱스, 커버링 인덱스의 활용법도 다룹니다.",
    tags: ["PostgreSQL", "DB", "Backend"],
    url: "/home/sr-014",
  },
  {
    id: "sr-015",
    title: "Zustand로 React 전역 상태 관리하기 — Context API 대비 장단점",
    sourceName: "velog",
    publishedAt: "2026-04-01",
    thumbnailUrl: null,
    summary:
      "Zustand를 사용해 React 애플리케이션의 전역 상태를 관리하는 방법을 소개합니다. Context API, Redux와의 비교를 통해 Zustand의 장단점을 파악하고, 실무 패턴을 코드와 함께 설명합니다.",
    tags: ["React", "Zustand", "Frontend", "State"],
    url: "/home/sr-015",
  },
  {
    id: "sr-016",
    title: "Why is my JavaScript async function not returning the expected value?",
    sourceName: "stack overflow",
    publishedAt: "2026-03-30",
    thumbnailUrl: null,
    summary:
      "A deep dive into how async/await works under the hood and why returning a value from an async function always wraps it in a Promise. Top-voted answers explain the event loop and common pitfalls.",
    tags: ["JavaScript", "Async", "Frontend"],
    url: "/home/sr-016",
  },
  {
    id: "sr-017",
    title: "The Pragmatic Engineer's Guide to System Design in 2026",
    sourceName: "medium",
    publishedAt: "2026-03-28",
    thumbnailUrl: null,
    summary:
      "A practical walkthrough of system design principles covering scalability, availability, and consistency trade-offs. Includes real-world examples from distributed systems at scale.",
    tags: ["SystemDesign", "Backend", "Architecture"],
    url: "/home/sr-017",
  },
];

export function searchMockResults(query: string): SearchResultItem[] {
  const q = query.toLowerCase().trim();

  return MOCK_SEARCH_RESULTS.filter((item) => {
    const target =
      `${item.title} ${item.summary} ${item.tags.join(" ")}`.toLowerCase();

    return target.includes(q);
  }).sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}
