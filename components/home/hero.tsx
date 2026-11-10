"use client";
import { catalog } from "@/lib/catalog";

import Link from "next/link";
import { use, useEffect, useState, useSyncExternalStore } from "react";
import {
  AnimatePresence,
  LayoutGroup,
  motion,
  useReducedMotion,
} from "motion/react";
import { Box, Check, Copy, Layers, Palette } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { site } from "@/lib/site";
import { FrameworkSwitcher, useFramework } from "@/components/framework";
import { installerCommand } from "@/lib/installer";
import { easeOut, PackageManagerContext, useIntro } from "./runtime";

const managers = ["npm", "pnpm", "yarn", "bun"] as const;
const runners = {
  npm: "npx",
  pnpm: "pnpm dlx",
  yarn: "yarn dlx",
  bun: "bun x",
};
const subscribeOrigin = () => () => {};
const getOrigin = () => window.location.origin;
const getServerOrigin = () => site.url;

export function CopyCommand({
  name = "kalos-all",
  id = "hero-command",
  kind = "component",
}: {
  name?: string;
  id?: string;
  kind?: "component" | "skill";
}) {
  const { manager, setManager } = use(PackageManagerContext);
  const [copied, setCopied] = useState(false);
  const origin = useSyncExternalStore(
    subscribeOrigin,
    getOrigin,
    getServerOrigin,
  );
  const command = (value: string) =>
    kind === "skill"
      ? `${runners[value as keyof typeof runners]} skills add BuGuangshuo/kalos-ui --skill kalos-ui`
      : installerCommand(origin, value, name);
  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 1600);
    return () => clearTimeout(timer);
  }, [copied]);
  return (
    <LayoutGroup id={id}>
      <Tabs
        value={manager}
        onValueChange={setManager}
        className="motion-copy-command"
      >
        <TabsList
          aria-label="包管理器"
          variant="line"
          className="motion-manager-list"
        >
          {managers.map((value) => (
            <TabsTrigger
              key={value}
              value={value}
              className="motion-manager-trigger"
            >
              {manager === value ? (
                <motion.span
                  layoutId="manager-highlight"
                  className="motion-manager-highlight"
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                />
              ) : null}
              <span>{value}</span>
            </TabsTrigger>
          ))}
        </TabsList>
        <div className="motion-command-box">
          {managers.map((value) => (
            <TabsContent
              key={value}
              value={value}
              className="motion-command-content"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={manager}
                  initial={{ opacity: 0, y: 7, filter: "blur(4px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -7 }}
                  transition={{ duration: 0.25 }}
                >
                  <span aria-hidden="true">$</span>
                  <code>{command(value)}</code>
                </motion.div>
              </AnimatePresence>
            </TabsContent>
          ))}
          <button
            type="button"
            className="motion-command-copy"
            aria-label={copied ? "安装命令已复制" : "复制安装命令"}
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(command(manager));
                setCopied(true);
              } catch {
                setCopied(false);
              }
            }}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={copied ? "copied" : "copy"}
                initial={{ opacity: 0, scale: 0.6, filter: "blur(3px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: 0.6 }}
              >
                {copied ? <Check /> : <Copy />}
              </motion.span>
            </AnimatePresence>
          </button>
        </div>
      </Tabs>
    </LayoutGroup>
  );
}

const libraryWords = ["shadcn/ui", "Base UI", "Radix UI", "React Aria"];
function CyclingLibrary({ done }: { done: boolean }) {
  const words = libraryWords;
  const [index, setIndex] = useState(0);
  const reduce = useReducedMotion();
  useEffect(() => {
    if (!done || reduce) return;
    let interval: ReturnType<typeof setInterval> | undefined;
    const timer = setTimeout(() => {
      setIndex((i) => (i + 1) % words.length);
      interval = setInterval(
        () => setIndex((i) => (i + 1) % words.length),
        2600,
      );
    }, 4000);
    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [done, reduce, words]);
  return (
    <motion.span
      layout
      className="motion-library-word"
      aria-hidden="true"
      transition={{ type: "spring", stiffness: 200, damping: 28 }}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={words[index % words.length]}
          initial={{ opacity: 0, y: "65%", filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: "-65%", filter: "blur(8px)" }}
          transition={{ duration: 0.45, ease: easeOut }}
        >
          {words[index % words.length]}
        </motion.span>
      </AnimatePresence>
    </motion.span>
  );
}

function SplitLine({
  parts,
  done,
  delay = 0,
}: {
  parts: string[];
  done: boolean;
  delay?: number;
}) {
  return (
    <>
      {parts.map((part, index) => (
        <motion.span
          key={part}
          className="motion-split-word"
          initial={{ opacity: 0, y: 24, filter: "blur(12px)" }}
          animate={
            done
              ? { opacity: 1, y: 0, filter: "blur(0px)" }
              : { opacity: 0, y: 24, filter: "blur(12px)" }
          }
          transition={{
            duration: 0.7,
            ease: easeOut,
            delay: delay + index * 0.07,
          }}
        >
          {part}
        </motion.span>
      ))}
    </>
  );
}

export function MotionHero() {
  const { done } = useIntro();
  const { framework } = useFramework();
  const rise = (index: number) => ({
    initial: { opacity: 0, y: 20, filter: "blur(10px)" },
    animate: done
      ? { opacity: 1, y: 0, filter: "blur(0px)" }
      : { opacity: 0, y: 20, filter: "blur(10px)" },
    transition: { duration: 0.7, ease: easeOut, delay: index * 0.09 },
  });
  return (
    <section className="motion-home-hero">
      <motion.div {...rise(0)}>
        <FrameworkSwitcher className="motion-framework-pill" />
      </motion.div>
      <h1 className="motion-hero-title" aria-label="构建界面，从组件开始。">
        <span className="motion-hero-first-line">
          <span>
            <SplitLine parts={["构建界面，从"]} done={done} />
          </span>{" "}
          <motion.span
            className="motion-library-entrance"
            initial={{ opacity: 0, y: 24, filter: "blur(12px)" }}
            animate={
              done
                ? { opacity: 1, y: 0, filter: "blur(0px)" }
                : { opacity: 0, y: 24, filter: "blur(12px)" }
            }
            transition={{ duration: 0.7, ease: easeOut, delay: 0.14 }}
          >
            <CyclingLibrary done={done} />
          </motion.span>
        </span>
        <span>
          <SplitLine parts={["组件", "开始。"]} done={done} delay={0.3} />
        </span>
      </h1>
      <motion.p {...rise(5)} className="motion-hero-subtitle">
        {catalog.length} 个基础组件，适配 {framework === "vue" ? "Vue" : "React"} 项目。
        <br className="motion-desktop-break" />
        按需安装源码，自由调整样式和交互。
      </motion.p>
      <motion.div {...rise(6)} className="motion-hero-install">
        <CopyCommand />
        <p className="motion-install-hint">
          {framework === "vue" ? "自动识别 Vue 项目，安装 Reka UI 版本。" : "运行后在终端选择基础组件库。"}
        </p>
        <div className="motion-hero-actions">
          <Link href="/docs/getting-started" className="motion-primary-link">
            开始使用
          </Link>
          <Link href="/components" className="motion-secondary-link">
            查看组件
          </Link>
        </div>
      </motion.div>
      <motion.div {...rise(7)} className="motion-stack-logos">
        {framework === "vue" ? (
          <>
            <span><Layers /> Reka UI</span>
            <span><Box /> shadcn-vue</span>
            <span><Palette /> Tailwind CSS</span>
          </>
        ) : (
          <>
            <span>
              <svg viewBox="0 0 17 24" fill="currentColor" aria-hidden="true">
                <path d="M9.5001 7.01537C9.2245 6.99837 9 7.22385 9 7.49999V23C13.4183 23 17 19.4183 17 15C17 10.7497 13.6854 7.27351 9.5001 7.01537Z" />
                <path d="M8 9.8V12V23C3.58172 23 0 19.0601 0 14.2V12V1C4.41828 1 8 4.93989 8 9.8Z" />
              </svg>
              Base UI
            </span>
            <span>
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M11.52 24a7.68 7.68 0 0 1-7.68-7.68 7.68 7.68 0 0 1 7.68-7.68V24Zm0-24v7.68H3.84V0h7.68Zm4.8 7.68a3.84 3.84 0 1 1 0-7.68 3.84 3.84 0 0 1 0 7.68Z" />
              </svg>
              Radix UI
            </span>
            <span>
              <svg viewBox="200 206 800 790" fill="currentColor" aria-hidden="true">
                <path d="M720.67 205.995C867.583 205.995 986.679 325.091 986.68 472.003C986.68 590.753 908.865 691.325 801.446 725.521L979.312 948.055C994.438 966.98 980.963 995 956.736 995H795.612C778.743 995 762.715 987.629 751.734 974.823L697.365 911.421L493.126 653.39C457.134 607.918 489.518 540.979 547.511 540.977L720.67 540.971C758.758 540.971 789.635 510.091 789.635 472.003C789.634 433.915 758.758 403.038 720.67 403.038H429.939C404.955 403.038 388.623 391.886 373.994 373.623L277.349 252.966C262.194 234.045 275.664 205.996 299.905 205.995H720.67Z M396.605 720.706C407.798 705.406 430.443 704.843 442.381 719.568L503.816 797.018H502.786L535.569 838.934C548.074 854.358 549.943 877.191 538.047 893.09L476.638 972.545C465.692 986.707 448.803 995 430.903 995H242.276C218.18 995 204.665 967.248 219.523 948.278L337.992 797.018H337.923L396.605 720.706Z" />
              </svg>
              React Aria
            </span>
          </>
        )}
      </motion.div>
    </section>
  );
}
