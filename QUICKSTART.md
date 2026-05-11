# 🚀 Quick Start Guide - RN_ARCHITECT

## Prerequisites

- Node.js 18+ atau Bun
- npm, yarn, atau bun package manager

## Installation (3 Steps)

### 1️⃣ Install Dependencies

```bash
npm install
```

### 2️⃣ Setup Environment Variables

File `.env.local` sudah tersedia dengan Supabase credentials. Jika perlu update:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
```

### 3️⃣ Run Development Server

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser! 🎉

## Available Commands

```bash
# Development server (with hot reload)
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Run linter
npm run lint
```

## Project Structure

```
rn-architect/
├── src/
│   ├── app/                    # Next.js pages (App Router)
│   │   ├── page.tsx           # Homepage
│   │   ├── about/             # About page
│   │   ├── services/          # Services page
│   │   ├── products/          # Products listing & detail
│   │   ├── projects/          # Projects listing & detail
│   │   ├── contact/           # Contact page
│   │   ├── login/             # Login page
│   │   └── admin/             # Admin dashboard
│   ├── components/            # React components
│   │   ├── site/              # Site-wide components
│   │   ├── ui/                # UI components (shadcn/ui)
│   │   └── providers/         # Context providers
│   ├── lib/                   # Utility functions
│   ├── hooks/                 # Custom React hooks
│   ├── integrations/          # Supabase integration
│   └── assets/                # Images
└── public/                    # Static files
```

## Key Features

✅ **Homepage** - Hero section dengan video, services, projects, products, testimonials  
✅ **About** - Company profile dan timeline  
✅ **Services** - Layanan yang ditawarkan  
✅ **Products** - Katalog produk dengan filter dan search  
✅ **Projects** - Portfolio proyek dengan kategori  
✅ **Contact** - Form kontak dengan Supabase integration  
✅ **Login** - Authentication dengan Supabase Auth  
✅ **Admin** - Protected dashboard untuk content management  

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4
- **UI:** Radix UI + shadcn/ui
- **Database:** Supabase
- **Auth:** Supabase Auth
- **State:** TanStack Query

## Testing

### Build Test
```bash
npm run build
```
Expected: ✅ Build successful with 11 routes

### Development Test
```bash
npm run dev
```
Expected: ✅ Server running on http://localhost:3000

## Deployment

### Deploy to Vercel (Recommended)

1. Push code ke GitHub
2. Import project di [vercel.com](https://vercel.com)
3. Set environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
4. Deploy! 🚀

### Deploy to Netlify

1. Connect repository
2. Build command: `npm run build`
3. Publish directory: `.next`
4. Set environment variables
5. Deploy!

## Common Issues & Solutions

### Issue: Build fails with TypeScript errors
**Solution:** Run `npm install` to ensure all dependencies are installed

### Issue: Supabase connection error
**Solution:** Check `.env.local` file and ensure credentials are correct

### Issue: Images not loading
**Solution:** Images are imported from `src/assets/` - ensure files exist

### Issue: Port 3000 already in use
**Solution:** Kill the process or use different port:
```bash
npm run dev -- -p 3001
```

## Database Setup

Project menggunakan Supabase dengan tabel:
- `products` - Katalog produk
- `projects` - Portfolio proyek
- `contact_messages` - Pesan dari contact form

Schema akan dibuat otomatis saat pertama kali menggunakan Supabase.

## Support

Untuk pertanyaan atau bantuan:
- 📧 Email: hello@rn-architect.com
- 💬 WhatsApp: +6281234567890

## Next Steps

1. ✅ Customize content di halaman-halaman
2. ✅ Upload produk dan proyek ke Supabase
3. ✅ Setup Google OAuth di Supabase dashboard
4. ✅ Deploy ke production
5. ✅ Setup custom domain

---

**Happy Coding! 🎨🏗️**
