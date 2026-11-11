<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Kalos UI 项目规范

## 项目定位与技术栈

- Kalos UI 是可安装源码的 React / Vue 组件库，网站提供组件预览、源码、安装入口和中文文档。
- 使用 Next.js App Router、React、TypeScript、Tailwind CSS v4 和 shadcn/ui。以 `package.json` 中的实际版本为准；修改 Next.js 代码前先读上方要求的本地文档。
- 本仓库使用 Node.js 24.x 与 npm，安装依赖使用 `npm ci`。不要混入其他包管理器的锁文件；产品文档和安装器仍支持 npm、pnpm、yarn、bun。
- React 支持 Radix UI、Base UI、React Aria 三种基础库；Vue 组件基于 shadcn-vue / Reka UI。保留各自 API，不用一种基础库的实现冒充另一种。

## 设计与文案

**Avoid unnecessary secondary labels and descriptions. Let the layout do the explaining.**

**避免不必要的次要标签和描述，让布局本身来传达信息。**

- 默认不加辅助描述。先通过分组、间距、对齐、控件标签和状态建立层次，再判断是否需要文字。
- 每条辅助文案都必须提供新信息：输入约束、非显而易见的影响、校验原因、恢复方法等。删除后仍不影响理解和操作的内容，应删除。
- 不复述控件标签，不解释常见操作，不给每个示例、卡片、区块机械添加副标题、提示或总结。
- 不使用“让想法发生”“每一步更近一点”等套话填充组件示例。优先使用简短、具体的名称、数据与操作。
- 例如：邮箱字段只保留“邮箱地址”和输入框；“消息通知”开关无需再解释接收通知；“开发框架”选择器无需追加“选择基础框架”。
- `hint`、`description` 等可选属性继续支持，但默认示例省略；确有需要时再传入。不要为了展示属性而添加无用文案。
- 必须保留字段标签、图标按钮的可访问名称、对话框标题、必要的格式约束、错误与操作结果。精简文案不等于删掉语义或隐藏错误。
- 组件名称及其中英文对应、必要的 API 说明、安装选择提示可以保留；避免在同一界面重复显示已经由导航、标签页或分组表达的信息。
- 中文为默认界面语言；文档、示例和 AI Skill 应遵守同一原则。文档要解释真实用法，示例要能独立理解。

## 视觉与交互

- 组件采用细边框、轻阴影、紧凑圆角、白色表面和连续的状态过渡。设计变量统一维护在 `design/tokens.json`、`design/component-tokens.json`，由 `scripts/build-component-styles.mjs` 生成共享控件样式；`app/globals.css`，Figma 变量及样式同步更新。
- 默认控件高度 32px；按钮圆角 6px，输入与选择控件 7px，卡片/弹层 12px，页面容器 20px。开关为 32×20px，复选框为 16px、圆角 4.5px；菜单圆角 10px、选项圆角 6px；分段控件圆角 8px、内边距 2px；保留语义颜色和组件 variant。
- Dialog 桌面最大宽度 480px、窄屏两侧至少留白 16px；使用独立的 1px 浅深主题边框与双层投影，打开和关闭以 450ms 在 95% 缩放与完整尺寸之间淡入淡出；弹层缓动为 `cubic-bezier(0.22, 1, 0.36, 1)`。Footer 保留 1px 顶部分隔线、16px 内边距，桌面按钮组右对齐、间距 12px，窄屏纵向反排；不叠加灰色背景。标题栏上、左、右内边距 20px、底部为 0，内容区四边内边距 20px，表单项间距 14px；输入框、按钮及弹窗圆角沿用本组件库规范。标准演示包含两个输入项和带取消、确认按钮的底部操作区。
- 组件及右侧详情内容的样式迭代不得改变站点整体框架。保持现有导航、侧栏宽度及页面背景结构，不擅自增加外层灰色画布、圆角页面壳或重排全站布局。
- 顶部主导航只展示“首页 / 文档 / 组件 / 模版”；模版入口点击后提示“正在建设中”。“全部组件”概览不展示 React 基础库切换栏；基础库切换保留在组件详情中，侧栏的 React / Vue 框架切换保持全局共享。
- 组件详情提供可复制的 CLI / 手动安装方式、包管理器切换、带语法高亮与行号的使用示例、API 表格和必要的键盘说明。不添加“使用场景”“可访问性”独立介绍区块；组件本身仍保留完整的可访问语义。内容反映实际支持的功能，不照搬不存在的属性或行为。
- 保持中性黑白风格、浅色与深色主题。不要用硬编码颜色覆盖语义状态；布局使用 flex/grid 与 gap。
- 字体与 CostScope 的字体规范保持一致：界面、正文与标题使用 Roboto；中文依次回退 PingFang SC、Hiragino Sans GB、Microsoft YaHei，完整字体栈维护在全局样式及字体变量中。正文与按钮默认 400，标题 500–600，代码使用系统等宽字体。控件、表单标签、导航和正文统一为 13px / 20px；12px 辅助文字和独立标题层级按用途保留。字体对齐仅涉及排版；Dialog 另按上方弹窗规范处理，不把外部项目样式扩散到其他组件。
- 顶部搜索使用图标入口，点击或 ⌘/Ctrl+K 打开 Command Menu。全站索引从页面正文、列表说明及 API 描述生成，排除导航、标题、代码块与代码示例；结果提供正文命中上下文并高亮搜索词，不能只检索菜单和关键词。
- Command Menu 标题为 13px / 20px，正文匹配上下文作为辅助文字使用 12px / 18px；图标与标题首行居中对齐。搜索栏、分组标题、列表图标与底栏保持统一的 16px 内容缩进。安装方式 Tab 与内容区之间保留 16px 间距。
- Command Menu 保留方向键、Enter、Esc、Tab 分组导航，输入焦点不跳到结果列表；背景与 Select 一样以 180ms 连续滑动。没有结果的分组不渲染。
- Popover 操作列表与 Select 复用背景滑动机制：同一背景在可用项之间连续移动，禁用项不参与键盘导航或动作，关闭后恢复触发器焦点。
- 文本选区使用独立的 `selection-background` / `selection-foreground` 语义变量，浅深主题分别定义；不得复用白色表面变量或过淡的 hover 背景，正文、代码与输入选区必须清晰可辨。
- 输入与选择控件不叠加实体边框，使用 0.5px 边缘与两层微阴影；hover / focus 切换独立阴影变量。选择器背景滑动 180ms，分段指示器 200ms，开关滑块 260ms；实际颜色、阴影、浅深主题值以组件变量文件为准。
- Alert Dialog 最大宽度 400px，窄屏两侧至少留白 16px；使用 `alertdialog` 语义，默认聚焦取消，点击遮罩不关闭；确认按钮使用主要按钮的危险色状态；内容区统一内边距 20px，不设 Footer 分隔线或独立 Footer 内边距，按钮间距 12px。按钮预览包含危险态与禁用态，禁用按钮不响应操作。
- 品牌使用 AnimateIcons Disc3 圆盘与 Kalos UI 字标。共享路径维护在 `lib/brand.ts`、`lib/brand-icon.ts`，静态资源由脚本生成。
- 开场图标与字标同步：先描空心轮廓，再填实，最后归位到导航栏。不要恢复字形重叠的内部线条。
- 组件动效按设计完整播放，不额外适配“减少动态效果”设置；计时器、订阅和动画循环应在卸载时清理。
- 必须保留键盘操作、焦点管理、禁用/加载语义、标签与控件关联。不要用占位符代替标签。
- 不为没有描述的对话框编造说明以消除警告；正确处理可选描述的 ARIA 关联，保留标题与关闭行为。

## 目录与修改入口

| 路径 | 职责 |
| --- | --- |
| `app/` | 网站页面、文档、元数据和全局样式 |
| `components/ui/` | shadcn 基础组件及匹配的 Base UI / React Aria 实现 |
| `components/demo-content.tsx` | 三种 React 基础库共用的组件预览与示例文案 |
| `components/demos.tsx`、`*-demos.tsx` | 基础库选择及预览组件适配 |
| `components/home/` | 首页、开场动画、交互演示 |
| `registry/kalos/` | 可分发的 Radix 版 Kalos 组件 |
| `registry/base-ui/`、`registry/react-aria/` | 可分发的其他 React 版本 |
| `registry/vue/` | 可分发的 Vue 单文件组件 |
| `lib/catalog.ts`、`lib/vue-catalog.ts` | 组件目录、依赖、API 与使用示例 |
| `lib/search-content.json`、`scripts/build-search-index.mjs` | 从真实正文生成的搜索索引；构建和启动开发服务时自动更新 |
| `lib/site.ts` | 站点名称、GitHub 与正式站点地址 |
| `packages/cli/`、`lib/installer.ts` | 终端安装器与页面命令生成 |
| `scripts/` | 品牌、安装包、注册表生成与验证 |
| `skills/kalos-ui/` | 对外分发的 AI Skill 与参考文档 |

## 代码与组件约定

- 使用 TypeScript 和已有的 `@/` 路径别名；复用现有组件、工具与目录，不为小改动引入新依赖或抽象层。
- 页面默认保持 Server Component；需要状态、事件或浏览器 API 的部分才使用 `"use client"`。独立读取可并行执行，避免无必要的数据和组件重复加载。
- 组件导出为 `KalosXxx`，文件及注册表条目使用 `kalos-*`。Base UI / React Aria 基础文件使用 `kalos-base-*` / `kalos-aria-*`，避免安装冲突。
- 修改组件时核对三个 React 版本和 Vue 版本的相关行为、Props 与示例，不引入无意的 API 差异或框架迁移。
- 可选辅助内容不传时不占位；有错误时优先显示错误。控件 ID 使用稳定且唯一的生成方式，ARIA 不引用不存在的节点。
- 不随手改写无关组件或用户未完成的修改；不把注册表组件和首页演示专用代码耦合。

## 安装与生成产物

- 首页保留统一安装入口，React 基础库在终端选择；页面中的基础库切换器用于查看预览、源码和 API，不再产生三套首页安装入口。
- 安装器识别已有框架、基础库与包管理器，保留宿主项目的主题、目录和别名；不静默迁移基础库。非交互运行通过 `--base` 指定或沿用已配置的基础库。
- 站点 URL 统一读取 `lib/site.ts`，自定义部署使用 `NEXT_PUBLIC_SITE_URL`。生成脚本必须使用相同来源，不写入本机路径或遗留域名。
- `registry.json`、`registry-vue.json`、`public/registry*.json`、`public/r/**`、`packages/cli/manifest.json` 和 `public/cli/*.tgz` 都是生成产物。修改源组件、目录或生成脚本后重新生成，不直接修补产物。
- 品牌 SVG 和 favicon 同样由脚本生成；修改共享路径后运行 `npm run brand:build`。
- 发布新的安装器版本时递增 `packages/cli/package.json` 版本，并同步文档中的版本命令。不要在既有版本上悄悄发布不同实现。
- 保留上方 Next.js 自动管理的规则块和仓库中的授权文件。

## Figma 同步

- Figma 的读取、创建和更新统一使用 **Figwrite MCP 插件**（本机服务包为 `@figwright/mcp`），不另换其他 Figma 集成。
- 更新前通过 `ping` 确认插件连接，并确认目标文件；多个文件连接时明确选择并锁定本次文件，避免修改其他设计稿。
- 先读取文件已有的组件、变量、文本和效果样式，再同步代码中的设计。优先复用组件实例并绑定变量，不重复绘制或硬编码已有的设计值。
- 页面和组件样式变更应同步到对应 Figma 页面、组件及其状态；使用自动布局，保持命名、层级和变体一致。
- React / Vue 框架切换统一放在左侧栏的搜索与组件列表之间，全局共享；组件正文内不重复放置框架切换。左上品牌与侧栏菜单文字左对齐，在导航高度内垂直居中，使用紧凑尺寸。侧栏顶部不额外叠加间距；组件菜单英文在前、中文紧随其后，分类标题使用弱文字色与分隔线。
- 更新后截图或读回核验，确认布局、尺寸、文案与网页一致。连接中断或目标文件不可用时明确说明，不能声称已同步。

## 验证与交付

- 修改正文后运行 `npm run search:build`；修改索引提取或检索逻辑后运行 `npm run search:test`。`lib/search-content.json` 是生成产物，不手工维护正文副本。
- 代码修改运行 `npm run lint`；类型验证使用 `npm run typecheck`。`npm run build` 包含注册表生成、schema/源码校验、安装包生成、Next.js 类型检查与生产构建。
- 修改注册表或分发组件后运行 `npm run registry:build`，或直接运行完整构建。修改安装器逻辑后运行 `npm run cli:test`，并验证实际命令或 `--dry-run`。
- 文案、样式等低风险改动无需添加机械复述实现的测试；按受影响的行为选择验证，避免无意义重复运行检查。
- UI 改动在浏览器查看真实页面：检查受影响的基础库、窄屏布局和相关交互。涉及对话框时验证标题、打开、关闭与 Escape；涉及表单时验证标签点击、输入和错误反馈。
- 以截图核对布局，不只凭编译通过判断视觉结果。精简文案后检查是否出现空白占位、错误引用或可访问性警告。
- 交付说明写明实际改动、验证结果及尚未完成的发布步骤，区分本地完成与线上已生效。
