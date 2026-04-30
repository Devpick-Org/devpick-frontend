import type { QuizLevel } from "@/types/quiz";

export interface MyPageQuizHistory {
  attemptId: string;
  contentId: string;
  contentTitle: string;
  thumbnail?: string | null;
  preview?: string | null;
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

export interface MyPageQuizHistoryResponse {
  content: MyPageQuizHistory[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface QuizHistoryDetailQuestion {
  id: string;
  type: "multiple_choice" | "short_answer";
  question: string;
  options: { id: string; text: string }[];
  correctOptionId: string;
  explanation: string;
  correctAnswer: string;
}

export interface QuizHistoryMyAnswer {
  questionId: string;
  selectedOptionId: string | null;
  answerText: string | null;
  isCorrect: boolean;
}

export interface QuizHistoryDetail {
  attemptId: string;
  contentId: string;
  score: number;
  totalQuestions: number;
  passed: boolean;
  pointsEarned: number;
  questions: QuizHistoryDetailQuestion[] | null;
  passingCount: number;
  myAnswers: QuizHistoryMyAnswer[];
}

export interface MyPageRecommendHomePost {
  id: string;
  title: string;
  translatedTitle: string | null;
  author: string | null;
  sourceName: string;
  preview: string | null;
  thumbnailUrl: string | null;
  thumbnailWidth: number | null;
  thumbnailHeight: number | null;
  canonicalUrl: string;
  tags: string[];
  publishedAt: string;
  isScrapped: boolean;
  isLiked: boolean;
  score: number | null;
  likes: number | null;
  commentsCount: number | null;
  isAnswered: boolean | null;
}

export interface MyPageRecommendContentsResponse {
  contents: MyPageRecommendHomePost[];
  isPersonalized: boolean;
  message?: string | null;
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
