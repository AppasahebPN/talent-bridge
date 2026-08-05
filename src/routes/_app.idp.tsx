import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { BriefcaseBusiness, Download, GraduationCap, Repeat, Sparkles, Target, UserRoundCheck, Users } from "lucide-react";
import { PageHeader, SectionCard } from "@/components/common/page-header";
import { KpiCard } from "@/components/common/kpi-card";
import { StatusBadge, priorityTone, statusTone } from "@/components/common/badges";
import { Timeline } from "@/components/common/timeline";
import { MeterBar } from "@/components/common/competency-card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/hooks/use-auth";
import { buildIdp, employees, gapAnalysis, getMentor } from "@/data/mockData";
import type { IdpActivity } from "@/types";

export const Route = createFileRoute("/_app/idp")({
  head: () => ({
    meta: [
      { title: "AI Development Plan | POWERGRID Succession Planning" },
      { name: "description", content: "AI-generated individual development plan with trainings, rotations, projects, mentoring and expected readiness uplift." },
      { property: "og:title", content: "AI Development Plan | POWERGRID Succession Planning" },
      { property: "og:description", content: "Personalised leadership development roadmap on a quarterly timeline." },
    ],
  }),
  component: IdpPage,
});

const TYPE_ICON: Record<IdpActivity["type"], typeof Target> = {
  Training: GraduationCap,
  Rotation: Repeat,
  Project: BriefcaseBusiness,
  Mentoring: Users,
  Coaching: UserRoundCheck,
};

function IdpPage() {
  const { session } = useAuth();
  const isEmployee = session?.role === "employee";
  const [empId, setEmpId] = useState(session?.employeeId ?? employees[0].id);

  const emp = employees.find((e) => e.id === empId) ?? employees[0];
  const analysis = gapAnalysis(emp.id, emp.targetRoleId);
  const plan = buildIdp(emp.id);
  const mentor = getMentor(emp.mentorId);
  const expected = Math.min(98, analysis.readinessScore + plan.reduce((s, a) => s + a.impact, 0) / 2);

  const grouped = {
    Training: plan.filter((p) => p.type === "Training"),
    Rotation: plan.filter((p) => p.type === "Rotation"),
    Project: plan.filter((p) => p.type === "Project"),
    Mentoring: plan.filter((p) => p.type === "Mentoring"),
    Coaching: plan.filter((p) => p.type === "Coaching"),
  };

  return (
    <>
      <PageHeader
        title="AI Individual Development Plan"
        description={`Auto-generated roadmap to make ${emp.name} ready for ${analysis.profile.title}.`}
        crumbs={[{ label: "AI Development Plan" }]}
        actions={
          <div className="no-print flex items-center gap-2">
            <Button variant="outline" onClick={() => window.print()}>
              <Download className="mr-2 size-4" /> Export PDF
            </Button>
            <Button asChild>
              <Link to="/progress">Track progress</Link>
            </Button>
          </div>
        }
      />

      {!isEmployee ? (
        <div className="surface-card mb-6 grid gap-4 p-5 md:grid-cols-[minmax(0,320px)_minmax(0,1fr)] md:items-end">
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Select employee</label>
            <Select value={empId} onValueChange={setEmpId}>
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
          <p className="text-sm text-muted-foreground">
            Plan regenerates from the live gap analysis against <span className="font-medium text-foreground">{analysis.profile.title}</span>.
          </p>
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Current Readiness" value={`${analysis.readinessScore}%`} icon={<Target className="size-5" />} hint={analysis.profile.title} />
        <KpiCard label="Expected Readiness" value={`${Math.round(expected)}%`} delta={`+${Math.round(expected - analysis.readinessScore)}`} icon={<Sparkles className="size-5" />} tone="success" hint="On plan completion" />
        <KpiCard label="Planned Activities" value={plan.length} icon={<GraduationCap className="size-5" />} tone="info" hint="Across 6 quarters" />
        <KpiCard label="Critical Priorities" value={plan.filter((p) => p.priority === "Critical").length} icon={<BriefcaseBusiness className="size-5" />} tone="warning" hint="Must-close gaps" />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <SectionCard title="Development roadmap" description="Sequenced, quarter-by-quarter execution plan">
          <Timeline
            items={plan.map((a) => {
              const Icon = TYPE_ICON[a.type];
              return {
                id: a.id,
                meta: `${a.quarter} · ${a.type}`,
                title: a.title,
                description: a.detail,
                tone: a.status === "Completed" ? "done" : a.status === "In Progress" ? "active" : "pending",
                right: (
                  <div className="flex flex-col items-end gap-1.5">
                    <StatusBadge label={a.priority} tone={priorityTone(a.priority)} />
                    <StatusBadge label={a.status} tone={statusTone(a.status)} />
                    <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                      <Icon className="size-3.5" /> +{a.impact} pts
                    </span>
                  </div>
                ),
              };
            })}
          />
        </SectionCard>

        <div className="space-y-4">
          <SectionCard title="Expected readiness uplift" description="Cumulative impact of planned interventions">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Today</span>
                <span className="font-semibold tabular-nums">{analysis.readinessScore}%</span>
              </div>
              <MeterBar value={analysis.readinessScore} />
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">After plan (Q2 2027)</span>
                <span className="font-semibold tabular-nums text-success">{Math.round(expected)}%</span>
              </div>
              <MeterBar value={expected} tone="success" />
              <p className="rounded-lg bg-primary-soft p-3 text-xs text-primary">
                Projected promotion readiness date: <span className="font-semibold">September 2027</span>
              </p>
            </div>
          </SectionCard>

          <SectionCard title="Recommended mentor" description="Best match on gap profile and domain">
            {mentor ? (
              <>
                <p className="font-medium">{mentor.name}</p>
                <p className="text-sm text-muted-foreground">{mentor.role} · {mentor.region}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {mentor.expertise.map((x) => (
                    <StatusBadge key={x} label={x} tone="info" />
                  ))}
                </div>
              </>
            ) : null}
          </SectionCard>

          <SectionCard title="Leadership coaching" description="Executive coaching engagement">
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>8 one-to-one sessions with an ICF-certified coach</li>
              <li>360° feedback re-run at month 9</li>
              <li>Focus: {analysis.weaknesses[0]?.name ?? "executive presence"}, stakeholder influence</li>
            </ul>
          </SectionCard>
        </div>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {(Object.keys(grouped) as (keyof typeof grouped)[]).map((key) => {
          const items = grouped[key];
          if (items.length === 0) return null;
          const Icon = TYPE_ICON[key];
          return (
            <SectionCard key={key} title={`Recommended ${key}`}>
              <ul className="space-y-3">
                {items.map((a) => (
                  <li key={a.id} className="grid grid-cols-[auto_minmax(0,1fr)] gap-3 rounded-lg border border-border p-3">
                    <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary-soft text-primary">
                      <Icon className="size-4" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-medium">{a.title}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{a.detail}</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <StatusBadge label={a.quarter} tone="neutral" />
                        <StatusBadge label={a.priority} tone={priorityTone(a.priority)} />
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </SectionCard>
          );
        })}
      </div>
    </>
  );
}
