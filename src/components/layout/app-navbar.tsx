import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Bell, LogOut, Menu, Search, Settings, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/use-auth";
import { RoleBadge } from "@/components/common/badges";
import { employees } from "@/data/mockData";

const NOTIFICATIONS = [
  { id: "n1", title: "Assessment Centre results published", meta: "3 candidates moved to Ready Now" },
  { id: "n2", title: "IDP review due for Kavita Iyer", meta: "Due in 4 days" },
  { id: "n3", title: "Committee meeting — Regional ED slate", meta: "Tomorrow, 11:00 AM" },
];

export function AppNavbar({ onMenu }: { onMenu: () => void }) {
  const { session, logout } = useAuth();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const results = query.trim()
    ? employees.filter((e) => (e.name + e.currentRole + e.department).toLowerCase().includes(query.toLowerCase())).slice(0, 6)
    : [];

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-border bg-card/90 px-4 backdrop-blur lg:px-6">
      <button onClick={onMenu} className="rounded-md p-2 hover:bg-muted lg:hidden" aria-label="Open navigation">
        <Menu className="size-5" />
      </button>

      <div className="relative min-w-0 flex-1 max-w-md">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search employees, roles, competencies…"
          className="pl-9"
        />
        {results.length > 0 ? (
          <div className="surface-card absolute left-0 right-0 top-12 z-30 max-h-80 overflow-y-auto p-2">
            {results.map((r) => (
              <button
                key={r.id}
                onClick={() => {
                  setQuery("");
                  navigate({ to: "/employees/$id", params: { id: r.id } });
                }}
                className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left hover:bg-muted"
              >
                <img src={r.photo} alt="" className="size-8 rounded-full object-cover" />
                <span className="min-w-0">
                  <span className="block truncate text-sm font-medium">{r.name}</span>
                  <span className="block truncate text-xs text-muted-foreground">
                    {r.currentRole} · {r.department}
                  </span>
                </span>
              </button>
            ))}
          </div>
        ) : null}
      </div>

      <div className="ml-auto flex items-center gap-1">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
              <Bell className="size-5" />
              <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-destructive" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {NOTIFICATIONS.map((n) => (
              <DropdownMenuItem key={n.id} className="flex-col items-start gap-0.5 py-2">
                <span className="text-sm font-medium">{n.title}</span>
                <span className="text-xs text-muted-foreground">{n.meta}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 rounded-full py-1 pl-1 pr-2 transition-colors hover:bg-muted">
              <span className="grid size-8 place-items-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                {session?.name
                  .split(" ")
                  .map((p) => p[0])
                  .slice(0, 2)
                  .join("")}
              </span>
              <span className="hidden min-w-0 text-left sm:block">
                <span className="block truncate text-sm font-medium leading-tight">{session?.name}</span>
                <span className="block truncate text-[11px] leading-tight text-muted-foreground">
                  {session ? <RoleBadge role={session.role} className="border-0 bg-transparent px-0 py-0 text-[11px]" /> : null}
                </span>
              </span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="flex flex-col gap-1">
              <span>{session?.name}</span>
              {session ? <RoleBadge role={session.role} className="w-fit" /> : null}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/employees/$id" params={{ id: session?.employeeId ?? "E001" }}>
                <User className="mr-2 size-4" /> My profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/progress">
                <Settings className="mr-2 size-4" /> My development
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                logout();
                navigate({ to: "/" });
              }}
            >
              <LogOut className="mr-2 size-4" /> Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
