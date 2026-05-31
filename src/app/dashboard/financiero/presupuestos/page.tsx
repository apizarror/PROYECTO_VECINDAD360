"use client";

import { useState, useCallback, useMemo } from "react";
import { BarChart3, Plus, Edit, Trash2, Loader2 } from "lucide-react";
import { HeaderPage } from "@/components/dashboard/header-page";
import { Button } from "@/components/ui/button";
import { FormDrawer } from "@/components/dashboard/form-drawer";
import { ConfirmDialog } from "@/components/dashboard/confirm-dialog";
import { useApiList, useApiCreate, useApiUpdate, useApiDelete } from "@/hooks/use-api";
import { cn } from "@/lib/utils";
import { z } from "zod";

interface Presupuesto {
  id: string;
  condominioId: string;
  ano: number;
  rubroNombre: string;
  montoPresupuestado: number;
  montoEjecutado: number;
  observaciones?: string | null;
  createdAt: string;
  updatedAt: string;
}

const schema = z.object({
  id: z.string().optional(),
  ano: z.number().min(2020).max(2100),
  rubroNombre: z.string().min(1),
  montoPresupuestado: z.number().min(0),
  montoEjecutado: z.number().min(0),
  observaciones: z.string().optional(),
});

export default function PresupuestosPage() {
  const { data: presupuestos = [], isLoading } = useApiList<Presupuesto>("presupuestos");
  const createMutation = useApiCreate<Presupuesto>("presupuestos");
  const updateMutation = useApiUpdate<Presupuesto>("presupuestos");
  const deleteMutation = useApiDelete("presupuestos");
  const [form, setForm] = useState<{ mode: "create" | "edit"; item?: Presupuesto } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Presupuesto | null>(null);

  const totalPresupuestado = useMemo(() => presupuestos.reduce((s, p) => s + p.montoPresupuestado, 0), [presupuestos]);
  const totalEjecutado = useMemo(() => presupuestos.reduce((s, p) => s + p.montoEjecutado, 0), [presupuestos]);

  const handleSubmit = useCallback(
    async (data: Record<string, unknown>) => {
      const id = (data.id as string) || crypto.randomUUID();
      const item = { ...data, id } as unknown as Presupuesto;
      if (form?.mode === "edit") await updateMutation.mutateAsync(item);
      else await createMutation.mutateAsync(item);
      setForm(null);
    },
    [form, createMutation, updateMutation]
  );

  const fields = [
    { name: "ano", label: "Año", type: "number" as const },
    { name: "rubroNombre", label: "Rubro", type: "text" as const },
    { name: "montoPresupuestado", label: "Monto Presupuestado (S/)", type: "number" as const },
    { name: "montoEjecutado", label: "Monto Ejecutado (S/)", type: "number" as const },
    { name: "observaciones", label: "Observaciones", type: "textarea" as const },
  ];

  if (isLoading) {
    return (
      <>
        <HeaderPage icon={BarChart3} title="Presupuestos" subtitle="Cargando..." />
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
        </div>
      </>
    );
  }

  return (
    <>
      <HeaderPage icon={BarChart3} title="Presupuestos" subtitle="Presupuestos anuales por rubro · 2026">
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-[10px] text-surface-400 uppercase">Total presupuestado</p>
            <p className="text-lg font-extrabold text-surface-800">S/ {totalPresupuestado.toLocaleString()}</p>
            <p className="text-xs text-surface-500">
              Ejecutado: S/ {totalEjecutado.toLocaleString()} ({totalPresupuestado > 0 ? Math.round((totalEjecutado / totalPresupuestado) * 100) : 0}%)
            </p>
          </div>
          <Button variant="accent" size="md" onClick={() => setForm({ mode: "create" })}>
            <Plus className="h-4 w-4 mr-1.5" />
            Nuevo Presupuesto
          </Button>
        </div>
      </HeaderPage>

      <div className="space-y-4">
        {presupuestos.map((p) => {
          const avance = p.montoPresupuestado > 0 ? Math.round((p.montoEjecutado / p.montoPresupuestado) * 100) : 0;
          return (
            <div key={p.id} className="bg-white rounded-2xl border border-surface-200 shadow-sm p-5 group">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-surface-800">{p.rubroNombre}</h3>
                  <p className="text-xs text-surface-400">{p.observaciones}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-sm font-bold text-surface-800">S/ {p.montoPresupuestado.toLocaleString()}</p>
                    <p className="text-xs text-surface-400">presupuestado</p>
                  </div>
                  <div className="flex gap-0.5 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => setForm({ mode: "edit", item: p })}
                      className="p-1 rounded text-surface-400 hover:text-primary-600"
                    >
                      <Edit className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => setDeleteTarget(p)}
                      className="p-1 rounded text-surface-400 hover:text-red-600"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-3 bg-surface-100 rounded-full overflow-hidden">
                  <div
                    className={cn("h-full rounded-full transition-all", avance > 80 ? "bg-red-500" : avance > 50 ? "bg-amber-500" : "bg-primary-500")}
                    style={{ width: `${Math.min(avance, 100)}%` }}
                  />
                </div>
                <span className="text-sm font-semibold text-surface-600 tabular-nums w-12 text-right">{avance}%</span>
              </div>
              <p className="text-xs text-surface-400 mt-2">Ejecutado: S/ {p.montoEjecutado.toLocaleString()}</p>
            </div>
          );
        })}
      </div>

      <FormDrawer
        open={form !== null}
        onClose={() => setForm(null)}
        onSubmit={handleSubmit}
        schema={schema}
        defaultValues={(form?.item as unknown as z.infer<typeof schema>) || { ano: 2026, montoEjecutado: 0 }}
        title={form?.mode === "create" ? "Nuevo Presupuesto" : "Editar Presupuesto"}
        fields={fields}
      />
      <ConfirmDialog
        open={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={async () => {
          if (deleteTarget) await deleteMutation.mutateAsync(deleteTarget.id);
          setDeleteTarget(null);
        }}
        title="Eliminar presupuesto"
        message={`¿Eliminar el presupuesto de "${deleteTarget?.rubroNombre}"?`}
      />
    </>
  );
}
