# 🚀 Quick Start Guide - RN_ARCHITECT

## ✅ Problem SOLVED: "Database error creating new user"

Schema database sudah diperbaiki! Error yang Anda alami disebabkan oleh **circular dependency** pada foreign key constraints.

### 🔧 What Was Fixed

**Schema Version 1.1.0** menghilangkan semua foreign key constraints ke `auth.users(id)`:

| Table | Field | Before | After |
|-------|-------|--------|-------|
| products | created_by, updated_by | UUID REFERENCES auth.users(id) | UUID (no constraint) |
| projects | created_by, updated_by | UUID REFERENCES auth.users(id) | UUID (no constraint) |
| contact_messages | replied_by | UUID REFERENCES auth.users(id) | UUID (no constraint) |
| media_library | uploaded_by | UUID REFERENCES auth.users(id) | UUID (no constraint) |
| site_settings | updated_by | UUID REFERENCES auth.users(id) | UUID (no constraint) |
| activity_log | user_id | UUID REFERENCES auth.users(id) | UUID (no constraint) |

**Why This Fix Works:**
- Foreign key ke `auth.users(id)` membuat circular dependency saat create user pertama
- Database mencoba validate foreign key sebelum user selesai dibuat
- Dengan menghapus constraint, user bisa dibuat tanpa error
- Aplikasi tetap bisa track user actions, tapi database tidak enforce referential integrity

## 📝 Setup Instructions

### Step 1: Drop Old Tables (Jika Sudah Run Schema Lama)

Jika Anda sudah run schema lama dan mendapat error, drop semua tables dulu:

1. Buka **Supabase Dashboard** > **SQL Editor**
2. Run query ini:

```sql
DROP TABLE IF EXISTS activity_log CASCADE;
DROP TABLE IF EXISTS site_settings CASCADE;
DROP TABLE IF EXISTS media_library CASCADE;
DROP TABLE IF EXISTS contact_messages CASCADE;
DROP TABLE IF EXISTS projects CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP VIEW IF EXISTS dashboard_stats;
```

### Step 2: Run New Schema

1. Masih di **SQL Editor**
2. Copy seluruh isi file `supabase-schema.sql` (versi terbaru)
3. Paste dan **Run**
4. Tunggu sampai selesai (Success message)

### Step 3: Create Admin User

Sekarang Anda bisa create admin tanpa error!

1. Buka **Authentication** > **Users**
2. Click **"Add user"**
3. Isi form:
   ```
   Email: admin@rn-architect.com
   Password: [password kuat Anda]
   ☑️ Auto Confirm User (WAJIB dicentang!)
   ```
4. Click **"Create user"**
5. ✅ **SUCCESS!** User berhasil dibuat

### Step 4: Test Login

1. Jalankan aplikasi:
   ```bash
   npm run dev
   ```

2. Buka browser: `http://localhost:3000/login`

3. Login dengan:
   - Email: `admin@rn-architect.com`
   - Password: [password yang Anda buat]

4. Setelah login, akses: `http://localhost:3000/admin`

5. ✅ **You're in!** Dashboard admin siap digunakan

## 🎯 What You Can Do Now

### Admin Dashboard Features

1. **Dashboard** (`/admin`)
   - View statistics (total products, projects, messages)
   - Quick actions (Add Product, Add Project, View Messages)
   - Recent activity log

2. **Products Management** (`/admin/products`)
   - View all products
   - Search products
   - Filter by category & status
   - Delete products
   - (Create/Edit coming soon)

3. **Projects Management** (`/admin/projects`)
   - Coming soon

4. **Messages** (`/admin/messages`)
   - View contact form submissions
   - Coming soon

5. **Media Library** (`/admin/media`)
   - Upload images
   - Manage files
   - Coming soon

## 📚 Documentation Files

- **`DATABASE_SETUP.md`** - Panduan lengkap setup database dari nol
- **`ADMIN_SETUP.md`** - Panduan create admin user (multiple methods)
- **`SECURITY_UPDATE.md`** - Penjelasan security changes (no public signup)
- **`MIGRATION.md`** - Technical details migrasi dari TanStack ke Next.js
- **`supabase-schema.sql`** - Database schema (versi 1.1.0 - fixed)

## 🔒 Security Notes

- ✅ Public signup **DISABLED** - hanya admin manual yang bisa login
- ✅ Login page tidak ada form signup
- ✅ Google OAuth button dihapus
- ✅ Security warning banner ditampilkan di login page
- ✅ Row Level Security (RLS) enabled di semua tables
- ✅ Admin-only access untuk dashboard

## 🆘 Still Having Issues?

### Error: "Invalid login credentials"
- Pastikan email dan password benar
- Pastikan user sudah di-confirm (centang "Auto Confirm User")
- Check di Supabase Dashboard > Authentication > Users

### Error: "Unauthorized" saat akses /admin
- Pastikan sudah login
- Check browser console untuk error
- Verify Supabase credentials di `.env.local`

### Tables tidak ada
- Run ulang `supabase-schema.sql`
- Check di Table Editor apakah tables sudah dibuat

### Sample data tidak muncul
- Check di Table Editor apakah data ada
- Pastikan `status = 'published'`
- Refresh browser

## ✅ Success Checklist

- [ ] Schema lama sudah di-drop (jika ada)
- [ ] Schema baru (v1.1.0) sudah di-run tanpa error
- [ ] Semua 6 tables sudah ada di Table Editor
- [ ] Admin user berhasil dibuat tanpa error
- [ ] Login berhasil di `/login`
- [ ] Dashboard admin bisa diakses di `/admin`
- [ ] Products list muncul di `/admin/products`
- [ ] Homepage menampilkan sample products & projects

## 🎉 You're All Set!

Database sudah siap, admin user sudah dibuat, dan aplikasi siap digunakan!

**Next Steps:**
1. Explore admin dashboard
2. Test CRUD operations
3. Upload images ke media library
4. Customize site settings
5. Add your own products & projects

---

**Need More Help?**
- Read `DATABASE_SETUP.md` untuk detail lengkap
- Read `ADMIN_SETUP.md` untuk troubleshooting admin creation
- Check Supabase docs: https://supabase.com/docs

**Happy Building!** 🚀
