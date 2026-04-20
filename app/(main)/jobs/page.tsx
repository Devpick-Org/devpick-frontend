import { JobPage } from "@/components/features/jobs/JobPage";

export default function Page() {
  return (
    <div className="w-full px-4 py-6 md:px-6 md:py-8 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-xl font-bold tracking-[-0.01em] text-foreground md:text-2xl">
          채용 공고
        </h1>
        <p className="mt-1 mb-6 text-sm font-medium text-muted-foreground">
          내 기술 스택과 매칭된 채용 공고를 확인해 보세요.
        </p>
        <JobPage />
      </div>
    </div>
  );
}
