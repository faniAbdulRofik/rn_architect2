import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { QueryProvider } from "@/components/providers/QueryProvider";

export const metadata: Metadata = {
  title: "RN_ARCHITECT — Studio Arsitektur & Interior",
  description:
    "Studio arsitektur dan interior yang menerjemahkan ruang menjadi pengalaman tinggal yang tenang, fungsional, dan tahan waktu.",
  openGraph: {
    type: "website",
    title: "RN_ARCHITECT — Studio Arsitektur & Interior",
    description:
      "Studio arsitektur dan interior yang menerjemahkan ruang menjadi pengalaman tinggal yang tenang, fungsional, dan tahan waktu.",
    images: [
      {
        url: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/b04601a1-d6b6-4657-a455-c76747ea615e/id-preview-5830dbb5--d0315345-08e4-466d-968b-c156e12f4468.lovable.app-1778403287487.png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "RN_ARCHITECT — Studio Arsitektur & Interior",
    description:
      "Studio arsitektur dan interior yang menerjemahkan ruang menjadi pengalaman tinggal yang tenang, fungsional, dan tahan waktu.",
    images: [
      "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/b04601a1-d6b6-4657-a455-c76747ea615e/id-preview-5830dbb5--d0315345-08e4-466d-968b-c156e12f4468.lovable.app-1778403287487.png",
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap"
        />
      </head>
      <body>
        <QueryProvider>
          {children}
          <Toaster />
        </QueryProvider>
      </body>
    </html>
  );
}
