"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";

const schema = z.object({
  username: z.string().min(1, "Usuario requerido"),
  password: z.string().min(1, "Contraseña requerida"),
});

type FormData = z.infer<typeof schema>;

export default function AuthPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setError("");
    const success = await login(data.username, data.password);
    if (success) {
      router.push("/dashboard");
    } else {
      setError("Usuario o contraseña incorrectos");
    }
  };

  return (
    <main>
      <section className="pt-32 pb-20 px-4 min-h-screen flex items-center justify-center bg-surface-50">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-surface-200 p-8">
          <div className="text-center mb-8">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary-600 text-white font-extrabold text-lg mb-4">
              V3
            </div>
            <h1 className="text-2xl font-extrabold text-surface-800">
              Bienvenido a Vecindad360
            </h1>
            <p className="text-surface-500 mt-2 text-sm">
              Inicia sesión para gestionar tu condominio
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1.5">
                Usuario
              </label>
              <input
                {...register("username")}
                className={cn(
                  "w-full rounded-xl border border-surface-200 px-4 py-2.5 text-sm text-surface-800 placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent",
                  errors.username && "border-red-400"
                )}
                placeholder="admin"
              />
              {errors.username && (
                <p className="text-red-500 text-xs mt-1">{errors.username.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1.5">
                Contraseña
              </label>
              <div className="relative">
                <input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  className={cn(
                    "w-full rounded-xl border border-surface-200 px-4 py-2.5 text-sm text-surface-800 placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent pr-10",
                    errors.password && "border-red-400"
                  )}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
              )}
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 text-sm rounded-xl px-4 py-2.5 text-center">
                {error}
              </div>
            )}

            <Button type="submit" variant="accent" className="w-full" size="lg" disabled={isSubmitting}>
              {isSubmitting ? "Ingresando..." : "Iniciar Sesión"}
            </Button>
          </form>

          <p className="text-center text-xs text-surface-400 mt-6">
            Usuario de prueba: <span className="font-mono text-surface-600">admin</span> /{" "}
            <span className="font-mono text-surface-600">admin123</span>
          </p>
        </div>
      </section>
    </main>
  );
}
