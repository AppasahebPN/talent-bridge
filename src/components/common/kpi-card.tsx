import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function KpiCard({
  label,
  value,
  delta,
  hint,
  icon,
  tone = "primary",
}: {
  label: string;
  value: string | number;
  delta?: string;
  hint?: string;
  icon: ReactNode;
  tone?: "primary" | "success" | "warning" | "info";
}) {
  const toneMap = {
    primary: "bg-primary-soft text-primary",
    success: "bg-success/10 text-success",
    warning: "bg-warning/15 text-warning",
    info: "bg-info/10 text-info",
  } as const;

  return (
    <div className="surface-card grid-lift p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
          <p className="mt-2 text-3xl font-semibold tabular-nums text-foreground">{value}</p>
        </div>
        <span className={cn("grid size-11 shrink-0 place-items-center rounded-xl", toneMap[tone])}>{icon}</span>
      </div>
      <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
        {delta ? <span className="rounded-md bg-success/10 px-1.5 py-0.5 font-medium text-success">{delta}</span> : null}
        {hint ? <span className="truncate">{hint}</span> : null}
      </div>
    </div>
  );
}
