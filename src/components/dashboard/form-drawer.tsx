"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { ZodSchema, z } from "zod";

interface Field {
  name: string;
  label: string;
  type: "text" | "number" | "select" | "textarea" | "date" | "datetime-local" | "month" | "time";
  placeholder?: string;
  options?: { label: string; value: string }[];
}

interface FormDrawerProps<S extends ZodSchema> {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: z.infer<S>) => void;
  schema: S;
  defaultValues?: z.infer<S>;
  title: string;
  subtitle?: string;
  fields: Field[];
}

export function FormDrawer<S extends ZodSchema>({
  open,
  onClose,
  onSubmit,
  schema,
  defaultValues,
  title,
  subtitle,
  fields,
}: FormDrawerProps<S>) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } = useForm<Record<string, any>>({
    resolver: zodResolver(schema as never),
    defaultValues: defaultValues as Record<string, unknown> | undefined,
  });

  useEffect(() => {
    if (open) {
      reset(defaultValues as Record<string, unknown> | undefined);
    }
  }, [open, defaultValues, reset]);

  const onFormSubmit = (data: Record<string, unknown>) => {
    onSubmit(data as z.infer<S>);
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 z-50 w-full sm:max-w-lg bg-white shadow-2xl flex flex-col"
          >
            <div className="flex items-center justify-between p-5 border-b border-surface-100">
              <div>
                <h2 className="text-lg font-bold text-surface-800">{title}</h2>
                {subtitle && <p className="text-xs text-surface-400 mt-0.5">{subtitle}</p>}
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg text-surface-400 hover:text-surface-600 hover:bg-surface-50 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit(onFormSubmit)} className="flex-1 overflow-y-auto p-5 space-y-4">
              {fields.map((field) => (
                <div key={field.name} className="space-y-1.5">
                  <label className="block text-sm font-medium text-surface-700">
                    {field.label}
                  </label>
                  {field.type === "select" ? (
                    <select
                      {...register(field.name)}
                      className="w-full rounded-xl border border-surface-200 px-3 py-3 text-sm text-surface-800 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 transition-colors"
                    >
                      <option value="">Seleccionar...</option>
                      {field.options?.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  ) : field.type === "textarea" ? (
                    <textarea
                      {...register(field.name)}
                      placeholder={field.placeholder}
                      rows={3}
                      className="w-full rounded-xl border border-surface-200 px-3 py-3 text-sm text-surface-800 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 transition-colors resize-none"
                    />
                  ) : (
                    <input
                      type={field.type}
                      {...register(field.name, {
                        valueAsNumber: field.type === "number",
                      })}
                      placeholder={field.placeholder}
                      className="w-full rounded-xl border border-surface-200 px-3 py-3 text-sm text-surface-800 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 transition-colors"
                    />
                  )}
                  {errors[field.name] && (
                    <p className="text-xs text-red-500">
                      {errors[field.name]?.message as string}
                    </p>
                  )}
                </div>
              ))}
            </form>

            <div className="flex flex-col sm:flex-row justify-end gap-3 p-5 border-t border-surface-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-lg text-sm font-medium text-surface-600 hover:bg-surface-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSubmit(onFormSubmit)}
                className="px-6 py-2.5 rounded-lg text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 shadow-sm transition-colors"
              >
                Guardar
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
