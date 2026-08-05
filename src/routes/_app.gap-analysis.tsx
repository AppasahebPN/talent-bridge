import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AlertTriangle, ArrowRight, CheckCircle2, Sparkles, TrendingUp } from "lucide-react";
import { PageHeader, SectionCard } from "@/components/common/page-header";
import { KpiCard } from "@/components/common/kpi-card";
import { StatusBadge } from "@/components/common/badges";
import { MeterBar } from "@/components/common/competency-card";
import { BarChartCard, RadarChartCard } from "@/components/charts/charts";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/hooks/use-auth";
import { employees, gapAnalysis, successProfiles } from "@/data/mockData";

export const Route = createFileRoute("/_app/gap-analysis")({
  head: () => ({
    meta: [
      { title: "AI Gap Analysis | POWERGRID Succession Planning" },
      { name: "description", content: "Compare an executive profile against a target success profile with readiness score, radar comparison and prioritised competency gaps." },
      { property: "og:title", content: "AI Gap Analysis | POWERGRID Succession Planning" },
      { property: "og:description", content: "Readiness score, radar comparison and prioritised competency gaps." },
    ],
  }),
  component: GapAnalysisPage,
});

function GapAnalysisPage() {
  const { session } = useAuth();
  const isEmployee = session?.role === "employee";
  const defaultEmp = session?.employeeId ?? employees[0].id;
  const [empId, setEmpId] = useState(defaultEmp);
  const [profileId, setProfileId] = useState(employees.find((e) => e.id === defaultEmp)?.targetRoleId ?? successProfiles[0].id);

  const { emp, profile, rows, readinessScore, strengths, weaknesses } = gapAnalysis(empId, profileId);
  const radarData = rows.map((r) => ({ subject: r.name, Candidate: r.current, Required: r.required }));
  const priorityGaps = weaknesses.slice(0, 3);

  return (
    <>
      <PageHeader
        title="AI Gap Analysis"
        description="Machine-scored comparison of candidate competencies against validated success profiles."
        crumbs={[{ label: "AI Gap Analysis" }]}
        actions={
          <Button asChild>
            <Link to="/idp">
              <Sparkles className="mr-2 size-4" /> Generate development plan
            </Link>
          </Button>
        }
      />

      <div className="surface-card mb-6 grid gap-4 p-5 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:items-end">
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Employee profile</label>
          <Select value={empId} onValueChange={setEmpId} disabled={isEmployee}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {employees.map((e) => (
                <SelectItem key={e.id} value={e.id}>
                  {e.name} — {e.grade}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <span className="hidden place-items-center pb-2.5 text-muted-foreground lg:grid">
          <ArrowRight className="size-5" />
        </span>
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Target success profile</label>
          <Select value={profileId} onValueChange={setProfileId}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {successProfiles.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.title} — {p.grade}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Overall Readiness" value={`${readinessScore}%`} icon={<TrendingUp className="size-5" />} tone="success" hint={profile.title} />
        <KpiCard label="Competencies Met" value={`${strengths.length}/${rows.length}`} icon={<CheckCircle2 className="size-5" />} hint="At or above requirement" />
        <KpiCard label="Gaps Identified" value={weaknesses.length} icon={<AlertTriangle className="size-5" />} tone="warning" hint="Below requirement" />
        <KpiCard
          label="Largest Gap"
          value={weaknesses[0] ? `${weaknesses[0].gap} pts` : "—"}
          icon={<AlertTriangle className="size-5" />}
          tone="info"
          hint={weaknesses[0]?.name ?? "No gaps"}
        />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-2">
        <SectionCard title="Competency radar" description={`${emp.name} vs ${profile.title}`}>
          <RadarChartCard
            data={radarData}
            series={[
              { key: "Required", name: "Required", color: "var(--chart-4)" },
              { key: "Candidate", name: emp.name.split(" ")[0], color: "var(--chart-1)" },
            ]}
            height={340}
          />
        </SectionCard>

        <SectionCard title="Competency comparison" description="Current proficiency vs required bar">
          <BarChartCard
            data={rows.map((r) => ({ name: r.name.split(" ")[0], Current: r.current, Required: r.required }))}
            xKey="name"
            bars={[
              { key: "Current", name: "Current", color: "var(--chart-1)" },
              { key: "Required", name: "Required", color: "var(--chart-4)" },
            ]}
            height={340}
          />
        </SectionCard>
      </div>

      <SectionCard className="mt-4" title="Gap table" description="Quantified delta per competency with priority classification">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="pb-2 font-semibold">Competency</th>
                <th className="pb-2 font-semibold">Current</th>
                <th className="pb-2 font-semibold">Required</th>
                <th className="pb-2 font-semibold">Gap</th>
                <th className="pb-2 font-semibold">Coverage</th>
                <th className="pb-2 font-semibold">Priority</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rows.map((r) => (
                <tr key={r.name} className="transition-colors hover:bg-muted/50">
                  <td className="py-2.5 font-medium">{r.name}</td>
                  <td className="py-2.5 tabular-nums">{r.current}%</td>
                  <td className="py-2.5 tabular-nums text-muted-foreground">{r.required}%</td>
                  <td className="py-2.5 font-semibold tabular-nums">{r.gap > 0 ? `-${r.gap}` : "0"}</td>
                  <td className="w-44 py-2.5">
                    <MeterBar
                      value={Math.min(100, Math.round((r.current / r.required) * 100))}
                      tone={r.gap === 0 ? "success" : r.gap <= 8 ? "warning" : "danger"}
                    />
                  </td>
                  <td className="py-2.5">
                    <StatusBadge
                      label={r.gap === 0 ? "Met" : r.gap > 12 ? "Critical" : r.gap > 6 ? "High" : "Medium"}
                      tone={r.gap === 0 ? "success" : r.gap > 12 ? "danger" : r.gap > 6 ? "warning" : "info"}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        <SectionCard title="Strengths" description="Competencies at or above the required bar">
          <ul className="space-y-2">
            {strengths.length === 0 ? <li className="text-sm text-muted-foreground">No competencies currently meet the bar.</li> : null}
            {strengths.map((s) => (
              <li key={s.name} className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2.5 rounded-lg border border-border p-3">
                <CheckCircle2 className="size-4 shrink-0 text-success" />
                <span className="truncate text-sm">{s.name}</span>
                <span className="shrink-0 text-xs font-semibold tabular-nums text-success">+{s.current - s.required}</span>
              </li>
            ))}
          </ul>
        </SectionCard>

        <SectionCard title="Weaknesses" description="Competencies below the required bar">
          <ul className="space-y-2">
            {weaknesses.map((w) => (
              <li key={w.name} className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2.5 rounded-lg border border-border p-3">
                <AlertTriangle className="size-4 shrink-0 text-warning" />
                <span className="truncate text-sm">{w.name}</span>
                <span className="shrink-0 text-xs font-semibold tabular-nums text-destructive">-{w.gap}</span>
              </li>
            ))}
          </ul>
        </SectionCard>

        <SectionCard title="Recommended development areas" description="AI-prioritised focus for the next 18 months">
          <ol className="space-y-3">
            {priorityGaps.map((g, i) => (
              <li key={g.name} className="rounded-lg border border-border p-3">
                <div className="flex items-center gap-2">
                  <span className="grid size-6 shrink-0 place-items-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                    {i + 1}
                  </span>
                  <p className="truncate text-sm font-medium">{g.name}</p>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  Close a {g.gap}-point gap through targeted training, a stretch assignment and structured mentoring.
                </p>
              </li>
            ))}
            {priorityGaps.length === 0 ? (
              <li className="rounded-lg bg-success/10 p-3 text-sm text-success">
                Candidate fully meets this success profile — recommend slate nomination.
              </li>
            ) : null}
          </ol>
        </SectionCard>
      </div>
    </>
  );
}
