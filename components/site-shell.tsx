"use client";
import {
  usePrimitive,
  PrimitiveSwitcher,
  PrimitiveText,
} from "@/components/primitives";
import Link from "next/link";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { useEffect, useState, useSyncExternalStore } from "react";
import { ThemeProvider, useTheme } from "next-themes";
import {
  ArrowUpRight,
  Search,
  Sun,
  Moon,
  Menu,
  X,
  ArrowRight,
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
import { Input } from "@/components/ui/input";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";
import { catalog } from "@/lib/catalog";
import { site } from "@/lib/site";
import { CopyButton } from "@/components/copy-button";
import { BrandLogo } from "@/components/brand";
import {
  FrameworkSwitcher,
  useFramework,
} from "@/components/framework";
const HomeShell = dynamic(() =>
  import("@/components/home/shell").then((module) => module.HomeShell),
);
function Header() {
  const path = usePathname();
  const { resolvedTheme, setTheme } = useTheme();
  const [search, setSearch] = useState(false);
  const [query, setQuery] = useState("");
  const [menu, setMenu] = useState(false);
  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
        setSearch((value) => !value);
      }
    };
    window.addEventListener("keydown", listener);
    return () => window.removeEventListener("keydown", listener);
  }, []);
  const results = catalog.filter((item) =>
    `${item.title} ${item.english} ${item.description}`
      .toLowerCase()
      .includes(query.toLowerCase()),
  );
  return (
    <>
      <a className="skip-link" href="#main-content">
        跳至主要内容
      </a>
      <header className={cn("site-header", path === "/" && "home-header")}>
        <div className="header-inner">
          <Link href="/" className="brand" aria-label="Pop UI 首页">
            <BrandLogo className="brand-lockup" />
          </Link>
          <nav className="desktop-nav" aria-label="主导航">
            <Link
              href="/docs/getting-started"
              aria-current={path.startsWith("/docs") ? "page" : undefined}
            >
              文档
            </Link>
            <Link
              href="/components"
              aria-current={path.startsWith("/components") ? "page" : undefined}
            >
              组件
            </Link>
            <Link href="/docs/tokens">设计变量</Link>
            <Link href="/docs/skills">Skills</Link>
          </nav>
          <div className="header-actions">
            <FrameworkSwitcher className="header-framework" />
            <Button
              variant="ghost"
              size="icon"
              aria-label="搜索组件"
              onClick={() => setSearch(true)}
            >
              <Search />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              aria-label="切换深浅主题"
              onClick={() =>
                setTheme(resolvedTheme === "dark" ? "light" : "dark")
              }
            >
              <Sun className="theme-sun" />
              <Moon className="theme-moon" />
            </Button>
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
            <Link onClick={() => setMenu(false)} href="/docs/getting-started">
              文档
            </Link>
            <Link onClick={() => setMenu(false)} href="/components">
              组件
            </Link>
            <Link onClick={() => setMenu(false)} href="/docs/tokens">
              设计变量
            </Link>
            <Link onClick={() => setMenu(false)} href="/docs/skills">
              Skills
            </Link>
          </nav>
        ) : null}
      </header>
      <Dialog open={search} onOpenChange={setSearch}>
        <DialogContent>
          <DialogTitle>搜索组件</DialogTitle>
          <DialogDescription>查找组件、预览与使用文档。</DialogDescription>
          <Input
            aria-label="搜索组件名称"
            placeholder="输入名称或关键词…"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <div className="search-results">
            {results.length ? (
              results.map((item) => (
                <Link
                  onClick={() => setSearch(false)}
                  key={item.slug}
                  href={`/components/${item.slug}`}
                >
                  <span>
                    {item.title}
                    <small>
                      {item.english} · {item.category}
                    </small>
                  </span>
                  <ArrowRight />
                </Link>
              ))
            ) : (
              <p className="muted">未找到匹配的组件，请尝试其他关键词。</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
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

export function InstallCommand({ slug = "pop-button" }: { slug?: string }) {
  const { framework } = useFramework();
  const { primitive } = usePrimitive();
  const origin = useSyncExternalStore(
    subscribeOrigin,
    getOrigin,
    getServerOrigin,
  );
  const value = `npx ${framework === "vue" ? "shadcn-vue" : "shadcn"}@latest add ${origin}/r/${framework === "vue" ? "vue/" : `${primitive}/`}${slug}.json`;
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
        <DialogTitle>将 Pop UI 添加到项目</DialogTitle>
        <DialogDescription>
          <PrimitiveText
            radix="先初始化 Radix 版 shadcn/ui"
            base="先初始化 Base UI 版 shadcn/ui"
            aria="先初始化 React Aria 版 shadcn/ui"
            vue="先初始化 shadcn-vue"
          />
          ，再运行以下命令。全部 12 个组件及所需基础组件会自动安装。
        </DialogDescription>
        <PrimitiveSwitcher />
        <InstallCommand slug="pop-all" />
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
          <footer className="site-footer">
            <div>
              <Link href="/" className="brand" aria-label="Pop UI 首页">
                <BrandLogo className="brand-lockup" />
              </Link>
              <p>为你的下一个界面，准备好组件。</p>
            </div>
            <div className="footer-links">
              <Link href="/docs/getting-started">使用文档</Link>
              <Link href="/docs/skills">
                Skills <ArrowUpRight />
              </Link>
              <a href={site.github} target="_blank" rel="noreferrer">
                GitHub <ArrowUpRight />
              </a>
              <span>由 Alan 构建 · MIT 开源许可</span>
            </div>
          </footer>
        </>
      )}
      <Toaster position="bottom-right" />
    </ThemeProvider>
  );
}
