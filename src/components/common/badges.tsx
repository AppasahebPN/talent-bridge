import { cn } from "@/lib/utils";
import type { Role } from "@/types";
import { ROLE_LABEL } from "@/hooks/use-auth";

export function RoleBadge({ role, className }: { role: Role; className?: string }) {
  const map: Record<Role, string> = {
    employee: "bg-info/10 text-info border-info/20",
    hr: "bg-primary-soft text-primary border-primary/20",
    committee: "bg-warning/15 text-warning border-warning/30",
  };
  return (
    <span className={cn("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium", map[role], className)}>
      {ROLE_LABEL[role]}
    </span>
  );
}

type StatusTone = "success" | "info" | "warning" | "danger" | "neutral";

const toneClass: Record<StatusTone, string> = {
  success: "bg-success/10 text-success border-success/20",
  info: "bg-info/10 text-info border-info/20",
  warning: "bg-warning/15 text-warning border-warning/30",
  danger: "bg-destructive/10 text-destructive border-destructive/20",
  neutral: "bg-muted text-muted-foreground border-border",
};

export function StatusBadge({ label, tone = "neutral", className }: { label: string; tone?: StatusTone; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium", toneClass[tone], className)}>
      {label}
    </span>
  );
}

export function readinessTone(readiness: string): StatusTone {
  if (readiness === "Ready Now") return "success";
  if (readiness === "Ready 1-2 Yrs") return "info";
  if (readiness === "Ready 3-5 Yrs") return "warning";
  return "danger";
}

export function statusTone(status: string): StatusTone {
  if (status === "Completed") return "success";
  if (status === "In Progress") return "info";
  return "neutral";
}

export function priorityTone(priority: string): StatusTone {
  if (priority === "Critical") return "danger";
  if (priority === "High") return "warning";
  return "neutral";
}
