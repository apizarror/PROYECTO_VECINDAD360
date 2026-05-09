"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { DotsPattern } from "@/components/illustrations/patterns";
import type { Testimonial } from "@/types";

const testimonials: Testimonial[] = [
  {
    name: "Carlos Mendoza",
    role: "Administrador",
    condominio: "Condominio Las Palmas",
    quote:
      "Vecindad360 transformó completamente la manera en que administro el condominio. Ahora todo es más ordenado y los residentes están más satisfechos con la transparencia financiera.",
    initials: "CM",
    rating: 5,
  },
  {
    name: "María Fernández",
    role: "Administradora",
    condominio: "Torres del Sol",
    quote:
      "Antes perdía horas en hojas de cálculo. Con Vecindad360 genero los recibos de todos los departamentos en minutos. Las alertas por WhatsApp son increíbles.",
    initials: "MF",
    rating: 5,
  },
  {
    name: "Jorge Quispe",
    role: "Presidente de Junta",
    condominio: "Residencial Norte",
    quote:
      "La transparencia financiera que nos da Vecindad360 ha mejorado mucho la confianza entre los residentes y la administración. Las votaciones digitales nos ahorran horas de asamblea.",
    initials: "JQ",
    rating: 5,
  },
];

export function Testimonios() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="py-20 px-4 bg-surface-50 relative overflow-hidden">
      <DotsPattern className="absolute inset-0 w-full h-full text-primary-100" />
      <div className="max-w-7xl mx-auto relative z-10" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <span className="text-sm font-bold uppercase tracking-widest text-accent-500">
            Testimonios
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-surface-800 mt-2">
            Lo que dicen nuestros clientes
          </h2>
          <p className="text-surface-500 mt-3 max-w-2xl mx-auto">
            Administradores reales, resultados reales. Descubre por qué confían
            en Vecindad360.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.15 }}
            >
              <Card className="h-full hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                <CardContent className="p-7 flex flex-col gap-5 h-full">
                  <div className="flex gap-1">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 fill-accent-400 text-accent-400"
                      />
                    ))}
                  </div>
                  <p className="text-sm leading-relaxed text-surface-600 flex-1 italic">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div className="flex items-center gap-3 pt-4 border-t border-surface-100">
                    <div className="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                      {t.initials}
                    </div>
                    <div>
                      <p className="font-bold text-sm text-surface-800">
                        {t.name}
                      </p>
                      <p className="text-xs text-surface-400">
                        {t.role} — {t.condominio}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
