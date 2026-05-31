"use client";

import { useState, useCallback } from "react";
import { Landmark, Plus, Send, Loader2 } from "lucide-react";
import { HeaderPage } from "@/components/dashboard/header-page";
import { Button } from "@/components/ui/button";
import { FormDrawer } from "@/components/dashboard/form-drawer";
import { useApiList, useApiCreate, useApiUpdate } from "@/hooks/use-api";
import { cn } from "@/lib/utils";
import { z } from "zod";
import type { CuotaMantenimiento } from "@/types";

const cuotaSchema = z.object({
  id: z.string().optional(),
  periodo: z.string().min(1, "Requerido"),
  tipo: z.enum(["Ordinaria", "Extraordinaria"]),
  montoBase: z.number().min(1, "Mínimo S/ 1"),
  criterio: z.enum(["Igual", "Alícuota", "Personalizado"]),
  fechaEmision: z.string().min(1, "Requerido"),
  fechaVencimiento: z.string().min(1, "Requerido"),
  moraDiaria: z.number().min(0).max(10),
  estado: z.enum(["Borrador", "Emitida", "Vencida", "Cerrada"]).default("Borrador"),
  inmueblesAplicados: z.number().default(0),
  totalEmitido: z.number().default(0),
  totalCobrado: z.number().default(0),
});

export default function CuotasPage() {
  const { data: items = [], isLoading } = useApiList<CuotaMantenimiento>("cuotas");
  const createMutation = useApiCreate<CuotaMantenimiento>("cuotas");
  const updateMutation = useApiUpdate<CuotaMantenimiento>("cuotas");
  const [form, setForm] = useState<{ mode: "create" | "edit"; item?: CuotaMantenimiento } | null>(null);

  const handleEmitir = useCallback(async (cuota: CuotaMantenimiento) => {
    await updateMutation.mutateAsync({ ...cuota, estado: "Emitida", inmueblesAplicados: 12, totalEmitido: cuota.montoBase * 12 });
  }, [updateMutation]);

  const handleSubmit = useCallback(
    async (data: Record<string, unknown>) => {
      const id = (data.id as string) || crypto.randomUUID();
      const item: CuotaMantenimiento = {
        id,
        periodo: data.periodo as string,
        tipo: data.tipo as "Ordinaria" | "Extraordinaria",
        montoBase: data.montoBase as number,
        criterio: data.criterio as "Igual" | "Alícuota" | "Personalizado",
        fechaEmision: data.fechaEmision as string,
        fechaVencimiento: data.fechaVencimiento as string,
        moraDiaria: data.moraDiaria as number,
        estado: (data.estado as CuotaMantenimiento["estado"]) || "Borrador",
        inmueblesAplicados: (data.inmueblesAplicados as number) || 0,
        totalEmitido: (data.totalEmitido as number) || 0,
        totalCobrado: (data.totalCobrado as number) || 0,
      };
      if (form?.mode === "edit") await updateMutation.mutateAsync(item);
      else await createMutation.mutateAsync(item);
      setForm(null);
    },
    [form, createMutation, updateMutation]
  );

  const fields = [
    { name: "periodo", label: "Periodo (YYYY-MM)", type: "text" as const, placeholder: "2026-06" },
    { name: "tipo", label: "Tipo", type: "select" as const, options: [{ label: "Ordinaria", value: "Ordinaria" }, { label: "Extraordinaria", value: "Extraordinaria" }] },
    { name: "montoBase", label: "Monto base (S/)", type: "number" as const },
    { name: "criterio", label: "Criterio", type: "select" as const, options: ["Igual", "Alícuota", "Personalizado"].map((c) => ({ label: c, value: c })) },
    { name: "fechaEmision", label: "Fecha de emisión", type: "text" as const, placeholder: "2026-06-01" },
    { name: "fechaVencimiento", label: "Fecha de vencimiento", type: "text" as const, placeholder: "2026-06-20" },
    { name: "moraDiaria", label: "Mora diaria (%)", type: "number" as const },
  ];

  if (isLoading) {
    return (
      <>
        <HeaderPage icon={Landmark} title="Cuotas de Mantenimiento" subtitle="Cargando..." />
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
        </div>
      </>
    );
  }

  return (
    <>
      <HeaderPage icon={Landmark} title="Cuotas de Mantenimiento" subtitle="Cuotas mensuales ordinarias y extraordinarias">
        <Button variant="accent" size="md" onClick={() => setForm({ mode: "create" })}>
          <Plus className="h-4 w-4 mr-1.5" />
          Nueva Cuota
        </Button>
      </HeaderPage>

      <div className="space-y-3">
        {[...items]
          .sort((a, b) => b.periodo.localeCompare(a.periodo))
          .map((cuota) => (
            <div key={cuota.id} className="bg-white rounded-2xl border border-surface-200 shadow-sm hover:shadow-md transition-all">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4">
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-xl text-white font-bold text-sm",
                    cuota.tipo === "Ordinaria" ? "bg-primary-600" : "bg-accent-500"
                  )}>
                    {cuota.periodo.substring(5)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-surface-800">{cuota.periodo}</h3>
                      <span className={cn(
                        "text-[10px] font-bold px-2 py-0.5 rounded-full",
                        cuota.tipo === "Ordinaria" ? "bg-blue-50 text-blue-600" : "bg-purple-50 text-purple-600"
                      )}>
                        {cuota.tipo}
                      </span>
                      <span className={cn(
                        "text-[10px] font-bold px-2 py-0.5 rounded-full",
                        cuota.estado === "Emitida" ? "bg-green-50 text-green-700" :
                        cuota.estado === "Vencida" ? "bg-red-50 text-red-700" :
                        cuota.estado === "Cerrada" ? "bg-surface-100 text-surface-500" :
                        "bg-amber-50 text-amber-700"
                      )}>
                        {cuota.estado}
                      </span>
                    </div>
                    <p className="text-xs text-surface-400 mt-0.5">
                      Emisión: {cuota.fechaEmision} · Vence: {cuota.fechaVencimiento} · Mora: {cuota.moraDiaria}% diario
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 sm:gap-6">
                  <div className="text-right">
                    <p className="text-[10px] text-surface-400 uppercase">Monto base</p>
                    <p className="text-lg font-extrabold text-surface-800">S/ {cuota.montoBase}</p>
                    <p className="text-[10px] text-surface-400">{cuota.criterio}</p>
                  </div>
                  {cuota.estado !== "Borrador" && (
                    <>
                      <div className="text-right">
                        <p className="text-[10px] text-surface-400 uppercase">Emitido</p>
                        <p className="text-sm font-semibold text-surface-600">S/ {cuota.totalEmitido.toLocaleString()}</p>
                        <p className="text-[10px] text-surface-400">{cuota.inmueblesAplicados} inmuebles</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] text-surface-400 uppercase">Cobrado</p>
                        <p className={cn("text-sm font-semibold", cuota.totalCobrado === cuota.totalEmitido ? "text-green-600" : "text-surface-600")}>
                          S/ {cuota.totalCobrado.toLocaleString()}
                          <span className="text-xs text-surface-400 ml-1">
                            ({cuota.totalEmitido > 0 ? Math.round((cuota.totalCobrado / cuota.totalEmitido) * 100) : 0}%)
                          </span>
                        </p>
                      </div>
                    </>
                  )}
                </div>

                <div className="flex items-center gap-1.5">
                  {(cuota.estado === "Borrador") && (
                    <Button variant="primary" size="sm" onClick={() => handleEmitir(cuota)}>
                      <Send className="h-3.5 w-3.5 mr-1" />
                      Emitir
                    </Button>
                  )}
                  <Button variant="ghost" size="sm" onClick={() => setForm({ mode: "edit", item: cuota })}>
                    Editar
                  </Button>
                </div>
              </div>
            </div>
          ))}
      </div>

      <FormDrawer
        open={form !== null}
        onClose={() => setForm(null)}
        onSubmit={handleSubmit}
        schema={cuotaSchema}
        defaultValues={form?.item || undefined}
        title={form?.mode === "create" ? "Nueva Cuota" : "Editar Cuota"}
        fields={fields}
      />
    </>
  );
}
