"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Users, UserPlus, RotateCcw } from "lucide-react";
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
  condominioId: string | null;
  createdAt: string;
  condominio: { id: string; nombre: string } | null;
}

interface CondominioOption {
  id: string;
  nombre: string;
}

const ROLES = ["ADMIN_CONDOMINIO", "EMPLEADO", "RESIDENTE"] as const;
const ALL_ROLES = ["SUPER_ADMIN", "ADMIN_CONDOMINIO", "EMPLEADO", "RESIDENTE"] as const;

const rolLabels: Record<string, string> = {
  SUPER_ADMIN: "Super Admin",
  ADMIN_CONDOMINIO: "Administrador",
  EMPLEADO: "Personal",
  RESIDENTE: "Residente",
};

export default function AdminUsuariosPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [users, setUsers] = useState<UserRow[]>([]);
  const [condominios, setCondominios] = useState<CondominioOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  // Filters
  const [filterCondominio, setFilterCondominio] = useState("");
  const [filterRol, setFilterRol] = useState("");

  // Create user form
  const [showCreate, setShowCreate] = useState(false);
  const [createForm, setCreateForm] = useState({
    email: "",
    password: "",
    nombre: "",
    apellidos: "",
    rol: "ADMIN_CONDOMINIO" as string,
    condominioId: "",
  });
  const [createError, setCreateError] = useState("");
  const [creating, setCreating] = useState(false);

  // Edit user
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [editRol, setEditRol] = useState("");
  const [resetPassword, setResetPassword] = useState("");

  useEffect(() => {
    if (!isLoading && user?.rol !== "SUPER_ADMIN") {
      router.push("/dashboard");
    }
  }, [user, isLoading, router]);

  const fetchUsers = useCallback(async () => {
    try {
      const res = await fetch(`${getBasePath()}/api/admin/users`);
      if (res.ok) {
        setUsers(await res.json());
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCondominios = useCallback(async () => {
    try {
      const res = await fetch(`${getBasePath()}/api/admin/condominios`);
      if (res.ok) {
        const data = await res.json();
        setCondominios(data.map((c: { id: string; nombre: string }) => ({ id: c.id, nombre: c.nombre })));
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    if (user?.rol !== "SUPER_ADMIN") return;
    fetchUsers();
    fetchCondominios();
  }, [user, fetchUsers, fetchCondominios]);

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      if (filterCondominio && u.condominioId !== filterCondominio) return false;
      if (filterRol && u.rol !== filterRol) return false;
      return true;
    });
  }, [users, filterCondominio, filterRol]);

  const updateUser = async (id: string, data: Record<string, unknown>) => {
    setUpdating(id);
    try {
      const res = await fetch(`${getBasePath()}/api/admin/users/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        await fetchUsers();
      }
    } catch {
      // ignore
    } finally {
      setUpdating(null);
      setEditingUser(null);
      setEditRol("");
      setResetPassword("");
    }
  };

  const toggleActive = async (id: string, activo: boolean) => {
    await updateUser(id, { activo: !activo });
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError("");
    setCreating(true);
    try {
      const res = await fetch(`${getBasePath()}/api/admin/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(createForm),
      });
      if (res.ok) {
        setShowCreate(false);
        setCreateForm({
          email: "",
          password: "",
          nombre: "",
          apellidos: "",
          rol: "ADMIN_CONDOMINIO",
          condominioId: "",
        });
        await fetchUsers();
      } else {
        const data = await res.json();
        setCreateError(data.error || "Error al crear usuario");
      }
    } catch {
      setCreateError("Error de conexion");
    } finally {
      setCreating(false);
    }
  };

  if (isLoading || user?.rol !== "SUPER_ADMIN") return null;

  return (
    <>
      <HeaderPage
        icon={Users}
        title="Gestionar Usuarios"
        subtitle="Administra todos los usuarios de la plataforma"
      />

      {/* Filters & Actions */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <select
          value={filterCondominio}
          onChange={(e) => setFilterCondominio(e.target.value)}
          className="rounded-lg border border-surface-200 px-3 py-2 text-sm text-surface-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="">Todos los condominios</option>
          {condominios.map((c) => (
            <option key={c.id} value={c.id}>{c.nombre}</option>
          ))}
        </select>

        <select
          value={filterRol}
          onChange={(e) => setFilterRol(e.target.value)}
          className="rounded-lg border border-surface-200 px-3 py-2 text-sm text-surface-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="">Todos los roles</option>
          {ALL_ROLES.map((r) => (
            <option key={r} value={r}>{rolLabels[r]}</option>
          ))}
        </select>

        <div className="flex-1" />

        <button
          onClick={() => setShowCreate(true)}
          className="inline-flex items-center gap-1.5 rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700 transition-colors"
        >
          <UserPlus className="h-4 w-4" />
          Nuevo Usuario
        </button>
      </div>

      {/* Create User Form */}
      {showCreate && (
        <div className="bg-white rounded-2xl border border-surface-200 shadow-sm p-5 mb-4">
          <h3 className="font-bold text-surface-800 mb-4">Crear Nuevo Usuario</h3>
          <form onSubmit={handleCreateUser} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-surface-600 mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={createForm.email}
                  onChange={(e) => setCreateForm((f) => ({ ...f, email: e.target.value }))}
                  className="w-full rounded-lg border border-surface-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-surface-600 mb-1">Contrasena</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={createForm.password}
                  onChange={(e) => setCreateForm((f) => ({ ...f, password: e.target.value }))}
                  className="w-full rounded-lg border border-surface-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-surface-600 mb-1">Nombre</label>
                <input
                  type="text"
                  required
                  value={createForm.nombre}
                  onChange={(e) => setCreateForm((f) => ({ ...f, nombre: e.target.value }))}
                  className="w-full rounded-lg border border-surface-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-surface-600 mb-1">Apellidos</label>
                <input
                  type="text"
                  required
                  value={createForm.apellidos}
                  onChange={(e) => setCreateForm((f) => ({ ...f, apellidos: e.target.value }))}
                  className="w-full rounded-lg border border-surface-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-surface-600 mb-1">Rol</label>
                <select
                  value={createForm.rol}
                  onChange={(e) => setCreateForm((f) => ({ ...f, rol: e.target.value }))}
                  className="w-full rounded-lg border border-surface-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  {ROLES.map((rol) => (
                    <option key={rol} value={rol}>{rolLabels[rol]}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-surface-600 mb-1">Condominio</label>
                <select
                  required
                  value={createForm.condominioId}
                  onChange={(e) => setCreateForm((f) => ({ ...f, condominioId: e.target.value }))}
                  className="w-full rounded-lg border border-surface-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Seleccionar...</option>
                  {condominios.map((c) => (
                    <option key={c.id} value={c.id}>{c.nombre}</option>
                  ))}
                </select>
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
                {creating ? "Creando..." : "Crear Usuario"}
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
                  <th className="px-5 py-3">Email</th>
                  <th className="px-5 py-3">Rol</th>
                  <th className="px-5 py-3">Condominio</th>
                  <th className="px-5 py-3">Estado</th>
                  <th className="px-5 py-3">Creado</th>
                  <th className="px-5 py-3">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u) => (
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
                      {editingUser === u.id ? (
                        <select
                          value={editRol || u.rol}
                          onChange={(e) => setEditRol(e.target.value)}
                          className="rounded-lg border border-surface-200 px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-primary-500"
                        >
                          {ALL_ROLES.map((r) => (
                            <option key={r} value={r}>{rolLabels[r]}</option>
                          ))}
                        </select>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-surface-100 px-2.5 py-0.5 text-xs font-semibold text-surface-700">
                          {rolLabels[u.rol] || u.rol}
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3 text-sm text-surface-600">
                      {u.condominio?.nombre || "-"}
                    </td>
                    <td className="px-5 py-3">
                      <button
                        onClick={() => toggleActive(u.id, u.activo)}
                        disabled={updating === u.id}
                        className={cn(
                          "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors",
                          u.activo
                            ? "bg-green-50 text-green-700 hover:bg-green-100"
                            : "bg-red-50 text-red-700 hover:bg-red-100"
                        )}
                      >
                        <span
                          className={cn(
                            "h-1.5 w-1.5 rounded-full",
                            u.activo ? "bg-green-500" : "bg-red-500"
                          )}
                        />
                        {u.activo ? "Activo" : "Inactivo"}
                      </button>
                    </td>
                    <td className="px-5 py-3 text-sm text-surface-400">
                      {new Date(u.createdAt).toLocaleDateString("es-PE")}
                    </td>
                    <td className="px-5 py-3">
                      {editingUser === u.id ? (
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center gap-1">
                            <input
                              type="password"
                              placeholder="Nueva contrasena"
                              value={resetPassword}
                              onChange={(e) => setResetPassword(e.target.value)}
                              className="rounded-lg border border-surface-200 px-2 py-1 text-xs w-32 focus:outline-none focus:ring-2 focus:ring-primary-500"
                            />
                          </div>
                          <div className="flex gap-1">
                            <button
                              onClick={() => {
                                const data: Record<string, unknown> = {};
                                if (editRol && editRol !== u.rol) data.rol = editRol;
                                if (resetPassword) data.password = resetPassword;
                                if (Object.keys(data).length > 0) {
                                  updateUser(u.id, data);
                                } else {
                                  setEditingUser(null);
                                }
                              }}
                              disabled={updating === u.id}
                              className="rounded-lg bg-primary-600 px-2 py-1 text-xs font-semibold text-white hover:bg-primary-700 transition-colors"
                            >
                              Guardar
                            </button>
                            <button
                              onClick={() => {
                                setEditingUser(null);
                                setEditRol("");
                                setResetPassword("");
                              }}
                              className="rounded-lg px-2 py-1 text-xs font-semibold text-surface-600 hover:bg-surface-100 transition-colors"
                            >
                              Cancelar
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex gap-1">
                          <button
                            onClick={() => {
                              setEditingUser(u.id);
                              setEditRol(u.rol);
                            }}
                            className="rounded-lg px-2 py-1 text-xs font-semibold text-primary-600 hover:bg-primary-50 transition-colors"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => {
                              setEditingUser(u.id);
                              setResetPassword("");
                            }}
                            title="Resetear contrasena"
                            className="rounded-lg p-1 text-surface-400 hover:text-surface-600 hover:bg-surface-100 transition-colors"
                          >
                            <RotateCcw className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
                {filteredUsers.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-5 py-12 text-center text-surface-400"
                    >
                      No hay usuarios que coincidan con los filtros.
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
