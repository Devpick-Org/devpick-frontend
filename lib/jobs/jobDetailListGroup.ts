import { sanitizeJobDetailLines } from "@/lib/jobs/sanitizeJobListLines";

export type JobDetailLineGroup = {
  heading: string | null;
  items: string[];
};

const EXACT_HEADINGS = new Set(
  [
    "필수",
    "우대",
    "선택",
    "공통",
    "기타",
    "필수사항",
    "우대사항",
    "required",
    "preferred",
    "optional",
  ].map((x) => x.toLowerCase()),
);

/** JD 본문 줄이 요구사항·경력 등 ‘내용’에 가깝는지 (소제목 후보에서 제외) */
export function looksLikeContentItem(s: string): boolean {
  if (s.length > 42) return true;
  return /\d+\s*년|\d+\s*개월|경력|경험|이상|필요|우선|합니다|습니다|다\.$|SQL|MySQL|AWS|GCP|Docker|Git|REST|API|Kubernetes|Terraform|프레임워크|Node\.js|Python|Java|Kotlin|Spring|React|Vue|Angular|TypeScript|Linux|서버|백엔드|프론트|DB|데이터베이스|데이터|처리|구조화|가공|통합|연계|저장|마이그레이션|운영|설계|구축|테스트|배포|인프라|LLM|AI|MongoDB|PostgreSQL|Redis|Kafka|환경|병원|의무기록/i.test(
    s,
  );
}

function stripTrailingParenLabel(s: string): string {
  return s.replace(/\s*\([^)]{0,80}\)\s*$/, "").trim();
}

function isExactHeading(s: string): boolean {
  const t = stripTrailingParenLabel(s).toLowerCase();
  return EXACT_HEADINGS.has(t);
}

/** "1. 팀 문화" 류 소제목 (단, "3년 경험" 같은 줄은 제외) */
function isNumberedSubheading(s: string): boolean {
  if (!/^\d+[\.\)]\s*\S/.test(s) || s.length > 52) return false;
  if (/\d+\s*년|\d+\s*개월/.test(s)) return false;
  if (looksLikeContentItem(s)) return false;
  return true;
}

/** 짧은 문구·쉼표 없음 → 섹션 제목으로 보는 휴리스틱 (랠릿/노션 덤프용) */
function isImplicitHeading(s: string): boolean {
  if (s.length < 4 || s.length > 34) return false;
  if (s.includes(",")) return false;
  // "A 및 B" 는 업무 항목인 경우가 많음 (예: 의무기록 데이터 처리 및 구조화)
  if (/\s및\s/.test(s)) return false;
  if (looksLikeContentItem(s)) return false;
  return true;
}

function classifyLine(s: string): "heading" | "item" {
  if (isExactHeading(s)) return "heading";
  if (isNumberedSubheading(s)) return "heading";
  if (isImplicitHeading(s)) return "heading";
  return "item";
}

/** 화면에 보일 소제목 문구 (예: 필수 (Required) → 필수) */
function normalizeHeadingDisplay(line: string): string {
  if (isExactHeading(line)) return stripTrailingParenLabel(line);
  return line;
}

/**
 * 평탄한 string[] 을 소제목 + 하위 항목 그룹으로 나눕니다.
 * (필수/우대, "우리가 일하는 방식" 등)
 */
export function groupJobDetailLines(lines: string[] | undefined): JobDetailLineGroup[] {
  const cleaned = sanitizeJobDetailLines(lines);
  if (!cleaned.length) return [];

  const groups: JobDetailLineGroup[] = [];
  let cur: JobDetailLineGroup = { heading: null, items: [] };

  for (const line of cleaned) {
    if (classifyLine(line) === "heading") {
      if (cur.heading !== null || cur.items.length > 0) {
        groups.push(cur);
      }
      cur = { heading: normalizeHeadingDisplay(line), items: [] };
    } else {
      cur.items.push(line);
    }
  }
  if (cur.heading !== null || cur.items.length > 0) {
    groups.push(cur);
  }
  return mergeMisclassifiedHeadingOnlyGroups(groups);
}

/**
 * 항목 없이 소제목만 있는 그룹 중, 실제로는 본문 한 줄인 경우 직전 그룹에 붙임.
 */
function mergeMisclassifiedHeadingOnlyGroups(
  groups: JobDetailLineGroup[],
): JobDetailLineGroup[] {
  const out: JobDetailLineGroup[] = [];
  for (const g of groups) {
    if (g.heading !== null && g.items.length === 0) {
      const line = g.heading;
      const misclassified =
        looksLikeContentItem(line) ||
        /\s및\s/.test(line) ||
        line.length > 40;
      if (misclassified) {
        if (out.length > 0) {
          out[out.length - 1]!.items.push(line);
        } else {
          out.push({ heading: null, items: [line] });
        }
        continue;
      }
    }
    out.push(g);
  }
  return out;
}
