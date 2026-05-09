"use client";

import { useState, useMemo } from "react";
import { ArrowDownToLine, ArrowUpFromLine, Search, Car } from "lucide-react";
import { HeaderPage } from "@/components/dashboard/header-page";
import { movimientosVehiculares } from "@/lib/mock-data/visitas";
import { cn } from "@/lib/utils";

export default function MovimientoVehicularPage() {
  const [search, setSearch] = useState("");
  const [tipoFilter, setTipoFilter] = useState("Todos");

  const filtered = useMemo(() => {
    let items = [...movimientosVehiculares];
    if (search) { const q = search.toLowerCase(); items = items.filter(m => m.placa.toLowerCase().includes(q) || m.visitanteNombre?.toLowerCase().includes(q)); }
    if (tipoFilter !== "Todos") items = items.filter(m => m.tipoMovimiento === tipoFilter);
    return items.sort((a, b) => b.fechaHora.localeCompare(a.fechaHora));
  }, [search, tipoFilter]);

  return (
    <>
      <HeaderPage icon={Car} title="Movimiento Vehicular" subtitle="Bitácora de entradas y salidas" />

      <div className="flex items-center gap-3 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-surface-400" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar por placa..."
            className="w-full max-w-xs pl-10 pr-4 py-2.5 rounded-xl border border-surface-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20" />
        </div>
        <div className="flex gap-1 p-1 bg-surface-100 rounded-xl">
          {["Todos", "Ingreso", "Salida"].map(t => (
            <button key={t} onClick={() => setTipoFilter(t)} className={cn("px-3 py-1.5 rounded-lg text-xs font-medium transition-all", tipoFilter === t ? "bg-white text-primary-700 shadow-sm" : "text-surface-500 hover:text-surface-700")}>{t}</button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-surface-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs font-medium text-surface-500 uppercase tracking-wider border-b border-surface-100">
                <th className="px-5 py-3">Placa</th><th className="px-5 py-3">Tipo</th><th className="px-5 py-3">Fecha / Hora</th><th className="px-5 py-3">Registrado por</th><th className="px-5 py-3">Observaciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(m => (
                <tr key={m.id} className="border-b border-surface-50 hover:bg-surface-50 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-mono font-bold text-surface-800">{m.placa}</span>
                      {m.esVisitante && <span className="text-[10px] bg-amber-50 text-amber-600 px-1.5 py-0.5 rounded-full font-bold">Visita</span>}
                    </div>
                    {m.visitanteNombre && <p className="text-xs text-surface-400 mt-0.5">{m.visitanteNombre}</p>}
                  </td>
                  <td className="px-5 py-3">
                    <span className={cn("inline-flex items-center gap-1 text-xs font-semibold",
                      m.tipoMovimiento === "Ingreso" ? "text-green-600" : "text-red-600"
                    )}>
                      {m.tipoMovimiento === "Ingreso" ? <ArrowDownToLine className="h-3.5 w-3.5" /> : <ArrowUpFromLine className="h-3.5 w-3.5" />}
                      {m.tipoMovimiento}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-sm text-surface-600">{m.fechaHora}</td>
                  <td className="px-5 py-3 text-xs text-surface-500">{m.registradoPor}</td>
                  <td className="px-5 py-3 text-xs text-surface-400">{m.observaciones || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between px-5 py-3 border-t border-surface-100 text-xs text-surface-400">
          <span>{filtered.length} movimientos</span>
        </div>
      </div>
    </>
  );
}
