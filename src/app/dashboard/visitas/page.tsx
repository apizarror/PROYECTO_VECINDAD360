"use client";

import { useState, useCallback, useMemo } from "react";
import { PersonStanding, Plus, Search, Edit, Trash2, Users, Clock, CheckCircle, CalendarCheck, Loader2 } from "lucide-react";
import { HeaderPage } from "@/components/dashboard/header-page";
import { Button } from "@/components/ui/button";
import { FormDrawer } from "@/components/dashboard/form-drawer";
import { ConfirmDialog } from "@/components/dashboard/confirm-dialog";
import { useApiList, useApiCreate, useApiUpdate, useApiDelete } from "@/hooks/use-api";
import { cn } from "@/lib/utils";
import { z } from "zod";
import type { Visita, Persona, Inmueble } from "@/types";

const schema = z.object({
  id: z.string().optional(),
  visitanteDni: z.string().min(8),
  visitanteNombre: z.string().min(3),
  inmuebleId: z.string().min(1),
  personaId: z.string().min(1),
  motivo: z.string().min(2),
  fechaHoraIngreso: z.string().min(1),
  fechaHoraSalida: z.string().optional(),
  estado: z.enum(["Activa", "Programada", "Completada", "Rechazada"]),
  vehiculoPlaca: z.string().optional(),
});

const nowDatetime = new Date().toISOString().slice(0, 16);

export default function VisitasPage() {
  const { data: items = [], isLoading } = useApiList<Visita>("visitas");
  const createMutation = useApiCreate<Visita>("visitas");
  const updateMutation = useApiUpdate<Visita>("visitas");
  const deleteMutation = useApiDelete("visitas");
  const { data: residentes = [] } = useApiList<Persona>("personas");
  const { data: inmuebles = [] } = useApiList<Inmueble>("inmuebles");
  const [search, setSearch] = useState("");
  const [estadoFilter, setEstadoFilter] = useState("Todas");
  const [form, setForm] = useState<{ mode: "create" | "edit"; item?: Visita } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Visita | null>(null);

  const kpis = useMemo(() => ({
    total: items.length,
    activas: items.filter(v => v.estado === "Activa").length,
    programadas: items.filter(v => v.estado === "Programada").length,
    completadas: items.filter(v => v.estado === "Completada").length,
  }), [items]);

  const filtered = useMemo(() => {
    let result = items;
    if (search) { const q = search.toLowerCase(); result = result.filter(v => v.visitanteNombre.toLowerCase().includes(q) || (v.persona?.nombres || "").toLowerCase().includes(q)); }
    if (estadoFilter !== "Todas") result = result.filter(v => v.estado === estadoFilter);
    return result;
  }, [items, search, estadoFilter]);

  const handleSubmit = useCallback(async (data: Record<string, unknown>) => {
    const body: Record<string, unknown> = {
      visitanteDni: data.visitanteDni,
      visitanteNombre: data.visitanteNombre,
      inmuebleId: data.inmuebleId,
      personaId: data.personaId,
      motivo: data.motivo,
      fechaHoraIngreso: data.fechaHoraIngreso,
      fechaHoraSalida: data.fechaHoraSalida || undefined,
      estado: data.estado,
      vehiculoPlaca: data.vehiculoPlaca || undefined,
    };
    if (form?.mode === "edit") {
      await updateMutation.mutateAsync({ ...body, id: data.id as string } as unknown as Visita);
    } else {
      await createMutation.mutateAsync(body as unknown as Visita);
    }
    setForm(null);
  }, [form, createMutation, updateMutation]);

  const fields = [
    { name: "visitanteDni", label: "DNI del visitante", type: "text" as const },
    { name: "visitanteNombre", label: "Nombre del visitante", type: "text" as const },
    { name: "inmuebleId", label: "Inmueble destino", type: "select" as const, options: inmuebles.map(i => ({ label: i.numero, value: i.id })) },
    { name: "personaId", label: "Residente anfitrión", type: "select" as const, options: residentes.filter(r => r.activo).map(r => ({ label: `${r.nombres} ${r.apellidos}`, value: r.id })) },
    { name: "motivo", label: "Motivo de visita", type: "text" as const },
    { name: "fechaHoraIngreso", label: "Fecha/Hora ingreso", type: "datetime-local" as const },
    { name: "vehiculoPlaca", label: "Placa vehículo (opcional)", type: "text" as const },
    { name: "estado", label: "Estado", type: "select" as const, options: ["Activa", "Programada", "Completada", "Rechazada"].map(e => ({ label: e, value: e })) },
  ];

  const estados = ["Todas", "Activa", "Programada", "Completada", "Rechazada"] as const;

  const kpiCards = [
    { label: "Total año", value: kpis.total, icon: Users, color: "text-primary-600 bg-primary-50" },
    { label: "Activas", value: kpis.activas, icon: Clock, color: "text-green-600 bg-green-50" },
    { label: "Programadas", value: kpis.programadas, icon: CalendarCheck, color: "text-amber-600 bg-amber-50" },
    { label: "Completadas", value: kpis.completadas, icon: CheckCircle, color: "text-surface-600 bg-surface-100" },
  ];

  if (isLoading) {
    return (
      <>
        <HeaderPage icon={PersonStanding} title="Visitas" subtitle="Cargando..." />
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
        </div>
      </>
    );
  }

  return (
    <>
      <HeaderPage icon={PersonStanding} title="Visitas" subtitle="Control de visitantes">
        <Button variant="accent" size="md" onClick={() => setForm({ mode: "create" })}>
          <Plus className="h-4 w-4 mr-1.5" /> Registrar Visita
        </Button>
      </HeaderPage>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {kpiCards.map(k => (
          <div key={k.label} className="bg-white rounded-2xl border border-surface-200 p-4 shadow-sm flex items-center gap-3">
            <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl", k.color)}>
              <k.icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] font-medium text-surface-500 uppercase">{k.label}</p>
              <p className="text-xl font-extrabold text-surface-800 tabular-nums">{k.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-surface-400" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar visitante..."
            className="w-full sm:max-w-xs pl-10 pr-4 py-2.5 rounded-xl border border-surface-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20" />
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
                <th className="px-5 py-3">Visitante</th><th className="px-5 py-3">DNI</th><th className="px-5 py-3">Anfitrión</th><th className="px-5 py-3">Inmueble</th>
                <th className="px-5 py-3">Ingreso</th><th className="px-5 py-3">Salida</th><th className="px-5 py-3">Estado</th><th className="px-5 py-3 w-10" />
              </tr>
            </thead>
            <tbody>
              {filtered.map(v => (
                <tr key={v.id} className="border-b border-surface-50 hover:bg-surface-50 transition-colors group">
                  <td className="px-5 py-3 text-sm font-medium text-surface-800">{v.visitanteNombre}</td>
                  <td className="px-5 py-3 text-sm text-surface-600 font-mono">{v.visitanteDni}</td>
                  <td className="px-5 py-3 text-sm text-surface-700">{v.persona?.nombres} {v.persona?.apellidos}</td>
                  <td className="px-5 py-3 text-xs text-surface-500">{v.inmueble?.numero || "—"}</td>
                  <td className="px-5 py-3 text-sm text-surface-600">{v.fechaHoraIngreso}</td>
                  <td className="px-5 py-3 text-sm text-surface-400">{v.fechaHoraSalida || "—"}</td>
                  <td className="px-5 py-3">
                    <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full",
                      v.estado === "Activa" ? "bg-green-50 text-green-700" : v.estado === "Programada" ? "bg-amber-50 text-amber-700" :
                      v.estado === "Completada" ? "bg-primary-50 text-primary-600" : "bg-red-50 text-red-700")}>{v.estado}</span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex gap-0.5 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                      <button onClick={() => setForm({ mode: "edit", item: v })} className="p-1 rounded text-surface-400 hover:text-primary-600"><Edit className="h-3.5 w-3.5" /></button>
                      <button onClick={() => setDeleteTarget(v)} className="p-1 rounded text-surface-400 hover:text-red-600"><Trash2 className="h-3.5 w-3.5" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between px-5 py-3 border-t border-surface-100 text-xs text-surface-400">
          <span>{filtered.length} visitas</span>
        </div>
      </div>

      <FormDrawer open={form !== null} onClose={() => setForm(null)} onSubmit={handleSubmit} schema={schema}
        defaultValues={form?.mode === "edit" ? form.item : { fechaHoraIngreso: nowDatetime }} title={form?.mode === "create" ? "Registrar Visita" : "Editar Visita"} fields={fields} />
      <ConfirmDialog open={deleteTarget !== null} onClose={() => setDeleteTarget(null)}
        onConfirm={async () => { if (deleteTarget) await deleteMutation.mutateAsync(deleteTarget.id); setDeleteTarget(null); }}
        title="Eliminar visita" message={`¿Eliminar visita de "${deleteTarget?.visitanteNombre}"?`} />
    </>
  );
}
