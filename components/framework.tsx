"use client";

import { useSyncExternalStore } from "react";
import { ReactLogo, VueLogo } from "@/components/framework-icons";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePrimitive } from "@/lib/use-primitive";
import { CodeBlock } from "@/components/code-block";

export type Framework = "react" | "vue";
const event = "kalos-ui-framework";
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
          <ReactLogo />
          React
        </TabsTrigger>
        <TabsTrigger value="vue">
          <VueLogo />
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
  base,
  aria,
  reactFilename = "tsx",
  vueFilename = "vue",
}: {
  react: string;
  vue: string;
  base?: string;
  aria?: string;
  reactFilename?: string;
  vueFilename?: string;
}) {
  const { framework } = useFramework();
  const { primitive } = usePrimitive();
  const code =
    framework === "vue"
      ? vue
      : primitive === "base-ui"
        ? (base ?? react)
        : primitive === "react-aria"
          ? (aria ?? react)
          : react;
  return <CodeBlock code={code} filename={framework === "vue" ? vueFilename : reactFilename} language={framework === "vue" ? "markup" : "tsx"} />;
}
