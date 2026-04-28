/**
 * 이력서 상세 편집용 로컬 추천 초안 (백엔드/AI 미호출).
 * 나중에 서버 AI로 교체할 때 이 모듈의 함수 시그니처를 유지하면 됩니다.
 */

import type { ResumeData, ResumeProject } from "@/types/resume";

const MIN_SUMMARY = 40;
const MIN_PROJECT_DESC = 100;

function pickTechPhrase(techStack: string[], max = 4): string {
  if (techStack.length === 0) return "백엔드 개발";
  return techStack.slice(0, max).join(", ");
}

function ensureMinLength(text: string, min: string): string {
  if (text.length >= MIN_SUMMARY) return text;
  return `${text} ${min}`.trim();
}

/** 자기소개·요약 초안 (40자 이상) */
export function suggestResumeSummary(draft: ResumeData): string {
  const { basicInfo, techStack } = draft;
  const name = basicInfo.name.trim() || "개발자";
  const job = basicInfo.jobTitle.trim() || "백엔드";
  const loc = basicInfo.location.trim() || "국내";
  const tech = pickTechPhrase(techStack);
  const years = basicInfo.careerYears;
  const exp =
    years > 0
      ? `${years}년 차 경력을 바탕으로 `
      : "신입으로서 빠르게 학습하며 ";

  const body =
    `${name}은(는) ${loc}을 기반으로 ${job} 직무에서 활동하고 있습니다. ` +
    `${exp}${tech}를 활용한 서비스 개발 경험이 있으며, 안정적인 API·운영과 협업을 중요하게 생각합니다. ` +
    `문제를 구조적으로 정의하고, 재사용 가능한 설계로 개선해 온 경험이 있습니다. ` +
    `향후에도 사용자 가치와 팀 생산성을 함께 높이는 개발자로 성장하고자 합니다.`;

  return ensureMinLength(
    body,
    "면접에서는 구체적 사례와 수치를 덧붙여 말씀드릴 수 있습니다.",
  );
}

/** 빈 프로젝트 1건 예시 (이름·기간·설명 100자+ 포함) */
export function suggestExampleProject(draft: ResumeData): ResumeProject {
  const job = draft.basicInfo.jobTitle.trim() || "백엔드";
  const tech =
    draft.techStack.length > 0
      ? [...draft.techStack].slice(0, 8)
      : ["Java", "Spring Boot", "MySQL"];
  const name =
    job.length <= 20 ? `${job} 포지션 대표 프로젝트` : "팀 단위 웹 서비스 개발";

  const description =
    `[프로젝트 개요] 본 프로젝트에서는 실사용자 또는 내부 고객을 대상으로 하는 서비스의 핵심 도메인 기능을 구현했습니다. ` +
    `${pickTechPhrase(tech)} 스택을 사용해 REST API, 인증·권한, 데이터 일관성을 고려한 트랜잭션 처리를 적용했습니다. ` +
    `장애와 지연을 줄이기 위해 로깅·모니터링 지표를 정의하고 병목 구간을 점검하여 성능을 개선하는 작업을 수행했습니다. ` +
    `요구사항을 코드로 옮기는 과정과 운영 관점까지 함께 고려하는 습관을 갖추게 된 경험입니다. (본인 경험에 맞게 회사명·기간·수치를 수정하세요.)`;

  const safeDesc =
    description.length >= MIN_PROJECT_DESC
      ? description
      : `${description} 상세한 역할과 성과는 아래 역할·성과란에 이어서 적어 주세요.`;

  return {
    name,
    period: "6개월",
    role: `${job} 담당 — API 설계·구현, DB 모델링, 코드 리뷰 참여`,
    techStack: tech,
    description: safeDesc,
    achievements:
      "지연 구간 식별 후 개선안 적용, 장애 대응 플로우 문서화로 온콜 부담 완화 등 본인 경험에 맞게 수정해 주세요.",
  };
}

/** 특정 프로젝트의 간단 설명 초안 (100자 이상) */
export function suggestProjectDescription(
  draft: ResumeData,
  projectIndex: number,
): string {
  const p = draft.projects[projectIndex];
  if (!p) return "";
  const job = draft.basicInfo.jobTitle.trim() || "백엔드";
  const tech =
    p.techStack.length > 0
      ? pickTechPhrase(p.techStack)
      : pickTechPhrase(draft.techStack);
  const pname = p.name.trim() || "프로젝트";

  const desc =
    `${pname}에서 ${job} 역할로 서비스의 핵심 기능을 설계·구현했습니다. ` +
    `${tech}를 중심으로 비즈니스 요구사항을 도메인 모델과 API 계약으로 정리하고, 예외 상황과 데이터 정합성을 고려한 처리 로직을 작성했습니다. ` +
    `운영 환경에서의 장애 시나리오를 가정해 로그·알람을 점검하고, 반복 업무는 자동화하거나 공통 모듈로 추출해 유지보수성을 높였습니다. ` +
    `팀 컨벤션과 코드 리뷰를 통해 품질 기준을 맞추며 협업했습니다.`;

  return desc.length >= MIN_PROJECT_DESC
    ? desc
    : `${desc} 구체적 기간·규모·사용자 수는 본인 경험에 맞게 덧붙여 주세요.`;
}

/** 역할·성과 문장 초안 */
export function suggestProjectRoleAchievements(
  draft: ResumeData,
  projectIndex: number,
): { role: string; achievements: string } {
  const p = draft.projects[projectIndex];
  if (!p) return { role: "", achievements: "" };
  const job = draft.basicInfo.jobTitle.trim() || "백엔드";
  const pname = p.name.trim() || "프로젝트";

  const role = `${job} — ${pname}에서 API·도메인 로직 구현, 스키마 설계, 운영 이슈 대응`;

  const achievements =
    `주요 API 응답 지연 구간을 프로파일링해 병목을 제거하고, 장애 재발 방지를 위해 원인 분석 문서를 남겼습니다. ` +
    `배포·롤백 절차를 정리해 릴리스 리스크를 줄였으며, 팀 내 기술 공유로 온보딩 시간을 단축하는 데 기여했습니다. ` +
    `(수치·기간은 본인 실적에 맞게 수정하세요.)`;

  return { role, achievements };
}
