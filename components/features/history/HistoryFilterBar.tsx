"use client";

import { ChevronDown } from "lucide-react";

import type { PeriodFilter } from "@/lib/history/groupByDate";
import { PERIOD_OPTIONS } from "./history.constants";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface ActionOption<T extends string> {
  value: T;
  label: string;
}

interface Props<T extends string> {
  actionOptions: ActionOption<T>[];
  selectedActions: T[];
  onActionsChange: (actions: T[]) => void;
  period: PeriodFilter;
  onPeriodChange: (period: PeriodFilter) => void;
}

function HistoryFilterBar<T extends string>({
  actionOptions,
  selectedActions,
  onActionsChange,
  period,
  onPeriodChange,
}: Props<T>) {
  function toggleAction(value: T) {
    if (selectedActions.includes(value)) {
      onActionsChange(selectedActions.filter((a) => a !== value));
    } else {
      onActionsChange([...selectedActions, value]);
    }
  }

  const isAll = selectedActions.length === 0;
  const currentPeriodLabel =
    PERIOD_OPTIONS.find((o) => o.value === period)?.label ?? period;

  return (
    <div className="space-y-2 pb-4">
      <div className="flex items-start gap-2">
        {/* 액션 chips */}
        <div className="flex flex-1 flex-wrap gap-1.5">
          <button
            onClick={() => onActionsChange([] as T[])}
            className={cn(
              "px-3.5 py-1 rounded-full text-sm font-medium transition-colors cursor-pointer",
              isAll
                ? "bg-primary/10 text-primary"
                : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground",
            )}
          >
            전체
          </button>
          {actionOptions.map((opt) => {
            const isActive = selectedActions.includes(opt.value);
            return (
              <button
                key={opt.value}
                onClick={() => toggleAction(opt.value)}
                className={cn(
                  "px-2.5 py-1 rounded-full text-sm font-medium transition-colors cursor-pointer",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground",
                )}
              >
                {opt.label}
              </button>
            );
          })}
        </div>

        {/* 기간 dropdown */}
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="flex shrink-0 items-center gap-1 pt-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground cursor-pointer"
            >
              {currentPeriodLabel}
              <ChevronDown className="h-3.5 w-3.5" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-[120px] p-1">
            <DropdownMenuRadioGroup
              value={period}
              onValueChange={(v) => onPeriodChange(v as PeriodFilter)}
            >
              {PERIOD_OPTIONS.map((opt) => (
                <DropdownMenuRadioItem
                  key={opt.value}
                  value={opt.value}
                  className="cursor-pointer"
                >
                  {opt.label}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

export default HistoryFilterBar;
