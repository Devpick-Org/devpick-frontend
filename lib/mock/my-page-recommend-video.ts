import type { MyPageRecommendVideo } from "@/types/myPage";

export const MOCK_RECOMMEND_VIDEOS: MyPageRecommendVideo[] = [
  {
    videoId: "vid-001",
    title: "10분 만에 이해하는 React 19 Actions — useActionState 실전편",
    channelName: "코딩애플",
    thumbnail: "https://picsum.photos/seed/vid1/400/240",
    url: "https://www.youtube.com/watch?v=example1",
    duration: "10:24",
    views: 142300,
    uploadedAt: "2026-04-19T00:00:00Z",
  },
  {
    videoId: "vid-002",
    title: "Next.js App Router 완전 정복 — 캐싱부터 스트리밍까지",
    channelName: "Traversy Media",
    thumbnail: "https://picsum.photos/seed/vid2/400/240",
    url: "https://www.youtube.com/watch?v=example2",
    duration: "42:17",
    views: 89500,
    uploadedAt: "2026-04-14T00:00:00Z",
  },
  {
    videoId: "vid-003",
    title: "Docker & Kubernetes 입문 — 컨테이너 오케스트레이션 기초",
    channelName: "드림코딩",
    thumbnail: null,
    url: "https://www.youtube.com/watch?v=example3",
    duration: "28:50",
    views: 61200,
    uploadedAt: "2026-04-10T00:00:00Z",
  },
  {
    videoId: "vid-004",
    title: "TanStack Query v5 마이그레이션 완벽 가이드",
    channelName: "Jack Herrington",
    thumbnail: "https://picsum.photos/seed/vid4/400/240",
    url: "https://www.youtube.com/watch?v=example4",
    duration: "18:03",
    views: 34800,
    uploadedAt: "2026-04-07T00:00:00Z",
  },
];

export async function fetchRecommendVideos(
  count = 4,
): Promise<MyPageRecommendVideo[]> {
  await new Promise((resolve) => setTimeout(resolve, 400));
  return MOCK_RECOMMEND_VIDEOS.slice(0, count);
}
