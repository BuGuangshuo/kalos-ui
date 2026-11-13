"use client";
import { useEffect, useState } from "react";
import { Code2, Eye } from "lucide-react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { DocTabsList as TabsList, DocTabsTrigger as TabsTrigger } from "@/components/doc-tabs";
import { ComponentDemo } from "@/components/demos";
import { CodeBlock } from "@/components/docs-parts";
import { ComponentToolbar } from "@/components/component-toolbar";
import { componentReference } from "@/lib/component-reference";
import { InstallCommand } from "@/components/site-shell";

type ManualSource = { files?: { path: string; content?: string }[]; dependencies?: string[]; registryDependencies?: string[] };

export function ComponentInstallation({ slug }: { slug: string }) {
  const [method, setMethod] = useState("cli");
  const url = `/r/${slug}.json`;
  const [manual, setManual] = useState<{ url: string; data?: ManualSource; error?: boolean } | null>(null);
  useEffect(() => {
    if (method !== "manual") return;
    const controller = new AbortController();
    fetch(url, { signal: controller.signal }).then(response => {
      if (!response.ok) throw new Error("Source unavailable");
      return response.json();
    }).then((data: ManualSource) => setManual({ url, data })).catch(error => {
      if (error.name !== "AbortError") setManual({ url, error: true });
    });
    return () => controller.abort();
  }, [method, url]);
  const data = manual?.url === url ? manual.data : undefined;
  return <section id="installation" className="component-installation">
    <h2>安装</h2>
    <p>在项目根目录运行，安装组件源码。</p>
    <Tabs value={method} onValueChange={setMethod}>
      <TabsList variant="line" aria-label="安装方式"><TabsTrigger line value="cli">CLI</TabsTrigger><TabsTrigger line value="manual">手动</TabsTrigger></TabsList>
      <TabsContent value="cli">
        <Tabs defaultValue="npm" className="installation-command-panel">
          <TabsList aria-label="安装包管理器">{["npm", "pnpm", "yarn", "bun"].map(manager => <TabsTrigger key={manager} value={manager}>{manager}</TabsTrigger>)}</TabsList>
          {["npm", "pnpm", "yarn", "bun"].map(manager => <TabsContent key={manager} value={manager}><InstallCommand slug={slug} manager={manager} /></TabsContent>)}
        </Tabs>
      </TabsContent>
      <TabsContent value="manual">
        <p>先完成组件配置，将文件放入 components.json 中的 UI 别名目录。</p>
        {manual?.url === url && manual.error ? <p role="alert">源码读取失败。<a href={url}>打开注册表文件</a></p> : !data ? <p role="status">正在读取源码…</p> : <>
          {!!data.registryDependencies?.length && <CodeBlock code={`npx shadcn@latest add ${data.registryDependencies.join(" ")}`} language="bash" />}
          {!!data.dependencies?.length && <CodeBlock code={`npm install ${data.dependencies.join(" ")}`} language="bash" />}
          {[...(data.files || [])].sort((a, b) => Number(!a.path.includes(slug)) - Number(!b.path.includes(slug))).map((file, index) => <details className="manual-source-file" key={file.path} open={index === 0}><summary>{file.path.split("/").at(-1)}</summary><CodeBlock code={file.content || ""} filename={file.path.split("/").at(-1)} /></details>)}
        </>}
      </TabsContent>
    </Tabs>
  </section>;
}
export function ComponentDetails({
  slug,
  source,
  prompt,
}: {
  slug: string;
  source: string;
  prompt: string;
}) {
  const [revision, setRevision] = useState(0);
  const code = source;
  return (
    <Tabs defaultValue="preview" className="detail-tabs">
      <div className="detail-preview-toolbar detail-preview-toolbar--component">
        <TabsList className="detail-view-tabs" aria-label="组件视图">
          <TabsTrigger value="preview"><Eye data-icon="inline-start" />预览</TabsTrigger>
          <TabsTrigger value="code"><Code2 data-icon="inline-start" />源码</TabsTrigger>
        </TabsList>
        <ComponentToolbar source={code} prompt={prompt} onRefresh={() => setRevision(value => value + 1)} />
      </div>
      <TabsContent value="preview">
        <div className="detail-preview">
          <div className="detail-preview-surface" data-component={slug}><ComponentDemo key={revision} slug={slug} /></div>
        </div>
      </TabsContent>
      <TabsContent value="code">
        <CodeBlock
          code={code}
          filename={`${slug}.tsx`}
          language="tsx"
        />
      </TabsContent>
    </Tabs>
  );
}

export function ComponentReference({ slug }: { slug: string }) {
  const { props, keyboard } = componentReference(slug);
  return (
    <>
      <section id="api">
        <h2>API</h2>
        <div className="component-api-scroll">
          <table className="component-api-table">
            <thead><tr><th>属性</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead>
            <tbody>{props.map(([name, type, initial, detail]) => <tr key={name}><td><code>{name}</code></td><td><code>{type}</code></td><td>{initial === "—" || initial === "–" ? initial : <code>{initial}</code>}</td><td>{detail}</td></tr>)}</tbody>
          </table>
        </div>
      </section>
      {keyboard.length ? <section id="keyboard"><h2>键盘操作</h2><dl className="component-keyboard">{keyboard.map(([key, action]) => <div key={key}><dt><kbd>{key}</kbd></dt><dd>{action}</dd></div>)}</dl></section> : null}
    </>
  );
}
