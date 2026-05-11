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

/**
 * Resolve image strings stored in DB:
 * - external URL (http/https) → return as-is
 * - "/src/assets/<name>" or "<name>" → bundled asset import
 */
export function resolveAsset(src: string | null | undefined): string {
  if (!src) return hero.src;
  if (/^https?:\/\//i.test(src)) return src;
  const key = src.split("/").pop() ?? src;
  return map[key]?.src ?? hero.src;
}

export const fallbackHero = hero;
