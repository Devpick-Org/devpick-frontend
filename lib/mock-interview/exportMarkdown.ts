import type {
  MockInterviewSessionDetailApi,
  MockInterviewTurnApi,
} from "@/lib/api/endpoints/mock-interviews";
import { phaseTitleKo } from "@/components/features/mock-interview/phaseLabels";
import type { MockInterviewResult } from "./buildPlaceholderResult";

export function buildMockInterviewMarkdown(
  session: MockInterviewSessionDetailApi,
  result: MockInterviewResult | null,
): string {
  const lines: string[] = [];
  lines.push(`# 모의면접 결과 — ${session.companyName || "직접 입력 JD"} ${session.jobTitle}`);
  lines.push("");
  lines.push(`- 진행: ${session.answeredCount}/${session.totalQuestions} 문항`);
  lines.push(`- 모델: ${session.modelKey}`);
  lines.push(`- 종료 시각: ${session.updatedAt}`);
  if (result?.earlyFinished) {
    lines.push(`- 조기 종료: 진행률 보정 계수 ${result.coverageFactor.toFixed(2)}`);
  }
  lines.push("");

  if (result) {
    lines.push("## 종합 평가");
    if (typeof result.overallScore === "number") {
      lines.push(`- 종합 점수: ${result.overallScore}`);
    } else {
      lines.push(`- 종합 점수: — (평가 가능한 영역이 부족합니다)`);
    }
    lines.push("");
    lines.push("### 영역 점수");
    lines.push(`- 프레임워크 역량: ${formatScore(result.scores.framework)}`);
    lines.push(`- 설계/판단: ${formatScore(result.scores.design)}`);
    lines.push(`- 문제 해결: ${formatScore(result.scores.problemSolving)}`);
    lines.push(`- CS/인프라: ${formatScore(result.scores.csInfra)}`);
    lines.push(`- 커뮤니케이션: ${formatScore(result.scores.communication)}`);
    lines.push("");
    if (result.summary) {
      lines.push("### 전체 인상");
      lines.push(result.summary);
      lines.push("");
    }
    if (result.strengths.length > 0) {
      lines.push("### 강점");
      result.strengths.forEach((s) => lines.push(`- ${s}`));
      lines.push("");
    }
    if (result.improvements.length > 0) {
      lines.push("### 개선이 필요한 부분");
      result.improvements.forEach((s) => lines.push(`- ${s}`));
      lines.push("");
    }
    if (result.actionItems.length > 0) {
      lines.push("### 액션 아이템");
      result.actionItems.forEach((s) => lines.push(`- ${s}`));
      lines.push("");
    }
    if (result.uncoveredKeywords.length > 0) {
      lines.push("### 다루지 못한 영역");
      lines.push(result.uncoveredKeywords.join(", "));
      lines.push("");
    }
  }

  lines.push("## 전체 대화와 모범 답안");
  for (const q of session.plan.questions) {
    const phase = phaseTitleKo(q.phase);
    lines.push("");
    lines.push(`### Q${q.questionNo}. [${phase}] ${q.topic}`);
    lines.push(q.prompt);
    const turns = session.turns.filter((t) => t.questionNo === q.questionNo);
    for (const turn of turns) {
      lines.push("");
      lines.push(`- ${turnTypeLabel(turn)}`);
      if (turn.content) lines.push(`> ${escapeQuote(turn.content)}`);
    }
    const fb = result?.perQuestion.find((p) => p.questionNo === q.questionNo);
    if (fb) {
      if (fb.modelAnswer) {
        lines.push("");
        lines.push(`#### 모범 답안`);
        lines.push(fb.modelAnswer);
      }
      if (fb.whyImportant) {
        lines.push("");
        lines.push(`- 이 질문이 중요한 이유: ${fb.whyImportant}`);
      }
      if (fb.learningDirection) {
        lines.push(`- 학습 방향: ${fb.learningDirection}`);
      }
      if (fb.references.length > 0) {
        lines.push(`- 참고 자료: ${fb.references.join(" / ")}`);
      }
    }
  }
  return lines.join("\n");
}

function formatScore(v: number | null): string {
  return typeof v === "number" ? `${v}` : "— (질문하지 않음)";
}

function turnTypeLabel(turn: MockInterviewTurnApi): string {
  switch (turn.type) {
    case "QUESTION":
      return "질문";
    case "ANSWER":
      return "내 답변";
    case "FOLLOW_UP_QUESTION":
      return "꼬리질문";
    case "FOLLOW_UP_ANSWER":
      return "꼬리질문 답변";
    case "RETRY_REQUEST":
      return "재답변 요청";
    case "RETRY_ANSWER":
      return "재답변";
    case "PASS":
      return "패스";
    default:
      return turn.type;
  }
}

function escapeQuote(s: string): string {
  return s.replace(/\r?\n/g, "\n> ");
}

export function downloadMarkdown(filename: string, content: string): void {
  const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
