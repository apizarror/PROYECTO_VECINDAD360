"use client";

import { useState, useCallback } from "react";
import { UserRoundCog, Plus, Trash2, Loader2 } from "lucide-react";
import { HeaderPage } from "@/components/dashboard/header-page";
import { Button } from "@/components/ui/button";
import { FormDrawer } from "@/components/dashboard/form-drawer";
import { ConfirmDialog } from "@/components/dashboard/confirm-dialog";
import { useApiList, useApiCreate, useApiUpdate, useApiDelete } from "@/hooks/use-api";
import { cn } from "@/lib/utils";
import { z } from "zod";
import type { Persona } from "@/types";

interface MiembroDirectivaWithRelations {
  id: string;
  personaId: string;
  persona?: { nombres: string; apellidos: string };
  cargo: "Presidente" | "Vicepresidente" | "Tesorero" | "Secretario" | "Vocal";
  fechaInicio: string;
  fechaFin: string;
  estado: "Activo" | "Historico";
}

const directivaSchema = z.object({
  id: z.string().optional(),
  personaId: z.string().min(1, "Selecciona un residente"),
  cargo: z.enum(["Presidente", "Vicepresidente", "Tesorero", "Secretario", "Vocal"]),
  fechaInicio: z.string().min(1, "Requerido"),
  fechaFin: z.string().min(1, "Requerido"),
  estado: z.enum(["Activo", "Historico"]),
});

const cargoIcons: Record<string, string> = {
  Presidente: "\u{1F451}",
  Vicepresidente: "\u2B50",
  Tesorero: "\u{1F4B0}",
  Secretario: "\u{1F4CB}",
  Vocal: "\u{1F3A4}",
};

export default function DirectivaPage() {
  const { data: items = [], isLoading } = useApiList<MiembroDirectivaWithRelations>("directiva");
  const createMutation = useApiCreate<MiembroDirectivaWithRelations>("directiva");
  const updateMutation = useApiUpdate<MiembroDirectivaWithRelations>("directiva");
  const deleteMutation = useApiDelete("directiva");
  const { data: residentes = [] } = useApiList<Persona>("personas");
  const [form, setForm] = useState<{ mode: "create" | "edit"; item?: MiembroDirectivaWithRelations } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<MiembroDirectivaWithRelations | null>(null);

  const getResidenteNombre = (m: MiembroDirectivaWithRelations) =>
    m.persona ? `${m.persona.nombres} ${m.persona.apellidos}` : "";

  const openEdit = (item: MiembroDirectivaWithRelations) => setForm({ mode: "edit", item });

  const handleSubmit = useCallback(
    async (data: Record<string, unknown>) => {
      const id = (data.id as string) || crypto.randomUUID();
      const item = {
        id,
        personaId: data.personaId as string,
        cargo: data.cargo as MiembroDirectivaWithRelations["cargo"],
        fechaInicio: data.fechaInicio as string,
        fechaFin: data.fechaFin as string,
        estado: data.estado as "Activo" | "Historico",
      };
      if (form?.mode === "edit") await updateMutation.mutateAsync(item as MiembroDirectivaWithRelations);
      else await createMutation.mutateAsync(item);
      setForm(null);
    },
    [form, createMutation, updateMutation]
  );

  const handleDelete = useCallback(async () => {
    if (deleteTarget) await deleteMutation.mutateAsync(deleteTarget.id);
    setDeleteTarget(null);
  }, [deleteTarget, deleteMutation]);

  const fields = [
    { name: "personaId", label: "Residente", type: "select" as const, options: residentes.filter(r => r.activo).map(r => ({ label: `${r.nombres} ${r.apellidos}`, value: r.id })) },
    { name: "cargo", label: "Cargo", type: "select" as const, options: ["Presidente", "Vicepresidente", "Tesorero", "Secretario", "Vocal"].map(c => ({ label: c, value: c })) },
    { name: "fechaInicio", label: "Fecha inicio", type: "text" as const, placeholder: "2026-01-01" },
    { name: "fechaFin", label: "Fecha fin", type: "text" as const, placeholder: "2027-12-31" },
    { name: "estado", label: "Estado", type: "select" as const, options: [{ label: "Activo", value: "Activo" }, { label: "Historico", value: "Historico" }] },
  ];

  if (isLoading) {
    return (
      <>
        <HeaderPage icon={UserRoundCog} title="Directiva" subtitle="Junta directiva del condominio" />
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
        </div>
      </>
    );
  }

  return (
    <>
      <HeaderPage icon={UserRoundCog} title="Directiva" subtitle="Junta directiva del condominio">
        <Button variant="accent" size="md" onClick={() => setForm({ mode: "create" })}>
          <Plus className="h-4 w-4 mr-1.5" />
          Nuevo Miembro
        </Button>
      </HeaderPage>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {items.map((m) => {
          const nombre = getResidenteNombre(m);
          return (
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
                    {nombre.split(" ").map((n) => n[0]).join("").substring(0, 2)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-surface-800 truncate">{nombre}</p>
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
                  {m.fechaInicio} &rarr; {m.fechaFin}
                </p>
              </div>
            </div>
          );
        })}
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
        message={`Estas seguro de eliminar a "${deleteTarget ? getResidenteNombre(deleteTarget) : ""}" de la directiva?`}
        confirmLabel="Eliminar"
        variant="danger"
      />
    </>
  );
}
