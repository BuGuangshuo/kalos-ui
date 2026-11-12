"use client";
import Link from "next/link";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { useState, useSyncExternalStore } from "react";
import { ThemeProvider } from "next-themes";
import {
  Menu,
  X,
  Terminal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Toaster } from "@/components/ui/sonner";
import { catalog } from "@/lib/catalog";
import { site } from "@/lib/site";
import { installerCommand, type InstallationMode } from "@/lib/installer";
import { CopyButton } from "@/components/copy-button";
import { BrandLogo } from "@/components/brand";
import { ThemeToggle } from "@/components/theme-toggle";
import { GlobalSearch } from "@/components/global-search";
import { SiteNavigation } from "@/components/site-navigation";
const HomeShell = dynamic(() =>
  import("@/components/home/shell").then((module) => module.HomeShell),
);
function Header() {
  const [menu, setMenu] = useState(false);
  return (
    <>
      <a className="skip-link" href="#main-content">
        跳至主要内容
      </a>
      <header className="site-header">
        <div className="header-inner">
          <Link href="/" className="brand" aria-label="Kalos UI 首页">
            <BrandLogo className="brand-lockup" />
          </Link>
          <nav className="desktop-nav" aria-label="主导航">
            <SiteNavigation />
          </nav>
          <div className="header-actions">
            <GlobalSearch />
            <ThemeToggle />
            <a
              className="icon-link"
              href={site.github}
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub 仓库"
            >
              <GithubIcon />
            </a>
            <Link className="nav-start" href="/docs/getting-started">
              开始使用
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="mobile-menu"
              aria-label={menu ? "关闭导航" : "打开导航"}
              aria-expanded={menu}
              onClick={() => setMenu(!menu)}
            >
              {menu ? <X /> : <Menu />}
            </Button>
          </div>
        </div>
        {menu ? (
          <nav className="mobile-nav" aria-label="移动导航">
            <SiteNavigation onNavigate={() => setMenu(false)} />
          </nav>
        ) : null}
      </header>
    </>
  );
}
export function GithubIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      width="18"
      height="18"
      aria-hidden="true"
    >
      <path d="M12 2C6.48 2 2 6.48 2 12a10 10 0 0 0 6.84 9.49c.5.09.68-.22.68-.48v-1.86c-2.78.6-3.37-1.18-3.37-1.18-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.89 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.64-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.99 1.03-2.69-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.03A9.6 9.6 0 0 1 12 6.82c.85 0 1.71.12 2.51.34 1.91-1.3 2.75-1.03 2.75-1.03.55 1.38.2 2.4.1 2.65.64.7 1.03 1.6 1.03 2.69 0 3.84-2.34 4.69-4.57 4.94.36.31.68.92.68 1.85v2.75c0 .27.18.58.69.48A10 10 0 0 0 22 12c0-5.52-4.48-10-10-10Z" />
    </svg>
  );
}
export { CopyButton } from "@/components/copy-button";
const subscribeOrigin = () => () => {};
const getOrigin = () => window.location.origin;
const getServerOrigin = () => site.url;

export function InstallCommand({ slug = "kalos-button", manager = "npm", mode = "add", template }: { slug?: string; manager?: string; mode?: InstallationMode; template?: string }) {
  const origin = useSyncExternalStore(
    subscribeOrigin,
    getOrigin,
    getServerOrigin,
  );
  const value = installerCommand(origin, manager, slug, mode, template);
  return (
    <div className="install-command">
      <Terminal />
      <code>{value}</code>
      <CopyButton value={value} label="复制安装命令" compact />
    </div>
  );
}
export function BundleInstall() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="pill-button">安装组件库</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>将 Kalos UI 添加到项目</DialogTitle>
        <DialogDescription>
          在项目根目录运行，安装器会识别框架，并在终端引导选择基础组件库。
          全部 {catalog.length} 个组件及所需基础组件会自动安装。
        </DialogDescription>
        <InstallCommand slug="kalos-all" />
      </DialogContent>
    </Dialog>
  );
}
export function SiteShell({ children }: { children: React.ReactNode }) {
  const home = usePathname() === "/";
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      {home ? (
        <HomeShell>{children}</HomeShell>
      ) : (
        <>
          <Header />
          <main id="main-content">{children}</main>
        </>
      )}
      <Toaster position="bottom-right" />
    </ThemeProvider>
  );
}
