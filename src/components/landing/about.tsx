"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BuildingIllustration } from "@/components/illustrations/building";
import { DotsPattern } from "@/components/illustrations/patterns";

export function About() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-20 px-4 bg-surface-50 relative overflow-hidden" ref={ref}>
      <DotsPattern className="absolute inset-0 w-full h-full text-primary-200" />
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
          {/* Left: Illustration */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="flex-1 flex justify-center"
          >
            <div className="relative">
              <BuildingIllustration className="w-full max-w-[288px] h-auto" />
            </div>
          </motion.div>

          {/* Right: Content */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex-1 space-y-6"
          >
            <div>
              <span className="text-sm font-bold uppercase tracking-widest text-primary-500">
                Sobre Vecindad360
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-surface-800 mt-2 leading-tight">
                La plataforma que entiende cómo funciona tu condominio
              </h2>
            </div>

            <div className="w-16 h-1 rounded-full bg-accent-500" />

            <div className="space-y-4">
              <p className="text-base md:text-lg text-surface-600 leading-relaxed">
                Vecindad360 nació de la frustración de administradores que pasaban
                horas en hojas de cálculo, persiguiendo pagos y lidiando con
                residentes desinformados.
              </p>
              <p className="text-base md:text-lg text-surface-600 leading-relaxed">
                Reunimos todas las herramientas que necesitas en un solo lugar:
                finanzas, residentes, pagos, WhatsApp y más. Para que puedas
                enfocarte en lo que realmente importa: que tu condominio
                funcione chévere.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {[
                { number: "120+", label: "Condominios activos" },
                { number: "4,500+", label: "Residentes gestionados" },
                { number: "98%", label: "Satisfacción" },
                { number: "24/7", label: "Soporte dedicado" },
              ].map((stat) => (
                <div key={stat.label} className="flex items-baseline gap-2">
                  <span className="text-2xl font-extrabold text-primary-600">
                    {stat.number}
                  </span>
                  <span className="text-sm text-surface-500">{stat.label}</span>
                </div>
              ))}
            </div>

            <Link href="/caracteristicas">
              <Button variant="primary" size="lg">
                Conocer más
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
