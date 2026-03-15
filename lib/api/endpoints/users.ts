import { apiClient } from "../client";
import type { ApiResponse } from "@/types/api";

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

  /** GET /history — 학습 히스토리 조회 */
  getHistory: () => {
    throw new Error("Not implemented");
    return apiClient.get("/history");
  },
};
