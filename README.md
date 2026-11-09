# Pop UI

从基础出发，让想法成真。

[在线网站](https://pop-ui-six.vercel.app) · [组件目录](https://pop-ui-six.vercel.app/components) · [中文文档](https://pop-ui-six.vercel.app/docs/getting-started) · [Skills](https://pop-ui-six.vercel.app/docs/skills)

一套可以自己维护的 React / Vue UI 组件注册表，采用 Next.js App Router、TypeScript、Tailwind CSS v4、shadcn/ui（Radix）。

- 12 个基础组件及交互预览、源码展示、Props 说明
- 可搜索、可筛选的组件目录
- Astryx 中性风格、标准尺寸、中文界面、浅色与深色主题、响应式布局、键盘快捷搜索
- 符合官方 schema 的 shadcn 注册表、整库安装、可选 Pop 主题
- React 与 Vue 共用设计变量；可安装的 Pop UI AI Skill
- Animate UI 风格首页：Logo 描边入场与归位、文字轮播、滚动环绕卡片、交互演示
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

生产构建自动生成注册表并验证每个条目的官方 schema、源码完整性与一致性。

## 安装组件

先在消费者项目中运行 `npx shadcn@latest init --base radix`，选择 Radix 基础。然后从网站复制对应安装命令：

```bash
npx shadcn@latest add https://pop-ui-six.vercel.app/r/pop-button.json
```

也可在消费者的 `components.json` 配置命名空间：

```json
{
  "registries": {
    "@pop-ui": "https://pop-ui-six.vercel.app/r/{name}.json"
  }
}
```

```bash
npx shadcn@latest add @pop-ui/pop-button
```

不安装 Pop 主题时，组件使用你已有的 shadcn 语义变量。安装 `pop-theme.json` 可应用本站的配色。

一次安装全部组件：

```bash
npx shadcn@latest add https://pop-ui-six.vercel.app/r/pop-all.json
```

## Vue 组件

在 Vue 3.5+ / Nuxt 项目中配置 Tailwind CSS，然后初始化 shadcn-vue：

```bash
npx shadcn-vue@latest init
npx shadcn-vue@latest add https://pop-ui-six.vercel.app/r/vue/pop-all.json
```

Vue 版提供全部 12 个组件的独立 `.vue` 源码，基于 Reka UI。输入、开关和复选框通过 `v-model` 绑定，对话框使用 `v-model:open`。文档顶部切换框架后会同步切换安装、源码、示例和 API。

## AI Skill

```bash
npx skills add BuGuangshuo/pop-ui --skill pop-ui
```

Skill 位于 `skills/pop-ui/`，帮助支持 Agent Skills 的工具识别 React / Vue 项目、选择注册表、组合组件并调整动效。完整说明见[Skill 文档](https://pop-ui-six.vercel.app/docs/skills)。

## 新增组件

1. 在 `registry/pop/` 添加组件源码。
2. 在 `lib/catalog.ts` 中添加描述、shadcn 依赖、Props 与使用示例。
3. 在 `components/demos.tsx` 添加交互预览。
4. 执行 `npm run build`，提交并推送。

`registry.json`、`registry-vue.json`、`public/registry*.json`、`public/r/**/*.json` 由构建生成，请勿直接修改生成文件。源码只需要维护一份。

## 目录

```
app/                  网站、组件详情、文档
components/ui/        shadcn/ui 基础组件
components/demos.tsx  交互预览
registry/pop/         可分发的 React 组件
registry/vue/         可分发的 Vue 组件
skills/pop-ui/        AI Skill 与参考资料
lib/catalog.ts        组件目录与安装依赖
scripts/              注册表生成与验证
public/r/             CLI 可安装的 JSON
design/tokens.json    共享语义设计变量
```

## 部署

Vercel 导入此 GitHub 仓库，框架选择 Next.js，Node.js 选择 24.x；默认构建命令为 `npm run build`。Vercel 自动使用项目生产域名生成注册表元数据。自定义域名时可设置 `NEXT_PUBLIC_SITE_URL`。

React 使用 Radix 版 shadcn API，Vue 使用 shadcn-vue / Reka UI API。

组件与文档视觉规范参考 [Astryx](https://astryx.atmeta.com/)。首页参考 [Animate UI](https://animate-ui.com/)，滚动轨道及开场动画适配其公开网站实现，保留许可于 `ANIMATE-UI-LICENSE.md`。动画代码仅用于网站展示，不包含在 Pop UI 的组件注册表中。注册表协议遵循 [shadcn 官方文档](https://ui.shadcn.com/docs/registry)。

## License

Pop UI 注册表组件使用 MIT 许可。shadcn/ui 基础组件保留其原有开源授权；首页适配代码遵循 `ANIMATE-UI-LICENSE.md`，Outfit 字体及其 Logo 字形遵循 `OUTFIT-LICENSE.txt`。
