/**
 * Sistema granular de permisos por rol.
 *
 * Cada rol tiene una lista de rutas permitidas (prefijos).
 * El sidebar filtra los menús y el layout protege las rutas.
 */

export type Rol = "SUPER_ADMIN" | "ADMIN_CONDOMINIO" | "EMPLEADO" | "RESIDENTE";

/** Rutas permitidas por rol (prefijos que matchean con startsWith) */
const ROLE_ROUTES: Record<Rol, string[]> = {
  SUPER_ADMIN: [
    "/dashboard/admin",
    "/dashboard/perfil",
  ],

  ADMIN_CONDOMINIO: [
    "/dashboard",
    "/dashboard/residentes",
    "/dashboard/areas-comunes",
    "/dashboard/inmobiliaria",
    "/dashboard/empleados",
    "/dashboard/financiero",
    "/dashboard/servicios",
    "/dashboard/incidencias",
    "/dashboard/tareas",
    "/dashboard/vehiculos",
    "/dashboard/visitas",
    "/dashboard/archivos",
    "/dashboard/reportes",
    "/dashboard/configuraciones",
    "/dashboard/notificaciones",
    "/dashboard/perfil",
  ],

  EMPLEADO: [
    "/dashboard",
    "/dashboard/incidencias",
    "/dashboard/tareas",
    "/dashboard/vehiculos",
    "/dashboard/visitas",
    "/dashboard/notificaciones",
    "/dashboard/perfil",
  ],

  RESIDENTE: [
    "/dashboard",
    "/dashboard/areas-comunes",
    "/dashboard/archivos",
    "/dashboard/notificaciones",
    "/dashboard/perfil",
  ],
};

/** Ruta por defecto al entrar a /dashboard según el rol */
export const DEFAULT_ROUTE: Record<Rol, string> = {
  SUPER_ADMIN: "/dashboard/admin",
  ADMIN_CONDOMINIO: "/dashboard",
  EMPLEADO: "/dashboard",
  RESIDENTE: "/dashboard",
};

/** Verifica si un rol tiene acceso a una ruta */
export function hasAccess(rol: Rol, pathname: string): boolean {
  // /dashboard exacto: todos tienen acceso excepto SUPER_ADMIN (se redirige)
  if (pathname === "/dashboard") {
    return rol !== "SUPER_ADMIN";
  }

  const allowed = ROLE_ROUTES[rol];
  if (!allowed) return false;

  return allowed.some((route) => {
    if (route === "/dashboard") return pathname === "/dashboard";
    return pathname === route || pathname.startsWith(route + "/");
  });
}

/** Labels de rol para mostrar en UI */
export const ROL_LABELS: Record<Rol, string> = {
  SUPER_ADMIN: "Super Administrador",
  ADMIN_CONDOMINIO: "Administrador",
  EMPLEADO: "Personal",
  RESIDENTE: "Residente",
};

/**
 * IDs de menú que cada rol puede ver en el sidebar.
 * Usamos los labels del menú como identificadores.
 */
const SIDEBAR_ITEMS: Record<Rol, string[]> = {
  SUPER_ADMIN: [
    "Panel Admin",
    "Condominios",
  ],

  ADMIN_CONDOMINIO: [
    "Dashboard",
    "Residentes",
    "Áreas Comunes",
    "Inmobiliaria",
    "Empleados",
    "Financiero",
    "Servicios del Condominio",
    "Incidencias",
    "Tareas",
    "Vehículos",
    "Visitas",
    "Archivos Compartidos",
    "Reportes",
    "Configuraciones",
  ],

  EMPLEADO: [
    "Dashboard",
    "Incidencias",
    "Tareas",
    "Vehículos",
    "Visitas",
  ],

  RESIDENTE: [
    "Dashboard",
    "Áreas Comunes",
    "Archivos Compartidos",
  ],
};

/** Verifica si un item del sidebar es visible para un rol */
export function canSeeMenuItem(rol: Rol, itemLabel: string): boolean {
  const allowed = SIDEBAR_ITEMS[rol];
  if (!allowed) return false;
  return allowed.includes(itemLabel);
}

/** Grupos del sidebar visibles para un rol */
export function getVisibleGroups(rol: Rol): string[] {
  if (rol === "SUPER_ADMIN") return ["Super Admin"];
  if (rol === "EMPLEADO") return ["Principal"];
  if (rol === "RESIDENTE") return ["Principal", "Documentos"];
  return ["Principal", "Documentos"];
}
