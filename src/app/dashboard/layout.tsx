"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Topbar } from "@/components/dashboard/topbar";
import { TrialOverlay } from "@/components/dashboard/trial-overlay";
import { AssistantChat } from "@/components/dashboard/assistant-chat";
import { useAuth } from "@/hooks/use-auth";
import { hasAccess, DEFAULT_ROUTE, type Rol } from "@/lib/permissions";
import { cn } from "@/lib/utils";

function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-50">
      <div className="text-center space-y-3">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary-600 text-white font-extrabold text-lg animate-pulse">
          V3
        </div>
        <p className="text-surface-400 text-sm">Cargando...</p>
      </div>
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAuthenticated, isLoading, trialExpired } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      router.replace("/auth");
      return;
    }

    const rol = (user?.rol || "ADMIN_CONDOMINIO") as Rol;

    // Redirigir /dashboard al destino correcto según rol
    if (pathname === "/dashboard" && rol === "SUPER_ADMIN") {
      router.replace(DEFAULT_ROUTE[rol]);
      return;
    }

    // Proteger rutas: si no tiene acceso, redirigir a su ruta por defecto
    if (!hasAccess(rol, pathname)) {
      router.replace(DEFAULT_ROUTE[rol]);
    }
  }, [isAuthenticated, isLoading, user, pathname, router]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-surface-50">
      {trialExpired && <TrialOverlay />}
      <Sidebar
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed(!collapsed)}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />
      <Topbar
        collapsed={collapsed}
        onToggleMobile={() => setMobileOpen(true)}
      />
      <main
        className={cn(
          "transition-all duration-300 pt-[60px] min-h-screen",
          collapsed ? "md:ml-[72px]" : "md:ml-[290px]"
        )}
      >
        <div className="p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto">
          {children}
        </div>
      </main>
      <AssistantChat />
    </div>
  );
}
