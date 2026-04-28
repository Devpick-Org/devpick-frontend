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
  contentId: string;
  title: string;
  sourceName: string;
  thumbnail: string | null;
  summary: string | null;
  createdAt: string;
}

export interface MyPageScrapResponse {
  content: MyPageScrap[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface MyPageRecommendHomePost {
  contentId: string;
  title: string;
  sourceName: string;
  thumbnail: string | null;
  summary?: string;
  date: string;
}

export interface MyPageRecommendVideo {
  videoId: string;
  title: string;
  channelName: string;
  thumbnail: string | null;
  url: string;
  duration: string;
  views: number;
  uploadedAt: string;
}

export interface MyPageRecommendBook {
  bookId: string;
  title: string;
  authors: string[];
  description?: string;
  cover: string | null;
  url: string;
  price?: number;
  publisher: string;
  publishedAt: string;
}
