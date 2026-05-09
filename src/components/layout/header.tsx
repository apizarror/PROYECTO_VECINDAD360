"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { NavLink } from "@/types";

const navLinks: NavLink[] = [
  { label: "Características", href: "/caracteristicas" },
  { label: "Precios", href: "/precios" },
  { label: "Contacto", href: "/contacto" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
  }, [mobileOpen]);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "glass border-b border-surface-200/50 shadow-sm"
          : "bg-transparent"
      )}
    >
      <div className="mx-auto max-w-7xl flex items-center justify-between px-6 py-3">
        <Link href="/" className="flex items-center gap-2.5 font-bold text-xl text-primary-700">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-600 text-white font-extrabold text-sm shadow-md shadow-primary-500/25">
            V3
          </div>
          <span className={cn(scrolled ? "text-primary-800" : "text-white")}>
            Vecindad360
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "px-4 py-2 text-sm font-medium rounded-lg transition-colors",
                scrolled
                  ? "text-surface-600 hover:text-primary-700 hover:bg-primary-50"
                  : "text-white/80 hover:text-white hover:bg-white/10"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Link href="/demo">
            <Button
              variant={scrolled ? "outline" : "outline-white"}
              size="sm"
            >
              Ver Demo
            </Button>
          </Link>
          <Link href="/auth">
            <Button variant="accent" size="sm">
              Comenzar Gratis
            </Button>
          </Link>
        </div>

        <button
          onClick={() => setMobileOpen(true)}
          className={cn(
            "md:hidden p-2 rounded-lg transition-colors",
            scrolled
              ? "text-surface-700 hover:bg-surface-100"
              : "text-white hover:bg-white/10"
          )}
          aria-label="Abrir menú"
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-50 md:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-[300px] bg-white z-50 shadow-2xl md:hidden flex flex-col"
            >
              <div className="flex items-center justify-between p-5 border-b border-surface-100">
                <Link
                  href="/"
                  className="flex items-center gap-2.5 font-bold text-lg text-primary-700"
                  onClick={() => setMobileOpen(false)}
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600 text-white font-extrabold text-xs">
                    V3
                  </div>
                  Vecindad360
                </Link>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-2 rounded-lg text-surface-500 hover:bg-surface-100"
                  aria-label="Cerrar menú"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <nav className="flex-1 p-5 space-y-1">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.05 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center justify-between p-3 rounded-xl text-surface-700 font-medium hover:bg-primary-50 hover:text-primary-700 transition-colors"
                    >
                      {link.label}
                      <ChevronRight className="h-4 w-4 text-surface-400" />
                    </Link>
                  </motion.div>
                ))}
              </nav>

              <div className="p-5 border-t border-surface-100 space-y-3">
                <Link href="/demo" onClick={() => setMobileOpen(false)}>
                  <Button variant="outline" className="w-full">
                    Ver Demo
                  </Button>
                </Link>
                <Link href="/auth" onClick={() => setMobileOpen(false)}>
                  <Button variant="accent" className="w-full">
                    Comenzar Gratis
                  </Button>
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
