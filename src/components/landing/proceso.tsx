"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { UserPlus, Settings, BarChart3 } from "lucide-react";
import { WavePattern } from "@/components/illustrations/patterns";

const steps = [
  {
    number: "01",
    icon: UserPlus,
    title: "Regístrate",
    description:
      "Crea tu cuenta al toque. Sin tarjeta de crédito, sin compromisos. Solo necesitas tu email.",
  },
  {
    number: "02",
    icon: Settings,
    title: "Configura tu condominio",
    description:
      "Agrega tus unidades, residentes y personal administrativo. Importa datos existentes en un clic.",
  },
  {
    number: "03",
    icon: BarChart3,
    title: "Empieza a gestionar",
    description:
      "Controla finanzas, genera recibos, comunícate por WhatsApp y observa cómo todo fluye.",
  },
];

export function Proceso() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="py-20 px-4 bg-surface-50 relative overflow-hidden">
      <div className="max-w-5xl mx-auto relative z-10" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <span className="text-sm font-bold uppercase tracking-widest text-primary-500">
            Proceso
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-surface-800 mt-2">
            Empieza en 3 pasos
          </h2>
          <p className="text-surface-500 mt-3 max-w-2xl mx-auto">
            Tan fácil que estarás gestionando tu condominio al toque.
          </p>
        </motion.div>

        <div className="relative">
          <div className="hidden md:block absolute top-12 left-[calc(16.67%+40px)] right-[calc(16.67%+40px)] h-0.5 bg-surface-200" />

          <div className="flex flex-col md:flex-row items-start gap-6 md:gap-8">
            {steps.map((step, i) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 40 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.2 }}
                className="flex-1 flex flex-col items-center text-center relative z-10"
              >
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-primary-600 text-white flex items-center justify-center font-extrabold text-xl mb-5 shadow-lg shadow-primary-500/30">
                  <step.icon className="h-8 w-8" />
                </div>
                <div className="text-xs font-bold text-primary-500 mb-2">
                  PASO {step.number}
                </div>
                <h3 className="font-bold text-lg md:text-xl text-surface-800 mb-3">
                  {step.title}
                </h3>
                <p className="text-sm text-surface-500 leading-relaxed max-w-xs">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      <WavePattern className="absolute bottom-0 left-0 right-0 w-full text-primary-200" />
    </section>
  );
}
