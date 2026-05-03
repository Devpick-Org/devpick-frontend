import { apiClient } from "../client";
import type { ApiResponse } from "@/types/api";
import type { UserProfileResponse } from "@/types/userProfile";

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
      {
        headers: { "Content-Type": undefined },
      },
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

