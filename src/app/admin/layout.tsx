"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Box,
  FolderKanban,
  Home,
  Image,
  LogOut,
  Mail,
  Menu,
  X,
  BarChart3,
  Users,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", href: "/admin", icon: Home },
  { name: "Produk", href: "/admin/products", icon: Box },
  { name: "Proyek", href: "/admin/projects", icon: FolderKanban },
  { name: "Pesan", href: "/admin/messages", icon: Mail },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
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
      <div className="min-h-screen grid place-items-center bg-secondary/30">
        <div className="text-center">
          <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-muted-foreground">Memeriksa sesi...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary/30">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-full w-64 bg-card border-r border-border transition-transform duration-300 lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between px-6 h-15 border-b border-border">
            <Link href="/" className="flex items-center gap-2 group">
            {/* Bagian Logo (Gambar) */}
            <div className="h-8 w-12 rounded-sm overflow-hidden grid place-items-center -translate-y-[2px]">
              <img
                src="/RN_Architect.png"
                alt="RN Architect Logo"
                width={40}
                height={40}
                className="w-full h-full object-contain"
              />
            </div>

            {/* Bagian Teks */}
            {/* Tambahkan translate-y-[Xpx] di sini untuk menaikkan/menurunkan teks */}
            <span className="font-display text-xl tracking-tight translate-y-[2px]">
              ARCHITECT
            </span>
          </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1 hover:bg-secondary rounded-md"
            >
              <X className="h-5 w-5" />
            </button>
            
          </div>
          

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              // Fix: Exact match for dashboard, prefix match for others
              const isActive = item.href === "/admin" 
                ? pathname === "/admin"
                : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground/70 hover:bg-secondary hover:text-foreground"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* User info */}
          <div className="p-4 border-t border-border">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 grid place-items-center">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">{user?.email}</div>
                <div className="text-xs text-muted-foreground">Administrator</div>
              </div>
            </div>
            <button
              onClick={logout}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border border-border hover:bg-secondary transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Keluar
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-background/95 backdrop-blur border-b border-border">
          <div className="flex items-center justify-between px-4 lg:px-6 py-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 -ml-2 hover:bg-secondary rounded-md"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="flex-1 lg:flex-none">
              <h1 className="text-lg font-semibold">
                {navigation.find((item) => 
                  item.href === "/admin" 
                    ? pathname === "/admin"
                    : pathname.startsWith(item.href)
                )?.name || "Dashboard"}
              </h1>
            </div>
            <Link
              href="/"
              target="_blank"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Lihat Website →
            </Link>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
