import hero from "@/assets/hero-architecture.jpg";
import product1 from "@/assets/product-1.jpg";
import product2 from "@/assets/product-2.jpg";
import product3 from "@/assets/product-3.jpg";
import project1 from "@/assets/project-1.jpg";
import project2 from "@/assets/project-2.jpg";
import type { StaticImageData } from "next/image";

const map: Record<string, StaticImageData> = {
  "hero-architecture.jpg": hero,
  "product-1.jpg": product1,
  "product-2.jpg": product2,
  "product-3.jpg": product3,
  "project-1.jpg": project1,
  "project-2.jpg": project2,
};

function resolveBundledAsset(src: string): StaticImageData | undefined {
  const normalizedPath = src.replaceAll("\\", "/");
  const fileName = normalizedPath.split("/").pop() ?? normalizedPath;
  const exactMatch = map[fileName];
  if (exactMatch) return exactMatch;

  const fileNameWithoutHash = fileName.replace(/(\.[a-z0-9]+)?(\.[a-z]+)$/i, "$2");
  return Object.entries(map).find(([key]) => {
    const baseName = key.replace(/\.[a-z]+$/i, "");
    return fileName.startsWith(`${baseName}.`) || fileNameWithoutHash === key;
  })?.[1];
}

function getGoogleDriveFileId(url: URL): string | null {
  if (!/(^|\.)drive\.google\.com$/i.test(url.hostname)) return null;

  const filePathMatch = url.pathname.match(/\/file\/d\/([^/]+)/);
  if (filePathMatch?.[1]) return filePathMatch[1];

  return url.searchParams.get("id");
}

export function normalizeImageUrl(src: string): string {
  const trimmed = src.trim();
  if (!/^https?:\/\//i.test(trimmed)) return trimmed;

  try {
    const url = new URL(trimmed);
    const driveFileId = getGoogleDriveFileId(url);

    if (driveFileId) {
      return `https://drive.google.com/thumbnail?id=${encodeURIComponent(driveFileId)}&sz=w1200`;
    }
  } catch {
    return trimmed;
  }

  return trimmed;
}

/**
 * Resolve image strings stored in DB:
 * - Google Drive share URL -> direct image thumbnail URL
 * - external URL (http/https) -> return normalized URL
 * - "/src/assets/<name>" or "<name>" -> bundled asset import
 */
export function resolveAsset(src: string | null | undefined): string {
  if (!src) return hero.src;

  const normalized = normalizeImageUrl(src);
  const bundledAsset = resolveBundledAsset(normalized);
  if (bundledAsset) return bundledAsset.src;

  if (/^https?:\/\//i.test(normalized)) return normalized;
  if (normalized.startsWith("/")) return normalized;

  const key = normalized.split("/").pop() ?? normalized;
  return map[key]?.src ?? hero.src;
}

export const fallbackHero = hero;
