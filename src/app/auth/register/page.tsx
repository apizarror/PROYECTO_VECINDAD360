"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { Eye, EyeOff, ArrowLeft, ArrowRight, Building2, UserCog } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { getBasePath } from "@/lib/base-path";
import { cn } from "@/lib/utils";

const schema = z.object({
  nombre: z.string().min(1, "Nombre requerido"),
  apellidos: z.string().min(1, "Apellidos requeridos"),
  email: z.string().min(1, "Email requerido").email("Email invalido"),
  telefono: z.string().optional(),
  password: z.string().min(6, "Minimo 6 caracteres"),
  condominioNombre: z.string().min(1, "Nombre del condominio requerido"),
  direccion: z.string().min(1, "Direccion requerida"),
});

type FormData = z.infer<typeof schema>;

type Modalidad = "AUTOGESTION" | "ADMINISTRADO";

export default function RegisterPage() {
  const router = useRouter();
  const { register: registerUser } = useAuth();
  const [step, setStep] = useState<1 | 2>(1);
  const [modalidad, setModalidad] = useState<Modalidad | null>(null);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setError("");
    try {
      const res = await fetch(`${getBasePath()}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, modalidad }),
      });

      if (res.ok) {
        const json = await res.json();
        // Trigger a session refresh by calling register which sets user state
        // But since we already called the API directly, let's just redirect
        // We need to update auth state - simplest: reload to /dashboard
        router.push("/dashboard");
        router.refresh();
      } else {
        const json = await res.json();
        setError(json.error || "Error al registrar");
      }
    } catch {
      setError("Error de conexion");
    }
  };

  return (
    <main>
      <section className="pt-32 pb-20 px-4 min-h-screen flex items-center justify-center bg-surface-50">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-surface-200 p-5 sm:p-8">
          <div className="text-center mb-8">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary-600 text-white font-extrabold text-lg mb-4">
              V3
            </div>
            <h1 className="text-2xl font-extrabold text-surface-800">
              Crea tu cuenta
            </h1>
            <p className="text-surface-500 mt-2 text-sm">
              {step === 1
                ? "Elige como quieres gestionar tu condominio"
                : "Completa tus datos para comenzar"}
            </p>
          </div>

          {/* Step indicator */}
          <div className="flex items-center justify-center gap-2 mb-8">
            <div
              className={cn(
                "h-2 rounded-full transition-all",
                step === 1 ? "w-8 bg-primary-600" : "w-2 bg-surface-200"
              )}
            />
            <div
              className={cn(
                "h-2 rounded-full transition-all",
                step === 2 ? "w-8 bg-primary-600" : "w-2 bg-surface-200"
              )}
            />
          </div>

          {step === 1 ? (
            <div className="space-y-4">
              <button
                type="button"
                onClick={() => {
                  setModalidad("AUTOGESTION");
                  setStep(2);
                }}
                className={cn(
                  "w-full flex items-start gap-4 rounded-xl border-2 p-5 text-left transition-colors hover:border-primary-400 hover:bg-primary-50/50",
                  modalidad === "AUTOGESTION"
                    ? "border-primary-500 bg-primary-50"
                    : "border-surface-200"
                )}
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-100 text-primary-600 flex-shrink-0">
                  <UserCog className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-bold text-surface-800">
                    Autogestion
                  </p>
                  <p className="text-xs text-surface-500 mt-1">
                    Tu directiva administra el condominio directamente desde la
                    plataforma. Ideal si ya tienen organizacion interna.
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setModalidad("ADMINISTRADO");
                  setStep(2);
                }}
                className={cn(
                  "w-full flex items-start gap-4 rounded-xl border-2 p-5 text-left transition-colors hover:border-primary-400 hover:bg-primary-50/50",
                  modalidad === "ADMINISTRADO"
                    ? "border-primary-500 bg-primary-50"
                    : "border-surface-200"
                )}
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-100 text-accent-600 flex-shrink-0">
                  <Building2 className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-bold text-surface-800">
                    Administrado
                  </p>
                  <p className="text-xs text-surface-500 mt-1">
                    Vecindad360 se encarga de la gestion completa de tu
                    condominio. Nosotros nos ocupamos de todo.
                  </p>
                </div>
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-1.5">
                    Nombre
                  </label>
                  <input
                    {...register("nombre")}
                    className={cn(
                      "w-full rounded-xl border border-surface-200 px-4 py-3 text-sm text-surface-800 placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent",
                      errors.nombre && "border-red-400"
                    )}
                    placeholder="Juan"
                  />
                  {errors.nombre && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.nombre.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-1.5">
                    Apellidos
                  </label>
                  <input
                    {...register("apellidos")}
                    className={cn(
                      "w-full rounded-xl border border-surface-200 px-4 py-3 text-sm text-surface-800 placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent",
                      errors.apellidos && "border-red-400"
                    )}
                    placeholder="Perez"
                  />
                  {errors.apellidos && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.apellidos.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1.5">
                  Email
                </label>
                <input
                  {...register("email")}
                  type="email"
                  className={cn(
                    "w-full rounded-xl border border-surface-200 px-4 py-3 text-sm text-surface-800 placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent",
                    errors.email && "border-red-400"
                  )}
                  placeholder="tu@email.com"
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1.5">
                  Telefono
                </label>
                <input
                  {...register("telefono")}
                  type="tel"
                  className="w-full rounded-xl border border-surface-200 px-4 py-3 text-sm text-surface-800 placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="999 888 777"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1.5">
                  Contrasena
                </label>
                <div className="relative">
                  <input
                    {...register("password")}
                    type={showPassword ? "text" : "password"}
                    className={cn(
                      "w-full rounded-xl border border-surface-200 px-4 py-3 text-sm text-surface-800 placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent pr-10",
                      errors.password && "border-red-400"
                    )}
                    placeholder="Min. 6 caracteres"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600 p-1"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <hr className="border-surface-100" />

              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1.5">
                  Nombre del Condominio
                </label>
                <input
                  {...register("condominioNombre")}
                  className={cn(
                    "w-full rounded-xl border border-surface-200 px-4 py-3 text-sm text-surface-800 placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent",
                    errors.condominioNombre && "border-red-400"
                  )}
                  placeholder="Residencial Los Jardines"
                />
                {errors.condominioNombre && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.condominioNombre.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1.5">
                  Direccion
                </label>
                <input
                  {...register("direccion")}
                  className={cn(
                    "w-full rounded-xl border border-surface-200 px-4 py-3 text-sm text-surface-800 placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent",
                    errors.direccion && "border-red-400"
                  )}
                  placeholder="Av. Javier Prado 1234, San Isidro"
                />
                {errors.direccion && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.direccion.message}
                  </p>
                )}
              </div>

              {error && (
                <div className="bg-red-50 text-red-600 text-sm rounded-xl px-4 py-2.5 text-center">
                  {error}
                </div>
              )}

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={() => setStep(1)}
                  className="flex-shrink-0"
                >
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Atras
                </Button>
                <Button
                  type="submit"
                  variant="accent"
                  size="lg"
                  className="flex-1"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Registrando..." : "Crear Cuenta"}
                  {!isSubmitting && <ArrowRight className="ml-2 h-4 w-4" />}
                </Button>
              </div>
            </form>
          )}

          <p className="text-center text-sm text-surface-500 mt-6">
            Ya tienes cuenta?{" "}
            <Link
              href="/auth"
              className="text-primary-600 font-semibold hover:underline"
            >
              Inicia sesion
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
