export type EmploymentType = "FULL_TIME" | "PART_TIME" | "CONTRACT" | "INTERNSHIP";
export type JobCategory = "FRONTEND" | "BACKEND" | "FULLSTACK" | "DEVOPS" | "AI_ML" | "MOBILE" | "DATA";
export type ExperienceLevel = "NEW" | "JUNIOR" | "MIDDLE" | "SENIOR" | "ANY";

export type JobPostingStatus = "ACTIVE" | "EXPIRED";

export interface Job {
  id: string;
  companyName: string;
  companyLogo: string;
  title: string;
  employmentType: EmploymentType;
  jobCategory: JobCategory;
  experienceLevel: ExperienceLevel;
  location: string;
  deadline: string;
  techStack: string[];
  matchScore: number;
  matchedTags: string[];
  missingTags: string[];
  /** 서버 북마크 여부 (실 API 연동 시 필수) */
  bookmarked?: boolean;
  /** 공고 상태 */
  postingStatus?: JobPostingStatus;
}

export type MatchItemStatus = "MET" | "UNMET" | "PARTIAL";

export interface MatchItem {
  label: string;
  status: MatchItemStatus;
}

export interface MatchSubSection {
  score: number;
  maxScore: number;
  summary: string;
  items: MatchItem[];
}

export interface MatchBreakdown {
  requirements: MatchSubSection;
  preferred: MatchSubSection;
  experience: MatchSubSection;
}

export interface QAItem {
  question: string;
  answer: string;
  followUps: string[];
}

export interface QACategory {
  title: string;
  items: QAItem[];
}

/** 백엔드 JobParseStatus (확장 대비 string 허용) */
export type JobParseStatus = "PENDING" | "OK" | "UNPARSABLE" | "SKIPPED_IMAGE" | string;

export interface JobDetail extends Job {
  salary: string;
  applyUrl: string;
  responsibilities: string[];
  requirements: string[];
  preferredQualifications: string[];
  benefits: string[];
  hiringProcess: string[];
  /** 인포그래픽 등 원문 이미지 URL (텍스트 JD가 비어 있을 때 표시) */
  jdImageUrls: string[];
  parseStatus: JobParseStatus;
  matchBreakdown: MatchBreakdown;
}
