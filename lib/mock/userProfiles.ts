import type { UserProfile } from "@/types/userProfile";

/** userId → UserProfile 목 데이터. 실제 API 연동 시 이 파일을 제거하고 apiClient 호출로 교체합니다. */
export const MOCK_USER_PROFILES: Record<string, UserProfile> = {
  "user-001": {
    userId: "user-001",
    nickname: "코딩입문자",
    profileImage: null,
    job: "FRONTEND",
    level: "BEGINNER",
    badges: [
      { badgeId: "FIRST_QUESTION", name: "첫 질문" },
      { badgeId: "POINT_100", name: "100포인트" },
    ],
    recentPosts: [
      { id: "post-001", title: "React useEffect 의존성 배열, 빈 배열과 생략의 차이가 뭔가요?", createdAt: "2026-03-17T08:30:00.000Z" },
      { id: "post-006", title: "TypeScript에서 unknown vs any 타입 차이와 올바른 사용 시점", createdAt: "2026-03-16T18:00:00.000Z" },
      { id: "post-013", title: "CSS Grid와 Flexbox를 같이 쓸 때 언제 어느 걸 선택해야 하나요?", createdAt: "2026-03-15T15:00:00.000Z" },
      { id: "post-023", title: "Git 브랜치 전략, 팀 규모에 따라 Git Flow와 Trunk Based 중 어떤 게 맞을까요?", createdAt: "2026-03-13T21:00:00.000Z" },
      { id: "post-028", title: "프론트엔드 접근성(a11y) 적용 시 가장 먼저 챙겨야 할 항목이 뭔가요?", createdAt: "2026-03-12T20:00:00.000Z" },
    ],
    recentAnswers: [],
  },
  "user-002": {
    userId: "user-002",
    nickname: "프론트엔드주니어",
    profileImage: null,
    job: "FRONTEND",
    level: "JUNIOR",
    badges: [
      { badgeId: "FIRST_QUESTION", name: "첫 질문" },
      { badgeId: "POINT_100", name: "100포인트" },
      { badgeId: "STREAK_7", name: "7일 연속" },
    ],
    recentPosts: [
      { id: "post-002", title: "Next.js App Router에서 서버 컴포넌트와 클라이언트 컴포넌트를 어떻게 나누는 게 좋을까요?", createdAt: "2026-03-17T07:15:00.000Z" },
      { id: "post-008", title: "JWT Access Token을 메모리에만 저장하면 페이지 새로고침 시 로그아웃되지 않나요?", createdAt: "2026-03-16T13:00:00.000Z" },
      { id: "post-015", title: "Tailwind CSS v4로 마이그레이션할 때 가장 주의할 부분이 뭔가요?", createdAt: "2026-03-15T09:30:00.000Z" },
      { id: "post-016", title: "CI/CD 파이프라인에서 GitHub Actions와 Jenkins 중 어떤 걸 선택하면 좋을까요?", createdAt: "2026-03-15T07:00:00.000Z" },
      { id: "post-025", title: "AWS S3에 이미지 업로드 시 Presigned URL 방식이 좋은 이유가 뭔가요?", createdAt: "2026-03-13T15:00:00.000Z" },
    ],
    recentAnswers: [],
  },
  "user-senior-01": {
    userId: "user-senior-01",
    nickname: "시니어개발자",
    profileImage: "https://i.pravatar.cc/150?img=12",
    job: "FULLSTACK",
    level: "SENIOR",
    badges: [
      { badgeId: "ANSWER_MASTER", name: "답변 마스터" },
      { badgeId: "POINT_1000", name: "1000포인트" },
      { badgeId: "STREAK_7", name: "7일 연속" },
      { badgeId: "FIRST_SCRAP", name: "첫 스크랩" },
    ],
    recentPosts: [
      { id: "post-009", title: "Kubernetes에서 Deployment와 StatefulSet의 차이가 무엇인가요?", createdAt: "2026-03-16T10:30:00.000Z" },
      { id: "post-014", title: "MSA 환경에서 서비스 간 트랜잭션을 어떻게 처리하는 게 좋을까요?", createdAt: "2026-03-15T12:00:00.000Z" },
      { id: "post-019", title: "GraphQL을 REST API 대신 도입할 만한 규모나 상황 기준이 있나요?", createdAt: "2026-03-14T16:00:00.000Z" },
      { id: "post-022", title: "JPA에서 낙관적 락과 비관적 락을 어떤 기준으로 선택하나요?", createdAt: "2026-03-14T08:00:00.000Z" },
      { id: "post-029", title: "이벤트 소싱(Event Sourcing) 패턴을 실무에 도입할 때 주의해야 할 점이 있나요?", createdAt: "2026-03-12T16:00:00.000Z" },
    ],
    recentAnswers: [
      { answerId: "answer-001", postId: "post-001", postTitle: "React useEffect 의존성 배열, 빈 배열과 생략의 차이가 뭔가요?", createdAt: "2026-03-17T09:00:00.000Z" },
      { answerId: "answer-002-001", postId: "post-002", postTitle: "Next.js App Router에서 서버 컴포넌트와 클라이언트 컴포넌트를 어떻게 나누는 게 좋을까요?", createdAt: "2026-03-17T08:00:00.000Z" },
      { answerId: "answer-004-001", postId: "post-004", postTitle: "TanStack Query와 Zustand를 함께 쓸 때 서버 상태와 클라이언트 상태를 어떻게 구분하나요?", createdAt: "2026-03-16T23:00:00.000Z" },
      { answerId: "answer-010-001", postId: "post-010", postTitle: "React 19 Concurrent Features를 실무에 적용할 때 주의할 점이 있을까요?", createdAt: "2026-03-16T09:00:00.000Z" },
      { answerId: "answer-007-001", postId: "post-007", postTitle: "Redis 캐싱 전략 중 Cache-Aside와 Write-Through 중 어떤 걸 써야 할까요?", createdAt: "2026-03-16T16:00:00.000Z" },
    ],
  },
  "user-junior-01": {
    userId: "user-junior-01",
    nickname: "주니어개발자",
    profileImage: null,
    job: "BACKEND",
    level: "JUNIOR",
    badges: [
      { badgeId: "POINT_100", name: "100포인트" },
      { badgeId: "FIRST_QUESTION", name: "첫 질문" },
    ],
    recentPosts: [
      { id: "post-003", title: "Spring Boot에서 N+1 문제 발생 원인과 해결 방법이 궁금합니다", createdAt: "2026-03-17T06:00:00.000Z" },
      { id: "post-018", title: "Spring Security에서 JWT 필터 체인을 구성하는 방법이 헷갈려요", createdAt: "2026-03-14T19:30:00.000Z" },
      { id: "post-020", title: "Nginx에서 리버스 프록시 설정 시 CORS 처리를 어디서 해야 하나요?", createdAt: "2026-03-14T13:00:00.000Z" },
    ],
    recentAnswers: [
      { answerId: "answer-002", postId: "post-001", postTitle: "React useEffect 의존성 배열, 빈 배열과 생략의 차이가 뭔가요?", createdAt: "2026-03-17T11:00:00.000Z" },
      { answerId: "answer-003-001", postId: "post-003", postTitle: "Spring Boot에서 N+1 문제 발생 원인과 해결 방법이 궁금합니다", createdAt: "2026-03-17T07:00:00.000Z" },
      { answerId: "answer-005-001", postId: "post-005", postTitle: "Docker Compose로 여러 서비스를 묶을 때 healthcheck 설정 방법을 알고 싶어요", createdAt: "2026-03-16T21:00:00.000Z" },
      { answerId: "answer-008-001", postId: "post-008", postTitle: "JWT Access Token을 메모리에만 저장하면 페이지 새로고침 시 로그아웃되지 않나요?", createdAt: "2026-03-16T14:00:00.000Z" },
      { answerId: "answer-016-001", postId: "post-016", postTitle: "CI/CD 파이프라인에서 GitHub Actions와 Jenkins 중 어떤 걸 선택하면 좋을까요?", createdAt: "2026-03-15T08:00:00.000Z" },
    ],
  },
  "user-middle-01": {
    userId: "user-middle-01",
    nickname: "미들개발자",
    profileImage: "https://i.pravatar.cc/150?img=47",
    job: "FRONTEND",
    level: "MIDDLE",
    badges: [
      { badgeId: "POINT_500", name: "500포인트" },
      { badgeId: "STREAK_7", name: "7일 연속" },
      { badgeId: "ANSWER_MASTER", name: "답변 마스터" },
    ],
    recentPosts: [
      { id: "post-004", title: "TanStack Query와 Zustand를 함께 쓸 때 서버 상태와 클라이언트 상태를 어떻게 구분하나요?", createdAt: "2026-03-16T22:00:00.000Z" },
      { id: "post-017", title: "Zustand에서 slice 패턴을 쓸 때 TypeScript 타입을 어떻게 관리하나요?", createdAt: "2026-03-14T22:00:00.000Z" },
    ],
    recentAnswers: [
      { answerId: "answer-m-001", postId: "post-001", postTitle: "React useEffect 의존성 배열, 빈 배열과 생략의 차이가 뭔가요?", createdAt: "2026-03-17T10:00:00.000Z" },
      { answerId: "answer-m-002", postId: "post-006", postTitle: "TypeScript에서 unknown vs any 타입 차이와 올바른 사용 시점", createdAt: "2026-03-16T19:00:00.000Z" },
      { answerId: "answer-m-003", postId: "post-013", postTitle: "CSS Grid와 Flexbox를 같이 쓸 때 언제 어느 걸 선택해야 하나요?", createdAt: "2026-03-15T16:00:00.000Z" },
      { answerId: "answer-m-004", postId: "post-021", postTitle: "함수형 컴포넌트에서 forwardRef를 쓸 때 TypeScript 타입이 복잡해지는데 좋은 패턴이 있나요?", createdAt: "2026-03-14T11:00:00.000Z" },
      { answerId: "answer-m-005", postId: "post-017", postTitle: "Zustand에서 slice 패턴을 쓸 때 TypeScript 타입을 어떻게 관리하나요?", createdAt: "2026-03-14T23:00:00.000Z" },
    ],
  },
  "user-004": {
    userId: "user-004",
    nickname: "리액트개발자",
    profileImage: null,
    job: "FRONTEND",
    level: "MIDDLE",
    badges: [
      { badgeId: "FIRST_QUESTION", name: "첫 질문" },
      { badgeId: "POINT_100", name: "100포인트" },
    ],
    recentPosts: [
      { id: "post-004", title: "TanStack Query와 Zustand를 함께 쓸 때 서버 상태와 클라이언트 상태를 어떻게 구분하나요?", createdAt: "2026-03-16T22:00:00.000Z" },
      { id: "post-008", title: "JWT Access Token을 메모리에만 저장하면 페이지 새로고침 시 로그아웃되지 않나요?", createdAt: "2026-03-16T13:00:00.000Z" },
      { id: "post-017", title: "Zustand에서 slice 패턴을 쓸 때 TypeScript 타입을 어떻게 관리하나요?", createdAt: "2026-03-14T22:00:00.000Z" },
      { id: "post-021", title: "함수형 컴포넌트에서 forwardRef를 쓸 때 TypeScript 타입이 복잡해지는데 좋은 패턴이 있나요?", createdAt: "2026-03-14T10:30:00.000Z" },
      { id: "post-024", title: "Webpack에서 번들 사이즈를 줄이는 방법으로 무엇을 먼저 시도해야 할까요?", createdAt: "2026-03-13T18:00:00.000Z" },
    ],
    recentAnswers: [],
  },
  "user-010": {
    userId: "user-010",
    nickname: "시니어프론트",
    profileImage: "https://i.pravatar.cc/150?img=33",
    job: "FRONTEND",
    level: "SENIOR",
    badges: [
      { badgeId: "POINT_500", name: "500포인트" },
      { badgeId: "ANSWER_MASTER", name: "답변 마스터" },
      { badgeId: "FIRST_SCRAP", name: "첫 스크랩" },
    ],
    recentPosts: [
      { id: "post-010", title: "React 19 Concurrent Features를 실무에 적용할 때 주의할 점이 있을까요?", createdAt: "2026-03-16T08:00:00.000Z" },
      { id: "post-012", title: "모노레포 구성 시 Turborepo와 Nx 중 어떤 걸 선택해야 할까요?", createdAt: "2026-03-15T18:30:00.000Z" },
      { id: "post-014", title: "MSA 환경에서 서비스 간 트랜잭션을 어떻게 처리하는 게 좋을까요?", createdAt: "2026-03-15T12:00:00.000Z" },
      { id: "post-022", title: "JPA에서 낙관적 락과 비관적 락을 어떤 기준으로 선택하나요?", createdAt: "2026-03-14T08:00:00.000Z" },
      { id: "post-026", title: "테스트 코드 작성 시 단위 테스트와 통합 테스트의 적절한 비율은 어떻게 되나요?", createdAt: "2026-03-13T12:00:00.000Z" },
    ],
    recentAnswers: [
      { answerId: "answer-010-f-001", postId: "post-002", postTitle: "Next.js App Router에서 서버 컴포넌트와 클라이언트 컴포넌트를 어떻게 나누는 게 좋을까요?", createdAt: "2026-03-17T07:30:00.000Z" },
      { answerId: "answer-010-f-002", postId: "post-006", postTitle: "TypeScript에서 unknown vs any 타입 차이와 올바른 사용 시점", createdAt: "2026-03-16T19:30:00.000Z" },
      { answerId: "answer-010-f-003", postId: "post-013", postTitle: "CSS Grid와 Flexbox를 같이 쓸 때 언제 어느 걸 선택해야 하나요?", createdAt: "2026-03-15T16:30:00.000Z" },
      { answerId: "answer-010-f-004", postId: "post-015", postTitle: "Tailwind CSS v4로 마이그레이션할 때 가장 주의할 부분이 뭔가요?", createdAt: "2026-03-15T10:00:00.000Z" },
      { answerId: "answer-010-f-005", postId: "post-021", postTitle: "함수형 컴포넌트에서 forwardRef를 쓸 때 TypeScript 타입이 복잡해지는데 좋은 패턴이 있나요?", createdAt: "2026-03-14T12:00:00.000Z" },
    ],
  },
};

/** 등록되지 않은 userId에 대한 기본 프로필 생성 */
export function getMockUserProfile(userId: string, nickname?: string): UserProfile {
  return (
    MOCK_USER_PROFILES[userId] ?? {
      userId,
      nickname: nickname ?? "사용자",
      profileImage: null,
      job: null,
      level: null,
      badges: [],
      recentPosts: [],
      recentAnswers: [],
    }
  );
}
