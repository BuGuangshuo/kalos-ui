"use client";

import { useSyncExternalStore } from "react";
import { Code2 } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CopyButton } from "@/components/copy-button";

export type Framework = "react" | "vue";
const event = "pop-ui-framework";
function subscribe(callback: () => void) {
  window.addEventListener(event, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(event, callback);
    window.removeEventListener("storage", callback);
  };
}
function snapshot(): Framework {
  try {
    return localStorage.getItem(event) === "vue" ? "vue" : "react";
  } catch {
    return "react";
  }
}
export function useFramework() {
  const framework = useSyncExternalStore(
    subscribe,
    snapshot,
    () => "react" as Framework,
  );
  const setFramework = (value: string) => {
    try {
      localStorage.setItem(event, value);
    } catch {
      return;
    }
    window.dispatchEvent(new Event(event));
  };
  return { framework, setFramework };
}
export function FrameworkSwitcher({ className = "" }: { className?: string }) {
  const { framework, setFramework } = useFramework();
  return (
    <Tabs
      value={framework}
      onValueChange={setFramework}
      className={`framework-switcher ${className}`}
    >
      <TabsList aria-label="开发框架">
        <TabsTrigger value="react">
          <Code2 />
          React
        </TabsTrigger>
        <TabsTrigger value="vue">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="m2 4 10 17L22 4h-6l-4 7-4-7Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinejoin="round"
            />
          </svg>
          Vue
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
export function FrameworkText({ react, vue }: { react: string; vue: string }) {
  const { framework } = useFramework();
  return framework === "vue" ? vue : react;
}
export function FrameworkCode({
  react,
  vue,
  reactFilename = "tsx",
  vueFilename = "vue",
}: {
  react: string;
  vue: string;
  reactFilename?: string;
  vueFilename?: string;
}) {
  const { framework } = useFramework();
  const code = framework === "vue" ? vue : react;
  return (
    <div className="code-block">
      <div className="code-header">
        <span>{framework === "vue" ? vueFilename : reactFilename}</span>
        <CopyButton value={code} label="复制代码" compact />
      </div>
      <pre>
        <code>{code}</code>
      </pre>
    </div>
  );
}
