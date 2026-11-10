# Kalos UI

从组件开始，构建你的界面。

[在线网站](https://kalos-ui-six.vercel.app) · [组件目录](https://kalos-ui-six.vercel.app/components) · [中文文档](https://kalos-ui-six.vercel.app/docs/getting-started) · [Skills](https://kalos-ui-six.vercel.app/docs/skills)

一套可以自己维护的 React / Vue UI 组件注册表，采用 Next.js App Router、TypeScript、Tailwind CSS v4、shadcn/ui（Radix UI / Base UI / React Aria）。

开发与设计规范见 [AGENTS.md](./AGENTS.md)。

- 14 个基础组件及交互预览、源码展示、Props 说明
- 可搜索、可筛选的组件目录
- Affect UI Clean 风格、标准尺寸、中文界面、浅色与深色主题、响应式布局、键盘快捷搜索
- 符合官方 schema 的 shadcn 注册表、整库安装、可选 Kalos 主题
- React 与 Vue 共用设计变量；可安装的 Kalos UI AI Skill
- Animate UI 风格首页：Logo 描边入场与归位、文字轮播、滚动环绕卡片、交互演示
- AnimateIcons Disc3 圆盘标志与 Outfit SemiBold（600）字标；界面与正文采用 Roboto，控件与正文为 14px / 20px、400 字重，标题 500–600
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

## 安装组件

在已有项目的根目录运行一个命令：

```bash
npx https://kalos-ui-six.vercel.app/cli/kalos-ui-0.1.1.tgz
```

React 用户在终端选择 Radix UI、Base UI 或 React Aria，Vue 项目自动使用 Reka UI。尚未配置 shadcn 的项目会先引导初始化；已有项目默认选中当前基础库，沿用现有主题和目录。

按需安装和非交互安装使用相同入口：

```bash
# 只安装按钮和卡片
npx https://kalos-ui-six.vercel.app/cli/kalos-ui-0.1.1.tgz add button card
# 明确选择 Base UI，适用于脚本和 CI
npx https://kalos-ui-six.vercel.app/cli/kalos-ui-0.1.1.tgz --base base --yes
# 只预览将执行的命令
npx https://kalos-ui-six.vercel.app/cli/kalos-ui-0.1.1.tgz --base aria --dry-run
```

安装器随站点构建为可通过 npx 执行的包，无需单独发布 npm。开发预览的安装命令会自动带上当前注册表站点。可以运行 `npm run cli:build` 单独打包、`npm run cli:test` 验证安装流程。修改安装器并发布新版本时应递增 `packages/cli/package.json` 的版本号。

默认只安装组件，不修改宿主主题。需要本站配色时显式执行 `add theme`。原 `pop-*` 组件详情与注册表地址会跳转到对应的 `kalos-*` 地址；已有直连地址仍可使用。

## 高级：直接使用注册表

React 的三个版本均支持全部 14 个组件。统一安装器会自动选择对应入口；需要直接调用 shadcn 时，也可根据项目的基础库运行：

```bash
# Base UI
npx shadcn@latest init --base base
npx shadcn@latest add https://kalos-ui-six.vercel.app/r/base-ui/kalos-all.json
# React Aria
npx shadcn@latest init --base aria
npx shadcn@latest add https://kalos-ui-six.vercel.app/r/react-aria/kalos-all.json
```

Base UI / React Aria 版本包含匹配的基础组件源码和包依赖，不依赖 Radix。每个版本均提供单组件、整库和可选主题入口。同一项目选择一个版本，避免覆盖同名 Kalos 组件；旧的 `/r/*.json` 继续指向 Radix。页面的底层库选择器会同步切换预览、源码、安装命令和 API。React Aria 按钮使用 `onPress`，Base UI 复选框使用 `indeterminate`，React Aria 复选框使用 `isIndeterminate`。

## Vue 组件

在 Vue 3.5+ / Nuxt 项目中配置 Tailwind CSS，然后运行同一个安装器：

```bash
npx https://kalos-ui-six.vercel.app/cli/kalos-ui-0.1.1.tgz
```

Vue 版提供全部 14 个组件的独立 `.vue` 源码，基于 Reka UI。输入、开关和复选框通过 `v-model` 绑定，对话框使用 `v-model:open`。文档顶部切换框架后会同步切换安装、源码、示例和 API。

## AI Skill

```bash
npx skills add BuGuangshuo/kalos-ui --skill kalos-ui
```

Skill 位于 `skills/kalos-ui/`，帮助支持 Agent Skills 的工具识别 React / Vue 项目、选择注册表、组合组件并调整动效。完整说明见[Skill 文档](https://kalos-ui-six.vercel.app/docs/skills)。

## 新增组件

1. 在 `registry/kalos/` 添加组件源码。
2. 在 `lib/catalog.ts` 中添加描述、shadcn 依赖、Props 与使用示例。
3. 在 `components/demos.tsx` 添加交互预览。
4. 执行 `npm run build`，提交并推送。

`registry.json`、`registry-vue.json`、`public/registry*.json`、`public/r/**/*.json` 由构建生成，请勿直接修改生成文件。源码只需要维护一份。

## 目录

```
app/                  网站、组件详情、文档
components/ui/        shadcn/ui 基础组件
components/demos.tsx  交互预览
registry/kalos/         可分发的 Radix 组件
registry/base-ui/     可分发的 Base UI 组件
registry/react-aria/  可分发的 React Aria 组件
registry/vue/         可分发的 Vue 组件
skills/kalos-ui/        AI Skill 与参考资料
lib/catalog.ts        组件目录与安装依赖
scripts/              注册表生成与验证
public/r/             CLI 可安装的 JSON
design/tokens.json    共享语义设计变量
```

## 部署

Vercel 导入此 GitHub 仓库，框架选择 Next.js，Node.js 选择 24.x；默认构建命令为 `npm run build`。站点与注册表地址统一读取 `lib/site.ts`，默认使用 `https://kalos-ui-six.vercel.app`；自定义域名时设置 `NEXT_PUBLIC_SITE_URL`。

React 按选择使用 Radix UI、Base UI 或 React Aria，Vue 使用 shadcn-vue / Reka UI API。

组件与详情页视觉规范参考 [Affect UI](https://www.affectui.com/components/text-field)，采用细边框、轻阴影与紧凑圆角。首页参考 [Animate UI](https://animate-ui.com/)，滚动轨道及开场动画适配其公开网站实现，保留许可于 `ANIMATE-UI-LICENSE.md`。动画代码仅用于网站展示，不包含在 Kalos UI 的组件注册表中。注册表协议遵循 [shadcn 官方文档](https://ui.shadcn.com/docs/registry)。

## License

Kalos UI 注册表组件使用 MIT 许可。shadcn/ui 基础组件保留其原有开源授权；首页适配代码遵循 `ANIMATE-UI-LICENSE.md`，品牌字标采用的 Outfit 字体遵循 `OUTFIT-LICENSE.txt`；界面 Roboto 字体遵循 `ROBOTO-LICENSE.txt`。
