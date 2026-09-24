import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Geist_Mono, Manrope } from "next/font/google";
import { BackgroundLayer } from "@/components/background/BackgroundLayer";
import { Footer } from "@/components/layout/Footer";
import { Nav } from "@/components/layout/Nav";
import { site } from "@/content/site";
import { ScrollProvider } from "@/providers/ScrollProvider";
import "./globals.css";

const manrope = Manrope({ variable: "--font-manrope", subsets: ["latin"], weight: ["400", "500", "700"], display: "swap" });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: `${site.name} — ${site.role}`,
  description: site.tagline,
};

export const viewport: Viewport = {
  themeColor: "#050505",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${manrope.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <ScrollProvider>
          {/* z-0 background, z-10 content, z-40 nav */}
          <BackgroundLayer />
          <Nav />
          <main id="main" tabIndex={-1} className="relative z-10 flex-1 outline-none">{children}</main>
          <Footer />
        </ScrollProvider>
      </body>
    </html>
  );
}
