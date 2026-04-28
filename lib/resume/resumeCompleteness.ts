import type { ResumeData } from "@/types/resume";

/** 기본 정보 수정 vs 상세 편집 중 어디로 안내할지 */
export type CompletenessFixAction = "basic" | "detail";

export interface ResumeCompletenessItem {
  id: string;
  label: string;
  done: boolean;
  /** 왜 이 항목이 필요한지 한두 문장 */
  description: string;
  /** 버튼/링크에 쓸 짧은 문구 */
  actionLabel: string;
  fixAction: CompletenessFixAction;
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
    {
      id: "basic",
      label: "기본 정보 (이름·직무·위치)",
      done: basicOk,
      description:
        "공고 매칭·면접 Q&A에서 사용자를 식별하는 최소 정보입니다. 직무와 지역이 맞아야 추천 품질이 올라갑니다.",
      actionLabel: "기본 정보 수정하기",
      fixAction: "basic",
    },
    {
      id: "tech",
      label: "기술 스택 3개 이상",
      done: techOk,
      description:
        "보유 스킬이 있어야 공고 스킬과 매칭 점수·부족 역량 추천이 의미 있게 계산됩니다.",
      actionLabel: "상세 편집에서 스택 추가",
      fixAction: "detail",
    },
    {
      id: "summary",
      label: "자기소개·요약 40자 이상",
      done: summaryOk,
      description:
        "짧은 한 줄보다 강점·관심 분야·협업 스타일이 드러나는 3~5문장이 면접 자기소개 질문에 바로 쓰기 좋습니다.",
      actionLabel: "상세 편집에서 요약 작성",
      fixAction: "detail",
    },
    {
      id: "project",
      label: "프로젝트 1개 이상",
      done: projectCountOk,
      description:
        "실제로 무엇을 만들었는지 한 건이라도 있으면 매칭·질문 생성이 훨씬 정확해집니다.",
      actionLabel: "상세 편집에서 프로젝트 추가",
      fixAction: "detail",
    },
    {
      id: "projectDesc",
      label: "프로젝트 설명 100자 이상 (한 항목)",
      done: projectDescOk,
      description:
        "무엇을 만들었는지, 어떤 기술로 풀었는지 구체적으로 적어야 AI·매칭이 맥락을 이해합니다.",
      actionLabel: "상세 편집에서 설명 보완",
      fixAction: "detail",
    },
    {
      id: "experience",
      label: "경력 또는 프로젝트 상세 (역할·설명·성과)",
      done: experienceOk,
      description:
        "경력란 또는 프로젝트에서 역할·성과·설명 중 하나라도 채우면 ‘경험 있음’으로 간주됩니다.",
      actionLabel: "상세 편집에서 경력/프로젝트 보완",
      fixAction: "detail",
    },
  ];

  const doneCount = items.filter((i) => i.done).length;
  const total = items.length;
  const percent = total === 0 ? 0 : Math.round((doneCount / total) * 100);

  return { items, doneCount, total, percent };
}
