import type { Metadata } from "next";
import { Oswald, Inter, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";


const oswald = Oswald({
  weight: ["500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-oswald",
});
const inter = Inter({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});
const plexMono = IBM_Plex_Mono({
  weight: ["400", "500"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-plex-mono",
});

export const metadata: Metadata = {
  title: "AIK Freight Dispatch — Freight Dispatch Services",
  description:
    "We handle the calls, negotiation, and paperwork so you can focus on what matters—driving and growing your business.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${oswald.variable} ${inter.variable} ${plexMono.variable}`}>
      <body className="bg-ink-950 text-ivory-50 antialiased">
        
        {children}
      </body>
    </html>
  );
}