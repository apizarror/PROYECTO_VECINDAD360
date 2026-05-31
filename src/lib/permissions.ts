/**
 * Sistema granular de permisos por rol.
 *
 * Cada rol tiene una lista de rutas permitidas (prefijos).
 * El sidebar filtra los menús y el layout protege las rutas.
 *
 * Los permisos se leen de la BD (tabla RolePermission) cuando están
 * disponibles. Las listas hardcodeadas se usan como fallback.
 */

export type Rol = "SUPER_ADMIN" | "ADMIN_CONDOMINIO" | "EMPLEADO" | "RESIDENTE";

/** Permisos cargados desde la BD */
export interface DbPermission {
  modulo: string;
  leer: boolean;
  escribir: boolean;
}

/** Mapeo de labels de menú del sidebar a nombres de módulo en la BD */
export const MENU_TO_MODULE: Record<string, string> = {
  "Dashboard": "Dashboard",
  "Residentes": "Residentes",
  "Áreas Comunes": "Areas Comunes",
  "Inmobiliaria": "Inmobiliaria",
  "Empleados": "Empleados",
  "Financiero": "Financiero",
  "Servicios del Condominio": "Servicios",
  "Incidencias": "Incidencias",
  "Tareas": "Tareas",
  "Vehículos": "Vehiculos",
  "Visitas": "Visitas",
  "Archivos Compartidos": "Archivos",
  "Reportes": "Reportes",
  "Configuraciones": "Configuraciones",
};

/** Mapeo de nombres de modelo Prisma a nombres de módulo en la BD */
export const MODEL_TO_MODULE: Record<string, string> = {
  persona: "Residentes",
  contacto: "Residentes",
  vinculacion: "Residentes",
  miembroDirectiva: "Residentes",
  multa: "Residentes",
  areaComun: "Areas Comunes",
  reserva: "Areas Comunes",
  edificio: "Inmobiliaria",
  bloque: "Inmobiliaria",
  inmueble: "Inmobiliaria",
  empleado: "Empleados",
  dispositivo: "Empleados",
  horario: "Empleados",
  cuentaBancaria: "Financiero",
  presupuesto: "Financiero",
  egreso: "Financiero",
  ingreso: "Financiero",
  cargoServicio: "Servicios",
  cuotaMantenimiento: "Servicios",
  grupoRubro: "Configuraciones",
  servicioRubro: "Configuraciones",
  incidencia: "Incidencias",
  tareaProgramada: "Tareas",
  vehiculo: "Vehiculos",
  movimientoVehicular: "Vehiculos",
  visita: "Visitas",
  archivo: "Archivos",
  notificacion: "Notificaciones",
};

/** Rutas permitidas por rol (prefijos que matchean con startsWith) — FALLBACK */
const ROLE_ROUTES: Record<Rol, string[]> = {
  SUPER_ADMIN: [
    "/dashboard/admin",
    "/dashboard/admin/permisos",
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
 * IDs de menú que cada rol puede ver en el sidebar — FALLBACK.
 */
const SIDEBAR_ITEMS: Record<Rol, string[]> = {
  SUPER_ADMIN: [
    "Panel Admin",
    "Condominios",
    "Usuarios",
    "Permisos",
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

/** Verifica si un item del sidebar es visible para un rol (fallback hardcoded) */
export function canSeeMenuItem(rol: Rol, itemLabel: string): boolean {
  const allowed = SIDEBAR_ITEMS[rol];
  if (!allowed) return false;
  return allowed.includes(itemLabel);
}

/**
 * Verifica si un item del sidebar es visible usando permisos de BD.
 * Si dbPermissions está vacío o no definido, usa el fallback hardcoded.
 */
export function canSeeMenuItemWithDb(
  rol: Rol,
  itemLabel: string,
  dbPermissions?: DbPermission[]
): boolean {
  // SUPER_ADMIN siempre usa la lista hardcoded (no se almacenan sus permisos)
  if (rol === "SUPER_ADMIN") {
    return canSeeMenuItem(rol, itemLabel);
  }

  // Si no hay permisos de BD cargados, fallback
  if (!dbPermissions || dbPermissions.length === 0) {
    return canSeeMenuItem(rol, itemLabel);
  }

  const moduleName = MENU_TO_MODULE[itemLabel];
  if (!moduleName) {
    // Items sin mapeo (e.g. items del Super Admin group) - usar fallback
    return canSeeMenuItem(rol, itemLabel);
  }

  const perm = dbPermissions.find((p) => p.modulo === moduleName);
  if (!perm) return false;
  return perm.leer;
}

/** Grupos del sidebar visibles para un rol */
export function getVisibleGroups(rol: Rol): string[] {
  if (rol === "SUPER_ADMIN") return ["Super Admin"];
  if (rol === "EMPLEADO") return ["Principal"];
  if (rol === "RESIDENTE") return ["Principal", "Documentos"];
  return ["Principal", "Documentos"];
}
