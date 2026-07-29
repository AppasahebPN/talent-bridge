import { useEffect, useState } from "react";
import { Outlet, createFileRoute, useNavigate } from "@tanstack/react-router";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { AppNavbar } from "@/components/layout/app-navbar";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/_app")({
  component: AppLayout,
});

function AppLayout() {
  const { session, hydrated } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (hydrated && !session) navigate({ to: "/", replace: true });
  }, [hydrated, session, navigate]);

  if (!hydrated || !session) {
    return (
      <div className="grid min-h-screen place-items-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AppSidebar open={open} onClose={() => setOpen(false)} />
      <div className="lg:pl-64">
        <AppNavbar onMenu={() => setOpen(true)} />
        <main className="mx-auto w-full max-w-[1500px] p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
