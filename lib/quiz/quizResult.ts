import type { QuizQuestion, QuizAnswer, QuizAnswers } from "@/types/quiz";

export interface QuizResultSummary {
  correctCount: number;
  totalQuestions: number;
  passed: boolean;
}

export function normalizeShortAnswer(text: string): string {
  return text.trim().toLowerCase().replace(/\s+/g, " ");
}

export function isShortAnswerCorrect(
  userAnswer: string,
  correctAnswer: string,
): boolean {
  return normalizeShortAnswer(userAnswer) === normalizeShortAnswer(correctAnswer);
}

export function isQuestionCorrect(
  question: QuizQuestion,
  answer: QuizAnswer | undefined,
): boolean {
  if (!answer) return false;
  if (question.type === "multiple_choice" && answer.type === "multiple_choice") {
    return (
      answer.selectedOptionId !== null &&
      answer.selectedOptionId === question.correctOptionId
    );
  }
  if (question.type === "short_answer" && answer.type === "short_answer") {
    return isShortAnswerCorrect(answer.answerText, question.correctAnswer);
  }
  return false;
}

/**
 * 퀴즈 정답 수, 통과 여부를 계산하는 순수 함수.
 * 컴포넌트 및 API 연동 여부와 무관하게 재사용 가능.
 */
export function calculateQuizResult(
  questions: QuizQuestion[],
  answers: QuizAnswers,
  passingCount: number,
): QuizResultSummary {
  const correctCount = questions.filter((q) =>
    isQuestionCorrect(q, answers[q.id]),
  ).length;

  return {
    correctCount,
    totalQuestions: questions.length,
    passed: correctCount >= passingCount,
  };
}
