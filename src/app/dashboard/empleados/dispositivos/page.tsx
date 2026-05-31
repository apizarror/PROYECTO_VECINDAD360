"use client";

import { useState, useCallback } from "react";
import { Radio, Plus, Trash2, Loader2 } from "lucide-react";
import { HeaderPage } from "@/components/dashboard/header-page";
import { Button } from "@/components/ui/button";
import { FormDrawer } from "@/components/dashboard/form-drawer";
import { ConfirmDialog } from "@/components/dashboard/confirm-dialog";
import { useApiList, useApiCreate, useApiUpdate, useApiDelete } from "@/hooks/use-api";
import { cn } from "@/lib/utils";
import { z } from "zod";
import type { Empleado } from "@/types";

interface DispositivoWithRelations {
  id: string;
  tipo: string;
  marca: string;
  modelo: string;
  numeroSerie: string;
  empleadoId?: string;
  empleado?: { nombres: string; apellidos: string };
  fechaAsignacion?: string;
  estado: "Asignado" | "Disponible" | "Mantenimiento" | "Baja";
}

const schema = z.object({
  id: z.string().optional(),
  tipo: z.string().min(2),
  marca: z.string().min(1),
  modelo: z.string().min(1),
  numeroSerie: z.string().min(1),
  empleadoId: z.string().optional(),
  fechaAsignacion: z.string().optional(),
  estado: z.enum(["Asignado", "Disponible", "Mantenimiento", "Baja"]),
});

export default function DispositivosPage() {
  const { data: items = [], isLoading } = useApiList<DispositivoWithRelations>("dispositivos");
  const createMutation = useApiCreate<DispositivoWithRelations>("dispositivos");
  const updateMutation = useApiUpdate<DispositivoWithRelations>("dispositivos");
  const deleteMutation = useApiDelete("dispositivos");
  const { data: empleados = [] } = useApiList<Empleado>("empleados");
  const [form, setForm] = useState<{ mode: "create" | "edit"; item?: DispositivoWithRelations } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<DispositivoWithRelations | null>(null);

  const getEmpleadoNombre = (d: DispositivoWithRelations) =>
    d.empleado ? `${d.empleado.nombres} ${d.empleado.apellidos}` : "";

  const handleSubmit = useCallback(
    async (data: Record<string, unknown>) => {
      const id = (data.id as string) || crypto.randomUUID();
      const item = {
        ...data,
        id,
        empleadoId: (data.empleadoId as string) || undefined,
      } as unknown as DispositivoWithRelations;
      if (form?.mode === "edit") await updateMutation.mutateAsync(item);
      else await createMutation.mutateAsync(item);
      setForm(null);
    },
    [form, createMutation, updateMutation]
  );

  const fields = [
    { name: "tipo", label: "Tipo", type: "text" as const, placeholder: "Radio, Tablet, Llave..." },
    { name: "marca", label: "Marca", type: "text" as const },
    { name: "modelo", label: "Modelo", type: "text" as const },
    { name: "numeroSerie", label: "N de serie", type: "text" as const },
    {
      name: "empleadoId",
      label: "Empleado asignado",
      type: "select" as const,
      options: empleados
        .filter((e) => e.estado === "Activo")
        .map((e) => ({ label: `${e.nombres} ${e.apellidos}`, value: e.id })),
    },
    { name: "fechaAsignacion", label: "Fecha de asignacion", type: "text" as const },
    {
      name: "estado",
      label: "Estado",
      type: "select" as const,
      options: ["Asignado", "Disponible", "Mantenimiento", "Baja"].map((e) => ({
        label: e,
        value: e,
      })),
    },
  ];

  if (isLoading) {
    return (
      <>
        <HeaderPage icon={Radio} title="Dispositivos" subtitle="Cargando..." />
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
        </div>
      </>
    );
  }

  return (
    <>
      <HeaderPage
        icon={Radio}
        title="Dispositivos"
        subtitle={`${items.length} dispositivos`}
      >
        <Button variant="accent" size="md" onClick={() => setForm({ mode: "create" })}>
          <Plus className="h-4 w-4 mr-1.5" />
          Nuevo Dispositivo
        </Button>
      </HeaderPage>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {items.map((d) => {
          const empleadoNombre = getEmpleadoNombre(d);
          return (
            <div
              key={d.id}
              onClick={() => setForm({ mode: "edit", item: d })}
              className="bg-white rounded-2xl border border-surface-200 shadow-sm hover:shadow-md cursor-pointer group relative transition-all"
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setDeleteTarget(d);
                }}
                className="absolute top-3 right-3 z-10 p-2 rounded-lg bg-white/80 text-surface-400 hover:text-red-500 hover:bg-red-50 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all"
              >
                <Trash2 className="h-4 w-4" />
              </button>
              <div className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold text-surface-800">{d.tipo}</span>
                  <span
                    className={cn(
                      "text-[10px] font-bold px-2 py-0.5 rounded-full",
                      d.estado === "Asignado"
                        ? "bg-green-50 text-green-700"
                        : d.estado === "Disponible"
                        ? "bg-blue-50 text-blue-600"
                        : d.estado === "Mantenimiento"
                        ? "bg-amber-50 text-amber-700"
                        : "bg-surface-100 text-surface-500"
                    )}
                  >
                    {d.estado}
                  </span>
                </div>
                <p className="text-xs text-surface-500">
                  {d.marca} {d.modelo}
                </p>
                <p className="text-xs text-surface-400 font-mono mt-1">{d.numeroSerie}</p>
                {empleadoNombre && (
                  <p className="text-xs text-surface-600 mt-2 pt-2 border-t border-surface-100">
                    Asignado a: <span className="font-medium">{empleadoNombre}</span>
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <FormDrawer
        open={form !== null}
        onClose={() => setForm(null)}
        onSubmit={handleSubmit}
        schema={schema}
        defaultValues={form?.item || undefined}
        title={form?.mode === "create" ? "Nuevo Dispositivo" : "Editar Dispositivo"}
        fields={fields}
      />
      <ConfirmDialog
        open={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={async () => {
          if (deleteTarget) await deleteMutation.mutateAsync(deleteTarget.id);
          setDeleteTarget(null);
        }}
        title="Eliminar dispositivo"
        message={`Eliminar "${deleteTarget?.marca} ${deleteTarget?.modelo}"?`}
      />
    </>
  );
}
