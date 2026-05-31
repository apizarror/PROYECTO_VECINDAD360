"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Send, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const schema = z.object({
  name: z.string().min(2, "Nombre requerido"),
  email: z.string().email("Email inválido"),
  condominio: z.string().min(2, "Nombre del condominio requerido"),
  unidades: z.string().min(1, "Cantidad de unidades requerida"),
  mensaje: z.string().min(10, "Cuéntanos un poco más (mín. 10 caracteres)"),
});

type FormData = z.infer<typeof schema>;

export function ContactForm() {
  const [sent, setSent] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setSubmitError(false);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) setSent(true);
      else setSubmitError(true);
    } catch {
      setSubmitError(true);
    }
  };

  if (sent) {
    return (
      <section className="py-20 px-4 bg-surface-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md mx-auto text-center space-y-4"
        >
          <div className="mx-auto w-16 h-16 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center">
            <CheckCircle className="h-8 w-8" />
          </div>
          <h2 className="text-2xl font-bold text-surface-800">
            Mensaje enviado
          </h2>
          <p className="text-surface-500">
            Gracias por contactarnos. Te responderemos en menos de 24 horas.
          </p>
        </motion.div>
      </section>
    );
  }

  return (
    <section className="py-20 px-4 bg-surface-50">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl p-4 sm:p-8 shadow-sm border border-surface-200">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1.5">
                  Nombre
                </label>
                <input
                  {...register("name")}
                  className={cn(
                    "w-full rounded-xl border border-surface-200 px-4 py-3 text-sm text-surface-800 placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition",
                    errors.name && "border-red-400 focus:ring-red-400"
                  )}
                  placeholder="Tu nombre completo"
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1.5">
                  Email
                </label>
                <input
                  {...register("email")}
                  type="email"
                  className={cn(
                    "w-full rounded-xl border border-surface-200 px-4 py-3 text-sm text-surface-800 placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition",
                    errors.email && "border-red-400 focus:ring-red-400"
                  )}
                  placeholder="tu@email.com"
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1.5">
                  Condominio
                </label>
                <input
                  {...register("condominio")}
                  className={cn(
                    "w-full rounded-xl border border-surface-200 px-4 py-3 text-sm text-surface-800 placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition",
                    errors.condominio && "border-red-400 focus:ring-red-400"
                  )}
                  placeholder="Nombre del condominio"
                />
                {errors.condominio && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.condominio.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1.5">
                  Unidades
                </label>
                <select
                  {...register("unidades")}
                  className={cn(
                    "w-full rounded-xl border border-surface-200 px-4 py-3 text-sm text-surface-800 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition bg-white",
                    errors.unidades && "border-red-400 focus:ring-red-400"
                  )}
                >
                  <option value="">Seleccionar...</option>
                  <option value="1-20">1 - 20</option>
                  <option value="21-50">21 - 50</option>
                  <option value="51-100">51 - 100</option>
                  <option value="101-200">101 - 200</option>
                  <option value="200+">200+</option>
                </select>
                {errors.unidades && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.unidades.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1.5">
                Mensaje
              </label>
              <textarea
                {...register("mensaje")}
                rows={4}
                className={cn(
                  "w-full rounded-xl border border-surface-200 px-4 py-3 text-sm text-surface-800 placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition resize-none",
                  errors.mensaje && "border-red-400 focus:ring-red-400"
                )}
                placeholder="Cuéntanos sobre tu condominio y qué necesitas..."
              />
              {errors.mensaje && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.mensaje.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              variant="accent"
              size="lg"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                "Enviando..."
              ) : (
                <>
                  Enviar mensaje
                  <Send className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
            {submitError && (
              <p className="text-red-600 text-sm text-center mt-3">
                Ocurrió un error al enviar. Por favor intenta de nuevo.
              </p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
