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
];

export async function fetchRecommendHomePosts(
  count = 4,
): Promise<MyPageRecommendHomePost[]> {
  await new Promise((resolve) => setTimeout(resolve, 400));
  return MOCK_RECOMMEND_HOME_POSTS.slice(0, count);
}
