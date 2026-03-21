"use client";

import { AlertCircle, Activity } from "lucide-react";

// TODO: GET /history/activity API 연동 시 props 추가 예정
// interface Props {
//   items?: ActivityItem[];
//   isLoading?: boolean;
//   isError?: boolean;
// }

export default function ActivityContent() {
  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold">활동 내역</h2>
      {/* TODO: ActivityList 연결 예정 */}
      <EmptyState />
    </section>
  );
}

// ── 내부 상태 컴포넌트 ────────────────────────────────────────────────────────
// TODO: LoadingState / ErrorState는 API 연동 시 추가 예정

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function ErrorState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-3 text-foreground">
      <AlertCircle className="w-8 h-8" />
      <p className="text-md font-medium">활동 내역을 불러오지 못했습니다.</p>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-3 text-foreground">
      <Activity className="w-8 h-8" />
      <p className="text-md font-medium">아직 활동 내역이 없어요</p>
      <p className="text-sm font-medium">
        콘텐츠에 좋아요를 누르거나 활동하면 여기에 기록됩니다.
      </p>
    </div>
  );
}
