import { calculateQuizResult, isShortAnswerCorrect } from "./quizResult";
import type { QuizQuestion, QuizAnswers } from "@/types/quiz";

const QUESTIONS: QuizQuestion[] = [
  {
    id: "q1",
    type: "multiple_choice",
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
    type: "multiple_choice",
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
    type: "short_answer",
    question: "질문 3",
    correctAnswer: "정답",
    explanation: "설명 3",
  },
];

describe("calculateQuizResult", () => {
  it("일부만 맞춘 경우 정답 수와 미통과를 반환한다", () => {
    // given
    const answers: QuizAnswers = {
      q1: { type: "multiple_choice", questionId: "q1", selectedOptionId: "a" }, // 정답
      q2: { type: "multiple_choice", questionId: "q2", selectedOptionId: "a" }, // 오답
      q3: { type: "short_answer", questionId: "q3", answerText: "틀린답" },    // 오답
    };
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
    const answers: QuizAnswers = {
      q1: { type: "multiple_choice", questionId: "q1", selectedOptionId: "a" }, // 정답
      q2: { type: "multiple_choice", questionId: "q2", selectedOptionId: "b" }, // 정답
      q3: { type: "short_answer", questionId: "q3", answerText: "정답" },       // 정답
    };
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
    const answers: QuizAnswers = {
      q1: { type: "multiple_choice", questionId: "q1", selectedOptionId: "a" }, // 정답
      // q2, q3 미응답
    };
    const passingCount = 2;

    // when
    const result = calculateQuizResult(QUESTIONS, answers, passingCount);

    // then
    expect(result.correctCount).toBe(1);
    expect(result.passed).toBe(false);
  });

  it("주관식 채점 시 앞뒤 공백을 무시한다", () => {
    // given
    const answers: QuizAnswers = {
      q1: { type: "multiple_choice", questionId: "q1", selectedOptionId: "a" }, // 정답
      q2: { type: "multiple_choice", questionId: "q2", selectedOptionId: "b" }, // 정답
      q3: { type: "short_answer", questionId: "q3", answerText: "  정답  " },   // 공백 포함 정답
    };
    const passingCount = 2;

    // when
    const result = calculateQuizResult(QUESTIONS, answers, passingCount);

    // then
    expect(result.correctCount).toBe(3);
    expect(result.passed).toBe(true);
  });
});

describe("isShortAnswerCorrect", () => {
  it("대소문자를 무시한다", () => {
    expect(isShortAnswerCorrect("Cleanup", "cleanup")).toBe(true);
    expect(isShortAnswerCorrect("EXTENDS", "extends")).toBe(true);
  });

  it("앞뒤 공백을 무시한다", () => {
    expect(isShortAnswerCorrect("  cleanup  ", "cleanup")).toBe(true);
  });

  it("다른 답안은 오답으로 처리한다", () => {
    expect(isShortAnswerCorrect("volumes", "networks")).toBe(false);
  });

  it("연속 공백을 하나의 공백으로 정규화한다", () => {
    expect(isShortAnswerCorrect("clean   up", "clean up")).toBe(true);
    expect(isShortAnswerCorrect("docker  compose", "docker compose")).toBe(true);
  });
});
