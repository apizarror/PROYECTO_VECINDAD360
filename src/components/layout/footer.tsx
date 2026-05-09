import Link from "next/link";

const footerLinks = {
  producto: [
    { label: "Características", href: "/caracteristicas" },
    { label: "Precios", href: "/precios" },
    { label: "Demo", href: "/demo" },
  ],
  recursos: [
    { label: "Blog", href: "/blog" },
    { label: "Ayuda", href: "/ayuda" },
    { label: "Contacto", href: "/contacto" },
  ],
  legal: [
    { label: "Términos y condiciones", href: "/terminos" },
    { label: "Privacidad", href: "/privacidad" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-surface-900 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          <div className="sm:col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-primary-700 font-extrabold text-sm">
                V3
              </div>
              <span className="font-bold text-lg">Vecindad360</span>
            </Link>
            <p className="text-surface-400 text-sm leading-relaxed max-w-xs">
              La plataforma inteligente que transforma la gestión de tu
              condominio. Full control, cero estrés.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-3 text-sm uppercase tracking-wider">
              Producto
            </h4>
            <ul className="space-y-2.5">
              {footerLinks.producto.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-surface-400 text-sm hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-3 text-sm uppercase tracking-wider">
              Recursos
            </h4>
            <ul className="space-y-2.5">
              {footerLinks.recursos.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-surface-400 text-sm hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-3 text-sm uppercase tracking-wider">
              Legal
            </h4>
            <ul className="space-y-2.5">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-surface-400 text-sm hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-surface-700 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-surface-500 text-sm text-center sm:text-left">
            &copy; {new Date().getFullYear()} Vecindad360. Todos los derechos
            reservados.
          </p>
          <p className="text-surface-500 text-sm">
            Tu comunidad, en 360°.
          </p>
        </div>
      </div>
    </footer>
  );
}
