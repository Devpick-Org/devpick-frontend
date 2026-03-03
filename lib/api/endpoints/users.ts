import { apiClient } from "../client";

// TODO: DP-195 (프로필 설정 화면 개발) 시 구현
export const usersEndpoints = {
  /** PUT /users/me — 내 프로필 수정 */
  updateMe: () => {
    throw new Error("Not implemented");
    return apiClient.put("/users/me");
  },

  /** DELETE /users/me — 회원 탈퇴 */
  deleteMe: () => {
    throw new Error("Not implemented");
    return apiClient.delete("/users/me");
  },

  /** GET /history — 학습 히스토리 조회 */
  getHistory: () => {
    throw new Error("Not implemented");
    return apiClient.get("/history");
  },
};
