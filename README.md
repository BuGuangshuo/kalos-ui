# Kalos UI

从组件开始，构建你的界面。

[在线网站](https://kalos-ui-six.vercel.app) · [组件目录](https://kalos-ui-six.vercel.app/components) · [中文文档](https://kalos-ui-six.vercel.app/docs/getting-started) · [Skills](https://kalos-ui-six.vercel.app/docs/skills)

一套支持 Next.js、Vite 和 React Router 的 React UI 组件注册表，采用 Next.js App Router、TypeScript、Tailwind CSS v4、shadcn/ui 与 Base UI。

开发与设计规范见 [AGENTS.md](./AGENTS.md)。

- 基础组件及交互预览、源码展示、Props 说明
- 可搜索、可筛选的组件目录
- Affect UI Clean 风格、标准尺寸、中文界面、浅色与深色主题、响应式布局、键盘快捷搜索
- 符合官方 schema 的 shadcn 注册表、整库安装、可选 Kalos 主题
- Base UI 组件共用设计变量；可安装的 Kalos UI AI Skill
- Animate UI 风格首页：Logo 描边入场与归位、文字轮播、滚动环绕卡片、交互演示
- AnimateIcons Disc3 圆盘标志与 Outfit SemiBold（600）字标；界面与正文采用 Roboto，控件与正文为 13px / 20px、400 字重，标题 500–600
- GitHub + Vercel 持续部署

## 本地运行

需要 Node.js 24 LTS 和 npm。

```bash
npm ci
npm run dev
```

访问 http://localhost:3000。

## 构建与验证

```bash
npm run registry:build
npm run typecheck
npm run build
```

Logo 使用 `pnpm dlx shadcn@latest add @animateicons/lu-disc-3` 安装的圆盘图标，支持悬停旋转与减少动态效果偏好。开场时图标和字标同步缓慢描出空心轮廓，再填实笔画，完成后归位到导航栏。`lib/brand-icon.ts` 统一维护动画图标、描边动画与静态导出使用的路径。

构建会从 `lib/brand.ts`、`lib/brand-icon.ts` 同步生成黑白 Logo、独立圆盘标志与自适应深色模式的浏览器图标。也可单独运行 `npm run brand:build`。

字标路径由 `scripts/generate-wordmark.py` 生成，先合并重叠轮廓，再转成 SVG，保证开场描边只显示字母外缘与字腔。需要重新生成字形时，按脚本开头的命令执行，然后运行 `npm run brand:build`。

图标的可填充轮廓由 `scripts/generate-icon-outline.py` 将原图标笔画扩展生成，填实后保持 Disc3 的形状。修改原图标路径时，按脚本开头的命令重新生成。

生产构建自动生成注册表并验证每个条目的官方 schema、源码完整性与一致性。

## 安装

### 新建项目

在准备存放项目的目录运行：

```bash
npx https://kalos-ui-six.vercel.app/cli/kalos-ui-0.3.7.tgz init
```

依次选择 Next.js、Vite 或 React Router 脚手架、项目名和包管理器，默认使用 Base UI。安装器自动配置 TypeScript、Tailwind CSS 与路径别名，并安装完整组件库和 Kalos 主题。新项目创建在独立子目录中，已有目录不会被覆盖。

脚本中可直接指定全部选项：

```bash
npx https://kalos-ui-six.vercel.app/cli/kalos-ui-0.3.7.tgz init my-app --template vite --package-manager npm --yes
```

完成后进入项目目录并运行 `npm run dev`，或所选包管理器对应的开发命令。

### 已有项目

在项目根目录运行，安装全部组件或按需安装：

```bash
npx https://kalos-ui-six.vercel.app/cli/kalos-ui-0.3.7.tgz add
npx https://kalos-ui-six.vercel.app/cli/kalos-ui-0.3.7.tgz add button card
```

自动识别 Next.js、React + Vite 和 React Router 以及包管理器，保留主题、目录和别名，统一使用 Base UI。尚无组件配置时先引导配置；项目需已具备 TypeScript、Tailwind CSS 与路径别名。组件以源码形式安装，不会迁移宿主框架或基础库。

```bash
# 脚本和 CI 默认使用 Base UI
npx https://kalos-ui-six.vercel.app/cli/kalos-ui-0.3.7.tgz add --yes
# 只预览，不创建目录或修改项目
npx https://kalos-ui-six.vercel.app/cli/kalos-ui-0.3.7.tgz add --dry-run
# 可选 Kalos 主题
npx https://kalos-ui-six.vercel.app/cli/kalos-ui-0.3.7.tgz add theme
```

不带子命令时，终端会提供“新建项目”和“安装到已有项目”两种入口。`init` 使用 `--template next|vite|react-router` 指定脚手架；`add` 可使用 `--framework next|vite|react-router` 覆盖自动识别。

安装器随站点构建为可通过 npx 执行的包，无需单独发布 npm。开发预览的命令自动带上当前注册表站点。运行 `npm run cli:build` 打包、`npm run cli:test` 验证。发布新的安装器版本时递增 `packages/cli/package.json` 版本号。

## 高级：直接使用注册表

全部组件统一使用 Base UI。直接使用 shadcn 时：

```bash
npx shadcn@latest init --base base
npx shadcn@latest add https://kalos-ui-six.vercel.app/r/kalos-all.json
```

注册表包含匹配的基础组件源码和依赖，提供单组件、整库和可选主题入口。`/r/base-ui/` 保留为同一份源码的兼容地址。已有其他基础库的项目需先完成迁移，安装器不会自动改写组件配置。

## 支持的框架

| 项目 | 使用方式 | 配置要求 |
| --- | --- | --- |
| Next.js | App Router / Pages Router | 使用状态或回调的 App Router 页面加 `"use client"` |
| React + Vite | 在 `src/App.tsx` 或其他组件中导入 | TypeScript 与 Vite 同时配置路径别名，入口导入全局 CSS |
| React Router | 框架模式 / 路由库 | 在路由组件中导入，保留现有 `~/` 或 `@/` 别名 |

这些项目共用 React 组件源码，统一使用 Base UI。`init` 自动配置新项目；已有项目的接入步骤见[安装文档](https://kalos-ui-six.vercel.app/docs/getting-started#frameworks)。

需要手动指定项目类型时：

```bash
npx https://kalos-ui-six.vercel.app/cli/kalos-ui-0.3.7.tgz add --framework vite
npx https://kalos-ui-six.vercel.app/cli/kalos-ui-0.3.7.tgz add --framework react-router
```

## AI Skill

```bash
npx skills add BuGuangshuo/kalos-ui --skill kalos-ui
```

Skill 位于 `skills/kalos-ui/`，帮助支持 Agent Skills 的工具识别 Next.js、Vite 和 React Router 项目、选择注册表、组合组件并调整动效。完整说明见[Skill 文档](https://kalos-ui-six.vercel.app/docs/skills)。

## MCP

通过 shadcn MCP 在 Claude Code、Codex 和 Cursor 中检索 Kalos UI、查看组件信息与依赖并生成安装命令。完整步骤见 [MCP 配置](https://kalos-ui-six.vercel.app/docs/mcp)。

本仓库提供 `.mcp.json`、`.cursor/mcp.json` 和 `.codex/config.toml` 项目级配置。更新注册表地址与客户端配置：

```bash
npm run mcp:config
```

注册表地址统一读取 `lib/site.ts`；自定义地址使用 `NEXT_PUBLIC_SITE_URL`。配置保留其他 MCP 服务和已有的自定义 shadcn 入口。

## 新增组件

1. 在 `registry/kalos/` 添加组件源码。
2. 在 `lib/catalog.ts` 中添加描述、shadcn 依赖、Props 与使用示例。
3. 在 `components/demos.tsx` 添加交互预览。
4. 执行 `npm run build` 并整理更新清单；完成必要验证后，按用户要求直接推送或部署。

`registry.json`、`public/registry*.json`、`public/r/**/*.json` 由构建生成，请勿直接修改生成文件。源码只需要维护一份。

## 目录

```
app/                  网站、组件详情、文档
components/ui/        shadcn/ui 基础组件
components/demos.tsx  交互预览
registry/kalos/       可分发的 Base UI 组件
skills/kalos-ui/        AI Skill 与参考资料
lib/catalog.ts        组件目录与安装依赖
scripts/              注册表生成与验证
public/r/             CLI 可安装的 JSON
design/tokens.json    共享语义设计变量
```

## 部署

Vercel 导入此 GitHub 仓库，框架选择 Next.js，Node.js 选择 24.x；默认构建命令为 `npm run build`。站点与注册表地址统一读取 `lib/site.ts`，默认使用 `https://kalos-ui-six.vercel.app`；自定义域名时设置 `NEXT_PUBLIC_SITE_URL`。

每次部署前，完成本地验证，整理版本更新清单、兼容性影响与验证结果，并将内容列入[更新日志](app/docs/changelog/page.tsx)的“待发布”部分。用户要求提交、推送或部署时直接执行，无需额外人工审核或再次确认；会触发 Vercel 自动部署的推送或合并同样适用。部署成功后再记录实际部署日期；完整规范见 [AGENTS.md](AGENTS.md#更新日志与部署)。

组件使用 Base UI API，包括 render 组合、indeterminate 复选框状态和 NumberField 原生回调。

组件与详情页视觉规范参考 [Affect UI](https://www.affectui.com/components/text-field)，采用细边框、轻阴影与紧凑圆角。首页参考 [Animate UI](https://animate-ui.com/)，滚动轨道及开场动画适配其公开网站实现，保留许可于 `ANIMATE-UI-LICENSE.md`。动画代码仅用于网站展示，不包含在 Kalos UI 的组件注册表中。注册表协议遵循 [shadcn 官方文档](https://ui.shadcn.com/docs/registry)。

## License

Kalos UI 注册表组件使用 MIT 许可。shadcn/ui 基础组件保留其原有开源授权；Skeleton、Spinner 及部分预览适配自 Affect UI，授权见 `AFFECTUI-LICENSE.md`；首页适配代码遵循 `ANIMATE-UI-LICENSE.md`，品牌字标采用的 Outfit 字体遵循 `OUTFIT-LICENSE.txt`；界面 Roboto 字体遵循 `ROBOTO-LICENSE.txt`。

AI Answer 的里斯本团建预览参考 [Affect UI 的公开演示](https://www.affectui.com/components/ai-answer)。预览使用的站点图标来自各站点的 favicon 和 [Simple Icons 的维基百科标志](https://github.com/simple-icons/simple-icons/blob/develop/icons/wikipedia.svg)，商标归各权利方所有。

Context Window 的 token 网格与交互参考 [Affect UI 的公开演示](https://www.affectui.com/components/context-window)。预览中的 Claude 图标来自 [Simple Icons](https://github.com/simple-icons/simple-icons/blob/develop/icons/claude.svg)，商标归 Anthropic 所有。

Decision Card 的决策模式和会话预览参考 [Affect UI 的公开演示](https://www.affectui.com/components/decision-card)。Claude 图标来自 [Simple Icons](https://github.com/simple-icons/simple-icons/blob/develop/icons/claude.svg)，OpenAI、Gemini、Grok 和 Kimi 图标来自 [Lobe Icons](https://github.com/lobehub/lobe-icons)，商标归各权利方所有。

Permission Request 的授权流程和 API 参考 Affect UI 的公开演示与文档，使用 Base UI、Kalos 设计变量和 Lucide 图标独立实现。[Affect UI Permission Request](https://www.affectui.com/components/permission-request)

Permission Request 预览复用现有的 OpenAI 和 Claude 图标。Gemini 使用旧版品牌图形，授权保留在 SVG 内。Gmail、Stripe、Gemini 商标归各权利方所有。[SVG Logos](https://github.com/gilbarbara/logos/blob/main/logos/google-gmail.svg) · [Simple Icons](https://simpleicons.org/) · [Lobe Icons](https://github.com/lobehub/lobe-icons/blob/v1.50.0/packages/static-svg/icons/gemini-color.svg)

Response Stream 参考公开预览中的生成、停止、重试和排队流程，使用 Kalos UI 的样式与控件独立实现。[Affect UI Response Stream](https://www.affectui.com/components/response-stream)

Collaboration Stream 的参与者聚焦、交接、附件和回复交互参考公开预览，使用 Base UI 和 Kalos UI 的样式独立实现。示例中的 Notion、Figma、GitHub 与 Stripe 标志用于标识对应服务，商标归各权利方所有。[Affect UI Collaboration Stream](https://www.affectui.com/components/collaboration-stream)

Usage Meter 的周期切换、分类读数、每日趋势和额度预警参考公开演示与 API，使用 Base UI 独立实现。[Affect UI Usage Meter](https://www.affectui.com/components/usage-meter)
