"use client";

import { useState, useMemo } from "react";
import { ReceiptText, Search, ChevronDown, ChevronRight } from "lucide-react";
import { HeaderPage } from "@/components/dashboard/header-page";
import { cargosTotales } from "@/lib/mock-data/servicios";
import { cn } from "@/lib/utils";
import type { CargoTotalResumen } from "@/types";

function CargoRow({ cargo }: { cargo: CargoTotalResumen["cargos"][number] }) {
  const colorEstado =
    cargo.estado === "Pagado" ? "text-green-600 bg-green-50" :
    cargo.estado === "Vencido" ? "text-red-600 bg-red-50" :
    "text-amber-600 bg-amber-50";

  return (
    <tr className="border-b border-surface-50 text-sm">
      <td className="px-4 py-2.5">
        <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full", colorEstado)}>
          {cargo.tipo}
        </span>
      </td>
      <td className="px-4 py-2.5 text-surface-700">{cargo.descripcion}</td>
      <td className="px-4 py-2.5 text-surface-600 text-right tabular-nums">S/ {cargo.monto.toLocaleString()}</td>
      <td className="px-4 py-2.5 text-surface-400">{cargo.fechaEmision}</td>
      <td className="px-4 py-2.5">
        <span className={cn("text-[11px] font-bold px-2 py-0.5 rounded-full", 
          cargo.estado === "Pagado" ? "bg-green-50 text-green-700" :
          cargo.estado === "Vencido" ? "bg-red-50 text-red-700" :
          "bg-amber-50 text-amber-700"
        )}>
          {cargo.estado}
        </span>
      </td>
    </tr>
  );
}

export default function CargosTotalesPage() {
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    if (!search) return cargosTotales;
    const q = search.toLowerCase();
    return cargosTotales.filter((c) => c.inmuebleLabel.toLowerCase().includes(q) || c.residenteNombre.toLowerCase().includes(q));
  }, [search]);

  const toggleExpand = (id: string) => setExpandedId(expandedId === id ? null : id);

  return (
    <>
      <HeaderPage icon={ReceiptText} title="Cargos Totales" subtitle="Estado de cuenta consolidado por inmueble" />

      <div className="flex items-center gap-3 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-surface-400" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar por inmueble o residente..."
            className="w-full max-w-xs pl-10 pr-4 py-2.5 rounded-xl border border-surface-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20" />
        </div>
      </div>

      <div className="space-y-4">
        {filtered.map((resumen) => {
          const expanded = expandedId === resumen.inmuebleId;
          return (
            <div key={resumen.inmuebleId} className="bg-white rounded-2xl border border-surface-200 shadow-sm overflow-hidden">
              {/* Header row */}
              <div
                onClick={() => toggleExpand(resumen.inmuebleId)}
                className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-surface-50 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {expanded ? <ChevronDown className="h-4 w-4 text-surface-400 flex-shrink-0" /> : <ChevronRight className="h-4 w-4 text-surface-400 flex-shrink-0" />}
                  <div>
                    <p className="text-sm font-semibold text-surface-800">{resumen.inmuebleLabel}</p>
                    <p className="text-xs text-surface-400">{resumen.residenteNombre}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6 text-right">
                  <div>
                    <p className="text-[10px] text-surface-400 uppercase">Pendiente</p>
                    <p className={cn("text-sm font-bold tabular-nums", resumen.saldoPendiente > 0 ? "text-red-600" : "text-green-600")}>
                      S/ {resumen.saldoPendiente.toLocaleString()}
                    </p>
                  </div>
                  {resumen.interesMora > 0 && (
                    <div>
                      <p className="text-[10px] text-surface-400 uppercase">Interés mora</p>
                      <p className="text-sm font-bold text-red-500 tabular-nums">S/ {resumen.interesMora.toLocaleString()}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-[10px] text-surface-400 uppercase">Total cargos</p>
                    <p className="text-sm text-surface-600 tabular-nums">S/ {resumen.totalCargos.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              {/* Expandable detail */}
              {expanded && (
                <div className="border-t border-surface-100">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-[11px] font-medium text-surface-400 border-b border-surface-100 bg-surface-50">
                        <th className="px-4 py-2">Tipo</th>
                        <th className="px-4 py-2">Descripción</th>
                        <th className="px-4 py-2 text-right">Monto</th>
                        <th className="px-4 py-2">Emisión</th>
                        <th className="px-4 py-2">Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {resumen.cargos.map((cargo, i) => (
                        <CargoRow key={i} cargo={cargo} />
                      ))}
                    </tbody>
                  </table>
                  <div className="flex justify-end gap-6 px-5 py-3 bg-surface-50 border-t border-surface-100 text-xs">
                    <span className="text-surface-500">Pagado: <span className="font-semibold text-green-600">S/ {resumen.totalPagado.toLocaleString()}</span></span>
                    <span className="text-surface-500">Pendiente: <span className="font-semibold text-red-600">S/ {resumen.saldoPendiente.toLocaleString()}</span></span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}
