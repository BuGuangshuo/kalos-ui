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
import { KalosToaster } from "@/registry/kalos/kalos-toast";
import { catalog } from "@/lib/catalog";
import { site } from "@/lib/site";
import { installerCommand, type InstallationMode } from "@/lib/installer";
import { CopyButton } from "@/components/copy-button";
import { BrandLogo, GithubIcon } from "@/components/brand";
import { ThemeToggle } from "@/components/theme-toggle";
import { KalosTooltipProvider } from "@/registry/kalos/kalos-tooltip";
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
          <SiteNavigation className="desktop-nav" />
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
          <SiteNavigation className="mobile-nav" label="移动导航" onNavigate={() => setMenu(false)} />
        ) : null}
      </header>
    </>
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
      <DialogTrigger render={<Button className="pill-button" />}>
        安装组件库
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>将 Kalos UI 添加到项目</DialogTitle>
        <DialogDescription>
          在项目根目录运行，安装器会识别框架并安装 Base UI 组件源码。
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
      <KalosTooltipProvider>
      {home ? (
        <HomeShell>{children}</HomeShell>
      ) : (
        <>
          <Header />
          <main id="main-content">{children}</main>
        </>
      )}
      <Toaster position="bottom-right" />
      <KalosToaster />
      </KalosTooltipProvider>
    </ThemeProvider>
  );
}
