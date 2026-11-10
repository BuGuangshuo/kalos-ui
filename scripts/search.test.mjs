import test from "node:test";
import assert from "node:assert/strict";
import { extractPageParagraphs } from "./build-search-index.mjs";
import { contextSnippet, highlightMatches, searchSite, searchEntries } from "../lib/search.ts";

test("extracts prose and links while excluding headings, navigation, code and attributes", () => {
  const source = '<article><h1>HeadingOnly</h1><nav><p>NavigationOnly</p></nav><p>保留 <Link href="/SecretHref">你的项目</Link> 与主题。</p><section id="install"><h2>SectionOnly</h2><p>正文含有路径别名。</p><CodeBlock code="CodeOnly"/><pre><code>PreOnly</code></pre><p>运行 <code>InlineOnly</code> 后继续。</p><ul><li>不会改写已有样式。</li></ul></section></article>';
  const entries = extractPageParagraphs(source, { path: "/docs", title: "PageTitleOnly", section: "文档" });
  assert.equal(entries[1].href, "/docs#install");
  assert.equal(entries[1].title, "PageTitleOnly · SectionOnly");
  const body = entries.flatMap(entry => entry.paragraphs).join(" ");
  for (const excluded of ["HeadingOnly", "SectionOnly", "PageTitleOnly", "NavigationOnly", "CodeOnly", "PreOnly", "InlineOnly", "SecretHref"]) assert.ok(!body.includes(excluded), excluded);
  assert.ok(body.includes("保留 你的项目 与主题。"));
  assert.ok(body.includes("不会改写已有样式。"));
});

test("searches prose instead of headings and returns the matching paragraph", () => {
  const entries = [{ title: "仅标题", href: "/docs#example", section: "文档", paragraphs: ["不会命中的说明。", "安装时保留现有的主题与路径别名。"] }];
  assert.deepEqual(searchSite("仅标题", entries), []);
  const [result] = searchSite("路径别名", entries);
  assert.equal(result.href, "/docs#example");
  assert.equal(result.context, "安装时保留现有的主题与路径别名。");
});

test("requires all terms to occur in the same context passage", () => {
  const entries = [{ title: "Test", href: "/", section: "页面", paragraphs: ["安装组件", "保留主题"] }];
  assert.deepEqual(searchSite("安装 主题", entries), []);
});

test("highlights literal punctuation and preserves source casing", () => {
  assert.deepEqual(highlightMatches("Use C++ and React.", "c++ react").filter(part => part.matched).map(part => part.text), ["C++", "React"]);
  assert.ok(contextSnippet("前".repeat(160) + "命中内容" + "后".repeat(160), ["命中"]).includes("命中内容"));
});

test("built index finds body text absent from navigation and excludes source code", () => {
  assert.ok(searchSite("路径别名").some(result => result.context.includes("路径别名") && result.href.includes("installation")));
  assert.deepEqual(searchSite("export default function"), []);
  assert.ok(searchEntries.every(entry => entry.paragraphs.length && entry.paragraphs.every(Boolean)));
});
