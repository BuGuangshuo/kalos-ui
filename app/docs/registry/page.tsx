import type { Metadata } from "next";
import { Sidebar, CodeBlock, OnThisPage } from "@/components/docs-parts";
import { DocsPagination } from "@/components/page-pagination";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "注册表配置" };
const links = [
  { id: "configuration", title: "配置文件" },
  { id: "namespace", title: "添加命名空间" },
  { id: "install", title: "安装组件" },
  { id: "custom-registry", title: "自定义地址" },
];

export default function RegistryPage() {
  const configuration = JSON.stringify({ registries: { "@kalos-ui": `${site.url}/r/{name}.json` } }, null, 2);
  return <div className="workbench">
    <Sidebar active="registry" />
    <div className="docs-grid">
      <article className="docs-content">
        <header className="docs-title"><h1>注册表配置</h1></header>
        <section id="configuration">
          <h2>配置文件</h2>
          <p>项目根目录的 <code>components.json</code> 决定组件的安装位置、导入别名和样式入口。Kalos 安装器会读取这份配置；使用统一安装命令时，无需手动添加命名空间。</p>
          <div className="code-block">
            <table className="props-table">
              <thead><tr><th>字段</th><th>用途</th></tr></thead>
              <tbody>
                <tr><td><code>style</code></td><td>Base UI 组件风格，例如 base-nova。</td></tr>
                <tr><td><code>rsc</code></td><td>是否启用 React Server Components，用于处理客户端指令。</td></tr>
                <tr><td><code>tsx</code></td><td>是否生成 TypeScript 组件源码。</td></tr>
                <tr><td><code>tailwind.css</code></td><td>全局 CSS 入口，主题变量与共享样式写入此文件。</td></tr>
                <tr><td><code>aliases.ui</code></td><td>组件源码的安装目录别名。</td></tr>
                <tr><td><code>aliases.utils</code></td><td>组件使用的工具函数导入路径。</td></tr>
                <tr><td><code>registries</code></td><td>命名空间与注册表地址的对应关系，可与其他注册表并存。</td></tr>
              </tbody>
            </table>
          </div>
        </section>
        <section id="namespace">
          <h2>添加命名空间</h2>
          <p>需要通过 <code>@kalos-ui</code> 安装时，将下方 <code>registries</code> 字段合并到已有配置。</p>
          <CodeBlock filename="components.json" language="json" code={configuration} />
          <p><code>{"{name}"}</code> 会替换为组件条目名，例如 <code>kalos-button</code>。注册表统一提供 Base UI 源码。</p>
        </section>
        <section id="install">
          <h2>安装组件</h2>
          <p>配置后，在项目根目录使用命名空间安装组件及其依赖。</p>
          <CodeBlock language="bash" code="npx shadcn@latest add @kalos-ui/kalos-button" />
          <h3>一次安装多个组件</h3>
          <CodeBlock language="bash" code="npx shadcn@latest add @kalos-ui/kalos-button @kalos-ui/kalos-input @kalos-ui/kalos-dialog" />
          <h3>完整组件库与主题</h3>
          <p><code>kalos-all</code> 安装全部组件；需要 Kalos 主题时，另外添加 <code>kalos-theme</code>。已有项目可继续使用原来的主题。</p>
          <CodeBlock language="bash" code={"npx shadcn@latest add @kalos-ui/kalos-all\nnpx shadcn@latest add @kalos-ui/kalos-theme"} />
          <p>安装后的源码位于 <code>aliases.ui</code> 对应目录，可直接修改。再次安装同名组件时，先核对本地改动，再决定是否覆盖。</p>
        </section>
        <section id="custom-registry">
          <h2>自定义地址</h2>
          <p>自行部署注册表后，将域名替换为部署地址，保留 /r/ 路径和 <code>{"{name}.json"}</code> 占位符。例如：</p>
          <CodeBlock filename="components.json" language="json" code={JSON.stringify({ registries: { "@kalos-ui": "https://ui.example.com/r/{name}.json" } }, null, 2)} />
          <p>注册表地址必须能从终端访问，并返回 JSON。出现找不到组件的错误时，检查域名、路径与组件名是否一致。</p>
        </section>
        <DocsPagination current="/docs/registry" />
      </article>
      <OnThisPage links={links} />
    </div>
  </div>;
}
