"use client";

import { useState, useCallback, useMemo } from "react";
import { AlertTriangle, Plus, Search, Edit, Trash2 } from "lucide-react";
import { HeaderPage } from "@/components/dashboard/header-page";
import { Button } from "@/components/ui/button";
import { FormDrawer } from "@/components/dashboard/form-drawer";
import { ConfirmDialog } from "@/components/dashboard/confirm-dialog";
import { useMockStore } from "@/hooks/use-mock-store";
import { incidencias as initial } from "@/lib/mock-data/incidencias";
import { cn } from "@/lib/utils";
import { z } from "zod";
import type { Incidencia } from "@/types";

const schema = z.object({
  id: z.string().min(1),
  titulo: z.string().min(3),
  descripcion: z.string().min(5),
  ubicacion: z.string().min(2),
  prioridad: z.enum(["Baja", "Media", "Alta", "Crítica"]),
  categoria: z.string().min(1),
  reportadaPor: z.string().min(1),
  asignadaA: z.string().min(1),
  fechaReporte: z.string().min(1),
  fechaCierre: z.string().optional(),
  estado: z.enum(["Abierta", "En proceso", "Resuelta", "Cerrada"]),
});

export default function IncidenciasPage() {
  const store = useMockStore<Incidencia>(initial);
  const [search, setSearch] = useState("");
  const [estadoFilter, setEstadoFilter] = useState("Todas");
  const [form, setForm] = useState<{ mode: "create" | "edit"; item?: Incidencia } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Incidencia | null>(null);

  const filtered = useMemo(() => {
    let items = store.items;
    if (search) {
      const q = search.toLowerCase();
      items = items.filter(
        (i) => i.titulo.toLowerCase().includes(q) || i.ubicacion.toLowerCase().includes(q)
      );
    }
    if (estadoFilter !== "Todas") items = items.filter((i) => i.estado === estadoFilter);
    return items;
  }, [store.items, search, estadoFilter]);

  const kpis = useMemo(
    () => ({
      total: store.items.length,
      abiertas: store.items.filter((i) => i.estado === "Abierta").length,
      enProceso: store.items.filter((i) => i.estado === "En proceso").length,
      resueltas: store.items.filter((i) => i.estado === "Resuelta" || i.estado === "Cerrada").length,
    }),
    [store.items]
  );

  const handleSubmit = useCallback(
    (data: Record<string, unknown>) => {
      const id = (data.id as string) || crypto.randomUUID();
      const { id: _id, ...rest } = data;
      const item: Incidencia = { ...rest, id } as unknown as Incidencia;
      if (form?.mode === "edit") store.update(id, item);
      else store.create(item);
      setForm(null);
    },
    [form, store]
  );

  const fields = [
    { name: "titulo", label: "Título", type: "text" as const },
    { name: "descripcion", label: "Descripción", type: "textarea" as const },
    { name: "ubicacion", label: "Ubicación", type: "text" as const },
    {
      name: "prioridad",
      label: "Prioridad",
      type: "select" as const,
      options: ["Baja", "Media", "Alta", "Crítica"].map((p) => ({ label: p, value: p })),
    },
    { name: "categoria", label: "Categoría", type: "text" as const },
    { name: "reportadaPor", label: "Reportada por", type: "text" as const },
    { name: "asignadaA", label: "Asignada a", type: "text" as const },
    { name: "fechaReporte", label: "Fecha de reporte", type: "text" as const },
    {
      name: "estado",
      label: "Estado",
      type: "select" as const,
      options: ["Abierta", "En proceso", "Resuelta", "Cerrada"].map((e) => ({
        label: e,
        value: e,
      })),
    },
  ];

  const prioridadColor: Record<string, string> = {
    Baja: "bg-surface-100 text-surface-600",
    Media: "bg-blue-50 text-blue-600",
    Alta: "bg-amber-50 text-amber-700",
    Crítica: "bg-red-50 text-red-700",
  };

  return (
    <>
      <HeaderPage
        icon={AlertTriangle}
        title="Incidencias"
        subtitle={`${kpis.abiertas} abiertas · ${kpis.enProceso} en proceso`}
      >
        <Button variant="accent" size="md" onClick={() => setForm({ mode: "create" })}>
          <Plus className="h-4 w-4 mr-1.5" />
          Reportar Incidencia
        </Button>
      </HeaderPage>

      <div className="flex items-center gap-3 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-surface-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar..."
            className="w-full max-w-xs pl-10 pr-4 py-2.5 rounded-xl border border-surface-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20"
          />
        </div>
        <div className="flex gap-1 p-1 bg-surface-100 rounded-xl">
          {(["Todas", "Abierta", "En proceso", "Resuelta", "Cerrada"] as const).map((e) => (
            <button
              key={e}
              onClick={() => setEstadoFilter(e)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                estadoFilter === e ? "bg-white text-primary-700 shadow-sm" : "text-surface-500 hover:text-surface-700"
              )}
            >
              {e}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total", value: kpis.total, color: "bg-primary-50 text-primary-700" },
          { label: "Abiertas", value: kpis.abiertas, color: "bg-red-50 text-red-700" },
          { label: "En proceso", value: kpis.enProceso, color: "bg-amber-50 text-amber-700" },
          { label: "Resueltas", value: kpis.resueltas, color: "bg-green-50 text-green-700" },
        ].map((k) => (
          <div key={k.label} className={cn("rounded-xl p-3 text-center", k.color)}>
            <p className="text-lg font-extrabold">{k.value}</p>
            <p className="text-[10px] font-medium uppercase">{k.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-surface-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs font-medium text-surface-500 uppercase tracking-wider border-b border-surface-100">
                <th className="px-5 py-3">Título</th>
                <th className="px-5 py-3">Prioridad</th>
                <th className="px-5 py-3">Ubicación</th>
                <th className="px-5 py-3">Reportada por</th>
                <th className="px-5 py-3">Asignada a</th>
                <th className="px-5 py-3">Reporte</th>
                <th className="px-5 py-3">Estado</th>
                <th className="px-5 py-3 w-10" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((i) => (
                <tr key={i.id} className="border-b border-surface-50 hover:bg-surface-50 transition-colors group">
                  <td className="px-5 py-3 text-sm font-medium text-surface-800 max-w-[200px] truncate">
                    {i.titulo}
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={cn(
                        "text-[10px] font-bold px-2 py-0.5 rounded-full",
                        prioridadColor[i.prioridad]
                      )}
                    >
                      {i.prioridad}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-xs text-surface-500">{i.ubicacion}</td>
                  <td className="px-5 py-3 text-xs text-surface-500">{i.reportadaPor}</td>
                  <td className="px-5 py-3 text-xs text-surface-500">{i.asignadaA}</td>
                  <td className="px-5 py-3 text-xs text-surface-400">{i.fechaReporte}</td>
                  <td className="px-5 py-3">
                    <span
                      className={cn(
                        "text-[10px] font-bold px-2 py-0.5 rounded-full",
                        i.estado === "Abierta"
                          ? "bg-red-50 text-red-700"
                          : i.estado === "En proceso"
                          ? "bg-amber-50 text-amber-700"
                          : i.estado === "Resuelta"
                          ? "bg-green-50 text-green-700"
                          : "bg-surface-100 text-surface-500"
                      )}
                    >
                      {i.estado}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => setForm({ mode: "edit", item: i })}
                        className="p-1 rounded text-surface-400 hover:text-primary-600"
                      >
                        <Edit className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(i)}
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
          <span>{filtered.length} incidencias</span>
        </div>
      </div>

      <FormDrawer
        open={form !== null}
        onClose={() => setForm(null)}
        onSubmit={handleSubmit}
        schema={schema}
        defaultValues={form?.item || undefined}
        title={form?.mode === "create" ? "Reportar Incidencia" : "Editar Incidencia"}
        fields={fields}
      />
      <ConfirmDialog
        open={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (deleteTarget) store.remove(deleteTarget.id);
          setDeleteTarget(null);
        }}
        title="Eliminar incidencia"
        message={`¿Eliminar "${deleteTarget?.titulo}"?`}
      />
    </>
  );
}
