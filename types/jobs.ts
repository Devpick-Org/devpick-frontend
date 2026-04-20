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
