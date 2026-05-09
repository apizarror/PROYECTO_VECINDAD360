import type { Metadata } from "next";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { FeaturesGrid } from "./features-grid";

export const metadata: Metadata = {
  title: "Características",
  description:
    "Descubre todas las herramientas que Vecindad360 ofrece para administrar tu condominio de forma inteligente.",
};

export default function CaracteristicasPage() {
  return (
    <>
      <Header />
      <main>
        <section className="pt-28 pb-16 px-4 gradient-hero text-white text-center">
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-extrabold">
            Características de Vecindad360
          </h1>
          <p className="text-white/70 mt-4 max-w-2xl mx-auto text-lg">
            Cada herramienta diseñada para resolver un dolor real de la gestión
            condominial.
          </p>
        </section>
        <FeaturesGrid />
      </main>
      <Footer />
    </>
  );
}
