import type { Metadata } from "next";
import "./globals.css";
import { SiteShell } from "@/components/site-shell";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: {
    default: "Pop UI — 从基础出发，让想法成真。",
    template: "%s · Pop UI",
  },
  description: site.description,
  icons: { icon: "/icon.svg" },
  openGraph: {
    title: "Pop UI",
    description: site.description,
    type: "website",
  },
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body>
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
