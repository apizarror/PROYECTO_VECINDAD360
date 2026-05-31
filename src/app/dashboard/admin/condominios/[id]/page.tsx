"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Building2,
  ArrowLeft,
  Users,
  Home,
  Landmark,
  Layers,
  UserPlus,
} from "lucide-react";
import { HeaderPage } from "@/components/dashboard/header-page";
import { useAuth } from "@/hooks/use-auth";
import { getBasePath } from "@/lib/base-path";
import { cn } from "@/lib/utils";

interface UserRow {
  id: string;
  email: string;
  nombre: string;
  apellidos: string;
  rol: string;
  activo: boolean;
  createdAt: string;
}

interface CondominioDetail {
  id: string;
  nombre: string;
  direccion: string;
  ruc: string | null;
  razonSocial: string | null;
  modalidad: string;
  plan: string;
  trialEndsAt: string | null;
  planExpiresAt: string | null;
  activo: boolean;
  adminId: string;
  createdAt: string;
  updatedAt: string;
  users: UserRow[];
  _count: {
    edificios: number;
    bloques: number;
    inmuebles: number;
    personas: number;
    users: number;
  };
}

const PLANS = ["TRIAL", "BASICO", "PRO", "EMPRESARIAL"] as const;
const ROLES = ["ADMIN_CONDOMINIO", "EMPLEADO", "RESIDENTE"] as const;

const rolLabels: Record<string, string> = {
  ADMIN_CONDOMINIO: "Administrador",
  EMPLEADO: "Personal",
  RESIDENTE: "Residente",
  SUPER_ADMIN: "Super Admin",
};

export default function CondominioDetailPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const { user, isLoading } = useAuth();
  const [condominio, setCondominio] = useState<CondominioDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [showCreateUser, setShowCreateUser] = useState(false);
  const [createUserForm, setCreateUserForm] = useState({
    email: "",
    password: "",
    nombre: "",
    apellidos: "",
    rol: "ADMIN_CONDOMINIO" as string,
  });
  const [createUserError, setCreateUserError] = useState("");
  const [creatingUser, setCreatingUser] = useState(false);

  useEffect(() => {
    if (!isLoading && user?.rol !== "SUPER_ADMIN") {
      router.push("/dashboard");
    }
  }, [user, isLoading, router]);

  const fetchCondominio = useCallback(async () => {
    try {
      const res = await fetch(`${getBasePath()}/api/admin/condominios/${id}`);
      if (res.ok) {
        setCondominio(await res.json());
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (user?.rol !== "SUPER_ADMIN") return;
    fetchCondominio();
  }, [user, fetchCondominio]);

  const updateCondominio = async (data: Record<string, unknown>) => {
    setUpdating(true);
    try {
      const res = await fetch(`${getBasePath()}/api/admin/condominios/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        await fetchCondominio();
      }
    } catch {
      // ignore
    } finally {
      setUpdating(false);
    }
  };

  const extendTrial = async () => {
    const newDate = new Date();
    newDate.setDate(newDate.getDate() + 14);
    await updateCondominio({ trialEndsAt: newDate.toISOString() });
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateUserError("");
    setCreatingUser(true);
    try {
      const res = await fetch(`${getBasePath()}/api/admin/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...createUserForm, condominioId: id }),
      });
      if (res.ok) {
        setShowCreateUser(false);
        setCreateUserForm({
          email: "",
          password: "",
          nombre: "",
          apellidos: "",
          rol: "ADMIN_CONDOMINIO",
        });
        await fetchCondominio();
      } else {
        const data = await res.json();
        setCreateUserError(data.error || "Error al crear usuario");
      }
    } catch {
      setCreateUserError("Error de conexion");
    } finally {
      setCreatingUser(false);
    }
  };

  if (isLoading || user?.rol !== "SUPER_ADMIN") return null;

  return (
    <>
      <div className="mb-4">
        <Link
          href="/dashboard/admin/condominios"
          className="inline-flex items-center gap-1.5 text-sm text-surface-500 hover:text-surface-700 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a Condominios
        </Link>
      </div>

      <HeaderPage
        icon={Building2}
        title={condominio?.nombre || "Cargando..."}
        subtitle={condominio?.direccion || ""}
      />

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" />
        </div>
      ) : condominio ? (
        <>
          {/* Info & Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Details */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-surface-200 shadow-sm p-5">
              <h3 className="font-bold text-surface-800 mb-4">Informacion General</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-medium text-surface-500 uppercase tracking-wider mb-1">Nombre</p>
                  <p className="text-sm text-surface-800">{condominio.nombre}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-surface-500 uppercase tracking-wider mb-1">Direccion</p>
                  <p className="text-sm text-surface-800">{condominio.direccion}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-surface-500 uppercase tracking-wider mb-1">Modalidad</p>
                  <p className="text-sm text-surface-800">
                    {condominio.modalidad === "AUTOGESTION" ? "Autogestion" : "Administrado"}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-surface-500 uppercase tracking-wider mb-1">Plan</p>
                  <select
                    value={condominio.plan}
                    onChange={(e) => updateCondominio({ plan: e.target.value })}
                    disabled={updating}
                    className="rounded-lg border border-surface-200 px-2 py-1.5 text-sm text-surface-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    {PLANS.map((plan) => (
                      <option key={plan} value={plan}>{plan}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <p className="text-xs font-medium text-surface-500 uppercase tracking-wider mb-1">Trial Hasta</p>
                  <p className="text-sm text-surface-800">
                    {condominio.trialEndsAt
                      ? new Date(condominio.trialEndsAt).toLocaleDateString("es-PE")
                      : "-"}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-surface-500 uppercase tracking-wider mb-1">Creado</p>
                  <p className="text-sm text-surface-800">
                    {new Date(condominio.createdAt).toLocaleDateString("es-PE")}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-3 mt-6 pt-4 border-t border-surface-100">
                <button
                  onClick={() => updateCondominio({ activo: !condominio.activo })}
                  disabled={updating}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold transition-colors",
                    condominio.activo
                      ? "bg-red-50 text-red-700 hover:bg-red-100"
                      : "bg-green-50 text-green-700 hover:bg-green-100"
                  )}
                >
                  {condominio.activo ? "Desactivar" : "Activar"}
                </button>
                <button
                  onClick={extendTrial}
                  disabled={updating}
                  className="inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold bg-yellow-50 text-yellow-700 hover:bg-yellow-100 transition-colors"
                >
                  Extender Trial (+14 dias)
                </button>
              </div>
            </div>

            {/* Counts */}
            <div className="space-y-4">
              <div className="bg-white rounded-2xl border border-surface-200 shadow-sm p-5">
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                    <Landmark className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-surface-500 uppercase tracking-wider">Edificios</p>
                    <p className="text-2xl font-extrabold text-surface-800 tabular-nums">{condominio._count.edificios}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-2xl border border-surface-200 shadow-sm p-5">
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <Layers className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-surface-500 uppercase tracking-wider">Bloques</p>
                    <p className="text-2xl font-extrabold text-surface-800 tabular-nums">{condominio._count.bloques}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-2xl border border-surface-200 shadow-sm p-5">
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-600">
                    <Home className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-surface-500 uppercase tracking-wider">Inmuebles</p>
                    <p className="text-2xl font-extrabold text-surface-800 tabular-nums">{condominio._count.inmuebles}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-2xl border border-surface-200 shadow-sm p-5">
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                    <Users className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-surface-500 uppercase tracking-wider">Personas</p>
                    <p className="text-2xl font-extrabold text-surface-800 tabular-nums">{condominio._count.personas}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-white rounded-2xl border border-surface-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-surface-100 flex items-center justify-between">
              <h3 className="font-bold text-surface-800">
                Usuarios ({condominio._count.users})
              </h3>
              <button
                onClick={() => setShowCreateUser(true)}
                className="inline-flex items-center gap-1.5 rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700 transition-colors"
              >
                <UserPlus className="h-4 w-4" />
                Nuevo Usuario
              </button>
            </div>

            {/* Create User Form */}
            {showCreateUser && (
              <div className="p-5 border-b border-surface-100 bg-surface-50">
                <form onSubmit={handleCreateUser} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-surface-600 mb-1">Email</label>
                      <input
                        type="email"
                        required
                        value={createUserForm.email}
                        onChange={(e) => setCreateUserForm((f) => ({ ...f, email: e.target.value }))}
                        className="w-full rounded-lg border border-surface-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-surface-600 mb-1">Contrasena</label>
                      <input
                        type="password"
                        required
                        minLength={6}
                        value={createUserForm.password}
                        onChange={(e) => setCreateUserForm((f) => ({ ...f, password: e.target.value }))}
                        className="w-full rounded-lg border border-surface-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-surface-600 mb-1">Nombre</label>
                      <input
                        type="text"
                        required
                        value={createUserForm.nombre}
                        onChange={(e) => setCreateUserForm((f) => ({ ...f, nombre: e.target.value }))}
                        className="w-full rounded-lg border border-surface-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-surface-600 mb-1">Apellidos</label>
                      <input
                        type="text"
                        required
                        value={createUserForm.apellidos}
                        onChange={(e) => setCreateUserForm((f) => ({ ...f, apellidos: e.target.value }))}
                        className="w-full rounded-lg border border-surface-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-surface-600 mb-1">Rol</label>
                      <select
                        value={createUserForm.rol}
                        onChange={(e) => setCreateUserForm((f) => ({ ...f, rol: e.target.value }))}
                        className="w-full rounded-lg border border-surface-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                      >
                        {ROLES.map((rol) => (
                          <option key={rol} value={rol}>{rolLabels[rol]}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  {createUserError && (
                    <p className="text-sm text-red-600">{createUserError}</p>
                  )}
                  <div className="flex gap-3">
                    <button
                      type="submit"
                      disabled={creatingUser}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700 transition-colors disabled:opacity-50"
                    >
                      {creatingUser ? "Creando..." : "Crear Usuario"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowCreateUser(false)}
                      className="rounded-lg px-4 py-2 text-sm font-semibold text-surface-600 hover:bg-surface-100 transition-colors"
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-xs font-medium text-surface-500 uppercase tracking-wider bg-surface-50">
                    <th className="px-5 py-3">Nombre</th>
                    <th className="px-5 py-3">Email</th>
                    <th className="px-5 py-3">Rol</th>
                    <th className="px-5 py-3">Estado</th>
                    <th className="px-5 py-3">Creado</th>
                  </tr>
                </thead>
                <tbody>
                  {condominio.users.map((u) => (
                    <tr
                      key={u.id}
                      className="border-t border-surface-50 hover:bg-surface-50 transition-colors"
                    >
                      <td className="px-5 py-3 text-sm font-medium text-surface-800">
                        {u.nombre} {u.apellidos}
                      </td>
                      <td className="px-5 py-3 text-sm text-surface-600">
                        {u.email}
                      </td>
                      <td className="px-5 py-3">
                        <span className="inline-flex items-center rounded-full bg-surface-100 px-2.5 py-0.5 text-xs font-semibold text-surface-700">
                          {rolLabels[u.rol] || u.rol}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <span
                          className={cn(
                            "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold",
                            u.activo
                              ? "bg-green-50 text-green-700"
                              : "bg-red-50 text-red-700"
                          )}
                        >
                          <span
                            className={cn(
                              "h-1.5 w-1.5 rounded-full",
                              u.activo ? "bg-green-500" : "bg-red-500"
                            )}
                          />
                          {u.activo ? "Activo" : "Inactivo"}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-sm text-surface-400">
                        {new Date(u.createdAt).toLocaleDateString("es-PE")}
                      </td>
                    </tr>
                  ))}
                  {condominio.users.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-5 py-12 text-center text-surface-400">
                        No hay usuarios registrados.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-20 text-surface-400">
          Condominio no encontrado.
        </div>
      )}
    </>
  );
}
