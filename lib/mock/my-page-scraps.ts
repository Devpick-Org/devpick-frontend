import type { MyPageScrap, MyPageScrapResponse } from "@/types/myPage";

export const MOCK_SCRAPS: MyPageScrap[] = [
  {
    contentId: "content-101",
    title: "React 19의 새로운 기능들: useActionState, useFormStatus 완벽 정리",
    sourceName: "medium",
    thumbnail: "https://picsum.photos/seed/scrap1/400/240",
    summary:
      "React 19에서 도입된 훅들과 Server Actions 통합 방식을 예제 코드와 함께 살펴봅니다.",
    createdAt: "2026-04-20T09:15:00Z",
  },
  {
    contentId: "content-102",
    title: "TypeScript 5.5 주요 변경사항 — infer 키워드 개선과 strictness 강화",
    sourceName: "naver_d2",
    thumbnail: "https://picsum.photos/seed/scrap2/400/240",
    summary:
      "TypeScript 5.5의 핵심 업데이트를 마이그레이션 관점에서 정리한 글입니다.",
    createdAt: "2026-04-18T14:30:00Z",
  },
  {
    contentId: "content-103",
    title:
      "Next.js App Router에서 Server Component와 Client Component 경계 설계하기",
    sourceName: "kakao_tech",
    thumbnail: "https://picsum.photos/seed/scrap3/400/240",
    summary: null,
    createdAt: "2026-04-15T11:00:00Z",
  },
  {
    contentId: "content-104",
    title: "PostgreSQL EXPLAIN ANALYZE 읽는 법 — 쿼리 최적화 실전 가이드",
    sourceName: "stack overflow",
    thumbnail: null,
    summary: "슬로우 쿼리를 분석하고 인덱스 전략을 수립하는 방법을 다룹니다.",
    createdAt: "2026-04-13T08:45:00Z",
  },
  {
    contentId: "content-105",
    title: "Docker Compose로 로컬 개발 환경 구성하기 — 실전 템플릿 공개",
    sourceName: "velog",
    thumbnail: "https://picsum.photos/seed/scrap5/400/240",
    summary: null,
    createdAt: "2026-04-10T16:20:00Z",
  },
  {
    contentId: "content-106",
    title: "REST API 설계 원칙 — 버저닝 전략과 에러 응답 포맷 표준화",
    sourceName: "medium",
    thumbnail: "https://picsum.photos/seed/scrap6/400/240",
    summary:
      "실무에서 자주 마주치는 API 설계 결정들을 사례 중심으로 설명합니다.",
    createdAt: "2026-04-08T10:00:00Z",
  },
  {
    contentId: "content-107",
    title: "Redis 캐싱 전략 비교 — Cache-Aside, Write-Through, Write-Behind",
    sourceName: "toss_tech",
    thumbnail: null,
    summary: null,
    createdAt: "2026-04-05T13:10:00Z",
  },
  {
    contentId: "content-108",
    title: "Zustand v5 마이그레이션 가이드 — 스토어 구조와 미들웨어 변경점",
    sourceName: "velog",
    thumbnail: "https://picsum.photos/seed/scrap8/400/240",
    summary:
      "Zustand v4에서 v5로 업그레이드할 때 꼭 확인해야 할 변경사항들을 정리했습니다.",
    createdAt: "2026-04-02T09:30:00Z",
  },
  {
    contentId: "content-109",
    title: "Tailwind CSS v4 마이그레이션 — @theme 토큰과 CSS 변수 전환",
    sourceName: "kakao_tech",
    thumbnail: "https://picsum.photos/seed/scrap9/400/240",
    summary:
      "v3에서 v4로 넘어갈 때 바뀐 설정 방식과 토큰 시스템을 정리합니다.",
    createdAt: "2026-03-30T10:00:00Z",
  },
  {
    contentId: "content-110",
    title: "Kubernetes 입문 — Pod, Service, Deployment 핵심 개념 정리",
    sourceName: "naver_d2",
    thumbnail: null,
    summary: "컨테이너 오케스트레이션의 핵심 리소스를 예제와 함께 설명합니다.",
    createdAt: "2026-03-27T14:00:00Z",
  },
  {
    contentId: "content-111",
    title: "웹 성능 최적화 — Core Web Vitals 개선 실전 사례",
    sourceName: "toss_tech",
    thumbnail: "https://picsum.photos/seed/scrap11/400/240",
    summary: "LCP, CLS, INP 지표를 실제 서비스에서 개선한 경험을 공유합니다.",
    createdAt: "2026-03-24T09:00:00Z",
  },
  {
    contentId: "content-112",
    title: "Git 브랜치 전략 — Trunk Based Development vs Git Flow 비교",
    sourceName: "medium",
    thumbnail: "https://picsum.photos/seed/scrap12/400/240",
    summary: null,
    createdAt: "2026-03-20T11:30:00Z",
  },
];

type FetchMyScrapsParams = {
  q?: string;
  sort?: "newest" | "oldest";
  page?: number;
  size?: number;
};

export async function fetchMyScraps(
  params?: FetchMyScrapsParams,
): Promise<MyPageScrapResponse> {
  await new Promise((resolve) => setTimeout(resolve, 400));

  const { q, sort = "newest", page = 0, size = 10 } = params ?? {};

  let processed = [...MOCK_SCRAPS];

  if (q) {
    const keyword = q.trim().toLowerCase();
    processed = processed.filter(
      (s) =>
        s.title.toLowerCase().includes(keyword) ||
        s.sourceName.toLowerCase().includes(keyword) ||
        (s.summary?.toLowerCase().includes(keyword) ?? false),
    );
  }

  processed.sort((a, b) => {
    const diff =
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    return sort === "newest" ? -diff : diff;
  });

  const totalElements = processed.length;
  const totalPages = Math.ceil(totalElements / size);
  const start = page * size;
  const content = processed.slice(start, start + size);

  return { content, page, size, totalElements, totalPages };
}

export async function fetchMyScrapsPreview(
  count = 4,
): Promise<MyPageScrapResponse> {
  return fetchMyScraps({ page: 0, size: count, sort: "newest" });
}
