"use client";

import { Highlight, type PrismTheme } from "prism-react-renderer";
import { FileCode2 } from "lucide-react";
import { CopyButton } from "@/components/copy-button";

const codeTheme: PrismTheme = {
  plain: { color: "var(--code-text)", backgroundColor: "transparent" },
  styles: [
    { types: ["comment", "prolog", "doctype"], style: { color: "var(--code-comment)" } },
    { types: ["keyword", "tag", "boolean"], style: { color: "var(--code-keyword)" } },
    { types: ["string", "attr-value", "template-string"], style: { color: "var(--code-string)" } },
    { types: ["function", "class-name", "builtin"], style: { color: "var(--code-function)" } },
    { types: ["attr-name", "property"], style: { color: "var(--code-property)" } },
    { types: ["number"], style: { color: "var(--code-number)" } },
    { types: ["punctuation", "operator"], style: { color: "var(--code-punctuation)" } },
  ],
};

export function CodeBlock({ code, filename, language = "tsx" }: { code: string; filename?: string; language?: string }) {
  const extension = filename?.split(".").at(-1);
  const syntax = ["tsx", "jsx", "ts", "js", "css", "json"].includes(extension || "") ? extension : language;
  const grammar = syntax === "ts" ? "typescript" : syntax === "js" ? "javascript" : syntax === "bash" || syntax === "text" ? "plain" : syntax;
  return (
    <div className="code-block highlighted-code">
      <div className="code-header"><span><FileCode2 aria-hidden="true" />{filename || (language === "tsx" ? "React" : language)}</span><CopyButton value={code} label="复制代码" /></div>
      <Highlight code={code.trimEnd()} language={grammar || "plain"} theme={codeTheme}>
        {({ tokens, getTokenProps }) => <pre tabIndex={0} aria-label={filename || "代码"}><code>{tokens.map((line, index) => <span className="code-line" key={index}><span className="code-line-number" aria-hidden="true">{index + 1}</span><span className="code-line-content">{line.map((token, key) => <span key={key} {...getTokenProps({ token })} />)}</span></span>)}</code></pre>}
      </Highlight>
    </div>
  );
}
