import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Hero } from "@/components/landing/hero";
import { Features } from "@/components/landing/features";
import { PagosSection } from "@/components/landing/pagos";
import { About } from "@/components/landing/about";
import { Stats } from "@/components/landing/stats";
import { Ventajas } from "@/components/landing/ventajas";
import { Proceso } from "@/components/landing/proceso";
import { Testimonios } from "@/components/landing/testimonios";
import { WhatsAppCTA } from "@/components/landing/whatsapp-cta";
import { CtaFinal } from "@/components/landing/cta-final";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Features />
        <PagosSection />
        <About />
        <Stats />
        <Ventajas />
        <Proceso />
        <WhatsAppCTA />
        <Testimonios />
        <CtaFinal />
      </main>
      <Footer />
    </>
  );
}
