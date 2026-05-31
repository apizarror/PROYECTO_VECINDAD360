"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Topbar } from "@/components/dashboard/topbar";
import { useAuth } from "@/hooks/use-auth";
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
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/auth");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-surface-50">
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
    </div>
  );
}
