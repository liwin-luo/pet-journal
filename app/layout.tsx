import type { Metadata, Viewport } from "next";
import { Noto_Sans_SC, Noto_Serif_SC } from "next/font/google";
import { Shell } from "@/components/shell";
import "./globals.css";

const display = Noto_Serif_SC({
  weight: "700",
  subsets: ["latin"],
  variable: "--font-display",
  preload: false,
});

const body = Noto_Sans_SC({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-body",
  preload: false,
});

export const metadata: Metadata = {
  title: "宠物手账",
  description: "给家里那只写今天，再配一张手账图",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" className={`${display.variable} ${body.variable}`}>
      <body>
        <Shell>{children}</Shell>
      </body>
    </html>
  );
}
