import type { QuizQuestion, QuizAnswer } from "@/types/quiz";

export interface QuizResultSummary {
  correctCount: number;
  totalQuestions: number;
  passed: boolean;
}

/**
 * 퀴즈 정답 수, 통과 여부를 계산하는 순수 함수.
 * 컴포넌트 및 API 연동 여부와 무관하게 재사용 가능.
 */
export function calculateQuizResult(
  questions: QuizQuestion[],
  answers: QuizAnswer[],
  passingCount: number,
): QuizResultSummary {
  const correctCount = questions.filter((q) => {
    const answer = answers.find((a) => a.questionId === q.id);
    return answer?.selectedOptionId === q.correctOptionId;
  }).length;

  return {
    correctCount,
    totalQuestions: questions.length,
    passed: correctCount >= passingCount,
  };
}
