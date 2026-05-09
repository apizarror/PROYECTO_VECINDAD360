"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HeroCarousel } from "@/components/landing/hero-carousel";
import { HeroStats } from "@/components/landing/hero-stats";
import { CondoModerno } from "@/components/illustrations/condo-moderno";
import { CondoComunidad } from "@/components/illustrations/condo-comunidad";
import { CondoAmenidades } from "@/components/illustrations/condo-amenidades";

const stagger = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
} as const;

const fadeIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.7 } },
} as const;

const carouselSlides = [
  { component: CondoModerno, alt: "Condominio moderno con fachada de vidrio" },
  { component: CondoComunidad, alt: "Comunidad residencial con áreas verdes" },
  { component: CondoAmenidades, alt: "Áreas comunes con piscina y jardines" },
];

export function Hero() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      ref={ref}
      className="relative overflow-hidden min-h-[600px] flex items-center"
    >
      <HeroCarousel slides={carouselSlides} interval={5000} />

      <div className="absolute inset-0 overflow-hidden pointer-events-none z-20">
        <div className="absolute rounded-full w-20 h-20 bg-white/5 -top-10 -left-10" />
        <div className="absolute rounded-full w-40 h-40 bg-white/5 top-1/3 -right-20" />
        <div className="absolute rounded-full w-60 h-60 bg-white/[0.03] -bottom-20 left-1/3" />
      </div>

      <div className="relative z-20 w-full max-w-7xl mx-auto px-6 py-20 md:py-28">
        <motion.div
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={stagger}
          className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16"
        >
          <div className="flex-1 space-y-7 text-center lg:text-left">
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-1.5 text-sm text-white/80 border border-white/10">
              <CheckCircle className="h-4 w-4 text-accent-400" />
              Pagos con Yape, Plin y más
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight tracking-tight"
            >
              Administra tu condominio{" "}
              <span className="text-accent-400">sin estrés</span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="text-lg text-white/70 max-w-xl mx-auto lg:mx-0"
            >
              La plataforma integral que conecta administradores, residentes y
              proveedores. Tus vecinos pagan con Yape, Plin o tarjeta. Tú
              tienes el control al toque y sin roche.
            </motion.p>

            <motion.div
              variants={fadeUp}
              className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start"
            >
              <Link href="/auth">
                <Button variant="accent" size="lg">
                  Comenzar Gratis
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/demo">
                <Button variant="outline-white" size="lg">
                  Ver Demo
                </Button>
              </Link>
            </motion.div>

            <motion.p variants={fadeUp} className="text-sm text-white/50">
              Sin tarjeta de crédito · Configuración al toque · Soporte 24/7
            </motion.p>
          </div>

          <motion.div variants={fadeIn} className="flex-1 flex justify-center items-center">
            <HeroStats />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
