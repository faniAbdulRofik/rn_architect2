import { MessageCircle } from "lucide-react";
import { waLink } from "@/lib/site";

export function WhatsAppFloat() {
  return (
    <a
      href={waLink("Halo RN_ARCHITECT, saya ingin berkonsultasi.")}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat WhatsApp"
      className="fixed bottom-6 right-6 z-40 inline-flex items-center gap-2 rounded-full bg-bamboo text-primary-foreground pl-4 pr-5 py-3 shadow-elegant hover:shadow-soft hover:scale-105 transition-smooth"
    >
      <MessageCircle className="h-5 w-5" />
      <span className="hidden sm:inline text-sm font-medium">Chat via WhatsApp</span>
    </a>
  );
}
