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
  techStack: string[];
  description: string;
}

export interface ResumeData {
  fileName: string;
  uploadedAt: string;
  basicInfo: ResumeBasicInfo;
  techStack: string[];
  careers: ResumeCareer[];
  projects: ResumeProject[];
}
