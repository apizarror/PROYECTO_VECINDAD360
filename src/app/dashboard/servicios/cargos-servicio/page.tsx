"use client";

import { useState, useCallback, useMemo } from "react";
import { Wrench, Plus, Search, Edit, Trash2, Loader2 } from "lucide-react";
import { HeaderPage } from "@/components/dashboard/header-page";
import { Button } from "@/components/ui/button";
import { FormDrawer } from "@/components/dashboard/form-drawer";
import { ConfirmDialog } from "@/components/dashboard/confirm-dialog";
import { useApiList, useApiCreate, useApiUpdate, useApiDelete } from "@/hooks/use-api";
import { cn } from "@/lib/utils";
import { z } from "zod";

interface Inmueble {
  id: string;
  numero: string;
}

interface CargoServicio {
  id: string;
  condominioId: string;
  inmuebleId: string;
  inmueble?: Inmueble;
  servicioNombre: string;
  periodo: string;
  lecturaAnterior?: number | null;
  lecturaActual?: number | null;
  consumo?: number | null;
  tarifa: number;
  monto: number;
  estado: string;
  registradoPor: string;
  createdAt: string;
  updatedAt: string;
}

const schema = z.object({
  id: z.string().optional(),
  inmuebleId: z.string().min(1),
  servicioNombre: z.string().min(1),
  periodo: z.string().min(1),
  lecturaAnterior: z.number().optional(),
  lecturaActual: z.number().optional(),
  consumo: z.number().optional(),
  tarifa: z.number().min(0),
  monto: z.number().min(0),
  estado: z.enum(["Pendiente", "Pagado"]),
});

const periodos = ["Todos", "2026-05", "2026-04", "2026-03"];
const servicios = ["Todos", "Agua", "Luz Áreas Comunes", "Gas"];

export default function CargosServicioPage() {
  const { data: cargosServicio = [], isLoading } = useApiList<CargoServicio>("cargos-servicio");
  const { data: inmuebles = [] } = useApiList<Inmueble>("inmuebles");
  const createMutation = useApiCreate<CargoServicio>("cargos-servicio");
  const updateMutation = useApiUpdate<CargoServicio>("cargos-servicio");
  const deleteMutation = useApiDelete("cargos-servicio");
  const [search, setSearch] = useState("");
  const [periodoFilter, setPeriodoFilter] = useState("Todos");
  const [servicioFilter, setServicioFilter] = useState("Todos");
  const [form, setForm] = useState<{ mode: "create" | "edit"; item?: CargoServicio } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<CargoServicio | null>(null);

  const filtered = useMemo(() => {
    let items = [...cargosServicio];
    if (search) {
      const q = search.toLowerCase();
      items = items.filter((c) => (c.inmueble?.numero ?? "").toLowerCase().includes(q));
    }
    if (periodoFilter !== "Todos") items = items.filter((c) => c.periodo === periodoFilter);
    if (servicioFilter !== "Todos") items = items.filter((c) => c.servicioNombre === servicioFilter);
    return items;
  }, [cargosServicio, search, periodoFilter, servicioFilter]);

  const total = useMemo(() => filtered.reduce((s, c) => s + c.monto, 0), [filtered]);

  const handleSubmit = useCallback(
    async (data: Record<string, unknown>) => {
      const id = (data.id as string) || crypto.randomUUID();
      const item = { ...data, id } as unknown as CargoServicio;
      if (form?.mode === "edit") await updateMutation.mutateAsync(item);
      else await createMutation.mutateAsync(item);
      setForm(null);
    },
    [form, createMutation, updateMutation]
  );

  const fields = [
    {
      name: "inmuebleId",
      label: "Inmueble",
      type: "select" as const,
      options: inmuebles.map((i) => ({ label: i.numero, value: i.id })),
    },
    {
      name: "servicioNombre",
      label: "Servicio",
      type: "select" as const,
      options: ["Agua", "Luz Áreas Comunes", "Gas"].map((s) => ({ label: s, value: s })),
    },
    { name: "periodo", label: "Periodo (YYYY-MM)", type: "text" as const, placeholder: "2026-05" },
    { name: "lecturaAnterior", label: "Lectura Anterior", type: "number" as const },
    { name: "lecturaActual", label: "Lectura Actual", type: "number" as const },
    { name: "consumo", label: "Consumo (auto: actual - anterior)", type: "number" as const },
    { name: "tarifa", label: "Tarifa (S/)", type: "number" as const },
    { name: "monto", label: "Monto (S/)", type: "number" as const },
    {
      name: "estado",
      label: "Estado",
      type: "select" as const,
      options: [
        { label: "Pendiente", value: "Pendiente" },
        { label: "Pagado", value: "Pagado" },
      ],
    },
  ];

  if (isLoading) {
    return (
      <>
        <HeaderPage icon={Wrench} title="Cargos por Servicio" subtitle="Cargando..." />
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
        </div>
      </>
    );
  }

  return (
    <>
      <HeaderPage icon={Wrench} title="Cargos por Servicio" subtitle="Lecturas y cargos mensuales por inmueble">
        <Button variant="accent" size="md" onClick={() => setForm({ mode: "create" })}>
          <Plus className="h-4 w-4 mr-1.5" />
          Nuevo Cargo
        </Button>
      </HeaderPage>

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
                <th className="px-5 py-3 w-10" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.id} className="border-b border-surface-50 hover:bg-surface-50 transition-colors group">
                  <td className="px-5 py-3 text-sm font-medium text-surface-800">{c.inmueble?.numero ?? c.inmuebleId}</td>
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
                  <td className="px-5 py-3">
                    <div className="flex gap-0.5 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => setForm({ mode: "edit", item: c })}
                        className="p-1 rounded text-surface-400 hover:text-primary-600"
                      >
                        <Edit className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(c)}
                        className="p-1 rounded text-surface-400 hover:text-red-600"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
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

      <FormDrawer
        open={form !== null}
        onClose={() => setForm(null)}
        onSubmit={handleSubmit}
        schema={schema}
        defaultValues={(form?.item as unknown as z.infer<typeof schema>) || undefined}
        title={form?.mode === "create" ? "Nuevo Cargo de Servicio" : "Editar Cargo de Servicio"}
        fields={fields}
      />
      <ConfirmDialog
        open={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={async () => {
          if (deleteTarget) await deleteMutation.mutateAsync(deleteTarget.id);
          setDeleteTarget(null);
        }}
        title="Eliminar cargo"
        message={`¿Eliminar cargo de ${deleteTarget?.servicioNombre} para inmueble ${deleteTarget?.inmueble?.numero ?? ""}?`}
      />
    </>
  );
}
