import { dedupeTags, formatDate, formatDateTime, formatTime, formatWeekLabel } from "./utils";

describe("dedupeTags", () => {
  it("중복 태그를 제거한다", () => {
    // given
    const tags = ["React", "React", "TypeScript"];

    // when
    const result = dedupeTags(tags);

    // then
    expect(result).toEqual(["React", "TypeScript"]);
  });

  it("undefined이면 빈 배열을 반환한다", () => {
    expect(dedupeTags(undefined)).toEqual([]);
  });
});

describe("formatDate", () => {
  it("datetime 문자열을 날짜만 한국어 형식으로 변환한다", () => {
    // given
    const dateStr = "2026-03-21T10:30:00";

    // when
    const result = formatDate(dateStr);

    // then — 날짜 핵심 값만 검증 (ICU 버전별 포맷 차이 방어)
    expect(result).toContain("2026");
    expect(result).toContain("3");
    expect(result).toContain("21");
  });

  it("1월 1일도 올바르게 변환한다", () => {
    const result = formatDate("2026-01-01T00:00:00");
    expect(result).toContain("2026");
    expect(result).toContain("1");
  });
});

describe("formatDateTime", () => {
  it("오전 시간의 날짜와 시각을 포함한다", () => {
    // given
    const dateStr = "2026-03-21T10:30:00";

    // when
    const result = formatDateTime(dateStr);

    // then
    expect(result).toContain("2026");
    expect(result).toContain("3");
    expect(result).toContain("21");
    expect(result).toContain("10:30");
    expect(result).toMatch(/오전|AM/);
  });

  it("오후 시간임을 나타내는 표시를 포함한다", () => {
    // given
    const dateStr = "2026-03-21T14:05:00";

    // when
    const result = formatDateTime(dateStr);

    // then
    expect(result).toMatch(/오후|PM/);
    expect(result).toMatch(/2:05|02:05|14:05/);
  });
});

describe("formatTime", () => {
  it("오전 시간을 시:분 형식으로 변환한다", () => {
    // given
    const dateStr = "2026-03-21T10:30:00";

    // when
    const result = formatTime(dateStr);

    // then
    expect(result).toContain("10:30");
    expect(result).toMatch(/오전|AM/);
  });

  it("자정(00:00)은 오전으로 표시된다", () => {
    const result = formatTime("2026-03-21T00:00:00");
    expect(result).toMatch(/오전|AM/);
    expect(result).toMatch(/12:00|0:00/);
  });

  it("23:59은 오후로 표시된다", () => {
    const result = formatTime("2026-03-21T23:59:00");
    expect(result).toMatch(/오후|PM/);
    expect(result).toMatch(/11:59|23:59/);
  });
});

describe("formatWeekLabel", () => {
  it("월의 첫 번째 날이 속한 주를 1주차로 반환한다", () => {
    // given - 2026년 3월 1일 (일요일)
    const weekStart = "2026-03-01";

    // when
    const result = formatWeekLabel(weekStart);

    // then — 문자열 조합이라 timezone 무관, 정확 비교
    expect(result).toBe("2026년 3월 1주차");
  });

  it("날짜에 맞는 주차를 반환한다", () => {
    expect(formatWeekLabel("2026-03-14")).toBe("2026년 3월 3주차");
  });

  it("월이 바뀌는 경우 해당 월 기준 주차를 반환한다", () => {
    expect(formatWeekLabel("2026-03-16")).toBe("2026년 3월 4주차");
  });
});
