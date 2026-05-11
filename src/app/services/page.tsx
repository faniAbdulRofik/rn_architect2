import { SiteLayout } from "@/components/site/SiteLayout";
import { waLink } from "@/lib/site";
import { Compass, Hammer, HomeIcon, Layers, MessageCircle, Sparkles } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Layanan — RN_ARCHITECT",
  description: "Desain arsitektur, interior, 3D visualization, dan supervisi pembangunan.",
  openGraph: {
    title: "Layanan — RN_ARCHITECT",
  },
};

const services = [
  {
    icon: Compass,
    title: "Desain Arsitektur",
    desc: "Perancangan rumah tinggal, vila, dan ruang komersial — dari konsep hingga gambar kerja siap bangun.",
    steps: ["Brief & site analysis", "Konsep desain", "Skematik & DED", "Gambar kerja"],
  },
  {
    icon: HomeIcon,
    title: "Interior Design",
    desc: "Konsep interior menyeluruh: layout, palet material, furnitur custom, lighting, dan styling.",
    steps: ["Mood & layout", "Material board", "Render 3D", "Procurement & install"],
  },
  {
    icon: Layers,
    title: "3D Visualization",
    desc: "Render fotorealistis untuk membantu Anda 'merasakan' ruang sebelum dibangun.",
    steps: ["Modeling", "Texturing & lighting", "Render final", "Walkthrough video"],
  },
  {
    icon: Hammer,
    title: "Build Supervision",
    desc: "Pengawasan pembangunan agar hasil sesuai dengan dokumen desain dan standar kualitas.",
    steps: ["Pemilihan kontraktor", "Site visit berkala", "Quality control", "Serah terima"],
  },
  {
    icon: Sparkles,
    title: "Konsultasi Desain",
    desc: "Sesi 1-on-1 untuk meninjau rencana, memberi arah desain, atau membantu pengambilan keputusan.",
    steps: ["Sesi diskusi", "Review denah", "Rekomendasi material", "Action plan"],
  },
];

export default function ServicesPage() {
  return (
    <SiteLayout>
      <section className="pt-40 pb-20 bg-gradient-warm">
        <div className="container mx-auto px-6 max-w-4xl">
          <p className="text-xs tracking-[0.3em] uppercase text-primary mb-4">Layanan</p>
          <h1 className="text-5xl md:text-7xl text-balance leading-tight">
            Dari ide pertama hingga <em className="text-primary not-italic">kunci diserahkan</em>.
          </h1>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-6 space-y-6">
          {services.map((s, i) => (
            <article
              key={s.title}
              className="grid md:grid-cols-12 gap-8 p-8 md:p-12 rounded-lg bg-card border border-border hover:shadow-soft transition-smooth"
            >
              <div className="md:col-span-1">
                <div className="h-12 w-12 rounded-md bg-primary/10 grid place-items-center text-primary">
                  <s.icon className="h-5 w-5" />
                </div>
                <div className="text-xs text-muted-foreground mt-3">0{i + 1}</div>
              </div>
              <div className="md:col-span-5">
                <h2 className="text-3xl mb-3">{s.title}</h2>
                <p className="text-muted-foreground leading-relaxed">{s.desc}</p>
                <a
                  href={waLink(`Halo, saya tertarik dengan layanan: ${s.title}`)}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 mt-6 text-primary text-sm hover:gap-3 transition-smooth"
                >
                  <MessageCircle className="h-4 w-4" /> Diskusikan via WhatsApp
                </a>
              </div>
              <div className="md:col-span-6">
                <p className="text-xs uppercase tracking-widest text-muted-foreground mb-4">Proses kerja</p>
                <ol className="space-y-3">
                  {s.steps.map((step, idx) => (
                    <li key={step} className="flex gap-3 items-start">
                      <span className="font-display text-primary text-xl leading-none w-6">{idx + 1}</span>
                      <span className="text-foreground">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </article>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
