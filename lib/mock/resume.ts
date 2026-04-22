import type { ResumeData } from "@/types/resume";

export const MOCK_RESUME: ResumeData = {
  fileName: "홍보민_이력서_2026.pdf",
  uploadedAt: "2026-04-22T00:00:00",
  basicInfo: {
    name: "홍보민",
    jobTitle: "프론트엔드 개발자",
    careerYears: 2,
    location: "서울특별시 강남구",
  },
  techStack: [
    "TypeScript",
    "React",
    "Next.js",
    "Tailwind CSS",
    "Zustand",
    "TanStack Query",
    "Git",
  ],
  careers: [
    {
      company: "스타트업 A",
      role: "프론트엔드 개발자",
      period: "2024.03 – 현재",
      description:
        "Next.js 기반 서비스 개발 및 디자인 시스템 구축. TanStack Query를 활용한 서버 상태 관리 개선.",
    },
    {
      company: "에이전시 B",
      role: "웹 퍼블리셔",
      period: "2023.01 – 2024.02",
      description:
        "반응형 웹 퍼블리싱 및 React 기반 컴포넌트 개발. 다수의 기업 홈페이지 및 관리자 페이지 구축.",
    },
  ],
  projects: [
    {
      name: "Trace — 개발자 성장형 통합 플랫폼",
      period: "2026.01 – 현재",
      techStack: ["Next.js", "TypeScript", "Tailwind CSS", "TanStack Query"],
      description:
        "개발 콘텐츠 탐색, AI 요약, 커뮤니티 소통, 성장 기록을 하나의 흐름으로 연결하는 플랫폼 프론트엔드 개발.",
    },
    {
      name: "사내 디자인 시스템 구축",
      period: "2024.06 – 2024.09",
      techStack: ["React", "TypeScript", "Storybook", "CSS Modules"],
      description:
        "재사용 가능한 UI 컴포넌트 라이브러리 설계 및 Storybook 문서화. 팀 내 개발 속도 30% 향상.",
    },
    {
      name: "실시간 협업 메모 앱",
      period: "2023.09 – 2023.12",
      techStack: ["React", "Firebase", "Zustand"],
      description:
        "WebSocket 기반 실시간 공동 편집 기능 구현. Firebase를 활용한 인증 및 데이터 동기화.",
    },
  ],
};
