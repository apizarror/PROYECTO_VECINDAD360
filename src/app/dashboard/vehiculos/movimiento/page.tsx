"use client";

import { useState, useCallback, useMemo } from "react";
import { ArrowDownToLine, ArrowUpFromLine, Search, Car, Plus, Loader2 } from "lucide-react";
import { HeaderPage } from "@/components/dashboard/header-page";
import { Button } from "@/components/ui/button";
import { FormDrawer } from "@/components/dashboard/form-drawer";
import { useApiList, useApiCreate } from "@/hooks/use-api";
import { cn } from "@/lib/utils";
import { z } from "zod";

interface MovimientoVehicular {
  id: string;
  condominioId?: string;
  vehiculoId?: string;
  placa: string;
  tipoMovimiento: string;
  fechaHora: string;
  registradoPor: string;
  observaciones?: string;
  esVisitante: boolean;
  visitanteNombre?: string;
  createdAt?: string;
}

const schema = z.object({
  id: z.string().optional(),
  placa: z.string().min(3, "Placa requerida"),
  tipoMovimiento: z.enum(["Entrada", "Salida"]),
  fechaHora: z.string().min(1, "Fecha requerida"),
  registradoPor: z.string().min(2, "Requerido"),
  observaciones: z.string().optional(),
  esVisitante: z.string().default("No"),
  visitanteNombre: z.string().optional(),
  vehiculoId: z.string().optional(),
});

export default function MovimientoVehicularPage() {
  const { data: movimientosVehiculares = [], isLoading } = useApiList<MovimientoVehicular>("movimientos");
  const createMutation = useApiCreate<MovimientoVehicular>("movimientos");
  const [search, setSearch] = useState("");
  const [tipoFilter, setTipoFilter] = useState("Todos");
  const [form, setForm] = useState<{ mode: "create" } | null>(null);

  const filtered = useMemo(() => {
    let items = [...movimientosVehiculares];
    if (search) { const q = search.toLowerCase(); items = items.filter(m => m.placa.toLowerCase().includes(q) || m.visitanteNombre?.toLowerCase().includes(q)); }
    if (tipoFilter !== "Todos") items = items.filter(m => m.tipoMovimiento === tipoFilter);
    return items.sort((a, b) => b.fechaHora.localeCompare(a.fechaHora));
  }, [movimientosVehiculares, search, tipoFilter]);

  const handleSubmit = useCallback(async (data: Record<string, unknown>) => {
    const id = crypto.randomUUID();
    const esVisitante = data.esVisitante === "Sí";
    const item: MovimientoVehicular = {
      id,
      placa: data.placa as string,
      tipoMovimiento: data.tipoMovimiento as string,
      fechaHora: data.fechaHora as string,
      registradoPor: data.registradoPor as string,
      observaciones: (data.observaciones as string) || undefined,
      esVisitante,
      visitanteNombre: esVisitante ? (data.visitanteNombre as string) : undefined,
      vehiculoId: (data.vehiculoId as string) || undefined,
    };
    await createMutation.mutateAsync(item);
    setForm(null);
  }, [createMutation]);

  const now = new Date();
  const pad = (n: number) => n.toString().padStart(2, "0");
  const defaultFechaHora = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`;

  const fields = [
    { name: "placa", label: "Placa", type: "text" as const, placeholder: "ABC-123" },
    { name: "tipoMovimiento", label: "Tipo de movimiento", type: "select" as const, options: [{ label: "Entrada", value: "Entrada" }, { label: "Salida", value: "Salida" }] },
    { name: "fechaHora", label: "Fecha y hora", type: "datetime-local" as const },
    { name: "registradoPor", label: "Registrado por", type: "text" as const },
    { name: "observaciones", label: "Observaciones (opcional)", type: "textarea" as const },
    { name: "esVisitante", label: "Es visitante", type: "select" as const, options: [{ label: "No", value: "No" }, { label: "Sí", value: "Sí" }] },
    { name: "visitanteNombre", label: "Nombre del visitante (si aplica)", type: "text" as const },
  ];

  if (isLoading) {
    return (
      <>
        <HeaderPage icon={Car} title="Movimiento Vehicular" subtitle="Cargando..." />
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
        </div>
      </>
    );
  }

  return (
    <>
      <HeaderPage icon={Car} title="Movimiento Vehicular" subtitle="Bitácora de entradas y salidas">
        <Button variant="accent" size="md" onClick={() => setForm({ mode: "create" })}>
          <Plus className="h-4 w-4 mr-1.5" /> Registrar Movimiento
        </Button>
      </HeaderPage>

      <div className="flex items-center gap-3 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-surface-400" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar por placa..."
            className="w-full sm:max-w-xs pl-10 pr-4 py-2.5 rounded-xl border border-surface-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20" />
        </div>
        <div className="flex gap-1 p-1 bg-surface-100 rounded-xl flex-wrap">
          {["Todos", "Entrada", "Salida"].map(t => (
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
                      m.tipoMovimiento === "Entrada" ? "text-green-600" : "text-red-600"
                    )}>
                      {m.tipoMovimiento === "Entrada" ? <ArrowDownToLine className="h-3.5 w-3.5" /> : <ArrowUpFromLine className="h-3.5 w-3.5" />}
                      {m.tipoMovimiento}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-sm text-surface-600">{m.fechaHora}</td>
                  <td className="px-5 py-3 text-xs text-surface-500">{m.registradoPor}</td>
                  <td className="px-5 py-3 text-xs text-surface-400">{m.observaciones || "---"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between px-5 py-3 border-t border-surface-100 text-xs text-surface-400">
          <span>{filtered.length} movimientos</span>
        </div>
      </div>

      <FormDrawer
        open={form !== null}
        onClose={() => setForm(null)}
        onSubmit={handleSubmit}
        schema={schema}
        defaultValues={{ placa: "", tipoMovimiento: "Entrada", fechaHora: defaultFechaHora, registradoPor: "", esVisitante: "No" } as any}
        title="Registrar Movimiento"
        fields={fields}
      />
    </>
  );
}
