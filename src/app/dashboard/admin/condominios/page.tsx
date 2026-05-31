"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Building2, Plus } from "lucide-react";
import { HeaderPage } from "@/components/dashboard/header-page";
import { useAuth } from "@/hooks/use-auth";
import { getBasePath } from "@/lib/base-path";
import { cn } from "@/lib/utils";

interface CondominioRow {
  id: string;
  nombre: string;
  direccion: string;
  plan: string;
  activo: boolean;
  modalidad: string;
  trialEndsAt: string | null;
  createdAt: string;
  adminId: string | null;
  _count: { users: number; edificios: number; inmuebles: number };
  users?: { email: string; rol: string }[];
}

const PLANS = ["TRIAL", "BASICO", "PRO", "EMPRESARIAL"] as const;

export default function AdminCondominiosPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [condominios, setCondominios] = useState<CondominioRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  // Create condominio form
  const [showCreate, setShowCreate] = useState(false);
  const [createForm, setCreateForm] = useState({
    nombre: "",
    direccion: "",
    modalidad: "AUTOGESTION",
    adminEmail: "",
    adminPassword: "",
    adminNombre: "",
    adminApellidos: "",
  });
  const [createError, setCreateError] = useState("");
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (!isLoading && user?.rol !== "SUPER_ADMIN") {
      router.push("/dashboard");
    }
  }, [user, isLoading, router]);

  const fetchCondominios = useCallback(async () => {
    try {
      const res = await fetch(`${getBasePath()}/api/admin/condominios`);
      if (res.ok) {
        setCondominios(await res.json());
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user?.rol !== "SUPER_ADMIN") return;
    fetchCondominios();
  }, [user, fetchCondominios]);

  const updateCondominio = async (
    id: string,
    data: Partial<CondominioRow>
  ) => {
    setUpdating(id);
    try {
      const res = await fetch(`${getBasePath()}/api/admin/condominios/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const updated = await res.json();
        setCondominios((prev) =>
          prev.map((c) => (c.id === id ? { ...c, ...updated } : c))
        );
      }
    } catch {
      // ignore
    } finally {
      setUpdating(null);
    }
  };

  const handleCreateCondominio = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError("");
    setCreating(true);
    try {
      const res = await fetch(`${getBasePath()}/api/admin/condominios`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(createForm),
      });
      if (res.ok) {
        setShowCreate(false);
        setCreateForm({
          nombre: "",
          direccion: "",
          modalidad: "AUTOGESTION",
          adminEmail: "",
          adminPassword: "",
          adminNombre: "",
          adminApellidos: "",
        });
        await fetchCondominios();
      } else {
        const data = await res.json();
        setCreateError(data.error || "Error al crear condominio");
      }
    } catch {
      setCreateError("Error de conexion");
    } finally {
      setCreating(false);
    }
  };

  // Find admin email for each condominio
  const getAdminEmail = (c: CondominioRow) => {
    if (!c.users) return "-";
    const admin = c.users.find((u) => u.rol === "ADMIN_CONDOMINIO");
    return admin?.email || "-";
  };

  if (isLoading || user?.rol !== "SUPER_ADMIN") return null;

  return (
    <>
      <HeaderPage
        icon={Building2}
        title="Gestionar Condominios"
        subtitle="Administra todos los condominios de la plataforma"
      />

      {/* Actions Bar */}
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setShowCreate(true)}
          className="inline-flex items-center gap-1.5 rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Crear Condominio
        </button>
      </div>

      {/* Create Condominio Form */}
      {showCreate && (
        <div className="bg-white rounded-2xl border border-surface-200 shadow-sm p-5 mb-4">
          <h3 className="font-bold text-surface-800 mb-4">Crear Nuevo Condominio</h3>
          <form onSubmit={handleCreateCondominio} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-surface-600 mb-1">Nombre del Condominio</label>
                <input
                  type="text"
                  required
                  value={createForm.nombre}
                  onChange={(e) => setCreateForm((f) => ({ ...f, nombre: e.target.value }))}
                  className="w-full rounded-lg border border-surface-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-surface-600 mb-1">Direccion</label>
                <input
                  type="text"
                  required
                  value={createForm.direccion}
                  onChange={(e) => setCreateForm((f) => ({ ...f, direccion: e.target.value }))}
                  className="w-full rounded-lg border border-surface-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-surface-600 mb-1">Modalidad</label>
                <select
                  value={createForm.modalidad}
                  onChange={(e) => setCreateForm((f) => ({ ...f, modalidad: e.target.value }))}
                  className="w-full rounded-lg border border-surface-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="AUTOGESTION">Autogestion</option>
                  <option value="ADMINISTRADO">Administrado</option>
                </select>
              </div>
            </div>
            <p className="text-xs font-bold text-surface-500 uppercase tracking-wider">Usuario Administrador</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-medium text-surface-600 mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={createForm.adminEmail}
                  onChange={(e) => setCreateForm((f) => ({ ...f, adminEmail: e.target.value }))}
                  className="w-full rounded-lg border border-surface-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-surface-600 mb-1">Contrasena</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={createForm.adminPassword}
                  onChange={(e) => setCreateForm((f) => ({ ...f, adminPassword: e.target.value }))}
                  className="w-full rounded-lg border border-surface-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-surface-600 mb-1">Nombre</label>
                <input
                  type="text"
                  required
                  value={createForm.adminNombre}
                  onChange={(e) => setCreateForm((f) => ({ ...f, adminNombre: e.target.value }))}
                  className="w-full rounded-lg border border-surface-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-surface-600 mb-1">Apellidos</label>
                <input
                  type="text"
                  required
                  value={createForm.adminApellidos}
                  onChange={(e) => setCreateForm((f) => ({ ...f, adminApellidos: e.target.value }))}
                  className="w-full rounded-lg border border-surface-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
            {createError && (
              <p className="text-sm text-red-600">{createError}</p>
            )}
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={creating}
                className="inline-flex items-center gap-1.5 rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700 transition-colors disabled:opacity-50"
              >
                {creating ? "Creando..." : "Crear Condominio"}
              </button>
              <button
                type="button"
                onClick={() => setShowCreate(false)}
                className="rounded-lg px-4 py-2 text-sm font-semibold text-surface-600 hover:bg-surface-100 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </form>
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
                <tr className="text-left text-xs font-medium text-surface-500 uppercase tracking-wider bg-surface-50">
                  <th className="px-5 py-3">Nombre</th>
                  <th className="px-5 py-3">Admin</th>
                  <th className="px-5 py-3">Modalidad</th>
                  <th className="px-5 py-3">Plan</th>
                  <th className="px-5 py-3">Estado</th>
                  <th className="px-5 py-3">Usuarios</th>
                  <th className="px-5 py-3">Trial Hasta</th>
                  <th className="px-5 py-3">Creado</th>
                </tr>
              </thead>
              <tbody>
                {condominios.map((c) => (
                  <tr
                    key={c.id}
                    className="border-t border-surface-50 hover:bg-surface-50 transition-colors"
                  >
                    <td className="px-5 py-3">
                      <Link
                        href={`/dashboard/admin/condominios/${c.id}`}
                        className="text-sm font-medium text-primary-600 hover:text-primary-700 hover:underline"
                      >
                        {c.nombre}
                      </Link>
                      <p className="text-xs text-surface-400">{c.direccion}</p>
                    </td>
                    <td className="px-5 py-3 text-sm text-surface-600">
                      {getAdminEmail(c)}
                    </td>
                    <td className="px-5 py-3 text-sm text-surface-600">
                      {c.modalidad === "AUTOGESTION"
                        ? "Autogestion"
                        : "Administrado"}
                    </td>
                    <td className="px-5 py-3">
                      <select
                        value={c.plan}
                        onChange={(e) =>
                          updateCondominio(c.id, { plan: e.target.value })
                        }
                        disabled={updating === c.id}
                        className="rounded-lg border border-surface-200 px-2 py-1.5 text-sm text-surface-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                      >
                        {PLANS.map((plan) => (
                          <option key={plan} value={plan}>
                            {plan}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-5 py-3">
                      <button
                        onClick={() =>
                          updateCondominio(c.id, { activo: !c.activo })
                        }
                        disabled={updating === c.id}
                        className={cn(
                          "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition-colors",
                          c.activo
                            ? "bg-green-50 text-green-700 hover:bg-green-100"
                            : "bg-red-50 text-red-700 hover:bg-red-100"
                        )}
                      >
                        <span
                          className={cn(
                            "h-1.5 w-1.5 rounded-full",
                            c.activo ? "bg-green-500" : "bg-red-500"
                          )}
                        />
                        {c.activo ? "Activo" : "Inactivo"}
                      </button>
                    </td>
                    <td className="px-5 py-3 text-sm text-surface-600 tabular-nums">
                      {c._count.users}
                    </td>
                    <td className="px-5 py-3 text-sm text-surface-600">
                      {c.trialEndsAt
                        ? new Date(c.trialEndsAt).toLocaleDateString("es-PE")
                        : "-"}
                    </td>
                    <td className="px-5 py-3 text-sm text-surface-400">
                      {new Date(c.createdAt).toLocaleDateString("es-PE")}
                    </td>
                  </tr>
                ))}
                {condominios.length === 0 && (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-5 py-12 text-center text-surface-400"
                    >
                      No hay condominios registrados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}
