import { useEffect } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { BarChart3, Boxes, ShieldCheck, Sparkles, User, Users, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import type { Role } from "@/types";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "POWERGRID Succession Planning & Leadership Development" },
      {
        name: "description",
        content:
          "AI-powered succession planning, competency gap analysis and leadership development platform for POWERGRID executives.",
      },
      { property: "og:title", content: "POWERGRID Succession Planning & Leadership Development" },
      {
        property: "og:description",
        content: "Role-based talent intelligence: 9-box matrix, success profiles, AI gap analysis and individual development plans.",
      },
    ],
  }),
  component: LoginPage,
});

const ROLES: { role: Role; title: string; blurb: string; icon: typeof User; points: string[] }[] = [
  {
    role: "employee",
    title: "Employee",
    blurb: "View your profile, development plan and competency growth.",
    icon: User,
    points: ["My competency profile", "AI development roadmap", "Mentor & training schedule"],
  },
  {
    role: "hr",
    title: "HR Manager",
    blurb: "Manage talent pools, success profiles and organisation-wide readiness.",
    icon: Users,
    points: ["Talent directory & analytics", "Success profile library", "IDP governance"],
  },
  {
    role: "committee",
    title: "Succession Planning Committee",
    blurb: "Evaluate slates, compare candidates and approve successor decisions.",
    icon: ShieldCheck,
    points: ["9-box calibration", "Candidate comparison", "Board-ready reports"],
  },
];

function LoginPage() {
  const { login, session, hydrated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (hydrated && session) navigate({ to: "/dashboard", replace: true });
  }, [hydrated, session, navigate]);

  const signIn = (role: Role) => {
    login(role);
    navigate({ to: "/dashboard" });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="grid min-h-screen lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <section className="relative flex flex-col justify-between overflow-hidden bg-sidebar p-8 text-sidebar-foreground lg:p-12">
          <div className="pointer-events-none absolute -right-24 -top-24 size-80 rounded-full bg-sidebar-primary/25 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-32 -left-16 size-96 rounded-full bg-info/20 blur-3xl" />
          <div className="relative flex items-center gap-3">
            <span className="grid size-11 place-items-center rounded-xl bg-sidebar-primary">
              <Zap className="size-6 text-sidebar-primary-foreground" />
            </span>
            <div>
              <p className="text-sm font-semibold tracking-wide">POWERGRID</p>
              <p className="text-xs text-sidebar-foreground/70">Power Grid Corporation of India Limited</p>
            </div>
          </div>

          <div className="relative mt-12 max-w-lg">
            <span className="inline-flex items-center gap-2 rounded-full border border-sidebar-border bg-sidebar-accent px-3 py-1 text-xs font-medium">
              <Sparkles className="size-3.5" /> AI-Powered Talent Intelligence
            </span>
            <h1 className="mt-5 text-3xl font-semibold leading-tight tracking-tight lg:text-4xl">
              Succession Planning &amp; Leadership Development System
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-sidebar-foreground/80">
              Identify successors for critical leadership positions, quantify competency gaps against validated success
              profiles, and generate individual development plans with measurable readiness outcomes.
            </p>
            <dl className="mt-8 grid grid-cols-3 gap-4">
              {[
                { k: "1,842", v: "Executives mapped" },
                { k: "126", v: "Critical positions" },
                { k: "94%", v: "Bench coverage" },
              ].map((s) => (
                <div key={s.v} className="rounded-xl border border-sidebar-border bg-sidebar-accent/60 p-3">
                  <dt className="text-xl font-semibold">{s.k}</dt>
                  <dd className="mt-1 text-[11px] text-sidebar-foreground/70">{s.v}</dd>
                </div>
              ))}
            </dl>
          </div>

          <p className="relative mt-12 text-[11px] text-sidebar-foreground/55">
            Government of India Enterprise · Maharatna CPSU · Internal use only
          </p>
        </section>

        <section className="flex items-center justify-center p-6 lg:p-12">
          <div className="w-full max-w-xl">
            <h2 className="text-2xl font-semibold tracking-tight">Sign in to continue</h2>
            <p className="mt-1 text-sm text-muted-foreground">Select your role to access the corresponding workspace.</p>

            <div className="mt-6 space-y-4">
              {ROLES.map((r) => (
                <div key={r.role} className="surface-card grid-lift p-5">
                  <div className="grid grid-cols-[auto_minmax(0,1fr)] items-start gap-4">
                    <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary-soft text-primary">
                      <r.icon className="size-5" />
                    </span>
                    <div className="min-w-0">
                      <p className="font-semibold text-foreground">{r.title}</p>
                      <p className="mt-0.5 text-sm text-muted-foreground">{r.blurb}</p>
                      <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                        {r.points.map((p) => (
                          <li key={p} className="flex items-center gap-1.5">
                            <span className="size-1.5 rounded-full bg-primary" /> {p}
                          </li>
                        ))}
                      </ul>
                      <Button className="mt-4 w-full sm:w-auto" onClick={() => signIn(r.role)}>
                        Continue as {r.title}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <Boxes className="size-3.5" /> 9-Box calibration
              </span>
              <span className="inline-flex items-center gap-1.5">
                <BarChart3 className="size-3.5" /> Competency analytics
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Sparkles className="size-3.5" /> AI-generated IDPs
              </span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
