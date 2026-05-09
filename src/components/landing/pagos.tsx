"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { CreditCard, Zap, ShieldCheck, Smartphone, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PaymentBadges } from "@/components/illustrations/payment-badges";
import { BlobDecoration } from "@/components/illustrations/patterns";

const paymentFeatures = [
  {
    icon: Zap,
    title: "Yape y Plin integrados",
    description: "Tus vecinos pagan con los apps que ya usan todos los días. Cero fricción, cero excusas para no pagar.",
    color: "bg-purple-500",
  },
  {
    icon: CreditCard,
    title: "Tarjeta de crédito y débito",
    description: "Acepta Visa, Mastercard, Amex. Pago en cuotas disponible para cuotas altas de mantenimiento.",
    color: "bg-accent-500",
  },
  {
    icon: Smartphone,
    title: "PSE y transferencias",
    description: "Débito inmediato desde cualquier banco. Conciliación automática sin intervención manual.",
    color: "bg-green-500",
  },
  {
    icon: ShieldCheck,
    title: "Reconciliación automática",
    description: "Cada pago se registra, concilia y refleja al instante en el estado de cuenta del residente. Chauca a la doble digitación.",
    color: "bg-primary-600",
  },
];

export function PagosSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="py-20 px-4 bg-white relative overflow-hidden">
      <BlobDecoration className="absolute -top-40 -left-32 w-96 h-96 text-primary-50 hidden sm:block" />
      <BlobDecoration className="absolute -bottom-32 -right-24 w-80 h-80 text-accent-50 hidden sm:block" />
      <div className="max-w-7xl mx-auto relative z-10" ref={ref}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Left: Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div>
              <div className="inline-flex items-center gap-2 bg-purple-50 text-purple-700 rounded-full px-4 py-1.5 text-sm font-bold border border-purple-200">
                <Zap className="h-4 w-4" />
                Exclusivo de Vecindad360
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-surface-800 mt-4 leading-tight">
                Tus vecinos pagan con{" "}
                <Image src="/yape.png" alt="Yape" width={80} height={36} className="h-7 md:h-10 w-auto inline-block align-middle" />,{" "}
                <Image src="/plin.png" alt="Plin" width={80} height={36} className="h-7 md:h-10 w-auto inline-block align-middle" />{" "}
                y lo que prefieran
              </h2>
              <p className="text-surface-500 text-base md:text-lg mt-4 leading-relaxed">
                Integramos los medios de pago más usados en Perú y Latinoamérica.
                Menos fricción, menos morosidad, más felicidad. Tu comunidad paga
                en segundos desde el celular.
              </p>
            </div>

            <div className="space-y-3">
              {paymentFeatures.map((f, i) => (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 10 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.2 + i * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <div className={`flex-shrink-0 w-9 h-9 rounded-lg ${f.color} text-white flex items-center justify-center`}>
                    <f.icon className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-surface-800">{f.title}</h3>
                    <p className="text-xs text-surface-500">{f.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <Link href="/precios">
              <Button variant="accent" size="lg">
                Ver planes con pagos integrados
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>

          {/* Right: Visual */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col items-center gap-8"
          >
            <div className="w-full max-w-md bg-surface-50 rounded-3xl p-5 sm:p-8 border border-surface-200 shadow-lg">
              <div className="text-center space-y-2 mb-6">
                <p className="text-sm text-surface-400 font-medium">Aceptamos todos los medios</p>
                <p className="text-3xl font-extrabold text-surface-800">$450.00</p>
                <p className="text-xs text-surface-400">Mantenimiento — Mayo 2026</p>
              </div>

              <PaymentBadges />
            </div>

            <div className="bg-surface-50 rounded-2xl p-4 border border-surface-200 flex items-center gap-3 text-sm shadow-sm">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <p className="text-surface-600">
                <span className="font-semibold text-surface-800">+3 pagos</span> recibidos en los últimos 15 minutos
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
