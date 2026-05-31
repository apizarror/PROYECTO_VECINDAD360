"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Shield, Building2, Users, Home, Landmark } from "lucide-react";
import { HeaderPage } from "@/components/dashboard/header-page";
import { useAuth } from "@/hooks/use-auth";
import { getBasePath } from "@/lib/base-path";

interface Metrics {
  totalCondominios: number;
  totalUsers: number;
  totalEdificios: number;
  totalInmuebles: number;
  totalPersonas: number;
  condominiosPorPlan: { plan: string; count: number }[];
}

const planColors: Record<string, string> = {
  TRIAL: "bg-yellow-50 text-yellow-700 border-yellow-200",
  BASICO: "bg-blue-50 text-blue-700 border-blue-200",
  PRO: "bg-purple-50 text-purple-700 border-purple-200",
  EMPRESARIAL: "bg-green-50 text-green-700 border-green-200",
};

export default function AdminDashboardPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && user?.rol !== "SUPER_ADMIN") {
      router.push("/dashboard");
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (user?.rol !== "SUPER_ADMIN") return;

    async function fetchMetrics() {
      try {
        const res = await fetch(`${getBasePath()}/api/admin/metricas`);
        if (res.ok) {
          setMetrics(await res.json());
        }
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    }

    fetchMetrics();
  }, [user]);

  if (isLoading || user?.rol !== "SUPER_ADMIN") return null;

  return (
    <>
      <HeaderPage
        icon={Shield}
        title="Panel Super Admin"
        subtitle="Vista general de la plataforma Vecindad360"
      />

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" />
        </div>
      ) : metrics ? (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-2xl border border-surface-200 p-5 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                  <Building2 className="h-5 w-5" />
                </div>
                <p className="text-xs font-medium text-surface-500 uppercase tracking-wider">
                  Total Condominios
                </p>
              </div>
              <p className="text-2xl font-extrabold text-surface-800 tabular-nums">
                {metrics.totalCondominios}
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-surface-200 p-5 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <Users className="h-5 w-5" />
                </div>
                <p className="text-xs font-medium text-surface-500 uppercase tracking-wider">
                  Total Usuarios
                </p>
              </div>
              <p className="text-2xl font-extrabold text-surface-800 tabular-nums">
                {metrics.totalUsers}
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-surface-200 p-5 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-600">
                  <Landmark className="h-5 w-5" />
                </div>
                <p className="text-xs font-medium text-surface-500 uppercase tracking-wider">
                  Total Edificios
                </p>
              </div>
              <p className="text-2xl font-extrabold text-surface-800 tabular-nums">
                {metrics.totalEdificios}
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-surface-200 p-5 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                  <Home className="h-5 w-5" />
                </div>
                <p className="text-xs font-medium text-surface-500 uppercase tracking-wider">
                  Total Inmuebles
                </p>
              </div>
              <p className="text-2xl font-extrabold text-surface-800 tabular-nums">
                {metrics.totalInmuebles}
              </p>
            </div>
          </div>

          {/* Plan Breakdown */}
          <div className="bg-white rounded-2xl border border-surface-200 shadow-sm">
            <div className="p-5 border-b border-surface-100">
              <h3 className="font-bold text-surface-800">
                Condominios por Plan
              </h3>
            </div>
            <div className="p-5">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {metrics.condominiosPorPlan.map((item) => (
                  <div
                    key={item.plan}
                    className={`rounded-xl border p-4 text-center ${
                      planColors[item.plan] || "bg-surface-50 text-surface-700 border-surface-200"
                    }`}
                  >
                    <p className="text-sm font-semibold mb-1">{item.plan}</p>
                    <p className="text-3xl font-extrabold tabular-nums">
                      {item.count}
                    </p>
                  </div>
                ))}
                {metrics.condominiosPorPlan.length === 0 && (
                  <p className="col-span-4 text-center text-surface-400 py-4">
                    No hay condominios registrados aun.
                  </p>
                )}
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-20 text-surface-400">
          Error al cargar las metricas.
        </div>
      )}
    </>
  );
}
