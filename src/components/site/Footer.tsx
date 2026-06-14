import Link from "next/link";
import { Instagram, MapPin, Phone } from "lucide-react";
import { SITE, waLink } from "@/lib/site";
import { FaTiktok } from "react-icons/fa";

export function Footer() {
  return (
    <footer className="shrink-0 bg-bamboo-deep text-cream">
      <div className="container mx-auto grid gap-8 px-6 py-10 md:grid-cols-4 md:gap-12 md:py-16">
        <div className="md:col-span-2 space-y-4">
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
          <p className="text-cream/70 max-w-sm leading-relaxed">
            Studio arsitektur & interior yang menerjemahkan ruang menjadi pengalaman tinggal yang
            tenang, fungsional, dan tahan waktu.
          </p>
          <a
            href={waLink("Halo RN_ARCHITECT, saya tertarik untuk berdiskusi.")}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 mt-2 px-5 py-2.5 rounded-full bg-bamboo-soft text-bamboo-deep font-medium hover:bg-cream transition-smooth"
          >
            Diskusi via WhatsApp
          </a>
        </div>

        <div>
          <h4 className="text-sm uppercase tracking-widest text-bamboo-soft mb-4">Navigasi</h4>
          <ul className="space-y-2 text-cream/80 text-sm">
            {[
              ["/about", "Tentang"],
              ["/services", "Layanan"],
              ["/products", "Produk"],
              ["/projects", "Portofolio"],
              ["/contact", "Kontak"],
            ].map(([to, label]) => (
              <li key={to}>
                <Link href={to} className="hover:text-cream transition-smooth">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm uppercase tracking-widest text-bamboo-soft mb-4">Kontak</h4>
          <ul className="space-y-3 text-sm text-cream/80">
            <li className="flex items-start gap-2">
              <Phone className="h-4 w-4 mt-0.5 shrink-0" /> +{SITE.whatsapp}
            </li>
            <li className="flex items-start gap-2">
              <MapPin className="h-4 w-4 mt-0.5 shrink-0" /> {SITE.address}
            </li>
            <li className="flex items-center gap-3 pt-2">
              <a aria-label="Instagram" href="https://instagram.com/@rn.archstudio" className="flex items-center gap-2 hover:text-cream">
                <Instagram className="h-4 w-4" />
                <span>rn.archstudio</span>
              </a>
            </li>
            <li className="flex items-center gap-3 pt-2">
              <a aria-label="TikTok" href="https://tiktok.com/@rn_archstudio" className="flex items-center gap-2 hover:text-cream">
                {/* Gunakan nama komponen icon sesuai yang Anda import (misal: <Tiktok /> atau <FaTiktok />) */}
                <FaTiktok className="h-4 w-4" />
                <span>rn_archstudio</span>
              </a>
            </li>

          </ul>
        </div>
      </div>
      <div className="border-t border-cream/10">
        <div className="container mx-auto flex flex-col gap-2 px-6 py-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))] text-xs text-cream/60 sm:flex-row sm:flex-wrap sm:justify-between">
          <span>© {new Date().getFullYear()} RN_ARCHITECT. All rights reserved.</span>
          <span>{SITE.hours}</span>
        </div>
      </div>
    </footer>
  );
}
