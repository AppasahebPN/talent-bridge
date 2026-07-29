import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Award,
  BookOpenCheck,
  Briefcase,
  CalendarClock,
  ClipboardList,
  Rocket,
  Sparkles,
  Star,
  TrendingUp,
  UserCheck,
  Users,
} from "lucide-react";
import { PageHeader, SectionCard } from "@/components/common/page-header";
import { KpiCard } from "@/components/common/kpi-card";
import { BarChartCard, CHART_COLORS, LineChartCard, RadarChartCard } from "@/components/charts/charts";
import { StatusBadge, readinessTone, statusTone } from "@/components/common/badges";
import { MeterBar } from "@/components/common/competency-card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import {
  COMPETENCIES,
  DEPARTMENTS,
  buildIdp,
  employees,
  gapAnalysis,
  getEmployee,
  getMentor,
  getProfile,
  getTraining,
  successProfiles,
  trainings,
} from "@/data/mockData";

export const Route = createFileRoute("/_app/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard | POWERGRID Succession Planning" },
      { name: "description", content: "Role-based succession planning dashboard with readiness KPIs, competency gaps and talent distribution." },
      { property: "og:title", content: "Dashboard | POWERGRID Succession Planning" },
      { property: "og:description", content: "Readiness KPIs, competency gaps and department-wise talent distribution." },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const { session } = useAuth();
  if (session?.role === "employee") return <EmployeeDashboard employeeId={session.employeeId} />;
  return <OrgDashboard committee={session?.role === "committee"} />;
}

function OrgDashboard({ committee }: { committee: boolean }) {
  const readyNow = employees.filter((e) => e.readiness === "Ready Now");
  const hiPo = employees.filter((e) => e.highPotential);
  const activeIdps = employees.filter((e) => e.idpProgress < 100);

  const readinessData = ["Ready Now", "Ready 1-2 Yrs", "Ready 3-5 Yrs", "Development Needed"].map((r) => ({
    name: r,
    count: employees.filter((e) => e.readiness === r).length,
  }));

  const competencyGap = COMPETENCIES.map((name) => {
    const avg = Math.round(employees.reduce((s, e) => s + (e.competencies.find((c) => c.name === name)?.score ?? 0), 0) / employees.length);
    const req = Math.round(successProfiles.reduce((s, p) => s + (p.competencies.find((c) => c.name === name)?.score ?? 0), 0) / successProfiles.length);
    return { subject: name, Current: avg, Required: req };
  });

  const deptData = DEPARTMENTS.map((d) => ({
    name: d.length > 14 ? d.slice(0, 13) + "…" : d,
    employees: employees.filter((e) => e.department === d).length,
    hipo: employees.filter((e) => e.department === d && e.highPotential).length,
  }));

  const progressTrend = ["Q1", "Q2", "Q3", "Q4"].map((q, i) => ({
    name: q,
    Planned: 25 * (i + 1),
    Achieved: Math.min(100, 18 + i * 22),
  }));

  return (
    <>
      <PageHeader
        title={committee ? "Succession Committee Dashboard" : "HR Talent Dashboard"}
        description="Enterprise-wide leadership readiness, bench strength and development plan health."
        crumbs={[{ label: "Dashboard" }]}
        actions={
          <>
            <Button variant="outline" asChild>
              <Link to="/nine-box">Open 9-Box Matrix</Link>
            </Button>
            <Button asChild>
              <Link to="/gap-analysis">
                <Sparkles className="mr-2 size-4" /> Run AI Gap Analysis
              </Link>
            </Button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        <KpiCard label="Total Employees" value={employees.length} icon={<Users className="size-5" />} hint="In succession pool" />
        <KpiCard label="Successors Identified" value={readyNow.length + 9} delta="+4 QoQ" icon={<UserCheck className="size-5" />} tone="success" />
        <KpiCard label="High Potential" value={hiPo.length} icon={<Star className="size-5" />} tone="warning" hint="9-box top quadrants" />
        <KpiCard label="Leadership Positions" value={successProfiles.length} icon={<Briefcase className="size-5" />} tone="info" hint="Critical roles mapped" />
        <KpiCard label="Active IDPs" value={activeIdps.length} icon={<ClipboardList className="size-5" />} hint="In execution" />
        <KpiCard label="Ready for Promotion" value={readyNow.length} delta="+2" icon={<Rocket className="size-5" />} tone="success" />
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-2">
        <SectionCard title="Leadership Readiness Distribution" description="Successor pool by readiness horizon">
          <BarChartCard
            data={readinessData}
            xKey="name"
            bars={[{ key: "count", name: "Employees", color: "var(--chart-1)" }]}
            colorful={["var(--chart-3)", "var(--chart-2)", "var(--chart-4)", "var(--destructive)"]}
          />
        </SectionCard>

        <SectionCard title="Competency Gap Overview" description="Organisation average vs. success profile requirement">
          <RadarChartCard
            data={competencyGap}
            series={[
              { key: "Required", name: "Required", color: "var(--chart-4)" },
              { key: "Current", name: "Current avg.", color: "var(--chart-1)" },
            ]}
          />
        </SectionCard>

        <SectionCard title="Department-wise Talent Distribution" description="Headcount and high-potential density">
          <BarChartCard
            data={deptData}
            xKey="name"
            bars={[
              { key: "employees", name: "Employees", color: "var(--chart-1)" },
              { key: "hipo", name: "High potential", color: "var(--chart-3)" },
            ]}
          />
        </SectionCard>

        <SectionCard title="Progress of Development Plans" description="Planned vs achieved IDP milestone completion">
          <LineChartCard
            data={progressTrend}
            xKey="name"
            lines={[
              { key: "Planned", name: "Planned %", color: "var(--chart-2)" },
              { key: "Achieved", name: "Achieved %", color: "var(--chart-1)" },
            ]}
          />
        </SectionCard>
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-3">
        <SectionCard
          title="Top successor slate"
          description="Highest readiness against target success profiles"
          className="xl:col-span-2"
          actions={
            <Button variant="ghost" size="sm" asChild>
              <Link to="/employees">View all</Link>
            </Button>
          }
        >
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="pb-2 font-semibold">Candidate</th>
                  <th className="pb-2 font-semibold">Target role</th>
                  <th className="pb-2 font-semibold">Readiness</th>
                  <th className="pb-2 font-semibold">Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {employees
                  .map((e) => ({ e, score: gapAnalysis(e.id, e.targetRoleId).readinessScore }))
                  .sort((a, b) => b.score - a.score)
                  .slice(0, 6)
                  .map(({ e, score }) => (
                    <tr key={e.id} className="transition-colors hover:bg-muted/60">
                      <td className="py-2.5">
                        <Link to="/employees/$id" params={{ id: e.id }} className="flex items-center gap-2.5">
                          <img src={e.photo} alt="" className="size-8 rounded-full object-cover" />
                          <span className="min-w-0">
                            <span className="block truncate font-medium">{e.name}</span>
                            <span className="block truncate text-xs text-muted-foreground">{e.grade} · {e.region}</span>
                          </span>
                        </Link>
                      </td>
                      <td className="py-2.5 text-muted-foreground">{getProfile(e.targetRoleId)?.title}</td>
                      <td className="py-2.5">
                        <StatusBadge label={e.readiness} tone={readinessTone(e.readiness)} />
                      </td>
                      <td className="w-40 py-2.5">
                        <div className="flex items-center gap-2">
                          <MeterBar value={score} />
                          <span className="w-9 shrink-0 text-right text-xs font-semibold tabular-nums">{score}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </SectionCard>

        <SectionCard title="Critical vacancies watchlist" description="Positions with succession risk">
          <ul className="space-y-3">
            {successProfiles.slice(0, 5).map((p) => (
              <li key={p.id} className="rounded-lg border border-border p-3 transition-colors hover:bg-muted/50">
                <Link to="/success-profiles/$id" params={{ id: p.id }} className="block">
                  <p className="truncate text-sm font-medium">{p.title}</p>
                  <p className="mt-0.5 truncate text-xs text-muted-foreground">{p.grade} · {p.openings} opening(s)</p>
                  <div className="mt-2">
                    <StatusBadge
                      label={p.openings > 2 ? "High risk" : p.openings > 1 ? "Medium risk" : "Covered"}
                      tone={p.openings > 2 ? "danger" : p.openings > 1 ? "warning" : "success"}
                    />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </SectionCard>
      </div>
    </>
  );
}

function EmployeeDashboard({ employeeId }: { employeeId: string }) {
  const emp = getEmployee(employeeId)!;
  const analysis = gapAnalysis(emp.id, emp.targetRoleId);
  const idp = buildIdp(emp.id);
  const mentor = getMentor(emp.mentorId);
  const completed = idp.filter((a) => a.status === "Completed").length;

  const growth = emp.performance.map((p, i) => ({
    name: p.year,
    Competency: Math.max(40, analysis.readinessScore - (emp.performance.length - 1 - i) * 6),
    Performance: Math.round((p.rating / 5) * 100),
  }));

  return (
    <>
      <PageHeader
        title={`Welcome back, ${emp.name.split(" ")[0]}`}
        description={`${emp.currentRole} · ${emp.department} · ${emp.region}`}
        crumbs={[{ label: "My Dashboard" }]}
        actions={
          <>
            <Button variant="outline" asChild>
              <Link to="/employees/$id" params={{ id: emp.id }}>
                View my profile
              </Link>
            </Button>
            <Button asChild>
              <Link to="/idp">
                <Sparkles className="mr-2 size-4" /> My AI development plan
              </Link>
            </Button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Readiness Score" value={`${analysis.readinessScore}%`} icon={<TrendingUp className="size-5" />} tone="success" hint={`For ${analysis.profile.title}`} />
        <KpiCard label="IDP Progress" value={`${emp.idpProgress}%`} icon={<ClipboardList className="size-5" />} hint={`${completed} of ${idp.length} activities done`} />
        <KpiCard label="Assessment Centre" value={emp.assessmentScore} icon={<Award className="size-5" />} tone="info" hint="Out of 100" />
        <KpiCard label="Priority Gaps" value={analysis.weaknesses.length} icon={<Star className="size-5" />} tone="warning" hint="Competencies below target" />
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-3">
        <SectionCard title="My competency growth" description="Competency index vs performance rating" className="xl:col-span-2">
          <LineChartCard
            data={growth}
            xKey="name"
            lines={[
              { key: "Competency", name: "Competency index", color: "var(--chart-1)" },
              { key: "Performance", name: "Performance", color: "var(--chart-3)" },
            ]}
          />
        </SectionCard>

        <SectionCard title="My mentor" description="Assigned leadership mentor">
          {mentor ? (
            <div>
              <p className="font-semibold">{mentor.name}</p>
              <p className="text-sm text-muted-foreground">{mentor.role}</p>
              <p className="mt-1 text-xs text-muted-foreground">{mentor.region}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {mentor.expertise.map((x) => (
                  <StatusBadge key={x} label={x} tone="info" />
                ))}
              </div>
              <div className="mt-4 rounded-lg bg-primary-soft p-3 text-xs text-primary">
                Next session: 12 Aug 2026 · Focus on {analysis.weaknesses[0]?.name ?? "leadership presence"}
              </div>
            </div>
          ) : null}
        </SectionCard>
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-2">
        <SectionCard
          title="My development activities"
          description="Next steps generated by the AI planner"
          actions={
            <Button variant="ghost" size="sm" asChild>
              <Link to="/progress">Track progress</Link>
            </Button>
          }
        >
          <ul className="space-y-3">
            {idp.slice(0, 4).map((a) => (
              <li key={a.id} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-lg border border-border p-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{a.title}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {a.type} · {a.quarter}
                  </p>
                </div>
                <StatusBadge label={a.status} tone={statusTone(a.status)} />
              </li>
            ))}
          </ul>
        </SectionCard>

        <SectionCard title="Upcoming training" description="Nominations confirmed for this cycle">
          <ul className="space-y-3">
            {emp.trainings.map((t, i) => {
              const info = getTraining(t.id);
              return (
                <li key={t.id + i} className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-lg border border-border p-3">
                  <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary-soft text-primary">
                    <BookOpenCheck className="size-4" />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{info?.name}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {info?.provider} · {info?.hours} hrs
                    </p>
                  </div>
                  <span className="inline-flex shrink-0 items-center gap-1 text-xs text-muted-foreground">
                    <CalendarClock className="size-3.5" /> {t.completedOn.slice(0, 7)}
                  </span>
                </li>
              );
            })}
            <li className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-lg border border-dashed border-primary/40 bg-primary-soft/50 p-3">
              <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary text-primary-foreground">
                <Sparkles className="size-4" />
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{trainings[0].name}</p>
                <p className="truncate text-xs text-muted-foreground">AI recommended · {trainings[0].provider}</p>
              </div>
              <StatusBadge label="Nominate" tone="info" />
            </li>
          </ul>
        </SectionCard>
      </div>
    </>
  );
}
