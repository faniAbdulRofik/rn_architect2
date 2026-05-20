"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { supabase } from "@/integrations/supabase/client";
import { resolveAsset } from "@/lib/assets";

type Project = {
  id: string;
  slug: string;
  title: string;
  category: string;
  location: string | null;
  year: number | null;
  cover_image: string | null;
  images: string[];
  is_featured: boolean;
};

export default function ProjectsPage() {
  const [items, setItems] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [c, setC] = useState("Semua");

  useEffect(() => {
    supabase
      .from("projects")
      .select("id,slug,title,category,location,year,cover_image,images,is_featured")
      .eq("status", "published")
      .order("is_featured", { ascending: false })
      .order("year", { ascending: false })
      .then(({ data }) => {
        setItems((data ?? []) as Project[]);
        setLoading(false);
      });
  }, []);

  const cats = useMemo(
    () => ["Semua", ...Array.from(new Set(items.map((p) => p.category)))],
    [items]
  );
  const list = c === "Semua" ? items : items.filter((p) => p.category === c);

  return (
    <SiteLayout>
      <section className="pt-32 md:pt-20 pb-10 bg-gradient-warm">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <h1 className="text-4xl md:text-6xl text-balance leading-tight">
            Proyek terpilih
          </h1>
        </div>
      </section>

      <div className="sticky top-14 md:top-16 z-30 bg-background/90 backdrop-blur border-b border-border/70">
        <div className="container mx-auto px-6 py-4 flex flex-wrap gap-3">
          {cats.map((cat) => (
            <button
              key={cat}
              onClick={() => setC(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-smooth whitespace-nowrap ${c === cat
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary/70 hover:bg-secondary text-foreground/80"
                }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <section className="py-8">
        <div className="container mx-auto px-6">
          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="aspect-square bg-muted animate-pulse rounded-lg" />
              ))}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {list.map((p) => (
                <Link
                  key={p.id}
                  href={`/projects/${p.slug}`}
                  className="group block rounded-lg overflow-hidden bg-card border border-border hover:shadow-elegant transition-smooth"
                >
                  <div className="aspect-square overflow-hidden bg-muted relative">
                    <img
                      src={resolveAsset(p.cover_image || p.images[0])}
                      alt={p.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition-smooth group-hover:scale-105"
                    />
                    {p.is_featured && (
                      <span className="absolute top-3 left-3 text-[10px] uppercase tracking-widest bg-bamboo-soft text-bamboo-deep px-2 py-1 rounded">
                        Featured
                      </span>
                    )}
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
                      <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-smooth" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </SiteLayout>
  );
}
