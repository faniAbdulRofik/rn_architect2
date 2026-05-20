"use client";

import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { ArrowLeft, Mail, Phone, Calendar, Trash2, CheckCircle } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type Message = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  is_read: boolean;
  created_at: string;
};

export default function MessageDetailPage() {
  const router = useRouter();
  const params = useParams();
  const messageId = params.id as string;

  const [message, setMessage] = useState<Message | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMessage();
  }, [messageId]);

  const loadMessage = async () => {
    try {
      const { data, error } = await supabase
        .from("contact_messages")
        .select("*")
        .eq("id", messageId)
        .single();

      if (error) throw error;

      setMessage(data as Message);

      // Mark as read if not already
      if (data && !data.is_read) {
        await supabase
          .from("contact_messages")
          .update({ is_read: true })
          .eq("id", messageId);
      }
    } catch (error) {
      console.error("Error loading message:", error);
      toast.error("Gagal memuat pesan");
      router.push("/admin/messages");
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async () => {
    if (!message) return;

    try {
      const { error } = await supabase
        .from("contact_messages")
        .update({ is_read: true })
        .eq("id", messageId);

      if (error) throw error;

      toast.success("Pesan ditandai sudah dibaca");
      setMessage({ ...message, is_read: true });
    } catch (error) {
      console.error("Error marking as read:", error);
      toast.error("Gagal menandai pesan");
    }
  };

  const handleDelete = async () => {
    if (!message) return;
    if (!confirm(`Hapus pesan dari "${message.name}"?`)) return;

    try {
      const { error } = await supabase.from("contact_messages").delete().eq("id", messageId);
      if (error) throw error;

      toast.success("Pesan berhasil dihapus");
      router.push("/admin/messages");
    } catch (error) {
      console.error("Error deleting message:", error);
      toast.error("Gagal menghapus pesan");
    }
  };

  if (loading) {
    return (
      <div className="grid place-items-center min-h-[60vh]">
        <div className="text-center">
          <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-muted-foreground">Memuat pesan...</p>
        </div>
      </div>
    );
  }

  if (!message) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Pesan tidak ditemukan</p>
        <Link
          href="/admin/messages"
          className="inline-flex items-center gap-2 mt-4 text-primary hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali ke Pesan
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/messages"
          className="p-2 hover:bg-secondary rounded-lg transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">Detail Pesan</h1>
          <p className="text-muted-foreground mt-1">
            {message.is_read ? "Sudah dibaca" : "Belum dibaca"}
          </p>
        </div>
        <div className="flex gap-2">
          {!message.is_read && (
            <button
              onClick={handleMarkAsRead}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-secondary transition-colors"
            >
              <CheckCircle className="h-4 w-4" />
              Tandai Dibaca
            </button>
          )}
          <button
            onClick={handleDelete}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
            Hapus
          </button>
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border p-6 space-y-6">
        {/* Sender Info */}
        <div className="pb-6 border-b border-border">
          <h2 className="text-2xl font-semibold mb-4">{message.name}</h2>
          <div className="space-y-2">
            <div className="flex items-center gap-3 text-muted-foreground">
              <Mail className="h-4 w-4" />
              <a href={`mailto:${message.email}`} className="hover:text-primary transition-colors">
                {message.email}
              </a>
            </div>
            {message.phone && (
              <div className="flex items-center gap-3 text-muted-foreground">
                <Phone className="h-4 w-4" />
                <a href={`tel:${message.phone}`} className="hover:text-primary transition-colors">
                  {message.phone}
                </a>
              </div>
            )}
            <div className="flex items-center gap-3 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>
                {new Date(message.created_at).toLocaleString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </div>
        </div>

        {/* Message Content */}
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-3">Pesan:</h3>
          <div className="prose prose-sm max-w-none">
            <p className="whitespace-pre-wrap text-foreground leading-relaxed">{message.message}</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-card rounded-xl border border-border p-6">
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-3">
          <a
            href={`mailto:${message.email}?subject=Re: Pesan dari ${message.name}`}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <Mail className="h-4 w-4" />
            Balas via Email
          </a>
          {message.phone && (
            <a
              href={`https://wa.me/${message.phone.replace(/\D/g, "")}?text=Halo ${message.name}, terima kasih atas pesan Anda.`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-secondary transition-colors"
            >
              <Phone className="h-4 w-4" />
              Hubungi via WhatsApp
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
