"use client";
import { BarChart3, FileText, DollarSign, Users, CalendarDays, AlertTriangle, TrendingUp } from "lucide-react";
import { HeaderPage } from "@/components/dashboard/header-page";

const reportes = [
  { nombre:"Estado financiero mensual", icono:TrendingUp, desc:"Ingresos vs Egresos vs Saldo" },
  { nombre:"Morosidad por inmueble", icono:AlertTriangle, desc:"Residentes y departamentos con deuda vencida" },
  { nombre:"Reservas por área común", icono:CalendarDays, desc:"Uso de áreas y ocupación por período" },
  { nombre:"Incidencias por categoría", icono:AlertTriangle, desc:"Análisis de incidencias y SLA" },
  { nombre:"Visitas por mes", icono:Users, desc:"Estadísticas de control de visitantes" },
  { nombre:"Empleados: asistencia", icono:Users, desc:"Horas trabajadas y asistencias" },
  { nombre:"Cuotas emitidas vs cobradas", icono:DollarSign, desc:"Porcentaje de cobranza por período" },
];

export default function ReportesPage() {
  return (<>
    <HeaderPage icon={BarChart3} title="Reportes" subtitle="Reportes operacionales y financieros"/>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
      {reportes.map((r,i)=><div key={i} className="bg-white rounded-2xl border border-surface-200 shadow-sm p-5 hover:shadow-md hover:border-primary-200 cursor-pointer transition-all"><div className="flex items-start gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary-600 flex-shrink-0"><r.icono className="h-5 w-5"/></div><div><h3 className="font-semibold text-surface-800">{r.nombre}</h3><p className="text-xs text-surface-400 mt-1">{r.desc}</p></div></div><div className="flex gap-2 mt-4 pt-3 border-t border-surface-100"><span className="text-[10px] font-medium px-2 py-1 rounded-lg bg-primary-50 text-primary-600 cursor-pointer hover:bg-primary-100 transition-colors">Exportar PDF</span><span className="text-[10px] font-medium px-2 py-1 rounded-lg bg-green-50 text-green-600 cursor-pointer hover:bg-green-100 transition-colors">Exportar Excel</span></div></div>)}
    </div>
  </>);
}
