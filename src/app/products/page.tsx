"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowUpRight, Search } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { supabase } from "@/integrations/supabase/client";
import { resolveAsset } from "@/lib/assets";

type Product = {
  id: string;
  slug: string;
  title: string;
  category: string;
  material: string | null;
  price_label: string | null;
  images: string[];
  is_featured: boolean;
};

export default function ProductsPage() {
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [cat, setCat] = useState("Semua");
  const [q, setQ] = useState("");

  useEffect(() => {
    supabase
      .from("products")
      .select("id,slug,title,category,material,price_label,images,is_featured")
      .eq("status", "published")
      .order("is_featured", { ascending: false })
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setItems((data ?? []) as Product[]);
        setLoading(false);
      });
  }, []);

  const categories = useMemo(
    () => ["Semua", ...Array.from(new Set(items.map((p) => p.category)))],
    [items]
  );

  const filtered = items.filter((p) => {
    const matchCat = cat === "Semua" || p.category === cat;
    const matchQ = q === "" || p.title.toLowerCase().includes(q.toLowerCase());
    return matchCat && matchQ;
  });

  return (
    <SiteLayout>
      <section className="pt-32 md:pt-36 pb-10 bg-gradient-warm">
        <div className="container mx-auto px-6 max-w-4xl">
          <p className="text-xs tracking-[0.3em] uppercase text-primary mb-3">Katalog</p>
          <h1 className="text-4xl md:text-6xl text-balance leading-tight">Produk interior custom</h1>
          <p className="mt-5 text-muted-foreground max-w-xl">
            Setiap produk dapat dipesan custom sesuai dimensi, material, dan finishing.
          </p>
        </div>
      </section>

      {/* COMPACT STICKY FILTER */}
      <div className="sticky top-14 md:top-16 z-30 bg-background/90 backdrop-blur border-b border-border/70">
        <div className="container mx-auto px-6 py-2.5 flex flex-wrap gap-2 items-center justify-between">
          <div className="flex flex-wrap gap-1.5 -mx-1 overflow-x-auto no-scrollbar">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-smooth whitespace-nowrap ${
                  cat === c
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary/70 text-foreground/80 hover:bg-secondary"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
          <div className="relative w-full sm:w-60">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Cari produk…"
              className="w-full pl-8 pr-3 py-1.5 rounded-full border border-input bg-background text-xs focus:outline-none focus:ring-2 focus:ring-ring/50"
            />
          </div>
        </div>
      </div>

      <section className="py-12 md:py-16">
        <div className="container mx-auto px-6">
          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="aspect-square bg-muted animate-pulse rounded-lg" />
              ))}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((p) => (
                <Link
                  key={p.id}
                  href={`/products/${p.slug}`}
                  className="group block rounded-lg overflow-hidden bg-card border border-border hover:shadow-elegant transition-smooth"
                >
                  <div className="aspect-square overflow-hidden bg-muted">
                    <img
                      src={resolveAsset(p.images[0])}
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
                          {p.material ? ` · ${p.material}` : ""}
                        </p>
                      </div>
                      <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-smooth" />
                    </div>
                    {p.price_label && (
                      <p className="mt-3 text-sm font-medium text-primary">{p.price_label}</p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
          {!loading && filtered.length === 0 && (
            <p className="text-center text-muted-foreground py-20">
              Tidak ada produk yang cocok dengan pencarian.
            </p>
          )}
        </div>
      </section>
    </SiteLayout>
  );
}
