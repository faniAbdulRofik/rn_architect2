import Link from "next/link";
import { Instagram, Mail, MapPin, Phone } from "lucide-react";
import { SITE, waLink } from "@/lib/site";

export function Footer() {
  return (
    <footer className="bg-bamboo-deep text-cream mt-24">
      <div className="container mx-auto px-6 py-16 grid gap-12 md:grid-cols-4">
        <div className="md:col-span-2 space-y-4">
          <div className="font-display text-2xl">
            RN<span className="text-bamboo-soft">_</span>ARCHITECT
          </div>
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
              <Mail className="h-4 w-4 mt-0.5 shrink-0" /> {SITE.email}
            </li>
            <li className="flex items-start gap-2">
              <MapPin className="h-4 w-4 mt-0.5 shrink-0" /> {SITE.address}
            </li>
            <li className="flex items-center gap-3 pt-2">
              <a aria-label="Instagram" href="#" className="hover:text-cream"><Instagram className="h-4 w-4" /></a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-cream/10">
        <div className="container mx-auto px-6 py-6 text-xs text-cream/60 flex flex-wrap gap-2 justify-between">
          <span>© {new Date().getFullYear()} RN_ARCHITECT. All rights reserved.</span>
          <span>{SITE.hours}</span>
        </div>
      </div>
    </footer>
  );
}
