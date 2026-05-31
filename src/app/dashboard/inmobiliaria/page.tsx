"use client";

import { useState, useCallback } from "react";
import { Building2, Plus, Loader2 } from "lucide-react";
import { HeaderPage } from "@/components/dashboard/header-page";
import { Button } from "@/components/ui/button";
import { EdificioCard } from "@/components/dashboard/edificio-card";
import { BloqueCard } from "@/components/dashboard/bloque-card";
import { InmuebleCard } from "@/components/dashboard/inmueble-card";
import { FormDrawer } from "@/components/dashboard/form-drawer";
import { ConfirmDialog } from "@/components/dashboard/confirm-dialog";
import { useApiList, useApiCreate, useApiUpdate, useApiDelete } from "@/hooks/use-api";
import { edificioSchema, bloqueSchema, inmuebleSchema } from "@/lib/inmobiliaria-schemas";
import { cn } from "@/lib/utils";
import type { Edificio, Bloque, Inmueble } from "@/types";

type Tab = "edificios" | "bloques" | "inmuebles";

type FormMode = "create" | "edit";
type FormTarget = { mode: FormMode; item?: Edificio | Bloque | Inmueble } | null;

export default function InmobiliariaPage() {
  const [activeTab, setActiveTab] = useState<Tab>("edificios");
  const [form, setForm] = useState<FormTarget>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; label: string; tab: Tab } | null>(null);

  // Edificios
  const { data: edificios = [], isLoading: loadingEdificios } = useApiList<Edificio>("edificios");
  const createEdificio = useApiCreate<Edificio>("edificios");
  const updateEdificio = useApiUpdate<Edificio>("edificios");
  const deleteEdificio = useApiDelete("edificios");

  // Bloques
  const { data: bloques = [], isLoading: loadingBloques } = useApiList<Bloque>("bloques");
  const createBloque = useApiCreate<Bloque>("bloques");
  const updateBloque = useApiUpdate<Bloque>("bloques");
  const deleteBloque = useApiDelete("bloques");

  // Inmuebles
  const { data: inmuebles = [], isLoading: loadingInmuebles } = useApiList<Inmueble>("inmuebles");
  const createInmueble = useApiCreate<Inmueble>("inmuebles");
  const updateInmueble = useApiUpdate<Inmueble>("inmuebles");
  const deleteInmueble = useApiDelete("inmuebles");

  const isLoading = loadingEdificios || loadingBloques || loadingInmuebles;

  const openCreate = useCallback(() => {
    setForm({ mode: "create" });
  }, []);

  const openEdit = useCallback((item: Edificio | Bloque | Inmueble) => {
    setForm({ mode: "edit", item });
  }, []);

  const handleSubmit = useCallback(
    async (data: Record<string, unknown>) => {
      const id = (data.id as string) || crypto.randomUUID();

      if (activeTab === "edificios") {
        const item = { ...data, id } as unknown as Edificio;
        if (form?.mode === "edit") {
          await updateEdificio.mutateAsync(item);
        } else {
          await createEdificio.mutateAsync(item);
        }
      } else if (activeTab === "bloques") {
        const item = { ...data, id } as unknown as Bloque;
        if (form?.mode === "edit") {
          await updateBloque.mutateAsync(item);
        } else {
          await createBloque.mutateAsync(item);
        }
      } else {
        const item = { ...data, id } as unknown as Inmueble;
        if (form?.mode === "edit") {
          await updateInmueble.mutateAsync(item);
        } else {
          await createInmueble.mutateAsync(item);
        }
      }
      setForm(null);
    },
    [activeTab, form, createEdificio, updateEdificio, createBloque, updateBloque, createInmueble, updateInmueble]
  );

  const handleDelete = useCallback(async () => {
    if (!deleteTarget) return;
    if (deleteTarget.tab === "edificios") await deleteEdificio.mutateAsync(deleteTarget.id);
    else if (deleteTarget.tab === "bloques") await deleteBloque.mutateAsync(deleteTarget.id);
    else await deleteInmueble.mutateAsync(deleteTarget.id);
    setDeleteTarget(null);
  }, [deleteTarget, deleteEdificio, deleteBloque, deleteInmueble]);

  const currentSchema =
    activeTab === "edificios" ? edificioSchema : activeTab === "bloques" ? bloqueSchema : inmuebleSchema;

  const edificioFields = [
    { name: "nombre", label: "Nombre del edificio", type: "text" as const, placeholder: "Ej: Torre Sol" },
    { name: "direccion", label: "Dirección", type: "text" as const, placeholder: "Av. Principal 123" },
    { name: "bloques", label: "Cantidad de bloques", type: "number" as const },
    { name: "pisosTotales", label: "Pisos totales", type: "number" as const },
    { name: "departamentosTotales", label: "Departamentos totales", type: "number" as const },
    {
      name: "estado", label: "Estado", type: "select" as const,
      options: [
        { label: "Activo", value: "Activo" },
        { label: "Inactivo", value: "Inactivo" },
      ],
    },
  ];

  const bloqueFields = [
    {
      name: "edificioId", label: "Edificio", type: "select" as const,
      options: edificios.map((e) => ({ label: e.nombre, value: e.id })),
    },
    { name: "nombre", label: "Nombre del bloque", type: "text" as const, placeholder: "Ej: Bloque A" },
    { name: "pisos", label: "Cantidad de pisos", type: "number" as const },
    { name: "inmuebles", label: "Cantidad de inmuebles", type: "number" as const },
  ];

  const inmuebleFields = [
    {
      name: "bloqueId", label: "Bloque", type: "select" as const,
      options: bloques.map((b) => ({
        label: `${b.edificioNombre} - ${b.nombre}`,
        value: b.id,
      })),
    },
    { name: "numero", label: "Número de inmueble", type: "text" as const, placeholder: "Ej: 101" },
    { name: "piso", label: "Piso", type: "number" as const },
    { name: "area", label: "Área (m²)", type: "number" as const },
    { name: "habitaciones", label: "Habitaciones", type: "number" as const },
    { name: "banos", label: "Baños", type: "number" as const },
    { name: "alicuota", label: "Alícuota (%)", type: "number" as const },
    {
      name: "estado", label: "Estado", type: "select" as const,
      options: [
        { label: "Ocupado", value: "Ocupado" },
        { label: "Desocupado", value: "Desocupado" },
      ],
    },
  ];

  const currentFields =
    activeTab === "edificios" ? edificioFields : activeTab === "bloques" ? bloqueFields : inmuebleFields;

  const tabs: { id: Tab; label: string; count: number }[] = [
    { id: "edificios", label: "Edificios", count: edificios.length },
    { id: "bloques", label: "Bloques", count: bloques.length },
    { id: "inmuebles", label: "Inmuebles", count: inmuebles.length },
  ];

  if (isLoading) {
    return (
      <>
        <HeaderPage icon={Building2} title="Inmobiliaria" subtitle="Gestiona edificios, bloques e inmuebles de tu condominio" />
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
        </div>
      </>
    );
  }

  return (
    <>
      <HeaderPage
        icon={Building2}
        title="Inmobiliaria"
        subtitle="Gestiona edificios, bloques e inmuebles de tu condominio"
      >
        <Button variant="accent" size="md" onClick={openCreate}>
          <Plus className="h-4 w-4 mr-1.5" />
          {activeTab === "edificios"
            ? "Nuevo Edificio"
            : activeTab === "bloques"
            ? "Nuevo Bloque"
            : "Nuevo Inmueble"}
        </Button>
      </HeaderPage>

      {/* Tabs */}
      <div className="flex items-center gap-1 mb-6 p-1 bg-surface-100 rounded-xl w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
              activeTab === tab.id
                ? "bg-white text-primary-700 shadow-sm"
                : "text-surface-500 hover:text-surface-700"
            )}
          >
            {tab.label}
            <span className={cn(
              "text-[11px] px-1.5 py-0.5 rounded-full font-bold",
              activeTab === tab.id
                ? "bg-primary-50 text-primary-600"
                : "bg-surface-200 text-surface-500"
            )}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Edificios */}
      {activeTab === "edificios" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {edificios.map((edificio) => (
            <EdificioCard
              key={edificio.id}
              edificio={edificio}
              onClick={() => openEdit(edificio)}
              onDelete={() => setDeleteTarget({ id: edificio.id, label: edificio.nombre, tab: "edificios" })}
            />
          ))}
        </div>
      )}

      {/* Bloques */}
      {activeTab === "bloques" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {bloques.map((bloque) => (
            <BloqueCard
              key={bloque.id}
              bloque={bloque}
              onClick={() => openEdit(bloque)}
              onDelete={() => setDeleteTarget({ id: bloque.id, label: bloque.nombre, tab: "bloques" })}
            />
          ))}
        </div>
      )}

      {/* Inmuebles */}
      {activeTab === "inmuebles" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {inmuebles.map((inmueble) => (
            <InmuebleCard
              key={inmueble.id}
              inmueble={inmueble}
              onClick={() => openEdit(inmueble)}
              onDelete={() => setDeleteTarget({ id: inmueble.id, label: `Dpto ${inmueble.numero}`, tab: "inmuebles" })}
            />
          ))}
        </div>
      )}

      {/* Form Drawer */}
      <FormDrawer
        open={form !== null}
        onClose={() => setForm(null)}
        onSubmit={handleSubmit}
        schema={currentSchema}
        defaultValues={form?.item || undefined}
        title={
          form?.mode === "create"
            ? activeTab === "edificios"
              ? "Nuevo Edificio"
              : activeTab === "bloques"
              ? "Nuevo Bloque"
              : "Nuevo Inmueble"
            : `Editar ${activeTab === "edificios" ? "Edificio" : activeTab === "bloques" ? "Bloque" : "Inmueble"}`
        }
        fields={currentFields}
      />

      {/* Confirm Dialog */}
      <ConfirmDialog
        open={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Eliminar"
        message={
          deleteTarget
            ? `¿Estás seguro de eliminar "${deleteTarget.label}"? Esta acción no se puede deshacer.`
            : ""
        }
        confirmLabel="Eliminar"
        variant="danger"
      />
    </>
  );
}
