"use client";

import { useEffect, useState } from "react";
import { ChevronDown, Search } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrappedPostListItem } from "./ScrappedPostListItem";
import { MyPagePagination } from "../MyPagePagination";
import { fetchMyScraps } from "@/lib/mock/my-page-scraps";
import type { MyPageScrapResponse } from "@/types/myPage";

type SortOrder = "newest" | "oldest";

function ListItemSkeleton() {
  return (
    <div className="-mx-2 flex gap-4 px-2 py-3">
      <Skeleton className="aspect-[3/2] w-36 shrink-0 rounded-sm" />
      <div className="flex flex-1 flex-col gap-2 py-0.5">
        <Skeleton className="h-3 w-16 rounded" />
        <Skeleton className="h-4 w-full rounded" />
        <Skeleton className="h-4 w-4/5 rounded" />
        <Skeleton className="mt-auto h-3 w-20 rounded" />
      </div>
    </div>
  );
}

export function ScrappedPostsList() {
  const [data, setData] = useState<MyPageScrapResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortOrder>("newest");
  const [page, setPage] = useState(0);

  useEffect(() => {
    let cancelled = false;

    fetchMyScraps({ q: query || undefined, sort, page, size: 10 })
      .then((res) => {
        if (!cancelled) setData(res);
      })
      .catch(() => {
        if (!cancelled) setIsError(true);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [query, sort, page]);

  const handleQueryChange = (value: string) => {
    setQuery(value);
    setPage(0);
    setIsLoading(true);
    setIsError(false);
  };

  const handleSortChange = (value: string) => {
    setSort(value as SortOrder);
    setPage(0);
    setIsLoading(true);
    setIsError(false);
  };

  const handlePageChange = (nextPage: number) => {
    setPage(nextPage - 1);
    setIsLoading(true);
    setIsError(false);
  };

  if (isLoading) {
    return (
      <div className="divide-y divide-border">
        {Array.from({ length: 5 }).map((_, i) => (
          <ListItemSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <p className="py-10 text-center text-sm text-muted-foreground">
        불러오는 중 오류가 발생했습니다.
      </p>
    );
  }

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
              placeholder="검색"
              value={query}
              onChange={(e) => handleQueryChange(e.target.value)}
              className="h-8 w-40 rounded-md border border-border bg-background pl-7 pr-3 text-sm placeholder:text-muted-foreground focus:outline-none"
            />
          </div>
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger className="flex h-8 w-24 cursor-pointer items-center justify-between rounded-md border border-border bg-background px-3 text-sm text-foreground focus:outline-none">
              {sort === "newest" ? "최신순" : "오래된순"}
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-[6rem] p-1">
              <DropdownMenuRadioGroup
                value={sort}
                onValueChange={handleSortChange}
              >
                <DropdownMenuRadioItem className="cursor-pointer" value="newest">
                  최신순
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem
                  className="cursor-pointer"
                  value="oldest"
                >
                  오래된순
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {data?.totalElements === 0 ? (
        <p className="py-10 text-center text-sm text-muted-foreground">
          {query ? "검색 결과가 없습니다." : "스크랩한 글이 없습니다."}
        </p>
      ) : (
        <>
          <div className="divide-y divide-border">
            {data?.content.map((scrap) => (
              <ScrappedPostListItem key={scrap.contentId} scrap={scrap} />
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
