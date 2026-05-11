import { useState } from "react";
import { ChevronLeft, ChevronRight, PlayCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { resolveAsset } from "@/lib/assets";

export type MediaSlide =
  | { kind: "image"; src: string; alt: string }
  | { kind: "video"; src: string; poster?: string };

export function MediaCarousel({ slides, title }: { slides: MediaSlide[]; title: string }) {
  const [i, setI] = useState(0);
  if (slides.length === 0) return null;
  const cur = slides[i];
  const go = (n: number) => setI((n + slides.length) % slides.length);

  return (
    <div className="grid gap-4">
      <div className="relative aspect-[4/3] md:aspect-[16/11] overflow-hidden rounded-xl bg-muted shadow-soft">
        {cur.kind === "image" ? (
          <img
            src={resolveAsset(cur.src)}
            alt={cur.alt || title}
            className="h-full w-full object-cover animate-fade-in"
            loading="eager"
          />
        ) : (
          <video
            key={cur.src}
            src={cur.src}
            poster={cur.poster ? resolveAsset(cur.poster) : undefined}
            controls
            playsInline
            className="h-full w-full object-cover bg-black"
          />
        )}

        {slides.length > 1 && (
          <>
            <button
              aria-label="Sebelumnya"
              onClick={() => go(i - 1)}
              className="absolute left-3 top-1/2 -translate-y-1/2 h-10 w-10 grid place-items-center rounded-full bg-background/80 backdrop-blur hover:bg-background transition-smooth"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              aria-label="Berikutnya"
              onClick={() => go(i + 1)}
              className="absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 grid place-items-center rounded-full bg-background/80 backdrop-blur hover:bg-background transition-smooth"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-background/70 backdrop-blur text-xs">
              {i + 1} / {slides.length}
            </div>
          </>
        )}
      </div>

      {slides.length > 1 && (
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {slides.map((s, idx) => (
            <button
              key={idx}
              onClick={() => setI(idx)}
              className={cn(
                "relative shrink-0 h-16 w-20 md:h-20 md:w-28 rounded-md overflow-hidden border transition-smooth",
                idx === i ? "border-primary ring-2 ring-primary/30" : "border-border opacity-70 hover:opacity-100"
              )}
            >
              {s.kind === "image" ? (
                <img src={resolveAsset(s.src)} alt="" className="h-full w-full object-cover" />
              ) : (
                <div className="h-full w-full bg-bamboo-deep grid place-items-center text-cream">
                  <PlayCircle className="h-6 w-6" />
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
