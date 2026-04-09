import { apiClient } from "../client";
import type { ApiResponse } from "@/types/api";
import type { UserProfileResponse } from "@/types/userProfile";
import { getMockUserProfile } from "@/lib/mock/userProfiles";

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

// TODO: DP-195 (프로필 설정 화면 개발) 시 구현
export const usersEndpoints = {
  /** PUT /users/me — 내 프로필 수정 */
  updateMe: (data: UpdateMeRequest) =>
    apiClient.put<ApiResponse<UpdateMeResponse>>("/users/me", data),

  /**
   * GET /users/{userId}/profile — 사용자 공개 프로필 조회 (mock)
   * 실제 API 연동 시 아래 mock 블록을 제거하고 다음으로 교체:
   * const response = await apiClient.get<UserProfileResponse>(`/users/${userId}/profile`);
   * return response.data;
   */
  getUserProfile: (userId: string, nickname?: string): Promise<UserProfileResponse> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          data: getMockUserProfile(userId, nickname),
          message: "프로필을 불러왔습니다",
        });
      }, 400);
    });
  },

  /** GET /history — 학습 히스토리 조회 */
  getHistory: () => {
    throw new Error("Not implemented");
    return apiClient.get("/history");
  },
};
