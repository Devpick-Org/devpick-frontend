import type {
  MyPageQuizHistory,
  MyPageQuizHistoryResponse,
  QuizHistoryDetail,
} from "@/types/myPage";

export const MOCK_QUIZ_HISTORIES: MyPageQuizHistory[] = [
  {
    attemptId: "a1",
    contentId: "content-201",
    contentTitle: "React 19의 새로운 기능들: useActionState, useFormStatus 완벽 정리",
    thumbnail: "https://picsum.photos/seed/quiz1/400/240",
    preview: "React 19에서 useActionState 훅의 주요 역할은 무엇인가요?",
    level: "MIDDLE",
    score: 2,
    totalQuestions: 5,
    passed: false,
    attemptedAt: "2026-04-20T10:30:00Z",
  },
  {
    attemptId: "a2",
    contentId: "content-202",
    contentTitle: "TypeScript 5.5 주요 변경사항 — infer 키워드 개선과 strictness 강화",
    thumbnail: "https://picsum.photos/seed/quiz2/400/240",
    preview: "TypeScript 5.5에서 infer 키워드가 개선된 주된 이유는 무엇인가요?",
    level: "JUNIOR",
    score: 3,
    totalQuestions: 5,
    passed: false,
    attemptedAt: "2026-04-18T14:00:00Z",
  },
  {
    attemptId: "a3",
    contentId: "content-203",
    contentTitle: "PostgreSQL EXPLAIN ANALYZE 읽는 법 — 쿼리 최적화 실전 가이드",
    thumbnail: null,
    level: "SENIOR",
    score: 1,
    totalQuestions: 5,
    passed: false,
    attemptedAt: "2026-04-15T09:00:00Z",
  },
  {
    attemptId: "a4",
    contentId: "content-204",
    contentTitle: "Docker Compose로 로컬 개발 환경 구성하기 — 실전 템플릿 공개",
    thumbnail: "https://picsum.photos/seed/quiz4/400/240",
    level: "BEGINNER",
    score: 5,
    totalQuestions: 5,
    passed: true,
    attemptedAt: "2026-04-13T11:20:00Z",
  },
  {
    attemptId: "a5",
    contentId: "content-205",
    contentTitle: "Next.js App Router에서 Server Component와 Client Component 경계 설계하기",
    thumbnail: "https://picsum.photos/seed/quiz5/400/240",
    preview: "Next.js App Router에서 Server Component가 Client Component를 import할 수 없는 이유는?",
    level: "MIDDLE",
    score: 2,
    totalQuestions: 5,
    passed: false,
    attemptedAt: "2026-04-10T16:45:00Z",
  },
  {
    attemptId: "a6",
    contentId: "content-206",
    contentTitle: "Redis 캐싱 전략 비교 — Cache-Aside, Write-Through, Write-Behind",
    thumbnail: null,
    level: "JUNIOR",
    score: 5,
    totalQuestions: 5,
    passed: true,
    attemptedAt: "2026-04-08T13:00:00Z",
  },
  {
    attemptId: "a7",
    contentId: "content-207",
    contentTitle: "REST API 설계 원칙 — 버저닝 전략과 에러 응답 포맷 표준화",
    thumbnail: "https://picsum.photos/seed/quiz7/400/240",
    preview: "REST API에서 버저닝 전략 중 URL 버저닝의 단점은 무엇인가요?",
    level: "JUNIOR",
    score: 3,
    totalQuestions: 5,
    passed: false,
    attemptedAt: "2026-04-05T10:10:00Z",
  },
  {
    attemptId: "a8",
    contentId: "content-208",
    contentTitle: "Zustand v5 마이그레이션 가이드 — 스토어 구조와 미들웨어 변경점",
    thumbnail: null,
    level: "MIDDLE",
    score: 5,
    totalQuestions: 5,
    passed: true,
    attemptedAt: "2026-04-03T09:30:00Z",
  },
  {
    attemptId: "a9",
    contentId: "content-209",
    contentTitle: "CSS Container Queries 실전 활용 — 반응형 컴포넌트 설계",
    thumbnail: null,
    level: "BEGINNER",
    score: 4,
    totalQuestions: 5,
    passed: false,
    attemptedAt: "2026-04-01T15:00:00Z",
  },
  {
    attemptId: "a10",
    contentId: "content-210",
    contentTitle: "Kubernetes Pod 스케줄링 전략 — Affinity와 Taint/Toleration",
    thumbnail: "https://picsum.photos/seed/quiz10/400/240",
    preview: "Kubernetes에서 Node Affinity와 Pod Affinity의 차이점은?",
    level: "SENIOR",
    score: 2,
    totalQuestions: 5,
    passed: false,
    attemptedAt: "2026-03-29T11:00:00Z",
  },
  {
    attemptId: "a11",
    contentId: "content-211",
    contentTitle: "웹 성능 최적화 — Core Web Vitals 개선 실전 사례",
    thumbnail: "https://picsum.photos/seed/quiz11/400/240",
    preview: "LCP 지표를 개선하기 위한 가장 효과적인 방법은 무엇인가요?",
    level: "MIDDLE",
    score: 3,
    totalQuestions: 5,
    passed: false,
    attemptedAt: "2026-03-26T09:30:00Z",
  },
  {
    attemptId: "a12",
    contentId: "content-212",
    contentTitle: "GraphQL vs REST — 실무에서 선택 기준과 트레이드오프",
    thumbnail: null,
    preview: "GraphQL의 N+1 문제를 해결하는 일반적인 방법은?",
    level: "JUNIOR",
    score: 1,
    totalQuestions: 5,
    passed: false,
    attemptedAt: "2026-03-22T14:00:00Z",
  },
];

// ─── 퀴즈 히스토리 상세 mock ──────────────────────────────────────────────────

const MOCK_DETAIL_QUESTIONS: QuizHistoryDetail["questions"] = [
  {
    id: "q-1",
    type: "multiple_choice",
    question: "React의 useState 훅은 무엇을 반환하나요?",
    options: [
      { id: "opt-1", text: "상태값과 상태를 업데이트하는 함수" },
      { id: "opt-2", text: "컴포넌트 렌더링 결과" },
      { id: "opt-3", text: "이펙트 클린업 함수" },
    ],
    correctOptionId: "opt-1",
    explanation: "useState는 [state, setState] 형태의 배열을 반환합니다.",
    correctAnswer: "",
  },
  {
    id: "q-2",
    type: "multiple_choice",
    question: "useEffect의 두 번째 인자(의존성 배열)를 빈 배열로 전달하면?",
    options: [
      { id: "opt-1", text: "컴포넌트가 언마운트될 때만 실행" },
      { id: "opt-2", text: "마운트 시 한 번만 실행" },
      { id: "opt-3", text: "모든 렌더링마다 실행" },
    ],
    correctOptionId: "opt-2",
    explanation: "빈 배열을 전달하면 마운트 시 한 번만 실행됩니다.",
    correctAnswer: "",
  },
  {
    id: "q-3",
    type: "short_answer",
    question: "React에서 컴포넌트 간 상태를 공유하는 패턴의 이름은?",
    options: [],
    correctOptionId: "",
    explanation: "상태를 공통 부모로 끌어올리는 패턴을 state lifting이라고 합니다.",
    correctAnswer: "state lifting",
  },
];

// ─── 히스토리 목록 ─────────────────────────────────────────────────────────────

type FetchMyQuizHistoryParams = {
  sort?: "newest" | "oldest";
  page?: number;
  size?: number;
  wrongOnly?: boolean;
};

export async function fetchMyQuizHistory(
  params?: FetchMyQuizHistoryParams,
): Promise<MyPageQuizHistoryResponse> {
  await new Promise((resolve) => setTimeout(resolve, 400));

  const { sort = "newest", page = 0, size = 10, wrongOnly = false } =
    params ?? {};

  const source = wrongOnly
    ? MOCK_QUIZ_HISTORIES.filter((q) => !q.passed)
    : MOCK_QUIZ_HISTORIES;

  const processed = [...source].sort((a, b) => {
    const diff =
      new Date(a.attemptedAt).getTime() - new Date(b.attemptedAt).getTime();
    return sort === "newest" ? -diff : diff;
  });

  const totalElements = processed.length;
  const totalPages = Math.ceil(totalElements / size);
  const start = page * size;
  const content = processed.slice(start, start + size);

  return { content, page, size, totalElements, totalPages };
}

export async function fetchMyQuizHistoryPreview(
  count = 4,
): Promise<MyPageQuizHistoryResponse> {
  return fetchMyQuizHistory({ page: 0, size: count, sort: "newest" });
}

// ─── 히스토리 상세 ─────────────────────────────────────────────────────────────

export async function fetchMyQuizHistoryDetail(
  attemptId: string,
): Promise<QuizHistoryDetail> {
  await new Promise((resolve) => setTimeout(resolve, 400));

  const attempt = MOCK_QUIZ_HISTORIES.find((q) => q.attemptId === attemptId);
  if (!attempt) throw new Error("Quiz history not found");

  return {
    attemptId: attempt.attemptId,
    contentId: attempt.contentId,
    score: attempt.score,
    totalQuestions: attempt.totalQuestions,
    passed: attempt.passed,
    pointsEarned: attempt.passed ? 50 : 0,
    questions: MOCK_DETAIL_QUESTIONS,
    passingCount: 2,
    myAnswers: [
      {
        questionId: "q-1",
        selectedOptionId: attempt.passed ? "opt-1" : "opt-2",
        answerText: null,
        isCorrect: attempt.passed,
      },
      {
        questionId: "q-2",
        selectedOptionId: "opt-2",
        answerText: null,
        isCorrect: true,
      },
      {
        questionId: "q-3",
        selectedOptionId: null,
        answerText: attempt.passed ? "state lifting" : "props drilling",
        isCorrect: attempt.passed,
      },
    ],
  };
}

// ─── 기존 함수 유지 (WrongQuizSection preview용) ──────────────────────────────

export async function fetchMyWrongQuizzes(): Promise<MyPageQuizHistory[]> {
  await new Promise((resolve) => setTimeout(resolve, 400));
  return MOCK_QUIZ_HISTORIES.filter((q) => !q.passed);
}

export async function fetchMyWrongQuizzesPreview(
  count = 4,
): Promise<MyPageQuizHistory[]> {
  await new Promise((resolve) => setTimeout(resolve, 400));
  return MOCK_QUIZ_HISTORIES.filter((q) => !q.passed).slice(0, count);
}
