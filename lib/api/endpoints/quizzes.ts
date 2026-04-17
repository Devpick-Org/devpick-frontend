import { apiClient } from "../client";
import { normalizeQuizLevel } from "@/lib/content/normalizeAiLevel";
import type {
  ContentQuiz,
  ContentQuizResponse,
  QuizSubmitRequest,
  QuizSubmitResponse,
  QuizLevel,
} from "@/types/quiz";

export const quizzesEndpoints = {
  /**
   * GET /contents/:contentId/quiz (DP-352)
   * - `level` 생략 시 백엔드가 프로필 경력 수준으로 해석 (비로그인은 JUNIOR).
   * - 인트로에서 난이도를 바꾼 뒤에는 해당 `level`을 명시한다.
   */
  getContentQuiz: (
    contentId: string,
    level?: QuizLevel,
  ): Promise<ContentQuizResponse> => {
    return apiClient
      .get(`/contents/${contentId}/quiz`, {
        ...(level !== undefined ? { params: { level } } : {}),
      })
      .then((r) => {
        // 202: AI 처리 대기 중 (success: false) → reject으로 에러 흐름에 합류
        if (!(r.data as { success: boolean }).success) {
          return Promise.reject({ response: r });
        }
        const raw = r.data as ContentQuizResponse;
        const data: ContentQuiz = {
          ...raw.data,
          level: normalizeQuizLevel(raw.data.level),
        };
        return { ...raw, data } as ContentQuizResponse;
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
