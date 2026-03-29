import type { ApiResponse } from "./api";

export interface QuizOption {
  id: string;
  text: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: QuizOption[];
  correctOptionId: string;
  explanation: string;
}

export interface ContentQuiz {
  contentId: string;
  title: string;
  questions: QuizQuestion[];
  passingCount: number; // 통과 기준 정답 수 (예: 3문제 이상 맞으면 통과)
  estimatedMinutes: number;
}

export type ContentQuizResponse = ApiResponse<ContentQuiz>;

// ─── 로컬 상태 타입 ────────────────────────────────────────────────────────────

export type QuizStage = "intro" | "quiz" | "result";

export interface QuizAnswer {
  questionId: string;
  selectedOptionId: string;
}
