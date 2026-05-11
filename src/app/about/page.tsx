import { SiteLayout } from "@/components/site/SiteLayout";
import { Award, Leaf, Pencil, Users } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tentang — RN_ARCHITECT",
  description: "Profil studio, filosofi desain, dan perjalanan RN_ARCHITECT.",
  openGraph: {
    title: "Tentang — RN_ARCHITECT",
  },
};

const values = [
  { icon: Leaf, title: "Kontekstual", desc: "Mendesain dengan iklim, budaya, dan lokasi sebagai titik tolak." },
  { icon: Pencil, title: "Detail-Oriented", desc: "Setiap sambungan, material, dan ukuran kami pertimbangkan." },
  { icon: Users, title: "Kolaboratif", desc: "Klien adalah co-author. Proses kami terbuka dan dialogis." },
  { icon: Award, title: "Tahan Waktu", desc: "Kami merancang untuk dekade, bukan musim trend." },
];

const timeline = [
  { y: "2013", t: "Studio didirikan", d: "Memulai dari proyek-proyek residensial kecil." },
  { y: "2017", t: "Ekspansi komersial", d: "Menangani kantor & retail untuk klien korporat." },
  { y: "2020", t: "Lini produk interior", d: "Meluncurkan koleksi furnitur custom." },
  { y: "2024", t: "120+ proyek", d: "Tersebar di Jakarta, Bandung, Bali, dan Surabaya." },
];

export default function AboutPage() {
  return (
    <SiteLayout>
      <section className="pt-40 pb-24 bg-gradient-warm">
        <div className="container mx-auto px-6 max-w-4xl">
          <p className="text-xs tracking-[0.3em] uppercase text-primary mb-4">Tentang</p>
          <h1 className="text-5xl md:text-7xl text-balance leading-tight">
            Studio kecil yang percaya pada kerja yang <em className="text-primary not-italic">teliti</em>.
          </h1>
          <p className="mt-8 text-lg text-muted-foreground leading-relaxed max-w-2xl">
            RN_ARCHITECT adalah studio arsitektur dan interior yang berbasis di Jakarta. Kami
            mengerjakan jumlah proyek terbatas setiap tahun, agar setiap klien mendapat perhatian
            penuh dari awal hingga serah terima.
          </p>
        </div>
      </section>

      <section className="py-24">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl mb-12">Nilai yang kami pegang</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v) => (
              <div key={v.title} className="p-8 rounded-lg border border-border bg-card">
                <v.icon className="h-6 w-6 text-primary mb-4" />
                <h3 className="text-xl mb-2">{v.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-secondary/40">
        <div className="container mx-auto px-6 max-w-3xl">
          <h2 className="text-3xl md:text-4xl mb-12">Perjalanan</h2>
          <ol className="relative border-l border-primary/30 pl-8 space-y-10">
            {timeline.map((t) => (
              <li key={t.y} className="relative">
                <span className="absolute -left-[42px] top-1 h-3 w-3 rounded-full bg-primary" />
                <div className="font-display text-3xl text-primary">{t.y}</div>
                <h3 className="text-xl mt-1">{t.t}</h3>
                <p className="text-muted-foreground mt-1">{t.d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </SiteLayout>
  );
}
