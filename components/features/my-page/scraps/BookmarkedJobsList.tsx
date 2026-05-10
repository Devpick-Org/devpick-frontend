"use client";

import { useState } from "react";
import { ChevronDown, Search } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useQuery } from "@tanstack/react-query";
import { BookmarkedJobListItem } from "./BookmarkedJobListItem";
import { MyPagePagination } from "../MyPagePagination";
import { getMyJobBookmarks } from "@/lib/api/endpoints/myPage";

type SortOrder = "newest" | "oldest" | "match";

function ListItemSkeleton() {
  return (
    <div className="-mx-2 flex gap-4 px-2 py-3">
      <Skeleton className="h-12 w-12 shrink-0 rounded-lg" />
      <div className="flex flex-1 flex-col gap-1 py-0.5">
        <Skeleton className="h-3 w-20 rounded" />
        <Skeleton className="h-4 w-full rounded" />
        <Skeleton className="h-4 w-4/5 rounded" />
        <div className="mt-1 w-3/5">
          <div className="mb-1 flex items-center justify-between">
            <Skeleton className="h-3 w-14" />
            <Skeleton className="h-3 w-8" />
          </div>
          <Skeleton className="h-1.5 w-full rounded-full" />
        </div>
        <Skeleton className="h-3 w-24 rounded" />
        <div className="mt-2 flex gap-1">
          <Skeleton className="h-4 w-12 rounded-full" />
          <Skeleton className="h-4 w-12 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function BookmarkedJobsList() {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortOrder>("match");
  const [page, setPage] = useState(0);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["myJobBookmarks", query.trim(), sort, page],
    queryFn: () =>
      getMyJobBookmarks({
        q: query.trim() || undefined,
        sort,
        page,
        size: 10,
      }),
  });

  const handleQueryChange = (value: string) => {
    setQuery(value);
    setPage(0);
  };

  const handleSortChange = (value: string) => {
    setSort(value as SortOrder);
    setPage(0);
  };

  const handlePageChange = (nextPage: number) => {
    setPage(nextPage - 1);
  };

  return (
    <div>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <span className="text-sm text-muted-foreground">
          {data?.totalElements ?? 0}개
        </span>
        <div className="flex items-center gap-2 sm:justify-end">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="회사명, 공고 제목 검색"
              value={query}
              onChange={(e) => handleQueryChange(e.target.value)}
              className="h-8 w-48 rounded-md border border-border bg-background pl-7 pr-3 text-sm placeholder:text-muted-foreground focus:outline-none"
            />
          </div>
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger className="flex h-8 w-24 cursor-pointer items-center justify-between rounded-md border border-border bg-background px-3 text-sm text-foreground focus:outline-none">
              {sort === "newest" ? "최신순" : sort === "oldest" ? "오래된순" : "매칭순"}
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-[6rem] p-1">
              <DropdownMenuRadioGroup value={sort} onValueChange={handleSortChange}>
                <DropdownMenuRadioItem className="cursor-pointer" value="match">
                  매칭순
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem className="cursor-pointer" value="newest">
                  최신순
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem className="cursor-pointer" value="oldest">
                  오래된순
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {isLoading ? (
        <div className="divide-y divide-border">
          {Array.from({ length: 5 }).map((_, i) => (
            <ListItemSkeleton key={i} />
          ))}
        </div>
      ) : isError ? (
        <p className="py-10 text-center text-sm text-muted-foreground">
          불러오는 중 오류가 발생했습니다.
        </p>
      ) : data?.totalElements === 0 ? (
        <p className="py-10 text-center text-sm text-muted-foreground">
          {query ? "검색 결과가 없습니다." : "스크랩한 공고가 없습니다."}
        </p>
      ) : (
        <>
          <div className="divide-y divide-border">
            {data?.bookmarks.map((bookmark) => (
              <BookmarkedJobListItem key={bookmark.jobPostingId} bookmark={bookmark} />
            ))}
          </div>
          {data && data.totalPages > 1 && (
            <MyPagePagination
              currentPage={page + 1}
              totalPages={data.totalPages}
              onPageChange={handlePageChange}
              className="mt-8 mb-12"
            />
          )}
        </>
      )}
    </div>
  );
}
