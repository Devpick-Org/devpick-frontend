import { create } from "zustand";

interface ContentInteractions {
  isLiked: boolean;
  isScrapped: boolean;
}

interface ContentStore {
  /**
   * contentId → 상호작용 상태
   * API 연동 전 임시 클라이언트 동기화용.
   * 추후 TanStack Query optimistic update로 대체 예정.
   */
  interactions: Record<string, ContentInteractions>;

  /**
   * API/mock 초기값으로 seeding.
   * 이미 store에 등록된 contentId는 건드리지 않아
   * 피드에서 토글한 값이 상세 페이지에서 덮어씌워지지 않는다.
   */
  init: (contentId: string, isLiked: boolean, isScrapped: boolean) => void;

  toggleLike: (contentId: string) => void;
  toggleScrap: (contentId: string) => void;
}

export const useContentStore = create<ContentStore>((set, get) => ({
  interactions: {},

  init: (contentId, isLiked, isScrapped) => {
    if (get().interactions[contentId]) return;
    set((state) => ({
      interactions: {
        ...state.interactions,
        [contentId]: { isLiked, isScrapped },
      },
    }));
  },

  toggleLike: (contentId) =>
    set((state) => {
      const current = state.interactions[contentId] ?? {
        isLiked: false,
        isScrapped: false,
      };

      return {
        interactions: {
          ...state.interactions,
          [contentId]: { ...current, isLiked: !current.isLiked },
        },
      };
    }),

  toggleScrap: (contentId) =>
    set((state) => {
      const current = state.interactions[contentId] ?? {
        isLiked: false,
        isScrapped: false,
      };

      return {
        interactions: {
          ...state.interactions,
          [contentId]: { ...current, isScrapped: !current.isScrapped },
        },
      };
    }),
}));
