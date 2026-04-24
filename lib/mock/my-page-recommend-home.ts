import type { MyPageRecommendHomePost } from "@/types/myPage";

export const MOCK_RECOMMEND_HOME_POSTS: MyPageRecommendHomePost[] = [
  {
    contentId: "content-301",
    title: "React 서버 컴포넌트 완전 정복 — 렌더링 모델과 캐싱 전략",
    sourceName: "velog",
    thumbnail: "https://picsum.photos/seed/rec1/400/240",
    summary: "RSC의 렌더링 흐름과 fetch 캐싱 옵션을 심층 분석합니다.",
    date: "2026-04-20T10:00:00Z",
  },
  {
    contentId: "content-302",
    title: "TypeScript satisfies 연산자 — 타입 추론을 유지하면서 검증하기",
    sourceName: "kakao_tech",
    thumbnail: "https://picsum.photos/seed/rec2/400/240",
    summary: "as와 satisfies의 차이점과 실전 활용 패턴을 정리합니다.",
    date: "2026-04-18T09:00:00Z",
  },
  {
    contentId: "content-303",
    title: "모노레포 환경에서 Turborepo로 빌드 캐시 최적화하기",
    sourceName: "toss_tech",
    thumbnail: null,
    date: "2026-04-15T14:00:00Z",
  },
  {
    contentId: "content-304",
    title: "PostgreSQL 파티셔닝 전략 — 대용량 테이블 성능 개선 실전 사례",
    sourceName: "naver_d2",
    thumbnail: "https://picsum.photos/seed/rec4/400/240",
    summary: "레인지/리스트/해시 파티셔닝을 실제 서비스 케이스에 적용한 경험을 공유합니다.",
    date: "2026-04-13T11:00:00Z",
  },
  {
    contentId: "content-305",
    title: "Jest + React Testing Library로 컴포넌트 테스트 작성하기",
    sourceName: "medium",
    thumbnail: "https://picsum.photos/seed/rec5/400/240",
    summary: "단위 테스트부터 인터랙션 테스트까지 실전 패턴을 다룹니다.",
    date: "2026-04-11T09:00:00Z",
  },
  {
    contentId: "content-306",
    title: "Spring Boot 3 마이그레이션 가이드 — Jakarta EE 전환과 주요 변경점",
    sourceName: "kakao_tech",
    thumbnail: null,
    summary: "Spring Boot 2에서 3으로 업그레이드할 때 반드시 확인해야 할 사항들을 정리합니다.",
    date: "2026-04-09T14:00:00Z",
  },
  {
    contentId: "content-307",
    title: "AWS Lambda + API Gateway로 서버리스 백엔드 구축하기",
    sourceName: "velog",
    thumbnail: "https://picsum.photos/seed/rec7/400/240",
    date: "2026-04-07T10:00:00Z",
  },
  {
    contentId: "content-308",
    title: "Tailwind CSS v4 완전 가이드 — @theme 토큰과 CSS 변수 전환",
    sourceName: "toss_tech",
    thumbnail: "https://picsum.photos/seed/rec8/400/240",
    summary: "v3에서 v4로 마이그레이션하는 방법과 새 토큰 시스템을 설명합니다.",
    date: "2026-04-05T11:00:00Z",
  },
  {
    contentId: "content-309",
    title: "CI/CD 파이프라인 구축 — GitHub Actions로 자동 배포 환경 만들기",
    sourceName: "naver_d2",
    thumbnail: null,
    summary: "테스트, 빌드, 배포를 자동화하는 전체 워크플로우를 구성하는 방법을 소개합니다.",
    date: "2026-04-03T09:00:00Z",
  },
  {
    contentId: "content-310",
    title: "웹 접근성 A11y 실천 가이드 — WCAG 2.1 기준으로 코드 개선하기",
    sourceName: "medium",
    thumbnail: "https://picsum.photos/seed/rec10/400/240",
    date: "2026-04-01T13:00:00Z",
  },
  {
    contentId: "content-311",
    title: "Storybook 8 업데이트 — CSF3 형식과 Play function 실전 활용",
    sourceName: "kakao_tech",
    thumbnail: "https://picsum.photos/seed/rec11/400/240",
    summary: "Storybook 최신 버전의 핵심 변경점과 인터랙션 테스트 작성법을 살펴봅니다.",
    date: "2026-03-30T10:00:00Z",
  },
  {
    contentId: "content-312",
    title: "OpenTelemetry로 분산 추적 구현하기 — 마이크로서비스 관찰 가능성 확보",
    sourceName: "toss_tech",
    thumbnail: null,
    date: "2026-03-27T14:00:00Z",
  },
];

export async function fetchRecommendHomePosts(
  count?: number,
): Promise<MyPageRecommendHomePost[]> {
  await new Promise((resolve) => setTimeout(resolve, 400));
  return count !== undefined
    ? MOCK_RECOMMEND_HOME_POSTS.slice(0, count)
    : MOCK_RECOMMEND_HOME_POSTS;
}
