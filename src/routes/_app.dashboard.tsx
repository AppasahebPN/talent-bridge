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
import { BarChartCard, LineChartCard, RadarChartCard } from "@/components/charts/charts";
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
  const ready12 = employees.filter((e) => e.readiness === "Ready 1-2 Yrs");
  const ready35 = employees.filter((e) => e.readiness === "Ready 3-5 Yrs");
  const devNeeded = employees.filter((e) => e.readiness === "Development Needed");
  const hiPo = employees.filter((e) => e.highPotential);
  const activeIdps = employees.filter((e) => e.idpProgress < 100);

  // Calculate average readiness score across all employees
  const employeeScores = employees.map((e) => gapAnalysis(e.id, e.targetRoleId).readinessScore);
  const avgReadiness = Math.round(employeeScores.reduce((a, b) => a + b, 0) / (employeeScores.length || 1));

  const readinessData = [
    { name: "Ready Now", count: readyNow.length },
    { name: "Ready 1-2 Yrs", count: ready12.length },
    { name: "Ready 3-5 Yrs", count: ready35.length },
    { name: "Development Needed", count: devNeeded.length },
  ];

  const competencyGap = COMPETENCIES.map((name) => {
    const avg = Math.round(employees.reduce((s, e) => s + (e.competencies.find((c) => c.name === name)?.score ?? 0), 0) / employees.length);
    const req = Math.round(successProfiles.reduce((s, p) => s + (p.competencies.find((c) => c.name === name)?.score ?? 0), 0) / successProfiles.length);
    return { subject: name, Current: avg, Required: req };
  });

  const deptReadinessData = DEPARTMENTS.map((d) => {
    const deptEmps = employees.filter((e) => e.department === d);
    return {
      name: d.length > 12 ? d.slice(0, 11) + "…" : d,
      "Ready Now": deptEmps.filter((e) => e.readiness === "Ready Now").length,
      "Ready 1-2 Yrs": deptEmps.filter((e) => e.readiness === "Ready 1-2 Yrs").length,
      "Dev Needed": deptEmps.filter((e) => e.readiness === "Development Needed" || e.readiness === "Ready 3-5 Yrs").length,
    };
  });

  const trainingCompletionData = ["Q1 2025", "Q2 2025", "Q3 2025", "Q4 2025", "Q1 2026"].map((q, i) => ({
    name: q,
    "Nominated": 45 + i * 12,
    "Completed": 38 + i * 14,
    "Completion %": Math.min(96, Math.round(((38 + i * 14) / (45 + i * 12)) * 100)),
  }));

  // Successor Recommendations for Critical Positions
  const successorRecommendations = successProfiles.slice(0, 4).map((profile) => {
    const top3 = employees
      .map((e) => {
        const gapInfo = gapAnalysis(e.id, profile.id);
        const gapPoints = gapInfo.weaknesses.reduce((sum, w) => sum + w.gap, 0);
        return {
          employee: e,
          readinessScore: gapInfo.readinessScore,
          gapScore: gapPoints,
          timeline: e.readiness === "Ready Now" ? "Immediate" : e.readiness === "Ready 1-2 Yrs" ? "6–12 Months" : "18–24 Months",
          reason: gapInfo.readinessScore >= 85
            ? `Top performer with ${e.experience} yrs exp, meets ${gapInfo.strengths.length}/${gapInfo.rows.length} competency bars.`
            : gapInfo.readinessScore >= 75
              ? `Strong leadership track record in ${e.department}, minor gap in ${gapInfo.weaknesses[0]?.name ?? "strategic planning"}.`
              : `High potential candidate in ${e.grade} grade, candidate for 1-2 year accelerated IDP.`,
        };
      })
      .sort((a, b) => b.readinessScore - a.readinessScore)
      .slice(0, 3);

    return { profile, top3 };
  });

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

      {/* KPI Section */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-8">
        <KpiCard label="Total Employees" value={employees.length} icon={<Users className="size-5" />} hint="In talent pool" />
        <KpiCard label="Ready Now" value={readyNow.length} tone="success" icon={<UserCheck className="size-5" />} hint="Immediate successors" />
        <KpiCard label="Ready 1–2 Yrs" value={ready12.length} tone="info" icon={<CalendarClock className="size-5" />} hint="Near-term pipeline" />
        <KpiCard label="Ready 3–5 Yrs" value={ready35.length} icon={<Rocket className="size-5" />} hint="Medium-term bench" />
        <KpiCard label="Dev Needed" value={devNeeded.length} tone="warning" icon={<BookOpenCheck className="size-5" />} hint="Requires targeted IDP" />
        <KpiCard label="High Potential" value={hiPo.length} tone="warning" icon={<Star className="size-5" />} hint="Top 9-Box quadrants" />
        <KpiCard label="Avg Readiness" value={`${avgReadiness}%`} tone="success" icon={<TrendingUp className="size-5" />} hint="Organisation-wide" />
        <KpiCard label="Active IDPs" value={activeIdps.length} icon={<ClipboardList className="size-5" />} hint="In execution phase" />
      </div>

      {/* Analytics Charts Section */}
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

        <SectionCard title="Department-wise Leadership Readiness" description="Successor density by department and readiness tier">
          <BarChartCard
            data={deptReadinessData}
            xKey="name"
            bars={[
              { key: "Ready Now", name: "Ready Now", color: "var(--chart-3)" },
              { key: "Ready 1-2 Yrs", name: "Ready 1-2 Yrs", color: "var(--chart-1)" },
              { key: "Dev Needed", name: "Dev Needed", color: "var(--chart-4)" },
            ]}
          />
        </SectionCard>

        <SectionCard title="Training Completion & IDP Execution" description="Quarterly planned vs completed development milestones">
          <LineChartCard
            data={trainingCompletionData}
            xKey="name"
            lines={[
              { key: "Nominated", name: "Nominated", color: "var(--chart-2)" },
              { key: "Completed", name: "Completed", color: "var(--chart-1)" },
            ]}
          />
        </SectionCard>
      </div>

      {/* Task 3: Successor Recommendation for Critical Roles */}
      <div className="mt-6">
        <SectionCard
          title="Top Successor Recommendations for Critical Positions"
          description="AI-ranked top 3 successors per leadership position with readiness score, gap score, promotion timeline, and rationale"
          actions={
            <Button variant="ghost" size="sm" asChild>
              <Link to="/success-profiles">View all profiles</Link>
            </Button>
          }
        >
          <div className="space-y-6">
            {successorRecommendations.map(({ profile, top3 }) => (
              <div key={profile.id} className="rounded-xl border border-border bg-muted/30 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/60 pb-3">
                  <div>
                    <Link to="/success-profiles/$id" params={{ id: profile.id }} className="text-base font-semibold text-foreground hover:underline">
                      {profile.title}
                    </Link>
                    <span className="ml-2 text-xs text-muted-foreground">({profile.grade} · {profile.band})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge label={`Incumbent: ${profile.incumbent}`} tone="neutral" />
                    <StatusBadge label={`${profile.openings} opening(s)`} tone={profile.openings > 1 ? "warning" : "info"} />
                  </div>
                </div>

                <div className="mt-3 grid gap-3 md:grid-cols-3">
                  {top3.map(({ employee, readinessScore, gapScore, timeline, reason }, index) => (
                    <div key={employee.id} className="surface-card flex flex-col justify-between p-3.5 transition-shadow hover:shadow-md">
                      <div>
                        <div className="flex items-center justify-between gap-2">
                          <span className="grid size-6 place-items-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                            #{index + 1}
                          </span>
                          <StatusBadge label={timeline} tone={index === 0 ? "success" : "info"} />
                        </div>

                        <Link to="/employees/$id" params={{ id: employee.id }} className="mt-2.5 flex items-center gap-2.5">
                          <img src={employee.photo} alt="" className="size-9 rounded-full object-cover ring-2 ring-primary/20" />
                          <div className="min-w-0">
                            <p className="truncate font-semibold text-foreground text-sm">{employee.name}</p>
                            <p className="truncate text-xs text-muted-foreground">{employee.currentRole}</p>
                          </div>
                        </Link>

                        <div className="mt-3 grid grid-cols-2 gap-2 rounded-lg bg-muted/60 p-2 text-center text-xs">
                          <div>
                            <span className="block text-muted-foreground text-[10px]">Readiness</span>
                            <span className="font-bold text-success text-sm">{readinessScore}%</span>
                          </div>
                          <div>
                            <span className="block text-muted-foreground text-[10px]">Gap Score</span>
                            <span className="font-bold text-foreground text-sm">{gapScore} pts</span>
                          </div>
                        </div>

                        <p className="mt-2.5 text-xs text-muted-foreground leading-relaxed">
                          <span className="font-medium text-foreground">Rationale: </span>
                          {reason}
                        </p>
                      </div>

                      <div className="mt-3 pt-2 border-t border-border/40 flex justify-between items-center text-xs text-muted-foreground">
                        <span>{employee.grade} · {employee.region}</span>
                        <MeterBar value={readinessScore} className="w-16" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </>
  );
}

function EmployeeDashboard({ employeeId }: { employeeId: string }) {
  // Fall back to the first mock employee if the session ID doesn't match any mock record
  const emp = getEmployee(employeeId) ?? employees[0];
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
