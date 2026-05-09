"use client";

import { useState, useMemo } from "react";
import { Wrench, Search } from "lucide-react";
import { HeaderPage } from "@/components/dashboard/header-page";
import { cargosServicio } from "@/lib/mock-data/servicios";
import { cn } from "@/lib/utils";

const periodos = ["Todos", "2026-05", "2026-04", "2026-03"];
const servicios = ["Todos", "Agua", "Luz Áreas Comunes"];

export default function CargosServicioPage() {
  const [search, setSearch] = useState("");
  const [periodoFilter, setPeriodoFilter] = useState("Todos");
  const [servicioFilter, setServicioFilter] = useState("Todos");

  const filtered = useMemo(() => {
    let items = [...cargosServicio];
    if (search) {
      const q = search.toLowerCase();
      items = items.filter((c) => c.inmuebleLabel.toLowerCase().includes(q));
    }
    if (periodoFilter !== "Todos") items = items.filter((c) => c.periodo === periodoFilter);
    if (servicioFilter !== "Todos") items = items.filter((c) => c.servicioNombre === servicioFilter);
    return items;
  }, [search, periodoFilter, servicioFilter]);

  const total = useMemo(() => filtered.reduce((s, c) => s + c.monto, 0), [filtered]);

  return (
    <>
      <HeaderPage icon={Wrench} title="Cargos por Servicio" subtitle="Lecturas y cargos mensuales por inmueble" />

      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-surface-400" />
          <input
            type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar inmueble..."
            className="w-full sm:max-w-xs pl-10 pr-4 py-2.5 rounded-xl border border-surface-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20"
          />
        </div>
        <div className="flex gap-1 p-1 bg-surface-100 rounded-xl flex-wrap">
          {periodos.map((p) => (
            <button key={p} onClick={() => setPeriodoFilter(p)} className={cn("px-3 py-1.5 rounded-lg text-xs font-medium transition-all", periodoFilter === p ? "bg-white text-primary-700 shadow-sm" : "text-surface-500 hover:text-surface-700")}>
              {p}
            </button>
          ))}
        </div>
        <div className="flex gap-1 p-1 bg-surface-100 rounded-xl flex-wrap">
          {servicios.map((s) => (
            <button key={s} onClick={() => setServicioFilter(s)} className={cn("px-3 py-1.5 rounded-lg text-xs font-medium transition-all", servicioFilter === s ? "bg-white text-primary-700 shadow-sm" : "text-surface-500 hover:text-surface-700")}>
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-surface-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs font-medium text-surface-500 uppercase tracking-wider border-b border-surface-100">
                <th className="px-5 py-3">Inmueble</th>
                <th className="px-5 py-3">Servicio</th>
                <th className="px-5 py-3">Periodo</th>
                <th className="px-5 py-3 text-right">Lectura Ant.</th>
                <th className="px-5 py-3 text-right">Lectura Act.</th>
                <th className="px-5 py-3 text-right">Consumo</th>
                <th className="px-5 py-3 text-right">Tarifa</th>
                <th className="px-5 py-3 text-right">Monto</th>
                <th className="px-5 py-3">Estado</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.id} className="border-b border-surface-50 hover:bg-surface-50 transition-colors">
                  <td className="px-5 py-3 text-sm font-medium text-surface-800">{c.inmuebleLabel}</td>
                  <td className="px-5 py-3 text-sm text-surface-600">{c.servicioNombre}</td>
                  <td className="px-5 py-3 text-sm text-surface-600">{c.periodo}</td>
                  <td className="px-5 py-3 text-sm text-surface-600 text-right tabular-nums">{c.lecturaAnterior ?? "—"}</td>
                  <td className="px-5 py-3 text-sm text-surface-600 text-right tabular-nums">{c.lecturaActual ?? "—"}</td>
                  <td className="px-5 py-3 text-sm text-surface-600 text-right tabular-nums">{c.consumo ? `${c.consumo} m³` : "Prorrateo"}</td>
                  <td className="px-5 py-3 text-sm text-surface-600 text-right tabular-nums">S/ {c.tarifa}</td>
                  <td className="px-5 py-3 text-sm font-semibold text-surface-800 text-right tabular-nums">S/ {c.monto.toLocaleString()}</td>
                  <td className="px-5 py-3">
                    <span className={cn("text-[11px] font-bold px-2 py-0.5 rounded-full", c.estado === "Pagado" ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700")}>
                      {c.estado}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between px-5 py-3 border-t border-surface-100 text-xs text-surface-400">
          <span>{filtered.length} cargos</span>
          <span className="font-semibold text-surface-600">Total: S/ {total.toLocaleString()}</span>
        </div>
      </div>
    </>
  );
}
