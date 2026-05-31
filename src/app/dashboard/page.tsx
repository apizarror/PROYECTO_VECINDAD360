"use client";

import { useMemo } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  Users,
  DoorOpen,
  Loader2,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { HeaderPage } from "@/components/dashboard/header-page";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useApiList } from "@/hooks/use-api";
import type { Rol } from "@/lib/permissions";

// Types matching Prisma models
interface Persona {
  id: string;
  saldo: number;
  nombres: string;
  apellidos: string;
  vinculaciones?: { inmueble?: { numero: string } }[];
}

interface Visita {
  id: string;
  estado: string;
  fechaHoraIngreso: string;
}

interface Incidencia {
  id: string;
  estado: string;
}

interface Reserva {
  id: string;
  fecha: string;
  horaInicio: string;
  horaFin: string;
  areaComun?: { nombre: string };
  inmueble?: { numero: string };
}

interface Ingreso {
  id: string;
  monto: number;
  fecha: string;
}

interface Egreso {
  id: string;
  monto: number;
  categoria: string;
  fechaRegistro: string;
}

interface CuentaBancaria {
  id: string;
  saldoActual: number;
}

const COLORS = ["#F97316", "#3B82F6", "#22C55E", "#8B5CF6", "#EF4444", "#06B6D4"];

export default function DashboardPage() {
  const { user } = useAuth();
  const rol = (user?.rol || "ADMIN_CONDOMINIO") as Rol;

  // Fetch data based on role
  const { data: personas = [], isLoading: loadingPersonas } = useApiList<Persona>("personas");
  const { data: visitas = [], isLoading: loadingVisitas } = useApiList<Visita>("visitas");
  const { data: incidencias = [] } = useApiList<Incidencia>("incidencias");
  const { data: reservas = [] } = useApiList<Reserva>("reservas");
  const { data: ingresos = [] } = useApiList<Ingreso>("ingresos");
  const { data: egresos = [] } = useApiList<Egreso>("egresos");
  const { data: cuentas = [] } = useApiList<CuentaBancaria>("cuentas-bancarias");

  const isLoading = loadingPersonas || loadingVisitas;

  // Computed KPIs
  const saldoTotal = useMemo(
    () => cuentas.reduce((sum, c) => sum + c.saldoActual, 0),
    [cuentas]
  );

  const now = new Date();
  const mesActual = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

  const ingresosMes = useMemo(
    () => ingresos.filter((i) => i.fecha?.startsWith(mesActual)).reduce((sum, i) => sum + i.monto, 0),
    [ingresos, mesActual]
  );

  const egresosMes = useMemo(
    () => egresos.filter((e) => e.fechaRegistro?.startsWith(mesActual)).reduce((sum, e) => sum + e.monto, 0),
    [egresos, mesActual]
  );

  const montoVencido = useMemo(
    () => personas.filter((p) => p.saldo < 0).reduce((sum, p) => sum + Math.abs(p.saldo), 0),
    [personas]
  );

  const visitasActivas = useMemo(
    () => visitas.filter((v) => v.estado === "En curso" || v.estado === "Programada").length,
    [visitas]
  );

  const visitasMes = useMemo(
    () => visitas.filter((v) => v.fechaHoraIngreso?.startsWith(mesActual)).length,
    [visitas, mesActual]
  );

  const incidenciasAbiertas = useMemo(
    () => incidencias.filter((i) => i.estado === "Abierta" || i.estado === "En Progreso").length,
    [incidencias]
  );

  const topMorosos = useMemo(
    () =>
      personas
        .filter((p) => p.saldo < 0)
        .sort((a, b) => a.saldo - b.saldo)
        .slice(0, 5)
        .map((p) => ({
          nombre: `${p.nombres} ${p.apellidos}`,
          inmueble: p.vinculaciones?.[0]?.inmueble?.numero
            ? `Dpto ${p.vinculaciones[0].inmueble.numero}`
            : "-",
          monto: Math.abs(p.saldo),
        })),
    [personas]
  );

  const proximasReservas = useMemo(
    () =>
      reservas
        .filter((r) => r.fecha >= now.toISOString().split("T")[0])
        .sort((a, b) => a.fecha.localeCompare(b.fecha))
        .slice(0, 5),
    [reservas, now]
  );

  // Chart data: group egresos by category
  const egresosChart = useMemo(() => {
    const byCat: Record<string, number> = {};
    egresos.forEach((e) => {
      byCat[e.categoria] = (byCat[e.categoria] || 0) + e.monto;
    });
    return Object.entries(byCat).map(([categoria, monto], i) => ({
      categoria,
      monto,
      fill: COLORS[i % COLORS.length],
    }));
  }, [egresos]);

  // Chart data: ingresos vs egresos last 6 months
  const ingresosEgresosChart = useMemo(() => {
    const months: Record<string, { ingresos: number; egresos: number }> = {};
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      const label = d.toLocaleDateString("es-PE", { month: "short", year: "2-digit" });
      months[key] = { ingresos: 0, egresos: 0 };
      // Store label mapping
      (months[key] as Record<string, unknown>)._label = label;
    }
    ingresos.forEach((i) => {
      const key = i.fecha?.slice(0, 7);
      if (key && months[key]) months[key].ingresos += i.monto;
    });
    egresos.forEach((e) => {
      const key = e.fechaRegistro?.slice(0, 7);
      if (key && months[key]) months[key].egresos += e.monto;
    });
    return Object.entries(months).map(([, v]) => ({
      mes: (v as Record<string, unknown>)._label as string,
      ingresos: v.ingresos,
      egresos: v.egresos,
    }));
  }, [ingresos, egresos, now]);

  const fmt = (n: number) => `S/ ${n.toLocaleString("es-PE", { minimumFractionDigits: 2 })}`;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    );
  }

  // ─── EMPLEADO dashboard (simplified) ─────────────────────
  if (rol === "EMPLEADO") {
    return (
      <>
        <HeaderPage icon={LayoutDashboard} title="Dashboard" subtitle="Resumen de tu turno" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <KpiCard label="Visitas Activas" value={String(visitasActivas)} icon={Users} />
          <KpiCard label="Visitas del Mes" value={String(visitasMes)} icon={DoorOpen} />
          <KpiCard label="Incidencias Abiertas" value={String(incidenciasAbiertas)} icon={AlertCircle} variant="negative" />
        </div>
      </>
    );
  }

  // ─── RESIDENTE dashboard (simplified) ────────────────────
  if (rol === "RESIDENTE") {
    return (
      <>
        <HeaderPage icon={LayoutDashboard} title="Mi Condominio" subtitle="Resumen de tu unidad" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <KpiCard label="Próximas Reservas" value={String(proximasReservas.length)} icon={DoorOpen} />
          <KpiCard label="Incidencias Abiertas" value={String(incidenciasAbiertas)} icon={AlertCircle} variant="negative" />
        </div>
        {proximasReservas.length > 0 && (
          <div className="bg-white rounded-2xl border border-surface-200 shadow-sm">
            <div className="flex items-center justify-between p-5 border-b border-surface-100">
              <h3 className="font-bold text-surface-800">Próximas Reservas</h3>
            </div>
            <div className="p-5 space-y-4">
              {proximasReservas.map((r) => (
                <div key={r.id} className="flex items-start gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-50 text-primary-600 flex-shrink-0">
                    <span className="text-xs font-bold">{r.fecha.split("-")[2]}</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-surface-800">{r.areaComun?.nombre}</p>
                    <p className="text-xs text-surface-500">{r.fecha} · {r.horaInicio} - {r.horaFin}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </>
    );
  }

  // ─── ADMIN_CONDOMINIO dashboard (full) ───────────────────
  return (
    <>
      <HeaderPage icon={LayoutDashboard} title="Dashboard" subtitle="Resumen general de tu condominio" />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KpiCard label="Saldo Actual" value={fmt(saldoTotal)} />
        <KpiCard label="Ingresos del Mes" value={fmt(ingresosMes)} icon={TrendingUp} variant="positive" />
        <KpiCard label="Egresos del Mes" value={fmt(egresosMes)} icon={TrendingDown} variant="negative" />
        <KpiCard label="Monto Vencido" value={fmt(montoVencido)} icon={AlertCircle} variant="negative" />
      </div>

      {/* Visitas + Incidencias */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <KpiCard label="Visitas Activas" value={String(visitasActivas)} icon={Users} />
        <KpiCard label="Visitas del Mes" value={String(visitasMes)} icon={DoorOpen} />
        <KpiCard label="Incidencias Abiertas" value={String(incidenciasAbiertas)} icon={AlertCircle} variant="negative" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Morosos */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-surface-200 shadow-sm">
          <div className="flex items-center justify-between p-5 border-b border-surface-100">
            <h3 className="font-bold text-surface-800">Top Morosos</h3>
            <Link href="/dashboard/residentes">
              <Button variant="ghost" size="sm">Ver todos</Button>
            </Link>
          </div>
          {topMorosos.length === 0 ? (
            <p className="p-5 text-sm text-surface-400">No hay deudas pendientes</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-xs font-medium text-surface-500 uppercase tracking-wider">
                    <th className="px-5 py-3">Nombre</th>
                    <th className="px-5 py-3">Inmueble</th>
                    <th className="px-5 py-3 text-right">Monto Vencido</th>
                  </tr>
                </thead>
                <tbody>
                  {topMorosos.map((m, i) => (
                    <tr key={i} className="border-t border-surface-50 hover:bg-surface-50 transition-colors">
                      <td className="px-5 py-3 text-sm font-medium text-surface-800">{m.nombre}</td>
                      <td className="px-5 py-3 text-sm text-surface-600">{m.inmueble}</td>
                      <td className="px-5 py-3 text-sm font-semibold text-red-600 text-right">{fmt(m.monto)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Próximas Reservas */}
        <div className="bg-white rounded-2xl border border-surface-200 shadow-sm">
          <div className="flex items-center justify-between p-5 border-b border-surface-100">
            <h3 className="font-bold text-surface-800">Próximas Reservas</h3>
            <Link href="/dashboard/areas-comunes/reservas">
              <Button variant="ghost" size="sm">Ver todas</Button>
            </Link>
          </div>
          <div className="p-5 space-y-4">
            {proximasReservas.length === 0 ? (
              <p className="text-sm text-surface-400">Sin reservas próximas</p>
            ) : (
              proximasReservas.map((r) => (
                <div key={r.id} className="flex items-start gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-50 text-primary-600 flex-shrink-0">
                    <span className="text-xs font-bold">{r.fecha.split("-")[2]}</span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-surface-800">{r.areaComun?.nombre}</p>
                    <p className="text-xs text-surface-500">{r.fecha} · {r.horaInicio} - {r.horaFin}</p>
                    <p className="text-xs text-surface-400">Dpto {r.inmueble?.numero}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mt-6">
        <div className="lg:col-span-3 bg-white rounded-2xl border border-surface-200 shadow-sm p-5">
          <h3 className="font-bold text-surface-800 mb-4">Ingresos vs Egresos — Últimos 6 meses</h3>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ingresosEgresosChart} barGap={8}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="mes" tick={{ fontSize: 12, fill: "#64748B" }} />
                <YAxis tick={{ fontSize: 12, fill: "#64748B" }} tickFormatter={(v) => `S/ ${(v / 1000).toFixed(0)}k`} />
                <Tooltip formatter={(v) => [`S/ ${Number(v).toLocaleString()}`, ""]} />
                <Legend />
                <Bar dataKey="ingresos" name="Ingresos" fill="#22C55E" radius={[4, 4, 0, 0]} />
                <Bar dataKey="egresos" name="Egresos" fill="#EF4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        {egresosChart.length > 0 && (
          <div className="lg:col-span-2 bg-white rounded-2xl border border-surface-200 shadow-sm p-5">
            <h3 className="font-bold text-surface-800 mb-4">Distribución de Egresos</h3>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={egresosChart} dataKey="monto" nameKey="categoria" cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={3}>
                    {egresosChart.map((d, i) => <Cell key={i} fill={d.fill} />)}
                  </Pie>
                  <Tooltip formatter={(v) => [`S/ ${Number(v).toLocaleString()}`, ""]} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

// ─── Shared KPI Card ───────────────────────────────────────
function KpiCard({
  label,
  value,
  icon: Icon,
  variant,
}: {
  label: string;
  value: string;
  icon?: React.ComponentType<{ className?: string }>;
  variant?: "positive" | "negative" | "default";
}) {
  return (
    <div
      className={`bg-white rounded-2xl border border-surface-200 p-5 shadow-sm ${
        variant === "positive"
          ? "border-l-4 border-l-green-500"
          : variant === "negative"
          ? "border-l-4 border-l-red-500"
          : ""
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-medium text-surface-500 uppercase tracking-wider">{label}</p>
        {Icon && (
          <Icon
            className={`h-4 w-4 ${
              variant === "positive" ? "text-green-500" : variant === "negative" ? "text-red-500" : "text-surface-400"
            }`}
          />
        )}
      </div>
      <p
        className={`text-2xl font-extrabold tabular-nums ${
          variant === "positive"
            ? "text-green-600"
            : variant === "negative"
            ? "text-red-600"
            : "text-surface-800"
        }`}
      >
        {value}
      </p>
    </div>
  );
}
