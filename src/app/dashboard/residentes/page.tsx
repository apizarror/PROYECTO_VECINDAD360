"use client";

import { useState, useCallback, useMemo } from "react";
import { Users, Plus, Search, Trash2, Edit, Download, Upload, X } from "lucide-react";
import { HeaderPage } from "@/components/dashboard/header-page";
import { Button } from "@/components/ui/button";
import { FormDrawer } from "@/components/dashboard/form-drawer";
import { ConfirmDialog } from "@/components/dashboard/confirm-dialog";
import { useMockStore } from "@/hooks/use-mock-store";
import { residentes as initialResidentes } from "@/lib/mock-data/residentes";
import { cn } from "@/lib/utils";
import { z } from "zod";
import type { Persona } from "@/types";

const residenteSchema = z.object({
  id: z.string().optional(),
  tipo: z.enum(["Natural", "Jurídica"]),
  documento: z.string().min(8, "Mínimo 8 caracteres"),
  nombres: z.string().min(2, "Mínimo 2 caracteres"),
  apellidos: z.string().min(2, "Mínimo 2 caracteres"),
  razonSocial: z.string().optional(),
  genero: z.enum(["M", "F"]).optional(),
  fechaNacimiento: z.string().optional(),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
  telefono: z.string().optional(),
  saldo: z.number().default(0),
  activo: z.boolean().default(true),
});

const fields = [
  { name: "tipo", label: "Tipo de persona", type: "select" as const, options: [{ label: "Natural", value: "Natural" }, { label: "Jurídica", value: "Jurídica" }] },
  { name: "documento", label: "Documento (DNI/RUC/CE)", type: "text" as const, placeholder: "12345678" },
  { name: "nombres", label: "Nombres", type: "text" as const, placeholder: "Luis Alberto" },
  { name: "apellidos", label: "Apellidos", type: "text" as const, placeholder: "García Fernández" },
  { name: "email", label: "Email", type: "text" as const, placeholder: "correo@email.com" },
  { name: "telefono", label: "Teléfono", type: "text" as const, placeholder: "+51 987654321" },
];

export default function ResidentesPage() {
  const store = useMockStore<Persona>(initialResidentes);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState<{ mode: "create" | "edit"; item?: Persona } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Persona | null>(null);
  const [showOptions, setShowOptions] = useState(false);

  const filtered = useMemo(() => {
    if (!search) return store.items;
    const q = search.toLowerCase();
    return store.items.filter(
      (r) =>
        r.documento.includes(q) ||
        r.nombres.toLowerCase().includes(q) ||
        r.apellidos.toLowerCase().includes(q) ||
        r.razonSocial?.toLowerCase().includes(q)
    );
  }, [store.items, search]);

  const handleSubmit = useCallback(
    (data: Record<string, unknown>) => {
      const id = (data.id as string) || crypto.randomUUID();
      const item: Persona = {
        id,
        tipo: data.tipo as "Natural" | "Jurídica",
        documento: data.documento as string,
        nombres: data.nombres as string,
        apellidos: data.apellidos as string,
        razonSocial: data.razonSocial as string | undefined,
        genero: data.genero as "M" | "F" | undefined,
        fechaNacimiento: data.fechaNacimiento as string | undefined,
        contactos: [
          ...(data.email ? [{ tipo: "email" as const, valor: data.email as string }] : []),
          ...(data.telefono ? [{ tipo: "telefono" as const, valor: data.telefono as string }] : []),
        ],
        vinculaciones: (form?.item?.vinculaciones) || [],
        saldo: (data.saldo as number) || 0,
        activo: data.activo !== false,
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

  const openEdit = (item: Persona) => {
    setForm({
      mode: "edit",
      item: {
        ...item,
        email: item.contactos.find((c) => c.tipo === "email")?.valor || "",
        telefono: item.contactos.find((c) => c.tipo === "telefono")?.valor || "",
        fechaNacimiento: item.fechaNacimiento || "",
      } as Persona & { email?: string; telefono?: string },
    });
  };

  return (
    <>
      <HeaderPage icon={Users} title="Lista de Residentes" subtitle="Directorio de personas del condominio">
        <div className="relative">
          <button
            onClick={() => setShowOptions(!showOptions)}
            className="px-3 py-2 rounded-lg text-sm font-medium text-surface-600 hover:bg-surface-100 border border-surface-200 transition-colors flex items-center gap-1.5"
          >
            Opciones
          </button>
          {showOptions && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowOptions(false)} />
              <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl border border-surface-200 shadow-xl z-50 py-1">
                <button className="flex w-full items-center gap-2.5 px-3 py-2 text-sm text-surface-600 hover:bg-surface-50">
                  <Download className="h-4 w-4" /> Exportar Excel
                </button>
                <button className="flex w-full items-center gap-2.5 px-3 py-2 text-sm text-surface-600 hover:bg-surface-50">
                  <Upload className="h-4 w-4" /> Importar CSV
                </button>
              </div>
            </>
          )}
        </div>
        <Button variant="accent" size="md" onClick={() => setForm({ mode: "create" })}>
          <Plus className="h-4 w-4 mr-1.5" />
          Nuevo Residente
        </Button>
      </HeaderPage>

      <div className="flex items-center gap-3 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-surface-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre, DNI..."
            className="w-full sm:max-w-xs pl-10 pr-4 py-2.5 rounded-xl border border-surface-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 transition-colors"
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-surface-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs font-medium text-surface-500 uppercase tracking-wider border-b border-surface-100">
                <th className="px-5 py-3">Documento</th>
                <th className="px-5 py-3">Nombre</th>
                <th className="px-5 py-3">Contacto</th>
                <th className="px-5 py-3">Inmueble</th>
                <th className="px-5 py-3 text-right">Saldo</th>
                <th className="px-5 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.id} className="border-b border-surface-50 hover:bg-surface-50 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        "text-[10px] font-bold px-2 py-0.5 rounded-full uppercase",
                        r.tipo === "Natural" ? "bg-blue-50 text-blue-600" : "bg-purple-50 text-purple-600"
                      )}>
                        {r.tipo === "Natural" ? "Nat" : "Jur"}
                      </span>
                      <span className="text-sm text-surface-600">{r.documento}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-100 text-primary-700 text-xs font-bold">
                        {r.nombres ? r.nombres[0] + r.apellidos[0] : r.razonSocial?.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-surface-800">
                          {r.tipo === "Natural" ? `${r.nombres} ${r.apellidos}` : r.razonSocial}
                        </p>
                        {!r.activo && (
                          <span className="text-[10px] text-red-500 bg-red-50 px-1.5 py-0.5 rounded">Inactivo</span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-sm text-surface-600">
                    {r.contactos[0]?.valor || "—"}
                  </td>
                  <td className="px-5 py-3 text-sm text-surface-600">
                    {r.vinculaciones[0]?.inmuebleLabel || "—"}
                  </td>
                  <td className="px-5 py-3 text-sm font-semibold text-right tabular-nums">
                    <span className={r.saldo < 0 ? "text-red-600" : r.saldo > 0 ? "text-green-600" : "text-surface-400"}>
                      S/ {r.saldo.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => openEdit(r)}
                        className="p-1.5 rounded-lg text-surface-400 hover:text-primary-600 hover:bg-primary-50 transition-colors"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(r)}
                        className="p-1.5 rounded-lg text-surface-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-surface-400 text-sm">
                    No se encontraron residentes
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between px-5 py-3 border-t border-surface-100 text-xs text-surface-400">
          <span>{filtered.length} residentes</span>
        </div>
      </div>

      <FormDrawer
        open={form !== null}
        onClose={() => setForm(null)}
        onSubmit={handleSubmit}
        schema={residenteSchema}
        defaultValues={form?.item || undefined}
        title={form?.mode === "create" ? "Nuevo Residente" : "Editar Residente"}
        fields={fields}
      />

      <ConfirmDialog
        open={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Eliminar residente"
        message={`¿Estás seguro de eliminar a "${deleteTarget?.nombres} ${deleteTarget?.apellidos}"? Esta acción no se puede deshacer.`}
        confirmLabel="Eliminar"
        variant="danger"
      />
    </>
  );
}
