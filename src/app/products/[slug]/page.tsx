"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, MessageCircle, Ruler, Layers, Tag, ShieldCheck } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { MediaCarousel, type MediaSlide } from "@/components/site/MediaCarousel";
import { supabase } from "@/integrations/supabase/client";
import { waLink } from "@/lib/site";

type Spec = { label: string; value: string };
type Product = {
  id: string;
  slug: string;
  title: string;
  category: string;
  material: string | null;
  dimensions: string | null;
  price_label: string | null;
  short_desc: string | null;
  description: string | null;
  specs: Spec[];
  images: string[];
  video_url: string | null;
};

export default function ProductDetail({ params }: { params: { slug: string } }) {
  const [p, setP] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    supabase
      .from("products")
      .select("*")
      .eq("slug", params.slug)
      .maybeSingle()
      .then(({ data }) => {
        if (!data) setMissing(true);
        else setP(data as unknown as Product);
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
          <h1 className="text-3xl mb-2">Produk tidak ditemukan</h1>
          <Link href="/products" className="text-primary">Kembali ke katalog</Link>
        </div>
      </SiteLayout>
    );
  }

  const slides: MediaSlide[] = [
    ...(p.video_url
      ? [{ kind: "video" as const, src: p.video_url, poster: p.images[0] }]
      : []),
    ...p.images.map((src) => ({ kind: "image" as const, src, alt: p.title })),
  ];

  return (
    <SiteLayout>
      <section className="pt-28 md:pt-32 pb-6">
        <div className="container mx-auto px-6">
          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-muted-foreground hover:text-primary transition-smooth"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Kembali ke katalog
          </Link>
        </div>
      </section>

      <section className="pb-20">
        <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-10 lg:gap-16">
          <MediaCarousel slides={slides} title={p.title} />

          <div className="lg:pt-2">
            <p className="text-xs tracking-[0.3em] uppercase text-primary mb-3">{p.category}</p>
            <h1 className="text-3xl md:text-5xl text-balance leading-tight">{p.title}</h1>
            {p.short_desc && (
              <p className="mt-4 text-muted-foreground leading-relaxed">{p.short_desc}</p>
            )}

            {p.price_label && (
              <div className="mt-6 inline-flex items-center gap-3 px-5 py-3 rounded-lg bg-primary/5 border border-primary/20">
                <Tag className="h-4 w-4 text-primary" />
                <span className="font-display text-2xl text-primary">{p.price_label}</span>
              </div>
            )}

            <div className="mt-8 grid sm:grid-cols-2 gap-3">
              {p.material && <InfoRow icon={Layers} label="Material" value={p.material} />}
              {p.dimensions && <InfoRow icon={Ruler} label="Dimensi" value={p.dimensions} />}
              <InfoRow icon={ShieldCheck} label="Custom" value="Tersedia sesuai kebutuhan" />
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={waLink(`Halo RN_ARCHITECT, saya tertarik dengan produk: ${p.title}`)}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-primary text-primary-foreground hover:opacity-90 transition-smooth"
              >
                <MessageCircle className="h-4 w-4" /> Pesan via WhatsApp
              </a>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full border border-border hover:bg-secondary transition-smooth"
              >
                Tanya detail
              </Link>
            </div>
          </div>
        </div>
      </section>

      {(p.description || p.specs.length > 0) && (
        <section className="py-16 bg-secondary/40 border-t border-border">
          <div className="container mx-auto px-6 grid md:grid-cols-3 gap-12">
            {p.description && (
              <div className="md:col-span-2">
                <h2 className="text-2xl mb-4">Deskripsi</h2>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                  {p.description}
                </p>
              </div>
            )}
            {p.specs.length > 0 && (
              <div>
                <h2 className="text-2xl mb-4">Spesifikasi</h2>
                <dl className="divide-y divide-border rounded-lg bg-card border border-border overflow-hidden">
                  {p.specs.map((s) => (
                    <div key={s.label} className="flex items-start justify-between gap-4 px-4 py-3">
                      <dt className="text-xs uppercase tracking-widest text-muted-foreground">
                        {s.label}
                      </dt>
                      <dd className="text-sm text-right">{s.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}
          </div>
        </section>
      )}
    </SiteLayout>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Ruler;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3 p-4 rounded-lg border border-border bg-card">
      <Icon className="h-4 w-4 text-primary mt-0.5" />
      <div>
        <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</div>
        <div className="text-sm">{value}</div>
      </div>
    </div>
  );
}
