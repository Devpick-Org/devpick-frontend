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
      .get<ContentQuizResponse>(`/contents/${contentId}/quiz`, {
        params: { level },
      })
      .then((r) => r.data);
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
