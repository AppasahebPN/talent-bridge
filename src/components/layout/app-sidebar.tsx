import { Link, useRouterState } from "@tanstack/react-router";
import {
  BarChart3,
  Boxes,
  ClipboardList,
  GaugeCircle,
  LayoutDashboard,
  Radar,
  Target,
  Users,
  Zap,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import type { Role } from "@/types";

const NAV: { label: string; to: string; icon: typeof Users; roles: Role[]; group: string }[] = [
  { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard, roles: ["employee", "hr", "committee"], group: "Overview" },
  { label: "Talent Directory", to: "/employees", icon: Users, roles: ["hr", "committee"], group: "Talent" },
  { label: "9-Box Matrix", to: "/nine-box", icon: Boxes, roles: ["hr", "committee"], group: "Talent" },
  { label: "Success Profiles", to: "/success-profiles", icon: Target, roles: ["employee", "hr", "committee"], group: "Talent" },
  { label: "AI Gap Analysis", to: "/gap-analysis", icon: Radar, roles: ["employee", "hr", "committee"], group: "AI Insights" },
  { label: "AI Development Plan", to: "/idp", icon: ClipboardList, roles: ["employee", "hr", "committee"], group: "AI Insights" },
  { label: "Progress Tracking", to: "/progress", icon: GaugeCircle, roles: ["employee", "hr", "committee"], group: "AI Insights" },
  { label: "Reports & Analytics", to: "/reports", icon: BarChart3, roles: ["hr", "committee"], group: "Governance" },
];

export function AppSidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { session } = useAuth();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const role = session?.role ?? "employee";
  const items = NAV.filter((n) => n.roles.includes(role));
  const groups = Array.from(new Set(items.map((i) => i.group)));

  return (
    <>
      {open ? <div className="fixed inset-0 z-30 bg-foreground/40 lg:hidden" onClick={onClose} aria-hidden /> : null}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-sidebar text-sidebar-foreground transition-transform duration-200 lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-16 items-center gap-2.5 border-b border-sidebar-border px-4">
          <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-sidebar-primary">
            <Zap className="size-5 text-sidebar-primary-foreground" />
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">POWERGRID</p>
            <p className="truncate text-[11px] text-sidebar-foreground/70">Succession &amp; Leadership</p>
          </div>
          <button onClick={onClose} className="ml-auto rounded-md p-1 hover:bg-sidebar-accent lg:hidden" aria-label="Close navigation">
            <X className="size-4" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          {groups.map((group) => (
            <div key={group} className="mb-5">
              <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-sidebar-foreground/50">{group}</p>
              <ul className="space-y-1">
                {items
                  .filter((i) => i.group === group)
                  .map((item) => {
                    const active = pathname === item.to || pathname.startsWith(item.to + "/");
                    return (
                      <li key={item.to}>
                        <Link
                          to={item.to}
                          onClick={onClose}
                          className={cn(
                            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                            active
                              ? "bg-sidebar-primary font-medium text-sidebar-primary-foreground"
                              : "text-sidebar-foreground/85 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                          )}
                        >
                          <item.icon className="size-4 shrink-0" />
                          <span className="truncate">{item.label}</span>
                        </Link>
                      </li>
                    );
                  })}
              </ul>
            </div>
          ))}
        </nav>

        <div className="border-t border-sidebar-border p-4">
          <p className="text-[11px] leading-relaxed text-sidebar-foreground/60">
            Power Grid Corporation of India Ltd.
            <br />
            Talent Intelligence Platform v2.4
          </p>
        </div>
      </aside>
    </>
  );
}
