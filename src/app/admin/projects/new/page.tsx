"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, Plus, X } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { normalizeImageUrl } from "@/lib/assets";

export default function NewProjectPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    category: "Residensial",
    location: "",
    year: new Date().getFullYear(),
    duration: "",
    client: "",
    concept: "",
    short_desc: "",
    cover_image: "",
    video_url: "",
    is_featured: false,
    status: "draft",
  });
  const [images, setImages] = useState<string[]>([""]);

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleTitleChange = (title: string) => {
    setFormData((prev) => ({
      ...prev,
      title,
      slug: generateSlug(title),
    }));
  };

  const addImage = () => {
    setImages([...images, ""]);
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const updateImage = (index: number, value: string) => {
    const updated = [...images];
    updated[index] = value;
    setImages(updated);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!formData.title.trim()) {
        toast.error("Judul proyek harus diisi");
        setLoading(false);
        return;
      }

      const validImages = images
        .map(normalizeImageUrl)
        .filter((img) => img !== "");

      const { error } = await supabase.from("projects").insert({
        ...formData,
        cover_image: normalizeImageUrl(formData.cover_image),
        images: validImages,
      });

      if (error) throw error;

      toast.success("Proyek berhasil ditambahkan");
      router.push("/admin/projects");
    } catch (error) {
      console.error("Error creating project:", error);
      toast.error(error instanceof Error ? error.message : "Gagal menambahkan proyek");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/projects"
          className="p-2 hover:bg-secondary rounded-lg transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Tambah Proyek Baru</h1>
          <p className="text-muted-foreground mt-1">Isi form di bawah untuk menambah proyek</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-card rounded-xl border border-border p-6 space-y-4">
          <h2 className="text-lg font-semibold">Informasi Dasar</h2>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Judul Proyek <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Slug (auto-generate)</label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Kategori</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="Residensial">Residensial</option>
                <option value="Komersial">Komersial</option>
                <option value="Hospitality">Hospitality</option>
                <option value="Renovasi">Renovasi</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Lokasi</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Contoh: Jakarta"
                className="w-full px-3 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Durasi</label>
              <input
                type="text"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                placeholder="Contoh: 6 bulan"
                className="w-full px-3 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Klien</label>
              <input
                type="text"
                value={formData.client}
                onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                placeholder="Nama klien"
                className="w-full px-3 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Konsep</label>
            <input
              type="text"
              value={formData.concept}
              onChange={(e) => setFormData({ ...formData, concept: e.target.value })}
              placeholder="Contoh: Minimalis Modern"
              className="w-full px-3 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border p-6 space-y-4">
          <h2 className="text-lg font-semibold">Deskripsi</h2>

          <div>
            <label className="block text-sm font-medium mb-2">Deskripsi Singkat</label>
            <textarea
              value={formData.short_desc}
              onChange={(e) => setFormData({ ...formData, short_desc: e.target.value })}
              rows={3}
              placeholder="Deskripsi singkat tentang proyek..."
              className="w-full px-3 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border p-6 space-y-4">
          <h2 className="text-lg font-semibold">Gambar</h2>

          <div>
            <label className="block text-sm font-medium mb-2">Cover Image URL</label>
            <input
              type="url"
              value={formData.cover_image}
              onChange={(e) => setFormData({ ...formData, cover_image: e.target.value })}
              placeholder="https://example.com/cover.jpg"
              className="w-full px-3 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium">Gallery Images</label>
              <button
                type="button"
                onClick={addImage}
                className="inline-flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg border border-border hover:bg-secondary transition-colors"
              >
                <Plus className="h-4 w-4" />
                Tambah Gambar
              </button>
            </div>

            {images.map((image, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="url"
                  value={image}
                  onChange={(e) => updateImage(index, e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="flex-1 px-3 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                />
                {images.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border p-6 space-y-4">
          <h2 className="text-lg font-semibold">Video & Pengaturan</h2>

          <div>
            <label className="block text-sm font-medium mb-2">Video URL (Optional)</label>
            <input
              type="url"
              value={formData.video_url}
              onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
              placeholder="https://youtube.com/watch?v=..."
              className="w-full px-3 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>

            <div className="flex items-center gap-2 pt-8">
              <input
                type="checkbox"
                id="is_featured"
                checked={formData.is_featured}
                onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                className="h-4 w-4 rounded border-input"
              />
              <label htmlFor="is_featured" className="text-sm font-medium">
                Tampilkan di Featured
              </label>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors"
          >
            {loading ? "Menyimpan..." : "Simpan Proyek"}
          </button>
          <Link
            href="/admin/projects"
            className="px-6 py-2.5 rounded-lg border border-border hover:bg-secondary transition-colors"
          >
            Batal
          </Link>
        </div>
      </form>
    </div>
  );
}
