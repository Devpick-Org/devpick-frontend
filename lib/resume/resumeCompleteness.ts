import type { ResumeData } from "@/types/resume";

export interface ResumeCompletenessItem {
  id: string;
  label: string;
  done: boolean;
}

export function getResumeCompleteness(resume: ResumeData): {
  items: ResumeCompletenessItem[];
  doneCount: number;
  total: number;
  percent: number;
} {
  const basicOk =
    resume.basicInfo.name.trim().length > 0 &&
    resume.basicInfo.jobTitle.trim().length > 0 &&
    resume.basicInfo.location.trim().length > 0;

  const techOk = resume.techStack.length >= 3;

  const summaryOk = resume.summary.trim().length >= 40;

  const projectCountOk = resume.projects.length >= 1;

  const projectDescOk = resume.projects.some(
    (p) => p.description.trim().length >= 100,
  );

  const experienceOk =
    resume.careers.length >= 1 ||
    resume.projects.some(
      (p) =>
        p.role.trim().length > 0 ||
        p.achievements.trim().length > 0 ||
        p.description.trim().length >= 60,
    );

  const items: ResumeCompletenessItem[] = [
    { id: "basic", label: "기본 정보 (이름·직무·위치)", done: basicOk },
    { id: "tech", label: "기술 스택 3개 이상", done: techOk },
    { id: "summary", label: "자기소개·요약 40자 이상", done: summaryOk },
    { id: "project", label: "프로젝트 1개 이상", done: projectCountOk },
    {
      id: "projectDesc",
      label: "프로젝트 설명 100자 이상 (한 항목)",
      done: projectDescOk,
    },
    {
      id: "experience",
      label: "경력 또는 프로젝트 상세 (역할·설명·성과)",
      done: experienceOk,
    },
  ];

  const doneCount = items.filter((i) => i.done).length;
  const total = items.length;
  const percent = total === 0 ? 0 : Math.round((doneCount / total) * 100);

  return { items, doneCount, total, percent };
}
