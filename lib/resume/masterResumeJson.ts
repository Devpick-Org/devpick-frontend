import type { MasterResumeJson } from "@/lib/api/endpoints/resume";
import type { ResumeData } from "@/types/resume";

export function emptyResumeData(): ResumeData {
  return {
    fileName: "",
    uploadedAt: new Date().toISOString(),
    basicInfo: {
      name: "",
      jobTitle: "",
      careerYears: 0,
      location: "",
    },
    summary: "",
    techStack: [],
    careers: [],
    projects: [],
  };
}

/** API JSON → 편집용 ResumeData (필드 누락 시 기본값) */
export function masterJsonToResumeData(json: MasterResumeJson): ResumeData {
  const base = emptyResumeData();
  const bi = json.basicInfo as Record<string, unknown> | undefined;
  return {
    fileName: typeof json.fileName === "string" ? json.fileName : base.fileName,
    uploadedAt:
      typeof json.uploadedAt === "string" ? json.uploadedAt : base.uploadedAt,
    basicInfo: {
      name: typeof bi?.name === "string" ? bi.name : "",
      jobTitle: typeof bi?.jobTitle === "string" ? bi.jobTitle : "",
      careerYears:
        typeof bi?.careerYears === "number" ? bi.careerYears : Number(bi?.careerYears) || 0,
      location: typeof bi?.location === "string" ? bi.location : "",
    },
    summary: typeof json.summary === "string" ? json.summary : "",
    techStack: Array.isArray(json.techStack)
      ? json.techStack.map((t) => String(t))
      : [],
    careers: Array.isArray(json.careers)
      ? json.careers.map((c) => {
          const o = c as Record<string, unknown>;
          return {
            company: String(o.company ?? ""),
            role: String(o.role ?? ""),
            period: String(o.period ?? ""),
            description: String(o.description ?? ""),
          };
        })
      : [],
    projects: Array.isArray(json.projects)
      ? json.projects.map((p) => {
          const o = p as Record<string, unknown>;
          const ts = o.techStack;
          return {
            name: String(o.name ?? ""),
            period: String(o.period ?? ""),
            role: typeof o.role === "string" ? o.role : "",
            techStack: Array.isArray(ts) ? ts.map((x) => String(x)) : [],
            description: String(o.description ?? ""),
            achievements: typeof o.achievements === "string" ? o.achievements : "",
          };
        })
      : [],
  };
}

export function resumeDataToMasterJson(data: ResumeData): MasterResumeJson {
  return { ...data } as unknown as MasterResumeJson;
}

/** 편집용 깊은 복사 */
export function cloneResumeData(r: ResumeData): ResumeData {
  return JSON.parse(JSON.stringify(r)) as ResumeData;
}
