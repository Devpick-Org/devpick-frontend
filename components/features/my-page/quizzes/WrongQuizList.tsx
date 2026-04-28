"use client";

import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { WrongQuizListItem } from "./WrongQuizListItem";
import { MyPagePagination } from "../MyPagePagination";
import type { MyPageQuizHistory } from "@/types/myPage";

type SortOrder = "newest" | "oldest";

interface WrongQuizListProps {
  quizzes: MyPageQuizHistory[];
  totalElements: number;
  totalPages: number;
  sort: SortOrder;
  page: number;
  onSortChange: (value: SortOrder) => void;
  onPageChange: (page: number) => void;
}

export function WrongQuizList({
  quizzes,
  totalElements,
  totalPages,
  sort,
  page,
  onSortChange,
  onPageChange,
}: WrongQuizListProps) {
  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <span className="text-sm text-muted-foreground">{totalElements}개</span>
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger className="flex h-8 w-24 cursor-pointer items-center justify-between rounded-md border border-border bg-background px-3 text-sm text-foreground focus:outline-none">
            {sort === "newest" ? "최신순" : "오래된순"}
            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-[6rem] p-1">
            <DropdownMenuRadioGroup
              value={sort}
              onValueChange={(v) => onSortChange(v as SortOrder)}
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

      {quizzes.length === 0 ? (
        <p className="py-10 text-center text-sm text-muted-foreground">
          퀴즈 기록이 없습니다.
        </p>
      ) : (
        <>
          <div className="divide-y divide-border">
            {quizzes.map((quiz) => (
              <WrongQuizListItem key={quiz.attemptId} quiz={quiz} />
            ))}
          </div>
          {totalPages > 1 && (
            <MyPagePagination
              currentPage={page + 1}
              totalPages={totalPages}
              onPageChange={onPageChange}
              className="mt-8 mb-12"
            />
          )}
        </>
      )}
    </div>
  );
}
