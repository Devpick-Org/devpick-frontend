import type { MyPageRecommendBook } from "@/types/myPage";

export const MOCK_RECOMMEND_BOOKS: MyPageRecommendBook[] = [
  {
    bookId: "book-001",
    title: "클린 아키텍처",
    authors: ["로버트 C. 마틴"],
    cover: "https://picsum.photos/seed/book1/300/400",
    url: "https://www.yes24.com/Product/Goods/77283734",
    publisher: "인사이트",
    publishedAt: "2019-08-20",
  },
  {
    bookId: "book-002",
    title: "가상 면접 사례로 배우는 대규모 시스템 설계 기초",
    authors: ["알렉스 쉬"],
    cover: "https://picsum.photos/seed/book2/300/400",
    url: "https://www.yes24.com/Product/Goods/102819435",
    publisher: "인사이트",
    publishedAt: "2021-11-24",
  },
  {
    bookId: "book-003",
    title: "이펙티브 타입스크립트",
    authors: ["댄 밴더캄"],
    cover: null,
    url: "https://www.yes24.com/Product/Goods/102124327",
    publisher: "인사이트",
    publishedAt: "2021-11-12",
  },
  {
    bookId: "book-004",
    title: "데이터 중심 애플리케이션 설계",
    authors: ["마틴 클레퍼만"],
    cover: "https://picsum.photos/seed/book4/300/400",
    url: "https://www.yes24.com/Product/Goods/59566585",
    publisher: "위키북스",
    publishedAt: "2018-12-04",
  },
];

export async function fetchRecommendBooks(
  count = 4,
): Promise<MyPageRecommendBook[]> {
  await new Promise((resolve) => setTimeout(resolve, 400));
  return MOCK_RECOMMEND_BOOKS.slice(0, count);
}
