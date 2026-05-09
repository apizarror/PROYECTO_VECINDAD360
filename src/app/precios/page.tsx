import type { Metadata } from "next";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { PricingCards } from "./pricing-cards";

export const metadata: Metadata = {
  title: "Precios",
  description:
    "Planes flexibles para condominios de cualquier tamaño. Empieza gratis y escala cuando necesites.",
};

export default function PreciosPage() {
  return (
    <>
      <Header />
      <main>
        <section className="pt-28 pb-16 px-4 gradient-hero text-white text-center">
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-extrabold">
            Planes simples, precios claros
          </h1>
          <p className="text-white/70 mt-4 max-w-xl mx-auto text-lg">
            Elige el plan que se adapte a tu condominio. Sin costos ocultos.
            Cambia de plan cuando quieras.
          </p>
        </section>
        <PricingCards />
      </main>
      <Footer />
    </>
  );
}
