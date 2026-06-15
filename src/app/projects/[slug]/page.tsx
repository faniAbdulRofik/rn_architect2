"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Lightbulb, 
  MessageCircle,
  Building2,
  Award
} from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { MediaCarousel, type MediaSlide } from "@/components/site/MediaCarousel";
import { supabase } from "@/integrations/supabase/client";
import { waLink } from "@/lib/site";

type Project = {
  id: string;
  slug: string;
  title: string;
  category: string;
  location: string | null;
  year: number | null;
  duration: string | null;
  client: string | null;
  materials: string | null;
  concept: string | null;
  short_desc: string | null;
  description: string | null;
  images: string[];
  video_url: string | null;
  cover_image: string | null;
};

export default function ProjectDetail({ params }: { params: Promise<{ slug: string }> }) {
  const [p, setP] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    const loadProject = async () => {
      try {
        const resolvedParams = await params;
        console.log("Loading project with slug:", resolvedParams.slug);
        
        const { data, error } = await supabase
          .from("projects")
          .select("*")
          .eq("slug", resolvedParams.slug)
          .maybeSingle();

        console.log("Project query result:", { data, error });

        if (error) {
          console.error("Error loading project:", error);
          setMissing(true);
        } else if (!data) {
          console.log("No project found with slug:", resolvedParams.slug);
          setMissing(true);
        } else {
          console.log("Project loaded successfully:", data);
          setP(data as unknown as Project);
        }
      } catch (err) {
        console.error("Exception loading project:", err);
        setMissing(true);
      } finally {
        setLoading(false);
      }
    };

    loadProject();
  }, [params]);

  if (loading) {
    return (
      <SiteLayout>
        <div className="pt-32 container mx-auto px-6">
          <div className="h-96 bg-muted animate-pulse rounded-xl" />
        </div>
      </SiteLayout>
    );
  }
  
  if (missing || !p) {
    return (
      <SiteLayout>
        <div className="pt-40 pb-32 container mx-auto px-6 text-center">
          <div className="max-w-md mx-auto">
            <div className="h-20 w-20 rounded-full bg-muted grid place-items-center mx-auto mb-6">
              <Building2 className="h-10 w-10 text-muted-foreground" />
            </div>
            <h1 className="text-3xl font-bold mb-3">Proyek tidak ditemukan</h1>
            <p className="text-muted-foreground mb-6">
              Proyek yang Anda cari tidak tersedia atau telah dihapus dari portfolio kami.
            </p>
            <Link 
              href="/projects" 
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground hover:opacity-90 transition-smooth"
            >
              <ArrowLeft className="h-4 w-4" />
              Kembali ke portofolio
            </Link>
          </div>
        </div>
      </SiteLayout>
    );
  }

  const slides: MediaSlide[] = [
    ...(p.video_url
      ? [{ kind: "video" as const, src: p.video_url, poster: p.cover_image || p.images[0] }]
      : []),
    ...p.images.map((src) => ({ kind: "image" as const, src, alt: p.title })),
  ];
  const projectDescription = p.description || p.short_desc;

  const facts = [
    { icon: MapPin, label: "Lokasi", value: p.location },
    { icon: Calendar, label: "Tahun", value: p.year?.toString() },
    { icon: Clock, label: "Durasi", value: p.duration },
    { icon: User, label: "Client", value: p.client },
    { icon: Lightbulb, label: "Konsep", value: p.concept },
  ].filter((f) => f.value);

  return (
    <SiteLayout>
      {/* Back navigation */}
      <section className="pt-28 md:pt-20 pb-6">
        <div className="container mx-auto px-6 max-w-[96rem]">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground hover:border-primary/40 hover:text-primary transition-smooth"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Portofolio
          </Link>
        </div>
      </section>

      {/* Hero header */}
      <section className="pb-8">
        <div className="container mx-auto px-6 max-w-[96rem]">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <Award className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs font-medium tracking-wider uppercase text-primary">
              {p.category}
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold leading-tight">
            {p.title}
          </h1>
        </div>
      </section>

      {/* Gallery */}
      <section className="pb-8">
        <div className="container mx-auto px-6 max-w-[96rem]">
          <MediaCarousel
            slides={slides}
            title={p.title}
            frameClassName="h-[320px] sm:h-[420px] lg:h-[500px] xl:h-[560px]"
          />
        </div>
      </section>

      {projectDescription && (
        <section className="pb-12">
          <div className="container mx-auto px-6 max-w-[96rem]">
            <p className="text-lg md:text-2xl text-muted-foreground leading-relaxed text-justify">
              {projectDescription}
            </p>
          </div>
        </section>
      )}

      {/* Project Facts */}
      {facts.length > 0 && (
        <section className="py-6 bg-secondary/30 border-y border-border">
          <div className="container mx-auto px-6 max-w-[96rem]">
            <h2 className="text-sm uppercase tracking-widest text-muted-foreground mb-8">
              Detail Proyek
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-20">
              {facts.map((f) => (
                <div key={f.label} className="flex flex-col items-center text-center">
                  <div className="h-12 w-12 rounded-xl bg-primary/10 grid place-items-center">
                    <f.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="mt-4 w-full max-w-[14rem]">
                    <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1.5">
                      {f.label}
                    </div>
                    <div className="text-sm font-medium leading-snug text-balance">{f.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-10 bg-gradient-bamboo text-cream">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="text-center space-y-6">
            <div className="h-16 w-16 rounded-full bg-cream/20 backdrop-blur grid place-items-center mx-auto mb-4">
              <MessageCircle className="h-8 w-8" />
            </div>
            <h3 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold">
              Tertarik dengan pendekatan serupa?
            </h3>
            <p className="text-cream/90 text-lg max-w-2xl mx-auto leading-relaxed">
              Diskusikan kebutuhan proyek Anda dengan tim kami. Kami siap membantu mewujudkan 
              visi arsitektur dan interior impian Anda dengan pendekatan yang profesional dan personal.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <a
                href={waLink(`Halo RN_ARCHITECT, saya tertarik dengan proyek "${p.title}". Saya ingin konsultasi untuk proyek serupa.`)}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-cream text-bamboo-deep font-semibold hover:bg-bamboo-soft transition-smooth shadow-xl"
              >
                <MessageCircle className="h-5 w-5" />
                Mulai Konsultasi
              </a>
              <Link
                href="/projects"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full border-2 border-cream/30 text-cream font-semibold hover:bg-cream/10 transition-smooth"
              >
                Lihat Portfolio Lainnya
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Related Info */}
      <section className="py-10 border-t border-border">
        <div className="container mx-auto px-6 max-w-[96rem]">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="h-14 w-14 rounded-full bg-primary/10 grid place-items-center mx-auto mb-4">
                <Award className="h-7 w-7 text-primary" />
              </div>
              <h4 className="font-semibold mb-2">Kualitas Terjamin</h4>
              <p className="text-sm text-muted-foreground">
                Setiap proyek dikerjakan dengan standar kualitas tertinggi
              </p>
            </div>
            <div className="text-center p-6">
              <div className="h-14 w-14 rounded-full bg-primary/10 grid place-items-center mx-auto mb-4">
                <User className="h-7 w-7 text-primary" />
              </div>
              <h4 className="font-semibold mb-2">Tim Profesional</h4>
              <p className="text-sm text-muted-foreground">
                Arsitek dan desainer berpengalaman siap membantu Anda
              </p>
            </div>
            <div className="text-center p-6">
              <div className="h-14 w-14 rounded-full bg-primary/10 grid place-items-center mx-auto mb-4">
                <MessageCircle className="h-7 w-7 text-primary" />
              </div>
              <h4 className="font-semibold mb-2">Konsultasi Gratis</h4>
              <p className="text-sm text-muted-foreground">
                Diskusikan ide Anda tanpa biaya konsultasi awal
              </p>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
