import type { Metadata } from "next";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ContactForm } from "./contact-form";

export const metadata: Metadata = {
  title: "Contacto",
  description:
    "Ponte en contacto con el equipo de Vecindad360. Estamos listos para ayudarte.",
};

export default function ContactoPage() {
  return (
    <>
      <Header />
      <main>
        <section className="pt-28 pb-16 px-4 gradient-hero text-white text-center">
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-extrabold">Contáctanos</h1>
          <p className="text-white/70 mt-4 max-w-xl mx-auto text-lg">
            Cuéntanos sobre tu condominio y te mostraremos cómo Vecindad360 puede
            ayudarte.
          </p>
        </section>
        <ContactForm />
      </main>
      <Footer />
    </>
  );
}
