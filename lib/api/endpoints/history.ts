import type {
  HistoryParams,
  HistoryPageResponse,
} from "@/types/history";
import { mockGetHistoryList } from "@/lib/mock/history";

// TODO: 실제 API 연동 시 아래 import를 활성화하고 각 함수 내부를 교체
// import { apiClient } from "../client";

// ── query key 상수 ─────────────────────────────────────────────────────────────
export const HISTORY_QUERY_KEYS = {
  list: (params: HistoryParams) => ["history", params] as const,
};

export const historyEndpoints = {
  /** GET /history — content_liked 제외 학습 행동 기록 (최신순) */
  getHistoryList: (params: HistoryParams = {}): Promise<HistoryPageResponse> => {
    return mockGetHistoryList(params);
    // TODO: return apiClient.get<HistoryPageResponse>("/history", { params }).then((r) => r.data);
  },
};
