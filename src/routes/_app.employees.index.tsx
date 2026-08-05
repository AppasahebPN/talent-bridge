import { useEffect, useMemo, useState } from "react";
import api from "@/services/api";
import { DEPARTMENTS, REGIONS, employees as mockEmployees, gapAnalysis, getProfile } from "@/data/mockData";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Download, LayoutGrid, Rows3, Search } from "lucide-react";
import { PageHeader } from "@/components/common/page-header";
import { EmployeeCard } from "@/components/common/employee-card";
import { StatusBadge, readinessTone } from "@/components/common/badges";
import { MeterBar } from "@/components/common/competency-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


export const Route = createFileRoute("/_app/employees/")({
  head: () => ({
    meta: [
      { title: "Talent Directory | POWERGRID Succession Planning" },
      { name: "description", content: "Search and filter the executive talent pool by department, region, grade and leadership readiness." },
      { property: "og:title", content: "Talent Directory | POWERGRID Succession Planning" },
      { property: "og:description", content: "Executive talent pool with readiness, grade and competency indicators." },
    ],
  }),
  component: EmployeesPage,
});

function EmployeesPage() {
  const [query, setQuery] = useState("");
  const [dept, setDept] = useState("all");
  const [region, setRegion] = useState("all");
  const [readiness, setReadiness] = useState("all");
  const [view, setView] = useState<"grid" | "table">("table");
  const [employeeList, setEmployeeList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await api.get("/employees");
        if (res.data && res.data.length > 0) {
          const mappedEmployees = res.data.map((emp: any) => ({
            id: emp._id,
            employeeId: emp.employeeId,
            name: emp.name,
            department: emp.department,
            region: emp.region ?? "Southern Region",
            currentRole: emp.designation ?? emp.currentRole ?? "—",
            grade: emp.grade,
            targetRoleId: emp.targetRole ?? emp.targetRoleId ?? "SP01",
            readiness:
              emp.readinessScore >= 80
                ? "Ready Now"
                : emp.readinessScore >= 60
                  ? "Ready 1-2 Yrs"
                  : emp.readinessScore >= 40
                    ? "Ready 3-5 Yrs"
                    : "Development Needed",
            photo: `https://ui-avatars.com/api/?name=${encodeURIComponent(emp.name)}&background=random`,
            highPotential: emp.highPotential ?? false,
            competencies: emp.competencies ?? [],
          }));
          setEmployeeList(mappedEmployees);
        } else {
          // Empty backend → fall back to mock data
          setEmployeeList(mockEmployees);
        }
      } catch {
        // Backend unreachable → fall back to mock data
        setEmployeeList(mockEmployees);
      } finally {
        setLoading(false);
      }
    };
    fetchEmployees();
  }, []);

  const filtered = useMemo(
    () =>
      employeeList.filter(
        (e) =>
          (dept === "all" || e.department === dept) &&
          (region === "all" || e.region === region) &&
          (readiness === "all" || e.readiness === readiness) &&
          (e.name + e.currentRole + e.employeeId).toLowerCase().includes(query.toLowerCase()),
      ),
    [employeeList, query, dept, region, readiness],
  );
if (loading) {
  return (
    <div className="surface-card flex flex-col items-center justify-center p-12 text-center">
      <div className="size-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      <p className="mt-4 font-medium text-foreground">Loading Talent Directory...</p>
      <p className="mt-1 text-xs text-muted-foreground">Fetching executive profiles from enterprise database</p>
    </div>
  );
}
  return (
    <>
      <PageHeader
        title="Talent Directory"
        description={`${filtered.length} of ${employeeList.length} executives in the succession pool`}
        crumbs={[{ label: "Talent Directory" }]}
        actions={
          <>
            <Button variant="outline">
              <Download className="mr-2 size-4" /> Export
            </Button>
            <Button variant="outline" size="icon" aria-label="Toggle view" onClick={() => setView(view === "grid" ? "table" : "grid")}>
              {view === "grid" ? <Rows3 className="size-4" /> : <LayoutGrid className="size-4" />}
            </Button>
          </>
        }
      />

      <div className="surface-card mb-6 grid gap-3 p-4 md:grid-cols-4">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search name, role, ID" className="pl-9" />
        </div>
        <Select value={dept} onValueChange={setDept}>
          <SelectTrigger><SelectValue placeholder="Department" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All departments</SelectItem>
            {DEPARTMENTS.map((d) => (
              <SelectItem key={d} value={d}>{d}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={region} onValueChange={setRegion}>
          <SelectTrigger><SelectValue placeholder="Region" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All regions</SelectItem>
            {REGIONS.map((r) => (
              <SelectItem key={r} value={r}>{r}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={readiness} onValueChange={setReadiness}>
          <SelectTrigger><SelectValue placeholder="Readiness" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All readiness levels</SelectItem>
            {["Ready Now", "Ready 1-2 Yrs", "Ready 3-5 Yrs", "Development Needed"].map((r) => (
              <SelectItem key={r} value={r}>{r}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <div className="surface-card flex flex-col items-center justify-center p-12 text-center">
          <Search className="size-8 text-muted-foreground" />
          <p className="mt-3 font-semibold text-foreground">No matching executives found</p>
          <p className="mt-1 text-xs text-muted-foreground">Try adjusting your search query or clear select filters.</p>
          <Button variant="outline" className="mt-4" onClick={() => { setQuery(""); setDept("all"); setRegion("all"); setReadiness("all"); }}>
            Reset Filters
          </Button>
        </div>
      ) : view === "grid" ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {filtered.map((e) => (
            <EmployeeCard key={e.id} employee={e} />
          ))}
        </div>
      ) : (
        <div className="surface-card overflow-x-auto p-0">
          <table className="w-full min-w-[900px] text-sm">
            <thead className="bg-muted/60">
              <tr className="text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-4 py-3 font-semibold">Employee</th>
                <th className="px-4 py-3 font-semibold">Department</th>
                <th className="px-4 py-3 font-semibold">Region</th>
                <th className="px-4 py-3 font-semibold">Grade</th>
                <th className="px-4 py-3 font-semibold">Target role</th>
                <th className="px-4 py-3 font-semibold">Readiness</th>
                <th className="px-4 py-3 font-semibold">Fit score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((e) => {
                const analysis = gapAnalysis(e.id, e.targetRoleId);
                const score = analysis.readinessScore;
                return (
                  <tr key={e.id} className="transition-colors hover:bg-muted/50">
                    <td className="px-4 py-3">
                      <Link to="/employees/$id" params={{ id: e.id }} className="flex items-center gap-3">
                        <img src={e.photo} alt="" className="size-9 rounded-full object-cover" />
                        <span className="min-w-0">
                          <span className="block truncate font-medium">{e.name}</span>
                          <span className="block truncate text-xs text-muted-foreground">{e.employeeId} · {e.currentRole}</span>
                        </span>
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{e.department}</td>
                    <td className="px-4 py-3 text-muted-foreground">{e.region}</td>
                    <td className="px-4 py-3"><StatusBadge label={e.grade} tone="info" /></td>
                    <td className="px-4 py-3 text-muted-foreground">{getProfile(e.targetRoleId)?.title ?? e.targetRoleId ?? "—"}</td>
                    <td className="px-4 py-3"><StatusBadge label={e.readiness} tone={readinessTone(e.readiness)} /></td>
                    <td className="w-44 px-4 py-3">
                      <div className="flex items-center gap-2">
                        <MeterBar value={score} />
                        <span className="w-9 shrink-0 text-right text-xs font-semibold tabular-nums">{score}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
