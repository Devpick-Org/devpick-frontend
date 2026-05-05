import { QueryClient } from "@tanstack/react-query";
import type { Job, JobDetail } from "@/types/jobs";

type JobListCache = { jobs: Job[]; totalCount: number; totalPages: number };

/**
 * 북마크 상태를 관련된 모든 캐시에 동시에 반영한다.
 * JobCard(목록)와 JobDetailHeader(상세) 양쪽에서 호출되어 화면 간 즉시 일관성을 보장한다.
 *
 * 업데이트 대상:
 *  1. ["job-detail", jobId]  — 상세 캐시
 *  2. ["jobs", *] prefix     — 목록 캐시 (전체 페이지/필터 조합)
 */
export function updateJobBookmarkCache(
  queryClient: QueryClient,
  jobId: string,
  bookmarked: boolean,
) {
  queryClient.setQueryData<JobDetail>(
    ["job-detail", jobId],
    (old) => (old ? { ...old, bookmarked } : old),
  );

  queryClient.setQueriesData<JobListCache>(
    { queryKey: ["jobs"] },
    (old) => {
      if (!old) return old;
      return {
        ...old,
        jobs: old.jobs.map((j) => (j.id === jobId ? { ...j, bookmarked } : j)),
      };
    },
  );
}

export function invalidateJobBookmarkQueries(
  queryClient: QueryClient,
  jobId: string,
) {
  void queryClient.invalidateQueries({ queryKey: ["jobs"] });
  void queryClient.invalidateQueries({ queryKey: ["job-detail", jobId] });
}
