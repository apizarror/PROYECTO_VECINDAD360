import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Vecindad360 — Gestión Inteligente de Vecindades en Perú",
    template: "%s | Vecindad360",
  },
  description:
    "La plataforma integral para administrar tu condominio en Perú. Finanzas, residentes, pagos con Yape y Plin, WhatsApp y más. Full control en un solo lugar.",
  keywords: [
    "gestión de vecindades",
    "administración de condominios Perú",
    "software para condominios",
    "control financiero vecinal",
    "gestión de residentes",
    "recibos automáticos",
    "WhatsApp para vecindades",
    "Yape para condominios",
    "Plin para condominios",
    "pagos condominio Perú",
  ],
  authors: [{ name: "Vecindad360" }],
  creator: "Vecindad360",
  metadataBase: new URL("https://vecindad360.com"),
  openGraph: {
    type: "website",
    locale: "es_LA",
    url: "https://vecindad360.com",
    siteName: "Vecindad360",
    title: "Vecindad360 — Gestión Inteligente de Vecindades en Perú",
    description:
      "Administra tu condominio de forma moderna y eficiente. Finanzas, residentes, pagos con Yape y Plin, WhatsApp y más en un solo lugar.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Vecindad360 — Gestión Inteligente de Vecindades en Perú",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Vecindad360 — Gestión Inteligente de Vecindades en Perú",
    description:
      "Administra tu condominio de forma moderna y eficiente. Finanzas, residentes, pagos con Yape y Plin, WhatsApp y más en un solo lugar.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Vecindad360",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  description:
    "Plataforma integral para la gestión de vecindades: finanzas, residentes, pagos, WhatsApp y más.",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${inter.variable} h-full`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="flex min-h-full flex-col font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
