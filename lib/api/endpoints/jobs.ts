import { apiClient } from "../client";
import type { ApiResponse } from "@/types/api";

/** 백엔드 JobListPageResponse */
export interface JobListPageApi {
  jobs: JobListItemApi[];
  totalCount: number;
  totalPages: number;
  page: number;
  size: number;
}

export interface JobListItemApi {
  id: string;
  companyName: string;
  companyLogo: string;
  title: string;
  employmentType: string;
  jobCategory: string;
  experienceLevel: string;
  location: string;
  deadline: string;
  techStack: string[];
  matchScore: number;
  resumeAvailable: boolean;
  matchedTags: string[];
  missingTags: string[];
  bookmarked: boolean;
  status: string;
}

export interface MatchItemApi {
  label: string;
  status: string;
}

export interface MatchSubSectionApi {
  score: number;
  maxScore: number;
  summary: string;
  items: MatchItemApi[];
}

export interface MatchBreakdownApi {
  requirements: MatchSubSectionApi;
  preferred: MatchSubSectionApi;
  experience: MatchSubSectionApi;
}

export interface JobDetailApi extends JobListItemApi {
  salary: string;
  applyUrl: string;
  responsibilities: string[];
  requirements: string[];
  preferredQualifications: string[];
  benefits: string[];
  hiringProcess: string[];
  jdImageUrls?: string[];
  parseStatus?: string;
  matchBreakdown: MatchBreakdownApi;
}

export interface ContentPickApi {
  id: string;
  title: string;
  preview: string;
  canonicalUrl: string;
  tags: string[];
}

export interface SkillGapApi {
  roadmap: string[];
  contents: ContentPickApi[];
}

export interface JobTechTagFacetApi {
  name: string;
  count: number;
  source: string;
}

export interface JobCompanyFacetApi {
  name: string;
  count: number;
  logoUrl?: string | null;
}

export interface InterviewQaListItemApi {
  jobId: string;
  companyName: string;
  jobTitle: string;
  matchScore: number;
  payloadJson: string;
  updatedAt: string;
}

export const jobsEndpoints = {
  list: (params: {
    page: number;
    size: number;
    query?: string;
    category?: string;
    experienceLevel?: string;
    location?: string;
    techStack?: string;
    companies?: string;
    sortBy?: string;
  }): Promise<JobListPageApi> =>
    apiClient
      .get<ApiResponse<JobListPageApi>>("/jobs", { params })
      .then((r) => r.data.data),

  listTechTags: (limit = 80): Promise<JobTechTagFacetApi[]> =>
    apiClient
      .get<ApiResponse<JobTechTagFacetApi[]>>("/jobs/tech-tags", {
        params: { limit },
      })
      .then((r) => r.data.data),

  listCompanies: (limit = 120): Promise<JobCompanyFacetApi[]> =>
    apiClient
      .get<ApiResponse<JobCompanyFacetApi[]>>("/jobs/companies", {
        params: { limit },
      })
      .then((r) => r.data.data),

  getDetail: (jobId: string): Promise<JobDetailApi> =>
    apiClient
      .get<ApiResponse<JobDetailApi>>(`/jobs/${jobId}`)
      .then((r) => r.data.data),

  bookmark: (jobId: string): Promise<void> =>
    apiClient.post<ApiResponse<void>>(`/jobs/${jobId}/bookmark`).then(() => undefined),

  unbookmark: (jobId: string): Promise<void> =>
    apiClient.delete<ApiResponse<void>>(`/jobs/${jobId}/bookmark`).then(() => undefined),

  /** GET /jobs/{jobId}/skill-gap — 저장된 마지막 결과 조회. 없으면 null (404 JOB_004) */
  getSkillGap: (jobId: string): Promise<SkillGapApi | null> =>
    apiClient
      .get<ApiResponse<SkillGapApi>>(`/jobs/${jobId}/skill-gap`)
      .then((r) => r.data.data)
      .catch((e: unknown) => {
        const status = (e as { response?: { status?: number } }).response?.status;
        if (status === 404) return null;
        throw e;
      }),

  /** POST /jobs/{jobId}/skill-gap — 새로 생성 + DB 저장 (같은 유저+공고 조합 덮어씀) */
  skillGap: (jobId: string): Promise<SkillGapApi> =>
    apiClient
      .post<ApiResponse<SkillGapApi>>(`/jobs/${jobId}/skill-gap`)
      .then((r) => r.data.data),

  getInterviewQa: (jobId: string): Promise<{ payloadJson: string }> =>
    apiClient
      .get<ApiResponse<{ payloadJson: string }>>(`/jobs/${jobId}/interview-qa`)
      .then((r) => r.data.data),

  listInterviewQa: (): Promise<InterviewQaListItemApi[]> =>
    apiClient
      .get<ApiResponse<InterviewQaListItemApi[]>>(`/jobs/saved-interview-qa`)
      .then((r) => r.data.data),

  generateInterviewQa: (jobId: string): Promise<{ payloadJson: string }> =>
    apiClient
      .post<ApiResponse<{ payloadJson: string }>>(
        `/jobs/${jobId}/interview-qa/generate`,
      )
      .then((r) => r.data.data),

  deleteInterviewQa: (jobId: string): Promise<void> =>
    apiClient
      .delete<ApiResponse<void>>(`/jobs/${jobId}/interview-qa`)
      .then(() => undefined),
};
