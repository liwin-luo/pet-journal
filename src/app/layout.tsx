import type { ReactNode } from "react";
import "./globals.css";

export default function RootLayout({ children }: { children: ReactNode }) {
  // 根布局仅为透传：<html> 由 [locale]/layout 提供（默认语言由 middleware 改写进来）。
  return children;
}
