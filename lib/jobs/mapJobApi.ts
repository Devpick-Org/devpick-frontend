import type {
  EmploymentType,
  Job,
  JobCategory,
  ExperienceLevel,
  JobDetail,
  MatchBreakdown,
  MatchItem,
  MatchItemStatus,
  MatchSubSection,
} from "@/types/jobs";
import type { JobDetailApi, JobListItemApi } from "@/lib/api/endpoints/jobs";

const EMPLOYMENT: EmploymentType[] = [
  "FULL_TIME",
  "PART_TIME",
  "CONTRACT",
  "INTERNSHIP",
];
const CATEGORY: JobCategory[] = [
  "FRONTEND",
  "BACKEND",
  "FULLSTACK",
  "DEVOPS",
  "AI_ML",
  "MOBILE",
  "DATA",
];
const EXP: ExperienceLevel[] = ["NEW", "JUNIOR", "MIDDLE", "SENIOR", "ANY"];

function asEmploymentType(s: string): EmploymentType {
  const u = s?.toUpperCase?.() ?? "";
  return (EMPLOYMENT.includes(u as EmploymentType) ? u : "FULL_TIME") as EmploymentType;
}

function asJobCategory(s: string): JobCategory {
  const u = s?.toUpperCase?.() ?? "";
  return (CATEGORY.includes(u as JobCategory) ? u : "BACKEND") as JobCategory;
}

function asExperienceLevel(s: string): ExperienceLevel {
  const u = s?.toUpperCase?.() ?? "";
  return (EXP.includes(u as ExperienceLevel) ? u : "ANY") as ExperienceLevel;
}

function asMatchStatus(s: string): MatchItemStatus {
  if (s === "MET" || s === "UNMET" || s === "PARTIAL") return s;
  return "UNMET";
}

function mapMatchItem(i: { label: string; status: string }): MatchItem {
  return { label: i.label, status: asMatchStatus(i.status) };
}

function mapSubSection(s: {
  score: number;
  maxScore: number;
  summary: string;
  items: { label: string; status: string }[];
}): MatchSubSection {
  return {
    score: s.score,
    maxScore: s.maxScore,
    summary: s.summary,
    items: (s.items ?? []).map(mapMatchItem),
  };
}

function mapBreakdown(b: JobDetailApi["matchBreakdown"]): MatchBreakdown {
  return {
    requirements: mapSubSection(b.requirements),
    preferred: mapSubSection(b.preferred),
    experience: mapSubSection(b.experience),
  };
}

export function mapJobListItem(row: JobListItemApi): Job {
  return {
    id: row.id,
    companyName: row.companyName,
    companyLogo: row.companyLogo,
    title: row.title,
    employmentType: asEmploymentType(row.employmentType),
    jobCategory: asJobCategory(row.jobCategory),
    experienceLevel: asExperienceLevel(row.experienceLevel),
    location: row.location ?? "",
    deadline: row.deadline ?? "",
    techStack: row.techStack ?? [],
    matchScore: row.matchScore ?? 0,
    matchedTags: row.matchedTags ?? [],
    missingTags: row.missingTags ?? [],
    bookmarked: row.bookmarked ?? false,
    postingStatus: row.status === "EXPIRED" ? "EXPIRED" : "ACTIVE",
  };
}

export function mapJobDetail(row: JobDetailApi): JobDetail {
  const base = mapJobListItem(row);
  return {
    ...base,
    salary: row.salary ?? "",
    applyUrl: row.applyUrl ?? "#",
    responsibilities: row.responsibilities ?? [],
    requirements: row.requirements ?? [],
    preferredQualifications: row.preferredQualifications ?? [],
    benefits: row.benefits ?? [],
    hiringProcess: row.hiringProcess ?? [],
    jdImageUrls: row.jdImageUrls?.filter((u) => typeof u === "string" && u.trim()) ?? [],
    parseStatus: row.parseStatus ?? "PENDING",
    matchBreakdown: mapBreakdown(row.matchBreakdown),
  };
}
