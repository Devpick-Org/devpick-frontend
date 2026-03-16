import { contentsEndpoints } from "@/lib/api/endpoints/contents";
import { ContentDetail } from "@/components/features/home/ContentDetail";
import { RecommendedContents } from "@/components/features/home/RecommendedContents";
import type { ContentDetail as ContentDetailType, Content } from "@/types/content";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: Props) {
  const { id } = await params;

  let content: ContentDetailType | null = null;
  let recommended: Content[] = [];

  try {
    [content, recommended] = await Promise.all([
      contentsEndpoints.getContentById(id).then((res) => res.data),
      contentsEndpoints.getContentRecommendations(id).then((res) => res.data.contents),
    ]);
  } catch {
    // getContentById가 reject하면 content는 null 유지
  }

  if (!content) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-muted-foreground">콘텐츠를 찾을 수 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 lg:px-8">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px]">
        {/* 본문 */}
        <main className="min-w-0">
          <ContentDetail content={content} />
        </main>

        {/* 추천 — 데스크탑 */}
        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <RecommendedContents items={recommended} />
          </div>
        </aside>
      </div>

      {/* 추천 — 모바일 */}
      <div className="mt-8 lg:hidden">
        <RecommendedContents items={recommended} />
      </div>
    </div>
  );
}
