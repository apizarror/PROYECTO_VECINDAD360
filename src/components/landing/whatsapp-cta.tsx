"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { MessageCircle, Bell, CreditCard, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WhatsAppConversation } from "@/components/illustrations/whatsapp-conversation";

const whatsappFeatures = [
  {
    icon: Bell,
    title: "Alertas automáticas",
    description:
      "El residente recibe notificaciones de pago, recordatorios y comunicados directamente en WhatsApp.",
  },
  {
    icon: MessageCircle,
    title: "Consultas en segundos",
    description:
      '"¿Cuánto debo?" — El bot responde al instante con el saldo pendiente, sin intervención humana.',
  },
  {
    icon: CreditCard,
    title: "Pagos sin fricción",
    description:
      "El residente recibe un link de pago por WhatsApp. Paga al toque. Se concilia automáticamente.",
  },
];

export function WhatsAppCTA() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl border border-surface-200 shadow-xl bg-surface-50"
        >
          <div className="absolute top-0 right-0 w-96 h-96 bg-accent-100 rounded-bl-full opacity-40" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-primary-100 rounded-tr-full opacity-40" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-5 gap-8 p-8 sm:p-12 lg:p-16">
            {/* Left content */}
            <div className="lg:col-span-3 space-y-6">
              <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 rounded-full px-4 py-1.5 text-sm font-bold border border-green-200">
                <MessageCircle className="h-4 w-4" />
                Exclusivo de Vecindad360
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-surface-800 leading-tight">
                Tu condominio conectado por{" "}
                <span className="text-green-500">WhatsApp</span>
              </h2>
              <p className="text-surface-500 text-lg leading-relaxed">
                El residente nunca abre otra app. Las alertas, pagos, consultas
                y reportes entran por donde ya vive: WhatsApp. Tú admin, tienes
                el control total.
              </p>

              <div className="space-y-3">
                {whatsappFeatures.map((f, i) => (
                  <motion.div
                    key={f.title}
                    initial={{ opacity: 0, x: -20 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.4, delay: 0.2 + i * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-green-500 text-white flex items-center justify-center">
                      <f.icon className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-surface-800">
                        {f.title}
                      </h3>
                      <p className="text-xs text-surface-500">{f.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <Link href="/demo">
                <Button variant="accent" size="lg">
                  Ver cómo funciona
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>

            {/* Right: WhatsApp mockup */}
            <div className="lg:col-span-2 flex justify-center items-start">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.3 }}
              >
                <WhatsAppConversation className="w-full max-w-[280px] h-auto" />
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
