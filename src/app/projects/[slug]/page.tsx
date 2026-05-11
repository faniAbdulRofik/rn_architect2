"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, Calendar, Clock, MapPin, User, Layers, Lightbulb, MessageCircle } from "lucide-react";
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

export default function ProjectDetail({ params }: { params: { slug: string } }) {
  const [p, setP] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    supabase
      .from("projects")
      .select("*")
      .eq("slug", params.slug)
      .maybeSingle()
      .then(({ data }) => {
        if (!data) setMissing(true);
        else setP(data as unknown as Project);
        setLoading(false);
      });
  }, [params.slug]);

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
          <h1 className="text-3xl mb-2">Proyek tidak ditemukan</h1>
          <Link href="/projects" className="text-primary">Kembali ke portofolio</Link>
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

  const facts = [
    { icon: MapPin, label: "Lokasi", value: p.location },
    { icon: Calendar, label: "Tahun", value: p.year?.toString() },
    { icon: Clock, label: "Durasi", value: p.duration },
    { icon: User, label: "Client", value: p.client },
    { icon: Layers, label: "Material", value: p.materials },
    { icon: Lightbulb, label: "Konsep", value: p.concept },
  ].filter((f) => f.value);

  return (
    <SiteLayout>
      {/* Hero header */}
      <section className="pt-28 md:pt-36 pb-10">
        <div className="container mx-auto px-6 max-w-5xl">
          <Link
            href="/projects"
            className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-muted-foreground hover:text-primary transition-smooth"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Portofolio
          </Link>
          <p className="mt-6 text-xs tracking-[0.3em] uppercase text-primary mb-3">{p.category}</p>
          <h1 className="text-4xl md:text-6xl text-balance leading-tight">{p.title}</h1>
          {p.short_desc && (
            <p className="mt-5 text-lg text-muted-foreground max-w-2xl leading-relaxed">
              {p.short_desc}
            </p>
          )}
        </div>
      </section>

      <section className="pb-16">
        <div className="container mx-auto px-6 max-w-6xl">
          <MediaCarousel slides={slides} title={p.title} />
        </div>
      </section>

      {/* Facts strip */}
      <section className="py-12 bg-secondary/40 border-y border-border">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {facts.map((f) => (
              <div key={f.label}>
                <div className="flex items-center gap-2 text-primary mb-2">
                  <f.icon className="h-4 w-4" />
                  <span className="text-[10px] uppercase tracking-widest">{f.label}</span>
                </div>
                <div className="text-sm font-medium">{f.value}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Storytelling */}
      {p.description && (
        <section className="py-20">
          <div className="container mx-auto px-6 max-w-3xl">
            <h2 className="text-3xl md:text-4xl mb-6 text-balance">Cerita di balik proyek</h2>
            <p className="text-lg text-muted-foreground leading-relaxed whitespace-pre-line">
              {p.description}
            </p>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="pb-24">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="rounded-2xl bg-gradient-bamboo text-cream p-10 md:p-14 text-center shadow-elegant">
            <h3 className="font-display text-2xl md:text-3xl mb-4">
              Tertarik dengan pendekatan serupa?
            </h3>
            <p className="text-cream/80 max-w-xl mx-auto mb-6">
              Diskusikan kebutuhan proyek Anda — kami bantu merumuskan langkah pertamanya.
            </p>
            <a
              href={waLink(`Halo RN_ARCHITECT, saya tertarik dengan proyek "${p.title}".`)}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-cream text-bamboo-deep font-medium hover:bg-bamboo-soft transition-smooth"
            >
              <MessageCircle className="h-4 w-4" /> Mulai konsultasi
            </a>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
