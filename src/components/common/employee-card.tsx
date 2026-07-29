import { Link } from "@tanstack/react-router";
import { Building2, MapPin } from "lucide-react";
import type { Employee } from "@/types";
import { StatusBadge, readinessTone } from "@/components/common/badges";
import { MeterBar } from "@/components/common/competency-card";

export function EmployeeCard({ employee }: { employee: Employee }) {
  const avg = Math.round(employee.competencies.reduce((s, c) => s + c.score, 0) / employee.competencies.length);
  return (
    <Link to="/employees/$id" params={{ id: employee.id }} className="surface-card grid-lift block p-5">
      <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3">
        <img src={employee.photo} alt={employee.name} className="size-12 shrink-0 rounded-full object-cover ring-2 ring-primary-soft" />
        <div className="min-w-0">
          <p className="truncate font-semibold text-foreground">{employee.name}</p>
          <p className="truncate text-sm text-muted-foreground">{employee.currentRole}</p>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1">
          <Building2 className="size-3.5" /> {employee.department}
        </span>
        <span className="inline-flex items-center gap-1">
          <MapPin className="size-3.5" /> {employee.region}
        </span>
      </div>
      <div className="mt-4 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Avg. competency</span>
          <span className="font-semibold tabular-nums">{avg}%</span>
        </div>
        <MeterBar value={avg} />
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <StatusBadge label={employee.readiness} tone={readinessTone(employee.readiness)} />
        <StatusBadge label={employee.grade} tone="info" />
        {employee.highPotential ? <StatusBadge label="HiPo" tone="warning" /> : null}
      </div>
    </Link>
  );
}
