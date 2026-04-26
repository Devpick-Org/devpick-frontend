import { TAG_GROUPS } from "@/components/features/profile/constants";

/** 직무 문구에 따라 공고에서 흔한 스택 후보 (프로필 태그와 함께 추천 칩으로 사용) */
export function suggestedTechFromJobTitle(jobTitle: string): string[] {
  const t = jobTitle.toLowerCase();
  if (t.includes("백엔드") || t.includes("backend")) {
    return TAG_GROUPS.find((g) => g.label === "백엔드")?.tags ?? [];
  }
  if (t.includes("프론트") || t.includes("frontend")) {
    return TAG_GROUPS.find((g) => g.label === "프론트엔드")?.tags ?? [];
  }
  if (t.includes("풀") || t.includes("full")) {
    return [
      ...(TAG_GROUPS.find((g) => g.label === "프론트엔드")?.tags ?? []),
      ...(TAG_GROUPS.find((g) => g.label === "백엔드")?.tags ?? []),
    ];
  }
  return TAG_GROUPS.flatMap((g) => g.tags).slice(0, 12);
}

export function dedupeCi(arr: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const s of arr) {
    const x = s.trim();
    if (!x) continue;
    const k = x.toLowerCase();
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(x);
  }
  return out;
}

/** 이미 techStack에 없는 추천 태그만 */
export function filterNewSuggestions(
  suggestions: string[],
  techStack: string[],
): string[] {
  const have = new Set(techStack.map((x) => x.toLowerCase()));
  return dedupeCi(
    suggestions.filter((s) => !have.has(s.trim().toLowerCase())),
  );
}
