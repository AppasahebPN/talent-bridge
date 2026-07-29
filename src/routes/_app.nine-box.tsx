import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader, SectionCard } from "@/components/common/page-header";
import { employees } from "@/data/mockData";
import { boxIndex, boxLabel } from "@/utils/talent";

export const Route = createFileRoute("/_app/nine-box")({
  head: () => ({
    meta: [
      { title: "9-Box Matrix | POWERGRID Succession Planning" },
      { name: "description", content: "Calibrate executive talent across performance and potential using the 9-box succession matrix." },
      { property: "og:title", content: "9-Box Matrix | POWERGRID Succession Planning" },
      { property: "og:description", content: "Performance vs potential calibration of the executive talent pool." },
    ],
  }),
  component: NineBoxPage,
});

function NineBoxPage() {
  const cells = [2, 1, 0].flatMap((row) =>
    [0, 1, 2].map((col) => ({
      row,
      col,
      people: employees.filter((e) => {
        const b = boxIndex(e.nineBox.performance, e.nineBox.potential);
        return b.row === row && b.col === col;
      }),
    })),
  );

  return (
    <>
      <PageHeader
        title="9-Box Talent Matrix"
        description="Performance (horizontal) against potential (vertical) for the executive succession pool."
        crumbs={[{ label: "9-Box Matrix" }]}
      />

      <SectionCard title="Calibration grid" description="Click a name to open the full profile">
        <div className="grid grid-cols-3 gap-3">
          {cells.map((cell) => (
            <div
              key={`${cell.row}-${cell.col}`}
              className={
                "min-h-44 rounded-xl border p-3 " +
                (cell.row + cell.col >= 3
                  ? "border-success/30 bg-success/5"
                  : cell.row + cell.col >= 2
                    ? "border-info/30 bg-info/5"
                    : "border-border bg-muted/40")
              }
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {boxLabel(cell.col === 2 ? 80 : cell.col === 1 ? 60 : 40, cell.row === 2 ? 85 : cell.row === 1 ? 70 : 50)}
              </p>
              <p className="mt-0.5 text-[11px] text-muted-foreground">{cell.people.length} executive(s)</p>
              <ul className="mt-3 space-y-1.5">
                {cell.people.slice(0, 5).map((p) => (
                  <li key={p.id}>
                    <Link
                      to="/employees/$id"
                      params={{ id: p.id }}
                      className="flex items-center gap-2 rounded-md bg-card px-2 py-1.5 text-xs shadow-sm transition-colors hover:bg-muted"
                    >
                      <img src={p.photo} alt="" className="size-6 shrink-0 rounded-full object-cover" />
                      <span className="truncate">{p.name}</span>
                    </Link>
                  </li>
                ))}
                {cell.people.length > 5 ? (
                  <li className="px-2 text-[11px] text-muted-foreground">+{cell.people.length - 5} more</li>
                ) : null}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-3 flex justify-between text-xs text-muted-foreground">
          <span>Low performance</span>
          <span>High performance →</span>
        </div>
      </SectionCard>
    </>
  );
}
