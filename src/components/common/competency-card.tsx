import { cn } from "@/lib/utils";

export function MeterBar({ value, target, tone }: { value: number; target?: number; tone?: "primary" | "success" | "warning" | "danger" }) {
  const fill =
    tone === "success"
      ? "bg-success"
      : tone === "warning"
        ? "bg-warning"
        : tone === "danger"
          ? "bg-destructive"
          : "bg-primary";
  return (
    <div className="relative h-2 w-full overflow-hidden rounded-full bg-muted">
      <div className={cn("h-full rounded-full transition-all duration-500", fill)} style={{ width: `${Math.min(100, value)}%` }} />
      {target !== undefined ? (
        <span
          className="absolute top-1/2 h-3.5 w-0.5 -translate-y-1/2 rounded bg-foreground/60"
          style={{ left: `calc(${Math.min(100, target)}% - 1px)` }}
        />
      ) : null}
    </div>
  );
}

export function CompetencyCard({
  name,
  score,
  required,
}: {
  name: string;
  score: number;
  required?: number;
}) {
  const gap = required !== undefined ? required - score : 0;
  const tone = required === undefined ? "primary" : gap <= 0 ? "success" : gap <= 8 ? "warning" : "danger";
  return (
    <div className="surface-card grid-lift p-4">
      <div className="flex items-center justify-between gap-2">
        <p className="truncate text-sm font-medium text-foreground">{name}</p>
        <span className="shrink-0 text-sm font-semibold tabular-nums text-foreground">{score}%</span>
      </div>
      <div className="mt-3">
        <MeterBar value={score} target={required} tone={tone} />
      </div>
      <p className="mt-2 text-xs text-muted-foreground">
        {required === undefined
          ? "Current proficiency"
          : gap <= 0
            ? `Meets requirement (${required}%)`
            : `Gap of ${gap} pts vs required ${required}%`}
      </p>
    </div>
  );
}
