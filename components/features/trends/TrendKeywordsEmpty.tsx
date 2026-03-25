import { TrendingUp } from "lucide-react";

export function TrendKeywordsEmpty() {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-3 text-foreground">
      <TrendingUp className="w-8 h-8 text-muted-foreground" />
      <p className="text-sm font-medium">트렌드 데이터가 없습니다</p>
      <p className="text-xs font-medium text-muted-foreground">
        잠시 후 다시 시도해 주세요.
      </p>
    </div>
  );
}
