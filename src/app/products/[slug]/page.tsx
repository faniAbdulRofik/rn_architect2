"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { 
  ArrowLeft, 
  MessageCircle, 
  Ruler, 
  Layers, 
  Tag, 
  ShieldCheck,
  Package,
  Sparkles,
  CheckCircle2
} from "lucide-react";
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

export default function ProductDetail({ params }: { params: Promise<{ slug: string }> }) {
  const [p, setP] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const resolvedParams = await params;
        console.log("Loading product with slug:", resolvedParams.slug);
        
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .eq("slug", resolvedParams.slug)
          .maybeSingle();

        console.log("Product query result:", { data, error });

        if (error) {
          console.error("Error loading product:", error);
          setMissing(true);
        } else if (!data) {
          console.log("No product found with slug:", resolvedParams.slug);
          setMissing(true);
        } else {
          console.log("Product loaded successfully:", data);
          setP(data as unknown as Product);
        }
      } catch (err) {
        console.error("Exception loading product:", err);
        setMissing(true);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
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
              <Package className="h-10 w-10 text-muted-foreground" />
            </div>
            <h1 className="text-3xl font-bold mb-3">Produk tidak ditemukan</h1>
            <p className="text-muted-foreground mb-6">
              Produk yang Anda cari tidak tersedia atau telah dihapus.
            </p>
            <Link 
              href="/products" 
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground hover:opacity-90 transition-smooth"
            >
              <ArrowLeft className="h-4 w-4" />
              Kembali ke katalog
            </Link>
          </div>
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

  const features = [
    "Desain custom sesuai kebutuhan",
    "Material berkualitas premium",
    "Garansi kualitas produk",
    "Konsultasi gratis dengan desainer",
  ];

  return (
    <SiteLayout>
      {/* Breadcrumb */}
      <section className="pt-28 md:pt-32 pb-6">
        <div className="container mx-auto px-6">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-primary transition-smooth">Home</Link>
            <span>/</span>
            <Link href="/products" className="hover:text-primary transition-smooth">Produk</Link>
            <span>/</span>
            <span className="text-foreground">{p.title}</span>
          </div>
        </div>
      </section>

      {/* Product Detail */}
      <section className="pb-16">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 max-w-7xl mx-auto">
            {/* Gallery */}
            <div className="lg:sticky lg:top-28 lg:self-start">
              <MediaCarousel slides={slides} title={p.title} />
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              {/* Category Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                <span className="text-xs font-medium tracking-wider uppercase text-primary">
                  {p.category}
                </span>
              </div>

              {/* Title */}
              <div>
                <h1 className="text-3xl md:text-5xl font-bold text-balance leading-tight mb-3">
                  {p.title}
                </h1>
                {p.short_desc && (
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    {p.short_desc}
                  </p>
                )}
              </div>

              

              {/* Quick Info */}
              <div className="grid sm:grid-cols-2 gap-3">
                {p.material && (
                  <InfoCard icon={Layers} label="Material" value={p.material} />
                )}
                {p.dimensions && (
                  <InfoCard icon={Ruler} label="Dimensi" value={p.dimensions} />
                )}
                <InfoCard 
                  icon={ShieldCheck} 
                  label="Kustomisasi" 
                  value="Tersedia" 
                />
                <InfoCard 
                  icon={Package} 
                  label="Pengiriman" 
                  value="Seluruh Indonesia" 
                />
              </div>

              {/* Features */}
              <div className="bg-secondary/40 rounded-xl p-6 space-y-3">
                <h3 className="font-semibold text-sm uppercase tracking-wider mb-4">
                  Keunggulan Produk
                </h3>
                {features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-sm text-muted-foreground">{feature}</span>
                  </div>
                ))}
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <a
                  href={waLink(`Halo RN_ARCHITECT, saya tertarik dengan produk: ${p.title}`)}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-primary text-primary-foreground font-medium hover:opacity-90 transition-smooth shadow-lg shadow-primary/20"
                >
                  <MessageCircle className="h-5 w-5" />
                  Pesan via WhatsApp
                </a>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl border-2 border-border hover:bg-secondary transition-smooth font-medium"
                >
                  Konsultasi Gratis
                </Link>
              </div>

              {/* Trust Badge */}
              <div className="flex items-center gap-3 text-sm text-muted-foreground pt-4">
                <ShieldCheck className="h-5 w-5 text-primary" />
                <span>Garansi kepuasan pelanggan • Konsultasi gratis • Pengerjaan profesional</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      
    </SiteLayout>
  );
}

function InfoCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Ruler;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3 p-4 rounded-lg border border-border bg-card hover:border-primary/30 transition-smooth">
      <div className="h-10 w-10 rounded-lg bg-primary/10 grid place-items-center shrink-0">
        <Icon className="h-5 w-5 text-primary" />
      </div>
      <div className="min-w-0">
        <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">
          {label}
        </div>
        <div className="text-sm font-medium">{value}</div>
      </div>
    </div>
  );
}
