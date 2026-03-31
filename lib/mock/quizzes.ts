import type { QuizQuestion } from "@/types/quiz";

// API 응답 래핑 없는 원본 퀴즈 데이터.
// level 필드 및 attempt 메타데이터는 quizzesEndpoints에서 동적으로 추가.
export interface MockQuizBase {
  title: string;
  questions: QuizQuestion[];
  passingCount: number;
  estimatedMinutes: number;
}

export const MOCK_QUIZ_BASES: Record<string, MockQuizBase> = {
  "so-001": {
    title: "Java NullPointerException 이해 확인",
    estimatedMinutes: 3,
    passingCount: 3, // 4문제 중 3개 이상 정답
    questions: [
      {
        id: "q1",
        question:
          "NullPointerException(NPE)이 발생하는 원인으로 올바르지 않은 것은?",
        options: [
          { id: "a", text: "null 객체의 메서드를 호출했을 때" },
          { id: "b", text: "null인 기본형 래퍼 타입을 언박싱할 때" },
          { id: "c", text: "정수를 0으로 나눌 때" },
          { id: "d", text: "null 객체의 필드에 접근할 때" },
        ],
        correctOptionId: "c",
        explanation:
          "0으로 나누는 연산은 ArithmeticException을 발생시킵니다. NullPointerException은 null 참조를 역참조(dereference)할 때 발생합니다.",
      },
      {
        id: "q2",
        question:
          "Java 8 이상에서 null을 안전하게 처리하기 위해 사용할 수 있는 클래스는?",
        options: [
          { id: "a", text: "Optional" },
          { id: "b", text: "Nullable" },
          { id: "c", text: "SafeRef" },
          { id: "d", text: "NullSafe" },
        ],
        correctOptionId: "a",
        explanation:
          "Optional은 Java 8에 도입된 컨테이너 클래스로, 값이 존재할 수도 있고 없을 수도 있는 상황을 명시적으로 표현합니다. Optional.ofNullable()로 null을 감싸고 ifPresent() 등으로 안전하게 처리할 수 있습니다.",
      },
      {
        id: "q3",
        question:
          "Java 14에서 도입된 Helpful NullPointerException을 Java 17 이전 버전에서 활성화하는 JVM 옵션은?",
        options: [
          { id: "a", text: "-XX:+EnableHelpfulNPE" },
          { id: "b", text: "-XX:+ShowCodeDetailsInExceptionMessages" },
          { id: "c", text: "-XX:+VerboseNullPointer" },
          { id: "d", text: "-XX:+DetailedExceptions" },
        ],
        correctOptionId: "b",
        explanation:
          "-XX:+ShowCodeDetailsInExceptionMessages 옵션을 사용하면 NPE 발생 시 어떤 변수가 null인지 구체적인 메시지를 출력합니다. Java 17부터는 기본 활성화됩니다.",
      },
      {
        id: "q4",
        question:
          "메서드 진입 시점에서 즉시 null을 검증하고 명확한 메시지와 함께 NPE를 발생시키는 방법은?",
        options: [
          {
            id: "a",
            text: "if (param == null) throw new RuntimeException()",
          },
          { id: "b", text: "assert param != null" },
          { id: "c", text: "Objects.requireNonNull(param, \"메시지\")" },
          { id: "d", text: "Optional.of(param)" },
        ],
        correctOptionId: "c",
        explanation:
          "Objects.requireNonNull()은 null이면 지정한 메시지와 함께 NullPointerException을 즉시 던집니다. 로직 깊숙한 곳이 아닌 진입 시점에서 빠르게 실패(fail-fast)하므로 원인 추적이 훨씬 쉬워집니다.",
      },
    ],
  },
  "mock-001": {
    title: "React useEffect 이해 확인",
    estimatedMinutes: 3,
    passingCount: 2, // 3문제 중 2개 이상 정답
    questions: [
      {
        id: "q1",
        question:
          "useEffect의 의존성 배열을 빈 배열([])로 전달하면 어떻게 동작하나요?",
        options: [
          { id: "a", text: "컴포넌트가 렌더링될 때마다 실행된다" },
          { id: "b", text: "컴포넌트가 마운트될 때 한 번만 실행된다" },
          { id: "c", text: "절대 실행되지 않는다" },
          { id: "d", text: "컴포넌트가 언마운트될 때만 실행된다" },
        ],
        correctOptionId: "b",
        explanation:
          "의존성 배열이 빈 배열이면 useEffect는 컴포넌트가 처음 마운트될 때 한 번만 실행됩니다. componentDidMount와 동일한 동작입니다.",
      },
      {
        id: "q2",
        question: "useEffect에서 cleanup 함수를 반환해야 하는 경우는?",
        options: [
          { id: "a", text: "API 호출을 할 때" },
          { id: "b", text: "상태를 업데이트할 때" },
          {
            id: "c",
            text: "이벤트 리스너, 타이머, 구독 등 사이드 이펙트를 해제해야 할 때",
          },
          { id: "d", text: "항상 반환해야 한다" },
        ],
        correctOptionId: "c",
        explanation:
          "cleanup 함수는 컴포넌트 언마운트 또는 다음 effect 실행 전에 호출됩니다. 이벤트 리스너 제거, 타이머 해제, WebSocket 연결 해제 등 메모리 누수를 방지하는 데 사용합니다.",
      },
      {
        id: "q3",
        question:
          "아래 코드에서 무한 루프가 발생하는 이유는?\n\nuseEffect(() => { setCount(count + 1); }, [count]);",
        options: [
          { id: "a", text: "setCount를 useEffect 안에서 호출했기 때문" },
          {
            id: "b",
            text: "count가 변경될 때마다 effect가 실행되고, effect가 count를 변경하는 순환이 발생하기 때문",
          },
          { id: "c", text: "의존성 배열에 count를 넣었기 때문" },
          { id: "d", text: "useEffect는 동기적으로 실행되기 때문" },
        ],
        correctOptionId: "b",
        explanation:
          "count를 의존성으로 등록하면 count 변경 시 effect가 실행됩니다. effect가 setCount로 count를 변경하면 다시 effect가 실행되는 무한 루프가 발생합니다.",
      },
    ],
  },
};
