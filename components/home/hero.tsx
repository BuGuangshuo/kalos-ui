"use client";

import Link from "next/link";
import { use, useEffect, useState, useSyncExternalStore } from "react";
import {
  AnimatePresence,
  LayoutGroup,
  motion,
  useReducedMotion,
} from "motion/react";
import {
  Box,
  Check,
  Code2,
  Copy,
  PenTool,
  Layers,
  Palette,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { site } from "@/lib/site";
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
  name = "pop-all",
  id = "hero-command",
}: {
  name?: string;
  id?: string;
}) {
  const { manager, setManager } = use(PackageManagerContext);
  const [copied, setCopied] = useState(false);
  const origin = useSyncExternalStore(
    subscribeOrigin,
    getOrigin,
    getServerOrigin,
  );
  const command = (value: string) =>
    `${runners[value as keyof typeof runners]} shadcn@latest add ${origin}/r/${name}.json`;
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

const words = ["shadcn/ui", "React", "Radix UI", "产品界面"];
function CyclingLibrary({ done }: { done: boolean }) {
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
  }, [done, reduce]);
  return (
    <motion.span
      layout
      className="motion-library-word"
      aria-hidden="true"
      transition={{ type: "spring", stiffness: 200, damping: 28 }}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={words[index]}
          initial={{ opacity: 0, y: "65%", filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: "-65%", filter: "blur(8px)" }}
          transition={{ duration: 0.45, ease: easeOut }}
        >
          {words[index]}
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
  const rise = (index: number) => ({
    initial: { opacity: 0, y: 20, filter: "blur(10px)" },
    animate: done
      ? { opacity: 1, y: 0, filter: "blur(0px)" }
      : { opacity: 0, y: 20, filter: "blur(10px)" },
    transition: { duration: 0.7, ease: easeOut, delay: index * 0.09 },
  });
  return (
    <section className="motion-home-hero">
      <motion.div {...rise(0)} className="motion-framework-pill">
        <span>
          <Code2 /> React
        </span>
        <a href={site.figma} target="_blank" rel="noreferrer">
          <PenTool /> Figma
        </a>
      </motion.div>
      <h1
        className="motion-hero-title"
        aria-label="一行命令，让你的组件拥有自然流畅的交互。"
      >
        <span className="motion-hero-first-line">
          <span>
            <SplitLine parts={["一行命令，", "让你的"]} done={done} />
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
          <SplitLine
            parts={["组件拥有", "自然流畅", "的交互。"]}
            done={done}
            delay={0.3}
          />
        </span>
      </h1>
      <motion.p {...rise(5)} className="motion-hero-subtitle">
        可自由定制的 React 组件，基于 Radix UI 与 shadcn/ui。
        <br className="motion-desktop-break" />
        保留你的风格与源码，让每一次交互自然发生。
      </motion.p>
      <motion.div {...rise(6)} className="motion-hero-install">
        <CopyCommand />
        <div className="motion-hero-actions">
          <Link href="/docs/getting-started" className="motion-primary-link">
            开始使用
          </Link>
          <Link href="/components" className="motion-secondary-link">
            浏览组件
          </Link>
        </div>
      </motion.div>
      <motion.div {...rise(7)} className="motion-stack-logos">
        <span>
          <Layers /> Radix UI
        </span>
        <span>
          <Box /> shadcn/ui
        </span>
        <span>
          <Palette /> Tailwind CSS
        </span>
      </motion.div>
    </section>
  );
}
