import type { AiSummary, AiSummaryLevel } from "@/types/content";

export const MOCK_AI_SUMMARIES: Record<AiSummaryLevel, Omit<AiSummary, "contentId">> = {
  BEGINNER: {
    level: "BEGINNER",
    coreSummary:
      "useEffect는 React에서 컴포넌트가 화면에 그려진 뒤 실행되는 특별한 함수예요. 데이터를 불러오거나, 타이머를 설정하는 등 '렌더링 이후에 해야 할 일'을 여기에 작성합니다.",
    keyPoints: [
      "useEffect는 렌더링이 끝난 뒤 실행됩니다",
      "두 번째 인자(의존성 배열)가 없으면 매번 실행, 빈 배열이면 한 번만 실행됩니다",
      "리턴 함수로 정리(cleanup)를 처리할 수 있어요",
    ],
    keywords: ["useEffect", "렌더링", "사이드 이펙트", "의존성 배열", "클린업"],
    difficulty: "쉬움",
    nextRecommendation:
      "useState와 useEffect를 함께 사용하는 간단한 타이머나 API 호출 예제를 직접 만들어 보세요.",
    confidence: 0.93,
    additionalQuestions: [
      "의존성 배열에 아무것도 넣지 않으면 어떤 일이 벌어질까요?",
      "컴포넌트가 사라질 때 타이머를 어떻게 멈출 수 있을까요?",
    ],
    cachedAt: "2026-03-16T09:00:00",
    expiresAt: "2026-03-17T09:00:00",
  },
  JUNIOR: {
    level: "JUNIOR",
    coreSummary:
      "useEffect의 의존성 배열은 '이 값이 바뀌면 다시 실행해달라'는 선언입니다. 배열을 잘못 관리하면 stale closure나 무한 루프가 발생합니다. ESLint의 exhaustive-deps 규칙을 활성화하면 누락된 의존성을 자동으로 감지할 수 있습니다.",
    keyPoints: [
      "의존성 배열은 임의로 비우거나 채우는 용도가 아니라, 실제로 사용하는 값을 나열해야 합니다",
      "함수형 업데이트(prev => prev + 1)로 일부 의존성을 제거할 수 있습니다",
      "비동기 요청에는 cancelled 플래그 또는 AbortController로 클린업을 처리하세요",
      "eslint-plugin-react-hooks의 exhaustive-deps 규칙을 반드시 활성화하세요",
    ],
    keywords: ["stale closure", "의존성 배열", "클린업", "exhaustive-deps", "함수형 업데이트"],
    difficulty: "보통",
    nextRecommendation:
      "useCallback과 useEffect를 함께 쓸 때 발생하는 의존성 순환 문제를 분석해보세요.",
    confidence: 0.91,
    additionalQuestions: [
      "useEffect 내부에서 async/await를 직접 쓰면 안 되는 이유는 무엇인가요?",
      "Object나 Array를 의존성으로 넣으면 어떤 문제가 생기나요?",
      "useEffect와 useLayoutEffect의 실행 타이밍 차이는 무엇인가요?",
    ],
    cachedAt: "2026-03-16T09:00:00",
    expiresAt: "2026-03-17T09:00:00",
  },
  MIDDLE: {
    level: "MIDDLE",
    coreSummary:
      "useEffect의 실행 모델은 React의 동시성 렌더링(Concurrent Mode)과 맞물려 복잡해집니다. React 18의 Strict Mode에서 Effect가 두 번 실행되는 이유, useEffect vs useLayoutEffect의 페인트 타이밍 차이, 그리고 커스텀 훅으로 Effect 로직을 분리하는 설계를 이해해야 합니다.",
    keyPoints: [
      "React 18 Strict Mode는 Effect를 두 번 실행해 클린업이 올바른지 검사합니다",
      "useLayoutEffect는 DOM 변경 직후, 브라우저 페인트 전에 동기 실행됩니다",
      "커스텀 훅으로 Effect를 추상화하면 테스트 가능성과 재사용성이 높아집니다",
      "External Store 구독에는 useSyncExternalStore를 사용하는 것이 권장됩니다",
    ],
    keywords: ["Concurrent Mode", "Strict Mode", "useLayoutEffect", "useSyncExternalStore", "커스텀 훅"],
    difficulty: "어려움",
    nextRecommendation:
      "React 공식 문서의 'Synchronizing with Effects' 와 'You Might Not Need an Effect' 섹션을 읽고, Effect가 필요 없는 케이스를 정리해보세요.",
    confidence: 0.88,
    additionalQuestions: [
      "useSyncExternalStore와 useEffect를 이용한 구독 패턴은 어떻게 다른가요?",
      "Effect 내에서 발생하는 경쟁 조건(race condition)을 어떻게 해결하나요?",
      "Suspense와 useEffect의 실행 순서는 어떻게 보장되나요?",
    ],
    cachedAt: "2026-03-16T09:00:00",
    expiresAt: "2026-03-17T09:00:00",
  },
  SENIOR: {
    level: "SENIOR",
    coreSummary:
      "useEffect는 React의 렌더링 모델에서 외부 세계와 동기화하는 탈출구(escape hatch)입니다. React Compiler(React Forget) 도입 이후 의존성 배열 자동 추론이 가능해졌으나, 여전히 Effect 설계의 본질—'언제 동기화할 것인가'—를 이해하지 못하면 아키텍처 수준의 버그가 발생합니다. 서버 컴포넌트 환경에서는 Effect 자체가 실행되지 않으므로, 데이터 패칭 로직을 Effect에 의존하는 설계는 RSC 마이그레이션 시 전면 재작성이 필요합니다.",
    keyPoints: [
      "React Compiler는 의존성 배열을 자동 추론하지만 Effect의 목적과 설계는 개발자 책임입니다",
      "RSC 환경에서 useEffect는 실행되지 않으므로, Effect 기반 데이터 패칭은 서버 컴포넌트 전환 시 장벽이 됩니다",
      "Effect 내 비동기 로직은 AbortController + 제너레이터 패턴으로 복잡한 취소 시나리오를 처리할 수 있습니다",
      "Effect profiling: React DevTools의 'Why did this render?' 와 함께 불필요한 Effect 재실행을 측정·최적화하세요",
    ],
    keywords: ["React Compiler", "RSC", "AbortController", "탈출구 패턴", "동기화 모델", "Effect profiling"],
    difficulty: "매우 어려움",
    nextRecommendation:
      "React 팀의 RFC: React without memo를 읽고, React Compiler가 Effect 의존성 분석에 미치는 영향을 정리해보세요.",
    confidence: 0.85,
    additionalQuestions: [
      "useEffect 기반 데이터 패칭 라이브러리(SWR, TanStack Query)는 RSC 시대에 어떤 방향으로 진화하고 있나요?",
      "Effect 내에서 발생하는 메모리 누수를 프로덕션 환경에서 어떻게 탐지하나요?",
      "React의 '순수 함수 컴포넌트' 원칙과 Effect의 '사이드 이펙트 허용'은 어떻게 공존하나요?",
    ],
    cachedAt: "2026-03-16T09:00:00",
    expiresAt: "2026-03-17T09:00:00",
  },
};

// 재시도 시 반환할 변형 데이터 — cachedAt/expiresAt은 endpoint에서 동적으로 주입
export const MOCK_AI_SUMMARY_RETRIES: Record<AiSummaryLevel, Omit<AiSummary, "contentId" | "cachedAt" | "expiresAt">> = {
  BEGINNER: {
    level: "BEGINNER",
    coreSummary:
      "useEffect를 쉽게 이해하려면 '화면이 바뀐 뒤 해야 할 일을 적어두는 메모장'이라고 생각해보세요. React는 컴포넌트를 그린 뒤 이 메모장을 열어 지시대로 실행합니다.",
    keyPoints: [
      "useEffect 안의 코드는 화면 업데이트 이후에 실행됩니다",
      "의존성 배열 []이면 처음 한 번만, 값을 넣으면 그 값이 바뀔 때마다 실행됩니다",
      "return () => {} 로 타이머·구독 등을 정리할 수 있어요",
      "fetch, setInterval 같은 '외부 연결'은 useEffect 안에서 처리합니다",
    ],
    keywords: ["useEffect", "마운트", "사이드 이펙트", "의존성 배열", "클린업", "렌더링"],
    difficulty: "쉬움",
    nextRecommendation:
      "간단한 카운터에 useEffect로 타이틀(document.title)을 자동 업데이트하는 예제를 만들어보세요.",
    confidence: 0.95,
    additionalQuestions: [
      "useEffect가 두 번 실행된다면 어떤 상황일까요?",
      "cleanup 함수가 없으면 어떤 문제가 생길 수 있나요?",
    ],
  },
  JUNIOR: {
    level: "JUNIOR",
    coreSummary:
      "useEffect를 제대로 쓰려면 '의존성 배열은 거짓말하지 않는다'는 원칙을 지켜야 합니다. 배열 안의 값이 Effect 내부에서 사용하는 모든 외부 값을 반영해야 하며, 이를 어기면 stale closure 버그가 발생합니다. useCallback·useMemo로 함수/객체 참조를 안정화하면 불필요한 재실행을 막을 수 있습니다.",
    keyPoints: [
      "의존성 배열에서 값을 임의로 빼면 stale closure가 발생합니다 — ESLint가 경고합니다",
      "함수를 의존성으로 쓸 때는 useCallback으로 참조를 고정하세요",
      "객체/배열 리터럴은 매 렌더마다 새 참조가 생성되므로 의존성으로 직접 쓰지 마세요",
      "AbortController를 사용하면 비동기 요청의 클린업을 간결하게 처리할 수 있습니다",
    ],
    keywords: ["stale closure", "useCallback", "의존성 안정화", "AbortController", "exhaustive-deps"],
    difficulty: "보통",
    nextRecommendation:
      "커스텀 훅 useFetch를 직접 만들어 보면 Effect, 클린업, AbortController를 한 번에 연습할 수 있습니다.",
    confidence: 0.94,
    additionalQuestions: [
      "useCallback 없이 함수를 useEffect 의존성에 넣으면 어떻게 되나요?",
      "의존성 배열에 전체 객체 대신 필요한 속성만 넣으면 어떤 이점이 있나요?",
      "React DevTools에서 Effect 실행 횟수를 어떻게 추적할 수 있나요?",
    ],
  },
  MIDDLE: {
    level: "MIDDLE",
    coreSummary:
      "React 18의 동시성 렌더링 환경에서 useEffect는 더 이상 '렌더 후 한 번' 실행을 보장하지 않습니다. Strict Mode의 이중 실행, Suspense 경계에서의 Effect 취소·재실행을 이해하고 설계해야 합니다. Effect를 커스텀 훅으로 추상화하는 것은 단순한 패턴이 아니라, 테스트 가능성과 동시성 안전성을 높이는 아키텍처 결정입니다.",
    keyPoints: [
      "Strict Mode 이중 실행은 '클린업이 mount-unmount-remount 사이클을 견디는가'를 검증합니다",
      "useLayoutEffect는 paint 전에 실행되므로 깜빡임 방지에 사용하되, SSR에서 경고가 발생합니다",
      "Effect를 커스텀 훅으로 분리하면 로직 단위 테스트와 Storybook 연동이 용이해집니다",
      "데이터 패칭은 TanStack Query·SWR 같은 라이브러리에 위임하고 useEffect를 직접 쓰지 마세요",
    ],
    keywords: ["Strict Mode", "이중 실행", "useLayoutEffect", "커스텀 훅", "TanStack Query", "동시성 안전"],
    difficulty: "어려움",
    nextRecommendation:
      "'You Might Not Need an Effect' — React 공식 문서 챕터를 읽고 Effect를 제거할 수 있는 패턴 5가지를 정리해보세요.",
    confidence: 0.91,
    additionalQuestions: [
      "useEffect에서 setState를 호출하는 패턴은 언제 문제가 되나요?",
      "Suspense와 함께 사용할 때 Effect 실행 타이밍이 달라지는 이유는 무엇인가요?",
      "커스텀 훅으로 분리한 Effect를 어떻게 단위 테스트하나요?",
    ],
  },
  SENIOR: {
    level: "SENIOR",
    coreSummary:
      "useEffect는 'React 외부 시스템과의 동기화'라는 단 하나의 목적을 위해 존재합니다. 이 원칙에서 벗어난 Effect는 대부분 파생 상태 계산, 이벤트 핸들러, 또는 서버 데이터 패칭으로 대체할 수 있습니다. React Compiler가 memoization을 자동화하면서 의존성 배열의 관리 부담은 줄었지만, Effect의 설계 책임은 여전히 개발자에게 있습니다.",
    keyPoints: [
      "Effect는 '외부 시스템 동기화'용 — 파생 상태 계산·이벤트 응답에 쓰면 안 됩니다",
      "React Compiler 환경에서도 Effect의 시맨틱(목적·클린업)은 개발자가 정의해야 합니다",
      "useOptimistic, useTransition과 Effect를 조합하면 낙관적 업데이트 패턴을 구현할 수 있습니다",
      "Next.js App Router에서 Effect 기반 데이터 패칭은 RSC 전환 시 완전 재작성이 필요합니다",
    ],
    keywords: ["외부 동기화", "React Compiler", "useOptimistic", "useTransition", "RSC", "탈출구"],
    difficulty: "매우 어려움",
    nextRecommendation:
      "React 18 Working Group의 'Strict Effects' 논의와 React Compiler 베타 문서를 읽고, Effect 자동 최적화의 한계를 분석해보세요.",
    confidence: 0.88,
    additionalQuestions: [
      "useOptimistic과 useEffect를 함께 쓸 때 발생할 수 있는 경쟁 조건은 무엇인가요?",
      "React Compiler가 Effect 의존성을 잘못 추론하는 케이스가 있나요?",
      "'Effect는 탈출구다'라는 원칙을 팀 코드 리뷰에서 어떻게 기준으로 삼을 수 있나요?",
    ],
  },
};
