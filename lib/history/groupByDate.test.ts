import {
  filterByPeriod,
  filterByActions,
  filterByActivityActions,
  groupByDate,
} from "./groupByDate";
import type { HistoryItem, ActivityItem } from "@/types/history";

// --- 헬퍼 ---

/** n일 전 날짜를 ISO 8601 UTC(Z) 형식으로 반환 (KST 정오 = UTC 03:00 기준) */
function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setUTCHours(3, 0, 0, 0); // KST 12:00 = UTC 03:00
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${day}T03:00:00Z`;
}

function makeHistoryItem(
  overrides: Partial<HistoryItem> & { createdAt: string }
): HistoryItem {
  return {
    id: overrides.id ?? "test-id",
    actionType: "content_opened",
    content: null,
    post: null,
    answer: null,
    points: null,
    ...overrides,
  };
}

function makeActivityItem(
  overrides: Partial<ActivityItem> & { createdAt: string }
): ActivityItem {
  return {
    id: overrides.id ?? "test-id",
    actionType: "content_liked",
    content: null,
    post: null,
    answer: null,
    comment: null,
    points: null,
    ...overrides,
  };
}

// --- filterByPeriod ---

describe("filterByPeriod", () => {
  it("'all'이면 전체 아이템을 반환한다", () => {
    // given
    const items = [
      makeHistoryItem({ createdAt: daysAgo(100) }),
      makeHistoryItem({ createdAt: daysAgo(1) }),
    ];

    // when
    const result = filterByPeriod(items, "all");

    // then
    expect(result).toHaveLength(2);
  });

  it("'7d'이면 7일 이내 아이템만 반환한다", () => {
    // given
    const items = [
      makeHistoryItem({ id: "recent", createdAt: daysAgo(6) }),
      makeHistoryItem({ id: "old", createdAt: daysAgo(8) }),
    ];

    // when
    const result = filterByPeriod(items, "7d");

    // then
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("recent");
  });

  it("'30d'이면 30일 이내 아이템만 반환한다", () => {
    // given
    const items = [
      makeHistoryItem({ id: "in-range", createdAt: daysAgo(29) }),
      makeHistoryItem({ id: "out-of-range", createdAt: daysAgo(31) }),
    ];

    // when
    const result = filterByPeriod(items, "30d");

    // then
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("in-range");
  });

  it("빈 배열이면 빈 배열을 반환한다", () => {
    expect(filterByPeriod([], "7d")).toEqual([]);
  });
});

// --- filterByActions ---

describe("filterByActions", () => {
  const items: HistoryItem[] = [
    makeHistoryItem({ id: "a", actionType: "scrapped", createdAt: "2026-03-21T01:00:00Z" }),
    makeHistoryItem({ id: "b", actionType: "content_opened", createdAt: "2026-03-21T00:00:00Z" }),
    makeHistoryItem({ id: "c", actionType: "ai_summary_viewed", createdAt: "2026-03-20T23:00:00Z" }),
  ];

  it("선택된 액션이 없으면 전체 아이템을 반환한다", () => {
    // given / when
    const result = filterByActions(items, []);

    // then
    expect(result).toHaveLength(3);
  });

  it("선택된 액션 타입에 해당하는 아이템만 반환한다", () => {
    // given / when
    const result = filterByActions(items, ["scrapped"]);

    // then
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("a");
  });

  it("여러 액션 타입을 선택하면 해당하는 모든 아이템을 반환한다", () => {
    // given / when
    const result = filterByActions(items, ["scrapped", "content_opened"]);

    // then
    expect(result).toHaveLength(2);
  });
});

// --- filterByActivityActions ---

describe("filterByActivityActions", () => {
  const items: ActivityItem[] = [
    makeActivityItem({ id: "a", actionType: "content_liked", createdAt: "2026-03-21T01:00:00Z" }),
    makeActivityItem({ id: "b", actionType: "answer_written", createdAt: "2026-03-21T00:00:00Z" }),
    makeActivityItem({ id: "c", actionType: "answer_adopted", createdAt: "2026-03-20T23:00:00Z" }),
    makeActivityItem({ id: "d", actionType: "daily_login", createdAt: "2026-03-20T22:00:00Z" }),
  ];

  it("선택된 액션이 없으면 전체 아이템을 반환한다", () => {
    expect(filterByActivityActions(items, [])).toHaveLength(4);
  });

  it("'answer' 가상 값은 answer_written과 answer_adopted를 모두 포함한다", () => {
    // given / when
    const result = filterByActivityActions(items, ["answer"]);

    // then
    expect(result).toHaveLength(2);
    expect(result.map((i) => i.actionType)).toEqual(
      expect.arrayContaining(["answer_written", "answer_adopted"])
    );
  });

  it("실제 액션 타입으로 필터링하면 해당 타입만 반환한다", () => {
    // given / when
    const result = filterByActivityActions(items, ["content_liked"]);

    // then
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("a");
  });
});

// --- groupByDate ---

describe("groupByDate", () => {
  it("빈 배열이면 빈 배열을 반환한다", () => {
    expect(groupByDate([])).toEqual([]);
  });

  it("같은 날짜의 아이템은 하나의 그룹으로 묶인다", () => {
    // given
    const items = [
      makeHistoryItem({ id: "a", createdAt: "2026-03-21T01:00:00Z" }),
      makeHistoryItem({ id: "b", createdAt: "2026-03-21T00:00:00Z" }),
    ];

    // when
    const result = groupByDate(items);

    // then
    expect(result).toHaveLength(1);
    expect(result[0].count).toBe(2);
    expect(result[0].dateKey).toBe("2026-03-21");
  });

  it("다른 날짜의 아이템은 각각 별도 그룹으로 나뉜다", () => {
    // given
    const items = [
      makeHistoryItem({ id: "a", createdAt: "2026-03-21T01:00:00Z" }),
      makeHistoryItem({ id: "b", createdAt: "2026-03-20T01:00:00Z" }),
    ];

    // when
    const result = groupByDate(items);

    // then
    expect(result).toHaveLength(2);
  });

  it("그룹은 최신 날짜 순으로 정렬된다", () => {
    // given
    const items = [
      makeHistoryItem({ id: "old", createdAt: "2026-03-20T01:00:00Z" }),
      makeHistoryItem({ id: "new", createdAt: "2026-03-21T01:00:00Z" }),
    ];

    // when
    const result = groupByDate(items);

    // then
    expect(result[0].dateKey).toBe("2026-03-21");
    expect(result[1].dateKey).toBe("2026-03-20");
  });

  it("같은 날짜 그룹 내 아이템은 최신순으로 정렬된다", () => {
    // given
    const items = [
      makeHistoryItem({ id: "early", createdAt: "2026-03-21T00:00:00Z" }),
      makeHistoryItem({ id: "late", createdAt: "2026-03-21T02:00:00Z" }),
    ];

    // when
    const result = groupByDate(items);

    // then
    expect(result[0].items[0].id).toBe("late");
    expect(result[0].items[1].id).toBe("early");
  });

  it("UTC 기준 전날 오후지만 KST 기준 당일인 아이템이 올바른 날짜로 그룹핑된다", () => {
    // given
    // "2026-03-20T15:30:00Z" = UTC 3/20 오후 → KST 3/21 00:30
    const items = [
      makeHistoryItem({ id: "kst-next-day", createdAt: "2026-03-20T15:30:00Z" }),
      makeHistoryItem({ id: "kst-same-day", createdAt: "2026-03-21T01:00:00Z" }),
    ];

    // when
    const result = groupByDate(items);

    // then — 둘 다 KST 기준 3/21이므로 같은 그룹
    expect(result).toHaveLength(1);
    expect(result[0].dateKey).toBe("2026-03-21");
    expect(result[0].count).toBe(2);
  });
});
