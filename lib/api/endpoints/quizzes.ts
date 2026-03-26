import type { ContentQuizResponse } from "@/types/quiz";
import { MOCK_QUIZZES } from "@/lib/mock/quizzes";

export const quizzesEndpoints = {
  /** GET /contents/:contentId/quiz — 콘텐츠 기반 AI 퀴즈 조회 */
  getContentQuiz: (contentId: string): Promise<ContentQuizResponse> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const quiz = MOCK_QUIZZES[contentId];
        if (!quiz) {
          reject({
            response: {
              data: {
                error: {
                  code: "QUIZ_001",
                  message: "퀴즈를 찾을 수 없습니다.",
                },
              },
            },
          });
          return;
        }
        resolve({ success: true, data: quiz, message: "요청이 성공했습니다" });
      }, 600);
    });
  },
};
