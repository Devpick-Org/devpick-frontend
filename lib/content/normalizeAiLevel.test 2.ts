import { normalizeAiLevel, normalizeQuizLevel } from "./normalizeAiLevel";

describe("normalizeAiLevel", () => {
  it("mid → MIDDLE", () => {
    expect(normalizeAiLevel("mid")).toBe("MIDDLE");
  });

  it("대문자 enum은 그대로", () => {
    expect(normalizeAiLevel("SENIOR")).toBe("SENIOR");
  });

  it("알 수 없으면 JUNIOR", () => {
    expect(normalizeAiLevel("unknown")).toBe("JUNIOR");
  });
});

describe("normalizeQuizLevel", () => {
  it("normalizeAiLevel과 동일한 매핑", () => {
    expect(normalizeQuizLevel("junior")).toBe("JUNIOR");
  });
});
