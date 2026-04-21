import { JobCard } from "./JobCard";
import type { Job } from "@/types/jobs";

interface JobListProps {
  jobs: Job[];
  searchQuery?: string;
}

export function JobList({ jobs, searchQuery = "" }: JobListProps) {
  if (jobs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
        <p className="text-sm font-medium">
          {searchQuery.trim()
            ? `"${searchQuery}"에 대한 채용 공고가 없습니다.`
            : "조건에 맞는 채용 공고가 없습니다."}
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-x-4 sm:grid-cols-2 lg:grid-cols-3">
      {jobs.map((job) => (
        <JobCard key={job.id} job={job} />
      ))}
    </div>
  );
}
