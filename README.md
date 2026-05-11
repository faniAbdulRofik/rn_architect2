# RN_ARCHITECT — Studio Arsitektur & Interior

Website portfolio dan katalog produk untuk RN_ARCHITECT, studio arsitektur dan interior design.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **UI Components**: Radix UI + shadcn/ui
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **State Management**: TanStack Query (React Query)
- **Forms**: React Hook Form + Zod
- **Animations**: tw-animate-css
- **Icons**: Lucide React

## Features

- ✅ Responsive design dengan mobile-first approach
- ✅ Server-side rendering (SSR) dengan Next.js App Router
- ✅ Dynamic routing untuk products dan projects
- ✅ Supabase integration untuk database dan authentication
- ✅ Admin dashboard untuk content management
- ✅ Contact form dengan database integration
- ✅ WhatsApp integration untuk direct messaging
- ✅ Media carousel dengan support untuk images dan videos
- ✅ SEO-optimized dengan metadata API
- ✅ Custom Tailwind theme dengan brand colors
- ✅ Smooth animations dan transitions

## Getting Started

### Prerequisites

- Node.js 18+ atau Bun
- npm, yarn, atau bun

### Installation

1. Clone repository:
```bash
git clone <repository-url>
cd rn-architect
```

2. Install dependencies:
```bash
npm install
# atau
yarn install
# atau
bun install
```

3. Setup environment variables:

Buat file `.env.local` di root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
```

4. Run development server:
```bash
npm run dev
# atau
yarn dev
# atau
bun dev
```

5. Open [http://localhost:3000](http://localhost:3000) di browser.

### Build for Production

```bash
npm run build
npm run start
```

## Project Structure

```
rn-architect/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── about/             # About page
│   │   ├── admin/             # Admin dashboard
│   │   ├── contact/           # Contact page
│   │   ├── login/             # Login page
│   │   ├── products/          # Products listing & detail
│   │   ├── projects/          # Projects listing & detail
│   │   ├── services/          # Services page
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Homepage
│   │   └── globals.css        # Global styles
│   ├── assets/                # Static assets (images)
│   ├── components/            # React components
│   │   ├── providers/         # Context providers
│   │   ├── site/              # Site-wide components
│   │   └── ui/                # UI components (shadcn/ui)
│   ├── hooks/                 # Custom React hooks
│   ├── integrations/          # Third-party integrations
│   │   └── supabase/          # Supabase client & types
│   └── lib/                   # Utility functions
├── public/                    # Public static files
├── .env.local                 # Environment variables (not in git)
├── next.config.ts             # Next.js configuration
├── package.json               # Dependencies
├── tailwind.config.ts         # Tailwind configuration
└── tsconfig.json              # TypeScript configuration
```

## Database Schema

Project menggunakan Supabase dengan tabel berikut:

- `products` - Katalog produk interior
- `projects` - Portfolio proyek arsitektur
- `contact_messages` - Pesan dari contact form

## Deployment

Project ini siap untuk deployment di Vercel:

1. Push code ke GitHub
2. Import project di [Vercel](https://vercel.com)
3. Set environment variables di Vercel dashboard
4. Deploy!

## Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase anon/public key |

## License

© 2024 RN_ARCHITECT. All rights reserved.

## Support

Untuk pertanyaan atau support, hubungi:
- Email: hello@rn-architect.com
- WhatsApp: +6281234567890
