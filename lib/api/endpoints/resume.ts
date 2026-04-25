import { isAxiosError } from "axios";
import { apiClient } from "../client";
import { extractApiError } from "../extractApiError";
import type { ApiResponse } from "@/types/api";

/** 마스터 이력서 JSON (백엔드 JsonNode 그대로) */
export type MasterResumeJson = Record<string, unknown>;

export const resumeEndpoints = {
  /**
   * 이력서 없음 → null (404 + RESUME_001)
   */
  getMasterOrNull: async (): Promise<MasterResumeJson | null> => {
    try {
      const r = await apiClient.get<ApiResponse<MasterResumeJson>>("/resume/master");
      return r.data.data;
    } catch (e) {
      if (!isAxiosError(e) || e.response?.status !== 404) throw e;
      const { code } = extractApiError(e);
      if (code === "RESUME_001") return null;
      throw e;
    }
  },

  putMaster: (body: MasterResumeJson): Promise<MasterResumeJson> =>
    apiClient
      .put<ApiResponse<MasterResumeJson>>("/resume/master", body)
      .then((r) => r.data.data),
};
