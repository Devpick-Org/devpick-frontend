import { apiClient } from "../client";
import type { ApiResponse } from "@/types/api";
import type {
  MyPageRecommendContentsResponse,
  MyPageRecommendYoutubeResponse,
  MyPageRecommendBooksResponse,
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
