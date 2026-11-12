"use client";

import { CodeBlock } from "@/components/code-block";
import { usePrimitive } from "@/lib/use-primitive";

export function PrimitiveCode({
  radix,
  base,
  aria,
  filename = "example.tsx",
  language = "tsx",
}: {
  radix: string;
  base?: string;
  aria?: string;
  filename?: string;
  language?: string;
}) {
  const { primitive } = usePrimitive();
  const code = primitive === "base-ui" ? (base ?? radix) : primitive === "react-aria" ? (aria ?? radix) : radix;
  return <CodeBlock code={code} filename={filename} language={language} />;
}
