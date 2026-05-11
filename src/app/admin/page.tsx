"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Box, FolderKanban, LogOut, Mail, Settings } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const tiles = [
  { icon: Box, title: "Produk", desc: "Kelola katalog furnitur custom.", to: "/admin" as const, count: "—" },
  { icon: FolderKanban, title: "Proyek", desc: "Kelola portofolio arsitektur.", to: "/admin" as const, count: "—" },
  { icon: Mail, title: "Pesan", desc: "Pesan masuk dari form kontak.", to: "/admin" as const, count: "—" },
  { icon: Settings, title: "Pengaturan", desc: "Profil studio, tim, integrasi.", to: "/admin" as const, count: "—" },
];

export default function AdminHome() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (!user) router.push("/login");
    else setReady(true);
  }, [user, loading, router]);

  const logout = async () => {
    await supabase.auth.signOut();
    toast.success("Berhasil keluar.");
    router.push("/");
  };

  if (loading || !ready) {
    return (
      <div className="min-h-screen grid place-items-center text-sm text-muted-foreground">
        Memeriksa sesi…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary/30">
      <header className="bg-card border-b border-border">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="font-display text-lg">
            RN<span className="text-primary">_</span>ARCHITECT <span className="text-xs text-muted-foreground ml-2">Admin</span>
          </Link>
          <div className="flex items-center gap-3 text-sm">
            <span className="text-muted-foreground hidden sm:inline">{user?.email}</span>
            <button
              onClick={logout}
              className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border border-border hover:bg-secondary transition-smooth"
            >
              <LogOut className="h-3.5 w-3.5" /> Keluar
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-10">
        <div className="mb-8">
          <p className="text-xs tracking-[0.3em] uppercase text-primary mb-2">Dashboard</p>
          <h1 className="text-3xl md:text-4xl">Selamat datang kembali</h1>
          <p className="text-muted-foreground mt-2 text-sm">
            Modul CRUD penuh akan diaktifkan pada tahap berikutnya. Saat ini struktur dan akses sudah siap.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {tiles.map((t) => (
            <div key={t.title} className="p-6 rounded-xl bg-card border border-border hover:shadow-soft transition-smooth">
              <div className="h-10 w-10 rounded-md bg-primary/10 grid place-items-center text-primary mb-4">
                <t.icon className="h-5 w-5" />
              </div>
              <h3 className="text-lg">{t.title}</h3>
              <p className="text-xs text-muted-foreground mt-1">{t.desc}</p>
              <div className="font-display text-3xl mt-4">{t.count}</div>
            </div>
          ))}
        </div>

        <div className="mt-10 p-6 rounded-xl border border-dashed border-border bg-card/50 text-sm text-muted-foreground">
          <strong className="text-foreground">Roadmap berikutnya:</strong> form CRUD untuk Produk &
          Proyek, upload media via storage <code>media</code>, manajemen pesan kontak, dan manajemen role admin.
        </div>
      </main>
    </div>
  );
}
