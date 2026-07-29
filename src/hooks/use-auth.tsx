import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Role } from "@/types";
import { employees } from "@/data/mockData";

const STORAGE_KEY = "pg-succession-session";

export interface Session {
  role: Role;
  name: string;
  employeeId: string;
}

export const ROLE_LABEL: Record<Role, string> = {
  employee: "Employee",
  hr: "HR Manager",
  committee: "Succession Planning Committee",
};

interface AuthValue {
  session: Session | null;
  hydrated: boolean;
  login: (role: Role) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setSession(JSON.parse(raw) as Session);
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  const login = useCallback((role: Role) => {
    const next: Session =
      role === "employee"
        ? { role, name: employees[0].name, employeeId: employees[0].id }
        : role === "hr"
          ? { role, name: "Meera Krishnan", employeeId: employees[1].id }
          : { role, name: "Dr. Anil Raghavan", employeeId: employees[2].id };
    setSession(next);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }, []);

  const logout = useCallback(() => {
    setSession(null);
    window.localStorage.removeItem(STORAGE_KEY);
  }, []);

  const value = useMemo(() => ({ session, hydrated, login, logout }), [session, hydrated, login, logout]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
