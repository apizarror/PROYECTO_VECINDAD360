"use client";

import { useState, useCallback, useMemo } from "react";
import { AlertTriangle, Plus, Search, Trash2, Edit } from "lucide-react";
import { HeaderPage } from "@/components/dashboard/header-page";
import { Button } from "@/components/ui/button";
import { FormDrawer } from "@/components/dashboard/form-drawer";
import { ConfirmDialog } from "@/components/dashboard/confirm-dialog";
import { useMockStore } from "@/hooks/use-mock-store";
import { multas as initialMultas, residentes } from "@/lib/mock-data/residentes";
import { cn } from "@/lib/utils";
import { z } from "zod";
import type { Multa } from "@/types";

const multaSchema = z.object({
  id: z.string().optional(),
  residenteId: z.string().min(1, "Selecciona un residente"),
  residenteNombre: z.string().optional(),
  inmuebleId: z.string().optional(),
  inmuebleLabel: z.string().optional(),
  motivo: z.enum(["ruido", "mascota", "basura", "area_comun", "estacionamiento", "otro"]),
  descripcion: z.string().min(10, "Mínimo 10 caracteres"),
  monto: z.number().min(1, "Mínimo S/ 1"),
  fechaEmision: z.string().min(1, "Requerido"),
  fechaVencimiento: z.string().min(1, "Requerido"),
  estado: z.enum(["Pendiente", "Pagada", "Anulada", "Vencida"]),
  aplicadaPor: z.string().min(1, "Requerido"),
});

const motivoLabels: Record<string, string> = {
  ruido: "Ruido",
  mascota: "Mascota",
  basura: "Basura",
  area_comun: "Área Común",
  estacionamiento: "Estacionamiento",
  otro: "Otro",
};

const estados = ["Todas", "Pendiente", "Pagada", "Anulada", "Vencida"] as const;

export default function MultasPage() {
  const store = useMockStore<Multa>(initialMultas);
  const [search, setSearch] = useState("");
  const [estadoFilter, setEstadoFilter] = useState<string>("Todas");
  const [form, setForm] = useState<{ mode: "create" | "edit"; item?: Multa } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Multa | null>(null);

  const filtered = useMemo(() => {
    let items = store.items;
    if (search) {
      const q = search.toLowerCase();
      items = items.filter((m) => m.residenteNombre.toLowerCase().includes(q) || m.inmuebleLabel.toLowerCase().includes(q));
    }
    if (estadoFilter !== "Todas") {
      items = items.filter((m) => m.estado === estadoFilter);
    }
    return items;
  }, [store.items, search, estadoFilter]);

  const handleSubmit = useCallback(
    (data: Record<string, unknown>) => {
      const id = (data.id as string) || crypto.randomUUID();
      const residente = residentes.find((r) => r.id === data.residenteId);
      const item: Multa = {
        id,
        residenteId: data.residenteId as string,
        residenteNombre: (data.residenteNombre as string) || (residente ? `${residente.nombres} ${residente.apellidos}` : ""),
        inmuebleId: (data.inmuebleId as string) || residente?.vinculaciones[0]?.inmuebleId || "",
        inmuebleLabel: (data.inmuebleLabel as string) || residente?.vinculaciones[0]?.inmuebleLabel || "",
        motivo: data.motivo as Multa["motivo"],
        descripcion: data.descripcion as string,
        monto: data.monto as number,
        fechaEmision: data.fechaEmision as string,
        fechaVencimiento: data.fechaVencimiento as string,
        estado: data.estado as Multa["estado"],
        aplicadaPor: data.aplicadaPor as string,
      };
      if (form?.mode === "edit") store.update(id, item);
      else store.create(item);
      setForm(null);
    },
    [form, store]
  );

  const handleDelete = useCallback(() => {
    if (deleteTarget) store.remove(deleteTarget.id);
    setDeleteTarget(null);
  }, [deleteTarget, store]);

  const fields = [
    { name: "residenteId", label: "Residente", type: "select" as const, options: residentes.filter(r => r.activo).map(r => ({ label: `${r.nombres} ${r.apellidos}`, value: r.id })) },
    { name: "motivo", label: "Motivo", type: "select" as const, options: Object.entries(motivoLabels).map(([k, v]) => ({ label: v, value: k })) },
    { name: "descripcion", label: "Descripción", type: "textarea" as const, placeholder: "Describe la infracción..." },
    { name: "monto", label: "Monto (S/)", type: "number" as const },
    { name: "fechaEmision", label: "Fecha de emisión", type: "text" as const, placeholder: "2026-05-01" },
    { name: "fechaVencimiento", label: "Fecha de vencimiento", type: "text" as const, placeholder: "2026-06-01" },
    { name: "aplicadaPor", label: "Aplicada por", type: "text" as const, placeholder: "Administración" },
    { name: "estado", label: "Estado", type: "select" as const, options: ["Pendiente", "Pagada", "Anulada", "Vencida"].map(s => ({ label: s, value: s })) },
  ];

  return (
    <>
      <HeaderPage icon={AlertTriangle} title="Multas" subtitle="Sanciones y penalidades a residentes">
        <Button variant="accent" size="md" onClick={() => setForm({ mode: "create" })}>
          <Plus className="h-4 w-4 mr-1.5" />
          Emitir Multa
        </Button>
      </HeaderPage>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-surface-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por residente o inmueble..."
            className="w-full sm:max-w-xs pl-10 pr-4 py-2.5 rounded-xl border border-surface-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 transition-colors"
          />
        </div>
        <div className="flex gap-1 p-1 bg-surface-100 rounded-xl flex-wrap">
          {estados.map((e) => (
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

      {/* Table */}
      <div className="bg-white rounded-2xl border border-surface-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs font-medium text-surface-500 uppercase tracking-wider border-b border-surface-100">
                <th className="px-5 py-3">Residente</th>
                <th className="px-5 py-3">Motivo</th>
                <th className="px-5 py-3 text-right">Monto</th>
                <th className="px-5 py-3">Emisión</th>
                <th className="px-5 py-3">Vencimiento</th>
                <th className="px-5 py-3">Estado</th>
                <th className="px-5 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((m) => (
                <tr key={m.id} className="border-b border-surface-50 hover:bg-surface-50 transition-colors">
                  <td className="px-5 py-3">
                    <p className="text-sm font-medium text-surface-800">{m.residenteNombre}</p>
                    <p className="text-xs text-surface-400">{m.inmuebleLabel}</p>
                  </td>
                  <td className="px-5 py-3">
                    <span className="text-sm text-surface-600">{motivoLabels[m.motivo]}</span>
                    <p className="text-xs text-surface-400 truncate max-w-[200px]">{m.descripcion}</p>
                  </td>
                  <td className="px-5 py-3 text-sm font-semibold text-red-600 text-right tabular-nums">
                    S/ {m.monto.toLocaleString()}
                  </td>
                  <td className="px-5 py-3 text-sm text-surface-600">{m.fechaEmision}</td>
                  <td className="px-5 py-3 text-sm text-surface-600">{m.fechaVencimiento}</td>
                  <td className="px-5 py-3">
                    <span className={cn(
                      "text-[11px] font-bold px-2 py-0.5 rounded-full",
                      m.estado === "Pendiente" ? "bg-amber-50 text-amber-700" :
                      m.estado === "Pagada" ? "bg-green-50 text-green-700" :
                      m.estado === "Anulada" ? "bg-surface-100 text-surface-500" :
                      "bg-red-50 text-red-700"
                    )}>
                      {m.estado}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => setForm({ mode: "edit", item: m })}
                        className="p-1.5 rounded-lg text-surface-400 hover:text-primary-600 hover:bg-primary-50 transition-colors"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(m)}
                        className="p-1.5 rounded-lg text-surface-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-surface-400 text-sm">
                    No se encontraron multas
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between px-5 py-3 border-t border-surface-100 text-xs text-surface-400">
          <span>{filtered.length} multas</span>
        </div>
      </div>

      <FormDrawer
        open={form !== null}
        onClose={() => setForm(null)}
        onSubmit={handleSubmit}
        schema={multaSchema}
        defaultValues={form?.item || undefined}
        title={form?.mode === "create" ? "Emitir Multa" : "Editar Multa"}
        fields={fields}
      />

      <ConfirmDialog
        open={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Eliminar multa"
        message={`¿Estás seguro de eliminar la multa de "${deleteTarget?.residenteNombre}"?`}
        confirmLabel="Eliminar"
        variant="danger"
      />
    </>
  );
}
