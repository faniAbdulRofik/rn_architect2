"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Box,
  FolderKanban,
  Mail,
  Image,
  TrendingUp,
  Users,
  Eye,
  Clock,
  ArrowRight,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type Stats = {
  total_products: number;
  total_projects: number;
  new_messages: number;
  total_messages: number;
  total_media: number;
};

type RecentActivity = {
  id: string;
  action: string;
  entity_type: string;
  created_at: string;
  user_email?: string;
};

export default function AdminHome() {
  const [stats, setStats] = useState<Stats>({
    total_products: 0,
    total_projects: 0,
    new_messages: 0,
    total_messages: 0,
    total_media: 0,
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Load stats from individual tables
      const [productsRes, projectsRes, messagesRes] = await Promise.all([
        supabase.from("products").select("id", { count: "exact", head: true }).eq("status", "published"),
        supabase.from("projects").select("id", { count: "exact", head: true }).eq("status", "published"),
        supabase.from("contact_messages").select("id", { count: "exact", head: true }),
      ]);

      // Count new messages (unread)
      const { count: newCount } = await supabase
        .from("contact_messages")
        .select("id", { count: "exact", head: true })
        .eq("is_read", false);

      setStats({
        total_products: productsRes.count || 0,
        total_projects: projectsRes.count || 0,
        total_messages: messagesRes.count || 0,
        new_messages: newCount || 0,
        total_media: 0, // Will be implemented after media_library table is created
      });

      // Recent activity will be loaded after activity_log table is created
      setRecentActivity([]);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const tiles = [
    {
      icon: Box,
      title: "Produk",
      count: stats.total_products,
      desc: "Total produk published",
      href: "/admin/products",
      color: "text-blue-600 bg-blue-50",
    },
    {
      icon: FolderKanban,
      title: "Proyek",
      count: stats.total_projects,
      desc: "Total proyek published",
      href: "/admin/projects",
      color: "text-purple-600 bg-purple-50",
    },
    {
      icon: Mail,
      title: "Pesan Baru",
      count: stats.new_messages,
      desc: `${stats.total_messages} total pesan`,
      href: "/admin/messages",
      color: "text-green-600 bg-green-50",
      badge: stats.new_messages > 0,
    },
  ];

  const quickActions = [
    { icon: Box, label: "Tambah Produk", href: "/admin/products/new" },
    { icon: FolderKanban, label: "Tambah Proyek", href: "/admin/projects/new" },
    { icon: Mail, label: "Lihat Pesan", href: "/admin/messages" },
  ];

  if (loading) {
    return (
      <div className="grid place-items-center min-h-[60vh]">
        <div className="text-center">
          <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-muted-foreground">Memuat dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          Selamat datang kembali! Berikut ringkasan aktivitas website Anda.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {tiles.map((tile) => (
          <Link
            key={tile.title}
            href={tile.href}
            className="group relative p-6 rounded-xl bg-card border border-border hover:border-primary/50 hover:shadow-lg transition-all"
          >
            {tile.badge && (
              <span className="absolute top-3 right-3 h-2 w-2 rounded-full bg-red-500 animate-pulse" />
            )}
            <div className={`h-12 w-12 rounded-lg ${tile.color} grid place-items-center mb-4`}>
              <tile.icon className="h-6 w-6" />
            </div>
            <div className="font-display text-3xl mb-1">{tile.count}</div>
            <div className="text-sm font-medium mb-1">{tile.title}</div>
            <div className="text-xs text-muted-foreground">{tile.desc}</div>
            <ArrowRight className="absolute bottom-6 right-6 h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-card rounded-xl border border-border p-6">
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {quickActions.map((action) => (
            <Link
              key={action.label}
              href={action.href}
              className="flex items-center gap-3 p-4 rounded-lg border border-border hover:border-primary/50 hover:bg-secondary/50 transition-all group"
            >
              <div className="h-10 w-10 rounded-lg bg-primary/10 grid place-items-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <action.icon className="h-5 w-5" />
              </div>
              <span className="text-sm font-medium">{action.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
