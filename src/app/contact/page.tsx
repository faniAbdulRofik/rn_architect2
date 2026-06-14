"use client";

import { useEffect, useState } from "react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { CONTACT_VISITED_KEY, SITE, waLink } from "@/lib/site";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [loading, setLoading] = useState(false);

  // Reveal Login button in navbar after user opens Contact
  useEffect(() => {
    try {
      window.localStorage.setItem(CONTACT_VISITED_KEY, "1");
      window.dispatchEvent(new Event("rn:contact-visited"));
    } catch {}
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error("Mohon lengkapi nama, email, dan pesan.");
      return;
    }
    setLoading(true);
    const { error } = await supabase.from("contact_messages").insert({
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim() || null,
      message: form.message.trim(),
    });
    setLoading(false);
    if (error) {
      toast.error("Gagal mengirim. Silakan coba lagi atau hubungi WhatsApp.");
      return;
    }
    toast.success("Pesan terkirim! Kami akan menghubungi Anda segera.");
    setForm({ name: "", email: "", phone: "", message: "" });
  };

  return (
    <SiteLayout>
      <section className="pt-32 md:pt-20 pb-10 bg-gradient-warm">
  <div className="container mx-auto px-6 max-w-4xl text-center">
    <h1 className="text-4xl md:text-6xl text-balance leading-tight">
      Mari mulai percakapan
    </h1>
  </div>
</section>

      <section className="py-16 md:py-20">
        <div className="container mx-auto px-6 md:px-50">
          <form onSubmit={onSubmit} className="lg:col-span-3 p-8 md:p-10 rounded-lg bg-card border border-border space-y-5 shadow-soft">
            <h2 className="text-2xl">Kirim pesan</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Nama" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
              <Field label="Email" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} />
            </div>
            <Field label="No. HP / WhatsApp" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} />
            <div className="space-y-1.5">
              <label className="text-sm text-foreground">Pesan</label>
              <textarea
                rows={5}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full px-4 py-3 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring text-sm"
                placeholder="Ceritakan singkat tentang proyek atau pertanyaan Anda…"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-6 py-3 rounded-full bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-60 transition-smooth"
            >
              {loading ? "Mengirim…" : "Kirim Pesan"}
            </button>
          </form>
        </div>
      </section>
    </SiteLayout>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm text-foreground">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring text-sm"
      />
    </div>
  );
}
