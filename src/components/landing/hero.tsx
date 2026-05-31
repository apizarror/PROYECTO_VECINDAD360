"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HeroCarousel } from "@/components/landing/hero-carousel";
import { HeroStats } from "@/components/landing/hero-stats";
import { CondoModerno } from "@/components/illustrations/condo-moderno";
import { CondoComunidad } from "@/components/illustrations/condo-comunidad";
import { CondoAmenidades } from "@/components/illustrations/condo-amenidades";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
  }),
};

const carouselSlides = [
  { component: CondoModerno, alt: "Condominio moderno con fachada de vidrio" },
  { component: CondoComunidad, alt: "Comunidad residencial con áreas verdes" },
  { component: CondoAmenidades, alt: "Áreas comunes con piscina y jardines" },
];

export function Hero() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <section
      ref={ref}
      className="relative overflow-hidden min-h-[620px] flex items-center"
    >
      <HeroCarousel slides={carouselSlides} interval={6000} />

      <div className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 py-20 md:py-32">
        <div className="flex flex-col lg:flex-row items-center gap-14 lg:gap-20">
          <div className="flex-1 space-y-6 text-center lg:text-left">
            <motion.p
              custom={0}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              variants={fadeUp}
              className="text-sm font-medium tracking-wide uppercase text-accent-300 letter-spacing-[0.1em]"
            >
              Gestión de condominios en Perú
            </motion.p>

            <motion.h1
              custom={1}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              variants={fadeUp}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] font-bold text-white leading-[1.1] tracking-tight"
            >
              Tu condominio,
              <br />
              bajo control <span className="text-accent-400">real</span>
            </motion.h1>

            <motion.p
              custom={2}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              variants={fadeUp}
              className="text-base md:text-lg text-white/65 max-w-lg mx-auto lg:mx-0 leading-relaxed"
            >
              Cobranzas con Yape y Plin, reportes claros, comunicación directa
              con tus vecinos. Todo desde un solo lugar.
            </motion.p>

            <motion.div
              custom={3}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              variants={fadeUp}
              className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start pt-2"
            >
              <Link href="/auth">
                <Button variant="accent" size="lg">
                  Probar gratis
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/demo">
                <Button variant="outline-white" size="lg">
                  Ver demo
                </Button>
              </Link>
            </motion.div>

            <motion.p
              custom={4}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              variants={fadeUp}
              className="text-xs text-white/40 tracking-wide"
            >
              Sin tarjeta de crédito &middot; Listo en 5 minutos
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="flex-1 flex justify-center items-center"
          >
            <HeroStats />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
