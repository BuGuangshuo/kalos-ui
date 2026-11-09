"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ThemeProvider, useTheme } from "next-themes";
import {
  ArrowUpRight,
  Check,
  Copy,
  Search,
  Sun,
  Moon,
  Menu,
  X,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Toaster, toast } from "sonner";
import { catalog } from "@/lib/catalog";
import { site } from "@/lib/site";
export function Mark() {
  return (
    <span className="brand-mark" aria-hidden="true">
      <span />
      <span />
      <span />
    </span>
  );
}
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
    `${item.title} ${item.description}`
      .toLowerCase()
      .includes(query.toLowerCase()),
  );
  return (
    <>
      <header className="site-header">
        <div className="header-inner">
          <Link href="/" className="brand" aria-label="Pop UI home">
            <Mark />
            <span>
              pop<span className="brand-ui">ui</span>
            </span>
          </Link>
          <nav className="desktop-nav" aria-label="Main navigation">
            <Link
              href="/components"
              aria-current={path.startsWith("/components") ? "page" : undefined}
            >
              Components <span className="nav-count">12</span>
            </Link>
            <Link
              href="/docs"
              aria-current={path === "/docs" ? "page" : undefined}
            >
              Documentation
            </Link>
          </nav>
          <div className="header-actions">
            <button
              className="search-trigger"
              onClick={() => setSearch(true)}
              aria-label="Search components"
            >
              <Search />
              <span>Search components…</span>
              <kbd>⌘ K</kbd>
            </button>
            <a
              className="icon-link"
              href={site.github}
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub repository"
            >
              <GithubIcon />
            </a>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Toggle color theme"
              onClick={() =>
                setTheme(resolvedTheme === "dark" ? "light" : "dark")
              }
            >
              <Sun className="theme-sun" />
              <Moon className="theme-moon" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="mobile-menu"
              aria-label={menu ? "Close navigation" : "Open navigation"}
              aria-expanded={menu}
              onClick={() => setMenu(!menu)}
            >
              {menu ? <X /> : <Menu />}
            </Button>
          </div>
        </div>
        {menu ? (
          <nav className="mobile-nav" aria-label="Mobile navigation">
            <Link onClick={() => setMenu(false)} href="/components">
              Components
            </Link>
            <Link onClick={() => setMenu(false)} href="/docs">
              Documentation
            </Link>
          </nav>
        ) : null}
      </header>
      <Dialog open={search} onOpenChange={setSearch}>
        <DialogContent>
          <DialogTitle>Find your next component</DialogTitle>
          <DialogDescription>Search the Pop UI collection.</DialogDescription>
          <Input
            aria-label="Search the collection"
            placeholder="Search components…"
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
                    <small>{item.category}</small>
                  </span>
                  <ArrowRight />
                </Link>
              ))
            ) : (
              <p className="muted">No matches. Try “button” or “card”.</p>
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
      width="19"
      height="19"
      aria-hidden="true"
    >
      <path d="M12 2C6.48 2 2 6.48 2 12a10 10 0 0 0 6.84 9.49c.5.09.68-.22.68-.48v-1.86c-2.78.6-3.37-1.18-3.37-1.18-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.89 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.64-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.99 1.03-2.69-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.03A9.6 9.6 0 0 1 12 6.82c.85 0 1.71.12 2.51.34 1.91-1.3 2.75-1.03 2.75-1.03.55 1.38.2 2.4.1 2.65.64.7 1.03 1.6 1.03 2.69 0 3.84-2.34 4.69-4.57 4.94.36.31.68.92.68 1.85v2.75c0 .27.18.58.69.48A10 10 0 0 0 22 12c0-5.52-4.48-10-10-10Z" />
    </svg>
  );
}
export function CopyButton({
  value,
  label = "Copy",
  compact = false,
}: {
  value: string;
  label?: string;
  compact?: boolean;
}) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );
  return (
    <Button
      variant="ghost"
      size={compact ? "icon" : "sm"}
      aria-label={copied ? "Copied" : label}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          setCopied(true);
          if (timer.current) clearTimeout(timer.current);
          timer.current = setTimeout(() => setCopied(false), 1800);
        } catch {
          toast.error("Could not copy. Select and copy the text manually.");
        }
      }}
    >
      {copied ? (
        <Check data-icon="inline-start" />
      ) : (
        <Copy data-icon="inline-start" />
      )}
      {compact ? null : copied ? "Copied" : label}
    </Button>
  );
}
export function InstallCommand({ slug = "pop-button" }: { slug?: string }) {
  const [origin, setOrigin] = useState(site.url);
  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);
  const value = `npx shadcn@latest add ${origin}/r/${slug}.json`;
  return (
    <div className="install-command">
      <span className="terminal-sign">❯</span>
      <code>{value}</code>
      <CopyButton value={value} label="Copy install command" compact />
    </div>
  );
}
export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <Header />
      <main id="main-content">{children}</main>
      <footer className="site-footer">
        <div>
          <Link href="/" className="brand">
            <Mark />
            <span>
              pop<span className="brand-ui">ui</span>
            </span>
          </Link>
          <p>A little more care. A lot more possibility.</p>
        </div>
        <div className="footer-links">
          <a href={site.github} target="_blank" rel="noreferrer">
            GitHub <ArrowUpRight />
          </a>
          <Link href="/docs">
            Documentation <ArrowUpRight />
          </Link>
          <span>Made by Alan · MIT license</span>
        </div>
      </footer>
      <Toaster position="bottom-right" />
    </ThemeProvider>
  );
}
