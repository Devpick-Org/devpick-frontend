import { apiClient } from "../client";
import type {
  ContentQuizResponse,
  QuizSubmitRequest,
  QuizSubmitResponse,
  QuizLevel,
} from "@/types/quiz";

export const quizzesEndpoints = {
  /** GET /contents/:contentId/quiz?level=... */
  getContentQuiz: (
    contentId: string,
    level: QuizLevel = "JUNIOR",
  ): Promise<ContentQuizResponse> => {
    return apiClient
      .get(`/contents/${contentId}/quiz`, { params: { level } })
      .then((r) => {
        // 202: AI 처리 대기 중 (success: false) → reject으로 에러 흐름에 합류
        if (!(r.data as { success: boolean }).success) {
          return Promise.reject({ response: r });
        }
        return r.data as ContentQuizResponse;
      });
  },

  /** POST /contents/:contentId/quiz/submit */
  submitQuiz: (
    contentId: string,
    request: QuizSubmitRequest,
  ): Promise<QuizSubmitResponse> => {
    return apiClient
      .post<QuizSubmitResponse>(
        `/contents/${contentId}/quiz/submit`,
        request,
      )
      .then((r) => r.data);
  },
};
