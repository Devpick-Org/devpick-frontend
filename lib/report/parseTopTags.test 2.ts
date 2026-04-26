import { parseReportTopTags } from "./parseTopTags";

describe("parseReportTopTags", () => {
  it("null/빈 문자열은 빈 배열", () => {
    expect(parseReportTopTags(null)).toEqual([]);
    expect(parseReportTopTags(undefined)).toEqual([]);
    expect(parseReportTopTags("")).toEqual([]);
  });

  it("JSON 배열에서 tag 필드 추출", () => {
    const raw = `[{"tag":"React","count":3},{"tag":"Next.js","count":2}]`;
    expect(parseReportTopTags(raw)).toEqual(["React", "Next.js"]);
  });

  it("tagName 필드도 지원", () => {
    const raw = `[{"tagName":"Java","count":1}]`;
    expect(parseReportTopTags(raw)).toEqual(["Java"]);
  });

  it("쉼표 구분 레거시 문자열", () => {
    expect(parseReportTopTags("A, B, C")).toEqual(["A", "B", "C"]);
  });
});
