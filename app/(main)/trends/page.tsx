import { redirect } from "next/navigation";
import { EcosystemTrendsPage } from "@/components/features/trends/EcosystemTrendsPage";
import { isTrendsFeatureEnabled } from "@/lib/env/publicFeatureFlags";

export default function Page() {
  if (!isTrendsFeatureEnabled()) {
    redirect("/home");
  }

  return (
    <div className="w-full px-4 py-6 md:px-6 md:py-8 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-xl font-bold tracking-[-0.01em] text-foreground md:text-2xl">개발 생태계 트렌드</h1>
        <p className="mt-1 mb-6 text-sm font-medium text-muted-foreground">
          부트캠퍼·테카 IT 동아리·데브이벤트에서 고정 주기로 수집한 모집·행사 정보입니다. 카드에서 원문으로 이동할 수 있습니다.
        </p>
        <EcosystemTrendsPage />
      </div>
    </div>
  );
}
