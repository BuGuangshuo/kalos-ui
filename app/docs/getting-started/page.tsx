import type { Metadata } from "next";
import Link from "next/link";
import { Sidebar, CodeBlock, OnThisPage } from "@/components/docs-parts";
import { InstallCommand } from "@/components/site-shell";
import { DocsPagination } from "@/components/page-pagination";
import { FrameworkCards } from "@/components/framework-cards";
export const metadata: Metadata = { title: "快速开始" };
const links = [
  { id: "installation", title: "新建项目" },
  { id: "existing-project", title: "已有项目" },
  { id: "frameworks", title: "框架接入" },
  { id: "usage", title: "使用组件" },
  { id: "ai", title: "使用 AI" },
  { id: "theme", title: "主题" },
  { id: "maintenance", title: "扩展组件库" },
  { id: "license", title: "开源许可" },
];
export default function DocsPage() {
  return <div className="workbench">
    <Sidebar active="docs" />
    <div className="docs-grid">
      <article className="docs-content">
        <header className="docs-title"><h1>快速开始</h1></header>
        <section id="installation">
          <h2>新建项目</h2>
          <p>运行命令，选择脚手架、项目名和包管理器，默认安装 Base UI 组件。</p>
          <InstallCommand mode="init" slug="kalos-all" />
        </section>
        <section id="existing-project">
          <h2>已有项目</h2>
          <p>在项目根目录运行，沿用现有主题、目录和路径别名。</p>
          <InstallCommand slug="kalos-all" />
          <p>已有项目需配置 TypeScript、Tailwind CSS 和路径别名；组件配置使用 Base UI。</p>
        </section>
        <section id="frameworks">
          <h2>框架接入</h2>
          <FrameworkCards />
        </section>
          <section id="usage">
            <h2>使用组件</h2>
            <InstallCommand />
            <p>
              从本地组件目录导入，源码可直接修改。
            </p>
            <CodeBlock
              filename="example.tsx"
              code={
                'import { KalosButton } from "@/components/ui/kalos-button"\n\nexport default function Page() {\n  return <KalosButton>开始构建</KalosButton>\n}'
              }
            />
            <p>
              <Link href="/components">浏览全部组件与 API →</Link>
            </p>
          </section>
        <section id="ai">
          <h2>使用 AI</h2>
          <p>安装 <Link href="/docs/skills">Kalos UI Skill</Link>，让 AI 按项目规范添加和修改组件。</p>
          <CodeBlock code="npx skills add BuGuangshuo/kalos-ui --skill kalos-ui" language="bash" />
        </section>
          <section id="theme">
            <h2>主题与设计变量</h2>
            <p>
              组件继承项目的主题变量。需要 Kalos 配色时安装：
            </p>
            <InstallCommand slug="kalos-theme" />
            <p>
              <Link href="/docs/tokens">查看设计系统 →</Link>
            </p>
          </section>
          <section id="maintenance">
            <h2>扩展组件库</h2>
            <CodeBlock
              filename="项目结构"
              language="text"
              code={
                "registry/kalos/      Base UI 组件源码\nskills/kalos-ui/     可安装的 AI Skill\nlib/catalog.ts      组件目录与依赖\ndesign/tokens.json  共享语义设计变量\npublic/r/           Base UI 注册表 JSON"
              }
            />
            <ol>
              <li>
                在 <code>registry/kalos/</code> 中添加组件源码。
              </li>
              <li>
                在 <code>lib/catalog.ts</code> 中登记组件信息与依赖。
              </li>
              <li>
                在 <code>components/demos.tsx</code> 中添加交互示例。
              </li>
              <li>构建并推送代码，Vercel 会从 GitHub 自动部署。</li>
            </ol>
            <CodeBlock language="bash" code={"npm run registry:build\nnpm run build"} />
          </section>
          <section id="license">
            <h2>开源许可</h2>
            <p>
              Kalos UI 使用 MIT 许可证，支持个人与商业项目。组件交互基础来自 Base UI，源码分发使用{" "}
              <a href="https://ui.shadcn.com/" target="_blank" rel="noreferrer">
                shadcn/ui
              </a>
              。
            </p>
          </section>
        <DocsPagination current="/docs/getting-started" />
      </article>
      <OnThisPage links={links} />
    </div>
  </div>;
}
