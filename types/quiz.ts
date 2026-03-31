import type { ApiResponse } from "./api";

export type QuizLevel = "BEGINNER" | "JUNIOR" | "MIDDLE" | "SENIOR";

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
  level: QuizLevel;
  questions: QuizQuestion[];
  passingCount: number;
  estimatedMinutes: number;
  cachedAt: string;
  expiresAt: string;
  hasAttempted: boolean;
  lastPassed: boolean | null;
  lastScore: number | null;
  lastTotalQuestions: number | null;
}

export type ContentQuizResponse = ApiResponse<ContentQuiz>;

// ─── Submit ───────────────────────────────────────────────────────────────────

export interface QuizSubmitRequest {
  level: QuizLevel;
  score: number;
  totalQuestions: number;
  passed: boolean;
}

export interface QuizSubmitResult {
  passed: boolean;
  score: number;
  totalQuestions: number;
  pointsEarned: number;
}

export type QuizSubmitResponse = ApiResponse<QuizSubmitResult>;

// ─── 로컬 상태 타입 ────────────────────────────────────────────────────────────

export type QuizStage = "intro" | "quiz" | "result";

export interface QuizAnswer {
  questionId: string;
  selectedOptionId: string;
}
