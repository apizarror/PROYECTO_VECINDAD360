"use client";

import { useState, useMemo } from "react";
import { FolderOpen, Search, Loader2 } from "lucide-react";
import { HeaderPage } from "@/components/dashboard/header-page";
import { useApiList } from "@/hooks/use-api";
import { cn } from "@/lib/utils";
import type { Archivo } from "@/types";

export default function ArchivosPage() {
  const { data: archivos = [], isLoading } = useApiList<Archivo>("archivos");
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("Todas");

  const filtered = useMemo(() => {
    let items = [...archivos];
    if (search) {
      const q = search.toLowerCase();
      items = items.filter((a) => a.nombre.toLowerCase().includes(q));
    }
    if (catFilter !== "Todas") items = items.filter((a) => a.categoria === catFilter);
    return items;
  }, [archivos, search, catFilter]);

  const categorias = ["Todas", "Actas", "Reglamentos", "Contratos", "Estados financieros", "Otros"];

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
      <HeaderPage icon={FolderOpen} title="Archivos Compartidos" subtitle={`${archivos.length} archivos`} />
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
                <th className="px-5 py-3">Categoría</th>
                <th className="px-5 py-3">Formato</th>
                <th className="px-5 py-3">Visibilidad</th>
                <th className="px-5 py-3">Subido por</th>
                <th className="px-5 py-3">Fecha</th>
                <th className="px-5 py-3 text-right">Tamaño</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((a) => (
                <tr key={a.id} className="border-b border-surface-50 hover:bg-surface-50 transition-colors">
                  <td className="px-5 py-3 text-sm font-medium text-surface-800">{a.nombre}</td>
                  <td className="px-5 py-3 text-xs text-surface-600">{a.categoria}</td>
                  <td className="px-5 py-3">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-600">
                      {a.formato}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-xs text-surface-500">{a.visibilidad}</td>
                  <td className="px-5 py-3 text-xs text-surface-500">{a.subidoPor}</td>
                  <td className="px-5 py-3 text-xs text-surface-400">{a.fecha}</td>
                  <td className="px-5 py-3 text-xs text-surface-400 text-right tabular-nums">{a.tamano}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between px-5 py-3 border-t border-surface-100 text-xs text-surface-400">
          <span>{filtered.length} archivos</span>
        </div>
      </div>
    </>
  );
}
