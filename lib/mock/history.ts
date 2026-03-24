import type {
  HistoryItem,
  HistoryPageResponse,
  ActivityItem,
  ActivityPageResponse,
  HistoryParams,
  BadgeItem,
  BadgesResponse,
  PointsSummary,
  PointsSummaryResponse,
} from "@/types/history";

// ── 학습 히스토리 mock 데이터 ────────────────────────────────────────────────
// TODO: 실제 API 연동 시 GET /history?actionTypes=content_opened,ai_summary_viewed,scrapped,question_created 응답으로 교체
//
// createdAt 형식: "YYYY-MM-DDTHH:mm:ss" — timezone 없는 서버 로컬 시간(KST)
// 실제 백엔드 응답과 동일한 형식을 사용해 formatTime 등 파싱 함수 동작을 검증
//
// points 스펙:
//   content_opened: null  | ai_summary_viewed: 3  | question_created: 10
//   scrapped: 5           | content_liked: 2       | answer_written: 15
//   comment_created: null | daily_login: 1         | answer_adopted: 30

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
    answer: null,
    createdAt: "2026-03-21T10:30:00",
    points: null,
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
    answer: null,
    createdAt: "2026-03-21T10:35:00",
    points: 3,
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
    answer: null,
    createdAt: "2026-03-21T11:00:00",
    points: 5,
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
    answer: null,
    createdAt: "2026-03-21T11:30:00",
    points: 10,
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
    answer: null,
    createdAt: "2026-03-18T14:00:00",
    points: null,
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
    answer: null,
    createdAt: "2026-03-18T14:10:00",
    points: 3,
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
    answer: null,
    createdAt: "2026-03-18T15:20:00",
    points: 5,
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
    answer: null,
    createdAt: "2026-03-11T09:00:00",
    points: null,
  },
  {
    id: "h-009",
    actionType: "question_created",
    content: null,
    post: {
      id: "p-002",
      title: "Zustand와 Redux Toolkit 중 어떤 것을 선택해야 할까요?",
    },
    answer: null,
    createdAt: "2026-03-11T10:45:00",
    points: 10,
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
    answer: null,
    createdAt: "2026-03-11T13:00:00",
    points: 5,
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
    answer: null,
    createdAt: "2026-03-01T14:30:00",
    points: null,
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
    answer: null,
    createdAt: "2026-03-01T14:40:00",
    points: 3,
  },
  {
    id: "h-013",
    actionType: "question_created",
    content: null,
    post: {
      id: "p-003",
      title: "JWT 토큰을 localStorage에 저장하면 안 되는 이유",
    },
    answer: null,
    createdAt: "2026-03-01T16:00:00",
    points: 10,
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
    answer: null,
    createdAt: "2026-02-10T11:00:00",
    points: null,
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
    answer: null,
    createdAt: "2026-02-10T15:30:00",
    points: 5,
  },
  // content, post 모두 null인 edge case — 삭제된 항목 UI 방어 처리 테스트용
  {
    id: "h-016",
    actionType: "content_opened",
    content: null,
    post: null,
    answer: null,
    createdAt: "2026-02-10T09:00:00",
    points: null,
  },
];

// ── 활동 내역 mock 데이터 ─────────────────────────────────────────────────────
// TODO: 실제 API 연동 시 GET /history?actionTypes=content_liked,answer_written,answer_adopted,comment_created,daily_login 응답으로 교체
//
// answer 필드: answer_written / comment_created 아이템에 실제 answer.id 포함
// → ActivityTimelineItem 클릭 시 /community/{post.id}#answer-{answer.id} 앵커 이동에 사용 예정

const MOCK_ACTIVITY_ITEMS: ActivityItem[] = [
  // ── 오늘 (2026-03-21) ──────────────────────────────────────────────────────
  {
    id: "a-001",
    actionType: "daily_login",
    content: null,
    post: null,
    answer: null,
    createdAt: "2026-03-21T08:00:00",
    points: 1,
  },
  {
    id: "a-002",
    actionType: "content_liked",
    content: {
      id: "c-001",
      title: "React useEffect 완전 정복",
      preview:
        "useEffect는 컴포넌트가 렌더링된 후 실행되는 사이드 이펙트를 처리하는 훅입니다.",
    },
    post: null,
    answer: null,
    createdAt: "2026-03-21T09:00:00",
    points: 2,
  },
  {
    id: "a-003",
    actionType: "answer_written",
    content: null,
    post: {
      id: "p-001",
      title:
        "Next.js에서 getServerSideProps와 서버 컴포넌트의 차이점이 무엇인가요?",
    },
    answer: { id: "ans-001" },
    createdAt: "2026-03-21T11:00:00",
    points: 15,
  },
  {
    id: "a-004",
    actionType: "answer_adopted",
    content: null,
    post: {
      id: "p-002",
      title: "Zustand와 Redux Toolkit 중 어떤 것을 선택해야 할까요?",
    },
    answer: { id: "ans-004" },
    createdAt: "2026-03-21T13:00:00",
    points: 30,
  },
  {
    id: "a-005",
    actionType: "comment_created",
    content: null,
    post: {
      id: "p-002",
      title: "Zustand와 Redux Toolkit 중 어떤 것을 선택해야 할까요?",
    },
    answer: { id: "ans-002" },
    createdAt: "2026-03-21T14:30:00",
    points: null,
  },
  // ── 3일 전 (2026-03-18) ────────────────────────────────────────────────────
  {
    id: "a-006",
    actionType: "daily_login",
    content: null,
    post: null,
    answer: null,
    createdAt: "2026-03-18T08:30:00",
    points: 1,
  },
  {
    id: "a-007",
    actionType: "content_liked",
    content: {
      id: "c-003",
      title: "TypeScript 제네릭 완벽 가이드",
      preview:
        "제네릭을 사용하면 다양한 타입에 대해 재사용 가능한 컴포넌트를 작성할 수 있습니다.",
    },
    post: null,
    answer: null,
    createdAt: "2026-03-18T10:00:00",
    points: 2,
  },
  {
    id: "a-008",
    actionType: "content_liked",
    content: {
      id: "c-004",
      title: "TanStack Query v5 마이그레이션 가이드",
      preview:
        "v5에서는 useQuery의 options 구조가 변경되었으며 isLoading 대신 isPending 사용을 권장합니다.",
    },
    post: null,
    answer: null,
    createdAt: "2026-03-18T13:00:00",
    points: 2,
  },
  {
    id: "a-009",
    actionType: "answer_written",
    content: null,
    post: {
      id: "p-003",
      title: "JWT 토큰을 localStorage에 저장하면 안 되는 이유",
    },
    answer: { id: "ans-003" },
    createdAt: "2026-03-18T15:30:00",
    points: 15,
  },
  // ── 10일 전 (2026-03-11) ───────────────────────────────────────────────────
  {
    id: "a-010",
    actionType: "daily_login",
    content: null,
    post: null,
    answer: null,
    createdAt: "2026-03-11T09:00:00",
    points: 1,
  },
  {
    id: "a-011",
    actionType: "content_liked",
    content: {
      id: "c-005",
      title: "CSS Grid vs Flexbox: 언제 무엇을 써야 할까?",
      preview: "Grid는 2차원 레이아웃에, Flexbox는 1차원 레이아웃에 적합합니다.",
    },
    post: null,
    answer: null,
    createdAt: "2026-03-11T09:30:00",
    points: 2,
  },
  {
    id: "a-012",
    actionType: "answer_written",
    content: null,
    post: {
      id: "p-002",
      title: "Zustand와 Redux Toolkit 중 어떤 것을 선택해야 할까요?",
    },
    answer: { id: "ans-004" },
    createdAt: "2026-03-11T11:00:00",
    points: 15,
  },
  {
    id: "a-013",
    actionType: "comment_created",
    content: null,
    post: {
      id: "p-001",
      title:
        "Next.js에서 getServerSideProps와 서버 컴포넌트의 차이점이 무엇인가요?",
    },
    answer: { id: "ans-005" },
    createdAt: "2026-03-11T14:00:00",
    points: null,
  },
  // ── 20일 전 (2026-03-01) ───────────────────────────────────────────────────
  {
    id: "a-014",
    actionType: "daily_login",
    content: null,
    post: null,
    answer: null,
    createdAt: "2026-03-01T09:10:00",
    points: 1,
  },
  {
    id: "a-015",
    actionType: "content_liked",
    content: {
      id: "c-007",
      title: "Docker Compose로 로컬 개발 환경 구축하기",
      preview:
        "docker-compose.yml을 활용해 PostgreSQL, Redis, 애플리케이션을 한 번에 실행하는 방법입니다.",
    },
    post: null,
    answer: null,
    createdAt: "2026-03-01T10:00:00",
    points: 2,
  },
  {
    id: "a-016",
    actionType: "answer_written",
    content: null,
    post: {
      id: "p-004",
      title: "Spring Boot에서 N+1 문제를 해결하는 방법을 알려주세요",
    },
    answer: { id: "ans-006" },
    createdAt: "2026-03-01T13:00:00",
    points: 15,
  },
  {
    id: "a-017",
    actionType: "answer_adopted",
    content: null,
    post: {
      id: "p-004",
      title: "Spring Boot에서 N+1 문제를 해결하는 방법을 알려주세요",
    },
    answer: { id: "ans-006" },
    createdAt: "2026-03-01T15:00:00",
    points: 30,
  },
  {
    id: "a-018",
    actionType: "comment_created",
    content: null,
    post: {
      id: "p-003",
      title: "JWT 토큰을 localStorage에 저장하면 안 되는 이유",
    },
    answer: { id: "ans-007" },
    createdAt: "2026-03-01T16:00:00",
    points: null,
  },
  // ── 40일 전 (2026-02-10) ───────────────────────────────────────────────────
  {
    id: "a-019",
    actionType: "content_liked",
    content: {
      id: "c-008",
      title: "GitHub Actions CI/CD 파이프라인 구축 실전",
      preview:
        "PR 생성 시 자동으로 lint, test, build를 실행하는 워크플로우 작성 방법입니다.",
    },
    post: null,
    answer: null,
    createdAt: "2026-02-10T10:00:00",
    points: 2,
  },
  {
    id: "a-020",
    actionType: "comment_created",
    content: null,
    post: {
      id: "p-002",
      title: "Zustand와 Redux Toolkit 중 어떤 것을 선택해야 할까요?",
    },
    answer: { id: "ans-008" },
    createdAt: "2026-02-10T12:00:00",
    points: null,
  },
  // edge case: content + post + answer 모두 null — 삭제된 항목 UI 방어 처리 테스트용
  {
    id: "a-021",
    actionType: "answer_written",
    content: null,
    post: null,
    answer: null,
    createdAt: "2026-02-10T15:00:00",
    points: null,
  },
];

// ── 배지 mock 데이터 ──────────────────────────────────────────────────────────
// TODO: 실제 API 연동 시 GET /history/badges 응답으로 교체

const MOCK_BADGES: BadgeItem[] = [
  {
    badgeId: "FIRST_SCRAP",
    name: "수집가",
    description: "스크랩 1회 달성",
    acquired: true,
    acquiredAt: "2026-03-11T13:00:00",
  },
  {
    badgeId: "FIRST_QUESTION",
    name: "탐험가",
    description: "질문 작성 1회 달성",
    acquired: true,
    acquiredAt: "2026-03-21T11:30:00",
  },
  {
    badgeId: "ANSWER_MASTER",
    name: "멘토",
    description: "답변 채택 5회 달성",
    acquired: false,
    acquiredAt: null,
  },
  {
    badgeId: "POINT_100",
    name: "새싹",
    description: "누적 포인트 100p 달성",
    acquired: true,
    acquiredAt: "2026-03-18T15:30:00",
  },
  {
    badgeId: "POINT_500",
    name: "성장주",
    description: "누적 포인트 500p 달성",
    acquired: false,
    acquiredAt: null,
  },
  {
    badgeId: "POINT_1000",
    name: "픽커",
    description: "누적 포인트 1000p 달성",
    acquired: false,
    acquiredAt: null,
  },
  {
    badgeId: "STREAK_7",
    name: "꾸준이",
    description: "연속 로그인 7일 달성",
    acquired: false,
    acquiredAt: null,
  },
];

// ── 포인트 요약 mock 데이터 ───────────────────────────────────────────────────
// TODO: 실제 API 연동 시 GET /history/points 응답으로 교체

const MOCK_POINTS_SUMMARY: PointsSummary = {
  totalPoints: 148,
  weeklyPoints: 43,
  streak: 3,
};

// ── mock 함수들 ────────────────────────────────────────────────────────────────
// params.actionTypes / startDate / endDate는 mock 단계에서 무시됨
// (로컬 filterByPeriod / filterByActions 로 대체)
// 실제 API 연동 시 이 함수들을 axios 호출로 교체하면 됨

export function mockGetHistoryList(
  params: HistoryParams = {},
): Promise<HistoryPageResponse> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const page = params.page ?? 0;
      const size = params.size ?? 20;

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

export function mockGetBadges(): Promise<BadgesResponse> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: MOCK_BADGES,
        message: "배지 목록을 불러왔습니다",
      });
    }, 400);
  });
}

export function mockGetPointsSummary(): Promise<PointsSummaryResponse> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: MOCK_POINTS_SUMMARY,
        message: "포인트 요약을 불러왔습니다",
      });
    }, 300);
  });
}
