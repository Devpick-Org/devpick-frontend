import type { TrendKeywordsResponse } from "@/types/trends";

export function mockGetTrendKeywords(): Promise<TrendKeywordsResponse> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: {
          keywords: [
            "python",
            "javascript",
            "react",
            "typescript",
            "docker",
            "kubernetes",
            "node.js",
            "aws",
            "sql",
            "git",
            "java",
            "c#",
            "next.js",
            "postgresql",
            "redis",
            "graphql",
            "rust",
            "golang",
            "mongodb",
            "tailwindcss",
          ],
          updatedAt: "2026-03-23T00:00:00.000Z",
        },
        message: "트렌드 키워드를 불러왔습니다",
      });
    }, 600);
  });
}
