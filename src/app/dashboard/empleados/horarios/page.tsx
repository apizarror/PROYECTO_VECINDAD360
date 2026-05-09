"use client";

import { useMemo } from "react";
import { Clock } from "lucide-react";
import { HeaderPage } from "@/components/dashboard/header-page";
import { horarios } from "@/lib/mock-data/empleados";
import { cn } from "@/lib/utils";

const dias = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

const colores: Record<string, string> = {
  Mañana: "bg-amber-100 text-amber-800 border-amber-200",
  Tarde: "bg-blue-100 text-blue-800 border-blue-200",
  Noche: "bg-purple-100 text-purple-800 border-purple-200",
  Rotativo: "bg-green-100 text-green-800 border-green-200",
};

const empleadosUnicos = [...new Set(horarios.map((h) => h.empleadoNombre))];

export default function HorariosPage() {
  const grid = useMemo(() => {
    const map: Record<string, Record<string, typeof horarios>> = {};
    empleadosUnicos.forEach((e) => {
      map[e] = {};
      dias.forEach((d) => {
        map[e][d] = [];
      });
    });
    horarios.forEach((h) => {
      if (map[h.empleadoNombre]) map[h.empleadoNombre][h.diaSemana].push(h);
    });
    return map;
  }, []);

  return (
    <>
      <HeaderPage icon={Clock} title="Horarios" subtitle="Turnos y programación semanal" />
      <div className="bg-white rounded-2xl border border-surface-200 shadow-sm overflow-x-auto">
        <table className="w-full min-w-[900px]">
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
            </tr>
          </thead>
          <tbody>
            {empleadosUnicos.map((emp) => (
              <tr key={emp} className="border-b border-surface-50">
                <td className="px-4 py-3 text-sm font-medium text-surface-800">{emp}</td>
                {dias.map((dia) => {
                  const turnos = grid[emp]?.[dia] || [];
                  return (
                    <td key={dia} className="px-2 py-2">
                      {turnos.length > 0 ? (
                        turnos.map((t, i) => (
                          <div
                            key={i}
                            className={cn(
                              "text-[10px] font-semibold px-2 py-1.5 rounded-lg border text-center mb-1",
                              colores[t.tipoTurno]
                            )}
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
