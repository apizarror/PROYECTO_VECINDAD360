"use client";

import { useState, useCallback, useMemo } from "react";
import { FolderOpen, Search, Plus, Edit, Trash2, Loader2 } from "lucide-react";
import { HeaderPage } from "@/components/dashboard/header-page";
import { Button } from "@/components/ui/button";
import { FormDrawer } from "@/components/dashboard/form-drawer";
import { ConfirmDialog } from "@/components/dashboard/confirm-dialog";
import { useApiList, useApiCreate, useApiUpdate, useApiDelete } from "@/hooks/use-api";
import { cn } from "@/lib/utils";
import { z } from "zod";

interface Archivo {
  id: string;
  condominioId?: string;
  nombre: string;
  descripcion?: string;
  categoria: string;
  formato: string;
  visibilidad: string;
  subidoPor: string;
  fecha: string;
  tamano?: string;
  url?: string;
  createdAt?: string;
  updatedAt?: string;
}

const schema = z.object({
  id: z.string().optional(),
  nombre: z.string().min(2, "Nombre requerido"),
  descripcion: z.string().optional(),
  categoria: z.enum(["Actas", "Reglamentos", "Contratos", "Reportes", "Comunicados", "Otros"]),
  formato: z.enum(["PDF", "Word", "Excel", "Imagen"]),
  visibilidad: z.enum(["Público", "Solo Administradores"]),
  subidoPor: z.string().min(2, "Requerido"),
  fecha: z.string().min(1, "Fecha requerida"),
  url: z.string().optional(),
});

export default function ArchivosPage() {
  const { data: archivos = [], isLoading } = useApiList<Archivo>("archivos");
  const createMutation = useApiCreate<Archivo>("archivos");
  const updateMutation = useApiUpdate<Archivo>("archivos");
  const deleteMutation = useApiDelete("archivos");
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("Todas");
  const [form, setForm] = useState<{ mode: "create" | "edit"; item?: Archivo } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Archivo | null>(null);

  const filtered = useMemo(() => {
    let items = [...archivos];
    if (search) {
      const q = search.toLowerCase();
      items = items.filter((a) => a.nombre.toLowerCase().includes(q));
    }
    if (catFilter !== "Todas") items = items.filter((a) => a.categoria === catFilter);
    return items;
  }, [archivos, search, catFilter]);

  const handleSubmit = useCallback(
    async (data: Record<string, unknown>) => {
      const id = (data.id as string) || crypto.randomUUID();
      const item: Archivo = {
        id,
        nombre: data.nombre as string,
        descripcion: (data.descripcion as string) || undefined,
        categoria: data.categoria as string,
        formato: data.formato as string,
        visibilidad: data.visibilidad as string,
        subidoPor: data.subidoPor as string,
        fecha: data.fecha as string,
        url: (data.url as string) || undefined,
      };
      if (form?.mode === "edit") await updateMutation.mutateAsync(item);
      else await createMutation.mutateAsync(item);
      setForm(null);
    },
    [form, createMutation, updateMutation]
  );

  const categorias = ["Todas", "Actas", "Reglamentos", "Contratos", "Reportes", "Comunicados", "Otros"];

  const fields = [
    { name: "nombre", label: "Nombre del archivo", type: "text" as const },
    { name: "descripcion", label: "Descripcion (opcional)", type: "textarea" as const },
    { name: "categoria", label: "Categoria", type: "select" as const, options: ["Actas", "Reglamentos", "Contratos", "Reportes", "Comunicados", "Otros"].map(c => ({ label: c, value: c })) },
    { name: "formato", label: "Formato", type: "select" as const, options: ["PDF", "Word", "Excel", "Imagen"].map(f => ({ label: f, value: f })) },
    { name: "visibilidad", label: "Visibilidad", type: "select" as const, options: [{ label: "Publico", value: "Público" }, { label: "Solo Administradores", value: "Solo Administradores" }] },
    { name: "subidoPor", label: "Subido por", type: "text" as const },
    { name: "fecha", label: "Fecha", type: "text" as const, placeholder: "2026-05-30" },
    { name: "url", label: "URL (opcional)", type: "text" as const, placeholder: "https://..." },
  ];

  if (isLoading) {
    return (
      <>
        <HeaderPage icon={FolderOpen} title="Archivos Compartidos" subtitle="Cargando..." />
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
        </div>
      </>
    );
  }

  return (
    <>
      <HeaderPage icon={FolderOpen} title="Archivos Compartidos" subtitle={`${archivos.length} archivos`}>
        <Button variant="accent" size="md" onClick={() => setForm({ mode: "create" })}>
          <Plus className="h-4 w-4 mr-1.5" /> Nuevo Archivo
        </Button>
      </HeaderPage>

      <div className="flex items-center gap-3 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-surface-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar archivo..."
            className="w-full sm:max-w-xs pl-10 pr-4 py-2.5 rounded-xl border border-surface-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20"
          />
        </div>
        <div className="flex gap-1 p-1 bg-surface-100 rounded-xl flex-wrap">
          {categorias.map((c) => (
            <button
              key={c}
              onClick={() => setCatFilter(c)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                catFilter === c
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
                <th className="px-5 py-3">Nombre</th>
                <th className="px-5 py-3">Categoria</th>
                <th className="px-5 py-3">Formato</th>
                <th className="px-5 py-3">Visibilidad</th>
                <th className="px-5 py-3">Subido por</th>
                <th className="px-5 py-3">Fecha</th>
                <th className="px-5 py-3 w-10" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((a) => (
                <tr key={a.id} className="border-b border-surface-50 hover:bg-surface-50 transition-colors group">
                  <td className="px-5 py-3">
                    <p className="text-sm font-medium text-surface-800">{a.nombre}</p>
                    {a.descripcion && <p className="text-xs text-surface-400 mt-0.5">{a.descripcion}</p>}
                    {a.url && (
                      <a href={a.url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary-500 hover:underline mt-0.5 inline-block">
                        Ver enlace
                      </a>
                    )}
                  </td>
                  <td className="px-5 py-3 text-xs text-surface-600">{a.categoria}</td>
                  <td className="px-5 py-3">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-600">
                      {a.formato}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-xs text-surface-500">{a.visibilidad}</td>
                  <td className="px-5 py-3 text-xs text-surface-500">{a.subidoPor}</td>
                  <td className="px-5 py-3 text-xs text-surface-400">{a.fecha}</td>
                  <td className="px-5 py-3">
                    <div className="flex gap-0.5 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                      <button onClick={() => setForm({ mode: "edit", item: a })} className="p-1 rounded text-surface-400 hover:text-primary-600"><Edit className="h-3.5 w-3.5" /></button>
                      <button onClick={() => setDeleteTarget(a)} className="p-1 rounded text-surface-400 hover:text-red-600"><Trash2 className="h-3.5 w-3.5" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between px-5 py-3 border-t border-surface-100 text-xs text-surface-400">
          <span>{filtered.length} archivos</span>
        </div>
      </div>

      <FormDrawer
        open={form !== null}
        onClose={() => setForm(null)}
        onSubmit={handleSubmit}
        schema={schema}
        defaultValues={form?.item as any || undefined}
        title={form?.mode === "create" ? "Nuevo Archivo" : "Editar Archivo"}
        fields={fields}
      />
      <ConfirmDialog
        open={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={async () => { if (deleteTarget) await deleteMutation.mutateAsync(deleteTarget.id); setDeleteTarget(null); }}
        title="Eliminar archivo"
        message={`¿Eliminar el archivo "${deleteTarget?.nombre}"?`}
      />
    </>
  );
}
