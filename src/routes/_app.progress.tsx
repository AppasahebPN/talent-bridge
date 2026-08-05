import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Award, CalendarCheck, CheckCircle2, Clock, Medal, Trophy } from "lucide-react";
import { PageHeader, SectionCard } from "@/components/common/page-header";
import { KpiCard } from "@/components/common/kpi-card";
import { StatusBadge, statusTone } from "@/components/common/badges";
import { MeterBar } from "@/components/common/competency-card";
import { Timeline } from "@/components/common/timeline";
import { LineChartCard } from "@/components/charts/charts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/hooks/use-auth";
import { buildIdp, employees, gapAnalysis } from "@/data/mockData";

export const Route = createFileRoute("/_app/progress")({
  head: () => ({
    meta: [
      { title: "Progress Tracking | POWERGRID Succession Planning" },
      { name: "description", content: "Track development plan milestones, completed activities, achievement badges and expected promotion readiness date." },
      { property: "og:title", content: "Progress Tracking | POWERGRID Succession Planning" },
      { property: "og:description", content: "Milestones, badges and readiness trajectory for individual development plans." },
    ],
  }),
  component: ProgressPage,
});

const BADGES = [
  { icon: Medal, label: "Leadership Sprint", earned: true },
  { icon: Trophy, label: "Mega Project Delivery", earned: true },
  { icon: Award, label: "Certified Mentor", earned: false },
  { icon: CalendarCheck, label: "100% Attendance", earned: true },
];

function ProgressPage() {
  const { session } = useAuth();
  const isEmployee = session?.role === "employee";
  const [empId, setEmpId] = useState(session?.employeeId ?? employees[0].id);
  const emp = employees.find((e) => e.id === empId) ?? employees[0];
  const plan = buildIdp(emp.id);
  const analysis = gapAnalysis(emp.id, emp.targetRoleId);
  const completed = plan.filter((p) => p.status === "Completed");
  const pending = plan.filter((p) => p.status !== "Completed");

  const trend = ["Jan", "Mar", "May", "Jul", "Sep", "Nov"].map((m, i) => ({
    name: m,
    Readiness: Math.min(98, analysis.readinessScore - 12 + i * 3),
    Target: 90,
  }));

  return (
    <>
      <PageHeader
        title="Progress Tracking"
        description={`Development execution status for ${emp.name}`}
        crumbs={[{ label: "Progress Tracking" }]}
      />

      {!isEmployee ? (
        <div className="surface-card mb-6 max-w-sm p-4">
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Employee</label>
          <Select value={empId} onValueChange={setEmpId}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {employees.map((e) => (
                <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Overall Progress" value={`${emp.idpProgress}%`} icon={<CheckCircle2 className="size-5" />} tone="success" />
        <KpiCard label="Completed Activities" value={completed.length} icon={<Award className="size-5" />} hint={`of ${plan.length} planned`} />
        <KpiCard label="Pending Activities" value={pending.length} icon={<Clock className="size-5" />} tone="warning" />
        <KpiCard label="Promotion Readiness" value="Sep 2027" icon={<CalendarCheck className="size-5" />} tone="info" hint="Projected date" />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        <SectionCard title="Milestone timeline" description="Activity-level execution status">
          <Timeline
            items={plan.map((a) => ({
              id: a.id,
              meta: a.quarter,
              title: a.title,
              description: a.detail,
              tone: a.status === "Completed" ? "done" : a.status === "In Progress" ? "active" : "pending",
              right: <StatusBadge label={a.status} tone={statusTone(a.status)} />,
            }))}
          />
        </SectionCard>

        <div className="space-y-4">
          <SectionCard title="Overall progress" description="Weighted completion of the development plan">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Plan completion</span>
                <span className="font-semibold tabular-nums">{emp.idpProgress}%</span>
              </div>
              <MeterBar value={emp.idpProgress} tone="success" />
            </div>
          </SectionCard>

          <SectionCard title="Readiness trajectory" description="Rolling readiness score vs target">
            <LineChartCard
              data={trend}
              xKey="name"
              lines={[
                { key: "Readiness", name: "Readiness", color: "var(--chart-1)" },
                { key: "Target", name: "Target", color: "var(--chart-4)" },
              ]}
              height={220}
            />
          </SectionCard>

          <SectionCard title="Achievement badges" description="Recognition earned during development">
            <div className="grid grid-cols-2 gap-3">
              {BADGES.map((b) => (
                <div
                  key={b.label}
                  className={
                    "flex items-center gap-2.5 rounded-lg border p-3 " +
                    (b.earned ? "border-success/30 bg-success/5" : "border-dashed border-border opacity-60")
                  }
                >
                  <b.icon className={"size-5 shrink-0 " + (b.earned ? "text-success" : "text-muted-foreground")} />
                  <span className="min-w-0 truncate text-xs font-medium">{b.label}</span>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>
      </div>
    </>
  );
}
