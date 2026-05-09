"use client";

import { useState, useCallback } from "react";
import { Settings, Plus, Edit, Trash2, Building2, Layers, ChevronRight } from "lucide-react";
import { HeaderPage } from "@/components/dashboard/header-page";
import { Button } from "@/components/ui/button";
import { FormDrawer } from "@/components/dashboard/form-drawer";
import { ConfirmDialog } from "@/components/dashboard/confirm-dialog";
import { useMockStore } from "@/hooks/use-mock-store";
import {
  gruposRubro as initialGrupos,
  serviciosRubro as initialServicios,
  configuracionCondominio as initialConfig,
} from "@/lib/mock-data/configuraciones";
import { cn } from "@/lib/utils";
import { z } from "zod";
import type { GrupoRubro, ServicioRubro, ConfiguracionCondominio } from "@/types";

type Tab = "rubros" | "condominio";

const grupoSchema = z.object({
  id: z.string().min(1),
  nombre: z.string().min(2, "Mínimo 2 caracteres"),
  orden: z.number().min(1),
});

const servicioSchema = z.object({
  id: z.string().min(1),
  grupoId: z.string().min(1, "Selecciona un grupo"),
  grupoNombre: z.string(),
  nombre: z.string().min(2, "Mínimo 2 caracteres"),
  tipo: z.enum(["Ordinario", "Extraordinario"]),
  unidad: z.string().min(1, "Requerido"),
  tarifaBase: z.number().min(0),
  cuentaContable: z.string().min(1, "Requerido"),
});

const condominioSchema = z.object({
  razonSocial: z.string().min(2),
  ruc: z.string().length(11, "11 dígitos"),
  direccion: z.string().min(5),
  colorPrimario: z.string().min(1),
  zonaHoraria: z.string().min(1),
  moneda: z.string().min(1),
  moraDiaria: z.number().min(0).max(10),
  whatsappBusinessId: z.string().optional(),
  pasarelaPago: z.enum(["Ninguna", "Niubiz", "Culqi", "Izipay"]),
  smtpHost: z.string().optional(),
});

export default function ConfiguracionesPage() {
  const [activeTab, setActiveTab] = useState<Tab>("rubros");

  // Rubros stores
  const gruposStore = useMockStore<GrupoRubro>(initialGrupos);
  const serviciosStore = useMockStore<ServicioRubro>(initialServicios);

  // Condominio config (single record, mutable)
  const [config, setConfig] = useState<ConfiguracionCondominio>(initialConfig);

  // Rubros forms
  const [grupoForm, setGrupoForm] = useState<{ mode: "create" | "edit"; item?: GrupoRubro } | null>(null);
  const [servicioForm, setServicioForm] = useState<{ mode: "create" | "edit"; item?: ServicioRubro } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; label: string; type: "grupo" | "servicio" } | null>(null);

  // Condominio form
  const [editCondominio, setEditCondominio] = useState(false);

  const handleGrupoSubmit = useCallback(
    (data: Record<string, unknown>) => {
      const id = (data.id as string) || crypto.randomUUID();
      const item: GrupoRubro = { id, nombre: data.nombre as string, orden: data.orden as number };
      if (grupoForm?.mode === "edit") gruposStore.update(id, item);
      else gruposStore.create(item);
      setGrupoForm(null);
    },
    [grupoForm, gruposStore]
  );

  const handleServicioSubmit = useCallback(
    (data: Record<string, unknown>) => {
      const id = (data.id as string) || crypto.randomUUID();
      const grupoId = data.grupoId as string;
      const grupo = gruposStore.items.find((g) => g.id === grupoId);
      const item: ServicioRubro = {
        id,
        grupoId,
        grupoNombre: data.grupoNombre as string || grupo?.nombre || "",
        nombre: data.nombre as string,
        tipo: data.tipo as "Ordinario" | "Extraordinario",
        unidad: data.unidad as string,
        tarifaBase: data.tarifaBase as number,
        cuentaContable: data.cuentaContable as string,
      };
      if (servicioForm?.mode === "edit") serviciosStore.update(id, item);
      else serviciosStore.create(item);
      setServicioForm(null);
    },
    [servicioForm, serviciosStore, gruposStore]
  );

  const handleDelete = useCallback(() => {
    if (!deleteTarget) return;
    if (deleteTarget.type === "grupo") gruposStore.remove(deleteTarget.id);
    else serviciosStore.remove(deleteTarget.id);
    setDeleteTarget(null);
  }, [deleteTarget, gruposStore, serviciosStore]);

  const handleCondominioSubmit = useCallback(
    (data: Record<string, unknown>) => {
      setConfig(data as unknown as ConfiguracionCondominio);
      setEditCondominio(false);
    },
    []
  );

  const grupoFields = [
    { name: "nombre", label: "Nombre del grupo", type: "text" as const, placeholder: "Ej: Servicios Básicos" },
    { name: "orden", label: "Orden", type: "number" as const },
  ];

  const servicioFields = [
    { name: "grupoId", label: "Grupo", type: "select" as const, options: gruposStore.items.map((g) => ({ label: g.nombre, value: g.id })) },
    { name: "nombre", label: "Nombre del servicio", type: "text" as const, placeholder: "Ej: Agua" },
    { name: "tipo", label: "Tipo", type: "select" as const, options: [{ label: "Ordinario", value: "Ordinario" }, { label: "Extraordinario", value: "Extraordinario" }] },
    { name: "unidad", label: "Unidad", type: "text" as const, placeholder: "m³, kWh, mes..." },
    { name: "tarifaBase", label: "Tarifa base (S/)", type: "number" as const },
    { name: "cuentaContable", label: "Cuenta contable", type: "text" as const, placeholder: "63.1.01" },
  ];

  const condominioFields = [
    { name: "razonSocial", label: "Razón social", type: "text" as const },
    { name: "ruc", label: "RUC (11 dígitos)", type: "text" as const },
    { name: "direccion", label: "Dirección", type: "text" as const },
    { name: "zonaHoraria", label: "Zona horaria", type: "text" as const },
    { name: "moraDiaria", label: "Mora diaria (%)", type: "number" as const },
    { name: "pasarelaPago", label: "Pasarela de pago", type: "select" as const, options: ["Ninguna", "Niubiz", "Culqi", "Izipay"].map((p) => ({ label: p, value: p })) },
  ];

  return (
    <>
      <HeaderPage icon={Settings} title="Configuraciones" subtitle="Rubros contables y datos del condominio" />

      {/* Tabs */}
      <div className="flex items-center gap-1 mb-6 p-1 bg-surface-100 rounded-xl w-fit">
        {([["rubros", "Rubros"], ["condominio", "Condominio"]] as [Tab, string][]).map(([id, label]) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium transition-all",
              activeTab === id ? "bg-white text-primary-700 shadow-sm" : "text-surface-500 hover:text-surface-700"
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Tab: Rubros */}
      {activeTab === "rubros" && (
        <div>
          {/* Header actions */}
          <div className="flex items-center gap-2 mb-6">
            <Button variant="accent" size="md" onClick={() => setGrupoForm({ mode: "create" })}>
              <Plus className="h-4 w-4 mr-1.5" />
              Nuevo Grupo
            </Button>
            <Button variant="outline" size="md" onClick={() => setServicioForm({ mode: "create" })}>
              <Plus className="h-4 w-4 mr-1.5" />
              Nuevo Servicio
            </Button>
          </div>

          {/* Árbol de grupos y servicios */}
          <div className="space-y-3">
            {gruposStore.items
              .sort((a, b) => a.orden - b.orden)
              .map((grupo) => {
                const servicios = serviciosStore.items.filter((s) => s.grupoId === grupo.id);
                return (
                  <div key={grupo.id} className="bg-white rounded-2xl border border-surface-200 shadow-sm overflow-hidden">
                    {/* Grupo header */}
                    <div className="flex items-center justify-between px-5 py-3.5 bg-surface-50 border-b border-surface-100 group">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-100 text-primary-700">
                          <Layers className="h-4 w-4" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-surface-800">{grupo.nombre}</h3>
                          <p className="text-xs text-surface-400">{servicios.length} servicios</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => setGrupoForm({ mode: "edit", item: grupo })}
                          className="p-1.5 rounded-lg text-surface-400 hover:text-primary-600 hover:bg-primary-50"
                        >
                          <Edit className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget({ id: grupo.id, label: grupo.nombre, type: "grupo" })}
                          className="p-1.5 rounded-lg text-surface-400 hover:text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Servicios */}
                    {servicios.length > 0 ? (
                      <table className="w-full">
                        <thead>
                          <tr className="text-left text-[11px] font-medium text-surface-400 uppercase border-b border-surface-100">
                            <th className="px-5 py-2">Servicio</th>
                            <th className="px-5 py-2">Tipo</th>
                            <th className="px-5 py-2">Unidad</th>
                            <th className="px-5 py-2 text-right">Tarifa Base</th>
                            <th className="px-5 py-2">Cuenta</th>
                            <th className="px-5 py-2 w-10" />
                          </tr>
                        </thead>
                        <tbody>
                          {servicios.map((s) => (
                            <tr key={s.id} className="border-b border-surface-50 hover:bg-surface-50 transition-colors group">
                              <td className="px-5 py-2.5 text-sm font-medium text-surface-800">{s.nombre}</td>
                              <td className="px-5 py-2.5">
                                <span className={cn(
                                  "text-[10px] font-bold px-2 py-0.5 rounded-full",
                                  s.tipo === "Ordinario" ? "bg-blue-50 text-blue-600" : "bg-amber-50 text-amber-600"
                                )}>
                                  {s.tipo}
                                </span>
                              </td>
                              <td className="px-5 py-2.5 text-sm text-surface-500">{s.unidad}</td>
                              <td className="px-5 py-2.5 text-sm text-surface-600 text-right tabular-nums">
                                S/ {s.tarifaBase.toLocaleString()}
                              </td>
                              <td className="px-5 py-2.5 text-sm text-surface-400 font-mono">{s.cuentaContable}</td>
                              <td className="px-5 py-2.5">
                                <div className="flex items-center gap-0.5 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                                  <button
                                    onClick={() => setServicioForm({ mode: "edit", item: s })}
                                    className="p-1 rounded text-surface-400 hover:text-primary-600"
                                  >
                                    <Edit className="h-3 w-3" />
                                  </button>
                                  <button
                                    onClick={() => setDeleteTarget({ id: s.id, label: s.nombre, type: "servicio" })}
                                    className="p-1 rounded text-surface-400 hover:text-red-600"
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <div className="px-5 py-4 text-xs text-surface-400">Sin servicios configurados</div>
                    )}
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* Tab: Condominio */}
      {activeTab === "condominio" && (
        <div className="bg-white rounded-2xl border border-surface-200 shadow-sm">
          <div className="flex items-center justify-between px-6 py-4 border-b border-surface-100">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-100 text-primary-700">
                <Building2 className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-surface-800">{config.razonSocial}</h3>
                <p className="text-xs text-surface-400">{config.ruc}</p>
              </div>
            </div>
            <Button variant="outline" size="md" onClick={() => setEditCondominio(true)}>
              <Edit className="h-4 w-4 mr-1.5" />
              Editar
            </Button>
          </div>
          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <InfoField label="Razón social" value={config.razonSocial} />
            <InfoField label="RUC" value={config.ruc} />
            <InfoField label="Dirección" value={config.direccion} />
            <InfoField label="Zona horaria" value={config.zonaHoraria} />
            <InfoField label="Moneda" value={config.moneda} />
            <InfoField label="Mora diaria" value={`${config.moraDiaria}%`} />
            <InfoField label="Pasarela de pago" value={config.pasarelaPago} />
            <InfoField label="Color primario" value={config.colorPrimario}>
              <div className="h-6 w-6 rounded" style={{ backgroundColor: config.colorPrimario }} />
            </InfoField>
            <InfoField label="WhatsApp Business" value={config.whatsappBusinessId || "—"} />
            <InfoField label="SMTP Host" value={config.smtpHost || "—"} />
          </div>
        </div>
      )}

      {/* Grupo Form */}
      <FormDrawer
        open={grupoForm !== null}
        onClose={() => setGrupoForm(null)}
        onSubmit={handleGrupoSubmit}
        schema={grupoSchema}
        defaultValues={grupoForm?.item || undefined}
        title={grupoForm?.mode === "create" ? "Nuevo Grupo de Rubro" : "Editar Grupo"}
        fields={grupoFields}
      />

      {/* Servicio Form */}
      <FormDrawer
        open={servicioForm !== null}
        onClose={() => setServicioForm(null)}
        onSubmit={handleServicioSubmit}
        schema={servicioSchema}
        defaultValues={servicioForm?.item || undefined}
        title={servicioForm?.mode === "create" ? "Nuevo Servicio" : "Editar Servicio"}
        fields={servicioFields}
      />

      {/* Condominio Form */}
      <FormDrawer
        open={editCondominio}
        onClose={() => setEditCondominio(false)}
        onSubmit={handleCondominioSubmit}
        schema={condominioSchema}
        defaultValues={config}
        title="Editar Condominio"
        subtitle="Modifica los datos y configuración del tenant"
        fields={condominioFields}
      />

      {/* Delete Confirm */}
      <ConfirmDialog
        open={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title={`Eliminar ${deleteTarget?.type === "grupo" ? "grupo" : "servicio"}`}
        message={`¿Eliminar "${deleteTarget?.label}"?`}
        confirmLabel="Eliminar"
        variant="danger"
      />
    </>
  );
}

function InfoField({ label, value, children }: { label: string; value: string; children?: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <p className="text-[11px] font-medium text-surface-400 uppercase tracking-wider">{label}</p>
      <div className="flex items-center gap-2">
        <p className="text-sm font-medium text-surface-800">{value}</p>
        {children}
      </div>
    </div>
  );
}
