import type { Metadata } from "next";
import Link from "next/link";
import { Sidebar, CodeBlock, OnThisPage } from "@/components/docs-parts";
import { InstallCommand } from "@/components/site-shell";
import { PrimitiveSwitcher } from "@/components/primitives";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { FrameworkCode } from "@/components/framework";
export const metadata: Metadata = { title: "快速开始" };
const links = [
  { id: "ai", title: "通过 AI 快速开始" },
  { id: "installation", title: "安装与配置" },
  { id: "usage", title: "使用第一个组件" },
  { id: "namespace", title: "配置命名空间" },
  { id: "theme", title: "主题与设计变量" },
  { id: "maintenance", title: "扩展组件库" },
  { id: "license", title: "开源许可" },
];
export default function DocsPage() {
  return (
    <div className="workbench">
      <Sidebar active="docs" />
      <div className="docs-grid">
        <article className="docs-content">
          <header className="docs-title">
            <h1>快速开始</h1>
            <p>几步装好组件，开始构建你的界面。</p>
            <PrimitiveSwitcher />
          </header>
          <section id="ai">
            <h2>通过 AI 快速开始</h2>
            <p>
              先安装 <Link href="/docs/skills">Kalos UI Skill</Link>，让 AI
              助手识别框架、安装组件并保留你的项目规范：
            </p>
            <CodeBlock code="npx skills add BuGuangshuo/kalos-ui --skill kalos-ui" />
            <FrameworkCode
              reactFilename="给 AI 的指令"
              vueFilename="给 AI 的指令"
              react="使用 Kalos UI 的统一安装器，在终端选择或沿用当前 React 项目的基础库，按需安装组件并保留现有主题和目录。"
              vue="使用 Kalos UI 的统一安装器，自动识别 Vue 项目并安装 Reka UI 版本，保留现有主题与 v-model 交互。"
            />
            <p>
              Kalos UI
              的每个组件都以源码形式安装到项目中。你可以直接修改，无需依赖额外的运行时组件包。
            </p>
          </section>
          <section id="installation">
            <h2>安装与配置</h2>
            <p>
              在已有的 React / Next.js 或 Vue / Nuxt 项目根目录运行同一个安装命令。
              安装器会识别框架，并在终端引导 React 用户选择基础组件库。
            </p>
            <InstallCommand slug="kalos-all" />
            <Alert>
              <AlertTitle>在终端选择基础组件库</AlertTitle>
              <AlertDescription>
                React 可选择 Radix UI、Base UI 或 React Aria；Vue 自动使用 Reka UI。
                已有项目会默认选中当前基础库，并保留现有的主题与路径别名。
              </AlertDescription>
            </Alert>
            <p>
              如果项目尚未配置 shadcn，安装器会先引导初始化，再安装组件。
              请确保项目已经配置 TypeScript 与 Tailwind CSS。
            </p>
            <p>只安装一个组件时，使用同样的入口：</p>
            <InstallCommand />
            <p>
              文档中的基础库切换用于查看示例和 API，安装命令始终相同，实际版本在终端选择。
            </p>
          </section>
          <section id="usage">
            <h2>使用第一个组件</h2>
            <p>
              从本地组件目录导入。所需基础组件和底层库依赖会由 CLI 自动补齐。
            </p>
            <FrameworkCode
              reactFilename="app/page.tsx"
              vueFilename="App.vue"
              vue={
                '<script setup lang="ts">\nimport KalosButton from "@/components/ui/kalos-button.vue"\n</script>\n\n<template>\n  <KalosButton>开始构建</KalosButton>\n</template>'
              }
              react={
                'import { KalosButton } from "@/components/ui/kalos-button"\n\nexport default function Page() {\n  return <KalosButton>开始构建</KalosButton>\n}'
              }
            />
            <p>
              所有组件都包含{" "}
              <Link href="/components">交互预览、完整源码和 API 说明</Link>
              。根据项目需要组合它们，或直接修改源码。
            </p>
          </section>
          <section id="namespace">
            <h2>配置注册表命名空间</h2>
            <p>
              在项目的 <code>components.json</code> 中添加对应版本的注册表地址：
            </p>
            <FrameworkCode
              base={
                '{\n  "registries": {\n    "@kalos-ui": "https://kalos-ui-six.vercel.app/r/base-ui/{name}.json"\n  }\n}'
              }
              aria={
                '{\n  "registries": {\n    "@kalos-ui": "https://kalos-ui-six.vercel.app/r/react-aria/{name}.json"\n  }\n}'
              }
              reactFilename="components.json"
              vueFilename="components.json"
              vue={
                '{\n  "registries": {\n    "@kalos-ui": "https://kalos-ui-six.vercel.app/r/vue/{name}.json"\n  }\n}'
              }
              react={
                '{\n  "registries": {\n    "@kalos-ui": "https://kalos-ui-six.vercel.app/r/radix/{name}.json"\n  }\n}'
              }
            />
            <FrameworkCode
              react="npx shadcn@latest add @kalos-ui/kalos-button"
              vue="npx shadcn-vue@latest add @kalos-ui/kalos-button"
              reactFilename="React"
              vueFilename="Vue"
            />
          </section>
          <section id="theme">
            <h2>主题与设计变量</h2>
            <p>
              组件采用中性主题，采用标准尺寸、柔和圆角与统一的语义颜色。组件会继承你的
              shadcn 设计变量，也可以安装本站主题：
            </p>
            <InstallCommand slug="kalos-theme" />
            <p>
              查看 <Link href="/docs/tokens">设计变量参考</Link>
              ，了解颜色、尺寸、间距、圆角和排版的映射。
            </p>
          </section>
          <section id="maintenance">
            <h2>扩展你自己的组件库</h2>
            <CodeBlock
              filename="项目结构"
              language="text"
              code={
                "registry/kalos/        Radix 组件源码\nregistry/base-ui/    Base UI 组件源码\nregistry/react-aria/ React Aria 组件源码\nregistry/vue/        Vue 组件源码\nskills/kalos-ui/       可安装的 AI Skill\nlib/catalog.ts       组件目录与依赖\ndesign/tokens.json   共享语义设计变量\npublic/r/radix/      Radix 注册表 JSON\npublic/r/base-ui/    Base UI 注册表 JSON\npublic/r/react-aria/ React Aria 注册表 JSON\npublic/r/vue/        Vue 注册表 JSON"
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
            <CodeBlock code={"npm run registry:build\nnpm run build"} />
            <p>
              构建过程使用 shadcn CLI 生成 JSON，并检查官方 schema
              与源码完整性。
            </p>
          </section>
          <section id="license">
            <h2>开源许可</h2>
            <p>
              Kalos UI 使用 MIT 许可证，支持个人与商业项目              ，组件交互基础来自{" "}
              <a href="https://ui.shadcn.com/" target="_blank" rel="noreferrer">
                shadcn/ui
              </a>
              。
            </p>
          </section>
          <div className="docs-next">
            <Link href="/docs/tokens">
              <span>下一步</span>
              <strong>了解设计变量 →</strong>
            </Link>
          </div>
        </article>
        <OnThisPage links={links} />
      </div>
    </div>
  );
}
