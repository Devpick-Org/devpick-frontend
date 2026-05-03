/** 백엔드 MockInterviewPhase(enum 문자열)과 동일한 키 */

export type MockInterviewPhaseKey =
  | "WARM_UP"
  | "PROJECT"
  | "DOMAIN"
  | "CS_INFRA"
  | "BEHAVIORAL";

export const MOCK_INTERVIEW_PHASE_STEPS: {
  phase: MockInterviewPhaseKey;
  from: number;
  to: number;
  title: string;
  questionRangeLabel: string;
}[] = [
  { phase: "WARM_UP", from: 1, to: 2, title: "웜업", questionRangeLabel: "1–2번" },
  { phase: "PROJECT", from: 3, to: 6, title: "프로젝트", questionRangeLabel: "3–6번" },
  {
    phase: "DOMAIN",
    from: 7,
    to: 10,
    title: "직무 심화",
    questionRangeLabel: "7–10번",
  },
  {
    phase: "CS_INFRA",
    from: 11,
    to: 14,
    title: "CS·인프라",
    questionRangeLabel: "11–14번",
  },
  {
    phase: "BEHAVIORAL",
    from: 15,
    to: 15,
    title: "행동·협업",
    questionRangeLabel: "15번",
  },
];

export function phaseTitleKo(phase: string): string {
  const row = MOCK_INTERVIEW_PHASE_STEPS.find((s) => s.phase === phase);
  return row?.title ?? phase;
}

/** 히어로 카드 등 — 짧은 칩용 */
export const MOCK_INTERVIEW_HERO_CHIPS = MOCK_INTERVIEW_PHASE_STEPS.map((s) => ({
  short: s.title,
  detail: `${s.to - s.from + 1}문항`,
  span: s.from === s.to ? `Q${s.from}` : `Q${s.from}–${s.to}`,
}));
