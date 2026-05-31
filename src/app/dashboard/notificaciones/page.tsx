"use client";
import { useState } from "react";
import { Bell, CheckCheck, Loader2 } from "lucide-react";
import { HeaderPage } from "@/components/dashboard/header-page";
import { Button } from "@/components/ui/button";
import { useApiList, useApiUpdate } from "@/hooks/use-api";
import { cn } from "@/lib/utils";

interface Notificacion {
  id: string;
  condominioId: string;
  userId: string;
  titulo: string;
  descripcion: string;
  tipo: string;
  leida: boolean;
  fecha: string;
  createdAt: string;
}

export default function NotificacionesPage() {
  const { data: notificacionesApi = [], isLoading } = useApiList<Notificacion>("notificaciones");
  const updateMutation = useApiUpdate<Notificacion>("notificaciones");
  const [notifs, setNotifs] = useState<Notificacion[] | null>(null);
  const [filter, setFilter] = useState("Todas");

  // Use local state once loaded, to allow marking as read client-side
  const items = notifs ?? notificacionesApi;

  const marcarLeida = (id: string) => {
    setNotifs(prev => (prev ?? notificacionesApi).map(n => n.id === id ? { ...n, leida: true } : n));
    const notif = (notifs ?? notificacionesApi).find(n => n.id === id);
    if (notif && !notif.leida) {
      updateMutation.mutateAsync({ ...notif, leida: true });
    }
  };
  const marcarTodas = () => {
    const current = notifs ?? notificacionesApi;
    setNotifs(current.map(n => ({ ...n, leida: true })));
    current.filter(n => !n.leida).forEach(n => {
      updateMutation.mutateAsync({ ...n, leida: true });
    });
  };
  const filtered = filter === "Todas" ? items : filter === "No leídas" ? items.filter(n => !n.leida) : items.filter(n => n.leida);
  const noLeidas = items.filter(n => !n.leida).length;
  const tipoColor: Record<string, string> = { cuota: "bg-amber-100 text-amber-700", reserva: "bg-blue-100 text-blue-700", incidencia: "bg-red-100 text-red-700", visita: "bg-purple-100 text-purple-700", pago: "bg-green-100 text-green-700" };

  if (isLoading) {
    return (
      <>
        <HeaderPage icon={Bell} title="Notificaciones" subtitle="Cargando..." />
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
        </div>
      </>
    );
  }

  return (<>
    <HeaderPage icon={Bell} title="Notificaciones" subtitle={`${noLeidas} no leídas`}>
      <Button variant="ghost" size="sm" onClick={marcarTodas}><CheckCheck className="h-4 w-4 mr-1.5"/>Marcar todas leídas</Button>
    </HeaderPage>
    <div className="flex gap-1 p-1 bg-surface-100 rounded-xl w-fit mb-6">{(["Todas","No leídas","Leídas"] as const).map(f=><button key={f} onClick={()=>setFilter(f)} className={cn("px-4 py-1.5 rounded-lg text-xs font-medium transition-all",filter===f?"bg-white text-primary-700 shadow-sm":"text-surface-500 hover:text-surface-700")}>{f}</button>)}</div>
    <div className="bg-white rounded-2xl border border-surface-200 shadow-sm overflow-hidden"><div className="divide-y divide-surface-50">{filtered.map(n=><div key={n.id} onClick={()=>marcarLeida(n.id)} className={cn("flex items-start gap-4 px-5 py-4 cursor-pointer transition-colors hover:bg-surface-50",!n.leida&&"bg-primary-50/30")}><span className={cn("flex-shrink-0 mt-0.5 text-[10px] font-bold px-2 py-0.5 rounded-full",tipoColor[n.tipo])}>{n.tipo}</span><div className="flex-1 min-w-0"><p className={cn("text-sm",n.leida?"text-surface-600":"font-semibold text-surface-800")}>{n.titulo}</p><p className="text-xs text-surface-400 mt-0.5">{n.descripcion}</p></div><span className="text-[10px] text-surface-400 flex-shrink-0 mt-1">{n.fecha}</span></div>)}</div></div>
  </>);
}
