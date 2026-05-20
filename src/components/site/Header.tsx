"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { LogIn, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { CONTACT_VISITED_KEY } from "@/lib/site";

const nav = [
  { to: "/", label: "Beranda" },
  { to: "/about", label: "Tentang" },
  { to: "/services", label: "Layanan" },
  { to: "/products", label: "Produk" },
  { to: "/projects", label: "Portofolio" },
  { to: "/contact", label: "Kontak" },
] as const;

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    // Reveal Login only after the user has visited /contact
    const check = () =>
      setShowLogin(window.localStorage.getItem(CONTACT_VISITED_KEY) === "1");
    check();
    window.addEventListener("storage", check);
    window.addEventListener("rn:contact-visited", check);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("storage", check);
      window.removeEventListener("rn:contact-visited", check);
    };
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-smooth",
        scrolled
          ? "bg-background/85 backdrop-blur-md border-b border-border/60 py-3"
          : "bg-transparent py-5"
      )}
    >
      <div className="container mx-auto px-6  flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          {/* Bagian Logo (Gambar) */}
          <div className="h-8 w-12 rounded-sm overflow-hidden grid place-items-center -translate-y-[2px]">
            <img
              src="/RN_Architect.png"
              alt="RN Architect Logo"
              width={40}
              height={40}
              className="w-full h-full object-contain"
            />
          </div>

          {/* Bagian Teks */}
          {/* Tambahkan translate-y-[Xpx] di sini untuk menaikkan/menurunkan teks */}
          <span className="font-display text-xl tracking-tight translate-y-[2px]">
            ARCHITECT
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-7">
          {nav.map((n) => {
            const isActive = n.to === "/" ? pathname === "/" : pathname.startsWith(n.to);
            return (
              <Link
                key={n.to}
                href={n.to}
                className={cn(
                  "text-sm text-foreground/75 hover:text-primary transition-smooth",
                  isActive && "text-primary font-medium"
                )}
              >
                {n.label}
              </Link>
            );
          })}
          {showLogin && (
            <Link
              href="/login"
              className="ml-2 inline-flex items-center gap-1.5 text-sm px-3.5 py-1.5 rounded-full border border-primary/40 text-primary hover:bg-primary hover:text-primary-foreground transition-smooth"
            >
              <LogIn className="h-3.5 w-3.5" /> Login
            </Link>
          )}
        </nav>

        <button
          aria-label="Menu"
          className="md:hidden p-2 -mr-2 text-foreground"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-background border-t border-border mt-3">
          <nav className="container mx-auto px-6 py-4 flex flex-col gap-4">
            {nav.map((n) => {
              const isActive = n.to === "/" ? pathname === "/" : pathname.startsWith(n.to);
              return (
                <Link
                  key={n.to}
                  href={n.to}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "text-base text-foreground/80",
                    isActive && "text-primary font-medium"
                  )}
                >
                  {n.label}
                </Link>
              );
            })}
            {showLogin && (
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="inline-flex items-center gap-2 text-primary"
              >
                <LogIn className="h-4 w-4" /> Login
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
