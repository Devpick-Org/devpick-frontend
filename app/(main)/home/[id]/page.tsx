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
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex gap-10">
        {/* 본문 */}
        <div className="min-w-0 flex-1">
          <ContentDetail content={content} />
        </div>

        {/* 추천 — 데스크탑만 */}
        <aside className="hidden w-72 shrink-0 pt-14 lg:block">
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
