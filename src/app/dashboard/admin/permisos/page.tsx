"use client";

import { Fragment, useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Shield, Check, Loader2 } from "lucide-react";
import { HeaderPage } from "@/components/dashboard/header-page";
import { useAuth } from "@/hooks/use-auth";
import { getBasePath } from "@/lib/base-path";

const MODULOS = [
  "Dashboard",
  "Residentes",
  "Areas Comunes",
  "Inmobiliaria",
  "Empleados",
  "Financiero",
  "Servicios",
  "Incidencias",
  "Tareas",
  "Vehiculos",
  "Visitas",
  "Archivos",
  "Reportes",
  "Configuraciones",
  "Notificaciones",
];

const ROLES = ["ADMIN_CONDOMINIO", "EMPLEADO", "RESIDENTE"] as const;

const ROL_LABELS: Record<string, string> = {
  ADMIN_CONDOMINIO: "Admin Condominio",
  EMPLEADO: "Empleado",
  RESIDENTE: "Residente",
};

interface Permiso {
  id?: string;
  rol: string;
  modulo: string;
  leer: boolean;
  escribir: boolean;
}

type PermisoMap = Record<string, Record<string, { leer: boolean; escribir: boolean }>>;

export default function PermisosPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [permisos, setPermisos] = useState<PermisoMap>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && user?.rol !== "SUPER_ADMIN") {
      router.push("/dashboard");
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (user?.rol !== "SUPER_ADMIN") return;

    async function fetchPermisos() {
      try {
        const res = await fetch(`${getBasePath()}/api/admin/permisos`);
        if (res.ok) {
          const data: Permiso[] = await res.json();
          const map: PermisoMap = {};
          for (const rol of ROLES) {
            map[rol] = {};
            for (const modulo of MODULOS) {
              map[rol][modulo] = { leer: false, escribir: false };
            }
          }
          for (const p of data) {
            if (map[p.rol] && map[p.rol][p.modulo]) {
              map[p.rol][p.modulo] = { leer: p.leer, escribir: p.escribir };
            }
          }
          setPermisos(map);
        }
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    }

    fetchPermisos();
  }, [user]);

  const savePermisos = useCallback(
    async (newPermisos: PermisoMap) => {
      setSaving(true);
      try {
        const body: { rol: string; modulo: string; leer: boolean; escribir: boolean }[] = [];
        for (const rol of ROLES) {
          for (const modulo of MODULOS) {
            const p = newPermisos[rol]?.[modulo];
            if (p) {
              body.push({ rol, modulo, leer: p.leer, escribir: p.escribir });
            }
          }
        }

        const res = await fetch(`${getBasePath()}/api/admin/permisos`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });

        if (res.ok) {
          setToast("Permisos guardados correctamente");
          setTimeout(() => setToast(null), 3000);
        } else {
          setToast("Error al guardar permisos");
          setTimeout(() => setToast(null), 3000);
        }
      } catch {
        setToast("Error al guardar permisos");
        setTimeout(() => setToast(null), 3000);
      } finally {
        setSaving(false);
      }
    },
    []
  );

  const togglePermiso = useCallback(
    (rol: string, modulo: string, field: "leer" | "escribir") => {
      setPermisos((prev) => {
        const next = { ...prev };
        next[rol] = { ...next[rol] };
        const current = next[rol][modulo] || { leer: false, escribir: false };
        next[rol][modulo] = { ...current, [field]: !current[field] };

        // If disabling leer, also disable escribir
        if (field === "leer" && current.leer) {
          next[rol][modulo].escribir = false;
        }
        // If enabling escribir, also enable leer
        if (field === "escribir" && !current.escribir) {
          next[rol][modulo].leer = true;
        }

        savePermisos(next);
        return next;
      });
    },
    [savePermisos]
  );

  if (isLoading || user?.rol !== "SUPER_ADMIN") return null;

  return (
    <>
      <HeaderPage
        icon={Shield}
        title="Permisos por Rol"
        subtitle="Administra los permisos de acceso de cada rol en la plataforma"
      />

      {/* Toast */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2 rounded-xl bg-green-600 px-4 py-3 text-sm font-medium text-white shadow-lg animate-in fade-in slide-in-from-top-2">
          <Check className="h-4 w-4" />
          {toast}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" />
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-surface-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-surface-50">
                  <th className="text-left px-5 py-3 text-xs font-medium text-surface-500 uppercase tracking-wider sticky left-0 bg-surface-50 z-10 min-w-[160px]">
                    Modulo
                  </th>
                  {ROLES.map((rol) => (
                    <th
                      key={rol}
                      colSpan={2}
                      className="text-center px-3 py-3 text-xs font-medium text-surface-500 uppercase tracking-wider border-l border-surface-200"
                    >
                      {ROL_LABELS[rol]}
                    </th>
                  ))}
                </tr>
                <tr className="bg-surface-50 border-t border-surface-100">
                  <th className="sticky left-0 bg-surface-50 z-10" />
                  {ROLES.map((rol) => (
                    <Fragment key={rol}>
                      <th className="text-center px-3 py-2 text-[10px] font-semibold text-surface-400 uppercase tracking-wider border-l border-surface-200">
                        Leer
                      </th>
                      <th className="text-center px-3 py-2 text-[10px] font-semibold text-surface-400 uppercase tracking-wider">
                        Escribir
                      </th>
                    </Fragment>
                  ))}
                </tr>
              </thead>
              <tbody>
                {MODULOS.map((modulo, idx) => (
                  <tr
                    key={modulo}
                    className={`border-t border-surface-50 hover:bg-surface-50 transition-colors ${
                      idx % 2 === 0 ? "bg-white" : "bg-surface-25"
                    }`}
                  >
                    <td className="px-5 py-3 text-sm font-medium text-surface-700 sticky left-0 bg-inherit z-10">
                      {modulo}
                    </td>
                    {ROLES.map((rol) => {
                      const p = permisos[rol]?.[modulo] || {
                        leer: false,
                        escribir: false,
                      };
                      return (
                        <Fragment key={rol}>
                          <td className="text-center px-3 py-3 border-l border-surface-200">
                            <button
                              onClick={() => togglePermiso(rol, modulo, "leer")}
                              disabled={saving}
                              className={`mx-auto flex h-6 w-6 items-center justify-center rounded-md border-2 transition-colors ${
                                p.leer
                                  ? "bg-primary-600 border-primary-600 text-white"
                                  : "border-surface-300 bg-white hover:border-primary-400"
                              } ${saving ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                            >
                              {p.leer && <Check className="h-3.5 w-3.5" />}
                            </button>
                          </td>
                          <td className="text-center px-3 py-3">
                            <button
                              onClick={() => togglePermiso(rol, modulo, "escribir")}
                              disabled={saving}
                              className={`mx-auto flex h-6 w-6 items-center justify-center rounded-md border-2 transition-colors ${
                                p.escribir
                                  ? "bg-green-600 border-green-600 text-white"
                                  : "border-surface-300 bg-white hover:border-green-400"
                              } ${saving ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                            >
                              {p.escribir && <Check className="h-3.5 w-3.5" />}
                            </button>
                          </td>
                        </Fragment>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {saving && (
            <div className="flex items-center justify-center gap-2 px-5 py-3 border-t border-surface-100 text-sm text-surface-500">
              <Loader2 className="h-4 w-4 animate-spin" />
              Guardando...
            </div>
          )}
        </div>
      )}
    </>
  );
}

