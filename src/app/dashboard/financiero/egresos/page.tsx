"use client";

import { useState, useCallback, useMemo } from "react";
import { TrendingDown, Plus, Search, Edit, Trash2, Loader2 } from "lucide-react";
import { HeaderPage } from "@/components/dashboard/header-page";
import { Button } from "@/components/ui/button";
import { FormDrawer } from "@/components/dashboard/form-drawer";
import { ConfirmDialog } from "@/components/dashboard/confirm-dialog";
import { useApiList, useApiCreate, useApiUpdate, useApiDelete } from "@/hooks/use-api";
import { cn } from "@/lib/utils";
import { z } from "zod";
import type { CuentaBancaria } from "@/types";

interface EgresoWithRelations {
  id: string;
  concepto: string;
  monto: number;
  categoria: string;
  proveedor: string;
  cuentaBancariaId: string;
  cuentaBancaria?: { banco: string; tipo: string };
  metodoPago: "Efectivo" | "Transferencia" | "Yape" | "Plin" | "Cheque";
  fechaRegistro: string;
  fechaPago: string;
  descripcion: string;
  estado: "Pendiente" | "Pagado" | "Anulado";
  registradoPor: string;
}

const schema = z.object({
  id: z.string().optional(),
  concepto: z.string().min(3),
  monto: z.number().min(1),
  categoria: z.string().min(1),
  proveedor: z.string().min(1),
  cuentaBancariaId: z.string().min(1),
  metodoPago: z.enum(["Efectivo", "Transferencia", "Yape", "Plin", "Cheque"]),
  fechaRegistro: z.string().min(1),
  fechaPago: z.string().optional(),
  descripcion: z.string().min(5),
  estado: z.enum(["Pendiente", "Pagado", "Anulado"]),
  registradoPor: z.string().min(1),
});

const today = new Date().toISOString().slice(0, 10);

export default function EgresosPage() {
  const { data: items = [], isLoading } = useApiList<EgresoWithRelations>("egresos");
  const createMutation = useApiCreate<EgresoWithRelations>("egresos");
  const updateMutation = useApiUpdate<EgresoWithRelations>("egresos");
  const deleteMutation = useApiDelete("egresos");
  const { data: cuentasBancarias = [] } = useApiList<CuentaBancaria>("cuentas-bancarias");
  const [search, setSearch] = useState("");
  const [estadoFilter, setEstadoFilter] = useState("Todos");
  const [form, setForm] = useState<{ mode: "create" | "edit"; item?: EgresoWithRelations } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<EgresoWithRelations | null>(null);

  const getCuentaNombre = (e: EgresoWithRelations) =>
    e.cuentaBancaria ? `${e.cuentaBancaria.banco} ${e.cuentaBancaria.tipo}` : "";

  const filtered = useMemo(() => {
    let result = items;
    if (search) { const q = search.toLowerCase(); result = result.filter(e => e.concepto.toLowerCase().includes(q) || e.proveedor.toLowerCase().includes(q)); }
    if (estadoFilter !== "Todos") result = result.filter(e => e.estado === estadoFilter);
    return result;
  }, [items, search, estadoFilter]);

  const total = useMemo(() => filtered.reduce((s, e) => s + e.monto, 0), [filtered]);

  const handleSubmit = useCallback(async (data: Record<string, unknown>) => {
    const id = (data.id as string) || crypto.randomUUID();
    const item = {
      ...data as unknown as EgresoWithRelations,
      id,
      cuentaBancariaId: data.cuentaBancariaId as string,
    };
    if (form?.mode === "edit") await updateMutation.mutateAsync(item as EgresoWithRelations);
    else await createMutation.mutateAsync(item);
    setForm(null);
  }, [form, createMutation, updateMutation]);

  const fields = [
    { name: "concepto", label: "Concepto", type: "text" as const },
    { name: "monto", label: "Monto (S/)", type: "number" as const },
    { name: "categoria", label: "Categoria (rubro)", type: "text" as const, placeholder: "Mantenimiento" },
    { name: "proveedor", label: "Proveedor", type: "text" as const },
    { name: "cuentaBancariaId", label: "Cuenta bancaria", type: "select" as const, options: cuentasBancarias.map(c => ({ label: `${c.banco} - ${c.tipo}`, value: c.id })) },
    { name: "metodoPago", label: "Metodo de pago", type: "select" as const, options: ["Efectivo", "Transferencia", "Yape", "Plin", "Cheque"].map(m => ({ label: m, value: m })) },
    { name: "fechaRegistro", label: "Fecha de registro", type: "date" as const },
    { name: "fechaPago", label: "Fecha de pago", type: "date" as const },
    { name: "descripcion", label: "Descripcion", type: "textarea" as const },
    { name: "registradoPor", label: "Registrado por", type: "text" as const },
    { name: "estado", label: "Estado", type: "select" as const, options: ["Pendiente", "Pagado", "Anulado"].map(e => ({ label: e, value: e })) },
  ];

  if (isLoading) {
    return (
      <>
        <HeaderPage icon={TrendingDown} title="Egresos" subtitle="Salidas de dinero" />
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
        </div>
      </>
    );
  }

  return (
    <>
      <HeaderPage icon={TrendingDown} title="Egresos" subtitle="Salidas de dinero">
        <Button variant="accent" size="md" onClick={() => setForm({ mode: "create" })}>
          <Plus className="h-4 w-4 mr-1.5" /> Registrar Egreso
        </Button>
      </HeaderPage>

      <div className="flex items-center gap-3 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-surface-400" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar..."
            className="w-full sm:max-w-xs pl-10 pr-4 py-2.5 rounded-xl border border-surface-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20" />
        </div>
        <div className="flex gap-1 p-1 bg-surface-100 rounded-xl flex-wrap">
          {["Todos", "Pendiente", "Pagado", "Anulado"].map(e => (
            <button key={e} onClick={() => setEstadoFilter(e)} className={cn("px-3 py-1.5 rounded-lg text-xs font-medium transition-all", estadoFilter === e ? "bg-white text-primary-700 shadow-sm" : "text-surface-500 hover:text-surface-700")}>{e}</button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-surface-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs font-medium text-surface-500 uppercase tracking-wider border-b border-surface-100">
                <th className="px-5 py-3">Concepto</th><th className="px-5 py-3 text-right">Monto</th><th className="px-5 py-3">Categoria</th>
                <th className="px-5 py-3">Cuenta</th><th className="px-5 py-3">Metodo</th><th className="px-5 py-3">Registro</th><th className="px-5 py-3">Estado</th><th className="px-5 py-3 w-10" />
              </tr>
            </thead>
            <tbody>
              {filtered.map(e => (
                <tr key={e.id} className="border-b border-surface-50 hover:bg-surface-50 transition-colors group">
                  <td className="px-5 py-3">
                    <p className="text-sm font-medium text-surface-800">{e.concepto}</p>
                    <p className="text-xs text-surface-400">{e.proveedor}</p>
                  </td>
                  <td className="px-5 py-3 text-sm font-semibold text-red-600 text-right tabular-nums">S/ {e.monto.toLocaleString()}</td>
                  <td className="px-5 py-3 text-sm text-surface-600">{e.categoria}</td>
                  <td className="px-5 py-3 text-xs text-surface-500">{getCuentaNombre(e)}</td>
                  <td className="px-5 py-3">
                    <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full",
                      e.metodoPago === "Yape" ? "bg-purple-50 text-purple-600" :
                      e.metodoPago === "Plin" ? "bg-cyan-50 text-cyan-600" :
                      "bg-surface-100 text-surface-600")}>{e.metodoPago}</span>
                  </td>
                  <td className="px-5 py-3 text-xs text-surface-400">{e.fechaRegistro}</td>
                  <td className="px-5 py-3">
                    <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full",
                      e.estado === "Pagado" ? "bg-green-50 text-green-700" : e.estado === "Pendiente" ? "bg-amber-50 text-amber-700" : "bg-surface-100 text-surface-500")}>{e.estado}</span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex gap-0.5 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                      <button onClick={() => setForm({ mode: "edit", item: e })} className="p-1 rounded text-surface-400 hover:text-primary-600"><Edit className="h-3.5 w-3.5" /></button>
                      <button onClick={() => setDeleteTarget(e)} className="p-1 rounded text-surface-400 hover:text-red-600"><Trash2 className="h-3.5 w-3.5" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between px-5 py-3 border-t border-surface-100 text-xs text-surface-400">
          <span>{filtered.length} egresos</span>
          <span className="font-semibold text-red-600">Total: S/ {total.toLocaleString()}</span>
        </div>
      </div>

      <FormDrawer open={form !== null} onClose={() => setForm(null)} onSubmit={handleSubmit} schema={schema}
        defaultValues={form?.mode === "edit" ? form.item : { fechaRegistro: today }} title={form?.mode === "create" ? "Registrar Egreso" : "Editar Egreso"} fields={fields} />
      <ConfirmDialog open={deleteTarget !== null} onClose={() => setDeleteTarget(null)}
        onConfirm={async () => { if (deleteTarget) await deleteMutation.mutateAsync(deleteTarget.id); setDeleteTarget(null); }}
        title="Eliminar egreso" message={`Eliminar "${deleteTarget?.concepto}"?`} />
    </>
  );
}
