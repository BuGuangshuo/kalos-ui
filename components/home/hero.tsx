"use client";
import Link from "next/link";
import { use, useEffect, useState, useSyncExternalStore } from "react";
import {
  AnimatePresence,
  LayoutGroup,
  motion,
  useReducedMotion,
} from "motion/react";
import { Check, Copy } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { site } from "@/lib/site";
import { installerCommand, type InstallationMode } from "@/lib/installer";
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
  mode = "add",
}: {
  name?: string;
  id?: string;
  kind?: "component" | "skill";
  mode?: InstallationMode;
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
      : installerCommand(origin, value, name, mode);
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

const libraryWords = ["Kalos UI", "Base UI", "Template"];
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
    <span className="motion-library-word" aria-hidden="true">
      <span className="motion-library-measure">
        {words.map(word => <span key={word}>{word}</span>)}
      </span>
      <AnimatePresence initial={false}>
        <motion.span
          className="motion-library-current"
          key={words[index % words.length]}
          initial={{ opacity: 0, y: "65%", filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: "-65%", filter: "blur(8px)" }}
          transition={{ duration: 0.45, ease: easeOut }}
        >
          {words[index % words.length]}
        </motion.span>
      </AnimatePresence>
    </span>
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
        精美优雅的React组件，按需安装源码，自由调整样式和交互。
      </motion.p>
      <motion.div {...rise(6)} className="motion-hero-install">
        <div className="hero-init-command"><CopyCommand mode="init" id="hero-init-command" /></div>
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
        <span>
          <svg viewBox="0 0 17 24" fill="currentColor" aria-hidden="true">
            <path d="M9.5001 7.01537C9.2245 6.99837 9 7.22385 9 7.49999V23C13.4183 23 17 19.4183 17 15C17 10.7497 13.6854 7.27351 9.5001 7.01537Z" />
            <path d="M8 9.8V12V23C3.58172 23 0 19.0601 0 14.2V12V1C4.41828 1 8 4.93989 8 9.8Z" />
          </svg>
          Base UI
        </span>
      </motion.div>
    </section>
  );
}
