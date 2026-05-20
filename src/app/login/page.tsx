"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Lock, Mail, ShieldAlert } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) router.push("/admin");
    });
  }, [router]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Email & password wajib diisi.");
      return;
    }
    
    setLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      });
      
      if (error) {
        setLoading(false);
        if (error.message.includes("Invalid login credentials")) {
          toast.error("Email atau password salah. Hubungi administrator jika Anda lupa password.");
        } else {
          toast.error(error.message);
        }
        return;
      }

      if (data.session) {
        toast.success("Selamat datang!");
        router.push("/admin");
      }
    } catch (error) {
      setLoading(false);
      toast.error("Terjadi kesalahan. Silakan coba lagi.");
    }
  };

  return (
    <SiteLayout>
      <section className="pt-32 pb-24 min-h-screen bg-gradient-warm">
        <div className="container mx-auto px-6 max-w-md">
          <div className="bg-card border border-border rounded-2xl shadow-elegant p-8 md:p-10">
            <div className="text-center mb-8">
              <div className="h-16 w-16 rounded-full bg-primary/10 grid place-items-center mx-auto mb-4">
                <ShieldAlert className="h-8 w-8 text-primary" />
              </div>
              <p className="text-xs tracking-[0.3em] uppercase text-primary mb-2">Admin Area</p>
              <h1 className="text-3xl font-bold">Login Administrator</h1>
              <p className="text-sm text-muted-foreground mt-2">
                Akses terbatas untuk administrator yang terdaftar
              </p>
            </div>

            {/* Security Notice */}
            <div className="mb-6 p-4 rounded-lg bg-amber-50 border border-amber-200">
              <div className="flex gap-3">
                <ShieldAlert className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-sm text-amber-800">
                  <p className="font-medium mb-1">Akses Terbatas</p>
                  <p className="text-xs">
                    Hanya administrator yang dibuat oleh super admin yang dapat mengakses dashboard ini.
                    Hubungi administrator jika Anda memerlukan akses.
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={submit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Email Administrator</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring/50"
                    placeholder="admin@rn-architect.com"
                    autoComplete="email"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring/50"
                    placeholder="••••••••"
                    autoComplete="current-password"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full px-6 py-3 rounded-md bg-primary text-primary-foreground font-medium hover:opacity-90 disabled:opacity-60 transition-smooth"
              >
                {loading ? "Memproses…" : "Masuk ke Dashboard"}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-border">
              <p className="text-xs text-center text-muted-foreground">
                Lupa password? Hubungi super administrator untuk reset password.
              </p>
            </div>

            <p className="text-center text-xs text-muted-foreground mt-4">
              <Link href="/" className="hover:text-primary inline-flex items-center gap-1">
                ← Kembali ke beranda
              </Link>
            </p>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
