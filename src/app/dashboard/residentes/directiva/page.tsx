"use client";

import { useState, useCallback } from "react";
import { UserRoundCog, Plus, Trash2 } from "lucide-react";
import { HeaderPage } from "@/components/dashboard/header-page";
import { Button } from "@/components/ui/button";
import { FormDrawer } from "@/components/dashboard/form-drawer";
import { ConfirmDialog } from "@/components/dashboard/confirm-dialog";
import { useMockStore } from "@/hooks/use-mock-store";
import { directiva as initial, residentes } from "@/lib/mock-data/residentes";
import { cn } from "@/lib/utils";
import { z } from "zod";
import type { MiembroDirectiva } from "@/types";

const directivaSchema = z.object({
  id: z.string().optional(),
  residenteId: z.string().min(1, "Selecciona un residente"),
  residenteNombre: z.string().optional(),
  cargo: z.enum(["Presidente", "Vicepresidente", "Tesorero", "Secretario", "Vocal"]),
  fechaInicio: z.string().min(1, "Requerido"),
  fechaFin: z.string().min(1, "Requerido"),
  estado: z.enum(["Activo", "Histórico"]),
});

const cargoIcons: Record<string, string> = {
  Presidente: "👑",
  Vicepresidente: "⭐",
  Tesorero: "💰",
  Secretario: "📋",
  Vocal: "🎤",
};

export default function DirectivaPage() {
  const store = useMockStore<MiembroDirectiva>(initial);
  const [form, setForm] = useState<{ mode: "create" | "edit"; item?: MiembroDirectiva } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<MiembroDirectiva | null>(null);

  const openEdit = (item: MiembroDirectiva) => setForm({ mode: "edit", item });

  const handleSubmit = useCallback(
    (data: Record<string, unknown>) => {
      const id = (data.id as string) || crypto.randomUUID();
      const residente = residentes.find((r) => r.id === data.residenteId);
      const item: MiembroDirectiva = {
        id,
        residenteId: data.residenteId as string,
        residenteNombre: (data.residenteNombre as string) || (residente ? `${residente.nombres} ${residente.apellidos}` : ""),
        cargo: data.cargo as MiembroDirectiva["cargo"],
        fechaInicio: data.fechaInicio as string,
        fechaFin: data.fechaFin as string,
        estado: data.estado as "Activo" | "Histórico",
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
    { name: "cargo", label: "Cargo", type: "select" as const, options: ["Presidente", "Vicepresidente", "Tesorero", "Secretario", "Vocal"].map(c => ({ label: c, value: c })) },
    { name: "fechaInicio", label: "Fecha inicio", type: "text" as const, placeholder: "2026-01-01" },
    { name: "fechaFin", label: "Fecha fin", type: "text" as const, placeholder: "2027-12-31" },
    { name: "estado", label: "Estado", type: "select" as const, options: [{ label: "Activo", value: "Activo" }, { label: "Histórico", value: "Histórico" }] },
  ];

  return (
    <>
      <HeaderPage icon={UserRoundCog} title="Directiva" subtitle="Junta directiva del condominio">
        <Button variant="accent" size="md" onClick={() => setForm({ mode: "create" })}>
          <Plus className="h-4 w-4 mr-1.5" />
          Nuevo Miembro
        </Button>
      </HeaderPage>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {store.items.map((m) => (
          <div
            key={m.id}
            onClick={() => openEdit(m)}
            className={cn(
              "bg-white rounded-2xl border shadow-sm hover:shadow-md transition-all cursor-pointer group relative",
              m.estado === "Activo" ? "border-primary-200" : "border-surface-200 opacity-75"
            )}
          >
            <button
              onClick={(e) => { e.stopPropagation(); setDeleteTarget(m); }}
              className="absolute top-3 right-3 z-10 p-2 rounded-lg bg-white/80 text-surface-400 hover:text-red-500 hover:bg-red-50 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all"
            >
              <Trash2 className="h-4 w-4" />
            </button>
            <div className="p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 text-primary-700 text-sm font-bold">
                  {m.residenteNombre.split(" ").map((n) => n[0]).join("").substring(0, 2)}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-surface-800 truncate">{m.residenteNombre}</p>
                  <span className={cn(
                    "text-[10px] font-bold px-2 py-0.5 rounded-full",
                    m.estado === "Activo" ? "bg-green-50 text-green-700" : "bg-surface-100 text-surface-500"
                  )}>
                    {m.estado}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">{cargoIcons[m.cargo] || ""}</span>
                <p className="text-sm font-bold text-primary-700">{m.cargo}</p>
              </div>
              <p className="text-xs text-surface-400">
                {m.fechaInicio} → {m.fechaFin}
              </p>
            </div>
          </div>
        ))}
      </div>

      <FormDrawer
        open={form !== null}
        onClose={() => setForm(null)}
        onSubmit={handleSubmit}
        schema={directivaSchema}
        defaultValues={form?.item || undefined}
        title={form?.mode === "create" ? "Nuevo Miembro" : "Editar Miembro"}
        fields={fields}
      />

      <ConfirmDialog
        open={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Eliminar miembro"
        message={`¿Estás seguro de eliminar a "${deleteTarget?.residenteNombre}" de la directiva?`}
        confirmLabel="Eliminar"
        variant="danger"
      />
    </>
  );
}
