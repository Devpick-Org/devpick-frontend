import { dedupeTags } from "./utils";

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
