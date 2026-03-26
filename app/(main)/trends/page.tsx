import { TrendPage } from "@/components/features/trends/TrendPage";

export default function Page() {
  return (
    <div className="w-full px-4 py-6 md:px-6 md:py-8 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-xl font-bold tracking-[-0.01em] text-foreground md:text-2xl">키워드 트렌드</h1>
        <p className="mt-1 mb-6 text-sm font-medium text-muted-foreground">
          Stack Overflow 최근 7일 활동량 기준 인기 기술 키워드입니다.
        </p>
        <TrendPage />
      </div>
    </div>
  );
}
