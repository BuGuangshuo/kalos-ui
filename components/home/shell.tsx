"use client";

import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import {
  AnimatePresence,
  LayoutGroup,
  MotionConfig,
  motion,
  useReducedMotion,
} from "motion/react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { site } from "@/lib/site";
import { PopLogo } from "./logo";
import { easeOut, IntroContext, PackageManagerContext } from "./runtime";

const logoGlide = {
  type: "spring",
  stiffness: 150,
  damping: 24,
  mass: 0.9,
} as const;

function HomeThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label="切换深浅主题"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className="motion-theme-toggle"
    >
      <Sun className="theme-sun" />
      <Moon className="theme-moon" />
    </Button>
  );
}

export function HomeShell({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();
  const [playing, setPlaying] = useState(true);
  const [done, setDone] = useState(false);
  const [manager, setManager] = useState("npm");
  const intro = playing && !reduce;
  useEffect(() => {
    if (reduce) return;
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = "hidden";
    const glide = setTimeout(() => setPlaying(false), 2050);
    const finish = setTimeout(() => {
      root.style.overflow = previous;
      setDone(true);
    }, 2388);
    return () => {
      clearTimeout(glide);
      clearTimeout(finish);
      root.style.overflow = previous;
    };
  }, [reduce]);

  return (
    <MotionConfig reducedMotion="user">
      <LayoutGroup id="pop-home">
        <IntroContext value={{ playing: intro, done: done || Boolean(reduce) }}>
          <PackageManagerContext value={{ manager, setManager }}>
            <div
              className="pop-motion-home"
              data-intro={intro ? "playing" : "done"}
            >
              <a className="skip-link" href="#main-content">
                跳至主要内容
              </a>
              <AnimatePresence>
                {intro ? (
                  <motion.div
                    key="intro"
                    className="motion-intro-overlay"
                    aria-hidden="true"
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6, ease: easeOut }}
                  >
                    <motion.div
                      className="motion-intro-glow"
                      initial={{ opacity: 0, scale: 0.4 }}
                      animate={{
                        opacity: [0, 0, 1, 0.6],
                        scale: [0.4, 0.4, 1.1, 1],
                      }}
                      transition={{
                        duration: 2.05,
                        times: [0, 1.3 / 2.05, 0.85, 1],
                        ease: easeOut,
                      }}
                    />
                  </motion.div>
                ) : null}
              </AnimatePresence>
              {intro ? (
                <div className="motion-intro-logo" aria-hidden="true">
                  <motion.div
                    layoutId="home-logo"
                    transition={{ layout: logoGlide }}
                    className="motion-intro-wordmark"
                  >
                    <PopLogo draw />
                  </motion.div>
                </div>
              ) : null}
              {intro ? (
                <button
                  className="motion-skip-intro"
                  onClick={() => {
                    setPlaying(false);
                    setDone(true);
                    document.documentElement.style.overflow = "";
                  }}
                >
                  跳过开场动画
                </button>
              ) : null}
              <header className="motion-home-header" aria-label="首页导航">
                <div className="motion-header-inner">
                  <Link
                    href="/"
                    aria-label="Pop UI 首页"
                    className="motion-header-brand"
                  >
                    {!intro ? (
                      <motion.div
                        layoutId="home-logo"
                        transition={{ layout: logoGlide }}
                      >
                        <PopLogo />
                      </motion.div>
                    ) : null}
                  </Link>
                  <motion.div
                    className="motion-header-actions"
                    inert={intro}
                    initial={false}
                    animate={
                      intro
                        ? { opacity: 0, x: 24, filter: "blur(6px)" }
                        : { opacity: 1, x: 0, filter: "blur(0px)" }
                    }
                    transition={{ duration: 0.6, ease: easeOut, delay: 0.25 }}
                  >
                    <nav aria-label="主导航">
                      <Link href="/docs/getting-started">文档</Link>
                      <Link href="/components">组件</Link>
                      <Link href="/docs/tokens">设计变量</Link>
                    </nav>
                    <motion.a
                      className="motion-github-link"
                      href={site.github}
                      target="_blank"
                      rel="noreferrer"
                      aria-label="GitHub 仓库"
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.94 }}
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path d="M12 2C6.48 2 2 6.48 2 12a10 10 0 0 0 6.84 9.49c.5.09.68-.22.68-.48v-1.86c-2.78.6-3.37-1.18-3.37-1.18-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.89 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.64-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.99 1.03-2.69-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.03A9.6 9.6 0 0 1 12 6.82c.85 0 1.71.12 2.51.34 1.91-1.3 2.75-1.03 2.75-1.03.55 1.38.2 2.4.1 2.65.64.7 1.03 1.6 1.03 2.69 0 3.84-2.34 4.69-4.57 4.94.36.31.68.92.68 1.85v2.75c0 .27.18.58.69.48A10 10 0 0 0 22 12c0-5.52-4.48-10-10-10Z" />
                      </svg>
                      <span>GitHub</span>
                    </motion.a>
                    <HomeThemeToggle />
                  </motion.div>
                </div>
              </header>
              <main
                id="main-content"
                tabIndex={-1}
                inert={intro}
                aria-busy={intro}
              >
                {children}
              </main>
              <footer className="motion-home-footer">
                <p>
                  由 <a href={site.github}>Alan</a> 构建，源码开放在{" "}
                  <a href={site.github}>GitHub</a>。
                </p>
                <nav aria-label="页脚导航">
                  <Link href="/docs/getting-started">文档</Link>
                  <a href={site.figma} target="_blank" rel="noreferrer">
                    Figma
                  </a>
                  <Link href="/components">组件库</Link>
                </nav>
              </footer>
            </div>
          </PackageManagerContext>
        </IntroContext>
      </LayoutGroup>
    </MotionConfig>
  );
}
