import type { AxiosResponse } from "axios";
import { isAxiosError } from "axios";
import { apiClient } from "../client";
import { extractApiError } from "../extractApiError";
import type { ApiResponse } from "@/types/api";

/** 마스터 이력서 JSON (백엔드 JsonNode 그대로) */
export type MasterResumeJson = Record<string, unknown>;

/** POST /resume/master/import 응답 헤더 X-Resume-Enrichment 값 */
export type ResumeImportEnrichmentHeader =
  | "applied"
  | "skipped_disabled"
  | "skipped_short_text"
  | "skipped_no_need"
  | "skipped_error";

export type MasterResumeImportResult = {
  resume: MasterResumeJson;
  enrichment: ResumeImportEnrichmentHeader | null;
};

/** axios post 응답 headers (AxiosResponseHeaders | Partial<...> 유니온) */
type AxiosImportHeaders = AxiosResponse<unknown>["headers"];

function readResumeEnrichmentHeader(
  headers: AxiosImportHeaders,
): ResumeImportEnrichmentHeader | null {
  const normalized = normalizeHeaderValue(headers, "x-resume-enrichment");
  if (
    normalized === "applied" ||
    normalized === "skipped_disabled" ||
    normalized === "skipped_short_text" ||
    normalized === "skipped_no_need" ||
    normalized === "skipped_error"
  ) {
    return normalized;
  }
  return null;
}

function normalizeHeaderValue(
  headers: AxiosImportHeaders,
  nameLc: string,
): string | undefined {
  if (headers && typeof headers === "object" && typeof headers.get === "function") {
    const fromGet =
      headers.get(nameLc) ?? headers.get("X-Resume-Enrichment") ?? "";
    const s = String(fromGet).trim();
    if (s.length > 0) return s.toLowerCase();
  }
  const rec = headers as unknown as Record<string, string>;
  const key = Object.keys(rec).find((k) => k.toLowerCase() === nameLc);
  if (!key) return undefined;
  const raw = rec[key];
  return typeof raw === "string" ? raw.trim().toLowerCase() : undefined;
}

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
  importMasterFromFile: async (file: File): Promise<MasterResumeImportResult> => {
    const form = new FormData();
    form.append("file", file);
    const r = await apiClient.post<ApiResponse<MasterResumeJson>>(
      "/resume/master/import",
      form,
      {
        // 기본 json Content-Type을 제거해야 브라우저가 multipart boundary를 넣음 — 아니면 서버 415
        headers: { "Content-Type": undefined },
      },
    );
    const enrichment = readResumeEnrichmentHeader(r.headers);
    return {
      resume: r.data.data,
      enrichment,
    };
  },
};
