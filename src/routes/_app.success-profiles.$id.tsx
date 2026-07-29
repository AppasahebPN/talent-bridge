import { createFileRoute, Link } from "@tanstack/react-router";
import { Building2, FileBadge, Globe2, Layers, Sparkles, Users } from "lucide-react";
import { PageHeader, SectionCard } from "@/components/common/page-header";
import { CompetencyCard } from "@/components/common/competency-card";
import { StatusBadge, readinessTone } from "@/components/common/badges";
import { RadarChartCard } from "@/components/charts/charts";
import { Button } from "@/components/ui/button";
import { employees, gapAnalysis, getProfile } from "@/data/mockData";

export const Route = createFileRoute("/_app/success-profiles/$id")({
  head: () => ({
    meta: [
      { title: "Success Profile Detail | POWERGRID Succession Planning" },
      { name: "description", content: "Required competencies, experience, projects, certifications and exposure for a critical leadership role." },
      { property: "og:title", content: "Success Profile Detail | POWERGRID Succession Planning" },
      { property: "og:description", content: "Role benchmark with candidate slate ranked by AI readiness score." },
    ],
  }),
  component: SuccessProfileDetail,
});

function SuccessProfileDetail() {
  const { id } = Route.useParams();
  const profile = getProfile(id);

  if (!profile) {
    return (
      <div className="surface-card p-10 text-center">
        <p className="font-medium">Success profile not found</p>
        <Button className="mt-4" asChild>
          <Link to="/success-profiles">Back to profiles</Link>
        </Button>
      </div>
    );
  }

  const slate = employees
    .map((e) => ({ e, score: gapAnalysis(e.id, profile.id).readinessScore }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 6);

  const radarData = profile.competencies.map((c) => ({
    subject: c.name,
    Required: c.score,
    "Slate average": Math.round(slate.reduce((s, x) => s + (x.e.competencies.find((k) => k.name === c.name)?.score ?? 0), 0) / slate.length),
  }));

  const requirementBlocks = [
    { icon: Layers, title: "Required Experience", items: profile.experience },
    { icon: Building2, title: "Required Projects", items: profile.projects },
    { icon: FileBadge, title: "Required Certifications", items: profile.certifications },
    { icon: Globe2, title: "Geographic Exposure", items: profile.geographicExposure },
    { icon: Users, title: "Functional Exposure", items: profile.functionalExposure },
  ];

  return (
    <>
      <PageHeader
        title={profile.title}
        description={`${profile.grade} · ${profile.band} · Incumbent: ${profile.incumbent}`}
        crumbs={[{ label: "Success Profiles", to: "/success-profiles" }, { label: profile.title }]}
        actions={
          <Button asChild>
            <Link to="/gap-analysis">
              <Sparkles className="mr-2 size-4" /> Benchmark a candidate
            </Link>
          </Button>
        }
      />

      <div className="surface-card mb-4 p-5">
        <p className="text-sm text-muted-foreground">{profile.summary}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <StatusBadge label={`${profile.openings} opening(s)`} tone={profile.openings > 2 ? "danger" : "warning"} />
          <StatusBadge label={`${slate.filter((s) => s.score >= 85).length} ready-now successors`} tone="success" />
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <SectionCard title="Required Competencies" description="Minimum proficiency bar per competency">
          <div className="grid gap-4 sm:grid-cols-2">
            {profile.competencies.map((c) => (
              <CompetencyCard key={c.name} name={c.name} score={c.score} />
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Requirement vs candidate slate" description="Radar comparison against top 6 candidates">
          <RadarChartCard
            data={radarData}
            series={[
              { key: "Required", name: "Required", color: "var(--chart-4)" },
              { key: "Slate average", name: "Slate average", color: "var(--chart-1)" },
            ]}
          />
        </SectionCard>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {requirementBlocks.map((b) => (
          <SectionCard key={b.title} title={b.title}>
            <ul className="space-y-2.5">
              {b.items.map((item) => (
                <li key={item} className="grid grid-cols-[auto_minmax(0,1fr)] items-start gap-2.5 text-sm">
                  <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-md bg-primary-soft text-primary">
                    <b.icon className="size-3.5" />
                  </span>
                  <span className="text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </SectionCard>
        ))}
      </div>

      <SectionCard className="mt-4" title="Candidate slate" description="Ranked by AI readiness score against this profile">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="pb-2 font-semibold">Candidate</th>
                <th className="pb-2 font-semibold">Current role</th>
                <th className="pb-2 font-semibold">Region</th>
                <th className="pb-2 font-semibold">Readiness</th>
                <th className="pb-2 font-semibold">Fit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {slate.map(({ e, score }) => (
                <tr key={e.id} className="transition-colors hover:bg-muted/50">
                  <td className="py-2.5">
                    <Link to="/employees/$id" params={{ id: e.id }} className="flex items-center gap-2.5">
                      <img src={e.photo} alt="" className="size-8 rounded-full object-cover" />
                      <span className="truncate font-medium">{e.name}</span>
                    </Link>
                  </td>
                  <td className="py-2.5 text-muted-foreground">{e.currentRole}</td>
                  <td className="py-2.5 text-muted-foreground">{e.region}</td>
                  <td className="py-2.5"><StatusBadge label={e.readiness} tone={readinessTone(e.readiness)} /></td>
                  <td className="py-2.5 font-semibold tabular-nums">{score}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </>
  );
}
