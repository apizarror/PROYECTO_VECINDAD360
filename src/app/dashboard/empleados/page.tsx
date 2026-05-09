"use client";

import { useState, useCallback, useMemo } from "react";
import { BriefcaseBusiness, Plus, Search, Edit, Trash2 } from "lucide-react";
import { HeaderPage } from "@/components/dashboard/header-page";
import { Button } from "@/components/ui/button";
import { FormDrawer } from "@/components/dashboard/form-drawer";
import { ConfirmDialog } from "@/components/dashboard/confirm-dialog";
import { useMockStore } from "@/hooks/use-mock-store";
import { empleados as initial } from "@/lib/mock-data/empleados";
import { cn } from "@/lib/utils";
import { z } from "zod";
import type { Empleado } from "@/types";

const schema = z.object({
  id: z.string().min(1),
  dni: z.string().min(8),
  nombres: z.string().min(2),
  apellidos: z.string().min(2),
  cargo: z.enum(["Conserje", "Vigilante", "Limpieza", "Mantenimiento", "Administrador"]),
  tipoContrato: z.enum(["Planilla", "Recibo por honorarios", "Tercerizado"]),
  fechaIngreso: z.string().min(1),
  fechaSalida: z.string().optional(),
  salario: z.number().min(1),
  telefono: z.string().min(1),
  email: z.string().email(),
  estado: z.enum(["Activo", "Inactivo"]),
});

export default function EmpleadosPage() {
  const store = useMockStore<Empleado>(initial);
  const [search, setSearch] = useState("");
  const [cargoFilter, setCargoFilter] = useState("Todos");
  const [form, setForm] = useState<{ mode: "create" | "edit"; item?: Empleado } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Empleado | null>(null);

  const filtered = useMemo(() => {
    let items = store.items;
    if (search) {
      const q = search.toLowerCase();
      items = items.filter(
        (e) =>
          e.nombres.toLowerCase().includes(q) ||
          e.apellidos.toLowerCase().includes(q) ||
          e.dni.includes(q)
      );
    }
    if (cargoFilter !== "Todos") items = items.filter((e) => e.cargo === cargoFilter);
    return items;
  }, [store.items, search, cargoFilter]);

  const handleSubmit = useCallback(
    (data: Record<string, unknown>) => {
      const id = (data.id as string) || crypto.randomUUID();
      const { id: _id, ...rest } = data;
      const item: Empleado = { ...rest } as unknown as Empleado;
      item.id = id;
      if (form?.mode === "edit") store.update(id, item);
      else store.create(item);
      setForm(null);
    },
    [form, store]
  );

  const fields = [
    { name: "dni", label: "DNI", type: "text" as const },
    { name: "nombres", label: "Nombres", type: "text" as const },
    { name: "apellidos", label: "Apellidos", type: "text" as const },
    {
      name: "cargo",
      label: "Cargo",
      type: "select" as const,
      options: ["Conserje", "Vigilante", "Limpieza", "Mantenimiento", "Administrador"].map((c) => ({
        label: c,
        value: c,
      })),
    },
    {
      name: "tipoContrato",
      label: "Tipo de contrato",
      type: "select" as const,
      options: ["Planilla", "Recibo por honorarios", "Tercerizado"].map((t) => ({
        label: t,
        value: t,
      })),
    },
    { name: "fechaIngreso", label: "Fecha de ingreso", type: "text" as const },
    { name: "salario", label: "Salario (S/)", type: "number" as const },
    { name: "telefono", label: "Teléfono", type: "text" as const },
    { name: "email", label: "Email", type: "text" as const },
    {
      name: "estado",
      label: "Estado",
      type: "select" as const,
      options: [
        { label: "Activo", value: "Activo" },
        { label: "Inactivo", value: "Inactivo" },
      ],
    },
  ];

  const cargos = ["Todos", "Conserje", "Vigilante", "Limpieza", "Mantenimiento", "Administrador"];

  return (
    <>
      <HeaderPage
        icon={BriefcaseBusiness}
        title="Empleados"
        subtitle="Personal del condominio"
      >
        <Button variant="accent" size="md" onClick={() => setForm({ mode: "create" })}>
          <Plus className="h-4 w-4 mr-1.5" />
          Nuevo Empleado
        </Button>
      </HeaderPage>

      <div className="flex items-center gap-3 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-surface-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar..."
            className="w-full max-w-xs pl-10 pr-4 py-2.5 rounded-xl border border-surface-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20"
          />
        </div>
        <div className="flex gap-1 p-1 bg-surface-100 rounded-xl flex-wrap">
          {cargos.map((c) => (
            <button
              key={c}
              onClick={() => setCargoFilter(c)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                cargoFilter === c
                  ? "bg-white text-primary-700 shadow-sm"
                  : "text-surface-500 hover:text-surface-700"
              )}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-surface-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs font-medium text-surface-500 uppercase tracking-wider border-b border-surface-100">
                <th className="px-5 py-3">Empleado</th>
                <th className="px-5 py-3">DNI</th>
                <th className="px-5 py-3">Cargo</th>
                <th className="px-5 py-3">Contrato</th>
                <th className="px-5 py-3 text-right">Salario</th>
                <th className="px-5 py-3">Contacto</th>
                <th className="px-5 py-3">Estado</th>
                <th className="px-5 py-3 w-10" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((e) => (
                <tr
                  key={e.id}
                  className="border-b border-surface-50 hover:bg-surface-50 transition-colors group"
                >
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-100 text-primary-700 text-xs font-bold">
                        {e.nombres[0]}
                        {e.apellidos[0]}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-surface-800">
                          {e.nombres} {e.apellidos}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-sm text-surface-600 font-mono">{e.dni}</td>
                  <td className="px-5 py-3 text-sm text-surface-600">{e.cargo}</td>
                  <td className="px-5 py-3 text-xs text-surface-500">{e.tipoContrato}</td>
                  <td className="px-5 py-3 text-sm font-semibold text-surface-800 text-right tabular-nums">
                    S/ {e.salario.toLocaleString()}
                  </td>
                  <td className="px-5 py-3 text-xs text-surface-500">{e.telefono}</td>
                  <td className="px-5 py-3">
                    <span
                      className={cn(
                        "text-[10px] font-bold px-2 py-0.5 rounded-full",
                        e.estado === "Activo"
                          ? "bg-green-50 text-green-700"
                          : "bg-surface-100 text-surface-500"
                      )}
                    >
                      {e.estado}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => setForm({ mode: "edit", item: e })}
                        className="p-1 rounded text-surface-400 hover:text-primary-600"
                      >
                        <Edit className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(e)}
                        className="p-1 rounded text-surface-400 hover:text-red-600"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between px-5 py-3 border-t border-surface-100 text-xs text-surface-400">
          <span>{filtered.length} empleados</span>
        </div>
      </div>

      <FormDrawer
        open={form !== null}
        onClose={() => setForm(null)}
        onSubmit={handleSubmit}
        schema={schema}
        defaultValues={form?.item || undefined}
        title={form?.mode === "create" ? "Nuevo Empleado" : "Editar Empleado"}
        fields={fields}
      />
      <ConfirmDialog
        open={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (deleteTarget) store.remove(deleteTarget.id);
          setDeleteTarget(null);
        }}
        title="Eliminar empleado"
        message={`¿Eliminar a "${deleteTarget?.nombres} ${deleteTarget?.apellidos}"?`}
      />
    </>
  );
}
