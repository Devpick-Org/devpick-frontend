import type { QAItem, QACategory } from "@/types/jobs";

function mapItem(raw: Record<string, unknown>): QAItem {
  const follow = raw.followUps;
  return {
    question: String(raw.question ?? ""),
    answer: String(raw.answer ?? ""),
    followUps: Array.isArray(follow)
      ? follow.map((x) => String(x))
      : [],
  };
}

function mapCategory(raw: Record<string, unknown>): QACategory {
  const itemsRaw = raw.items;
  const items = Array.isArray(itemsRaw)
    ? itemsRaw
        .map((x) => (x && typeof x === "object" ? mapItem(x as Record<string, unknown>) : null))
        .filter((x): x is QAItem => x != null)
    : [];
  return {
    title: String(raw.title ?? ""),
    items,
  };
}

/** AI/백엔드가 저장한 면접 Q&A JSON → UI 모델 */
export function parseInterviewQaPayload(payloadJson: string): QACategory[] {
  try {
    const data = JSON.parse(payloadJson) as { categories?: unknown };
    const cats = data.categories;
    if (!Array.isArray(cats)) return [];
    return cats
      .map((c) =>
        c && typeof c === "object" ? mapCategory(c as Record<string, unknown>) : null,
      )
      .filter((x): x is QACategory => x != null && x.items.length > 0);
  } catch {
    return [];
  }
}
