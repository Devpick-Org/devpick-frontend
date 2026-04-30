import type {
  MyPageRecommendBook,
  MyPageRecommendBooksResponse,
} from "@/types/myPage";

export const MOCK_RECOMMEND_BOOKS: MyPageRecommendBook[] = [
  {
    title: "클린 아키텍처",
    authors: ["로버트 C. 마틴"],
    publisher: "인사이트",
    thumbnail: "https://picsum.photos/seed/book1/300/400",
    url: "https://www.yes24.com/Product/Goods/77283734",
    contents:
      "소프트웨어 구조 설계의 핵심 원칙과 클린 아키텍처의 개념을 설명하는 책.",
    price: 16000,
    salePrice: 14400,
  },
  {
    title: "가상 면접 사례로 배우는 대규모 시스템 설계 기초",
    authors: ["알렉스 쉬"],
    publisher: "인사이트",
    thumbnail: "https://picsum.photos/seed/book2/300/400",
    url: "https://www.yes24.com/Product/Goods/102819435",
    contents:
      "대규모 시스템 설계 면접을 대비하기 위한 핵심 개념과 설계 방법을 다룬다.",
    price: 21000,
    salePrice: 18900,
  },
  {
    title: "이펙티브 타입스크립트",
    authors: ["댄 밴더캄"],
    publisher: "인사이트",
    thumbnail: null,
    url: "https://www.yes24.com/Product/Goods/102124327",
    contents:
      "타입스크립트를 더 안전하고 효과적으로 사용하는 방법을 소개하는 실전 가이드.",
    price: 32000,
    salePrice: -1,
  },
  {
    title: "데이터 중심 애플리케이션 설계",
    authors: ["마틴 클레퍼만"],
    publisher: "위키북스",
    thumbnail: "https://picsum.photos/seed/book4/300/400",
    url: "https://www.yes24.com/Product/Goods/59566585",
    contents:
      "데이터 시스템의 설계 원칙과 분산 시스템의 핵심 개념을 깊이 있게 설명한다.",
    price: 28000,
    salePrice: 25200,
  },
  {
    title: "리팩터링 2판",
    authors: ["마틴 파울러"],
    publisher: "한빛미디어",
    thumbnail: "https://picsum.photos/seed/book5/300/400",
    url: "https://www.yes24.com/Product/Goods/89649360",
    contents:
      "코드를 더 깔끔하게 만드는 리팩터링 기법을 JavaScript 예제와 함께 설명한다.",
    price: 38000,
    salePrice: -1,
  },
  {
    title: "HTTP 완벽 가이드",
    authors: ["데이빗 고울리", "브라이언 토티"],
    publisher: "인사이트",
    thumbnail: null,
    url: "https://www.yes24.com/Product/Goods/15381085",
    contents:
      "웹의 근간이 되는 HTTP 프로토콜의 동작 원리와 최신 스펙을 상세히 다룬다.",
    price: 49000,
    salePrice: 44100,
  },
  {
    title: "자바스크립트 딥 다이브",
    authors: ["이웅모"],
    publisher: "위키북스",
    thumbnail: "https://picsum.photos/seed/book7/300/400",
    url: "https://www.yes24.com/Product/Goods/92742567",
    contents:
      "자바스크립트의 동작 원리를 기초부터 깊이 있게 이해할 수 있는 국내 저술서.",
    price: 45000,
    salePrice: -1,
  },
  {
    title: "쏙쏙 들어오는 함수형 코딩",
    authors: ["에릭 노먼드"],
    publisher: "제이펍",
    thumbnail: "https://picsum.photos/seed/book8/300/400",
    url: "https://www.yes24.com/Product/Goods/108748841",
    contents:
      "함수형 프로그래밍 패러다임을 실용적인 관점에서 쉽게 설명하는 입문서.",
    price: 33000,
    salePrice: 29700,
  },
  {
    title: "실용주의 프로그래머",
    authors: ["데이비드 토머스", "앤드류 헌트"],
    publisher: "인사이트",
    thumbnail: null,
    url: "https://www.yes24.com/Product/Goods/107077663",
    contents:
      "더 나은 개발자가 되기 위한 실질적인 조언을 담은 개발 철학서의 고전.",
    price: 35000,
    salePrice: -1,
  },
  {
    title: "그림으로 배우는 네트워크 원리",
    authors: ["Gene"],
    publisher: "영진닷컴",
    thumbnail: "https://picsum.photos/seed/book10/300/400",
    url: "https://www.yes24.com/Product/Goods/104369152",
    contents:
      "네트워크의 기초 개념을 풍부한 그림과 함께 쉽게 이해할 수 있도록 설명한다.",
    price: 24000,
    salePrice: 21600,
  },
];

export async function fetchRecommendBooks(
  count?: number,
): Promise<MyPageRecommendBooksResponse> {
  await new Promise((resolve) => setTimeout(resolve, 400));
  const books =
    count !== undefined
      ? MOCK_RECOMMEND_BOOKS.slice(0, count)
      : MOCK_RECOMMEND_BOOKS;
  return {
    books,
    isPersonalized: true,
    message: undefined,
  };
}
