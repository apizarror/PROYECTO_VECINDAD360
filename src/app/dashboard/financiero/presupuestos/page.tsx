"use client";

import { useMemo } from "react";
import { BarChart3, Loader2 } from "lucide-react";
import { HeaderPage } from "@/components/dashboard/header-page";
import { useApiList } from "@/hooks/use-api";
import { cn } from "@/lib/utils";
import type { Presupuesto } from "@/types";

export default function PresupuestosPage() {
  const { data: presupuestos = [], isLoading } = useApiList<Presupuesto>("presupuestos");

  const totalPresupuestado = useMemo(() => presupuestos.reduce((s, p) => s + p.montoPresupuestado, 0), [presupuestos]);
  const totalEjecutado = useMemo(() => presupuestos.reduce((s, p) => s + p.montoEjecutado, 0), [presupuestos]);

  if (isLoading) {
    return (
      <>
        <HeaderPage icon={BarChart3} title="Presupuestos" subtitle="Cargando..." />
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
        </div>
      </>
    );
  }

  return (
    <>
      <HeaderPage icon={BarChart3} title="Presupuestos" subtitle="Presupuestos anuales por rubro · 2026">
        <div className="text-right">
          <p className="text-[10px] text-surface-400 uppercase">Total presupuestado</p>
          <p className="text-lg font-extrabold text-surface-800">S/ {totalPresupuestado.toLocaleString()}</p>
          <p className="text-xs text-surface-500">
            Ejecutado: S/ {totalEjecutado.toLocaleString()} ({totalPresupuestado > 0 ? Math.round((totalEjecutado / totalPresupuestado) * 100) : 0}%)
          </p>
        </div>
      </HeaderPage>

      <div className="space-y-4">
        {presupuestos.map((p) => (
          <div key={p.id} className="bg-white rounded-2xl border border-surface-200 shadow-sm p-5">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-surface-800">{p.rubroNombre}</h3>
                <p className="text-xs text-surface-400">{p.observaciones}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-surface-800">S/ {p.montoPresupuestado.toLocaleString()}</p>
                <p className="text-xs text-surface-400">presupuestado</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-1 h-3 bg-surface-100 rounded-full overflow-hidden">
                <div
                  className={cn("h-full rounded-full transition-all", p.avance > 80 ? "bg-red-500" : p.avance > 50 ? "bg-amber-500" : "bg-primary-500")}
                  style={{ width: `${p.avance}%` }}
                />
              </div>
              <span className="text-sm font-semibold text-surface-600 tabular-nums w-12 text-right">{p.avance}%</span>
            </div>
            <p className="text-xs text-surface-400 mt-2">Ejecutado: S/ {p.montoEjecutado.toLocaleString()}</p>
          </div>
        ))}
      </div>
    </>
  );
}
