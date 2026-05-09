import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Play, CheckCircle, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Demo",
  description:
    "Descubre cómo Vecindad360 transforma la gestión de tu condominio. Mira nuestro demo interactivo.",
};

export default function DemoPage() {
  return (
    <>
      <Header />
      <main>
        <section className="pt-28 pb-16 px-4 gradient-hero text-white text-center">
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-extrabold">
            Mira Vecindad360 en acción
          </h1>
          <p className="text-white/70 mt-4 max-w-2xl mx-auto text-lg">
            Un recorrido guiado por todas las herramientas que harán de tu
            gestión condominial algo sencillo.
          </p>
        </section>

        <section className="py-20 px-4 bg-white">
          <div className="max-w-4xl mx-auto">
            <div className="aspect-video rounded-2xl bg-surface-100 border border-surface-200 flex items-center justify-center mb-12">
              <div className="text-center space-y-4">
                <div className="w-20 h-20 rounded-full bg-primary-600 mx-auto flex items-center justify-center shadow-lg shadow-primary-500/30">
                  <Play className="h-8 w-8 text-white ml-1" />
                </div>
                <p className="text-surface-500 text-sm">
                  Video demostrativo de 3 minutos
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                "Panel financiero con reportes en tiempo real",
                "Generación de recibos en 1 clic",
                "Alertas inteligentes de morosidad",
                "WhatsApp integrado para residentes",
                "Pasarela de pagos nativa",
                "Votación digital para asambleas",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-primary-600 flex-shrink-0 mt-0.5" />
                  <span className="text-surface-600">{item}</span>
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link href="/auth">
                <Button variant="accent" size="lg">
                  Comenzar Ahora
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
