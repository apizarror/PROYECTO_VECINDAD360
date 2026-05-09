"use client";

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";

interface User {
  id: string;
  username: string;
  nombre: string;
  apellidos: string;
  email: string;
  dni: string;
  telefono: string;
  fechaIngreso: string;
  rol: "SUPER_ADMIN" | "ADMIN_CONDOMINIO" | "EMPLEADO";
  avatar: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const USERS: Record<string, { password: string; user: User }> = {
  admin: {
    password: "admin123",
    user: {
      id: "admin-001",
      username: "admin",
      nombre: "Carlos",
      apellidos: "Mendoza",
      email: "admin@vecindad360.pe",
      dni: "45678901",
      telefono: "+51 999555666",
      fechaIngreso: "15/08/2023",
      rol: "SUPER_ADMIN",
      avatar: "CM",
    },
  },
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  login: async () => false,
  logout: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("vecindad360_user");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {}
    }
  }, []);

  const login = useCallback(async (username: string, password: string) => {
    const entry = USERS[username.toLowerCase()];
    if (!entry || entry.password !== password) return false;

    setUser(entry.user);
    localStorage.setItem("vecindad360_user", JSON.stringify(entry.user));
    return true;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem("vecindad360_user");
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
