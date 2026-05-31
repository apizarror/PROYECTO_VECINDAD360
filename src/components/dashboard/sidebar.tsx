"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  Building2,
  Home,
  BriefcaseBusiness,
  DollarSign,
  Wrench,
  AlertTriangle,
  ListTodo,
  Car,
  PersonStanding,
  FolderOpen,
  BarChart3,
  Shield,
  Settings,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  X,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { canSeeMenuItem, getVisibleGroups, ROL_LABELS, type Rol } from "@/lib/permissions";

interface SubMenuItem {
  label: string;
  href: string;
}

interface MenuItem {
  label: string;
  icon: LucideIcon;
  href?: string;
  submenu?: SubMenuItem[];
}

interface MenuGroup {
  header: string;
  items: MenuItem[];
}

const menuGroups: MenuGroup[] = [
  {
    header: "Principal",
    items: [
      { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
      {
        label: "Residentes",
        icon: Users,
        submenu: [
          { label: "Lista de Residentes", href: "/dashboard/residentes" },
          { label: "Directiva", href: "/dashboard/residentes/directiva" },
          { label: "Multas", href: "/dashboard/residentes/multas" },
        ],
      },
      {
        label: "Áreas Comunes",
        icon: Building2,
        submenu: [
          { label: "Áreas", href: "/dashboard/areas-comunes" },
          { label: "Reservas", href: "/dashboard/areas-comunes/reservas" },
        ],
      },
      {
        label: "Inmobiliaria",
        icon: Home,
        submenu: [
          { label: "Lista de Inmuebles", href: "/dashboard/inmobiliaria" },
        ],
      },
      {
        label: "Empleados",
        icon: BriefcaseBusiness,
        submenu: [
          { label: "Lista", href: "/dashboard/empleados" },
          { label: "Dispositivos", href: "/dashboard/empleados/dispositivos" },
          { label: "Horarios", href: "/dashboard/empleados/horarios" },
        ],
      },
      {
        label: "Financiero",
        icon: DollarSign,
        submenu: [
          { label: "Cuentas Bancarias", href: "/dashboard/financiero/cuentas" },
          { label: "Presupuestos", href: "/dashboard/financiero/presupuestos" },
          { label: "Egresos", href: "/dashboard/financiero/egresos" },
          { label: "Ingresos", href: "/dashboard/financiero/ingresos" },
        ],
      },
      {
        label: "Servicios del Condominio",
        icon: Wrench,
        submenu: [
          { label: "Cargos por Servicio", href: "/dashboard/servicios/cargos-servicio" },
          { label: "Cargos Totales", href: "/dashboard/servicios/cargos-totales" },
          { label: "Cuotas de Mantenimiento", href: "/dashboard/servicios/cuotas" },
        ],
      },
      { label: "Incidencias", icon: AlertTriangle, href: "/dashboard/incidencias" },
      {
        label: "Tareas",
        icon: ListTodo,
        submenu: [
          { label: "Programadas", href: "/dashboard/tareas" },
        ],
      },
      {
        label: "Vehículos",
        icon: Car,
        submenu: [
          { label: "Vehículos del Condominio", href: "/dashboard/vehiculos" },
          { label: "Movimiento Vehicular", href: "/dashboard/vehiculos/movimiento" },
        ],
      },
      { label: "Visitas", icon: PersonStanding, href: "/dashboard/visitas" },
    ],
  },
  {
    header: "Documentos",
    items: [
      { label: "Archivos Compartidos", icon: FolderOpen, href: "/dashboard/archivos" },
      { label: "Reportes", icon: BarChart3, href: "/dashboard/reportes" },
      { label: "Configuraciones", icon: Settings, href: "/dashboard/configuraciones" },
    ],
  },
];

const adminMenuGroup: MenuGroup = {
  header: "Super Admin",
  items: [
    { label: "Panel Admin", icon: Shield, href: "/dashboard/admin" },
    {
      label: "Condominios",
      icon: Building2,
      href: "/dashboard/admin/condominios",
    },
  ],
};


export function Sidebar({
  collapsed,
  onToggleCollapse,
  mobileOpen,
  onCloseMobile,
}: {
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}) {
  const pathname = usePathname();
  const { user } = useAuth();
  const rol = (user?.rol || "ADMIN_CONDOMINIO") as Rol;
  const allowedGroupHeaders = getVisibleGroups(rol);

  const allGroups = [...menuGroups, adminMenuGroup];
  const visibleGroups = allGroups
    .filter((group) => allowedGroupHeaders.includes(group.header))
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => canSeeMenuItem(rol, item.label)),
    }))
    .filter((group) => group.items.length > 0);

  const [openSubmenus, setOpenSubmenus] = useState<Set<string>>(() => {
    const expanded = new Set<string>();
    for (const group of visibleGroups) {
      for (const item of group.items) {
        if (item.submenu?.some((sub) => pathname.startsWith(sub.href))) {
          expanded.add(item.label);
        }
      }
    }
    return expanded;
  });

  const toggleSubmenu = (label: string) => {
    setOpenSubmenus((prev) => {
      const next = new Set(prev);
      if (next.has(label)) {
        next.delete(label);
      } else {
        next.add(label);
      }
      return next;
    });
  };

  const isItemActive = (item: MenuItem) => {
    if (item.href === "/dashboard") return pathname === "/dashboard";
    if (item.href) return pathname === item.href || pathname.startsWith(item.href + "/");
    if (item.submenu) return item.submenu.some((sub) => pathname === sub.href || pathname.startsWith(sub.href + "/"));
    return false;
  };

  const isSubActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-30"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={cn(
          "fixed left-0 top-0 bottom-0 z-40 flex-col bg-white border-r border-surface-200 transition-all duration-300",
          collapsed ? "w-[72px]" : "w-[290px]",
          mobileOpen ? "flex" : "hidden md:flex"
        )}
      >
      {/* Tenant info */}
      <div className={cn("flex items-center gap-3 px-4 py-5 border-b border-surface-100", collapsed && "justify-center px-2")}>
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-primary-600 text-white font-extrabold text-sm">
          {user?.avatar || "AD"}
        </div>
        {!collapsed && (
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-surface-800 truncate leading-tight">
              {user?.nombre} {user?.apellidos}
            </p>
            <p className="text-[10px] text-surface-400 truncate">{ROL_LABELS[rol]}</p>
          </div>
        )}
        <button
          onClick={onCloseMobile}
          className="md:hidden p-2 rounded-lg text-surface-400 hover:text-surface-600 hover:bg-surface-50"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3 scrollbar-thin">
        {visibleGroups.map((group) => (
          <div key={group.header} className="mb-4">
            {!collapsed && (
              <p className="px-4 py-1 text-[10px] font-bold uppercase tracking-widest text-surface-400">
                {group.header}
              </p>
            )}
            <ul className="space-y-0.5 px-2">
              {group.items.map((item) => {
                const active = isItemActive(item);
                const hasSubmenu = !!item.submenu;
                const submenuOpen = openSubmenus.has(item.label);

                return (
                  <li key={item.label}>
                    {hasSubmenu ? (
                      <>
                        <button
                          onClick={() => !collapsed && toggleSubmenu(item.label)}
                          className={cn(
                            "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors text-left",
                            active
                              ? "bg-primary-50 text-primary-700 border-l-[3px] border-l-primary-600"
                              : "text-surface-600 hover:bg-surface-50 hover:text-surface-800",
                            collapsed && "justify-center px-2"
                          )}
                        >
                          <item.icon className={cn("h-5 w-5 flex-shrink-0", active ? "text-primary-600" : "text-surface-400")} />
                          {!collapsed && (
                            <>
                              <span className="flex-1 truncate">{item.label}</span>
                              <ChevronDown
                                className={cn(
                                  "h-3.5 w-3.5 flex-shrink-0 text-surface-400 transition-transform",
                                  submenuOpen && "rotate-180"
                                )}
                              />
                            </>
                          )}
                        </button>
                        <AnimatePresence initial={false}>
                          {submenuOpen && !collapsed && (
                            <motion.ul
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="ml-6 border-l border-surface-200 pl-2 space-y-0.5 overflow-hidden"
                            >
                              {item.submenu!.map((sub) => (
                                <li key={sub.href}>
                                  <Link
                                    href={sub.href}
                                    className={cn(
                                      "flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-colors",
                                      isSubActive(sub.href)
                                        ? "bg-primary-50 text-primary-700 font-medium"
                                        : "text-surface-500 hover:text-surface-700 hover:bg-surface-50"
                                    )}
                                  >
                                    <div
                                      className={cn(
                                        "h-1 w-1 rounded-full flex-shrink-0",
                                        isSubActive(sub.href) ? "bg-primary-600" : "bg-surface-300"
                                      )}
                                    />
                                    <span className="truncate">{sub.label}</span>
                                  </Link>
                                </li>
                              ))}
                            </motion.ul>
                          )}
                        </AnimatePresence>
                      </>
                    ) : (
                      <Link
                        href={item.href!}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
                          active
                            ? "bg-primary-50 text-primary-700 border-l-[3px] border-l-primary-600"
                            : "text-surface-600 hover:bg-surface-50 hover:text-surface-800",
                          collapsed && "justify-center px-2"
                        )}
                      >
                        <item.icon className={cn("h-5 w-5 flex-shrink-0", active ? "text-primary-600" : "text-surface-400")} />
                        {!collapsed && <span className="truncate">{item.label}</span>}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Collapse button */}
      <div className="border-t border-surface-200 p-3">
        <button
          onClick={onToggleCollapse}
          className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-surface-400 hover:text-surface-600 hover:bg-surface-50 transition-colors text-sm"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <>
              <ChevronLeft className="h-4 w-4" />
              <span>Colapsar</span>
            </>
          )}
        </button>
      </div>
    </aside>
  </>
  );
}
