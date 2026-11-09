# Pop UI

Small details. Better interfaces.

一套可以自己维护的 React UI 组件注册表，采用 Next.js App Router、TypeScript、Tailwind CSS v4、shadcn/ui（Radix）。

- 12 个基础组件及交互预览、源码展示、Props 说明
- 可搜索、可筛选的组件目录
- 浅色与深色主题、响应式布局、键盘快捷搜索
- 符合官方 schema 的 shadcn 注册表、可选 Pop 主题
- 共享设计变量，配套 Figma 组件库
- GitHub + Vercel 持续部署

## 本地运行

需要 Node.js 22.18+（推荐 24 LTS）和 npm。

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
npx shadcn@latest add https://YOUR-DOMAIN/r/pop-button.json
```

也可在消费者的 `components.json` 配置命名空间：

```json
{
  "registries": {
    "@pop-ui": "https://YOUR-DOMAIN/r/{name}.json"
  }
}
```

```bash
npx shadcn@latest add @pop-ui/pop-button
```

不安装 Pop 主题时，组件使用你已有的 shadcn 语义变量。安装 `pop-theme.json` 可应用本站的配色。

## 新增组件

1. 在 `registry/pop/` 添加组件源码。
2. 在 `lib/catalog.ts` 中添加描述、shadcn 依赖、Props 与使用示例。
3. 在 `components/demos.tsx` 添加交互预览。
4. 执行 `npm run build`，提交并推送。

`registry.json`、`public/registry.json`、`public/r/*.json` 由构建生成，请勿直接修改生成文件。源码只需要维护一份。

## 目录

```
app/                  网站、组件详情、文档
components/ui/        shadcn/ui 基础组件
components/demos.tsx  交互预览
registry/pop/         可分发的 Pop 组件
lib/catalog.ts        组件目录与安装依赖
scripts/              注册表生成与验证
public/r/             CLI 可安装的 JSON
design/tokens.json   与 Figma 共用的语义设计变量
```

## 部署

Vercel 导入此 GitHub 仓库，框架选择 Next.js，Node.js 选择 24.x；默认构建命令为 `npm run build`。Vercel 自动使用项目生产域名生成注册表元数据。自定义域名时可设置 `NEXT_PUBLIC_SITE_URL`。

当前组件使用 Radix 版 shadcn API。Figma 的变量、文字样式和组件来自相同的配色与尺寸规范。动画交互以代码为准，Figma 展示静态组件状态。

网站信息架构参考 [Affect UI](https://www.affectui.com/)，实现与源码独立编写。注册表协议遵循 [shadcn 官方文档](https://ui.shadcn.com/docs/registry)。

## License

MIT. shadcn/ui 基础组件保留其原有开源授权。

Figma: [Pop UI · Design System](https://www.figma.com/design/EiullLF6nF6hpxIENCatbU/Pop-UI)（30 个主组件、9 个变体集、2 个设计页面）。
