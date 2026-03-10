export type JobRoleId = "FRONTEND" | "BACKEND" | "FULLSTACK";
export type LevelId = "BEGINNER" | "JUNIOR" | "MIDDLE" | "SENIOR";

export const JOB_ROLES: { id: JobRoleId; label: string }[] = [
  { id: "FRONTEND", label: "프론트엔드" },
  { id: "BACKEND", label: "백엔드" },
  { id: "FULLSTACK", label: "풀스택" },
];

export const LEVELS: { id: LevelId; label: string; sub: string }[] = [
  { id: "BEGINNER", label: "입문자", sub: "1년 미만" },
  { id: "JUNIOR", label: "주니어", sub: "1~3년차" },
  { id: "MIDDLE", label: "미들", sub: "3~5년차" },
  { id: "SENIOR", label: "시니어", sub: "5년차 이상" },
];

export const SUGGESTED_TAGS: string[] = [
  // 프론트엔드
  "React",
  "Next.js",
  "TypeScript",
  "JavaScript",
  "Vue",
  "CSS",
  "HTML",
  // 백엔드
  "Spring Boot",
  "Java",
  "Node.js",
  "Python",
  "Django",
  "FastAPI",
  "Go",
  // 데이터베이스
  "PostgreSQL",
  "MongoDB",
  "Redis",
  "MySQL",
  // 인프라 / DevOps
  "Docker",
  "Kubernetes",
  "AWS",
  "CI/CD",
  "Nginx",
  "Linux",
  // 기타
  "Git",
  "알고리즘",
  "자료구조",
  "보안",
  "테스트",
  "AI/ML",
];
