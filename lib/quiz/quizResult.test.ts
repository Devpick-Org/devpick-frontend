import { calculateQuizResult } from "./quizResult";
import type { QuizQuestion, QuizAnswer } from "@/types/quiz";

const QUESTIONS: QuizQuestion[] = [
  {
    id: "q1",
    question: "질문 1",
    options: [
      { id: "a", text: "보기 A" },
      { id: "b", text: "보기 B" },
    ],
    correctOptionId: "a",
    explanation: "설명 1",
  },
  {
    id: "q2",
    question: "질문 2",
    options: [
      { id: "a", text: "보기 A" },
      { id: "b", text: "보기 B" },
    ],
    correctOptionId: "b",
    explanation: "설명 2",
  },
  {
    id: "q3",
    question: "질문 3",
    options: [
      { id: "a", text: "보기 A" },
      { id: "b", text: "보기 B" },
    ],
    correctOptionId: "a",
    explanation: "설명 3",
  },
];

describe("calculateQuizResult", () => {
  it("일부만 맞춘 경우 정답 수와 미통과를 반환한다", () => {
    // given
    const answers: QuizAnswer[] = [
      { questionId: "q1", selectedOptionId: "a" }, // 정답
      { questionId: "q2", selectedOptionId: "a" }, // 오답
      { questionId: "q3", selectedOptionId: "b" }, // 오답
    ];
    const passingCount = 2;

    // when
    const result = calculateQuizResult(QUESTIONS, answers, passingCount);

    // then
    expect(result.correctCount).toBe(1);
    expect(result.totalQuestions).toBe(3);
    expect(result.passed).toBe(false);
  });

  it("passingCount 이상 맞춘 경우 통과를 반환한다", () => {
    // given
    const answers: QuizAnswer[] = [
      { questionId: "q1", selectedOptionId: "a" }, // 정답
      { questionId: "q2", selectedOptionId: "b" }, // 정답
      { questionId: "q3", selectedOptionId: "a" }, // 정답
    ];
    const passingCount = 2;

    // when
    const result = calculateQuizResult(QUESTIONS, answers, passingCount);

    // then
    expect(result.correctCount).toBe(3);
    expect(result.totalQuestions).toBe(3);
    expect(result.passed).toBe(true);
  });

  it("답변이 없는 문제는 오답으로 처리한다", () => {
    // given
    const answers: QuizAnswer[] = [
      { questionId: "q1", selectedOptionId: "a" }, // 정답
      // q2, q3 미응답
    ];
    const passingCount = 2;

    // when
    const result = calculateQuizResult(QUESTIONS, answers, passingCount);

    // then
    expect(result.correctCount).toBe(1);
    expect(result.passed).toBe(false);
  });
});
