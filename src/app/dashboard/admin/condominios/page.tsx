"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Building2 } from "lucide-react";
import { HeaderPage } from "@/components/dashboard/header-page";
import { useAuth } from "@/hooks/use-auth";
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
}

const PLANS = ["TRIAL", "BASICO", "PRO", "EMPRESARIAL"] as const;

export default function AdminCondominiosPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [condominios, setCondominios] = useState<CondominioRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && user?.rol !== "SUPER_ADMIN") {
      router.push("/dashboard");
    }
  }, [user, isLoading, router]);

  const fetchCondominios = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/condominios");
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
      const res = await fetch(`/api/admin/condominios/${id}`, {
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

  if (isLoading || user?.rol !== "SUPER_ADMIN") return null;

  return (
    <>
      <HeaderPage
        icon={Building2}
        title="Gestionar Condominios"
        subtitle="Administra todos los condominios de la plataforma"
      />

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
                      <p className="text-sm font-medium text-surface-800">
                        {c.nombre}
                      </p>
                      <p className="text-xs text-surface-400">{c.direccion}</p>
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
                      colSpan={7}
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
