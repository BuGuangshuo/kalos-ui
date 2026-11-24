"use client";

import { useState } from "react";
import { KalosSelect } from "@/registry/kalos/kalos-select";
import { CodeBlock } from "@/components/code-block";

export type BlockRegistrySource = {
  files: { path: string; target: string; content: string }[];
  dependencies?: string[];
};

const sourcePath = (target: string) => target.replace("@components/blocks/", "");

export function blockSourceText(source: BlockRegistrySource) {
  return source.files.map(file => {
    const filename = sourcePath(file.target);
    const format = filename.split(".").at(-1) ?? "";
    return [filename, "```" + format, file.content.trimEnd(), "```"].join("\n");
  }).join("\n\n");
}

export function BlockSource({ source, manual = false }: { source: BlockRegistrySource; manual?: boolean }) {
  const [selected, setSelected] = useState("");
  const file = source.files.find(file => file.path === selected) ?? source.files[0];
  return <div className="block-source">
    {manual && <>
      <p>将下列文件按目录结构放入 <code>components/blocks/</code>。使用自定义别名时，选择对应的组件目录。</p>
      {!!source.dependencies?.length && <CodeBlock code={`npm install ${source.dependencies.join(" ")}`} language="bash" />}
    </>}
    <KalosSelect className="block-source-select" label="文件" value={file.path} onValueChange={setSelected}
      options={source.files.map(file => ({ value: file.path, label: sourcePath(file.target) }))} />
    <CodeBlock key={file.path} code={file.content} filename={sourcePath(file.target)} language="text" />
  </div>;
}
