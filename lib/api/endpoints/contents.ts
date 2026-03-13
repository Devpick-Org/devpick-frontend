import { apiClient } from "../client";
import {
  Content,
  ContentDetail,
  ContentDetailResponse,
  ContentFeedResponse,
} from "@/types/content";

const MOCK_ORIGINAL_CONTENT_WITH_CODE = `## 들어가며

React의 \`useEffect\`는 컴포넌트가 렌더링된 이후 사이드 이펙트를 처리하는 훅입니다. 하지만 의존성 배열을 잘못 관리하면 무한 루프, stale closure 같은 버그가 발생합니다. 이 글에서는 올바른 사용법과 흔한 실수를 코드로 살펴봅니다.

## 기본 구조

\`useEffect\`는 세 가지 형태로 사용됩니다.

\`\`\`tsx
// 1. 의존성 배열 없음 — 매 렌더링마다 실행
useEffect(() => {
  console.log("렌더링 후 항상 실행");
});

// 2. 빈 배열 — 마운트 시 1회만 실행
useEffect(() => {
  console.log("마운트 시 1회 실행");
}, []);

// 3. 의존성 지정 — 해당 값이 바뀔 때만 실행
useEffect(() => {
  console.log("count가 바뀔 때 실행:", count);
}, [count]);
\`\`\`

## stale closure 문제

의존성 배열에서 값을 빠뜨리면 클로저가 오래된 값을 참조하는 문제가 발생합니다.

\`\`\`tsx
// ❌ 잘못된 예: count가 의존성 배열에 없어서 항상 0을 출력
function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      console.log("현재 count:", count); // 항상 0
    }, 1000);
    return () => clearInterval(id);
  }, []); // count 누락

  return <button onClick={() => setCount(c => c + 1)}>{count}</button>;
}
\`\`\`

올바르게 고치려면 \`count\`를 의존성에 추가하거나, 함수형 업데이트를 사용합니다.

\`\`\`tsx
// ✅ 함수형 업데이트로 stale closure 회피
useEffect(() => {
  const id = setInterval(() => {
    setCount(prev => prev + 1); // prev는 항상 최신값
  }, 1000);
  return () => clearInterval(id);
}, []); // 의존성 없이도 안전
\`\`\`

## 클린업 함수

비동기 요청이나 구독을 등록할 때는 반드시 클린업을 작성해야 합니다.

\`\`\`tsx
useEffect(() => {
  let cancelled = false;

  async function fetchUser() {
    const data = await getUser(userId);
    if (!cancelled) {
      setUser(data); // 언마운트 후 setState 방지
    }
  }

  fetchUser();

  return () => {
    cancelled = true;
  };
}, [userId]);
\`\`\`

## 마치며

\`useEffect\`의 의존성 배열은 "이 값이 바뀌면 다시 실행해 달라"는 선언이지, 임의로 비워두거나 채우는 용도가 아닙니다. **eslint-plugin-react-hooks**의 \`exhaustive-deps\` 규칙을 활성화하면 누락된 의존성을 자동으로 잡아줍니다.`;

const MOCK_ORIGINAL_CONTENT = `## 들어가며

현대 소프트웨어 개발에서 이 개념은 점점 더 중요해지고 있습니다. 이 글에서는 핵심 원리부터 실전 활용법까지 단계적으로 살펴보겠습니다.

## 기본 개념 이해

가장 먼저 짚어야 할 것은 **기본 원리**입니다. 많은 개발자들이 표면적인 사용법만 익히고 넘어가다 보면 예상치 못한 버그를 만나게 됩니다.

핵심 포인트는 다음과 같습니다.

- 실행 순서와 타이밍을 정확히 이해해야 합니다
- 의존성과 사이드 이펙트를 명확히 구분하세요
- 메모리 누수 방지를 위한 클린업을 빠뜨리지 마세요

## 주요 패턴과 안티패턴

실무에서 자주 마주치는 패턴들을 정리해봤습니다.

### 올바른 패턴

1. 관심사를 명확히 분리하여 단일 책임 원칙을 지키세요
2. 재사용 가능한 추상화로 중복 코드를 줄이세요
3. 에러 처리를 항상 명시적으로 작성하세요

### 피해야 할 안티패턴

의존성을 무분별하게 늘리는 것은 **가장 흔한 실수** 중 하나입니다. 불필요한 의존성은 코드 복잡도를 높이고 테스트를 어렵게 만듭니다.

또한 암묵적인 전역 상태에 의존하면 컴포넌트 간 결합도가 높아져 유지보수가 어려워집니다.

## 실전 적용 체크리스트

코드 리뷰 전 반드시 확인해야 할 사항들입니다.

- 타입 안전성이 보장되는가?
- 에러 케이스가 모두 처리되는가?
- 불필요한 렌더링이나 재계산이 없는가?
- 테스트 코드가 동작을 충분히 커버하는가?

## 마치며

이 개념을 완전히 이해하면 복잡한 로직도 명확하게 표현할 수 있습니다. 공식 문서와 함께 직접 코드를 작성해보며 익혀두세요.`;

const MOCK_CONTENTS: Content[] = [
  {
    id: "content-001",
    title: "React useEffect 완전 정복: 의존성 배열부터 클린업까지",
    author: "김철수",
    sourceName: "Velog",
    preview:
      "useEffect는 컴포넌트가 렌더링된 후 사이드 이펙트를 처리하는 핵심 훅입니다. 의존성 배열을 잘못 설정하면 무한 루프나 stale closure 버그가 발생할 수 있습니다.",
    canonicalUrl: "https://velog.io/@kimcs/react-useeffect-deep-dive",
    tags: ["React", "Frontend", "Hooks"],
    publishedAt: "2026-03-10T09:00:00",
    isScrapped: false,
    isLiked: false,
    thumbnailUrl:
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=240&h=240&fit=crop",
  },
  {
    id: "content-002",
    title: "TypeScript 5.x 제네릭 패턴 실전 가이드",
    author: "이영희",
    sourceName: "Naver Blog",
    preview:
      "제네릭은 TypeScript의 강력한 타입 추론 기능을 극대화합니다. 조건부 타입, infer 키워드, 템플릿 리터럴 타입을 조합하면 런타임 오류를 컴파일 타임에 잡을 수 있습니다.",
    canonicalUrl: "https://blog.naver.com/yhlee/typescript-generics",
    tags: ["TypeScript", "Frontend"],
    publishedAt: "2026-03-10T08:30:00",
    isScrapped: true,
    isLiked: false,
    thumbnailUrl: null,
  },
  {
    id: "content-003",
    title:
      "Next.js 16 App Router: 서버 컴포넌트와 클라이언트 컴포넌트 경계 설계",
    author: "박민준",
    sourceName: "Velog",
    preview:
      "App Router에서는 'use client' 지시문을 기준으로 렌더링 경계가 나뉩니다. 서버 컴포넌트에서 데이터를 패칭하고 클라이언트 컴포넌트로 직렬화 가능한 props만 내려주는 패턴을 알아봅니다.",
    canonicalUrl: "https://velog.io/@pmj/nextjs-rsc-boundary",
    tags: ["Next.js", "React", "Frontend"],
    publishedAt: "2026-03-09T22:00:00",
    isScrapped: false,
    isLiked: true,
    thumbnailUrl:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=240&h=240&fit=crop",
  },
  {
    id: "content-004",
    title: "Spring Boot 3 + JPA 성능 최적화: N+1 문제 해결법",
    author: "최강훈",
    sourceName: "우아한형제들",
    preview:
      "N+1 문제는 연관 엔티티를 조회할 때 쿼리가 폭발적으로 증가하는 대표적인 성능 문제입니다. JPQL fetch join, EntityGraph, 배치 사이즈 설정을 통해 해결하는 방법을 정리했습니다.",
    canonicalUrl: "https://techblog.woowahan.com/spring-jpa-n-plus-one",
    tags: ["Spring", "Java", "Backend", "JPA"],
    publishedAt: "2026-03-09T18:00:00",
    isScrapped: false,
    isLiked: false,
    thumbnailUrl: null,
  },
  {
    id: "content-005",
    title: "Docker Compose로 로컬 개발 환경 완전 자동화하기",
    author: "정수아",
    sourceName: "Velog",
    preview:
      "여러 서비스가 얽힌 MSA 환경에서 로컬 개발 환경 구성은 까다롭습니다. Docker Compose의 healthcheck, depends_on, 볼륨 마운트를 활용해 원클릭 환경 구성을 구현해봤습니다.",
    canonicalUrl: "https://velog.io/@jsa/docker-compose-local-dev",
    tags: ["Docker", "DevOps", "Backend"],
    publishedAt: "2026-03-09T14:30:00",
    isScrapped: false,
    isLiked: true,
    thumbnailUrl:
      "https://images.unsplash.com/photo-1605745341112-85968b19335b?w=240&h=240&fit=crop",
  },
  {
    id: "content-006",
    title: "Zustand로 전역 상태 관리하기: Redux 없이도 충분한 이유",
    author: "한지우",
    sourceName: "Naver Blog",
    preview:
      "Redux의 보일러플레이트에 지쳐 Zustand로 전환했습니다. 슬라이스 패턴, 미들웨어, devtools 연동까지 실무에서 바로 쓸 수 있는 패턴을 소개합니다.",
    canonicalUrl: "https://blog.naver.com/hjw/zustand-vs-redux",
    tags: ["React", "Zustand", "Frontend", "상태관리"],
    publishedAt: "2026-03-09T11:00:00",
    isScrapped: true,
    isLiked: true,
    thumbnailUrl: null,
  },
  {
    id: "content-007",
    title: "PostgreSQL 인덱스 전략: 실행 계획 분석부터 복합 인덱스까지",
    author: "오병철",
    sourceName: "Velog",
    preview:
      "EXPLAIN ANALYZE 출력을 읽을 줄 알면 쿼리 최적화의 절반은 끝납니다. Sequential Scan이 Index Scan보다 빠른 경우와 복합 인덱스 컬럼 순서의 중요성을 실제 예시로 다룹니다.",
    canonicalUrl: "https://velog.io/@obc/postgresql-index-strategy",
    tags: ["PostgreSQL", "Database", "Backend"],
    publishedAt: "2026-03-08T20:00:00",
    isScrapped: false,
    isLiked: false,
    thumbnailUrl:
      "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=240&h=240&fit=crop",
  },
  {
    id: "content-008",
    title: "TanStack Query v5 완전 정복: 서버 상태 관리의 모든 것",
    author: "서지현",
    sourceName: "Velog",
    preview:
      "TanStack Query v5에서 변경된 API와 새로운 패턴을 정리했습니다. useQuery의 새 시그니처, useSuspenseQuery, 무한 스크롤을 위한 useInfiniteQuery 활용법을 코드와 함께 설명합니다.",
    canonicalUrl: "https://velog.io/@sjh/tanstack-query-v5",
    tags: ["React", "TanStack Query", "Frontend"],
    publishedAt: "2026-03-08T16:00:00",
    isScrapped: false,
    isLiked: true,
    thumbnailUrl: null,
  },
  {
    id: "content-009",
    title: "Redis를 활용한 세션 관리와 캐싱 전략",
    author: "임도현",
    sourceName: "Kakao Tech",
    preview:
      "Redis는 단순 캐시 저장소를 넘어 세션 관리, pub/sub, 분산 락 구현에도 활용됩니다. Spring Boot와 연동해 JWT 블랙리스트 관리와 API 응답 캐싱을 구현하는 방법을 소개합니다.",
    canonicalUrl: "https://techblog.kakao.com/redis-session-caching",
    tags: ["Redis", "Backend", "Spring"],
    publishedAt: "2026-03-08T10:00:00",
    isScrapped: false,
    isLiked: false,
    thumbnailUrl:
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=240&h=240&fit=crop",
  },
  {
    id: "content-010",
    title: "Tailwind CSS v4 마이그레이션 가이드: @theme 토큰 시스템 이해하기",
    author: "윤소연",
    sourceName: "Velog",
    preview:
      "Tailwind CSS v4는 CSS-first 설정으로 패러다임이 바뀌었습니다. tailwind.config.js 대신 globals.css의 @theme 블록에 디자인 토큰을 정의하는 방식과 마이그레이션 체크리스트를 공유합니다.",
    canonicalUrl: "https://velog.io/@ysy/tailwind-v4-migration",
    tags: ["Tailwind CSS", "Frontend", "CSS"],
    publishedAt: "2026-03-07T21:00:00",
    isScrapped: true,
    isLiked: false,
    thumbnailUrl: null,
  },
  {
    id: "content-011",
    title: "Git Flow vs Trunk Based Development: 팀 규모별 브랜치 전략 선택",
    author: "강태양",
    sourceName: "Naver Blog",
    preview:
      "Git Flow는 릴리즈 주기가 긴 팀에, Trunk Based Development는 CI/CD가 잘 갖춰진 팀에 어울립니다. 각 전략의 트레이드오프와 실제 적용 사례를 팀 규모별로 정리했습니다.",
    canonicalUrl: "https://blog.naver.com/kty/git-flow-vs-trunk",
    tags: ["Git", "DevOps", "협업"],
    publishedAt: "2026-03-07T15:00:00",
    isScrapped: false,
    isLiked: false,
    thumbnailUrl: null,
  },
  {
    id: "content-012",
    title: "Kotlin Coroutines 실전: Flow와 suspend 함수로 비동기 처리하기",
    author: "노지훈",
    sourceName: "Velog",
    preview:
      "Kotlin Coroutines의 Flow는 RxJava를 대체하는 강력한 비동기 스트림 처리 도구입니다. Cold Flow와 Hot Flow의 차이, StateFlow와 SharedFlow 선택 기준을 실무 예제로 설명합니다.",
    canonicalUrl: "https://velog.io/@njh/kotlin-coroutines-flow",
    tags: ["Kotlin", "Android", "Backend"],
    publishedAt: "2026-03-07T09:00:00",
    isScrapped: false,
    isLiked: true,
    thumbnailUrl: null,
  },
  {
    id: "content-013",
    title: "프론트엔드 번들 최적화: Webpack에서 Vite로, 그리고 그 너머",
    author: "문예진",
    sourceName: "Velog",
    preview:
      "번들 사이즈는 LCP에 직접적인 영향을 줍니다. Code Splitting, Tree Shaking, Dynamic Import를 활용한 최적화 전략과 번들 분석 도구(Rollup Analyzer, Bundle Buddy) 사용법을 정리했습니다.",
    canonicalUrl: "https://velog.io/@myj/frontend-bundle-optimization",
    tags: ["Frontend", "성능최적화", "Vite", "Webpack"],
    publishedAt: "2026-03-06T19:00:00",
    isScrapped: false,
    isLiked: false,
    thumbnailUrl: null,
  },
  {
    id: "content-014",
    title: "MSA 환경에서의 API Gateway 패턴: Spring Cloud Gateway 실전",
    author: "배성호",
    sourceName: "Naver D2",
    preview:
      "API Gateway는 인증, 라우팅, 로드밸런싱, 서킷 브레이커를 단일 진입점에서 처리합니다. Spring Cloud Gateway로 JWT 필터와 동적 라우팅을 구현하는 과정을 단계별로 소개합니다.",
    canonicalUrl: "https://techblog.naver.com/spring-cloud-gateway",
    tags: ["Spring", "MSA", "Backend", "Java"],
    publishedAt: "2026-03-06T14:00:00",
    isScrapped: true,
    isLiked: false,
    thumbnailUrl: null,
  },
  {
    id: "content-015",
    title: "CSS Grid와 Flexbox 완벽 조합: 복잡한 레이아웃 구현 전략",
    author: "조하은",
    sourceName: "Velog",
    preview:
      "Grid는 2차원 레이아웃에, Flexbox는 1차원 정렬에 최적화돼 있습니다. 대시보드, 카드 그리드, 사이드바 레이아웃을 Grid와 Flexbox를 조합해 구현하는 패턴과 반응형 처리를 다룹니다.",
    canonicalUrl: "https://velog.io/@jhe/css-grid-flexbox-layout",
    tags: ["CSS", "Frontend", "레이아웃"],
    publishedAt: "2026-03-06T10:00:00",
    isScrapped: false,
    isLiked: true,
    thumbnailUrl: null,
  },
  {
    id: "content-016",
    title: "Jest + React Testing Library로 컴포넌트 테스트 작성하기",
    author: "신동우",
    sourceName: "Velog",
    preview:
      "좋은 테스트는 구현이 아닌 동작을 검증합니다. RTL의 쿼리 우선순위(getByRole > getByText > getByTestId), userEvent와 fireEvent의 차이, MSW로 API 모킹하는 방법을 정리했습니다.",
    canonicalUrl: "https://velog.io/@sdw/jest-rtl-component-testing",
    tags: ["React", "Testing", "Jest", "Frontend"],
    publishedAt: "2026-03-05T18:00:00",
    isScrapped: false,
    isLiked: false,
    thumbnailUrl: null,
  },
  {
    id: "content-017",
    title: "Kubernetes 입문: Pod, Deployment, Service 핵심 개념 정리",
    author: "황민서",
    sourceName: "Naver Blog",
    preview:
      "쿠버네티스는 컨테이너 오케스트레이션의 사실상 표준입니다. Pod 라이프사이클, ReplicaSet과 Deployment의 차이, ClusterIP/NodePort/LoadBalancer 서비스 타입을 실습과 함께 설명합니다.",
    canonicalUrl: "https://blog.naver.com/hms/kubernetes-beginner",
    tags: ["Kubernetes", "DevOps", "Docker"],
    publishedAt: "2026-03-05T13:00:00",
    isScrapped: false,
    isLiked: true,
    thumbnailUrl: null,
  },
  {
    id: "content-018",
    title: "웹 접근성(A11y) 실전: ARIA 속성과 키보드 네비게이션 구현",
    author: "류채원",
    sourceName: "Velog",
    preview:
      "접근성은 장애인만을 위한 것이 아닙니다. WCAG 2.1 기준으로 ARIA role/label 속성을 적용하고, focus trap과 키보드 네비게이션을 구현해 모든 사용자가 쾌적하게 사용할 수 있는 UI를 만드는 방법을 소개합니다.",
    canonicalUrl: "https://velog.io/@rcw/web-accessibility-aria",
    tags: ["Frontend", "접근성", "A11y", "HTML"],
    publishedAt: "2026-03-05T09:00:00",
    isScrapped: true,
    isLiked: false,
    thumbnailUrl: null,
  },
  {
    id: "content-019",
    title: "GraphQL vs REST: 실무에서 선택 기준과 도입 후기",
    author: "송재원",
    sourceName: "Kakao Tech",
    preview:
      "GraphQL의 over-fetching/under-fetching 해결은 매력적이지만 캐싱, 파일 업로드, 복잡한 인증 처리에서 REST보다 까다롭습니다. 1년간 GraphQL을 운영하며 얻은 교훈과 REST와의 하이브리드 전략을 공유합니다.",
    canonicalUrl: "https://techblog.kakao.com/graphql-vs-rest-experience",
    tags: ["GraphQL", "REST", "Backend", "API"],
    publishedAt: "2026-03-04T20:00:00",
    isScrapped: false,
    isLiked: false,
    thumbnailUrl: null,
  },
  {
    id: "content-020",
    title: "클린 아키텍처 실전 적용: 의존성 역전으로 테스트 가능한 코드 만들기",
    author: "천보람",
    sourceName: "Velog",
    preview:
      "클린 아키텍처의 핵심은 의존성 방향을 안쪽(도메인)으로만 흐르게 하는 것입니다. 인터페이스를 통한 의존성 역전, 유스케이스 레이어 설계, Spring에서의 구체적인 패키지 구조를 예제 코드와 함께 설명합니다.",
    canonicalUrl: "https://velog.io/@cbr/clean-architecture-spring",
    tags: ["아키텍처", "Backend", "Spring", "Java"],
    publishedAt: "2026-03-04T15:00:00",
    isScrapped: false,
    isLiked: true,
    thumbnailUrl: null,
  },
];

export const contentsEndpoints = {
  /** GET /contents — 개인화 피드 목록 (params: { page: number; size: number }) */
  getContents: (params: {
    page: number;
    size: number;
  }): Promise<ContentFeedResponse> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const start = params.page * params.size;
        const end = start + params.size;
        const pagedContents = MOCK_CONTENTS.slice(start, end);
        resolve({
          success: true,
          data: {
            contents: pagedContents,
            page: params.page,
            size: params.size,
            totalElements: MOCK_CONTENTS.length,
            totalPages: Math.ceil(MOCK_CONTENTS.length / params.size),
          },
          message: "피드를 불러왔습니다",
        });
      }, 1000);
    });
  },

  /** GET /contents/:contentId — 글 상세 */
  getContentById: (id: string): Promise<ContentDetailResponse> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const base = MOCK_CONTENTS.find((c) => c.id === id);
        if (!base) {
          reject(new Error("콘텐츠를 찾을 수 없습니다"));
          return;
        }
        const detail: ContentDetail = {
          ...base,
          originalContent:
            id === "content-001"
              ? MOCK_ORIGINAL_CONTENT_WITH_CODE
              : MOCK_ORIGINAL_CONTENT,
          isOriginalVisible: true,
          licenseType: "CC BY",
        };
        resolve({
          success: true,
          data: detail,
          message: "요청이 성공했습니다",
        });
      }, 800);
    });
  },

  /** GET /contents/:contentId/recommendations — 추천 콘텐츠 */
  getContentRecommendations: (
    contentId: string,
    size = 5,
  ): Promise<ContentFeedResponse> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const items = MOCK_CONTENTS.filter((c) => c.id !== contentId).slice(
          0,
          size,
        );
        resolve({
          success: true,
          data: {
            contents: items,
            page: 0,
            size,
            totalElements: items.length,
            totalPages: 1,
          },
          message: "추천 콘텐츠를 불러왔습니다",
        });
      }, 600);
    });
  },

  /** GET /contents/search — 글 검색 (query: string) */
  // searchContents: () => {
  //   throw new Error("Not implemented");
  //   return apiClient.get("/contents/search");
  // },
  searchContents: (params: {
    query: string;
    tags?: string[];
    page: number;
    size: number;
  }): Promise<ContentFeedResponse> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const normalizedQuery = params.query.trim().toLowerCase();

        const filteredContents = MOCK_CONTENTS.filter((content) => {
          const matchesQuery =
            normalizedQuery.length === 0 ||
            content.title.toLowerCase().includes(normalizedQuery) ||
            content.preview.toLowerCase().includes(normalizedQuery) ||
            content.author.toLowerCase().includes(normalizedQuery) ||
            content.tags.some((tag) =>
              tag.toLowerCase().includes(normalizedQuery),
            );

          const matchesTags =
            !params.tags ||
            params.tags.length === 0 ||
            params.tags.some((selectedTag) =>
              content.tags.includes(selectedTag),
            );

          return matchesQuery && matchesTags;
        });

        const start = params.page * params.size;
        const end = start + params.size;
        const pagedContents = filteredContents.slice(start, end);

        resolve({
          success: true,
          data: {
            contents: pagedContents,
            page: params.page,
            size: params.size,
            totalElements: filteredContents.length,
            totalPages: Math.ceil(filteredContents.length / params.size),
          },
          message: "검색 결과를 불러왔습니다",
        });
      }, 1000);
    });
  },

  /** POST /contents/:contentId/scrap — 스크랩 (contentId: number) */
  scrapContent: () => {
    throw new Error("Not implemented");
    return apiClient.post("/contents/0/scrap");
  },

  /** DELETE /contents/:contentId/scrap — 스크랩 취소 (contentId: number) */
  unscrapContent: () => {
    throw new Error("Not implemented");
    return apiClient.delete("/contents/0/scrap");
  },

  /** POST /contents/:contentId/like — 좋아요 (contentId: number) */
  likeContent: () => {
    throw new Error("Not implemented");
    return apiClient.post("/contents/0/like");
  },

  /** DELETE /contents/:contentId/like — 좋아요 취소 (contentId: number) */
  unlikeContent: () => {
    throw new Error("Not implemented");
    return apiClient.delete("/contents/0/like");
  },
};
