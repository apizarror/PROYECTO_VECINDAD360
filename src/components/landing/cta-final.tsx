"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CtaFinal() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="py-20 px-4 gradient-cta relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
      <div className="absolute rounded-full w-96 h-96 bg-white/5 -top-48 -right-48 blur-3xl" />
      <div className="absolute rounded-full w-64 h-64 bg-accent-500/20 -bottom-32 -left-32 blur-3xl" />

      <div className="relative z-10 max-w-3xl mx-auto text-center">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-extrabold text-white leading-tight">
            ¿Listo para transformar tu condominio?
          </h2>
          <p className="text-white/70 text-base md:text-lg max-w-xl mx-auto">
            Únete a más de 120 condominios que ya confían en Vecindad360. Empieza
            gratis, sin compromisos.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/precios">
              <Button variant="white" size="lg">
                Ver Planes
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/auth">
              <Button variant="outline-white" size="lg">
                Comenzar Gratis
              </Button>
            </Link>
          </div>
          <p className="text-white/40 text-sm">
            Sin tarjeta de crédito · Cancela al toque · Soporte 24/7
          </p>
        </motion.div>
      </div>
    </section>
  );
}
