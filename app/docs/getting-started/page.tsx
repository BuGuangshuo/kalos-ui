import type { Metadata } from "next";
import Link from "next/link";
import { Sidebar, CodeBlock, OnThisPage } from "@/components/docs-parts";
import { InstallCommand } from "@/components/site-shell";
import { PrimitiveSwitcher, PrimitiveText } from "@/components/primitives";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import {
  FrameworkCode,
  FrameworkSwitcher,
  FrameworkText,
} from "@/components/framework";
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
            <FrameworkSwitcher />
            <PrimitiveSwitcher />
          </header>
          <section id="ai">
            <h2>通过 AI 快速开始</h2>
            <p>
              先安装 <Link href="/docs/skills">Pop UI Skill</Link>，让 AI
              助手识别框架、安装组件并保留你的项目规范：
            </p>
            <CodeBlock code="npx skills add BuGuangshuo/pop-ui --skill pop-ui" />
            <FrameworkCode
              base="在当前 React 项目中初始化 Base UI 版 shadcn/ui（init --base base），从 /r/base-ui/ 安装所需 Pop UI 组件，保留现有目录和设计变量。"
              aria="在当前 React 项目中初始化 React Aria 版 shadcn/ui（init --base aria），从 /r/react-aria/ 安装所需 Pop UI 组件，保留现有目录和设计变量。"
              reactFilename="初始化 React 项目"
              vueFilename="初始化 Vue 项目"
              vue="在当前 Vue 3.5+ 项目中配置 Tailwind CSS 和 shadcn-vue，使用 Pop UI Vue 注册表安装所需组件，保留现有项目结构与设计变量。"
              react={
                "在当前 React 项目中初始化 Radix 版 shadcn/ui：\nnpx shadcn@latest init --base radix\n\n然后从 Pop UI 组件文档复制需要的安装命令，\n安装组件并阅读生成的源码。保留现有的项目结构与设计变量。"
              }
            />
            <p>
              Pop UI
              的每个组件都以源码形式安装到项目中。你可以直接修改，无需依赖额外的运行时组件包。
            </p>
          </section>
          <section id="installation">
            <h2>安装与配置</h2>
            <p>
              <FrameworkText
                react="使用 React / Next.js 项目，并配置 TypeScript 与 Tailwind CSS v4。"
                vue="使用 Vue 3.5+ / Nuxt 项目，并配置 TypeScript 与 Tailwind CSS。可通过 Vite 创建 Vue 项目。"
              />
            </p>
            <FrameworkCode
              react="npx shadcn@latest init --base radix"
              base="npx shadcn@latest init --base base"
              aria="npx shadcn@latest init --base aria"
              vue="npx shadcn-vue@latest init"
              reactFilename="React"
              vueFilename="Vue"
            />
            <Alert>
              <AlertTitle>
                <PrimitiveText
                  radix="使用 Radix UI 基础组件"
                  base="使用 Base UI 基础组件"
                  aria="使用 React Aria 基础组件"
                  vue="使用 Reka UI 基础组件"
                />
              </AlertTitle>
              <AlertDescription>
                <PrimitiveText
                  radix="当前选择 Radix UI，使用 /r/radix/ 安装入口。底层组件由 shadcn CLI 自动补齐。"
                  base="当前选择 Base UI，使用 /r/base-ui/ 安装入口，包含基于 @base-ui/react 的独立基础组件。"
                  aria="当前选择 React Aria，使用 /r/react-aria/ 安装入口，包含基于 react-aria-components 的独立基础组件。"
                  vue="Vue 版基于 shadcn-vue 与 Reka UI，提供独立的 .vue 源码。输入、开关、复选框使用 v-model，对话框使用 v-model:open。"
                />
              </AlertDescription>
            </Alert>
            <p>
              React 可选择 Radix UI、Base UI 或 React Aria；Vue 使用 Reka
              UI。每个版本均包含 12
              个组件。优先沿用项目已有的基础库，安装入口、源码和预览会随选择切换。
            </p>
            <p>
              在同一个项目中选择一个版本，避免不同版本覆盖同名 Pop 组件。旧的
              /r/*.json 入口仍指向 Radix UI。
            </p>
            <p>选择需要的组件，然后运行对应的安装命令：</p>
            <InstallCommand />
            <p>需要一次安装全部 12 个组件时：</p>
            <InstallCommand slug="pop-all" />
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
                '<script setup lang="ts">\nimport PopButton from "@/components/ui/pop-button.vue"\n</script>\n\n<template>\n  <PopButton>开始构建</PopButton>\n</template>'
              }
              react={
                'import { PopButton } from "@/components/ui/pop-button"\n\nexport default function Page() {\n  return <PopButton>开始构建</PopButton>\n}'
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
                '{\n  "registries": {\n    "@pop-ui": "https://pop-ui-six.vercel.app/r/base-ui/{name}.json"\n  }\n}'
              }
              aria={
                '{\n  "registries": {\n    "@pop-ui": "https://pop-ui-six.vercel.app/r/react-aria/{name}.json"\n  }\n}'
              }
              reactFilename="components.json"
              vueFilename="components.json"
              vue={
                '{\n  "registries": {\n    "@pop-ui": "https://pop-ui-six.vercel.app/r/vue/{name}.json"\n  }\n}'
              }
              react={
                '{\n  "registries": {\n    "@pop-ui": "https://pop-ui-six.vercel.app/r/radix/{name}.json"\n  }\n}'
              }
            />
            <FrameworkCode
              react="npx shadcn@latest add @pop-ui/pop-button"
              vue="npx shadcn-vue@latest add @pop-ui/pop-button"
              reactFilename="React"
              vueFilename="Vue"
            />
          </section>
          <section id="theme">
            <h2>主题与设计变量</h2>
            <p>
              组件视觉参考 Astryx
              的中性主题，采用标准尺寸、柔和圆角与统一的语义颜色。组件会继承你的
              shadcn 设计变量，也可以安装本站主题：
            </p>
            <InstallCommand slug="pop-theme" />
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
                "registry/pop/        Radix 组件源码\nregistry/base-ui/    Base UI 组件源码\nregistry/react-aria/ React Aria 组件源码\nregistry/vue/        Vue 组件源码\nskills/pop-ui/       可安装的 AI Skill\nlib/catalog.ts       组件目录与依赖\ndesign/tokens.json   共享语义设计变量\npublic/r/radix/      Radix 注册表 JSON\npublic/r/base-ui/    Base UI 注册表 JSON\npublic/r/react-aria/ React Aria 注册表 JSON\npublic/r/vue/        Vue 注册表 JSON"
              }
            />
            <ol>
              <li>
                在 <code>registry/pop/</code> 中添加组件源码。
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
              Pop UI 使用 MIT 许可证，支持个人与商业项目。网站结构与视觉规范参考{" "}
              <a
                href="https://astryx.atmeta.com/"
                target="_blank"
                rel="noreferrer"
              >
                Astryx
              </a>
              ，组件交互基础来自{" "}
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
