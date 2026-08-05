import { createFileRoute, Link } from "@tanstack/react-router";
import { Award, Briefcase, Building2, CalendarDays, GraduationCap, Mail, MapPin, Sparkles, UserRound } from "lucide-react";
import { PageHeader, SectionCard } from "@/components/common/page-header";
import { CompetencyCard, MeterBar } from "@/components/common/competency-card";
import { StatusBadge, readinessTone } from "@/components/common/badges";
import { Timeline } from "@/components/common/timeline";
import { BarChartCard, LineChartCard } from "@/components/charts/charts";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { boxLabel } from "@/utils/talent";
import { employees, gapAnalysis, getEmployee, getMentor, getProfile, getProject, getTraining, successProfiles } from "@/data/mockData";

export const Route = createFileRoute("/_app/employees/$id")({
  head: () => ({
    meta: [
      { title: "Employee Profile | POWERGRID Succession Planning" },
      { name: "description", content: "Detailed executive profile: competencies, performance history, assessment score, 9-box position and career timeline." },
      { property: "og:title", content: "Employee Profile | POWERGRID Succession Planning" },
      { property: "og:description", content: "Competencies, performance history, certifications and career timeline." },
    ],
  }),
  component: EmployeeProfilePage,
});

function EmployeeProfilePage() {
  const { id } = Route.useParams();
  const emp = getEmployee(id);

  if (!emp) {
    return (
      <div className="surface-card p-10 text-center">
        <p className="font-medium">Employee not found</p>
        <Button className="mt-4" asChild>
          <Link to="/employees">Back to directory</Link>
        </Button>
      </div>
    );
  }

  const analysis = gapAnalysis(emp.id, emp.targetRoleId);
  const target = getProfile(emp.targetRoleId) ?? successProfiles[0];
  const mentor = getMentor(emp.mentorId);
  const peers = employees.filter((e) => e.department === emp.department && e.id !== emp.id).slice(0, 3);

  return (
    <>
      <PageHeader
        title={emp.name}
        description={`${emp.currentRole} · ${emp.grade} · ${emp.department}`}
        crumbs={[{ label: "Talent Directory", to: "/employees" }, { label: emp.name }]}
        actions={
          <>
            <Button variant="outline" asChild>
              <Link to="/gap-analysis">Gap analysis</Link>
            </Button>
            <Button asChild>
              <Link to="/idp">
                <Sparkles className="mr-2 size-4" /> Generate AI IDP
              </Link>
            </Button>
          </>
        }
      />

      <div className="grid gap-4 xl:grid-cols-[340px_minmax(0,1fr)]">
        <div className="space-y-4">
          <section className="surface-card p-5 text-center">
            <img src={emp.photo} alt={emp.name} className="mx-auto size-28 rounded-full object-cover ring-4 ring-primary-soft" />
            <h2 className="mt-4 text-lg font-semibold">{emp.name}</h2>
            <p className="text-sm text-muted-foreground">{emp.currentRole}</p>
            <div className="mt-3 flex flex-wrap justify-center gap-2">
              <StatusBadge label={emp.readiness} tone={readinessTone(emp.readiness)} />
              {emp.highPotential ? <StatusBadge label="High Potential" tone="warning" /> : null}
            </div>
            <dl className="mt-5 space-y-2.5 text-left text-sm">
              {[
                { icon: UserRound, k: "Employee ID", v: emp.employeeId },
                { icon: Building2, k: "Department", v: emp.department },
                { icon: MapPin, k: "Region", v: emp.region },
                { icon: Briefcase, k: "Grade", v: emp.grade },
                { icon: CalendarDays, k: "Experience", v: `${emp.experience} yrs (${emp.yearsInOrg} in POWERGRID)` },
                { icon: Mail, k: "Email", v: emp.email },
              ].map((row) => (
                <div key={row.k} className="grid grid-cols-[auto_minmax(0,1fr)] items-start gap-2.5">
                  <row.icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                  <div className="min-w-0">
                    <dt className="text-[11px] uppercase tracking-wide text-muted-foreground">{row.k}</dt>
                    <dd className="truncate font-medium">{row.v}</dd>
                  </div>
                </div>
              ))}
            </dl>
          </section>

          <SectionCard title="Assessment & readiness" description={`Target: ${target.title}`}>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Assessment Centre score</span>
                  <span className="font-semibold tabular-nums">{emp.assessmentScore}/100</span>
                </div>
                <div className="mt-2"><MeterBar value={emp.assessmentScore} tone="primary" /></div>
              </div>
              <div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Role readiness</span>
                  <span className="font-semibold tabular-nums">{analysis.readinessScore}%</span>
                </div>
                <div className="mt-2"><MeterBar value={analysis.readinessScore} tone="success" /></div>
              </div>
              <div className="rounded-lg bg-muted p-3 text-xs text-muted-foreground">
                9-Box position: <span className="font-semibold text-foreground">{boxLabel(emp.nineBox.performance, emp.nineBox.potential)}</span>
                <br />
                Performance {emp.nineBox.performance} · Potential {emp.nineBox.potential}
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Mentor" description="Assigned leadership mentor">
            {mentor ? (
              <div>
                <p className="font-medium">{mentor.name}</p>
                <p className="text-sm text-muted-foreground">{mentor.role}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {mentor.expertise.map((x) => (
                    <StatusBadge key={x} label={x} tone="info" />
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No mentor assigned</p>
            )}
          </SectionCard>
        </div>

        <div className="min-w-0">
          <Tabs defaultValue="competencies">
            <TabsList className="mb-4 flex w-full flex-wrap justify-start">
              <TabsTrigger value="competencies">Competencies</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="experience">Training & Projects</TabsTrigger>
              <TabsTrigger value="career">Career Timeline</TabsTrigger>
            </TabsList>

            <TabsContent value="competencies" className="space-y-4">
              <SectionCard title="Competency profile" description={`Benchmarked against ${target.title}`}>
                <div className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-3">
                  {emp.competencies.map((c) => (
                    <CompetencyCard
                      key={c.name}
                      name={c.name}
                      score={c.score}
                      required={target.competencies.find((t) => t.name === c.name)?.score}
                    />
                  ))}
                </div>
              </SectionCard>
              <SectionCard title="Current vs required" description="Competency comparison chart">
                <BarChartCard
                  data={analysis.rows.map((r) => ({ name: r.name.split(" ")[0], Current: r.current, Required: r.required }))}
                  xKey="name"
                  bars={[
                    { key: "Current", name: "Current", color: "var(--chart-1)" },
                    { key: "Required", name: "Required", color: "var(--chart-4)" },
                  ]}
                />
              </SectionCard>
            </TabsContent>

            <TabsContent value="performance" className="space-y-4">
              <SectionCard title="Performance ratings — last 5 years" description="Annual appraisal rating out of 5">
                <LineChartCard
                  data={emp.performance.map((p) => ({ name: p.year, Rating: p.rating }))}
                  xKey="name"
                  lines={[{ key: "Rating", name: "Rating (of 5)", color: "var(--chart-1)" }]}
                />
                <div className="mt-4 grid gap-3 sm:grid-cols-5">
                  {emp.performance.map((p) => (
                    <div key={p.year} className="rounded-lg border border-border p-3 text-center">
                      <p className="text-xs text-muted-foreground">{p.year}</p>
                      <p className="mt-1 text-lg font-semibold tabular-nums">{p.rating.toFixed(1)}</p>
                    </div>
                  ))}
                </div>
              </SectionCard>
              <SectionCard title="Certifications" description="Verified credentials on record">
                <div className="flex flex-wrap gap-2">
                  {emp.certifications.map((c) => (
                    <span key={c} className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-muted/60 px-3 py-1.5 text-sm">
                      <Award className="size-4 text-primary" /> {c}
                    </span>
                  ))}
                </div>
              </SectionCard>
            </TabsContent>

            <TabsContent value="experience" className="space-y-4">
              <SectionCard title="Training history" description="Completed programmes">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[520px] text-sm">
                    <thead>
                      <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                        <th className="pb-2 font-semibold">Programme</th>
                        <th className="pb-2 font-semibold">Provider</th>
                        <th className="pb-2 font-semibold">Hours</th>
                        <th className="pb-2 font-semibold">Completed</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {emp.trainings.map((t, i) => {
                        const info = getTraining(t.id);
                        return (
                          <tr key={t.id + i}>
                            <td className="py-2.5 font-medium">
                              <span className="inline-flex items-center gap-2">
                                <GraduationCap className="size-4 text-primary" /> {info?.name}
                              </span>
                            </td>
                            <td className="py-2.5 text-muted-foreground">{info?.provider}</td>
                            <td className="py-2.5 tabular-nums text-muted-foreground">{info?.hours}</td>
                            <td className="py-2.5 text-muted-foreground">{t.completedOn}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </SectionCard>

              <SectionCard title="Projects" description="Major assignments delivered">
                <div className="grid gap-3 sm:grid-cols-2">
                  {emp.projects.map((p) => {
                    const info = getProject(p);
                    return (
                      <div key={p} className="rounded-lg border border-border p-3">
                        <p className="text-sm font-medium">{info?.name}</p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {info?.domain} · {info?.scale}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </SectionCard>

              <SectionCard title="Departmental peers" description="Comparable talent in the same function">
                <div className="grid gap-3 sm:grid-cols-3">
                  {peers.map((p) => (
                    <Link key={p.id} to="/employees/$id" params={{ id: p.id }} className="rounded-lg border border-border p-3 transition-colors hover:bg-muted/60">
                      <div className="flex items-center gap-2.5">
                        <img src={p.photo} alt="" className="size-9 rounded-full object-cover" />
                        <span className="min-w-0">
                          <span className="block truncate text-sm font-medium">{p.name}</span>
                          <span className="block truncate text-xs text-muted-foreground">{p.grade}</span>
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </SectionCard>
            </TabsContent>

            <TabsContent value="career">
              <SectionCard title="Career timeline" description="Progression within POWERGRID">
                <Timeline
                  items={emp.timeline.map((t, i) => ({
                    id: `${t.year}-${i}`,
                    meta: t.year,
                    title: t.title,
                    description: t.detail,
                    tone: i === emp.timeline.length - 1 ? "active" : "done",
                  }))}
                />
              </SectionCard>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}
