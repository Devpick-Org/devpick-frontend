import type {
  HistoryItem,
  HistoryPageResponse,
  ActivityItem,
  ActivityPageResponse,
  HistoryParams,
} from "@/types/history";

// ── 기본 mock 데이터 ──────────────────────────────────────────────────────────
// TODO: 실제 API 연동 시 아래 데이터는 /history API 응답으로 교체 예정

const MOCK_HISTORY_ITEMS: HistoryItem[] = [
  // ── 오늘 (2026-03-21) ──────────────────────────────────────────────────────
  {
    id: "h-001",
    actionType: "content_opened",
    content: {
      id: "c-001",
      title: "React useEffect 완전 정복",
      preview:
        "useEffect는 컴포넌트가 렌더링된 후 실행되는 사이드 이펙트를 처리하는 훅입니다.",
    },
    post: null,
    createdAt: "2026-03-21T10:30:00.000Z",
  },
  {
    id: "h-002",
    actionType: "ai_summary_viewed",
    content: {
      id: "c-001",
      title: "React useEffect 완전 정복",
      preview:
        "useEffect는 컴포넌트가 렌더링된 후 실행되는 사이드 이펙트를 처리하는 훅입니다.",
    },
    post: null,
    createdAt: "2026-03-21T10:35:00.000Z",
  },
  {
    id: "h-003",
    actionType: "scrapped",
    content: {
      id: "c-002",
      title: "Next.js App Router 데이터 패칭 전략",
      preview:
        "App Router에서는 서버 컴포넌트에서 데이터를 패칭하고 클라이언트에 전달하는 방식이 권장됩니다.",
    },
    post: null,
    createdAt: "2026-03-21T11:00:00.000Z",
  },
  {
    id: "h-004",
    actionType: "question_created",
    content: null,
    post: {
      id: "p-001",
      title:
        "Next.js에서 getServerSideProps와 서버 컴포넌트의 차이점이 무엇인가요?",
    },
    createdAt: "2026-03-21T11:30:00.000Z",
  },
  // ── 3일 전 (2026-03-18) ────────────────────────────────────────────────────
  {
    id: "h-005",
    actionType: "content_opened",
    content: {
      id: "c-003",
      title: "TypeScript 제네릭 완벽 가이드",
      preview:
        "제네릭을 사용하면 다양한 타입에 대해 재사용 가능한 컴포넌트를 작성할 수 있습니다.",
    },
    post: null,
    createdAt: "2026-03-18T14:00:00.000Z",
  },
  {
    id: "h-006",
    actionType: "ai_summary_viewed",
    content: {
      id: "c-003",
      title: "TypeScript 제네릭 완벽 가이드",
      // preview 없는 케이스 — preview optional 방어 처리 테스트용
    },
    post: null,
    createdAt: "2026-03-18T14:10:00.000Z",
  },
  {
    id: "h-007",
    actionType: "scrapped",
    content: {
      id: "c-004",
      title: "TanStack Query v5 마이그레이션 가이드",
      preview:
        "v5에서는 useQuery의 options 구조가 변경되었으며 isLoading 대신 isPending 사용을 권장합니다.",
    },
    post: null,
    createdAt: "2026-03-18T15:20:00.000Z",
  },
  // ── 10일 전 (2026-03-11) ───────────────────────────────────────────────────
  {
    id: "h-008",
    actionType: "content_opened",
    content: {
      id: "c-005",
      title: "CSS Grid vs Flexbox: 언제 무엇을 써야 할까?",
      preview:
        "Grid는 2차원 레이아웃에, Flexbox는 1차원 레이아웃에 적합합니다.",
    },
    post: null,
    createdAt: "2026-03-11T09:00:00.000Z",
  },
  {
    id: "h-009",
    actionType: "question_created",
    content: null,
    post: {
      id: "p-002",
      title: "Zustand와 Redux Toolkit 중 어떤 것을 선택해야 할까요?",
    },
    createdAt: "2026-03-11T10:45:00.000Z",
  },
  {
    id: "h-010",
    actionType: "scrapped",
    content: {
      id: "c-006",
      title: "Spring Boot 3.x + JPA 성능 최적화",
      preview:
        "N+1 문제 해결을 위한 fetch join과 batch size 설정 방법을 알아봅니다.",
    },
    post: null,
    createdAt: "2026-03-11T13:00:00.000Z",
  },
  // ── 20일 전 (2026-03-01) ───────────────────────────────────────────────────
  {
    id: "h-011",
    actionType: "content_opened",
    content: {
      id: "c-007",
      title: "Docker Compose로 로컬 개발 환경 구축하기",
      preview:
        "docker-compose.yml을 활용해 PostgreSQL, Redis, 애플리케이션을 한 번에 실행하는 방법입니다.",
    },
    post: null,
    createdAt: "2026-03-01T14:30:00.000Z",
  },
  {
    id: "h-012",
    actionType: "ai_summary_viewed",
    content: {
      id: "c-007",
      title: "Docker Compose로 로컬 개발 환경 구축하기",
      preview:
        "docker-compose.yml을 활용해 PostgreSQL, Redis, 애플리케이션을 한 번에 실행하는 방법입니다.",
    },
    post: null,
    createdAt: "2026-03-01T14:40:00.000Z",
  },
  {
    id: "h-013",
    actionType: "question_created",
    content: null,
    post: {
      id: "p-003",
      title: "JWT 토큰을 localStorage에 저장하면 안 되는 이유",
    },
    createdAt: "2026-03-01T16:00:00.000Z",
  },
  // ── 40일 전 (2026-02-10) ───────────────────────────────────────────────────
  {
    id: "h-014",
    actionType: "content_opened",
    content: {
      id: "c-008",
      title: "GitHub Actions CI/CD 파이프라인 구축 실전",
      preview:
        "PR 생성 시 자동으로 lint, test, build를 실행하는 워크플로우 작성 방법입니다.",
    },
    post: null,
    createdAt: "2026-02-10T11:00:00.000Z",
  },
  {
    id: "h-015",
    actionType: "scrapped",
    content: {
      id: "c-009",
      title: "Tailwind CSS v4 주요 변경사항 정리",
      preview:
        "@theme 지시어와 CSS 변수 기반 토큰 시스템으로 전환된 v4의 핵심 변경점입니다.",
    },
    post: null,
    createdAt: "2026-02-10T15:30:00.000Z",
  },
  // content, post 모두 null인 edge case — UI 방어 처리 테스트용
  {
    id: "h-016",
    actionType: "content_opened",
    content: null,
    post: null,
    createdAt: "2026-02-10T09:00:00.000Z",
  },
];

// ── Activity mock 데이터 ───────────────────────────────────────────────────────
// TODO: 실제 API 연동 시 /history/activity API 응답으로 교체 예정

const MOCK_ACTIVITY_ITEMS: ActivityItem[] = [
  // ── 오늘 (2026-03-21) ──────────────────────────────────────────────────────
  {
    id: "a-001",
    actionType: "content_liked",
    content: {
      id: "c-001",
      title: "React useEffect 완전 정복",
      preview: "useEffect는 컴포넌트가 렌더링된 후 실행되는 사이드 이펙트를 처리하는 훅입니다.",
    },
    post: null,
    createdAt: "2026-03-21T09:00:00.000Z",
  },
  {
    id: "a-002",
    actionType: "answer_written",
    content: null,
    post: {
      id: "p-001",
      title: "Next.js에서 getServerSideProps와 서버 컴포넌트의 차이점이 무엇인가요?",
    },
    createdAt: "2026-03-21T11:00:00.000Z",
  },
  {
    id: "a-003",
    actionType: "comment_created",
    content: null,
    post: {
      id: "p-002",
      title: "Zustand와 Redux Toolkit 중 어떤 것을 선택해야 할까요?",
    },
    createdAt: "2026-03-21T14:30:00.000Z",
  },
  // ── 3일 전 (2026-03-18) ────────────────────────────────────────────────────
  {
    id: "a-004",
    actionType: "content_liked",
    content: {
      id: "c-003",
      title: "TypeScript 제네릭 완벽 가이드",
      preview: "제네릭을 사용하면 다양한 타입에 대해 재사용 가능한 컴포넌트를 작성할 수 있습니다.",
    },
    post: null,
    createdAt: "2026-03-18T10:00:00.000Z",
  },
  {
    id: "a-005",
    actionType: "content_liked",
    content: {
      id: "c-004",
      title: "TanStack Query v5 마이그레이션 가이드",
      preview: "v5에서는 useQuery의 options 구조가 변경되었으며 isLoading 대신 isPending 사용을 권장합니다.",
    },
    post: null,
    createdAt: "2026-03-18T13:00:00.000Z",
  },
  {
    id: "a-006",
    actionType: "answer_written",
    content: null,
    post: {
      id: "p-003",
      title: "JWT 토큰을 localStorage에 저장하면 안 되는 이유",
    },
    createdAt: "2026-03-18T15:30:00.000Z",
  },
  // ── 10일 전 (2026-03-11) ───────────────────────────────────────────────────
  {
    id: "a-007",
    actionType: "content_liked",
    content: {
      id: "c-005",
      title: "CSS Grid vs Flexbox: 언제 무엇을 써야 할까?",
      preview: "Grid는 2차원 레이아웃에, Flexbox는 1차원 레이아웃에 적합합니다.",
    },
    post: null,
    createdAt: "2026-03-11T09:30:00.000Z",
  },
  {
    id: "a-008",
    actionType: "answer_written",
    content: null,
    post: {
      id: "p-002",
      title: "Zustand와 Redux Toolkit 중 어떤 것을 선택해야 할까요?",
    },
    createdAt: "2026-03-11T11:00:00.000Z",
  },
  {
    id: "a-009",
    actionType: "comment_created",
    content: null,
    post: {
      id: "p-001",
      title: "Next.js에서 getServerSideProps와 서버 컴포넌트의 차이점이 무엇인가요?",
    },
    createdAt: "2026-03-11T14:00:00.000Z",
  },
  // ── 20일 전 (2026-03-01) ───────────────────────────────────────────────────
  {
    id: "a-010",
    actionType: "content_liked",
    content: {
      id: "c-007",
      title: "Docker Compose로 로컬 개발 환경 구축하기",
      preview: "docker-compose.yml을 활용해 PostgreSQL, Redis, 애플리케이션을 한 번에 실행하는 방법입니다.",
    },
    post: null,
    createdAt: "2026-03-01T10:00:00.000Z",
  },
  {
    id: "a-011",
    actionType: "answer_written",
    content: null,
    post: {
      id: "p-004",
      title: "Spring Boot에서 N+1 문제를 해결하는 방법을 알려주세요",
    },
    createdAt: "2026-03-01T13:00:00.000Z",
  },
  {
    id: "a-012",
    actionType: "comment_created",
    content: null,
    post: {
      id: "p-003",
      title: "JWT 토큰을 localStorage에 저장하면 안 되는 이유",
    },
    createdAt: "2026-03-01T16:00:00.000Z",
  },
  // ── 40일 전 (2026-02-10) ───────────────────────────────────────────────────
  {
    id: "a-013",
    actionType: "content_liked",
    content: {
      id: "c-008",
      title: "GitHub Actions CI/CD 파이프라인 구축 실전",
      preview: "PR 생성 시 자동으로 lint, test, build를 실행하는 워크플로우 작성 방법입니다.",
    },
    post: null,
    createdAt: "2026-02-10T10:00:00.000Z",
  },
  {
    id: "a-014",
    actionType: "comment_created",
    content: null,
    post: {
      id: "p-002",
      title: "Zustand와 Redux Toolkit 중 어떤 것을 선택해야 할까요?",
    },
    createdAt: "2026-02-10T12:00:00.000Z",
  },
  // edge case: content + post 모두 null — UI 방어 처리 테스트용
  {
    id: "a-015",
    actionType: "answer_written",
    content: null,
    post: null,
    createdAt: "2026-02-10T15:00:00.000Z",
  },
];

// ── mock 함수들 ────────────────────────────────────────────────────────────────

export function mockGetActivityList(
  params: HistoryParams = {},
): Promise<ActivityPageResponse> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const page = params.page ?? 0;
      const size = params.size ?? 20;

      const sorted = [...MOCK_ACTIVITY_ITEMS].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
      const start = page * size;
      const items = sorted.slice(start, start + size);

      resolve({
        success: true,
        data: {
          items,
          page,
          size,
          totalElements: MOCK_ACTIVITY_ITEMS.length,
          totalPages: Math.ceil(MOCK_ACTIVITY_ITEMS.length / size),
        },
        message: "활동 내역을 불러왔습니다",
      });
    }, 500);
  });
}

export function mockGetHistoryList(
  params: HistoryParams = {},
): Promise<HistoryPageResponse> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const page = params.page ?? 0;
      const size = params.size ?? 20;

      // 최신순 정렬 후 페이지 slice
      const sorted = [...MOCK_HISTORY_ITEMS].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
      const start = page * size;
      const items = sorted.slice(start, start + size);

      resolve({
        success: true,
        data: {
          items,
          page,
          size,
          totalElements: MOCK_HISTORY_ITEMS.length,
          totalPages: Math.ceil(MOCK_HISTORY_ITEMS.length / size),
        },
        message: "학습 히스토리를 불러왔습니다",
      });
    }, 500);
  });
}
