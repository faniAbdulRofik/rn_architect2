"use client";

import { useRouter, useParams } from "next/navigation";
import { useCallback, useState, useEffect } from "react";
import { ArrowLeft, Plus, X } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { normalizeImageUrl } from "@/lib/assets";

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    category: "Furniture",
    material: "",
    dimensions: "",
    short_desc: "",
    video_url: "",
    is_featured: false,
    status: "draft",
  });
  const [images, setImages] = useState<string[]>([""]);

  const loadProduct = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", productId)
        .single();

      if (error) throw error;

      if (data) {
        setFormData({
          title: data.title || "",
          slug: data.slug || "",
          category: data.category || "Furniture",
          material: data.material || "",
          dimensions: data.dimensions || "",
          short_desc: data.short_desc || "",
          video_url: data.video_url || "",
          is_featured: data.is_featured || false,
          status: data.status || "draft",
        });
        setImages(data.images && data.images.length > 0 ? data.images : [""]);
      }
    } catch (error) {
      console.error("Error loading product:", error);
      toast.error("Gagal memuat produk");
      router.push("/admin/products");
    } finally {
      setLoading(false);
    }
  }, [productId, router]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadProduct();
  }, [loadProduct]);

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
    setSaving(true);

    try {
      if (!formData.title.trim()) {
        toast.error("Judul produk harus diisi");
        setSaving(false);
        return;
      }

      const validImages = images
        .map(normalizeImageUrl)
        .filter((img) => img !== "");

      const { error } = await supabase
        .from("products")
        .update({
          ...formData,
          images: validImages,
          updated_at: new Date().toISOString(),
        })
        .eq("id", productId);

      if (error) throw error;

      toast.success("Produk berhasil diupdate");
      router.push("/admin/products");
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error(error instanceof Error ? error.message : "Gagal mengupdate produk");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="grid place-items-center min-h-[60vh]">
        <div className="text-center">
          <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-muted-foreground">Memuat produk...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/products"
          className="p-2 hover:bg-secondary rounded-lg transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Edit Produk</h1>
          <p className="text-muted-foreground mt-1">Update informasi produk</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-card rounded-xl border border-border p-6 space-y-4">
          <h2 className="text-lg font-semibold">Informasi Dasar</h2>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Judul Produk <span className="text-red-500">*</span>
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
              <label className="block text-sm font-medium mb-2">Slug</label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Kategori</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="Furniture">Furniture</option>
              <option value="Lighting">Lighting</option>
              <option value="Decor">Decor</option>
              <option value="Custom">Custom</option>
            </select>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Material</label>
              <input
                type="text"
                value={formData.material}
                onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                placeholder="Contoh: Kayu Jati, Besi"
                className="w-full px-3 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Dimensi</label>
              <input
                type="text"
                value={formData.dimensions}
                onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })}
                placeholder="Contoh: 200 x 100 x 75 cm"
                className="w-full px-3 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
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
              placeholder="Deskripsi singkat tentang produk..."
              className="w-full px-3 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Gambar (URL)</h2>
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
            disabled={saving}
            className="px-6 py-2.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors"
          >
            {saving ? "Menyimpan..." : "Update Produk"}
          </button>
          <Link
            href="/admin/products"
            className="px-6 py-2.5 rounded-lg border border-border hover:bg-secondary transition-colors"
          >
            Batal
          </Link>
        </div>
      </form>
    </div>
  );
}
