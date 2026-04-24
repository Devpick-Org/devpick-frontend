import type { QuizLevel } from "@/types/quiz";

export interface MyPageQuizHistory {
  attemptId: string;
  contentId: string;
  contentTitle: string;
  thumbnail?: string | null;
  preview?: string;
  level: QuizLevel;
  score: number;
  totalQuestions: number;
  passed: boolean;
  attemptedAt: string;
}

export interface MyPageScrap {
  id: string;
  contentId: string;
  title: string;
  sourceName: string;
  thumbnail: string | null;
  createdAt: string;
  summary?: string;
}
