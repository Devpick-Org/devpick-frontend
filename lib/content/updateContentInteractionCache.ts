import { QueryClient, InfiniteData } from "@tanstack/react-query";
import type { ContentDetailResponse, ContentFeedResponse } from "@/types/content";

/**
 * 좋아요/스크랩 상태를 관련된 모든 캐시에 동시에 반영한다.
 * ContentDetail, FeedCard 양쪽에서 호출되어 화면 간 즉시 일관성을 보장한다.
 *
 * 업데이트 대상:
 *  1. ["content", contentId]              — 상세 캐시
 *  2. ["contents", *] prefix              — 피드/검색 무한 스크롤 캐시 (전체)
 *  3. ["content-recommendations", *] prefix — 추천 콘텐츠 캐시 (전체)
 */
export function updateContentInteractionCache(
  queryClient: QueryClient,
  contentId: string,
  field: "isLiked" | "isScrapped",
  value: boolean,
) {
  // 1. 상세 캐시
  queryClient.setQueryData<ContentDetailResponse>(
    ["content", contentId],
    (old) => (old ? { ...old, data: { ...old.data, [field]: value } } : old),
  );

  // 2. 목록/검색 캐시 (["contents"] prefix 전체)
  queryClient.setQueriesData<InfiniteData<ContentFeedResponse>>(
    { queryKey: ["contents"] },
    (old) => {
      if (!old) return old;
      return {
        ...old,
        pages: old.pages.map((page) => ({
          ...page,
          data: {
            ...page.data,
            contents: page.data.contents.map((c) =>
              c.id === contentId ? { ...c, [field]: value } : c,
            ),
          },
        })),
      };
    },
  );

  // 3. 추천 콘텐츠 캐시 (["content-recommendations"] prefix 전체)
  //    추천 목록에 해당 contentId가 포함될 수 있는 모든 페이지를 스캔
  queryClient.setQueriesData<ContentFeedResponse>(
    { queryKey: ["content-recommendations"] },
    (old) => {
      if (!old) return old;
      return {
        ...old,
        data: {
          ...old.data,
          contents: old.data.contents.map((c) =>
            c.id === contentId ? { ...c, [field]: value } : c,
          ),
        },
      };
    },
  );
}

/**
 * 인터랙션 관련 캐시를 서버와 동기화한다.
 * mutation 성공/실패 시 정합성 보장용으로 호출한다.
 */
export function invalidateContentInteractionQueries(
  queryClient: QueryClient,
  contentId: string,
) {
  queryClient.invalidateQueries({ queryKey: ["contents"] });
  queryClient.invalidateQueries({ queryKey: ["content", contentId] });
  queryClient.invalidateQueries({ queryKey: ["content-recommendations", contentId] });
}
