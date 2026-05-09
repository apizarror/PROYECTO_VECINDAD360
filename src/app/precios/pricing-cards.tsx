"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { PricingTier } from "@/types";

const tiers: PricingTier[] = [
  {
    name: "Básico",
    price: "$29",
    period: "/mes",
    description: "Perfecto para condominios pequeños que empiezan a organizarse.",
    features: [
      "Hasta 20 unidades",
      "Control financiero básico",
      "Generación de recibos",
      "Recibos por email",
      "Directorio de residentes",
      "Soporte por email",
    ],
    cta: "Comenzar Gratis",
    href: "/auth",
  },
  {
    name: "Pro",
    price: "$79",
    period: "/mes",
    description: "El plan más popular. Ideal para condominios medianos con necesidades completas.",
    features: [
      "Hasta 100 unidades",
      "Control financiero avanzado",
      "Pagos con Yape, Plin y tarjeta",
      "Recibos automáticos por WhatsApp",
      "Portal del residente",
      "Conciliación bancaria automática",
      "Reportes exportables",
      "Soporte prioritario 24/7",
    ],
    cta: "Comenzar Pro",
    href: "/auth",
    popular: true,
  },
  {
    name: "Empresarial",
    price: "$199",
    period: "/mes",
    description: "Para administradoras profesionales con múltiples condominios a cargo.",
    features: [
      "Unidades ilimitadas",
      "Múltiples condominios",
      "Integración WhatsApp completa",
      "Todos los medios de pago (Yape, Plin, PSE, tarjeta)",
      "Reconciliación automática avanzada",
      "Votación digital",
      "Firma electrónica de documentos",
      "API de integración",
      "Gerente de cuenta dedicado",
    ],
    cta: "Contactar Ventas",
    href: "/contacto",
  },
];

export function PricingCards() {
  return (
    <section className="py-20 px-4 bg-surface-50">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {tiers.map((tier, i) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className={cn(
                "relative rounded-2xl p-8 flex flex-col",
                tier.popular
                  ? "bg-primary-600 text-white shadow-2xl shadow-primary-500/30 scale-[1.02] border-2 border-accent-400"
                  : "bg-white shadow-sm border border-surface-200"
              )}
            >
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent-500 text-white text-xs font-bold uppercase tracking-wider px-4 py-1 rounded-full">
                  Más Popular
                </div>
              )}

              <div className="mb-6">
                <h3
                  className={cn(
                    "text-xl font-bold",
                    tier.popular ? "text-white" : "text-surface-800"
                  )}
                >
                  {tier.name}
                </h3>
                <div className="flex items-baseline gap-1 mt-2">
                  <span
                    className={cn(
                      "text-4xl font-extrabold",
                      tier.popular ? "text-white" : "text-surface-800"
                    )}
                  >
                    {tier.price}
                  </span>
                  <span
                    className={cn(
                      "text-sm",
                      tier.popular ? "text-white/60" : "text-surface-400"
                    )}
                  >
                    {tier.period}
                  </span>
                </div>
                <p
                  className={cn(
                    "text-sm mt-2",
                    tier.popular ? "text-white/70" : "text-surface-500"
                  )}
                >
                  {tier.description}
                </p>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm">
                    <Check
                      className={cn(
                        "h-5 w-5 flex-shrink-0 mt-0.5",
                        tier.popular ? "text-accent-400" : "text-primary-600"
                      )}
                    />
                    <span
                      className={
                        tier.popular ? "text-white/80" : "text-surface-600"
                      }
                    >
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <Link href={tier.href} className="block">
                <Button
                  variant={tier.popular ? "accent" : "outline"}
                  className="w-full"
                  size="lg"
                >
                  {tier.cta}
                </Button>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
