import type { ApiResponse } from "./api";

export type QuizLevel = "BEGINNER" | "JUNIOR" | "MIDDLE" | "SENIOR";
export type QuizQuestionType = "multiple_choice" | "short_answer";

export interface QuizOption {
  id: string;
  text: string;
}

interface BaseQuizQuestion {
  id: string;
  type: QuizQuestionType;
  question: string;
  explanation: string;
}

export interface MultipleChoiceQuestion extends BaseQuizQuestion {
  type: "multiple_choice";
  options: QuizOption[];
  correctOptionId: string;
}

export interface ShortAnswerQuestion extends BaseQuizQuestion {
  type: "short_answer";
  correctAnswer: string;
}

export type QuizQuestion = MultipleChoiceQuestion | ShortAnswerQuestion;

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

export type QuizAnswer =
  | { type: "multiple_choice"; questionId: string; selectedOptionId: string | null }
  | { type: "short_answer"; questionId: string; answerText: string };

export type QuizAnswers = Record<string, QuizAnswer>;
