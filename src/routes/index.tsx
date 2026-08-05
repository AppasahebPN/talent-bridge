import { useState, useEffect } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AlertCircle, BarChart3, Boxes, KeyRound, Loader2, Lock, ShieldCheck, Sparkles, User, Users, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

const DEMO_CREDENTIALS: { role: Role; title: string; id: string; pass: string; badge: string; icon: typeof User }[] = [
  {
    role: "employee",
    title: "Employee",
    id: "EMP001",
    pass: "emp@123",
    badge: "Executive Portal",
    icon: User,
  },
  {
    role: "hr",
    title: "HR Manager",
    id: "HR001",
    pass: "hr@123",
    badge: "HR Talent Desk",
    icon: Users,
  },
  {
    role: "committee",
    title: "Succession Committee",
    id: "COM001",
    pass: "com@123",
    badge: "Committee Board",
    icon: ShieldCheck,
  },
];

function LoginPage() {
  const { loginWithCredentials, session, hydrated } = useAuth();
  const navigate = useNavigate();

  const [employeeId, setEmployeeId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (hydrated && session) {
      navigate({ to: "/dashboard", replace: true });
    }
  }, [hydrated, session, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!employeeId.trim()) {
      setError("Please enter your Employee ID.");
      return;
    }
    if (!password.trim()) {
      setError("Please enter your Password.");
      return;
    }

    setLoading(true);
    try {
      const res = await loginWithCredentials(employeeId, password);
      if (res.success) {
        navigate({ to: "/dashboard" });
      } else {
        setError(res.error ?? "Invalid Employee ID or Password.");
      }
    } catch {
      setError("Authentication failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAutofill = (id: string, pass: string) => {
    setEmployeeId(id);
    setPassword(pass);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="grid min-h-screen lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        {/* Left Branding Hero Section */}
        <section className="relative flex flex-col justify-between overflow-hidden bg-sidebar p-8 text-sidebar-foreground lg:p-12">
          <div className="pointer-events-none absolute -right-24 -top-24 size-80 rounded-full bg-sidebar-primary/25 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-32 -left-16 size-96 rounded-full bg-info/20 blur-3xl" />
          
          <div className="relative flex items-center gap-3">
            <span className="grid size-11 place-items-center rounded-xl bg-sidebar-primary shadow-lg shadow-sidebar-primary/30">
              <Zap className="size-6 text-sidebar-primary-foreground" />
            </span>
            <div>
              <p className="text-base font-bold tracking-wider">POWERGRID</p>
              <p className="text-xs text-sidebar-foreground/75 font-medium">Power Grid Corporation of India Limited</p>
            </div>
          </div>

          <div className="relative mt-12 max-w-lg">
            <span className="inline-flex items-center gap-2 rounded-full border border-sidebar-border bg-sidebar-accent/80 px-3.5 py-1 text-xs font-semibold text-sidebar-foreground">
              <Sparkles className="size-3.5 text-amber-400" /> SIH 2026 Innovation Challenge
            </span>
            <h1 className="mt-5 text-3xl font-bold leading-tight tracking-tight lg:text-4xl">
              AI-Powered Succession Planning &amp; Leadership Development
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-sidebar-foreground/80">
              Enterprise leadership intelligence platform for mapping critical positions, analyzing competency gaps, and automating individual development plans with measurable readiness outcomes.
            </p>
            
            <dl className="mt-8 grid grid-cols-3 gap-3">
              {[
                { k: "1,842", v: "Executives mapped" },
                { k: "126", v: "Critical positions" },
                { k: "94%", v: "Bench coverage" },
              ].map((s) => (
                <div key={s.v} className="rounded-xl border border-sidebar-border bg-sidebar-accent/60 p-3 text-center">
                  <dt className="text-xl font-bold">{s.k}</dt>
                  <dd className="mt-1 text-[11px] font-medium text-sidebar-foreground/70">{s.v}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="relative mt-12 flex items-center justify-between text-[11px] text-sidebar-foreground/60 border-t border-sidebar-border/40 pt-4">
            <p>Government of India Enterprise · Maharatna CPSU</p>
            <p>Internal Security Protocol</p>
          </div>
        </section>

        {/* Right Form Section */}
        <section className="flex items-center justify-center p-6 lg:p-12 bg-background">
          <div className="w-full max-w-md space-y-6">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-foreground">Enterprise Portal Login</h2>
              <p className="mt-1.5 text-sm text-muted-foreground">
                Enter your POWERGRID credentials to access your executive workspace.
              </p>
            </div>

            {/* Error Message Box */}
            {error ? (
              <div className="flex items-center gap-2.5 rounded-lg border border-destructive/40 bg-destructive/10 p-3.5 text-xs text-destructive font-medium animate-in fade-in">
                <AlertCircle className="size-4 shrink-0" />
                <span>{error}</span>
              </div>
            ) : null}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Employee ID</label>
                <div className="relative">
                  <User className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="e.g. EMP001, HR001, COM001"
                    value={employeeId}
                    onChange={(e) => setEmployeeId(e.target.value)}
                    className="pl-10 h-11 text-sm font-medium"
                    autoComplete="username"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Password</label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 h-11 text-sm font-medium"
                    autoComplete="current-password"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-11 text-sm font-semibold shadow-md transition-all mt-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" /> Authenticating...
                  </>
                ) : (
                  <>
                    <KeyRound className="mr-2 size-4" /> Sign In
                  </>
                )}
              </Button>
            </form>

            {/* Role Quick Selection / Demo Helpers */}
            <div className="rounded-xl border border-border/80 bg-muted/40 p-4 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Test Role Autofill</span>
                <span className="text-[10px] text-muted-foreground font-medium">Click to fill</span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {DEMO_CREDENTIALS.map((r) => (
                  <button
                    key={r.role}
                    type="button"
                    onClick={() => handleAutofill(r.id, r.pass)}
                    className="flex flex-col items-center justify-center rounded-lg border border-border bg-background p-2 text-center transition-colors hover:border-primary hover:bg-primary-soft/50 focus:outline-none"
                  >
                    <r.icon className="size-4 text-primary mb-1" />
                    <span className="text-xs font-semibold text-foreground">{r.title}</span>
                    <span className="text-[10px] text-muted-foreground">{r.id}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground pt-2">
              <span className="inline-flex items-center gap-1.5">
                <Boxes className="size-3.5" /> 9-Box Calibration
              </span>
              <span className="inline-flex items-center gap-1.5">
                <BarChart3 className="size-3.5" /> Competency Engine
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Sparkles className="size-3.5" /> AI IDPs
              </span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
