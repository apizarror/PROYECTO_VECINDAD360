"use client";

import { MessageCircle, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

const plans = [
  { name: "Basico", price: "S/ 99", units: "Hasta 20 unidades" },
  { name: "Pro", price: "S/ 269", units: "Hasta 100 unidades" },
  { name: "Empresarial", price: "S/ 679", units: "Ilimitado" },
];

export function TrialOverlay() {
  const whatsappUrl =
    "https://wa.me/51984798650?text=Hola%2C%20quiero%20activar%20mi%20plan%20de%20Vecindad360";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="max-w-2xl w-full mx-4 bg-white rounded-2xl shadow-2xl p-6 sm:p-10">
        <div className="text-center mb-8">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary-600 text-white font-extrabold text-lg mb-4">
            V3
          </div>
          <h2 className="text-2xl font-extrabold text-surface-800">
            Tu periodo de prueba ha vencido
          </h2>
          <p className="text-surface-500 mt-2 text-sm">
            Elige un plan para seguir usando Vecindad360
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className="rounded-xl border border-surface-200 p-5 text-center hover:border-primary-400 transition-colors"
            >
              <h3 className="text-lg font-bold text-surface-800">
                {plan.name}
              </h3>
              <p className="text-2xl font-extrabold text-primary-600 mt-2">
                {plan.price}
              </p>
              <p className="text-surface-500 text-sm mt-1">/mes</p>
              <p className="text-surface-600 text-sm mt-3">{plan.units}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center gap-3">
          <Button
            variant="accent"
            size="lg"
            className="w-full sm:w-auto"
            onClick={() => window.open(whatsappUrl, "_blank")}
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            Contactar por WhatsApp
          </Button>
          <p className="text-surface-500 text-sm flex items-center gap-1.5">
            <Phone className="h-3.5 w-3.5" />
            O yapea al 984 798 650 el monto de tu plan
          </p>
        </div>
      </div>
    </div>
  );
}
