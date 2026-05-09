"use client";

import { useCallback, useState } from "react";
import { WalletCards, Plus, Edit, Trash2 } from "lucide-react";
import { HeaderPage } from "@/components/dashboard/header-page";
import { Button } from "@/components/ui/button";
import { FormDrawer } from "@/components/dashboard/form-drawer";
import { ConfirmDialog } from "@/components/dashboard/confirm-dialog";
import { useMockStore } from "@/hooks/use-mock-store";
import { cuentasBancarias as initial } from "@/lib/mock-data/financiero";
import { cn } from "@/lib/utils";
import { z } from "zod";
import type { CuentaBancaria } from "@/types";

const cuentaSchema = z.object({
  id: z.string().min(1),
  banco: z.string().min(2),
  tipo: z.enum(["Ahorros", "Corriente", "Detracción"]),
  moneda: z.enum(["PEN", "USD"]),
  numeroCuenta: z.string().min(4),
  cci: z.string().min(10),
  titular: z.string().min(3),
  saldoInicial: z.number().min(0),
  saldoActual: z.number().min(0),
  estado: z.enum(["Activa", "Inactiva"]),
});

export default function CuentasPage() {
  const store = useMockStore<CuentaBancaria>(initial);
  const [form, setForm] = useState<{ mode: "create" | "edit"; item?: CuentaBancaria } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<CuentaBancaria | null>(null);

  const handleSubmit = useCallback((data: Record<string, unknown>) => {
    const id = (data.id as string) || crypto.randomUUID();
    const item = { ...data, id } as unknown as CuentaBancaria;
    if (form?.mode === "edit") store.update(id, item);
    else store.create(item);
    setForm(null);
  }, [form, store]);

  const fields = [
    { name: "banco", label: "Banco", type: "text" as const, placeholder: "BCP" },
    { name: "tipo", label: "Tipo de cuenta", type: "select" as const, options: ["Ahorros", "Corriente", "Detracción"].map(t => ({ label: t, value: t })) },
    { name: "moneda", label: "Moneda", type: "select" as const, options: [{ label: "PEN", value: "PEN" }, { label: "USD", value: "USD" }] },
    { name: "numeroCuenta", label: "Número de cuenta", type: "text" as const },
    { name: "cci", label: "CCI", type: "text" as const },
    { name: "titular", label: "Titular", type: "text" as const },
    { name: "saldoInicial", label: "Saldo inicial", type: "number" as const },
    { name: "saldoActual", label: "Saldo actual", type: "number" as const },
    { name: "estado", label: "Estado", type: "select" as const, options: [{ label: "Activa", value: "Activa" }, { label: "Inactiva", value: "Inactiva" }] },
  ];

  const total = store.items.filter(c => c.estado === "Activa").reduce((s, c) => s + c.saldoActual, 0);

  return (
    <>
      <HeaderPage icon={WalletCards} title="Cuentas Bancarias" subtitle={`Total disponible: S/ ${total.toLocaleString()}`}>
        <Button variant="accent" size="md" onClick={() => setForm({ mode: "create" })}>
          <Plus className="h-4 w-4 mr-1.5" /> Nueva Cuenta
        </Button>
      </HeaderPage>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {store.items.map(c => (
          <div key={c.id} onClick={() => setForm({ mode: "edit", item: c })}
            className="bg-white rounded-2xl border border-surface-200 shadow-sm hover:shadow-md cursor-pointer group relative transition-all">
            <button onClick={e => { e.stopPropagation(); setDeleteTarget(c); }}
              className="absolute top-3 right-3 z-10 p-2 rounded-lg bg-white/80 text-surface-400 hover:text-red-500 hover:bg-red-50 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all">
              <Trash2 className="h-4 w-4" />
            </button>
            <div className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full", c.estado === "Activa" ? "bg-green-50 text-green-700" : "bg-surface-100 text-surface-500")}>{c.estado}</span>
                <span className="text-[10px] text-surface-400">{c.moneda}</span>
              </div>
              <h3 className="font-bold text-surface-800 text-lg">{c.banco}</h3>
              <p className="text-xs text-surface-400 mt-0.5">{c.tipo} · {c.numeroCuenta}</p>
              <div className="mt-4 pt-3 border-t border-surface-100">
                <p className="text-[10px] text-surface-400 uppercase">Saldo actual</p>
                <p className="text-xl font-extrabold text-surface-800 tabular-nums">
                  {c.moneda === "PEN" ? "S/ " : "$ "}{c.saldoActual.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <FormDrawer open={form !== null} onClose={() => setForm(null)} onSubmit={handleSubmit} schema={cuentaSchema}
        defaultValues={form?.item || undefined} title={form?.mode === "create" ? "Nueva Cuenta" : "Editar Cuenta"} fields={fields} />
      <ConfirmDialog open={deleteTarget !== null} onClose={() => setDeleteTarget(null)}
        onConfirm={() => { if (deleteTarget) store.remove(deleteTarget.id); setDeleteTarget(null); }}
        title="Eliminar cuenta" message={`¿Eliminar cuenta ${deleteTarget?.banco}?`} />
    </>
  );
}
