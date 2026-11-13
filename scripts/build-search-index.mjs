import { readFile, writeFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";
import ts from "typescript";
import { catalog } from "../lib/catalog.ts";
import { componentReference } from "../lib/component-reference.ts";

const excluded = new Set(["code", "pre", "nav", "aside", "button", "kbd", "script", "style", "CodeBlock", "InstallCommand", "Sidebar", "OnThisPage", "PagePagination", "DocsPagination"]);
const prose = new Set(["p", "motion.p", "li", "AlertDescription"]);
const normalize = value => value.replace(/\s+/g, " ").trim();
const tagOf = node => ts.isJsxElement(node) ? node.openingElement.tagName.getText() : ts.isJsxSelfClosingElement(node) ? node.tagName.getText() : "";
function textOf(node) {
  if (ts.isJsxText(node)) return node.text.replace(/\s+/g, " ");
  if (ts.isJsxExpression(node)) return node.expression && ts.isStringLiteralLike(node.expression) ? node.expression.text : "";
  if (ts.isJsxElement(node)) {
    if (excluded.has(tagOf(node))) return " ";
    return node.children.map(textOf).join("");
  }
  return "";
}
function attribute(node, name) {
  const attrs = ts.isJsxElement(node) ? node.openingElement.attributes : node.attributes;
  const attr = attrs?.properties.find(attr => ts.isJsxAttribute(attr) && attr.name.getText() === name);
  return attr?.initializer && ts.isStringLiteral(attr.initializer) ? attr.initializer.text : "";
}

/** Index rendered prose only; headings identify destinations but never supply matching terms. */
export function extractPageParagraphs(source, { path, title, section }) {
  const file = ts.createSourceFile("page.tsx", source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const entries = new Map();
  const visit = (node, context = { id: "", heading: "" }) => {
    if (ts.isJsxElement(node) || ts.isJsxSelfClosingElement(node)) {
      const tag = tagOf(node);
      if (excluded.has(tag) || /^h[1-6]$/.test(tag)) return;
      if (tag === "section" && attribute(node, "id")) {
        const heading = ts.isJsxElement(node) && node.children.find(child => ts.isJsxElement(child) && /^h[1-6]$/.test(tagOf(child)));
        context = { id: attribute(node, "id"), heading: heading ? normalize(textOf(heading)) : "" };
      }
      if (prose.has(tag)) {
        const paragraph = normalize(textOf(node));
        if (!paragraph) return;
        const href = `${path}${context.id ? `#${context.id}` : ""}`;
        const entry = entries.get(href) ?? { title: `${title}${context.heading ? ` · ${context.heading}` : ""}`, href, section, paragraphs: [] };
        if (!entry.paragraphs.includes(paragraph)) entry.paragraphs.push(paragraph);
        entries.set(href, entry);
        return;
      }
    }
    ts.forEachChild(node, child => visit(child, context));
  };
  visit(file);
  return [...entries.values()];
}

export async function buildSearchIndex() {
  const entries = [];
  for (const [file, path, title, section] of [
    ["app/docs/getting-started/page.tsx", "/docs/getting-started", "快速开始", "文档"],
    ["app/docs/registry/page.tsx", "/docs/registry", "注册表配置", "文档"],
    ["app/docs/mcp/page.tsx", "/docs/mcp", "MCP 配置", "文档"],
    ["app/docs/changelog/page.tsx", "/docs/changelog", "更新日志", "文档"],
    ["app/docs/tokens/page.tsx", "/docs/tokens", "设计系统", "设计系统"],
    ["app/docs/skills/page.tsx", "/docs/skills", "Skills", "Skills"],
    ["components/home/hero.tsx", "/", "首页", "页面"],
    ["components/home/examples.tsx", "/", "首页", "页面"],
  ]) {
    entries.push(...extractPageParagraphs(await readFile(file, "utf8"), { path, title, section }));
  }
  for (const item of catalog) {
    const title = `${item.english} ${item.title}`;
    const href = `/components/${item.slug}`;
    entries.push({ title, href, section: "组件", paragraphs: [item.description] });
    const details = [...new Set(componentReference(item.slug).props.map(row => row[3]))];
    entries.push({ title: `${title} · API`, href: `${href}#api`, section: "组件", paragraphs: details });
  }
  await writeFile("lib/search-content.json", JSON.stringify(entries, null, 2) + "\n");
  console.log(`Search: ${entries.length} destinations, ${entries.reduce((sum, entry) => sum + entry.paragraphs.length, 0)} prose passages.`);
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) await buildSearchIndex();
