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
      <div className="mx-auto max-w-6xl pb-12">
        <div className="mb-6 rounded-3xl border border-border bg-card px-5 py-5 shadow-sm sm:px-6">
          <p className="text-xs font-bold uppercase tracking-wide text-primary">
            Resume Hub
          </p>
          <h1 className="mt-2 text-2xl font-bold tracking-[-0.03em] text-foreground md:text-3xl">
            이력서 관리
          </h1>
          <p className="mt-2 max-w-2xl text-sm font-medium leading-relaxed text-muted-foreground">
            이력서를 업로드하거나 직접 편집하면 공고 매칭, 면접 Q&A, 부족 역량
            추천에 바로 반영됩니다.
          </p>
        </div>
        <ResumePage defaultTab={defaultTab} />
      </div>
    </div>
  );
}
