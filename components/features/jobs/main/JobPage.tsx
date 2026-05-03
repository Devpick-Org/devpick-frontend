"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { AlertCircle } from "lucide-react";
import type { JobSortBy } from "@/lib/mock/jobs";
import { jobsEndpoints } from "@/lib/api/endpoints/jobs";
import { resumeEndpoints } from "@/lib/api/endpoints/resume";
import { mapJobListItem } from "@/lib/jobs/mapJobApi";
import { masterJsonToResumeData } from "@/lib/resume/masterResumeJson";
import { Skeleton } from "@/components/ui/skeleton";
import { type JobFilters } from "./JobFilterBar";
import { JobSearchPanel } from "./JobSearchPanel";
import { JobSortBar } from "./JobSortBar";
import { JobList } from "./JobList";
import { JobPagination } from "./JobPagination";
import { ResumeSummaryBanner } from "./ResumeSummaryBanner";
import type { Job } from "@/types/jobs";

const PAGE_SIZE = 9;

const DEFAULT_FILTERS: JobFilters = {
  category: "ALL",
  experienceLevel: "ALL",
  techStack: [],
  companyNames: [],
  location: "ALL",
};

function JobListSkeleton() {
  return (
    <div className="grid gap-x-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: PAGE_SIZE }).map((_, i) => (
        <div key={i} className="p-5 border-b border-border">
          <div className="mb-3 flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 shrink-0 rounded-lg" />
              <div>
                <Skeleton className="mb-1.5 h-4 w-24 rounded" />
                <Skeleton className="h-3 w-32 rounded" />
              </div>
            </div>
            <Skeleton className="h-7 w-7 rounded-lg" />
          </div>
          <Skeleton className="mb-4 h-5 w-4/5 rounded" />
          <Skeleton className="mb-1.5 h-3 w-full rounded" />
          <Skeleton className="mb-4 h-1.5 w-full rounded-full" />
          <div className="mb-4 flex gap-1.5">
            <Skeleton className="h-6 w-14 rounded-full" />
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>
          <Skeleton className="h-4 w-3/5 rounded" />
        </div>
      ))}
    </div>
  );
}

function JobErrorState({ searchQuery }: { searchQuery: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[40vh] gap-3 text-foreground">
      <AlertCircle className="w-8 h-8" />
      <p className="text-sm font-medium">
        {searchQuery.trim()
          ? "검색 결과를 불러오지 못했습니다."
          : "채용 공고를 불러오지 못했습니다."}
      </p>
    </div>
  );
}

interface JobResultsProps {
  isLoading: boolean;
  isError: boolean;
  jobs: Job[];
  searchQuery: string;
}

function JobResults({
  isLoading,
  isError,
  jobs,
  searchQuery,
}: JobResultsProps) {
  if (isLoading) return <JobListSkeleton />;
  if (isError) return <JobErrorState searchQuery={searchQuery} />;
  return <JobList jobs={jobs} searchQuery={searchQuery} />;
}

export function JobPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [filters, setFilters] = useState<JobFilters>(DEFAULT_FILTERS);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<JobSortBy>("MATCH");

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(searchQuery), 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const { data: resumeJson } = useQuery({
    queryKey: ["master-resume"],
    queryFn: resumeEndpoints.getMasterOrNull,
    staleTime: 60_000,
  });
  const hasResume = resumeJson != null;
  const resumeForBanner = resumeJson ? masterJsonToResumeData(resumeJson) : undefined;

  const techStackParam =
    filters.techStack.length > 0 ? filters.techStack.join(",") : undefined;
  const companiesParam =
    filters.companyNames.length > 0 ? filters.companyNames.join(",") : undefined;
  const locationParam = filters.location === "ALL" ? undefined : filters.location;

  const { data, isLoading, isError } = useQuery({
    queryKey: ["jobs", currentPage, debouncedQuery, filters, sortBy],
    queryFn: () =>
      jobsEndpoints
        .list({
          page: currentPage - 1,
          size: PAGE_SIZE,
          query: debouncedQuery.trim() || undefined,
          category: filters.category === "ALL" ? undefined : filters.category,
          experienceLevel:
            filters.experienceLevel === "ALL" ? undefined : filters.experienceLevel,
          location: locationParam,
          techStack: techStackParam,
          companies: companiesParam,
          sortBy,
        })
        .then((page) => ({
          jobs: page.jobs.map(mapJobListItem),
          totalCount: page.totalCount,
          totalPages: page.totalPages,
        })),
  });

  const filteredJobs = data?.jobs ?? [];

  const hasActiveFilters =
    filters.category !== "ALL" ||
    filters.experienceLevel !== "ALL" ||
    filters.techStack.length > 0 ||
    filters.companyNames.length > 0 ||
    filters.location !== "ALL";

  const handleFiltersChange = (next: JobFilters) => {
    setFilters(next);
    setCurrentPage(1);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSortChange = (sort: JobSortBy) => {
    setSortBy(sort);
    setCurrentPage(1);
  };

  return (
    <div className="flex flex-col gap-5">
      <ResumeSummaryBanner
        hasResume={hasResume}
        resume={hasResume ? resumeForBanner : undefined}
      />
      <JobSearchPanel
        searchQuery={searchQuery}
        onSearch={handleSearch}
        filters={filters}
        onChange={handleFiltersChange}
        hasActiveFilters={hasActiveFilters}
        onReset={() => {
          setFilters(DEFAULT_FILTERS);
          setCurrentPage(1);
        }}
      />
      <JobSortBar
        totalCount={data?.totalCount ?? 0}
        sortBy={sortBy}
        onSortChange={handleSortChange}
      />
      <JobResults
        isLoading={isLoading}
        isError={isError}
        jobs={filteredJobs}
        searchQuery={searchQuery}
      />
      <JobPagination
        currentPage={currentPage}
        totalPages={data?.totalPages ?? 1}
        onPageChange={handlePageChange}
        className="mt-8 mb-12"
      />
    </div>
  );
}
