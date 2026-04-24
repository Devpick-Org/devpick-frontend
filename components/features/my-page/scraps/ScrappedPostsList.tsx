"use client";

import { useEffect, useState, useMemo } from "react";
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
import type { MyPageScrap } from "@/types/myPage";

const PAGE_SIZE = 10;

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
  const [scraps, setScraps] = useState<MyPageScrap[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortOrder>("newest");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchMyScraps()
      .then((data) => setScraps(data))
      .catch(() => setIsError(true))
      .finally(() => setIsLoading(false));
  }, []);

  const processed = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = q
      ? scraps.filter(
          (s) =>
            s.title.toLowerCase().includes(q) ||
            s.sourceName.toLowerCase().includes(q) ||
            (s.summary?.toLowerCase().includes(q) ?? false),
        )
      : scraps;

    return [...filtered].sort((a, b) => {
      const diff =
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      return sort === "newest" ? -diff : diff;
    });
  }, [scraps, query, sort]);

  const totalPages = Math.ceil(processed.length / PAGE_SIZE);
  const pagedItems = processed.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

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
          {processed.length}개
        </span>
        <div className="flex items-center gap-2 sm:justify-end">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="검색"
              value={query}
              onChange={(e) => { setQuery(e.target.value); setCurrentPage(1); }}
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
                onValueChange={(v) => { setSort(v as SortOrder); setCurrentPage(1); }}
              >
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

      {processed.length === 0 ? (
        <p className="py-10 text-center text-sm text-muted-foreground">
          {query ? "검색 결과가 없습니다." : "스크랩한 글이 없습니다."}
        </p>
      ) : (
        <>
          <div className="divide-y divide-border">
            {pagedItems.map((scrap) => (
              <ScrappedPostListItem key={scrap.id} scrap={scrap} />
            ))}
          </div>
          <MyPagePagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            className="mt-8 mb-12"
          />
        </>
      )}
    </div>
  );
}
