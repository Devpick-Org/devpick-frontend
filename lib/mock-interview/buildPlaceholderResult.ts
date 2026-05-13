/**
 * 모의면접 결과 JSON(서버 저장 형태)을 안전하게 파싱하기 위한 작은 유틸.
 * AI가 일시적으로 실패한 fallback 결과도 그대로 받을 수 있어야 한다.
 */

export interface MockInterviewScores {
  framework: number | null;
  design: number | null;
  problemSolving: number | null;
  csInfra: number | null;
  communication: number | null;
}

export interface MockInterviewPerQuestion {
  questionNo: number;
  questionSummary: string;
  answerSummary: string;
  answerRaw: string;
  modelAnswer: string;
  whyImportant: string;
  learningDirection: string;
  references: string[];
  rating: "GOOD" | "OK" | "WEAK" | null;
  passed: boolean;
}

export interface MockInterviewResult {
  scores: MockInterviewScores;
  overallScore: number | null;
  summary: string;
  strengths: string[];
  improvements: string[];
  actionItems: string[];
  uncoveredKeywords: string[];
  perQuestion: MockInterviewPerQuestion[];
  earlyFinished: boolean;
  answeredCount: number;
  totalQuestions: number;
  coverageFactor: number;
  notice?: string | null;
}

export function parseMockInterviewResult(
  json: string | null | undefined,
): MockInterviewResult | null {
  if (!json) return null;
  try {
    const parsed = JSON.parse(json) as Partial<MockInterviewResult> & {
      scores?: Partial<MockInterviewScores>;
    };
    return {
      scores: {
        framework: numOrNull(parsed.scores?.framework),
        design: numOrNull(parsed.scores?.design),
        problemSolving: numOrNull(parsed.scores?.problemSolving),
        csInfra: numOrNull(parsed.scores?.csInfra),
        communication: numOrNull(parsed.scores?.communication),
      },
      overallScore: numOrNull(parsed.overallScore),
      summary: typeof parsed.summary === "string" ? parsed.summary : "",
      strengths: stringArr(parsed.strengths),
      improvements: stringArr(parsed.improvements),
      actionItems: stringArr(parsed.actionItems),
      uncoveredKeywords: stringArr(parsed.uncoveredKeywords),
      perQuestion: Array.isArray(parsed.perQuestion)
        ? parsed.perQuestion.map((p) => normalizePerQuestion(p))
        : [],
      earlyFinished: Boolean(parsed.earlyFinished),
      answeredCount: typeof parsed.answeredCount === "number" ? parsed.answeredCount : 0,
      totalQuestions: typeof parsed.totalQuestions === "number" ? parsed.totalQuestions : 15,
      coverageFactor:
        typeof parsed.coverageFactor === "number" && parsed.coverageFactor > 0
          ? parsed.coverageFactor
          : 1,
      notice: parsed.notice ?? null,
    };
  } catch {
    return null;
  }
}

function numOrNull(v: unknown): number | null {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  return null;
}

function stringArr(v: unknown): string[] {
  if (!Array.isArray(v)) return [];
  return v
    .filter((x): x is string => typeof x === "string")
    .map((s) => (s.startsWith("- ") ? s.slice(2) : s.startsWith("-") ? s.slice(1) : s));
}

function normalizePerQuestion(raw: unknown): MockInterviewPerQuestion {
  const r = (raw ?? {}) as Partial<MockInterviewPerQuestion>;
  return {
    questionNo: typeof r.questionNo === "number" ? r.questionNo : 0,
    questionSummary: typeof r.questionSummary === "string" ? r.questionSummary : "",
    answerSummary: typeof r.answerSummary === "string" ? r.answerSummary : "",
    answerRaw: typeof r.answerRaw === "string" ? r.answerRaw : "",
    modelAnswer: typeof r.modelAnswer === "string" ? r.modelAnswer : "",
    whyImportant: typeof r.whyImportant === "string" ? r.whyImportant : "",
    learningDirection:
      typeof r.learningDirection === "string" ? r.learningDirection : "",
    references: stringArr(r.references),
    rating:
      r.rating === "GOOD" || r.rating === "OK" || r.rating === "WEAK" ? r.rating : null,
    passed: Boolean(r.passed),
  };
}
