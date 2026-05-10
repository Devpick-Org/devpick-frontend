import { apiClient } from "../client";
import type { ApiResponse } from "@/types/api";
import type {
  MyPageRecommendContentsResponse,
  MyPageRecommendYoutubeResponse,
  MyPageRecommendBooksResponse,
  MyPageScrapResponse,
  MyPageQuizHistoryResponse,
  MyPageJobBookmarkResponse,
} from "@/types/myPage";


export const MY_PAGE_QUERY_KEYS = {
  recommendContents: ["myPage", "recommendContents"] as const,
  recommendYoutube: ["myPage", "recommendYoutube"] as const,
  recommendBooks: ["myPage", "recommendBooks"] as const,
};

export async function getRecommendContents(): Promise<MyPageRecommendContentsResponse> {
  const res = await apiClient.get<ApiResponse<MyPageRecommendContentsResponse>>(
    "/recommend/contents",
  );
  return res.data.data;
}

export async function getRecommendYoutube(): Promise<MyPageRecommendYoutubeResponse> {
  const res = await apiClient.get<ApiResponse<MyPageRecommendYoutubeResponse>>(
    "/recommend/youtube",
  );
  return res.data.data;
}

export async function getRecommendBooks(): Promise<MyPageRecommendBooksResponse> {
  const res = await apiClient.get<ApiResponse<MyPageRecommendBooksResponse>>(
    "/recommend/books",
  );
  return res.data.data;
}

export async function getMyQuizHistory(params?: {
  sort?: "newest" | "oldest";
  page?: number;
  size?: number;
  passed?: boolean;
}): Promise<MyPageQuizHistoryResponse> {
  const res = await apiClient.get("/users/me/quiz-history", { params });
  return res.data.data;
}

export async function getMyScraps(params?: {
  q?: string;
  sort?: "newest" | "oldest";
  page?: number;
  size?: number;
}): Promise<MyPageScrapResponse> {
  const res = await apiClient.get("/users/me/scraps", { params });
  return res.data.data;
}

export async function getMyJobBookmarks(params?: {
  q?: string;
  sort?: "newest" | "oldest" | "match";
  page?: number;
  size?: number;
}): Promise<MyPageJobBookmarkResponse> {
  const res = await apiClient.get<ApiResponse<MyPageJobBookmarkResponse>>(
    "/users/me/bookmarks",
    { params },
  );
  return res.data.data;
}
