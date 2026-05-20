"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Mail, MailOpen, Trash2, Eye } from "lucide-react";
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

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    try {
      const { data, error } = await supabase
        .from("contact_messages")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setMessages((data as Message[]) || []);
    } catch (error) {
      console.error("Error loading messages:", error);
      toast.error("Gagal memuat pesan");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Hapus pesan dari "${name}"?`)) return;

    try {
      const { error } = await supabase.from("contact_messages").delete().eq("id", id);
      if (error) throw error;

      toast.success("Pesan berhasil dihapus");
      loadMessages();
    } catch (error) {
      console.error("Error deleting message:", error);
      toast.error("Gagal menghapus pesan");
    }
  };

  const filtered = messages.filter((m) => {
    if (filter === "unread") return !m.is_read;
    if (filter === "read") return m.is_read;
    return true;
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginatedMessages = filtered.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const unreadCount = messages.filter((m) => !m.is_read).length;

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

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Pesan</h1>
          <p className="text-muted-foreground mt-1">
            {unreadCount > 0 ? `${unreadCount} pesan belum dibaca` : "Semua pesan sudah dibaca"}
          </p>
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border p-4">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === "all"
                ? "bg-primary text-primary-foreground"
                : "bg-secondary hover:bg-secondary/80"
            }`}
          >
            Semua ({messages.length})
          </button>
          <button
            onClick={() => setFilter("unread")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === "unread"
                ? "bg-primary text-primary-foreground"
                : "bg-secondary hover:bg-secondary/80"
            }`}
          >
            Belum Dibaca ({unreadCount})
          </button>
          <button
            onClick={() => setFilter("read")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === "read"
                ? "bg-primary text-primary-foreground"
                : "bg-secondary hover:bg-secondary/80"
            }`}
          >
            Sudah Dibaca ({messages.length - unreadCount})
          </button>
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-secondary/50 border-b border-border">
              <tr>
                <th className="text-left px-4 py-3 text-sm font-medium">Status</th>
                <th className="text-left px-4 py-3 text-sm font-medium">Dari</th>
                <th className="text-left px-4 py-3 text-sm font-medium">Kontak</th>
                <th className="text-left px-4 py-3 text-sm font-medium">Pesan</th>
                <th className="text-left px-4 py-3 text-sm font-medium">Tanggal</th>
                <th className="text-right px-4 py-3 text-sm font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {paginatedMessages.length > 0 ? (
                paginatedMessages.map((msg) => (
                  <tr
                    key={msg.id}
                    className={`hover:bg-secondary/30 transition-colors ${
                      !msg.is_read ? "bg-blue-50/50" : ""
                    }`}
                  >
                    <td className="px-4 py-3">
                      {msg.is_read ? (
                        <MailOpen className="h-5 w-5 text-muted-foreground" />
                      ) : (
                        <Mail className="h-5 w-5 text-blue-600" />
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium">{msg.name}</div>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div>{msg.email}</div>
                      {msg.phone && <div className="text-muted-foreground">{msg.phone}</div>}
                    </td>
                    <td className="px-4 py-3 text-sm max-w-xs">
                      <div className="truncate">{msg.message}</div>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {new Date(msg.created_at).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/messages/${msg.id}`}
                          className="p-2 hover:bg-secondary rounded-lg transition-colors"
                          title="Lihat Detail"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(msg.id, msg.name)}
                          className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
                          title="Hapus"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-muted-foreground">
                    {filter === "unread"
                      ? "Tidak ada pesan yang belum dibaca"
                      : filter === "read"
                      ? "Tidak ada pesan yang sudah dibaca"
                      : "Belum ada pesan masuk"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-border">
            <div className="text-sm text-muted-foreground">
              Menampilkan {(page - 1) * itemsPerPage + 1} -{" "}
              {Math.min(page * itemsPerPage, filtered.length)} dari {filtered.length} pesan
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1 rounded-lg border border-border hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 py-1 rounded-lg border border-border hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
