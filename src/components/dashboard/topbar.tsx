"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Bell, Menu, Moon, Sun, ChevronDown, LogOut, User, Settings } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";

function getBreadcrumbs(pathname: string) {
  const segments = pathname.split("/").filter(Boolean);
  if (segments[0] !== "dashboard") return [];

  const crumbs: { label: string; href: string }[] = [
    { label: "Dashboard", href: "/dashboard" },
  ];

  const labelMap: Record<string, string> = {
    residentes: "Residentes",
    directiva: "Directiva",
    multas: "Multas",
    "areas-comunes": "Áreas Comunes",
    reservas: "Reservas",
    inmobiliaria: "Inmobiliaria",
    lectura: "Lectura de Servicios",
    empleados: "Empleados",
    dispositivos: "Dispositivos",
    horarios: "Horarios",
    financiero: "Financiero",
    cuentas: "Cuentas Bancarias",
    presupuestos: "Presupuestos",
    egresos: "Egresos",
    ingresos: "Ingresos",
    servicios: "Servicios del Condominio",
    "cargos-servicio": "Cargos por Servicio",
    "cargos-totales": "Cargos Totales",
    cuotas: "Cuotas de Mantenimiento",
    incidencias: "Incidencias",
    tareas: "Tareas",
    vehiculos: "Vehículos",
    movimiento: "Movimiento Vehicular",
    visitas: "Visitas",
    archivos: "Archivos Compartidos",
    reportes: "Reportes",
    configuraciones: "Configuraciones",
    perfil: "Perfil",
    notificaciones: "Notificaciones",
  };

  let href = "/dashboard";
  for (let i = 1; i < segments.length && i <= 3; i++) {
    const seg = segments[i];
    href += "/" + seg;
    crumbs.push({ label: labelMap[seg] || seg, href });
  }

  return crumbs;
}

export function Topbar({ collapsed, onToggleMobile }: { collapsed: boolean; onToggleMobile?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [dark, setDark] = useState(false);
  const [notifCount] = useState(3);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);
  const breadcrumbs = getBreadcrumbs(pathname);

  const toggleDark = () => {
    setDark(!dark);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <header
      className={cn(
        "fixed top-0 right-0 z-30 h-[60px] bg-white border-b border-surface-200 flex items-center justify-between px-4 md:px-6 transition-all duration-300 left-0",
        collapsed ? "md:left-[72px]" : "md:left-[290px]"
      )}
    >
      {/* Left: Hamburger + Breadcrumb */}
      <div className="flex items-center gap-1.5 text-sm">
        {onToggleMobile && (
          <button
            onClick={onToggleMobile}
            className="md:hidden p-2 rounded-lg text-surface-500 hover:text-surface-700 hover:bg-surface-50 mr-1"
            aria-label="Abrir menú"
          >
            <Menu className="h-5 w-5" />
          </button>
        )}
        {breadcrumbs.map((crumb, i) => (
          <span key={crumb.href} className="flex items-center gap-1.5">
            {i > 0 && <span className="text-surface-300">/</span>}
            {i === breadcrumbs.length - 1 ? (
              <span className="text-surface-800 font-medium">{crumb.label}</span>
            ) : (
              <Link href={crumb.href} className="text-surface-400 hover:text-primary-600 transition-colors">
                {crumb.label}
              </Link>
            )}
          </span>
        ))}
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-1">
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifs(!showNotifs)}
            className="relative p-2 rounded-lg text-surface-400 hover:text-surface-600 hover:bg-surface-50 transition-colors"
            aria-label="Notificaciones"
          >
            <Bell className="h-5 w-5" />
            {notifCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white min-w-[18px] h-[18px] px-1">
                {notifCount}
              </span>
            )}
          </button>

          {showNotifs && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowNotifs(false)} />
              <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl border border-surface-200 shadow-xl z-50">
                <div className="p-3 border-b border-surface-100">
                  <p className="text-sm font-semibold text-surface-800">Notificaciones</p>
                </div>
                <div className="p-2 space-y-1">
                  {[
                    { title: "Cuota vencida", desc: "Dpto 302 — S/ 150.00", time: "Hace 1 hora" },
                    { title: "Reserva confirmada", desc: "Parrilla — Hoy 18:00", time: "Hace 3 horas" },
                    { title: "Incidencia asignada", desc: "Fuga de agua — Bloque A", time: "Hace 5 horas" },
                  ].map((n, i) => (
                    <div key={i} className="flex items-start gap-3 p-2 rounded-lg hover:bg-surface-50 cursor-pointer">
                      <div className="h-2 w-2 rounded-full bg-primary-500 mt-1.5 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-surface-800">{n.title}</p>
                        <p className="text-xs text-surface-500 truncate">{n.desc}</p>
                        <p className="text-[10px] text-surface-400 mt-0.5">{n.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-2 border-t border-surface-100">
                  <Link
                    href="/dashboard/notificaciones"
                    onClick={() => setShowNotifs(false)}
                    className="block text-center text-xs text-primary-600 font-medium hover:text-primary-700 py-1"
                  >
                    Ver todas
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Dark mode toggle */}
        <button
          onClick={toggleDark}
          className="p-2 rounded-lg text-surface-400 hover:text-surface-600 hover:bg-surface-50 transition-colors"
          aria-label="Cambiar tema"
        >
          {dark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>

        {/* User avatar */}
        <div className="relative ml-1">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-surface-50 transition-colors"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-600 text-white text-xs font-bold">
              {user?.avatar || "AD"}
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-surface-400" />
          </button>

          {showUserMenu && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl border border-surface-200 shadow-xl z-50 py-1">
                <Link
                  href="/dashboard/perfil"
                  onClick={() => setShowUserMenu(false)}
                  className="flex items-center gap-2.5 px-3 py-2 text-sm text-surface-600 hover:bg-surface-50"
                >
                  <User className="h-4 w-4" />
                  Perfil
                </Link>
                <Link
                  href="/dashboard/notificaciones"
                  onClick={() => setShowUserMenu(false)}
                  className="flex items-center gap-2.5 px-3 py-2 text-sm text-surface-600 hover:bg-surface-50"
                >
                  <Bell className="h-4 w-4" />
                  Notificaciones
                </Link>
                <Link
                  href="/dashboard/configuraciones"
                  onClick={() => setShowUserMenu(false)}
                  className="flex items-center gap-2.5 px-3 py-2 text-sm text-surface-600 hover:bg-surface-50"
                >
                  <Settings className="h-4 w-4" />
                  Configuraciones
                </Link>
                <div className="border-t border-surface-100 my-1" />
                <button
                  onClick={() => { logout(); router.push("/auth"); }}
                  className="flex w-full items-center gap-2.5 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4" />
                  Cerrar sesión
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
