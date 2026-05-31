"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface User {
  id: string;
  email: string;
  nombre: string;
  apellidos: string;
  dni: string;
  telefono: string;
  rol: "SUPER_ADMIN" | "ADMIN_CONDOMINIO" | "EMPLEADO";
  avatar: string;
  condominioId: string | null;
}

export interface Condominio {
  id: string;
  nombre: string;
  plan: string;
  trialEndsAt: string | null;
  modalidad: string;
}

export interface RegisterData {
  email: string;
  password: string;
  nombre: string;
  apellidos: string;
  dni: string;
  telefono?: string;
  condominioNombre: string;
}

interface AuthContextType {
  user: User | null;
  condominio: Condominio | null;
  trialExpired: boolean;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => Promise<void>;
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const AuthContext = createContext<AuthContextType>({
  user: null,
  condominio: null,
  trialExpired: false,
  isAuthenticated: false,
  isLoading: true,
  login: async () => false,
  register: async () => false,
  logout: async () => {},
});

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [condominio, setCondominio] = useState<Condominio | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check session on mount
  useEffect(() => {
    let cancelled = false;

    async function checkSession() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          if (!cancelled) {
            setUser(data.user ?? null);
            setCondominio(data.condominio ?? null);
          }
        }
      } catch {
        // not authenticated – ignore
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    checkSession();
    return () => {
      cancelled = true;
    };
  }, []);

  // Login -------------------------------------------------------------------
  const login = useCallback(async (email: string, password: string) => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) return false;

      const data = await res.json();
      setUser(data.user ?? null);
      setCondominio(data.condominio ?? null);
      return true;
    } catch {
      return false;
    }
  }, []);

  // Register ----------------------------------------------------------------
  const register = useCallback(async (data: RegisterData) => {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) return false;

      const json = await res.json();
      setUser(json.user ?? null);
      setCondominio(json.condominio ?? null);
      return true;
    } catch {
      return false;
    }
  }, []);

  // Logout ------------------------------------------------------------------
  const logout = useCallback(async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      // best-effort
    }
    setUser(null);
    setCondominio(null);
  }, []);

  // Trial check -------------------------------------------------------------
  const trialExpired =
    condominio?.trialEndsAt != null &&
    new Date(condominio.trialEndsAt) < new Date();

  return (
    <AuthContext.Provider
      value={{
        user,
        condominio,
        trialExpired,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useAuth() {
  return useContext(AuthContext);
}
