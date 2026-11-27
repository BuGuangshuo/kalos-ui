"use client";
import { useEffect, useState, type ReactNode } from "react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { DocTabsList as TabsList, DocTabsTrigger as TabsTrigger } from "@/components/doc-tabs";
import { CodeBlock } from "@/components/code-block";
import { InstallCommand } from "@/components/site-shell";

type ManualSource = { files?: { path: string; content?: string }[]; dependencies?: string[]; registryDependencies?: string[] };

export function ComponentInstallation({ slug, manualContent }: { slug: string; manualContent?: ReactNode }) {
  const [method, setMethod] = useState("cli");
  const url = `/r/${slug}.json`;
  const [manual, setManual] = useState<{ url: string; data?: ManualSource; error?: boolean } | null>(null);
  useEffect(() => {
    if (method !== "manual" || manualContent) return;
    const controller = new AbortController();
    fetch(url, { signal: controller.signal }).then(response => {
      if (!response.ok) throw new Error("Source unavailable");
      return response.json();
    }).then((data: ManualSource) => setManual({ url, data })).catch(error => {
      if (error.name !== "AbortError") setManual({ url, error: true });
    });
    return () => controller.abort();
  }, [method, url, manualContent]);
  const data = manual?.url === url ? manual.data : undefined;
  return <section id="installation" className="component-installation">
    <h2>安装</h2>
    <p>在项目根目录运行，安装源码。</p>
    <Tabs value={method} onValueChange={setMethod}>
      <TabsList variant="line" aria-label="安装方式"><TabsTrigger line value="cli">CLI</TabsTrigger><TabsTrigger line value="manual">手动</TabsTrigger></TabsList>
      <TabsContent value="cli">
        <Tabs defaultValue="npm" className="installation-command-panel">
          <TabsList aria-label="安装包管理器">{["npm", "pnpm", "yarn", "bun"].map(manager => <TabsTrigger key={manager} value={manager}>{manager}</TabsTrigger>)}</TabsList>
          {["npm", "pnpm", "yarn", "bun"].map(manager => <TabsContent key={manager} value={manager}><InstallCommand slug={slug} manager={manager} /></TabsContent>)}
        </Tabs>
      </TabsContent>
      <TabsContent value="manual">
        {manualContent ?? <>
        <p>先完成组件配置，将文件放入 components.json 中的 UI 别名目录。</p>
        {manual?.url === url && manual.error ? <p role="alert">源码读取失败。<a href={url}>打开注册表文件</a></p> : !data ? <p role="status">正在读取源码…</p> : <>
          {!!data.registryDependencies?.length && <CodeBlock code={`npx shadcn@latest add ${data.registryDependencies.join(" ")}`} language="bash" />}
          {!!data.dependencies?.length && <CodeBlock code={`npm install ${data.dependencies.join(" ")}`} language="bash" />}
          {[...(data.files || [])].sort((a, b) => Number(!a.path.includes(slug)) - Number(!b.path.includes(slug))).map((file, index) => <details className="manual-source-file" key={file.path} open={index === 0}><summary>{file.path.split("/").at(-1)}</summary><CodeBlock code={file.content || ""} filename={file.path.split("/").at(-1)} /></details>)}
        </>}
        </>}
      </TabsContent>
    </Tabs>
  </section>;
}
