export type EmploymentType = "FULL_TIME" | "PART_TIME" | "CONTRACT" | "INTERNSHIP";
export type JobCategory = "FRONTEND" | "BACKEND" | "FULLSTACK" | "DEVOPS" | "AI_ML" | "MOBILE" | "DATA";
export type ExperienceLevel = "NEW" | "JUNIOR" | "MIDDLE" | "SENIOR" | "ANY";

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

export interface JobDetail extends Job {
  salary: string;
  applyUrl: string;
  responsibilities: string[];
  requirements: string[];
  preferredQualifications: string[];
  benefits: string[];
  hiringProcess: string[];
  matchBreakdown: MatchBreakdown;
}
