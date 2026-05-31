"use client";

import { useRouter } from "next/navigation";
import { User, Shield, Bell, Key, LogOut } from "lucide-react";
import { HeaderPage } from "@/components/dashboard/header-page";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";

export default function PerfilPage() {
  const { user, logout } = useAuth();
  const router = useRouter();

  if (!user) return null;

  return (
    <>
      <HeaderPage icon={User} title="Perfil" subtitle="Información de tu cuenta" />
      <div className="max-w-2xl">
        <div className="bg-white rounded-2xl border border-surface-200 shadow-sm p-6 mb-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-600 text-white text-2xl font-bold">
              {user.avatar}
            </div>
            <div>
              <h3 className="font-bold text-surface-800 text-lg">{user.nombre} {user.apellidos}</h3>
              <p className="text-sm text-surface-500">{user.rol === "SUPER_ADMIN" ? "Super Administrador" : "Administrador"}</p>
              <p className="text-xs text-surface-400 mt-0.5">{user.email}</p>
            </div>
          </div>
          <div className="space-y-3">
            {[
              ["Email", user.email],
              ["DNI", user.dni],
              ["Teléfono", user.telefono],
              ["Rol", user.rol === "SUPER_ADMIN" ? "SUPER_ADMIN — Control total del sistema" : user.rol],
            ].map(([l, v]) => (
              <div key={l} className="flex justify-between py-2 border-b border-surface-50 text-sm">
                <span className="text-surface-500">{l}</span>
                <span className="font-medium text-surface-800">{v}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-3">
          {[
            { icon: Key, label: "Cambiar contraseña", desc: "Actualiza tu contraseña de acceso" },
            { icon: Bell, label: "Preferencias de notificación", desc: "Configura qué notificaciones recibir" },
            { icon: Shield, label: "Sesiones activas", desc: "Gestiona tus dispositivos conectados" },
          ].map((s, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-surface-200 shadow-sm p-4 flex items-center gap-4 hover:border-primary-200 cursor-pointer transition-all"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface-50 text-surface-400">
                <s.icon className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-surface-800">{s.label}</p>
                <p className="text-xs text-surface-400">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6">
          <Button
            variant="ghost"
            className="text-red-600 hover:bg-red-50"
            onClick={() => { logout(); router.push("/auth"); }}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Cerrar sesión
          </Button>
        </div>
      </div>
    </>
  );
}
