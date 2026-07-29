import type { ReactNode } from "react";

export interface TimelineItem {
  id: string;
  title: string;
  meta: string;
  description?: string;
  right?: ReactNode;
  tone?: "done" | "active" | "pending";
}

export function Timeline({ items }: { items: TimelineItem[] }) {
  return (
    <ol className="relative space-y-6 border-l border-border pl-6">
      {items.map((item) => (
        <li key={item.id} className="relative">
          <span
            className={
              "absolute -left-[31px] top-1 grid size-5 place-items-center rounded-full border-2 border-card " +
              (item.tone === "done" ? "bg-success" : item.tone === "active" ? "bg-primary" : "bg-muted-foreground/40")
            }
          >
            <span className="size-1.5 rounded-full bg-card" />
          </span>
          <div className="surface-card p-4">
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wide text-primary">{item.meta}</p>
                <p className="mt-1 font-medium text-foreground">{item.title}</p>
                {item.description ? <p className="mt-1 text-sm text-muted-foreground">{item.description}</p> : null}
              </div>
              {item.right ? <div className="shrink-0">{item.right}</div> : null}
            </div>
          </div>
        </li>
      ))}
    </ol>
  );
}
