"use client";

import { useState, useCallback, useMemo } from "react";
import { CalendarDays, Plus, Edit, Trash2, Search } from "lucide-react";
import { HeaderPage } from "@/components/dashboard/header-page";
import { Button } from "@/components/ui/button";
import { FormDrawer } from "@/components/dashboard/form-drawer";
import { ConfirmDialog } from "@/components/dashboard/confirm-dialog";
import { useMockStore } from "@/hooks/use-mock-store";
import { reservas as initial, areasComunes } from "@/lib/mock-data/areas-comunes";
import { residentes } from "@/lib/mock-data/residentes";
import { cn } from "@/lib/utils";
import { z } from "zod";
import type { Reserva } from "@/types";

const schema = z.object({
  id: z.string().min(1),
  areaComunId: z.string().min(1),
  areaComunNombre: z.string(),
  residenteId: z.string().min(1),
  residenteNombre: z.string(),
  inmuebleId: z.string(),
  inmuebleLabel: z.string(),
  fecha: z.string().min(1),
  horaInicio: z.string().min(1),
  horaFin: z.string().min(1),
  costoTotal: z.number().min(0),
  estado: z.enum(["Solicitada", "Confirmada", "Pagada", "Cancelada", "Realizada"]),
  observaciones: z.string(),
});

export default function ReservasPage() {
  const store = useMockStore<Reserva>(initial);
  const [search, setSearch] = useState("");
  const [estadoFilter, setEstadoFilter] = useState("Todas");
  const [form, setForm] = useState<{ mode: "create" | "edit"; item?: Reserva } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Reserva | null>(null);

  const filtered = useMemo(() => {
    let items = store.items;
    if (search) { const q = search.toLowerCase(); items = items.filter(r => r.residenteNombre.toLowerCase().includes(q) || r.areaComunNombre.toLowerCase().includes(q)); }
    if (estadoFilter !== "Todas") items = items.filter(r => r.estado === estadoFilter);
    return items;
  }, [store.items, search, estadoFilter]);

  const handleSubmit = useCallback((data: Record<string, unknown>) => {
    const id = (data.id as string) || crypto.randomUUID();
    const area = areasComunes.find(a => a.id === data.areaComunId);
    const residente = residentes.find(r => r.id === data.residenteId);
    const { id: _id, ...rest } = data;
    const item: Reserva = {
      ...rest as unknown as Reserva,
      id,
      areaComunNombre: area?.nombre || "",
      residenteNombre: residente ? `${residente.nombres} ${residente.apellidos}` : "",
      inmuebleLabel: residente?.vinculaciones[0]?.inmuebleLabel || "",
    };
    if (form?.mode === "edit") store.update(id, item);
    else store.create(item);
    setForm(null);
  }, [form, store]);

  const fields = [
    { name: "areaComunId", label: "Área común", type: "select" as const, options: areasComunes.filter(a => a.estado === "Activa").map(a => ({ label: a.nombre, value: a.id })) },
    { name: "residenteId", label: "Residente", type: "select" as const, options: residentes.filter(r => r.activo).map(r => ({ label: `${r.nombres} ${r.apellidos}`, value: r.id })) },
    { name: "fecha", label: "Fecha", type: "text" as const, placeholder: "2026-05-20" },
    { name: "horaInicio", label: "Hora inicio", type: "text" as const, placeholder: "18:00" },
    { name: "horaFin", label: "Hora fin", type: "text" as const, placeholder: "22:00" },
    { name: "costoTotal", label: "Costo total (S/)", type: "number" as const },
    { name: "observaciones", label: "Observaciones", type: "textarea" as const },
    { name: "estado", label: "Estado", type: "select" as const, options: ["Solicitada", "Confirmada", "Pagada", "Cancelada", "Realizada"].map(e => ({ label: e, value: e })) },
  ];

  const estados = ["Todas", "Solicitada", "Confirmada", "Pagada", "Cancelada", "Realizada"] as const;

  return (
    <>
      <HeaderPage icon={CalendarDays} title="Reservas" subtitle="Gestión de reservas de áreas comunes">
        <Button variant="accent" size="md" onClick={() => setForm({ mode: "create" })}>
          <Plus className="h-4 w-4 mr-1.5" /> Nueva Reserva
        </Button>
      </HeaderPage>

      <div className="flex items-center gap-3 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-surface-400" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar..."
            className="w-full max-w-xs pl-10 pr-4 py-2.5 rounded-xl border border-surface-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20" />
        </div>
        <div className="flex gap-1 p-1 bg-surface-100 rounded-xl flex-wrap">
          {estados.map(e => (
            <button key={e} onClick={() => setEstadoFilter(e)} className={cn("px-3 py-1.5 rounded-lg text-xs font-medium transition-all", estadoFilter === e ? "bg-white text-primary-700 shadow-sm" : "text-surface-500 hover:text-surface-700")}>{e}</button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-surface-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs font-medium text-surface-500 uppercase tracking-wider border-b border-surface-100">
                <th className="px-5 py-3">Área</th><th className="px-5 py-3">Residente</th><th className="px-5 py-3">Fecha</th>
                <th className="px-5 py-3">Horario</th><th className="px-5 py-3 text-right">Costo</th><th className="px-5 py-3">Estado</th><th className="px-5 py-3 w-10" />
              </tr>
            </thead>
            <tbody>
              {filtered.sort((a, b) => b.fecha.localeCompare(a.fecha) || b.horaInicio.localeCompare(a.horaInicio)).map(r => (
                <tr key={r.id} className="border-b border-surface-50 hover:bg-surface-50 transition-colors group">
                  <td className="px-5 py-3 text-sm font-medium text-surface-800">{r.areaComunNombre}</td>
                  <td className="px-5 py-3"><p className="text-sm text-surface-700">{r.residenteNombre}</p><p className="text-xs text-surface-400">{r.inmuebleLabel}</p></td>
                  <td className="px-5 py-3 text-sm text-surface-600">{r.fecha}</td>
                  <td className="px-5 py-3 text-sm text-surface-600">{r.horaInicio} - {r.horaFin}</td>
                  <td className="px-5 py-3 text-sm font-semibold text-surface-800 text-right tabular-nums">{r.costoTotal > 0 ? `S/ ${r.costoTotal}` : "Gratis"}</td>
                  <td className="px-5 py-3">
                    <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full",
                      r.estado === "Confirmada" || r.estado === "Pagada" ? "bg-green-50 text-green-700" :
                      r.estado === "Solicitada" ? "bg-amber-50 text-amber-700" :
                      r.estado === "Cancelada" ? "bg-red-50 text-red-700" :
                      "bg-primary-50 text-primary-600")}>{r.estado}</span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => setForm({ mode: "edit", item: r })} className="p-1 rounded text-surface-400 hover:text-primary-600"><Edit className="h-3.5 w-3.5" /></button>
                      <button onClick={() => setDeleteTarget(r)} className="p-1 rounded text-surface-400 hover:text-red-600"><Trash2 className="h-3.5 w-3.5" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between px-5 py-3 border-t border-surface-100 text-xs text-surface-400">
          <span>{filtered.length} reservas</span>
        </div>
      </div>

      <FormDrawer open={form !== null} onClose={() => setForm(null)} onSubmit={handleSubmit} schema={schema}
        defaultValues={form?.item || undefined} title={form?.mode === "create" ? "Nueva Reserva" : "Editar Reserva"} fields={fields} />
      <ConfirmDialog open={deleteTarget !== null} onClose={() => setDeleteTarget(null)}
        onConfirm={() => { if (deleteTarget) store.remove(deleteTarget.id); setDeleteTarget(null); }}
        title="Eliminar reserva" message={`¿Eliminar reserva de "${deleteTarget?.residenteNombre}"?`} />
    </>
  );
}
