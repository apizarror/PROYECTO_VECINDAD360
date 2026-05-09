"use client";

import { useState, useCallback } from "react";
import { Car, Plus, Edit, Trash2, User, MapPin, Ticket } from "lucide-react";
import { HeaderPage } from "@/components/dashboard/header-page";
import { Button } from "@/components/ui/button";
import { FormDrawer } from "@/components/dashboard/form-drawer";
import { ConfirmDialog } from "@/components/dashboard/confirm-dialog";
import { useMockStore } from "@/hooks/use-mock-store";
import { vehiculos as initial } from "@/lib/mock-data/visitas";
import { residentes } from "@/lib/mock-data/residentes";
import { cn } from "@/lib/utils";
import { z } from "zod";
import type { Vehiculo } from "@/types";

const schema = z.object({
  id: z.string().min(1),
  placa: z.string().min(3),
  marca: z.string().min(2),
  modelo: z.string().min(1),
  color: z.string().min(1),
  ano: z.number().min(2000),
  tipo: z.enum(["Auto", "Moto", "Bicicleta"]),
  residenteId: z.string().min(1),
  residenteNombre: z.string(),
  inmuebleId: z.string(),
  inmuebleLabel: z.string(),
  espacioEstacionamiento: z.string().min(1),
  sticker: z.string(),
  estado: z.enum(["Activo", "Inactivo"]),
});

const tipoIcono: Record<string, string> = { Auto: "🚗", Moto: "🏍️", Bicicleta: "🚲" };

export default function VehiculosPage() {
  const store = useMockStore<Vehiculo>(initial);
  const [form, setForm] = useState<{ mode: "create" | "edit"; item?: Vehiculo } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Vehiculo | null>(null);

  const handleSubmit = useCallback((data: Record<string, unknown>) => {
    const id = (data.id as string) || crypto.randomUUID();
    const res = residentes.find(r => r.id === data.residenteId);
    const { id: _id, ...rest } = data;
    const item: Vehiculo = {
      ...rest as unknown as Vehiculo, id,
      residenteNombre: res ? `${res.nombres} ${res.apellidos}` : "",
      inmuebleLabel: res?.vinculaciones[0]?.inmuebleLabel || "",
    };
    if (form?.mode === "edit") store.update(id, item);
    else store.create(item);
    setForm(null);
  }, [form, store]);

  const fields = [
    { name: "placa", label: "Placa", type: "text" as const, placeholder: "ABC-123" },
    { name: "marca", label: "Marca", type: "text" as const },
    { name: "modelo", label: "Modelo", type: "text" as const },
    { name: "color", label: "Color", type: "text" as const },
    { name: "ano", label: "Año", type: "number" as const },
    { name: "tipo", label: "Tipo", type: "select" as const, options: ["Auto", "Moto", "Bicicleta"].map(t => ({ label: `${tipoIcono[t]} ${t}`, value: t })) },
    { name: "residenteId", label: "Residente", type: "select" as const, options: residentes.filter(r => r.activo).map(r => ({ label: `${r.nombres} ${r.apellidos}`, value: r.id })) },
    { name: "espacioEstacionamiento", label: "Espacio de estacionamiento", type: "text" as const },
    { name: "sticker", label: "Sticker/QR", type: "text" as const },
    { name: "estado", label: "Estado", type: "select" as const, options: [{ label: "Activo", value: "Activo" }, { label: "Inactivo", value: "Inactivo" }] },
  ];

  return (
    <>
      <HeaderPage icon={Car} title="Vehículos del Condominio" subtitle={`${store.items.length} vehículos registrados`}>
        <Button variant="accent" size="md" onClick={() => setForm({ mode: "create" })}>
          <Plus className="h-4 w-4 mr-1.5" /> Nuevo Vehículo
        </Button>
      </HeaderPage>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {store.items.map(v => (
          <div key={v.id} onClick={() => setForm({ mode: "edit", item: v })}
            className="bg-white rounded-2xl border border-surface-200 shadow-sm hover:shadow-md cursor-pointer group relative transition-all">
            <button onClick={e => { e.stopPropagation(); setDeleteTarget(v); }}
              className="absolute top-3 right-3 z-10 p-1.5 rounded-lg bg-white/80 text-surface-400 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all">
              <Trash2 className="h-4 w-4" />
            </button>
            <div className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{tipoIcono[v.tipo]}</span>
                  <div>
                    <h3 className="font-bold text-surface-800">{v.marca} {v.modelo}</h3>
                    <p className="text-xs text-surface-400">{v.ano} · {v.color}</p>
                  </div>
                </div>
                <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full", v.estado === "Activo" ? "bg-green-50 text-green-700" : "bg-surface-100 text-surface-500")}>{v.estado}</span>
              </div>
              <div className="space-y-1.5 mt-3 pt-3 border-t border-surface-100 text-xs">
                <div className="flex items-center gap-1.5 text-surface-600"><Ticket className="h-3 w-3 text-surface-400" /><span className="font-mono font-bold">{v.placa}</span></div>
                <div className="flex items-center gap-1.5 text-surface-500"><User className="h-3 w-3 text-surface-400" />{v.residenteNombre}</div>
                <div className="flex items-center gap-1.5 text-surface-500"><MapPin className="h-3 w-3 text-surface-400" />{v.espacioEstacionamiento} · Sticker {v.sticker}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <FormDrawer open={form !== null} onClose={() => setForm(null)} onSubmit={handleSubmit} schema={schema}
        defaultValues={form?.item || undefined} title={form?.mode === "create" ? "Nuevo Vehículo" : "Editar Vehículo"} fields={fields} />
      <ConfirmDialog open={deleteTarget !== null} onClose={() => setDeleteTarget(null)}
        onConfirm={() => { if (deleteTarget) store.remove(deleteTarget.id); setDeleteTarget(null); }}
        title="Eliminar vehículo" message={`¿Eliminar "${deleteTarget?.marca} ${deleteTarget?.modelo}"?`} />
    </>
  );
}
