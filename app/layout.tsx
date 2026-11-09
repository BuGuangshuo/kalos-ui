import type { Metadata } from "next";
import "./globals.css";
import { SiteShell } from "@/components/site-shell";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: {
    default: "Pop UI — Small details. Better interfaces.",
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
    <html lang="en" suppressHydrationWarning>
      <body>
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
