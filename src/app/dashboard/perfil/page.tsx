"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { User, Shield, Bell, Key, LogOut, Loader2, CheckCircle, XCircle } from "lucide-react";
import { HeaderPage } from "@/components/dashboard/header-page";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { getBasePath } from "@/lib/base-path";

export default function PerfilPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pwLoading, setPwLoading] = useState(false);
  const [pwMessage, setPwMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  if (!user) return null;

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwMessage(null);

    if (newPassword !== confirmPassword) {
      setPwMessage({ type: "error", text: "Las contraseñas nuevas no coinciden" });
      return;
    }

    if (newPassword.length < 6) {
      setPwMessage({ type: "error", text: "La nueva contraseña debe tener al menos 6 caracteres" });
      return;
    }

    setPwLoading(true);
    try {
      const res = await fetch(`${getBasePath()}/api/auth/change-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        setPwMessage({ type: "error", text: data.error || "Error al cambiar contraseña" });
      } else {
        setPwMessage({ type: "success", text: "Contraseña actualizada correctamente" });
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch {
      setPwMessage({ type: "error", text: "Error de conexión" });
    } finally {
      setPwLoading(false);
    }
  };

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
              ["Telefono", user.telefono],
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
          {/* Cambiar contrasena */}
          <div
            onClick={() => setShowPasswordForm(!showPasswordForm)}
            className="bg-white rounded-2xl border border-surface-200 shadow-sm p-4 flex items-center gap-4 hover:border-primary-200 cursor-pointer transition-all"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface-50 text-surface-400">
              <Key className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-surface-800">Cambiar contrasena</p>
              <p className="text-xs text-surface-400">Actualiza tu contrasena de acceso</p>
            </div>
          </div>

          {showPasswordForm && (
            <form onSubmit={handleChangePassword} className="bg-white rounded-2xl border border-surface-200 shadow-sm p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1">Contrasena actual</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-surface-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1">Nueva contrasena</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full px-4 py-2.5 rounded-xl border border-surface-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1">Confirmar nueva contrasena</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full px-4 py-2.5 rounded-xl border border-surface-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 transition-colors"
                />
              </div>
              {pwMessage && (
                <div className={`flex items-center gap-2 text-sm rounded-xl p-3 ${pwMessage.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                  {pwMessage.type === "success" ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                  {pwMessage.text}
                </div>
              )}
              <Button type="submit" variant="accent" size="md" disabled={pwLoading}>
                {pwLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Cambiar contrasena
              </Button>
            </form>
          )}

          {[
            { icon: Bell, label: "Preferencias de notificacion", desc: "Configura que notificaciones recibir" },
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
            Cerrar sesion
          </Button>
        </div>
      </div>
    </>
  );
}
