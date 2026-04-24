import type { MyPageRecommendBook } from "@/types/myPage";

export const MOCK_RECOMMEND_BOOKS: MyPageRecommendBook[] = [
  {
    bookId: "book-001",
    title: "클린 아키텍처",
    authors: ["로버트 C. 마틴"],
    description:
      "소프트웨어 구조 설계의 핵심 원칙과 클린 아키텍처의 개념을 설명하는 책.",
    cover: "https://picsum.photos/seed/book1/300/400",
    url: "https://www.yes24.com/Product/Goods/77283734",
    price: 16000,
    publisher: "인사이트",
    publishedAt: "2019-08-20",
  },
  {
    bookId: "book-002",
    title: "가상 면접 사례로 배우는 대규모 시스템 설계 기초",
    authors: ["알렉스 쉬"],
    description:
      "대규모 시스템 설계 면접을 대비하기 위한 핵심 개념과 설계 방법을 다룬다.",
    cover: "https://picsum.photos/seed/book2/300/400",
    url: "https://www.yes24.com/Product/Goods/102819435",
    price: 21000,
    publisher: "인사이트",
    publishedAt: "2021-11-24",
  },
  {
    bookId: "book-003",
    title: "이펙티브 타입스크립트",
    authors: ["댄 밴더캄"],
    description:
      "타입스크립트를 더 안전하고 효과적으로 사용하는 방법을 소개하는 실전 가이드.",
    cover: null,
    url: "https://www.yes24.com/Product/Goods/102124327",
    price: 32000,
    publisher: "인사이트",
    publishedAt: "2021-11-12",
  },
  {
    bookId: "book-004",
    title: "데이터 중심 애플리케이션 설계",
    authors: ["마틴 클레퍼만"],
    description:
      "데이터 시스템의 설계 원칙과 분산 시스템의 핵심 개념을 깊이 있게 설명한다.",
    cover: "https://picsum.photos/seed/book4/300/400",
    url: "https://www.yes24.com/Product/Goods/59566585",
    price: 28000,
    publisher: "위키북스",
    publishedAt: "2018-12-04",
  },
  {
    bookId: "book-005",
    title: "리팩터링 2판",
    authors: ["마틴 파울러"],
    description:
      "코드를 더 깔끔하게 만드는 리팩터링 기법을 JavaScript 예제와 함께 설명한다.",
    cover: "https://picsum.photos/seed/book5/300/400",
    url: "https://www.yes24.com/Product/Goods/89649360",
    price: 38000,
    publisher: "한빛미디어",
    publishedAt: "2020-04-01",
  },
  {
    bookId: "book-006",
    title: "HTTP 완벽 가이드",
    authors: ["데이빗 고울리", "브라이언 토티"],
    description:
      "웹의 근간이 되는 HTTP 프로토콜의 동작 원리와 최신 스펙을 상세히 다룬다.",
    cover: null,
    url: "https://www.yes24.com/Product/Goods/15381085",
    price: 49000,
    publisher: "인사이트",
    publishedAt: "2014-12-15",
  },
  {
    bookId: "book-007",
    title: "자바스크립트 딥 다이브",
    authors: ["이웅모"],
    description:
      "자바스크립트의 동작 원리를 기초부터 깊이 있게 이해할 수 있는 국내 저술서.",
    cover: "https://picsum.photos/seed/book7/300/400",
    url: "https://www.yes24.com/Product/Goods/92742567",
    price: 45000,
    publisher: "위키북스",
    publishedAt: "2020-09-25",
  },
  {
    bookId: "book-008",
    title: "쏙쏙 들어오는 함수형 코딩",
    authors: ["에릭 노먼드"],
    description:
      "함수형 프로그래밍 패러다임을 실용적인 관점에서 쉽게 설명하는 입문서.",
    cover: "https://picsum.photos/seed/book8/300/400",
    url: "https://www.yes24.com/Product/Goods/108748841",
    price: 33000,
    publisher: "제이펍",
    publishedAt: "2022-11-30",
  },
  {
    bookId: "book-009",
    title: "실용주의 프로그래머",
    authors: ["데이비드 토머스", "앤드류 헌트"],
    description:
      "더 나은 개발자가 되기 위한 실질적인 조언을 담은 개발 철학서의 고전.",
    cover: null,
    url: "https://www.yes24.com/Product/Goods/107077663",
    price: 35000,
    publisher: "인사이트",
    publishedAt: "2022-02-18",
  },
  {
    bookId: "book-010",
    title: "그림으로 배우는 네트워크 원리",
    authors: ["Gene"],
    description:
      "네트워크의 기초 개념을 풍부한 그림과 함께 쉽게 이해할 수 있도록 설명한다.",
    cover: "https://picsum.photos/seed/book10/300/400",
    url: "https://www.yes24.com/Product/Goods/104369152",
    price: 24000,
    publisher: "영진닷컴",
    publishedAt: "2022-05-20",
  },
  {
    bookId: "book-011",
    title: "Growing Object-Oriented Software, Guided by Tests",
    authors: ["Steve Freeman", "Nat Pryce"],
    description:
      "TDD를 실전에서 적용하는 방법과 객체지향 설계 원칙을 함께 배울 수 있는 명저.",
    cover: "https://picsum.photos/seed/book11/300/400",
    url: "https://www.yes24.com/Product/Goods/3551451",
    publisher: "Addison-Wesley",
    publishedAt: "2009-10-12",
  },
  {
    bookId: "book-012",
    title: "컴퓨터 과학이 보이는 그림책",
    authors: ["아다치 마사유키"],
    description:
      "컴퓨터 과학의 핵심 개념을 그림으로 직관적으로 이해할 수 있도록 구성한 입문서.",
    cover: null,
    url: "https://www.yes24.com/Product/Goods/66028583",
    price: 16000,
    publisher: "성안당",
    publishedAt: "2019-02-15",
  },
];

export async function fetchRecommendBooks(
  count?: number,
): Promise<MyPageRecommendBook[]> {
  await new Promise((resolve) => setTimeout(resolve, 400));
  return count !== undefined
    ? MOCK_RECOMMEND_BOOKS.slice(0, count)
    : MOCK_RECOMMEND_BOOKS;
}
