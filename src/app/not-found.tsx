import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="flex-1 flex items-center justify-center min-h-screen bg-surface-50 px-4">
        <div className="text-center space-y-6">
          <div className="text-8xl font-extrabold text-primary-200">404</div>
          <h1 className="text-2xl font-bold text-surface-800">
            Página no encontrada
          </h1>
          <p className="text-surface-500 max-w-md mx-auto">
            Lo sentimos, la página que buscas no existe o ha sido movida.
          </p>
          <div className="flex gap-3 justify-center">
            <Link href="/">
              <Button variant="primary">Volver al inicio</Button>
            </Link>
            <Link href="/contacto">
              <Button variant="outline">Contactar soporte</Button>
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
