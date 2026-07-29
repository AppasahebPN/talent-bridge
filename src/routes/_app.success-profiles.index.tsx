import { createFileRoute, Link } from "@tanstack/react-router";
import { Briefcase, Search, Target } from "lucide-react";
import { useState } from "react";
import { PageHeader } from "@/components/common/page-header";
import { StatusBadge } from "@/components/common/badges";
import { MeterBar } from "@/components/common/competency-card";
import { Input } from "@/components/ui/input";
import { successProfiles } from "@/data/mockData";

export const Route = createFileRoute("/_app/success-profiles/")({
  head: () => ({
    meta: [
      { title: "Success Profiles | POWERGRID Succession Planning" },
      { name: "description", content: "Validated leadership success profiles defining required competencies, experience, projects and exposure." },
      { property: "og:title", content: "Success Profiles | POWERGRID Succession Planning" },
      { property: "og:description", content: "Competency, experience and exposure requirements for critical leadership roles." },
    ],
  }),
  component: SuccessProfilesPage,
});

function SuccessProfilesPage() {
  const [query, setQuery] = useState("");
  const list = successProfiles.filter((p) => (p.title + p.grade + p.band).toLowerCase().includes(query.toLowerCase()));

  return (
    <>
      <PageHeader
        title="Leadership Success Profiles"
        description="Role-level benchmarks used by the AI engine to score candidate readiness."
        crumbs={[{ label: "Success Profiles" }]}
      />

      <div className="surface-card mb-6 p-4">
        <div className="relative max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search leadership roles" className="pl-9" />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
        {list.map((p) => {
          const avg = Math.round(p.competencies.reduce((s, c) => s + c.score, 0) / p.competencies.length);
          return (
            <Link key={p.id} to="/success-profiles/$id" params={{ id: p.id }} className="surface-card grid-lift flex flex-col p-5">
              <div className="grid grid-cols-[auto_minmax(0,1fr)] items-start gap-3">
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary-soft text-primary">
                  <Target className="size-5" />
                </span>
                <div className="min-w-0">
                  <p className="truncate font-semibold">{p.title}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {p.grade} · {p.band}
                  </p>
                </div>
              </div>
              <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">{p.summary}</p>
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Average competency bar</span>
                  <span className="font-semibold tabular-nums">{avg}%</span>
                </div>
                <MeterBar value={avg} tone="primary" />
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <StatusBadge label={`${p.openings} opening(s)`} tone={p.openings > 2 ? "danger" : p.openings > 1 ? "warning" : "success"} />
                <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                  <Briefcase className="size-3.5" /> {p.functionalExposure.length} functional areas
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </>
  );
}
