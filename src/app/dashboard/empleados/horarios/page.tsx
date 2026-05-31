"use client";

import { useState, useCallback, useMemo } from "react";
import { Clock, Plus, Edit, Trash2, Loader2 } from "lucide-react";
import { HeaderPage } from "@/components/dashboard/header-page";
import { Button } from "@/components/ui/button";
import { FormDrawer } from "@/components/dashboard/form-drawer";
import { ConfirmDialog } from "@/components/dashboard/confirm-dialog";
import { useApiList, useApiCreate, useApiUpdate, useApiDelete } from "@/hooks/use-api";
import { cn } from "@/lib/utils";
import { z } from "zod";

interface Empleado {
  id: string;
  nombres: string;
  apellidos: string;
}

interface Horario {
  id: string;
  condominioId: string;
  empleadoId: string;
  empleado?: Empleado;
  diaSemana: string;
  horaInicio: string;
  horaFin: string;
  tipoTurno: string;
  createdAt: string;
}

const schema = z.object({
  id: z.string().optional(),
  empleadoId: z.string().min(1),
  diaSemana: z.enum(["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"]),
  horaInicio: z.string().min(1),
  horaFin: z.string().min(1),
  tipoTurno: z.enum(["Mañana", "Tarde", "Noche"]),
});

const dias = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

const colores: Record<string, string> = {
  Mañana: "bg-amber-100 text-amber-800 border-amber-200",
  Tarde: "bg-blue-100 text-blue-800 border-blue-200",
  Noche: "bg-purple-100 text-purple-800 border-purple-200",
};

export default function HorariosPage() {
  const { data: horarios = [], isLoading } = useApiList<Horario>("horarios");
  const { data: empleados = [] } = useApiList<Empleado>("empleados");
  const createMutation = useApiCreate<Horario>("horarios");
  const updateMutation = useApiUpdate<Horario>("horarios");
  const deleteMutation = useApiDelete("horarios");
  const [form, setForm] = useState<{ mode: "create" | "edit"; item?: Horario } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Horario | null>(null);

  const empleadoNombre = useCallback(
    (h: Horario) => {
      if (h.empleado) return `${h.empleado.nombres} ${h.empleado.apellidos}`;
      const emp = empleados.find((e) => e.id === h.empleadoId);
      return emp ? `${emp.nombres} ${emp.apellidos}` : h.empleadoId;
    },
    [empleados]
  );

  const empleadosUnicos = useMemo(() => {
    const names = [...new Set(horarios.map((h) => empleadoNombre(h)))];
    return names;
  }, [horarios, empleadoNombre]);

  const grid = useMemo(() => {
    const map: Record<string, Record<string, Horario[]>> = {};
    empleadosUnicos.forEach((e) => {
      map[e] = {};
      dias.forEach((d) => {
        map[e][d] = [];
      });
    });
    horarios.forEach((h) => {
      const name = empleadoNombre(h);
      if (map[name]) map[name][h.diaSemana].push(h);
    });
    return map;
  }, [horarios, empleadosUnicos, empleadoNombre]);

  const handleSubmit = useCallback(
    async (data: Record<string, unknown>) => {
      const id = (data.id as string) || crypto.randomUUID();
      const item = { ...data, id } as unknown as Horario;
      if (form?.mode === "edit") await updateMutation.mutateAsync(item);
      else await createMutation.mutateAsync(item);
      setForm(null);
    },
    [form, createMutation, updateMutation]
  );

  const fields = [
    {
      name: "empleadoId",
      label: "Empleado",
      type: "select" as const,
      options: empleados.map((e) => ({ label: `${e.nombres} ${e.apellidos}`, value: e.id })),
    },
    {
      name: "diaSemana",
      label: "Día de la semana",
      type: "select" as const,
      options: dias.map((d) => ({ label: d, value: d })),
    },
    { name: "horaInicio", label: "Hora Inicio", type: "text" as const, placeholder: "08:00" },
    { name: "horaFin", label: "Hora Fin", type: "text" as const, placeholder: "16:00" },
    {
      name: "tipoTurno",
      label: "Tipo de Turno",
      type: "select" as const,
      options: ["Mañana", "Tarde", "Noche"].map((t) => ({ label: t, value: t })),
    },
  ];

  if (isLoading) {
    return (
      <>
        <HeaderPage icon={Clock} title="Horarios" subtitle="Turnos y programación semanal" />
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
        </div>
      </>
    );
  }

  return (
    <>
      <HeaderPage icon={Clock} title="Horarios" subtitle="Turnos y programación semanal">
        <Button variant="accent" size="md" onClick={() => setForm({ mode: "create" })}>
          <Plus className="h-4 w-4 mr-1.5" />
          Nuevo Horario
        </Button>
      </HeaderPage>

      <div className="bg-white rounded-2xl border border-surface-200 shadow-sm overflow-x-auto">
        <table className="w-full min-w-[600px] lg:min-w-[900px]">
          <thead>
            <tr className="border-b border-surface-100">
              <th className="px-4 py-3 text-left text-xs font-medium text-surface-400 uppercase w-[140px]">
                Empleado
              </th>
              {dias.map((d) => (
                <th key={d} className="px-3 py-3 text-center text-xs font-medium text-surface-500 uppercase">
                  {d}
                </th>
              ))}
              <th className="px-3 py-3 w-10" />
            </tr>
          </thead>
          <tbody>
            {empleadosUnicos.map((emp) => (
              <tr key={emp} className="border-b border-surface-50 group">
                <td className="px-4 py-3 text-sm font-medium text-surface-800">{emp}</td>
                {dias.map((dia) => {
                  const turnos = grid[emp]?.[dia] || [];
                  return (
                    <td key={dia} className="px-2 py-2">
                      {turnos.length > 0 ? (
                        turnos.map((t) => (
                          <div
                            key={t.id}
                            className={cn(
                              "text-[10px] font-semibold px-2 py-1.5 rounded-lg border text-center mb-1 cursor-pointer",
                              colores[t.tipoTurno]
                            )}
                            onClick={() => setForm({ mode: "edit", item: t })}
                          >
                            {t.horaInicio} - {t.horaFin}
                          </div>
                        ))
                      ) : (
                        <span className="text-xs text-surface-300">—</span>
                      )}
                    </td>
                  );
                })}
                <td className="px-2 py-2">
                  {(() => {
                    const allTurnos = dias.flatMap((d) => grid[emp]?.[d] || []);
                    if (allTurnos.length === 0) return null;
                    return (
                      <div className="flex flex-col gap-0.5 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                        {allTurnos.map((t) => (
                          <div key={t.id} className="flex gap-0.5">
                            <button
                              onClick={() => setForm({ mode: "edit", item: t })}
                              className="p-1 rounded text-surface-400 hover:text-primary-600"
                            >
                              <Edit className="h-3 w-3" />
                            </button>
                            <button
                              onClick={() => setDeleteTarget(t)}
                              className="p-1 rounded text-surface-400 hover:text-red-600"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    );
                  })()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <FormDrawer
        open={form !== null}
        onClose={() => setForm(null)}
        onSubmit={handleSubmit}
        schema={schema}
        defaultValues={(form?.item as unknown as z.infer<typeof schema>) || undefined}
        title={form?.mode === "create" ? "Nuevo Horario" : "Editar Horario"}
        fields={fields}
      />
      <ConfirmDialog
        open={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={async () => {
          if (deleteTarget) await deleteMutation.mutateAsync(deleteTarget.id);
          setDeleteTarget(null);
        }}
        title="Eliminar horario"
        message={`¿Eliminar el horario de ${deleteTarget?.diaSemana} (${deleteTarget?.horaInicio} - ${deleteTarget?.horaFin})?`}
      />
    </>
  );
}
