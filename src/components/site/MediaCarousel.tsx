import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, PlayCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { resolveAsset } from "@/lib/assets";

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

export function MediaCarousel({ slides, title }: { slides: MediaSlide[]; title: string }) {
  const [i, setI] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  
  if (slides.length === 0) return null;
  const cur = slides[i];
  const go = (n: number) => setI((n + slides.length) % slides.length);

  // Debug logging for video URLs
  useEffect(() => {
    if (cur.kind === "video") {
      console.log("Video slide detected:", {
        originalUrl: cur.src,
        isYouTube: isYouTubeUrl(cur.src),
        embedUrl: getYouTubeEmbedUrl(cur.src),
      });
    }
  }, [cur]);

  // Autoplay video when it's the first slide
  useEffect(() => {
    if (i === 0 && cur.kind === "video") {
      if (videoRef.current && !isYouTubeUrl(cur.src)) {
        videoRef.current.play().catch(() => {
          // Autoplay might be blocked by browser, that's okay
        });
      }
    }
  }, [i, cur.kind, cur]);

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
