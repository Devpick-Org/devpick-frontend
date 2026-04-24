"use client";

import { useState, useMemo } from "react";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { WrongQuizListItem } from "./WrongQuizListItem";
import type { MyPageQuizHistory } from "@/types/myPage";

type SortOrder = "newest" | "oldest";

export function WrongQuizList({ quizzes }: { quizzes: MyPageQuizHistory[] }) {
  const [sort, setSort] = useState<SortOrder>("newest");

  const sorted = useMemo(() => {
    return [...quizzes].sort((a, b) => {
      const diff =
        new Date(a.attemptedAt).getTime() - new Date(b.attemptedAt).getTime();
      return sort === "newest" ? -diff : diff;
    });
  }, [quizzes, sort]);

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <span className="text-sm text-muted-foreground">{sorted.length}개</span>
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger className="flex h-8 w-24 cursor-pointer items-center justify-between rounded-md border border-border bg-background px-3 text-sm text-foreground focus:outline-none">
            {sort === "newest" ? "최신순" : "오래된순"}
            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-[6rem] p-1">
            <DropdownMenuRadioGroup
              value={sort}
              onValueChange={(v) => setSort(v as SortOrder)}
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

      {sorted.length === 0 ? (
        <p className="py-10 text-center text-sm text-muted-foreground">
          틀린 퀴즈가 없습니다.
        </p>
      ) : (
        <div className="divide-y divide-border">
          {sorted.map((quiz) => (
            <WrongQuizListItem key={quiz.attemptId} quiz={quiz} />
          ))}
        </div>
      )}
    </div>
  );
}
