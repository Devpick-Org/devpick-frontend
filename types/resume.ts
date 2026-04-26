export interface ResumeBasicInfo {
  name: string;
  jobTitle: string;
  careerYears: number;
  location: string;
}

export interface ResumeCareer {
  company: string;
  role: string;
  period: string;
  description: string;
}

export interface ResumeProject {
  name: string;
  period: string;
  /** 본인 역할 (예: 백엔드 담당, 팀 리드) */
  role: string;
  techStack: string[];
  /** 간단 설명 — 면접 Q&A·매칭에 중요 */
  description: string;
  /** 성과·문제 해결·수치 등 */
  achievements: string;
}

export interface ResumeData {
  fileName: string;
  uploadedAt: string;
  basicInfo: ResumeBasicInfo;
  /** 자기소개·요약 (3~5문장 권장) */
  summary: string;
  techStack: string[];
  careers: ResumeCareer[];
  projects: ResumeProject[];
}
