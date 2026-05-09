"use client";

import { LayoutDashboard, TrendingUp, TrendingDown, AlertCircle, Users, DoorOpen } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { HeaderPage } from "@/components/dashboard/header-page";
import { Button } from "@/components/ui/button";

const kpiData = [
  { label: "Saldo Actual", value: "S/ 24,580.00", variant: "default" as const, icon: null },
  { label: "Ingresos del Mes", value: "S/ 8,320.00", variant: "positive" as const, icon: TrendingUp },
  { label: "Egresos del Mes", value: "S/ 3,150.00", variant: "negative" as const, icon: TrendingDown },
  { label: "Monto Vencido", value: "S/ 2,480.00", variant: "negative" as const, icon: AlertCircle },
];

const visitasKpi = [
  { label: "Visitas Activas", value: "4", icon: Users },
  { label: "Visitas del Mes", value: "127", icon: DoorOpen },
];

const topMorosos = [
  { dni: "12345678", nombre: "Luis García", inmueble: "Dpto 302", monto: "S/ 1,250.00" },
  { dni: "87654321", nombre: "María Torres", inmueble: "Dpto 105", monto: "S/ 980.00" },
  { dni: "45678901", nombre: "Jorge Mendoza", inmueble: "Dpto 501", monto: "S/ 750.00" },
  { dni: "23456789", nombre: "Ana Quispe", inmueble: "Dpto 203", monto: "S/ 640.00" },
  { dni: "34567890", nombre: "Pedro Sánchez", inmueble: "Dpto 404", monto: "S/ 520.00" },
];

const proximasReservas = [
  { area: "Parrilla", fecha: "10 May 2026", hora: "18:00 - 22:00", residente: "Dpto 302" },
  { area: "Salón de Eventos", fecha: "12 May 2026", hora: "14:00 - 20:00", residente: "Dpto 501" },
  { area: "Piscina", fecha: "15 May 2026", hora: "10:00 - 14:00", residente: "Dpto 105" },
];

const incidenciasAbiertas = 7;

const ingresosEgresosData = [
  { mes: "Nov 25", ingresos: 4200, egresos: 3150 },
  { mes: "Dic 25", ingresos: 3800, egresos: 4200 },
  { mes: "Ene 26", ingresos: 4500, egresos: 3800 },
  { mes: "Feb 26", ingresos: 4100, egresos: 3500 },
  { mes: "Mar 26", ingresos: 4800, egresos: 3900 },
  { mes: "Abr 26", ingresos: 5200, egresos: 4100 },
];

const egresosData = [
  { categoria: "Mantenimiento", monto: 8200, fill: "#F97316" },
  { categoria: "Personal", monto: 16000, fill: "#3B82F6" },
  { categoria: "Servicios Básicos", monto: 3200, fill: "#22C55E" },
  { categoria: "Administrativos", monto: 1608, fill: "#8B5CF6" },
  { categoria: "Fondos", monto: 900, fill: "#EF4444" },
];

export default function DashboardPage() {
  return (
    <>
      <HeaderPage
        icon={LayoutDashboard}
        title="Dashboard"
        subtitle="Resumen general de tu condominio"
      />

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {kpiData.map((kpi) => (
          <div
            key={kpi.label}
            className={`bg-white rounded-2xl border border-surface-200 p-5 shadow-sm ${
              kpi.variant === "positive"
                ? "border-l-4 border-l-green-500"
                : kpi.variant === "negative"
                ? "border-l-4 border-l-red-500"
                : ""
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-medium text-surface-500 uppercase tracking-wider">
                {kpi.label}
              </p>
              {kpi.icon && (
                <kpi.icon
                  className={`h-4 w-4 ${
                    kpi.variant === "positive" ? "text-green-500" : "text-red-500"
                  }`}
                />
              )}
            </div>
            <p
              className={`text-2xl font-extrabold tabular-nums ${
                kpi.variant === "positive"
                  ? "text-green-600"
                  : kpi.variant === "negative"
                  ? "text-red-600"
                  : "text-surface-800"
              }`}
            >
              {kpi.value}
            </p>
          </div>
        ))}
      </div>

      {/* Visit KPIs + Incidencias */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {visitasKpi.map((v) => (
          <div key={v.label} className="bg-white rounded-2xl border border-surface-200 p-5 shadow-sm flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
              <v.icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-surface-500 uppercase tracking-wider">{v.label}</p>
              <p className="text-2xl font-extrabold text-surface-800 tabular-nums">{v.value}</p>
            </div>
          </div>
        ))}
        <div className="bg-white rounded-2xl border border-surface-200 p-5 shadow-sm flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-500">
            <AlertCircle className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-surface-500 uppercase tracking-wider">Incidencias Abiertas</p>
            <p className="text-2xl font-extrabold text-red-600 tabular-nums">{incidenciasAbiertas}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Morosos */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-surface-200 shadow-sm">
          <div className="flex items-center justify-between p-5 border-b border-surface-100">
            <h3 className="font-bold text-surface-800">Top Morosos</h3>
            <Button variant="ghost" size="sm">
              Ver todos
            </Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs font-medium text-surface-500 uppercase tracking-wider">
                  <th className="px-5 py-3">DNI</th>
                  <th className="px-5 py-3">Nombre</th>
                  <th className="px-5 py-3">Inmueble</th>
                  <th className="px-5 py-3 text-right">Monto Vencido</th>
                </tr>
              </thead>
              <tbody>
                {topMorosos.map((m, i) => (
                  <tr key={i} className="border-t border-surface-50 hover:bg-surface-50 transition-colors">
                    <td className="px-5 py-3 text-sm text-surface-600">{m.dni}</td>
                    <td className="px-5 py-3 text-sm font-medium text-surface-800">{m.nombre}</td>
                    <td className="px-5 py-3 text-sm text-surface-600">{m.inmueble}</td>
                    <td className="px-5 py-3 text-sm font-semibold text-red-600 text-right">{m.monto}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Próximas Reservas */}
        <div className="bg-white rounded-2xl border border-surface-200 shadow-sm">
          <div className="flex items-center justify-between p-5 border-b border-surface-100">
            <h3 className="font-bold text-surface-800">Próximas Reservas</h3>
            <Button variant="ghost" size="sm">
              Ver todas
            </Button>
          </div>
          <div className="p-5 space-y-4">
            {proximasReservas.map((r, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-50 text-primary-600 flex-shrink-0">
                  <span className="text-xs font-bold">{r.fecha.split(" ")[0]}</span>
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-surface-800">{r.area}</p>
                  <p className="text-xs text-surface-500">
                    {r.fecha} · {r.hora}
                  </p>
                  <p className="text-xs text-surface-400">{r.residente}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mt-6">
        <div className="lg:col-span-3 bg-white rounded-2xl border border-surface-200 shadow-sm p-5">
          <h3 className="font-bold text-surface-800 mb-4">Ingresos vs Egresos — Últimos 6 meses</h3>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ingresosEgresosData} barGap={8}>
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
        <div className="lg:col-span-2 bg-white rounded-2xl border border-surface-200 shadow-sm p-5">
          <h3 className="font-bold text-surface-800 mb-4">Distribución de Egresos</h3>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={egresosData} dataKey="monto" nameKey="categoria" cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={3}>
                  {egresosData.map((d, i) => <Cell key={i} fill={d.fill} />)}
                </Pie>
                <Tooltip formatter={(v) => [`S/ ${Number(v).toLocaleString()}`, ""]} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </>
  );
}
