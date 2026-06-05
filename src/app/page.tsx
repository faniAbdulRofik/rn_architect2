import Link from "next/link";
import { ArrowRight, Award, Compass, Hammer, Home as HomeIcon, Layers, MessageCircle, Sparkles } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { waLink } from "@/lib/site";
import { supabase } from "@/integrations/supabase/client";
import { resolveAsset } from "@/lib/assets";
import hero from "@/assets/hero-architecture.jpg";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;

const services = [
  { icon: Compass, title: "Desain Arsitektur", desc: "Perancangan rumah, vila, dan ruang komersial dengan pendekatan kontekstual." },
  { icon: HomeIcon, title: "Interior Design", desc: "Konsep interior menyeluruh — dari layout, material, hingga styling." },
  { icon: Layers, title: "3D Visualization", desc: "Render fotorealistis untuk membantu Anda 'merasakan' ruang sebelum dibangun." },
  { icon: Hammer, title: "Build & Supervision", desc: "Pengawasan pembangunan agar hasil sesuai dengan visi desain." },
];

const stats = [
  { v: "120+", l: "Proyek Selesai" },
  { v: "12", l: "Tahun Pengalaman" },
  { v: "100%", l: "Klien Puas" },
  { v: "24", l: "Penghargaan" },
];

const testimonials = [
  { name: "Andini & Reza", role: "Pemilik Rumah, Bandung", quote: "Hasilnya melampaui ekspektasi. Setiap sudut rumah terasa dipikirkan dengan hati." },
  { name: "PT. Lentera Karya", role: "Klien Korporat", quote: "Profesional, detail, dan komunikatif. Kami percayakan tiga proyek kantor kami." },
  { name: "Bu Maya", role: "Interior Custom", quote: "Lemari custom-nya jadi favorit di rumah. Material dan finishing kelas premium." },
];

export default async function HomePage() {
  // Load featured projects and products from database
  const { data: featuredProjects } = await supabase
    .from("projects")
    .select("slug, title, category, location, year, cover_image, images")
    .eq("status", "published")
    .eq("is_featured", true)
    .order("created_at", { ascending: false })
    .limit(2);

  const { data: featuredProducts } = await supabase
    .from("products")
    .select("slug, title, category, images, price_label")
    .eq("status", "published")
    .eq("is_featured", true)
    .order("created_at", { ascending: false })
    .limit(3);

  return (
    <SiteLayout>
      {/* HERO with autoplay video */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          poster={hero.src}
          preload="metadata"
          className="absolute inset-0 h-full w-full object-cover"
        >
          <source src="/videos/hero.mp4" type="video/mp4" />
        </video>
        <img
          src={hero.src}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover -z-10"
        />
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="absolute inset-0 bg-black/35" />

        <div className="relative container mx-auto px-6 text-cream">
          <p className="reveal text-xs tracking-[0.3em] uppercase text-bamboo-soft mb-6">
            Studio Arsitektur · Est. 2013
          </p>
          <h1 className="reveal reveal-delay-1 font-display text-5xl md:text-7xl lg:text-7xl max-w-4xl text-balance leading-[1.05]">
            Ruang yang tenang, <em className="text-bamboo-soft not-italic">tahan waktu</em>.
          </h1>
          <p className="reveal reveal-delay-2 mt-6 max-w-xl text-cream/85 text-lg">
            Kami merancang arsitektur dan interior yang berakar pada konteks, material yang jujur,
            dan kehidupan yang Anda jalani setiap hari.
          </p>
          <div className="reveal reveal-delay-3 mt-10 flex flex-wrap gap-4">
            <a
              href={waLink("Halo RN_ARCHITECT, saya ingin berkonsultasi proyek.")}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-bamboo-soft text-bamboo-deep font-medium hover:bg-cream transition-smooth"
            >
              <MessageCircle className="h-4 w-4" /> Hubungi via WhatsApp
            </a>
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full border border-cream/40 text-cream hover:bg-cream/10 transition-smooth"
            >
              Lihat Portofolio <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="reveal reveal-delay-4 mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl">
            {stats.map((s) => (
              <div key={s.l}>
                <div className="font-display text-4xl md:text-5xl text-cream">{s.v}</div>
                <div className="text-xs uppercase tracking-widest text-cream/70 mt-1">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PHILOSOPHY */}
      <section className="py-10 bg-gradient-warm">
        <div className="container mx-auto px-6 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <p className="text-xs tracking-[0.3em] uppercase text-primary mb-4">Filosofi</p>
            <h2 className="text-4xl md:text-5xl text-balance leading-tight">
              Desain bukan tentang gaya — tentang <em className="text-primary not-italic">cara hidup</em>.
            </h2>
          </div>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Setiap proyek dimulai dari mendengarkan. Kami percaya rumah dan ruang kerja terbaik
            adalah yang lahir dari kebiasaan, ritme, dan harapan penghuninya — bukan dari tren
            sesaat.
          </p>
        </div>
      </section>

      {/* SERVICES */}
      <section className="py-10">
        <div className="container mx-auto px-6">
          <div className="flex flex-wrap items-end justify-between gap-6 mb-9">
            <div>
              <p className="text-xs tracking-[0.3em] uppercase text-primary mb-3">Layanan</p>
              <h2 className="text-4xl md:text-5xl">Apa yang kami kerjakan</h2>
            </div>
            <Link href="/services" className="text-sm text-primary inline-flex items-center gap-1 hover:gap-2 transition-smooth">
              Semua layanan <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((s) => (
              <div key={s.title} className="group p-8 rounded-lg bg-card border border-border hover:border-primary/40 hover:shadow-soft transition-smooth">
                <div className="h-12 w-12 rounded-md bg-primary/10 grid place-items-center text-primary mb-5 group-hover:bg-primary group-hover:text-primary-foreground transition-smooth">
                  <s.icon className="h-5 w-5" />
                </div>
                <h3 className="text-xl mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROJECTS */}
      <section className="py-10 bg-secondary/40">
        <div className="container mx-auto px-6">
          <div className="flex flex-wrap items-end justify-between gap-6 mb-9">
            <div>
              <p className="text-xs tracking-[0.3em] uppercase text-primary mb-3">Portofolio</p>
              <h2 className="text-4xl md:text-5xl">Proyek terpilih</h2>
            </div>
            <Link href="/projects" className="text-sm text-primary inline-flex items-center gap-1 hover:gap-2 transition-smooth">
              Lihat semua <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProjects && featuredProjects.length > 0 ? (
              featuredProjects.map((p) => (
                <Link
                  key={p.slug}
                  href={`/projects/${p.slug}`}
                  className="group block rounded-lg overflow-hidden bg-card border border-border hover:shadow-elegant transition-smooth"
                >
                  <div className="aspect-square overflow-hidden bg-muted">
                    <img
                      src={resolveAsset(p.cover_image || p.images[0])}
                      alt={p.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition-smooth group-hover:scale-105"
                    />
                  </div>
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="text-lg leading-snug">{p.title}</h3>
                        <p className="text-xs text-muted-foreground mt-1">
                          {p.category}
                          {p.location ? ` · ${p.location}` : ""}
                          {p.year ? ` · ${p.year}` : ""}
                        </p>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-smooth" />
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="col-span-3 text-center py-12 text-muted-foreground">
                Belum ada proyek featured
              </div>
            )}
          </div>
        </div>
      </section>

      {/* PRODUCTS */}
      <section className="py-10">
        <div className="container mx-auto px-6">
          <div className="flex flex-wrap items-end justify-between gap-6 mb-9">
            <div>
              <p className="text-xs tracking-[0.3em] uppercase text-primary mb-3">Katalog</p>
              <h2 className="text-4xl md:text-5xl">Produk interior custom</h2>
            </div>
            <Link href="/products" className="text-sm text-primary inline-flex items-center gap-1 hover:gap-2 transition-smooth">
              Lihat katalog <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts && featuredProducts.length > 0 ? (
              featuredProducts.map((p) => (
                <Link
                  key={p.slug}
                  href={`/products/${p.slug}`}
                  className="group block rounded-lg overflow-hidden bg-card border border-border hover:shadow-elegant transition-smooth"
                >
                  <div className="aspect-square bg-muted overflow-hidden">
                    {p.images[0] && (
                      <img
                        src={resolveAsset(p.images[0])}
                        alt={p.title}
                        loading="lazy"
                        className="h-full w-full object-cover transition-smooth group-hover:scale-105"
                      />
                    )}
                  </div>
                  <div className="p-5 flex items-center justify-between">
                    <div>
                      <h3 className="text-lg">{p.title}</h3>
                      <span className="text-xs text-primary">
                      </span>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-smooth" />
                  </div>
                </Link>
              ))
            ) : (
              <div className="col-span-3 text-center py-12 text-muted-foreground">
                Belum ada produk featured
              </div>
            )}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-10 bg-bamboo-deep text-cream">
        <div className="container mx-auto px-6">
          <p className="text-xs tracking-[0.3em] uppercase text-bamboo-soft mb-3">Testimoni</p>
          <h2 className="text-4xl md:text-5xl mb-14 max-w-2xl">Apa kata mereka</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t) => (
              <figure key={t.name} className="border-l-2 border-bamboo-soft pl-6">
                <Sparkles className="h-5 w-5 text-bamboo-soft mb-4" />
                <blockquote className="font-display text-xl leading-snug text-cream/95">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-5 text-sm text-cream/70">
                  <span className="text-cream">{t.name}</span> — {t.role}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container mx-auto px-40">
          <div className="rounded-2xl bg-gradient-bamboo text-primary-foreground p-12 md:p-20 text-center shadow-elegant">
            <Award className="h-10 w-10 mx-auto mb-6 text-bamboo-soft" />
            <h2 className="text-4xl md:text-5xl text-cream max-w-3xl mx-auto text-balance">
              Mari rancang ruang yang Anda layak tinggali.
            </h2>
            <p className="mt-5 text-cream/80 max-w-xl mx-auto">
              Konsultasi awal gratis — ceritakan kebutuhan Anda, kami bantu petakan langkahnya.
            </p>
            <a
              href={waLink("Halo RN_ARCHITECT, saya ingin konsultasi gratis.")}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 mt-8 px-8 py-4 rounded-full bg-cream text-bamboo-deep font-medium hover:bg-bamboo-soft transition-smooth"
            >
              <MessageCircle className="h-5 w-5" /> Mulai konsultasi
            </a>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
