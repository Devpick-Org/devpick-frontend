import { apiClient } from "../client";
import type { ApiResponse } from "@/types/api";
import type { UserProfileResponse } from "@/types/userProfile";
import type { MyPageScrapResponse, MyPageQuizHistoryResponse } from "@/types/myPage";

export interface UpdateMeRequest {
  nickname?: string;
  profileImage?: string;
  job?: "FRONTEND" | "BACKEND" | "FULLSTACK";
  level?: "BEGINNER" | "JUNIOR" | "MIDDLE" | "SENIOR";
  tags?: string[];
}

export interface UpdateMeResponse {
  userId: string;
  email: string;
  nickname: string;
  profileImage?: string;
  job?: "FRONTEND" | "BACKEND" | "FULLSTACK";
  level?: "BEGINNER" | "JUNIOR" | "MIDDLE" | "SENIOR";
  tags?: string[];
  createdAt?: string;
}

export interface UploadProfileImageResponse {
  profileImage: string;
}

export const usersEndpoints = {
  /** POST /users/me/profile-image — 프로필 이미지 S3 업로드 */
  uploadProfileImage: (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return apiClient.post<ApiResponse<UploadProfileImageResponse>>(
      "/users/me/profile-image",
      formData,
    );
  },

  /** PUT /users/me — 내 프로필 수정 */
  updateMe: (data: UpdateMeRequest) =>
    apiClient.put<ApiResponse<UpdateMeResponse>>("/users/me", data),

  /** GET /users/{userId}/profile — 사용자 공개 프로필 조회 */
  getUserProfile: (userId: string): Promise<UserProfileResponse> => {
    return apiClient
      .get<UserProfileResponse>(`/users/${userId}/profile`)
      .then((r) => r.data);
  },
};

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
