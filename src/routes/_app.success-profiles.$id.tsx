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

      <SectionCard className="mt-4" title="Top 3 Recommended Successors" description="AI-benchmarked top candidates for this critical leadership role">
        <div className="grid gap-4 md:grid-cols-3">
          {slate.slice(0, 3).map(({ e, score }, index) => {
            const gapInfo = gapAnalysis(e.id, profile.id);
            const gapPoints = gapInfo.weaknesses.reduce((sum, w) => sum + w.gap, 0);
            const timeline = e.readiness === "Ready Now" ? "Immediate" : e.readiness === "Ready 1-2 Yrs" ? "6–12 Months" : "18–24 Months";
            const reason = score >= 85
              ? `Top candidate matching ${gapInfo.strengths.length}/${gapInfo.rows.length} competency requirements with strong O&M experience.`
              : score >= 75
                ? `Strong performer in ${e.department}, minor capability gap in ${gapInfo.weaknesses[0]?.name ?? "strategy"}.`
                : `High potential executive in ${e.grade} grade, requires 1-year targeted development program.`;

            return (
              <div key={e.id} className="surface-card flex flex-col justify-between p-4 transition-all hover:border-primary/50">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="grid size-7 place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                      #{index + 1}
                    </span>
                    <StatusBadge label={timeline} tone={index === 0 ? "success" : "info"} />
                  </div>

                  <Link to="/employees/$id" params={{ id: e.id }} className="mt-3 flex items-center gap-3">
                    <img src={e.photo} alt="" className="size-11 rounded-full object-cover ring-2 ring-primary/20" />
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-foreground">{e.name}</p>
                      <p className="truncate text-xs text-muted-foreground">{e.currentRole}</p>
                    </div>
                  </Link>

                  <div className="mt-4 grid grid-cols-2 gap-2 rounded-lg bg-muted/60 p-2.5 text-center text-xs">
                    <div>
                      <span className="block text-muted-foreground text-[10px] uppercase font-medium">Readiness</span>
                      <span className="font-bold text-success text-base">{score}%</span>
                    </div>
                    <div>
                      <span className="block text-muted-foreground text-[10px] uppercase font-medium">Gap Score</span>
                      <span className="font-bold text-foreground text-base">{gapPoints} pts</span>
                    </div>
                  </div>

                  <p className="mt-3 text-xs text-muted-foreground leading-relaxed">
                    <span className="font-medium text-foreground">Recommendation: </span>
                    {reason}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-border/40 flex justify-between items-center text-xs text-muted-foreground">
                  <span>{e.grade} · {e.region}</span>
                  <StatusBadge label={e.readiness} tone={readinessTone(e.readiness)} />
                </div>
              </div>
            );
          })}
        </div>
      </SectionCard>

      <SectionCard className="mt-4" title="Complete Candidate Slate" description="Ranked by AI readiness score against this profile">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="pb-2 font-semibold">Rank</th>
                <th className="pb-2 font-semibold">Candidate</th>
                <th className="pb-2 font-semibold">Current role</th>
                <th className="pb-2 font-semibold">Region</th>
                <th className="pb-2 font-semibold">Readiness</th>
                <th className="pb-2 font-semibold">Fit Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {slate.map(({ e, score }, idx) => (
                <tr key={e.id} className="transition-colors hover:bg-muted/50">
                  <td className="py-2.5 font-bold text-xs text-muted-foreground">#{idx + 1}</td>
                  <td className="py-2.5">
                    <Link to="/employees/$id" params={{ id: e.id }} className="flex items-center gap-2.5">
                      <img src={e.photo} alt="" className="size-8 rounded-full object-cover" />
                      <span className="truncate font-medium">{e.name}</span>
                    </Link>
                  </td>
                  <td className="py-2.5 text-muted-foreground">{e.currentRole}</td>
                  <td className="py-2.5 text-muted-foreground">{e.region}</td>
                  <td className="py-2.5"><StatusBadge label={e.readiness} tone={readinessTone(e.readiness)} /></td>
                  <td className="py-2.5 font-semibold tabular-nums text-success">{score}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </>
  );
}
