"use client";

import { useState, useCallback, useMemo } from "react";
import { TrendingUp, Plus, Search, Edit, Trash2, Loader2 } from "lucide-react";
import { HeaderPage } from "@/components/dashboard/header-page";
import { Button } from "@/components/ui/button";
import { FormDrawer } from "@/components/dashboard/form-drawer";
import { ConfirmDialog } from "@/components/dashboard/confirm-dialog";
import { useApiList, useApiCreate, useApiUpdate, useApiDelete } from "@/hooks/use-api";
import { cn } from "@/lib/utils";
import { z } from "zod";
import type { CuentaBancaria } from "@/types";

interface IngresoWithRelations {
  id: string;
  concepto: string;
  monto: number;
  origen: "Cuota" | "Multa" | "Reserva" | "Donacion" | "Otro";
  personaId?: string;
  persona?: { nombres: string; apellidos: string };
  inmuebleId?: string;
  inmueble?: { numero: string };
  cuentaBancariaId: string;
  cuentaBancaria?: { banco: string; tipo: string };
  metodoPago: "Efectivo" | "Transferencia" | "Yape" | "Plin" | "Tarjeta";
  fecha: string;
  estado: "Confirmado" | "Pendiente" | "Anulado";
  registradoPor: string;
}

const schema = z.object({
  id: z.string().optional(),
  concepto: z.string().min(3),
  monto: z.number().min(1),
  origen: z.enum(["Cuota", "Multa", "Reserva", "Donacion", "Otro"]),
  personaId: z.string().optional(),
  cuentaBancariaId: z.string().min(1),
  metodoPago: z.enum(["Efectivo", "Transferencia", "Yape", "Plin", "Tarjeta"]),
  fecha: z.string().min(1),
  estado: z.enum(["Confirmado", "Pendiente", "Anulado"]),
  registradoPor: z.string().min(1),
});

export default function IngresosPage() {
  const { data: items = [], isLoading } = useApiList<IngresoWithRelations>("ingresos");
  const createMutation = useApiCreate<IngresoWithRelations>("ingresos");
  const updateMutation = useApiUpdate<IngresoWithRelations>("ingresos");
  const deleteMutation = useApiDelete("ingresos");
  const { data: cuentasBancarias = [] } = useApiList<CuentaBancaria>("cuentas-bancarias");
  const [search, setSearch] = useState("");
  const [origenFilter, setOrigenFilter] = useState("Todos");
  const [form, setForm] = useState<{ mode: "create" | "edit"; item?: IngresoWithRelations } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<IngresoWithRelations | null>(null);

  const getResidenteNombre = (i: IngresoWithRelations) =>
    i.persona ? `${i.persona.nombres} ${i.persona.apellidos}` : "";
  const getCuentaNombre = (i: IngresoWithRelations) =>
    i.cuentaBancaria ? `${i.cuentaBancaria.banco} ${i.cuentaBancaria.tipo}` : "";

  const filtered = useMemo(() => {
    let result = items;
    if (search) { const q = search.toLowerCase(); result = result.filter(i => i.concepto.toLowerCase().includes(q) || getResidenteNombre(i).toLowerCase().includes(q)); }
    if (origenFilter !== "Todos") result = result.filter(i => i.origen === origenFilter);
    return result;
  }, [items, search, origenFilter]);

  const total = useMemo(() => filtered.reduce((s, i) => s + i.monto, 0), [filtered]);

  const handleSubmit = useCallback(async (data: Record<string, unknown>) => {
    const id = (data.id as string) || crypto.randomUUID();
    const item = {
      ...data as unknown as IngresoWithRelations,
      id,
      personaId: (data.personaId as string) || undefined,
      cuentaBancariaId: data.cuentaBancariaId as string,
    };
    if (form?.mode === "edit") await updateMutation.mutateAsync(item as IngresoWithRelations);
    else await createMutation.mutateAsync(item);
    setForm(null);
  }, [form, createMutation, updateMutation]);

  const fields = [
    { name: "concepto", label: "Concepto", type: "text" as const },
    { name: "monto", label: "Monto (S/)", type: "number" as const },
    { name: "origen", label: "Origen", type: "select" as const, options: ["Cuota", "Multa", "Reserva", "Donacion", "Otro"].map(o => ({ label: o, value: o })) },
    { name: "personaId", label: "Residente (opcional)", type: "text" as const },
    { name: "cuentaBancariaId", label: "Cuenta bancaria", type: "select" as const, options: cuentasBancarias.map(c => ({ label: `${c.banco} - ${c.tipo}`, value: c.id })) },
    { name: "metodoPago", label: "Metodo de pago", type: "select" as const, options: ["Efectivo", "Transferencia", "Yape", "Plin", "Tarjeta"].map(m => ({ label: m, value: m })) },
    { name: "fecha", label: "Fecha", type: "text" as const },
    { name: "registradoPor", label: "Registrado por", type: "text" as const },
    { name: "estado", label: "Estado", type: "select" as const, options: ["Confirmado", "Pendiente", "Anulado"].map(e => ({ label: e, value: e })) },
  ];

  if (isLoading) {
    return (
      <>
        <HeaderPage icon={TrendingUp} title="Ingresos" subtitle="Entradas de dinero" />
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
        </div>
      </>
    );
  }

  return (
    <>
      <HeaderPage icon={TrendingUp} title="Ingresos" subtitle="Entradas de dinero">
        <Button variant="accent" size="md" onClick={() => setForm({ mode: "create" })}>
          <Plus className="h-4 w-4 mr-1.5" /> Registrar Ingreso
        </Button>
      </HeaderPage>

      <div className="flex items-center gap-3 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-surface-400" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar..."
            className="w-full sm:max-w-xs pl-10 pr-4 py-2.5 rounded-xl border border-surface-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20" />
        </div>
        <div className="flex gap-1 p-1 bg-surface-100 rounded-xl flex-wrap">
          {["Todos", "Cuota", "Multa", "Reserva", "Donacion", "Otro"].map(o => (
            <button key={o} onClick={() => setOrigenFilter(o)} className={cn("px-3 py-1.5 rounded-lg text-xs font-medium transition-all", origenFilter === o ? "bg-white text-primary-700 shadow-sm" : "text-surface-500 hover:text-surface-700")}>{o}</button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-surface-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs font-medium text-surface-500 uppercase tracking-wider border-b border-surface-100">
                <th className="px-5 py-3">Concepto</th><th className="px-5 py-3 text-right">Monto</th><th className="px-5 py-3">Origen</th>
                <th className="px-5 py-3">Residente</th><th className="px-5 py-3">Cuenta</th><th className="px-5 py-3">Metodo</th><th className="px-5 py-3">Fecha</th><th className="px-5 py-3">Estado</th><th className="px-5 py-3 w-10" />
              </tr>
            </thead>
            <tbody>
              {filtered.map(i => (
                <tr key={i.id} className="border-b border-surface-50 hover:bg-surface-50 transition-colors group">
                  <td className="px-5 py-3 text-sm font-medium text-surface-800">{i.concepto}</td>
                  <td className="px-5 py-3 text-sm font-semibold text-green-600 text-right tabular-nums">S/ {i.monto.toLocaleString()}</td>
                  <td className="px-5 py-3">
                    <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full",
                      i.origen === "Cuota" ? "bg-blue-50 text-blue-600" : i.origen === "Multa" ? "bg-red-50 text-red-600" :
                      i.origen === "Reserva" ? "bg-purple-50 text-purple-600" : i.origen === "Donacion" ? "bg-green-50 text-green-600" : "bg-surface-100 text-surface-600")}>{i.origen}</span>
                  </td>
                  <td className="px-5 py-3 text-xs text-surface-500">{getResidenteNombre(i) || "\u2014"}</td>
                  <td className="px-5 py-3 text-xs text-surface-500">{getCuentaNombre(i)}</td>
                  <td className="px-5 py-3">
                    <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full",
                      i.metodoPago === "Yape" ? "bg-purple-50 text-purple-600" : i.metodoPago === "Plin" ? "bg-cyan-50 text-cyan-600" :
                      i.metodoPago === "Tarjeta" ? "bg-amber-50 text-amber-600" : "bg-surface-100 text-surface-600")}>{i.metodoPago}</span>
                  </td>
                  <td className="px-5 py-3 text-xs text-surface-400">{i.fecha}</td>
                  <td className="px-5 py-3">
                    <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full",
                      i.estado === "Confirmado" ? "bg-green-50 text-green-700" : i.estado === "Pendiente" ? "bg-amber-50 text-amber-700" : "bg-surface-100 text-surface-500")}>{i.estado}</span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex gap-0.5 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                      <button onClick={() => setForm({ mode: "edit", item: i })} className="p-1 rounded text-surface-400 hover:text-primary-600"><Edit className="h-3.5 w-3.5" /></button>
                      <button onClick={() => setDeleteTarget(i)} className="p-1 rounded text-surface-400 hover:text-red-600"><Trash2 className="h-3.5 w-3.5" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between px-5 py-3 border-t border-surface-100 text-xs text-surface-400">
          <span>{filtered.length} ingresos</span>
          <span className="font-semibold text-green-600">Total: S/ {total.toLocaleString()}</span>
        </div>
      </div>

      <FormDrawer open={form !== null} onClose={() => setForm(null)} onSubmit={handleSubmit} schema={schema}
        defaultValues={form?.item || undefined} title={form?.mode === "create" ? "Registrar Ingreso" : "Editar Ingreso"} fields={fields} />
      <ConfirmDialog open={deleteTarget !== null} onClose={() => setDeleteTarget(null)}
        onConfirm={async () => { if (deleteTarget) await deleteMutation.mutateAsync(deleteTarget.id); setDeleteTarget(null); }}
        title="Eliminar ingreso" message={`Eliminar "${deleteTarget?.concepto}"?`} />
    </>
  );
}
