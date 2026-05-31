"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Shield,
  Building2,
  Users,
  Home,
  Landmark,
  DollarSign,
  Clock,
  AlertTriangle,
  TrendingUp,
} from "lucide-react";
import { HeaderPage } from "@/components/dashboard/header-page";
import { useAuth } from "@/hooks/use-auth";
import { getBasePath } from "@/lib/base-path";

interface CondominioReciente {
  id: string;
  nombre: string;
  plan: string;
  createdAt: string;
  activo: boolean;
  _count: { users: number };
}

interface Metrics {
  totalCondominios: number;
  totalUsers: number;
  totalEdificios: number;
  totalInmuebles: number;
  totalPersonas: number;
  condominiosPorPlan: { plan: string; count: number }[];
  trialsActivos: number;
  trialsProximosAVencer: number;
  mrr: number;
  registrosUltimos30Dias: number;
  condominiosRecientes: CondominioReciente[];
}

const planColors: Record<string, string> = {
  TRIAL: "bg-yellow-50 text-yellow-700 border-yellow-200",
  BASICO: "bg-blue-50 text-blue-700 border-blue-200",
  PRO: "bg-purple-50 text-purple-700 border-purple-200",
  EMPRESARIAL: "bg-green-50 text-green-700 border-green-200",
};

const planBadgeColors: Record<string, string> = {
  TRIAL: "bg-yellow-100 text-yellow-700",
  BASICO: "bg-blue-100 text-blue-700",
  PRO: "bg-purple-100 text-purple-700",
  EMPRESARIAL: "bg-green-100 text-green-700",
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
          {/* Revenue & Trials KPI Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-5 shadow-sm text-white">
              <div className="flex items-center gap-3 mb-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20">
                  <DollarSign className="h-5 w-5" />
                </div>
                <p className="text-xs font-medium uppercase tracking-wider text-green-100">
                  MRR
                </p>
              </div>
              <p className="text-2xl font-extrabold tabular-nums">
                S/ {metrics.mrr.toLocaleString("es-PE")}
              </p>
              <p className="text-xs text-green-200 mt-1">Ingreso mensual recurrente</p>
            </div>

            <div className="bg-white rounded-2xl border border-surface-200 p-5 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-50 text-yellow-600">
                  <Clock className="h-5 w-5" />
                </div>
                <p className="text-xs font-medium text-surface-500 uppercase tracking-wider">
                  Trials Activos
                </p>
              </div>
              <p className="text-2xl font-extrabold text-surface-800 tabular-nums">
                {metrics.trialsActivos}
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-surface-200 p-5 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600">
                  <AlertTriangle className="h-5 w-5" />
                </div>
                <p className="text-xs font-medium text-surface-500 uppercase tracking-wider">
                  Trials por Vencer
                </p>
              </div>
              <p className="text-2xl font-extrabold text-surface-800 tabular-nums">
                {metrics.trialsProximosAVencer}
              </p>
              <p className="text-xs text-surface-400 mt-1">Proximos 7 dias</p>
            </div>

            <div className="bg-white rounded-2xl border border-surface-200 p-5 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <p className="text-xs font-medium text-surface-500 uppercase tracking-wider">
                  Registros 30d
                </p>
              </div>
              <p className="text-2xl font-extrabold text-surface-800 tabular-nums">
                {metrics.registrosUltimos30Dias}
              </p>
            </div>
          </div>

          {/* Platform KPI Cards */}
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
          <div className="bg-white rounded-2xl border border-surface-200 shadow-sm mb-6">
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

          {/* Condominios Recientes */}
          <div className="bg-white rounded-2xl border border-surface-200 shadow-sm">
            <div className="p-5 border-b border-surface-100 flex items-center justify-between">
              <h3 className="font-bold text-surface-800">
                Condominios Recientes
              </h3>
              <Link
                href="/dashboard/admin/condominios"
                className="text-sm text-primary-600 hover:text-primary-700 font-medium"
              >
                Ver todos
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-xs font-medium text-surface-500 uppercase tracking-wider bg-surface-50">
                    <th className="px-5 py-3">Nombre</th>
                    <th className="px-5 py-3">Plan</th>
                    <th className="px-5 py-3">Usuarios</th>
                    <th className="px-5 py-3">Estado</th>
                    <th className="px-5 py-3">Registrado</th>
                  </tr>
                </thead>
                <tbody>
                  {metrics.condominiosRecientes.map((c) => (
                    <tr
                      key={c.id}
                      className="border-t border-surface-50 hover:bg-surface-50 transition-colors"
                    >
                      <td className="px-5 py-3">
                        <Link
                          href={`/dashboard/admin/condominios/${c.id}`}
                          className="text-sm font-medium text-primary-600 hover:text-primary-700 hover:underline"
                        >
                          {c.nombre}
                        </Link>
                      </td>
                      <td className="px-5 py-3">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                            planBadgeColors[c.plan] || "bg-surface-100 text-surface-700"
                          }`}
                        >
                          {c.plan}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-sm text-surface-600 tabular-nums">
                        {c._count.users}
                      </td>
                      <td className="px-5 py-3">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                            c.activo
                              ? "bg-green-50 text-green-700"
                              : "bg-red-50 text-red-700"
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              c.activo ? "bg-green-500" : "bg-red-500"
                            }`}
                          />
                          {c.activo ? "Activo" : "Inactivo"}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-sm text-surface-400">
                        {new Date(c.createdAt).toLocaleDateString("es-PE")}
                      </td>
                    </tr>
                  ))}
                  {metrics.condominiosRecientes.length === 0 && (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-5 py-12 text-center text-surface-400"
                      >
                        No hay condominios registrados.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
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
