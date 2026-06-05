import { useCallback, useState, useRef, useEffect, type CSSProperties } from "react";
import { createPortal } from "react-dom";
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  PlayCircle,
  RotateCcw,
  X,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { fallbackHero, resolveAsset } from "@/lib/assets";

export type MediaSlide =
  | { kind: "image"; src: string; alt: string }
  | { kind: "video"; src: string; poster?: string };

// Helper function to detect and convert YouTube URL to embed URL
function getYouTubeEmbedUrl(url: string): string | null {
  // Extract video ID from various YouTube URL formats
  let videoId: string | null = null;
  
  // Pattern 1: youtu.be/VIDEO_ID (with or without query params)
  const shortMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
  if (shortMatch) {
    videoId = shortMatch[1];
  }
  
  // Pattern 2: youtube.com/watch?v=VIDEO_ID
  if (!videoId) {
    const watchMatch = url.match(/youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/);
    if (watchMatch) {
      videoId = watchMatch[1];
    }
  }
  
  // Pattern 3: youtube.com/embed/VIDEO_ID
  if (!videoId) {
    const embedMatch = url.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/);
    if (embedMatch) {
      videoId = embedMatch[1];
    }
  }
  
  // Pattern 4: youtube.com/shorts/VIDEO_ID
  if (!videoId) {
    const shortsMatch = url.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/);
    if (shortsMatch) {
      videoId = shortsMatch[1];
    }
  }

  if (videoId) {
    // Return embed URL with autoplay, mute, and loop parameters
    return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&rel=0&modestbranding=1`;
  }

  return null;
}

// Helper function to check if URL is a YouTube video
function isYouTubeUrl(url: string): boolean {
  return url.includes('youtube.com') || url.includes('youtu.be');
}

function ResolvedImage({
  src,
  alt,
  className,
  loading,
  draggable,
  onClick,
  style,
}: {
  src: string;
  alt: string;
  className?: string;
  loading?: "eager" | "lazy";
  draggable?: boolean;
  onClick?: () => void;
  style?: CSSProperties;
}) {
  const resolvedSrc = resolveAsset(src);
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const displaySrc = failedSrc === resolvedSrc ? fallbackHero.src : resolvedSrc;

  return (
    <img
      src={displaySrc}
      alt={alt}
      className={className}
      loading={loading}
      draggable={draggable}
      onClick={onClick}
      style={style}
      onError={() => {
        setFailedSrc(resolvedSrc);
      }}
    />
  );
}

function ImageLightbox({
  images,
  initialIndex,
  title,
  onClose,
}: {
  images: Extract<MediaSlide, { kind: "image" }>[];
  initialIndex: number;
  title: string;
  onClose: () => void;
}) {
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const [zoom, setZoom] = useState(1);
  const active = images[activeIndex] ?? images[0];

  const go = useCallback((index: number) => {
    setActiveIndex((index + images.length) % images.length);
    setZoom(1);
  }, [images.length]);

  const adjustZoom = (amount: number) => {
    setZoom((current) => Math.min(3, Math.max(1, Number((current + amount).toFixed(2)))));
  };

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft") go(activeIndex - 1);
      if (event.key === "ArrowRight") go(activeIndex + 1);
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [activeIndex, go, onClose]);

  if (!active) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${title} gallery`}
      className="fixed inset-0 isolate bg-black text-cream"
      style={{ zIndex: 2147483647 }}
    >
      <button
        type="button"
        aria-label="Tutup galeri"
        onClick={onClose}
        className="absolute right-4 top-4 z-20 h-11 w-11 rounded-full bg-white/10 grid place-items-center backdrop-blur hover:bg-white/20 transition-smooth"
      >
        <X className="h-5 w-5" />
      </button>

      <div className="absolute left-4 top-4 z-20 rounded-full bg-white/10 px-4 py-2 text-sm backdrop-blur">
        {activeIndex + 1} / {images.length}
      </div>

      {images.length > 1 && (
        <>
          <button
            type="button"
            aria-label="Gambar sebelumnya"
            onClick={() => go(activeIndex - 1)}
            className="absolute left-3 md:left-6 top-1/2 z-20 h-12 w-12 -translate-y-1/2 rounded-full bg-white/10 grid place-items-center backdrop-blur hover:bg-white/20 transition-smooth"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            type="button"
            aria-label="Gambar berikutnya"
            onClick={() => go(activeIndex + 1)}
            className="absolute right-3 md:right-6 top-1/2 z-20 h-12 w-12 -translate-y-1/2 rounded-full bg-white/10 grid place-items-center backdrop-blur hover:bg-white/20 transition-smooth"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </>
      )}

      <div className="flex h-full flex-col">
        <div className="min-h-0 flex-1 overflow-auto px-4 pb-4 pt-20 md:px-20">
          <div className="grid min-h-full place-items-center">
            <ResolvedImage
              key={active.src}
              src={active.src}
              alt={active.alt || title}
              className="max-h-[72vh] max-w-full object-contain transition-transform duration-200"
              draggable={false}
              loading="eager"
              onClick={() => adjustZoom(0.25)}
              style={{
                cursor: zoom < 3 ? "zoom-in" : "zoom-out",
                transform: `scale(${zoom})`,
              }}
            />
          </div>
        </div>

        <div className="border-t border-white/10 bg-black/70 px-4 py-3 backdrop-blur md:px-8">
          <div className="mx-auto flex max-w-6xl flex-col gap-3">
            <div className="flex flex-wrap items-center justify-center gap-2">
              <button
                type="button"
                aria-label="Perkecil gambar"
                onClick={() => adjustZoom(-0.25)}
                className="h-10 w-10 rounded-full bg-white/10 grid place-items-center hover:bg-white/20 transition-smooth"
              >
                <ZoomOut className="h-4 w-4" />
              </button>
              <input
                aria-label="Zoom gambar"
                type="range"
                min="1"
                max="3"
                step="0.05"
                value={zoom}
                onChange={(event) => setZoom(Number(event.target.value))}
                className="h-2 w-44 accent-bamboo-soft md:w-64"
              />
              <button
                type="button"
                aria-label="Perbesar gambar"
                onClick={() => adjustZoom(0.25)}
                className="h-10 w-10 rounded-full bg-white/10 grid place-items-center hover:bg-white/20 transition-smooth"
              >
                <ZoomIn className="h-4 w-4" />
              </button>
              <button
                type="button"
                aria-label="Reset zoom"
                onClick={() => setZoom(1)}
                className="h-10 w-10 rounded-full bg-white/10 grid place-items-center hover:bg-white/20 transition-smooth"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            </div>

            {images.length > 1 && (
              <div className="flex justify-center gap-2 overflow-x-auto no-scrollbar pb-1">
                {images.map((image, index) => (
                  <button
                    key={`${image.src}-${index}`}
                    type="button"
                    aria-label={`Lihat gambar ${index + 1}`}
                    onClick={() => go(index)}
                    className={cn(
                      "relative h-14 w-20 shrink-0 overflow-hidden rounded-md border transition-smooth md:h-16 md:w-24",
                      index === activeIndex ? "border-bamboo-soft ring-2 ring-bamboo-soft/40" : "border-white/20 opacity-70 hover:opacity-100"
                    )}
                  >
                    <ResolvedImage src={image.src} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function MediaCarousel({
  slides,
  title,
  frameClassName,
}: {
  slides: MediaSlide[];
  title: string;
  frameClassName?: string;
}) {
  const [i, setI] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const cur = slides[i] ?? null;
  const imageSlides = slides.filter((slide): slide is Extract<MediaSlide, { kind: "image" }> => slide.kind === "image");
  const portalRoot = typeof document === "undefined" ? null : document.body;
  const go = (n: number) => setI((n + slides.length) % slides.length);
  const openLightbox = (slide: Extract<MediaSlide, { kind: "image" }>) => {
    const index = imageSlides.findIndex((image) => image.src === slide.src);
    setLightboxIndex(index >= 0 ? index : 0);
  };

  // Debug logging for video URLs
  useEffect(() => {
    if (cur?.kind === "video") {
      console.log("Video slide detected:", {
        originalUrl: cur.src,
        isYouTube: isYouTubeUrl(cur.src),
        embedUrl: getYouTubeEmbedUrl(cur.src),
      });
    }
  }, [cur]);

  // Autoplay video when it's the first slide
  useEffect(() => {
    if (i === 0 && cur?.kind === "video") {
      if (videoRef.current && !isYouTubeUrl(cur.src)) {
        videoRef.current.play().catch(() => {
          // Autoplay might be blocked by browser, that's okay
        });
      }
    }
  }, [i, cur]);

  if (!cur) return null;

  return (
    <div className="grid gap-4">
      <div
        className={cn(
          "relative overflow-hidden rounded-xl bg-muted shadow-soft",
          frameClassName ?? "aspect-[4/3] md:aspect-[16/11]"
        )}
      >
        {cur.kind === "image" ? (
          <button
            type="button"
            aria-label="Perbesar gambar"
            onClick={() => openLightbox(cur)}
            className="group h-full w-full cursor-zoom-in"
          >
            <ResolvedImage
              src={cur.src}
              alt={cur.alt || title}
              className="h-full w-full object-cover animate-fade-in"
              loading="eager"
            />
            <span className="absolute right-3 top-3 z-10 h-10 w-10 rounded-full bg-background/80 grid place-items-center text-foreground backdrop-blur opacity-0 transition-smooth group-hover:opacity-100">
              <Maximize2 className="h-4 w-4" />
            </span>
          </button>
        ) : isYouTubeUrl(cur.src) ? (
          // YouTube Video
          <iframe
            ref={iframeRef}
            key={cur.src}
            src={i === 0 ? getYouTubeEmbedUrl(cur.src) || cur.src : getYouTubeEmbedUrl(cur.src)?.replace('autoplay=1', 'autoplay=0') || cur.src}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="h-full w-full border-0"
          />
        ) : (
          // Direct Video File (MP4, WebM, etc)
          <video
            ref={videoRef}
            key={cur.src}
            src={cur.src}
            poster={cur.poster ? resolveAsset(cur.poster) : undefined}
            controls
            playsInline
            autoPlay={i === 0}
            muted={i === 0}
            loop
            className="h-full w-full object-cover bg-black"
          />
        )}

        {slides.length > 1 && (
          <>
            <button
              aria-label="Sebelumnya"
              onClick={() => go(i - 1)}
              className="absolute left-3 top-1/2 -translate-y-1/2 h-10 w-10 grid place-items-center rounded-full bg-background/80 backdrop-blur hover:bg-background transition-smooth z-10"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              aria-label="Berikutnya"
              onClick={() => go(i + 1)}
              className="absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 grid place-items-center rounded-full bg-background/80 backdrop-blur hover:bg-background transition-smooth z-10"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-background/70 backdrop-blur text-xs z-10">
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
                <ResolvedImage src={s.src} alt="" className="h-full w-full object-cover" />
              ) : (
                <div className="h-full w-full bg-bamboo-deep grid place-items-center text-cream">
                  <PlayCircle className="h-6 w-6" />
                </div>
              )}
            </button>
          ))}
        </div>
      )}

      {lightboxIndex !== null && imageSlides.length > 0 && portalRoot && createPortal(
        <ImageLightbox
          images={imageSlides}
          initialIndex={lightboxIndex}
          title={title}
          onClose={() => setLightboxIndex(null)}
        />,
        portalRoot
      )}
    </div>
  );
}
