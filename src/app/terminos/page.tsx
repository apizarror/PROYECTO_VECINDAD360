import type { Metadata } from "next";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export const metadata: Metadata = {
  title: "Términos y Condiciones",
  description: "Términos y condiciones de uso de Vecindad360.",
};

export default function TerminosPage() {
  return (
    <>
      <Header />
      <main>
        <section className="pt-28 pb-16 px-4 gradient-hero text-white text-center">
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-extrabold">
            Términos y Condiciones
          </h1>
          <p className="text-white/70 mt-4 max-w-xl mx-auto text-lg">
            Última actualización: 30 de mayo de 2026
          </p>
        </section>

        <section className="py-16 px-4 bg-white">
          <div className="max-w-3xl mx-auto prose prose-slate max-w-none space-y-6">
            <h2 className="text-2xl font-bold text-surface-800">1. Aceptación de los Términos</h2>
            <p className="text-surface-600 leading-relaxed">
              Al acceder y utilizar Vecindad360 (&ldquo;el Servicio&rdquo;), usted acepta estar sujeto a estos Términos y Condiciones. Si no está de acuerdo con alguna parte de estos términos, no podrá acceder al Servicio.
            </p>

            <h2 className="text-2xl font-bold text-surface-800">2. Descripción del Servicio</h2>
            <p className="text-surface-600 leading-relaxed">
              Vecindad360 es una plataforma digital de gestión de condominios que permite a administradores controlar finanzas, gestionar residentes, generar recibos, enviar comunicaciones por WhatsApp y más.
            </p>

            <h2 className="text-2xl font-bold text-surface-800">3. Cuentas de Usuario</h2>
            <p className="text-surface-600 leading-relaxed">
              Al crear una cuenta, usted es responsable de mantener la confidencialidad de su contraseña y de todas las actividades que ocurran bajo su cuenta. Debe notificarnos inmediatamente sobre cualquier uso no autorizado.
            </p>

            <h2 className="text-2xl font-bold text-surface-800">4. Privacidad y Protección de Datos</h2>
            <p className="text-surface-600 leading-relaxed">
              Toda la información personal recopilada se maneja de acuerdo con nuestra Política de Privacidad y las leyes de protección de datos aplicables en cada jurisdicción donde operamos.
            </p>

            <h2 className="text-2xl font-bold text-surface-800">5. Pagos y Facturación</h2>
            <p className="text-surface-600 leading-relaxed">
              Los planes de suscripción se facturan mensual o anualmente según lo acordado. Los pagos se procesan a través de pasarelas de pago seguras. El cliente puede cancelar en cualquier momento desde su panel de control.
            </p>

            <h2 className="text-2xl font-bold text-surface-800">6. Cancelación</h2>
            <p className="text-surface-600 leading-relaxed">
              Puede cancelar su suscripción en cualquier momento. La cancelación será efectiva al final del período de facturación actual. No se realizan reembolsos por períodos parciales.
            </p>

            <h2 className="text-2xl font-bold text-surface-800">7. Limitación de Responsabilidad</h2>
            <p className="text-surface-600 leading-relaxed">
              Vecindad360 proporciona el Servicio &ldquo;tal cual&rdquo;. No garantizamos que el servicio sea ininterrumpido o libre de errores. En ningún caso Vecindad360 será responsable por daños indirectos, incidentales o consecuentes.
            </p>

            <h2 className="text-2xl font-bold text-surface-800">8. Cambios en los Términos</h2>
            <p className="text-surface-600 leading-relaxed">
              Nos reservamos el derecho de modificar estos términos en cualquier momento. Los cambios entrarán en vigor inmediatamente después de su publicación. El uso continuado del Servicio constituye la aceptación de los nuevos términos.
            </p>

            <h2 className="text-2xl font-bold text-surface-800">9. Contacto</h2>
            <p className="text-surface-600 leading-relaxed">
              Para cualquier pregunta sobre estos Términos, contáctenos a través de la página de <a href="/contacto" className="text-primary-600 font-semibold hover:underline">Contacto</a>.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
