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
  loginWithCredentials: (employeeId: string, password: string) => Promise<{ success: boolean; error?: string; role?: Role }>;
  logout: () => void;
}

const AuthContext = createContext<AuthValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Session;
        // Validate that the session is valid
        if (parsed && parsed.role && parsed.employeeId) {
          setSession(parsed);
        } else {
          window.localStorage.removeItem(STORAGE_KEY);
        }
      }
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  const login = useCallback((role: Role) => {
    const emp = employees.find((e) => e.id === "E001") ?? employees[0];
    const next: Session =
      role === "employee"
        ? { role, name: emp.name, employeeId: emp.id }
        : role === "hr"
          ? { role, name: "Meera Krishnan (CGM HR)", employeeId: employees[1]?.id ?? "E002" }
          : { role, name: "Dr. Anil Raghavan (Committee)", employeeId: employees[2]?.id ?? "E003" };
    setSession(next);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }, []);

  const loginWithCredentials = useCallback(async (employeeId: string, password: string) => {
    const id = employeeId.trim().toUpperCase();
    const pass = password.trim();

    if (!id) return { success: false, error: "Please enter your Employee ID." };
    if (!pass) return { success: false, error: "Please enter your password." };

    // Role mapping based on Employee ID pattern
    let role: Role = "employee";
    let name = "Executive User";
    let empId = "E001";

    if (id.startsWith("HR") || id === "HR001") {
      role = "hr";
      name = "Meera Krishnan (CGM HR)";
      empId = "E002";
    } else if (id.startsWith("COM") || id.startsWith("SEC") || id === "COM001") {
      role = "committee";
      name = "Dr. Anil Raghavan (Committee Chair)";
      empId = "E003";
    } else {
      role = "employee";
      const matched = employees.find((e) => e.id.toUpperCase() === id || e.employeeId.toUpperCase() === id);
      name = matched?.name ?? "Arjun Sharma";
      empId = matched?.id ?? "E001";
    }

    // Password validation check
    const validPasswords = ["emp@123", "hr@123", "com@123", "password123", "powergrid123", "admin123"];
    const isValid = validPasswords.includes(pass.toLowerCase()) || pass.length >= 6;

    if (!isValid) {
      return { success: false, error: "Invalid Employee ID or Password." };
    }

    const next: Session = { role, name, employeeId: empId };
    setSession(next);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));

    return { success: true, role };
  }, []);

  const logout = useCallback(() => {
    setSession(null);
    window.localStorage.removeItem(STORAGE_KEY);
  }, []);

  const value = useMemo(
    () => ({ session, hydrated, login, loginWithCredentials, logout }),
    [session, hydrated, login, loginWithCredentials, logout],
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
