"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  Calculator,
  Users,
  ReceiptText,
  AlertTriangle,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { GridPattern } from "@/components/illustrations/patterns";

const features = [
  {
    icon: Calculator,
    title: "Control Financiero",
    description:
      "Gestiona ingresos y gastos con reportes automáticos. Visualiza el estado financiero en tiempo real.",
    color: "bg-primary-50 text-primary-600",
  },
  {
    icon: Users,
    title: "Gestión de Residentes",
    description:
      "Administra unidades, residentes y personal. Mantén un directorio actualizado y comunicación directa.",
    color: "bg-accent-50 text-accent-600",
  },
  {
    icon: ReceiptText,
    title: "Recibos Automáticos",
    description:
      "Genera y envía recibos de cobro automáticamente. Los residentes reciben sus recibos por WhatsApp y email.",
    color: "bg-primary-50 text-primary-600",
  },
  {
    icon: AlertTriangle,
    title: "Control de Morosidad",
    description:
      "Alertas inteligentes de pagos pendientes. Identifica patrones y reduce la morosidad de tu condominio.",
    color: "bg-accent-50 text-accent-600",
  },
];

const container = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
} as const;

export function Features() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="py-20 px-4 bg-surface-50 relative overflow-hidden">
      <GridPattern className="absolute inset-0 w-full h-full text-primary-200" />
      <div className="max-w-7xl mx-auto relative z-10" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <span className="text-sm font-bold uppercase tracking-widest text-primary-500">
            Herramientas
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-surface-800 mt-2">
            Todo lo que necesitas para administrar
          </h2>
          <p className="text-surface-500 mt-3 max-w-2xl mx-auto">
            Cuatro pilares que transforman la gestión de tu condominio de
            caótica a profesional.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {features.map((feature) => (
            <motion.div key={feature.title} variants={item}>
              <Card className="group h-full hover:shadow-lg hover:shadow-primary-100/50 hover:-translate-y-1 transition-all duration-300">
                <CardContent className="p-6 flex flex-col items-center text-center gap-4">
                  <div className={`p-4 rounded-2xl ${feature.color}`}>
                    <feature.icon className="h-7 w-7" />
                  </div>
                  <h3 className="font-bold text-lg text-surface-800">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-surface-500 leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
