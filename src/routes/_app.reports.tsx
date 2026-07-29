import { createFileRoute } from "@tanstack/react-router";
import { Download, FileSpreadsheet, FileText } from "lucide-react";
import { PageHeader, SectionCard } from "@/components/common/page-header";
import { BarChartCard, LineChartCard } from "@/components/charts/charts";
import { Button } from "@/components/ui/button";
import { DEPARTMENTS, REGIONS, employees, successProfiles } from "@/data/mockData";

export const Route = createFileRoute("/_app/reports")({
  head: () => ({
    meta: [
      { title: "Reports & Analytics | POWERGRID Succession Planning" },
      { name: "description", content: "Exportable succession analytics: bench strength by region, readiness trends and leadership pipeline coverage." },
      { property: "og:title", content: "Reports & Analytics | POWERGRID Succession Planning" },
      { property: "og:description", content: "Bench strength, readiness trends and pipeline coverage reports." },
    ],
  }),
  component: ReportsPage,
});

function ReportsPage() {
  const regionData = REGIONS.map((r) => ({
    name: r.replace(" Region", ""),
    Executives: employees.filter((e) => e.region === r).length,
    "Ready now": employees.filter((e) => e.region === r && e.readiness === "Ready Now").length,
  }));

  const trend = ["2022", "2023", "2024", "2025", "2026"].map((y, i) => ({
    name: y,
    "Bench coverage": 62 + i * 8,
    "Internal fill rate": 55 + i * 7,
  }));

  const reports = [
    { icon: FileText, title: "Succession slate summary", meta: "Board pack · PDF" },
    { icon: FileSpreadsheet, title: "Competency gap register", meta: "All executives · XLSX" },
    { icon: FileText, title: "IDP compliance report", meta: "Quarterly · PDF" },
    { icon: FileSpreadsheet, title: "9-box calibration export", meta: "Committee · XLSX" },
  ];

  return (
    <>
      <PageHeader
        title="Reports & Analytics"
        description={`Coverage across ${successProfiles.length} critical leadership positions and ${employees.length} executives.`}
        crumbs={[{ label: "Reports & Analytics" }]}
        actions={
          <Button>
            <Download className="mr-2 size-4" /> Export all
          </Button>
        }
      />

      <div className="grid gap-4 xl:grid-cols-2">
        <SectionCard title="Region-wise bench strength" description="Executives and ready-now successors by region">
          <BarChartCard
            data={regionData}
            xKey="name"
            bars={[
              { key: "Executives", name: "Executives", color: "var(--chart-1)" },
              { key: "Ready now", name: "Ready now", color: "var(--chart-3)" },
            ]}
          />
        </SectionCard>

        <SectionCard title="Pipeline health trend" description="Bench coverage vs internal fill rate">
          <LineChartCard
            data={trend}
            xKey="name"
            lines={[
              { key: "Bench coverage", name: "Bench coverage %", color: "var(--chart-1)" },
              { key: "Internal fill rate", name: "Internal fill rate %", color: "var(--chart-3)" },
            ]}
          />
        </SectionCard>
      </div>

      <SectionCard className="mt-4" title="Standard reports" description="Generated from live succession data">
        <div className="grid gap-3 md:grid-cols-2">
          {reports.map((r) => (
            <div key={r.title} className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-lg border border-border p-4">
              <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-primary-soft text-primary">
                <r.icon className="size-5" />
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{r.title}</p>
                <p className="truncate text-xs text-muted-foreground">{r.meta}</p>
              </div>
              <Button variant="outline" size="sm">
                <Download className="mr-2 size-4" /> Export
              </Button>
            </div>
          ))}
        </div>
        <p className="mt-4 text-xs text-muted-foreground">
          Departments covered: {DEPARTMENTS.join(" · ")}
        </p>
      </SectionCard>
    </>
  );
}
