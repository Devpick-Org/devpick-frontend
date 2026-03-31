import type {
  ContentQuizResponse,
  QuizSubmitRequest,
  QuizSubmitResponse,
  QuizLevel,
} from "@/types/quiz";
import { MOCK_QUIZ_BASES } from "@/lib/mock/quizzes";

// ─── 모듈 레벨 인메모리 상태 (페이지 리로드 시 초기화) ─────────────────────────

interface AttemptRecord {
  passed: boolean;
  score: number;
  totalQuestions: number;
}

// key: `${contentId}__${level}`
const attemptStore = new Map<string, AttemptRecord>();
// 최초 통과 여부 추적 — 재풀기 시 포인트 중복 지급 방지
const firstPassStore = new Set<string>();

// ─── endpoints ────────────────────────────────────────────────────────────────

export const quizzesEndpoints = {
  /** GET /contents/:contentId/quiz?level=...
   * TODO: API 연동 시 아래 Promise/setTimeout 블록을 제거하고 아래 axios 호출로 교체
   * return apiClient.get(`/contents/${contentId}/quiz`, { params: { level } });
   */
  getContentQuiz: (
    contentId: string,
    level: QuizLevel = "JUNIOR",
  ): Promise<ContentQuizResponse> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const base = MOCK_QUIZ_BASES[contentId];
        if (!base) {
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

        const attemptKey = `${contentId}__${level}`;
        const attempt = attemptStore.get(attemptKey);

        const now = new Date();
        const expires = new Date(now.getTime() + 24 * 60 * 60 * 1000);

        resolve({
          success: true,
          data: {
            contentId,
            title: base.title,
            level,
            questions: base.questions,
            passingCount: base.passingCount,
            estimatedMinutes: base.estimatedMinutes,
            cachedAt: now.toISOString(),
            expiresAt: expires.toISOString(),
            hasAttempted: !!attempt,
            lastPassed: attempt?.passed ?? null,
            lastScore: attempt?.score ?? null,
            lastTotalQuestions: attempt?.totalQuestions ?? null,
          },
          message: "요청이 성공했습니다",
        });
      }, 600);
    });
  },

  /** POST /contents/:contentId/quiz/submit
   * TODO: API 연동 시 아래 Promise/setTimeout 블록을 제거하고 아래 axios 호출로 교체
   * return apiClient.post(`/contents/${contentId}/quiz/submit`, request);
   */
  submitQuiz: (
    contentId: string,
    request: QuizSubmitRequest,
  ): Promise<QuizSubmitResponse> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const attemptKey = `${contentId}__${request.level}`;

        // 시도 기록 갱신
        attemptStore.set(attemptKey, {
          passed: request.passed,
          score: request.score,
          totalQuestions: request.totalQuestions,
        });

        // 통과 시 최초 1회만 포인트 지급
        let pointsEarned = 0;
        if (request.passed && !firstPassStore.has(attemptKey)) {
          pointsEarned = 5;
          firstPassStore.add(attemptKey);
        }

        resolve({
          success: true,
          data: {
            passed: request.passed,
            score: request.score,
            totalQuestions: request.totalQuestions,
            pointsEarned,
          },
          message: "요청이 성공했습니다",
        });
      }, 400);
    });
  },
};
