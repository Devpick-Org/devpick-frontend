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

  /** PDF/DOCX 업로드 → 서버 텍스트 추출 + AI 분석 후 마스터 이력서 저장 */
  importMasterFromFile: async (file: File): Promise<MasterResumeJson> => {
    const form = new FormData();
    form.append("file", file);
    const r = await apiClient.post<ApiResponse<MasterResumeJson>>(
      "/resume/master/import",
      form,
    );
    return r.data.data;
  },
};
