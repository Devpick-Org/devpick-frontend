import { ResumePage } from "@/components/features/resume/ResumePage";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab } = await searchParams;
  const defaultTab = tab === "qa" ? "qa" : "resume";

  return (
    <div className="w-full px-4 py-6 md:px-6 md:py-8 lg:px-8">
      <div className="mx-auto max-w-4xl pb-12">
        <h1 className="text-xl font-bold tracking-[-0.01em] text-foreground md:text-2xl">
          이력서 관리
        </h1>
        <p className="mb-6 mt-1 text-sm font-medium text-muted-foreground">
          이력서를 등록하면 공고 매칭과 면접 Q&A를 생성할 수 있습니다.
        </p>
        <ResumePage defaultTab={defaultTab} />
      </div>
    </div>
  );
}
