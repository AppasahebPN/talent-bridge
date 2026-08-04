import React from "react";
import type { CompetencyGapItem } from "@/types";
import { cn } from "@/lib/utils";

interface CompetencyGapBadgesProps {
  gaps: CompetencyGapItem[] | string[];
  className?: string;
}

export function CompetencyGapBadges({ gaps, className }: CompetencyGapBadgesProps) {
  if (!gaps || gaps.length === 0) {
    return (
      <span className="inline-flex items-center rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
        No Critical Gaps Identified
      </span>
    );
  }

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {gaps.map((item, index) => {
        if (typeof item === "string") {
          return (
            <span
              key={index}
              className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/15 px-3 py-1 text-xs font-medium text-amber-700 dark:text-amber-300"
            >
              <span className="size-1.5 rounded-full bg-amber-500" />
              {item}
            </span>
          );
        }

        const name = item.competency;
        const status = item.status || "Gap Identified";
        const isNeedsImprovement =
          status.toLowerCase().includes("needs") ||
          status.toLowerCase().includes("critical") ||
          status.toLowerCase().includes("high");

        return (
          <span
            key={index}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors",
              isNeedsImprovement
                ? "border-destructive/30 bg-destructive/10 text-destructive dark:bg-destructive/20"
                : "border-warning/30 bg-warning/15 text-warning"
            )}
          >
            <span
              className={cn(
                "size-1.5 rounded-full",
                isNeedsImprovement ? "bg-destructive" : "bg-warning"
              )}
            />
            <span className="font-semibold">{name}</span>
            <span className="opacity-80">({status})</span>
            {item.employeeScore !== undefined && item.requiredScore !== undefined && (
              <span className="ml-1 text-[10px] font-bold opacity-75">
                [{item.employeeScore}/{item.requiredScore}]
              </span>
            )}
          </span>
        );
      })}
    </div>
  );
}
