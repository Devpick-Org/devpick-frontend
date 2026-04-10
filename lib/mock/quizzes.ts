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
    passingCount: 2,
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
          { id: "e", text: "null 배열에서 length를 읽을 때" },
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
          { id: "e", text: "NullObject" },
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
          { id: "e", text: "-XX:+NullPointerDetails" },
        ],
        correctOptionId: "b",
        explanation:
          "-XX:+ShowCodeDetailsInExceptionMessages 옵션을 사용하면 NPE 발생 시 어떤 변수가 null인지 구체적인 메시지를 출력합니다. Java 17부터는 기본 활성화됩니다.",
      },
    ],
  },
  "c-001": {
    title: "React useEffect 완전 정복",
    estimatedMinutes: 3,
    passingCount: 2,
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
          { id: "e", text: "props가 변경될 때마다 실행된다" },
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
          { id: "e", text: "DOM 업데이트가 필요할 때" },
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
          { id: "e", text: "리액트가 렌더링을 최적화하기 때문" },
        ],
        correctOptionId: "b",
        explanation:
          "count를 의존성으로 등록하면 count 변경 시 effect가 실행됩니다. effect가 setCount로 count를 변경하면 다시 effect가 실행되는 무한 루프가 발생합니다.",
      },
    ],
  },
  "c-003": {
    title: "TypeScript 제네릭 완벽 가이드",
    estimatedMinutes: 3,
    passingCount: 2,
    questions: [
      {
        id: "q1",
        question: "다음 중 제네릭 함수의 올바른 선언 방법은?",
        options: [
          { id: "a", text: "function identity(arg: T): T { return arg; }" },
          { id: "b", text: "function identity<T>(arg: T): T { return arg; }" },
          { id: "c", text: "function identity<T>(arg: any): T { return arg; }" },
          { id: "d", text: "function<T> identity(arg: T): T { return arg; }" },
          { id: "e", text: "function identity(T)(arg: T): T { return arg; }" },
        ],
        correctOptionId: "b",
        explanation:
          "제네릭 함수는 함수 이름 뒤에 <T>를 붙여 타입 파라미터를 선언합니다. 이를 통해 호출 시점에 구체적인 타입이 결정됩니다.",
      },
      {
        id: "q2",
        question: "제네릭 타입 제약(constraints)을 사용하는 키워드는?",
        options: [
          { id: "a", text: "implements" },
          { id: "b", text: "extends" },
          { id: "c", text: "of" },
          { id: "d", text: "satisfies" },
          { id: "e", text: "where" },
        ],
        correctOptionId: "b",
        explanation:
          "<T extends SomeType>처럼 extends를 사용해 T가 특정 타입의 구조를 만족해야 한다는 제약을 걸 수 있습니다.",
      },
      {
        id: "q3",
        question: "keyof 연산자와 제네릭을 함께 사용할 때의 설명으로 옳은 것은?",
        options: [
          { id: "a", text: "keyof T는 T의 모든 값 타입을 유니온으로 반환한다" },
          { id: "b", text: "keyof T는 T의 모든 키 이름을 유니온 타입으로 반환한다" },
          { id: "c", text: "keyof는 제네릭과 함께 사용할 수 없다" },
          { id: "d", text: "keyof T는 항상 string 타입을 반환한다" },
          { id: "e", text: "keyof T는 T의 첫 번째 키만 반환한다" },
        ],
        correctOptionId: "b",
        explanation:
          "keyof T는 T의 모든 키 이름을 문자열 리터럴 유니온 타입으로 반환합니다. 예: keyof { a: number; b: string }은 'a' | 'b'가 됩니다.",
      },
    ],
  },
  "c-007": {
    title: "Docker Compose로 로컬 개발 환경 구축하기",
    estimatedMinutes: 3,
    passingCount: 2,
    questions: [
      {
        id: "q1",
        question: "docker-compose.yml에서 여러 컨테이너 간 통신을 가능하게 하는 설정은?",
        options: [
          { id: "a", text: "volumes" },
          { id: "b", text: "networks" },
          { id: "c", text: "depends_on" },
          { id: "d", text: "ports" },
          { id: "e", text: "links" },
        ],
        correctOptionId: "b",
        explanation:
          "networks를 사용하면 같은 네트워크에 속한 컨테이너끼리 서비스 이름으로 통신할 수 있습니다. Docker Compose는 기본적으로 모든 서비스를 같은 네트워크에 연결합니다.",
      },
      {
        id: "q2",
        question: "depends_on 옵션의 동작으로 올바른 것은?",
        options: [
          { id: "a", text: "의존 서비스가 완전히 준비될 때까지 기다린 후 시작한다" },
          { id: "b", text: "의존 서비스 컨테이너가 시작된 후 해당 컨테이너를 시작한다" },
          { id: "c", text: "의존 서비스와 동시에 시작한다" },
          { id: "d", text: "의존 서비스가 종료된 후 시작한다" },
          { id: "e", text: "의존 서비스가 healthy 상태가 될 때까지 기다린다" },
        ],
        correctOptionId: "b",
        explanation:
          "depends_on은 컨테이너 시작 순서만 보장하며, 서비스가 실제로 준비(healthy)됐는지는 보장하지 않습니다. 완전한 준비 대기가 필요하면 healthcheck와 condition: service_healthy를 함께 사용해야 합니다.",
      },
      {
        id: "q3",
        question: "호스트 디렉토리를 컨테이너에 마운트하는 설정은?",
        options: [
          { id: "a", text: "ports" },
          { id: "b", text: "environment" },
          { id: "c", text: "volumes" },
          { id: "d", text: "networks" },
          { id: "e", text: "expose" },
        ],
        correctOptionId: "c",
        explanation:
          "volumes를 사용해 ./host-dir:/container-dir 형식으로 호스트 경로를 컨테이너에 마운트할 수 있습니다. 코드 변경 사항을 컨테이너에 실시간 반영할 때 주로 사용합니다.",
      },
    ],
  },
  "mock-001": {
    title: "React useEffect 이해 확인",
    estimatedMinutes: 3,
    passingCount: 2,
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
          { id: "e", text: "props가 변경될 때마다 실행된다" },
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
          { id: "e", text: "DOM 업데이트가 필요할 때" },
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
          { id: "e", text: "리액트가 렌더링을 최적화하기 때문" },
        ],
        correctOptionId: "b",
        explanation:
          "count를 의존성으로 등록하면 count 변경 시 effect가 실행됩니다. effect가 setCount로 count를 변경하면 다시 effect가 실행되는 무한 루프가 발생합니다.",
      },
    ],
  },
};
