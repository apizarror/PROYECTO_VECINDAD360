"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Zap, Shield, Smartphone, Headphones } from "lucide-react";
import { BlobDecoration } from "@/components/illustrations/patterns";

const ventajas = [
  {
    icon: Zap,
    title: "Fácil de usar",
    description:
      "Interfaz intuitiva diseñada para que cualquier administrador pueda dominarla desde el primer día, sin capacitación.",
  },
  {
    icon: Shield,
    title: "Seguro y confiable",
    description:
      "Tus datos protegidos con cifrado de nivel bancario. Backups automáticos diarios para tu tranquilidad.",
  },
  {
    icon: Smartphone,
    title: "Acceso desde cualquier lugar",
    description:
      "Disponible en computadora, tablet y celular. Gestiona tu condominio desde donde estés, cuando quieras.",
  },
  {
    icon: Headphones,
    title: "Soporte dedicado",
    description:
      "Equipo de soporte listo para ayudarte en cada paso. Respuesta en menos de 2 horas, sin costos adicionales.",
  },
];

const container = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
} as const;

export function Ventajas() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="py-20 px-4 bg-white relative overflow-hidden">
      <BlobDecoration className="absolute -top-32 -right-32 w-80 h-80 text-primary-50 hidden sm:block" />
      <BlobDecoration className="absolute -bottom-40 -left-20 w-96 h-96 text-accent-50 hidden sm:block" />
      <div className="max-w-7xl mx-auto relative z-10" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <span className="text-sm font-bold uppercase tracking-widest text-accent-500">
            Ventajas
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-surface-800 mt-2">
            ¿Por qué elegir Vecindad360?
          </h2>
          <p className="text-surface-500 mt-3 max-w-2xl mx-auto">
            No somos otro software más. Somos la plataforma que entiende cómo
            funciona realmente un condominio.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {ventajas.map((v) => (
            <motion.div
              key={v.title}
              variants={item}
              className="group flex items-start gap-5 p-6 rounded-2xl hover:bg-surface-50 transition-colors duration-200 cursor-default"
            >
              <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center group-hover:bg-primary-600 group-hover:text-white transition-colors duration-200">
                <v.icon className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-surface-800 mb-2">
                  {v.title}
                </h3>
                <p className="text-sm text-surface-500 leading-relaxed">
                  {v.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
