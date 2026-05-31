"use client";

import { useState, useCallback } from "react";
import { Building2, Plus, Trash2, Users, Clock, Shield, DollarSign } from "lucide-react";
import { HeaderPage } from "@/components/dashboard/header-page";
import { Button } from "@/components/ui/button";
import { FormDrawer } from "@/components/dashboard/form-drawer";
import { ConfirmDialog } from "@/components/dashboard/confirm-dialog";
import { useMockStore } from "@/hooks/use-mock-store";
import { areasComunes as initial } from "@/lib/mock-data/areas-comunes";
import { cn } from "@/lib/utils";
import { z } from "zod";
import type { AreaComun } from "@/types";

const schema = z.object({
  id: z.string().optional(),
  nombre: z.string().min(2),
  descripcion: z.string().min(5),
  costoPorHora: z.number().min(0),
  modoReserva: z.enum(["Por hora", "Medio día", "Todo el día"]),
  capacidadMaxima: z.number().min(1),
  requiereGarantia: z.boolean().default(false),
  montoGarantia: z.number().min(0).default(0),
  reglasUso: z.string().default(""),
  estado: z.enum(["Activa", "Inactiva"]),
  reservasActivas: z.number().default(0),
});

export default function AreasPage() {
  const store = useMockStore<AreaComun>(initial);
  const [form, setForm] = useState<{ mode: "create" | "edit"; item?: AreaComun } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AreaComun | null>(null);

  const handleSubmit = useCallback((data: Record<string, unknown>) => {
    const id = (data.id as string) || crypto.randomUUID();
    const item: AreaComun = { ...data as unknown as AreaComun, id };
    if (form?.mode === "edit") store.update(id, item);
    else store.create(item);
    setForm(null);
  }, [form, store]);

  const fields = [
    { name: "nombre", label: "Nombre del área", type: "text" as const, placeholder: "Ej: Parrilla" },
    { name: "descripcion", label: "Descripción", type: "textarea" as const },
    { name: "costoPorHora", label: "Costo por hora (S/)", type: "number" as const },
    { name: "modoReserva", label: "Modo de reserva", type: "select" as const, options: ["Por hora", "Medio día", "Todo el día"].map(m => ({ label: m, value: m })) },
    { name: "capacidadMaxima", label: "Capacidad máxima", type: "number" as const },
    { name: "reglasUso", label: "Reglas de uso", type: "textarea" as const },
    { name: "estado", label: "Estado", type: "select" as const, options: [{ label: "Activa", value: "Activa" }, { label: "Inactiva", value: "Inactiva" }] },
  ];

  return (
    <>
      <HeaderPage icon={Building2} title="Áreas Comunes" subtitle="Catálogo de espacios reservables">
        <Button variant="accent" size="md" onClick={() => setForm({ mode: "create" })}>
          <Plus className="h-4 w-4 mr-1.5" /> Nueva Área
        </Button>
      </HeaderPage>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {store.items.map(a => (
          <div key={a.id} onClick={() => setForm({ mode: "edit", item: a })}
            className={cn("bg-white rounded-2xl border shadow-sm hover:shadow-md cursor-pointer group relative transition-all overflow-hidden",
              a.estado === "Activa" ? "border-surface-200" : "border-surface-200 opacity-60")}>
            <button onClick={e => { e.stopPropagation(); setDeleteTarget(a); }}
              className="absolute top-3 right-3 z-10 p-2 rounded-lg bg-white/80 text-surface-400 hover:text-red-500 hover:bg-red-50 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all">
              <Trash2 className="h-4 w-4" />
            </button>
            <div className={cn("h-2", a.estado === "Activa" ? "bg-primary-500" : "bg-surface-300")} />
            <div className="p-5">
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-bold text-surface-800 text-lg">{a.nombre}</h3>
                <div className="flex gap-1.5">
                  <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full", a.estado === "Activa" ? "bg-green-50 text-green-700" : "bg-surface-100 text-surface-500")}>{a.estado}</span>
                  {a.reservasActivas > 0 && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary-50 text-primary-600">{a.reservasActivas} reservas</span>
                  )}
                </div>
              </div>
              <p className="text-xs text-surface-500 line-clamp-2 mb-4">{a.descripcion}</p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-1.5 text-surface-500"><DollarSign className="h-3 w-3" />{a.costoPorHora > 0 ? `S/ ${a.costoPorHora}/h` : "Gratis"}</div>
                <div className="flex items-center gap-1.5 text-surface-500"><Clock className="h-3 w-3" />{a.modoReserva}</div>
                <div className="flex items-center gap-1.5 text-surface-500"><Users className="h-3 w-3" />{a.capacidadMaxima} pers.</div>
                <div className="flex items-center gap-1.5 text-surface-500"><Shield className="h-3 w-3" />{a.requiereGarantia ? `S/ ${a.montoGarantia}` : "Sin garantía"}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <FormDrawer open={form !== null} onClose={() => setForm(null)} onSubmit={handleSubmit} schema={schema}
        defaultValues={form?.item || undefined} title={form?.mode === "create" ? "Nueva Área" : "Editar Área"} fields={fields} />
      <ConfirmDialog open={deleteTarget !== null} onClose={() => setDeleteTarget(null)}
        onConfirm={() => { if (deleteTarget) store.remove(deleteTarget.id); setDeleteTarget(null); }}
        title="Eliminar área" message={`¿Eliminar "${deleteTarget?.nombre}"?`} />
    </>
  );
}
