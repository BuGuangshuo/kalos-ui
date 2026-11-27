import Link from "next/link";
import type { Metadata } from "next";
import { Sidebar, OnThisPage } from "@/components/docs-parts";
import { DocsPagination } from "@/components/page-pagination";
import { ChangelogPreview } from "@/components/changelog-preview";
import { CommandMenuDemo } from "@/components/command-menu-demo";
import { changelogReleases } from "@/lib/changelog-releases";

export const metadata: Metadata = { title: "更新日志" };

const links = [
  ...Object.entries(changelogReleases).map(([version, { releasedOn }]) => ({
    id: `v${version.replaceAll(".", "-")}`,
    title: `v${version}${releasedOn ? "" : " · 待发布"}`,
  })),
  { id: "v0-2-0-fixes", title: "v0.2.0 · 后续修复" },
  { id: "v0-2-0", title: "v0.2.0" },
  { id: "v0-1-2", title: "v0.1.2" },
  { id: "v0-1-1", title: "v0.1.1" },
  { id: "v0-1-0", title: "v0.1.0" },
  { id: "initial", title: "网站初版" },
];

const releaseDateFormat = new Intl.DateTimeFormat("zh-CN", { dateStyle: "long", timeZone: "UTC" });

function ReleaseMeta({ version }: { version: keyof typeof changelogReleases }) {
  const { releasedOn } = changelogReleases[version];
  return <div className="changelog-meta">
    {releasedOn ? <time dateTime={releasedOn}>{releaseDateFormat.format(new Date(releasedOn))}</time> : null}
    <span>{releasedOn ? "正式发布" : "待发布"}</span>
  </div>;
}

export default function ChangelogPage() {
  return <div className="workbench">
    <Sidebar active="changelog" />
    <div className="docs-grid">
      <article className="changelog-content">
        <header className="docs-title changelog-title">
          <h1>更新日志</h1>
          <p>组件、安装器与文档的更新。</p>
        </header>

        <section id="v0-3-10" className="changelog-entry">
          <h2>v0.3.10 — 仪表盘模版、面包屑与空状态</h2>
          <ReleaseMeta version="0.3.10" />
          <div className="changelog-block">
            <h3><Link href="/templates/dashboard-01">dashboard-01 基础仪表盘</Link></h3>
            <p>模版与组件共用安装命令。将 dashboard-01 添加到 Next.js、Vite 或 React Router 项目后，即可在自己的页面中渲染仪表盘。</p>
            <p>从<Link href="/templates">模版目录</Link>查看流量概览、渠道对比和价格走势蜡烛图。顶栏可切换数据、加载骨架和空状态，切回数据时重播图表入场与指标计数。内嵌预览保留桌面布局，全屏按钮在新标签页打开当前页面。源码文件树随当前预览页切换，支持逐文件复制。</p>
          </div>
          <div className="changelog-block">
            <h3><Link href="/components/kalos-breadcrumb">Breadcrumb 面包屑</Link></h3>
            <p>沿路径返回任一上级页面，可用品牌图标标记工作区。容器变窄时，中间层级自动折入可用键盘操作的省略菜单。</p>
            <ChangelogPreview slug="kalos-breadcrumb" caption={false} full />
          </div>
          <div className="changelog-block">
            <h3><Link href="/components/kalos-empty-state">Empty State 空状态</Link></h3>
            <p>在空列表、搜索结果和未选中内容的面板中提示下一步操作。可替换图标、嵌入按钮，并选择带边框或无边框的布局。</p>
            <ChangelogPreview slug="kalos-empty-state" caption={false} full />
          </div>
          <p>分类统计图的默认配色由 Kalos 的浅深主题变量提供。需要自定义时，可在维度配置中指定每个分类的颜色。</p>
        </section>

        <section id="v0-3-8" className="changelog-entry">
          <h2>v0.3.8 — AI 思考状态、分类统计图与 Block</h2>
          <ReleaseMeta version="0.3.8" />
          <div className="changelog-block">
            <h3>Thinking State 思考状态</h3>
            <p>实时显示 AI 思考用时，按顺序展开搜索来源和处理步骤。时间轴可随时折叠，也可在完成后自动折叠。</p>
            <ChangelogPreview slug="kalos-thinking-state" caption={false} full />
          </div>
          <div className="changelog-block">
            <h3>Breakdown Chart 分类统计图</h3>
            <p>按类别统计记录数或数值总和，可切换堆叠维度，通过柱条浮层和联动表格查看各组明细。</p>
            <ChangelogPreview slug="kalos-breakdown-chart" caption={false} full />
          </div>
          <div className="changelog-block">
            <h3><Link href="/components/pricing-plans#preview">Pricing Plans 定价方案</Link></h3>
            <p>切换月付或年付，比较各套餐的价格、用量上限和功能。</p>
            <ChangelogPreview slug="pricing-plans" caption={false} full />
          </div>
          <div className="changelog-block">
            <h3><Link href="/components/logo-marquee#preview">Logo Marquee 品牌滚动条</Link></h3>
            <p>品牌标志横向循环，双行可反向移动，拖动可加速浏览。</p>
            <ChangelogPreview slug="logo-marquee" caption={false} full />
          </div>
          <div className="changelog-block">
            <h3><Link href="/components/invoice-credit#preview">Invoice &amp; Credit Note 发票与贷项通知单</Link></h3>
            <p>在发票和贷项通知单之间切换，逐项选择抵扣内容、调整金额并核对税额。</p>
            <ChangelogPreview slug="invoice-credit" caption={false} full />
          </div>
          <div className="changelog-block">
            <h3><Link href="/components/testimonial-wall#preview">Testimonial Wall 客户评价墙</Link></h3>
            <p>客户评价分列滚动，悬停、聚焦或按住时可暂停阅读。</p>
            <ChangelogPreview slug="testimonial-wall" caption={false} full />
          </div>
          <div className="changelog-block">
            <h3><Link href="/components/task-board#preview">Task Board 任务看板</Link></h3>
            <p>按状态组织任务，支持拖动卡片、按标题或编号搜索、按标签筛选和编辑详情。</p>
            <ChangelogPreview slug="task-board" caption={false} full />
          </div>
        </section>

        <section id="v0-3-7" className="changelog-entry">
          <h2>v0.3.7 — 智能体交互</h2>
          <ReleaseMeta version="0.3.7" />

          <div className="changelog-block">
            <h3>Permission Request 权限请求</h3>
            <p>在智能体执行操作前展示申请原因和影响明细，支持单次、限时和持续授权，并可撤销授权或重新请求。</p>
            <ChangelogPreview slug="kalos-permission-request" caption={false} full />
          </div>
          <div className="changelog-block">
            <h3>Response Stream 流式回复</h3>
            <p>逐步呈现智能体回复，支持停止、续写和重试，并展示引导、排队消息及完成后的操作。</p>
            <ChangelogPreview slug="kalos-response-stream" caption={false} full />
          </div>
          <div className="changelog-block">
            <h3>Collaboration Stream 协作消息流</h3>
            <p>在原对话中聚焦智能体消息，预览交接附件，并通过引用或 @ 点名回复。</p>
            <ChangelogPreview slug="kalos-collaboration-stream" caption={false} full />
          </div>
          <div className="changelog-block">
            <h3>Usage Meter 用量统计</h3>
            <p>按周期查看分类用量、每日趋势和套餐限制，并可从卡片购买额度。</p>
            <ChangelogPreview slug="kalos-usage-meter" caption={false} full />
          </div>

          <div className="changelog-block">
            <h3>其他更新</h3>
            <p>调浅组件预览在浅色与深色主题下的背景。</p>
          </div>
        </section>

        <section id="v0-3-6" className="changelog-entry">
          <h2>v0.3.6 — AI 会话组件</h2>
          <ReleaseMeta version="0.3.6" />

          <div className="changelog-block">
            <h3>AI Answer AI 回答</h3>
            <p>用来源卡片和行内引用呈现可核查的流式回答，支持停止、重新生成、复制、反馈和追问。</p>
            <ChangelogPreview slug="kalos-ai-answer" caption={false} />
          </div>
          <div className="changelog-block">
            <h3>Context Window 上下文窗口</h3>
            <p>用方格展示模型的 token 占用和容量预警，支持展开并移除附件、压缩会话历史。</p>
            <ChangelogPreview slug="kalos-context-window" caption={false} full />
          </div>
          <div className="changelog-block">
            <h3>Decision Card 决策卡片</h3>
            <p>在会话中处理编号选择、缩略图方案和审批，支持分页、自定义回答与稍后处理。</p>
            <ChangelogPreview slug="kalos-decision-card" caption={false} full />
          </div>

          <div className="changelog-block">
            <h3>其他更新</h3>
            <ul className="changelog-list">
              <li>Command Menu 预览加入品牌图标和四组中文命令，支持搜索服务名称，并用 ⌘ / Ctrl + 数字执行推荐操作。</li>
              <li>主导航和文档、组件侧栏悬停时，背景会像 Select 一样在条目间滑动。</li>
            </ul>
          </div>
        </section>

        <section id="v0-3-5" className="changelog-entry">
          <h2>v0.3.5 — 新组件与预览更新</h2>
          <ReleaseMeta version="0.3.5" />
          <p>新增 9 个组件，均可按需安装或随完整组件库安装。</p>

          <div className="changelog-block">
            <h3>Stepper Form 分步表单</h3>
            <p>将表单拆成多个步骤，支持逐步校验、返回编辑、提交前复核和异步提交。</p>
            <ChangelogPreview slug="kalos-stepper-form" caption={false} />
          </div>
          <div className="changelog-block">
            <h3>OTP Input 验证码输入</h3>
            <p>分格输入验证码，支持整段粘贴、短信自动填充、验证反馈和重发倒计时。</p>
            <ChangelogPreview slug="kalos-otp-input" caption={false} full />
          </div>
          <div className="changelog-block">
            <h3>Color Picker 颜色选择器</h3>
            <p>提供弹层与内嵌面板，支持拖动或键盘选色、HEX / RGB 输入、预设和透明度。</p>
            <ChangelogPreview slug="kalos-color-picker" caption={false} />
          </div>
          <div className="changelog-block">
            <h3>Dropzone 文件上传</h3>
            <p>提供拖放区与上传按钮，支持多文件添加、格式和大小校验、实时进度、失败重试及移除。</p>
            <ChangelogPreview slug="kalos-dropzone" caption={false} full />
          </div>
          <div className="changelog-block">
            <h3>Combobox 搜索选择器</h3>
            <p>搜索并多选分组选项，支持键盘切换、移除已选标签和创建新选项。</p>
            <ChangelogPreview slug="kalos-combobox" caption={false} />
          </div>
          <div className="changelog-block">
            <h3>Toast 轻提示</h3>
            <p>以胶囊样式显示操作反馈，支持堆叠、自动关闭、滑动关闭和异步结果。</p>
            <ChangelogPreview slug="kalos-toast" caption={false} />
          </div>
          <div className="changelog-block">
            <h3>Text Area 多行文本输入</h3>
            <p>支持自动增高、字数统计、拖动或键盘调整高度，以及快捷提交。</p>
            <ChangelogPreview slug="kalos-text-area" caption={false} />
          </div>
          <div className="changelog-block">
            <h3>Drawer 抽屉</h3>
            <p>支持从四边滑入和拖拽关闭，可用于表单，提供加载、校验和确认状态。</p>
            <ChangelogPreview slug="kalos-drawer" caption={false} />
          </div>
          <div className="changelog-block">
            <h3>Notification 通知</h3>
            <p>支持内联堆叠与四角浮动，可为通知添加自定义图标和异步操作。</p>
            <ChangelogPreview slug="kalos-notification" caption={false} />
          </div>

          <div className="changelog-block">
            <h3>其他更新</h3>
            <ul className="changelog-list">
              <li>组件导航保留最近一批新增组件的蓝点，直到下一批新组件正式发布。首页更新轨道和网格预览，加入 Avatar、Input、Select、Button 与 Notification。</li>
              <li>Select 支持带图标、说明和禁用状态的选项，可开启清空。日期范围选择器的英文名称改为 Range Picker，和 Combobox 一同调整外框焦点样式。</li>
              <li>Table 纵向滚动时固定表头和分页区，横向滚动时同步表头与数据列。</li>
              <li>Dropdown Menu 和 Popover 更新主预览。Popover 支持自定义触发内容及按钮属性。</li>
              <li>统一 API 表格列宽，修复代码行号换行及选择浮层遮挡站点导航的问题。</li>
            </ul>
          </div>
        </section>

        <section id="v0-3-4" className="changelog-entry">
          <h2>v0.3.4 — Table 内嵌分页</h2>
          <ReleaseMeta version="0.3.4" />
          <p>修复分页器与表格分离的问题：Table 新增 pagination 插槽，分页器位于表格容器底部，共用背景、圆角和外框。scrollAreaProps 支持限制内容区高度；仅表格内容滚动，分页区保持可见。翻页与切换每页条数时重置内容区滚动位置，并保留分页控件焦点。</p>
          <p>同步更新分页示例、完整 TSX 用法、API 与 AI Skill；新增属性均可选，现有 Table 调用无需修改。</p>
          <p>验证：Lint、类型检查、完整构建与 Table / Pagination 的 11 项测试通过；已在桌面和 390px 窄屏核验容器外框、独立滚动、翻页焦点、每页条数切换与末页边界。正式站点的内嵌分页和 Table 注册表已核验；Figwrite 已同步并读回核验 15 个分页变体及浅深主题布局。</p>
        </section>

        <section id="v0-3-3" className="changelog-entry">
          <h2>v0.3.3 — Pagination 与 Badge 中文预览</h2>
          <ReleaseMeta version="0.3.3" />

          <div className="changelog-block">
            <h3>Badge 徽标</h3>
            <p>用圆角标签标记任务状态，支持浅色、实色和无背景样式，以及图标、圆点与计数。</p>
          </div>
          <div className="changelog-block">
            <h3>Pagination 分页器</h3>
            <p>为列表和表格提供翻页、每页条数切换和简洁模式，窄屏自动收起页码。</p>
            <ChangelogPreview slug="kalos-pagination" caption={false} />
          </div>

          <div className="changelog-block">
            <h3>其他更新</h3>
            <p>Table 详情新增分页示例，安装器支持按需安装 Pagination。</p>
          </div>
        </section>

        <section id="v0-3-2" className="changelog-entry">
          <h2>v0.3.2 — 组件预览与旧路由清理</h2>
          <ReleaseMeta version="0.3.2" />
          <ul className="changelog-list">
            <li>修复 Segmented 在缩放预览中的高亮偏移与宽度异常，覆盖按钮、滑块和下划线样式，以及 Skeleton 的 Data / Loading 切换；溢出选项聚焦时仍正确滚动到可见区域。</li>
            <li>对齐 Skeleton 列表图标与首行占位条，并同步调整 Data 状态的图标位置。</li>
            <li>移除旧品牌组件页与注册表地址的兼容重定向，统一使用 Kalos UI 地址。</li>
            <li>更新部署规范：按用户发布指令直接提交、推送和部署，无需额外人工审核；保留发布前验证与更新日志维护。</li>
          </ul>
        </section>

        <section id="v0-3-1" className="changelog-entry">
          <h2>v0.3.1 — 组件扩展与安装升级</h2>
          <ReleaseMeta version="0.3.1" />
          <p>新增日期、时间、表格和加载反馈等组件，统一安装入口，并更新 AI 工具栏与文档体验。</p>

          <div className="changelog-block">
            <h3>日期与时间选择</h3>
            <p>新增 Date Picker、Range Picker 和 Time Picker。星期按一至日显示，支持日期与时间限制、键盘操作和弹层动画；日期范围支持悬停预览，仅在应用后保存，关闭时丢弃未应用的选择，并支持清空。</p>
            <ChangelogPreview slug="kalos-date-range-picker" />
            <div className="changelog-preview-grid">
              <ChangelogPreview slug="kalos-date-picker" />
              <ChangelogPreview slug="kalos-time-picker" />
            </div>
          </div>

          <div className="changelog-block">
            <h3>Skeleton 与 Spinner</h3>
            <p>骨架屏保留内容布局，提供同步扫光与延迟淡入；加载指示器使用持续旋转的细圆弧，跟随文字颜色，并支持多种尺寸。</p>
            <div className="changelog-preview-grid changelog-preview-grid--loading">
              <ChangelogPreview slug="kalos-skeleton" />
              <ChangelogPreview slug="kalos-spinner" />
            </div>
          </div>

          <div className="changelog-block">
            <h3>Table</h3>
            <p>新增可排序、筛选和编辑的表格。默认示例增加 Options 操作，与 Dropdown Menu 共用菜单项；提供带表格线模式，合并单元格采用表格线。单元格文字溢出时显示省略号，仅在实际溢出时通过 Tooltip 展示完整内容。</p>
            <ChangelogPreview slug="kalos-table" caption={false} />
          </div>

          <div className="changelog-block">
            <h3>更多组件与交互</h3>
            <p>新增 Dropdown Menu、Number Input、Hover Card 和 Tooltip；分段控制器独立为 Segmented Control，更新头像与卡片示例。悬停卡片初始保持关闭，悬停或键盘聚焦时展开。</p>
            <div className="changelog-preview-grid">
              <ChangelogPreview slug="kalos-dropdown-menu" />
              <ChangelogPreview slug="kalos-number-input" />
            </div>
            <ChangelogPreview slug="kalos-hover-card" full />
            <div className="changelog-preview-grid">
              <ChangelogPreview slug="kalos-tooltip" />
              <ChangelogPreview slug="kalos-segmented-control" />
            </div>
          </div>

          <div className="changelog-block">
            <h3>统一安装与 AI 接入</h3>
            <p>基础库统一为 Base UI，移除 Radix UI 与 React Aria 的实现、依赖和切换入口。安装器保留宿主项目的主题、目录与别名；已有其他基础库的项目需先手动迁移。</p>
            <ul className="changelog-list">
              <li>组件工具栏增加主题切换、刷新、Claude、Codex、Cursor、v0、MCP 与复制。AI 入口携带经过 URL 编码的中文提示词，主题切换沿用顶部导航的圆形展开动画。</li>
              <li>新增 MCP 配置文档及 Claude Code、Codex、Cursor 的项目配置；通过 shadcn MCP 检索组件、查看信息与依赖并生成安装命令。</li>
            </ul>
          </div>

          <div className="changelog-block">
            <h3>网站与文档</h3>
            <ul className="changelog-list">
              <li>组件总览自动缩放较大的表单、表格和分段控制器；Dropdown Menu 使用独立“更多菜单”按钮预览；组件详情的安装介绍省略基础库名称。</li>
              <li>首页轮播改为 Kalos UI、Base UI、Template，固定轮播区域宽度，前面的文字保持原位；精简首页介绍与 Skill 文档入口。</li>
              <li>设计基础导航按章节滚动定位，“在项目中使用”改为“使用变量”；左侧导航使用细浅灰滚动条，长菜单保持单行，切换页面时保留滚动位置。</li>
              <li>组件详情统一使用英文主标题与中文小标题；API 表格内单个标签完整展示且不换行，较长的使用代码限制高度并支持滚动。</li>
              <li>新增更新日志导航及历史记录，按更新主题介绍功能并展示组件预览；每次部署前整理更新清单，经过审核确认后再部署。</li>
            </ul>
          </div>
        </section>

        <section id="v0-2-0-fixes" className="changelog-entry">
          <h2>v0.2.0 — 搜索与浮层修复</h2>
          <div className="changelog-meta"><time dateTime="2026-11-13">2026年11月13日</time><span>Git 记录 · 后续修复</span></div>
          <ul className="changelog-list">
            <li>修复全站搜索命中设计系统章节时的异常。</li>
            <li>统一当时各基础库的 Popover 退出动画，并同步到可安装源码。</li>
          </ul>
        </section>

        <section id="v0-2-0" className="changelog-entry">
          <h2>v0.2.0 — 初始化安装器与 Form</h2>
          <div className="changelog-meta"><time dateTime="2026-11-12">2026年11月12日</time><span>Git 记录</span></div>
          <p>安装器新增 init，可创建 Next.js、Vite、React Router 项目，选择项目名与包管理器并安装完整组件库；add 继续支持已有项目。</p>
          <div className="changelog-block">
            <h3>Form</h3>
            <p>新增表单组件，支持字段校验、错误反馈与可选提示，完整安装清单扩展为 16 个组件。</p>
            <ChangelogPreview slug="kalos-form" caption={false} />
          </div>
          <ul className="changelog-list">
            <li>整合快速开始中的安装、框架接入和组件用法，注册表配置拆为独立文档，增加上一章与下一章导航。</li>
            <li>调整 Popover 的基础内容、对齐和筛选表单示例，统一控件样式；修复可安装进度条未完成一端的圆角。</li>
          </ul>
        </section>

        <section id="v0-1-2" className="changelog-entry">
          <h2>v0.1.2 — Alert Dialog</h2>
          <div className="changelog-meta"><time dateTime="2026-11-11">2026年11月11日</time><span>Git 记录</span></div>
          <p>新增确认对话框，支持取消、确认及受控打开状态，完整安装清单扩展为 15 个组件。</p>
          <ChangelogPreview slug="kalos-alert-dialog" caption={false} />
          <p>Dialog 增加底部操作区与受控状态；统一组件尺寸、圆角、阴影和聚焦样式。</p>
        </section>

        <section id="v0-1-1" className="changelog-entry">
          <h2>v0.1.1 — Command Menu 与 Popover</h2>
          <div className="changelog-meta"><time dateTime="2026-11-10">2026年11月10日</time><span>Git 记录</span></div>
          <p>完整安装清单加入 Command Menu 与 Popover，从 12 个组件扩展为 14 个；品牌更名为 Kalos UI，更新圆盘标志、字标与网站资源，首页及导航加入圆形主题切换效果。</p>
          <ChangelogPreview slug="kalos-command-menu" full>
            <CommandMenuDemo compact={false} autoFocus={false} />
          </ChangelogPreview>
          <ChangelogPreview slug="kalos-popover" />
        </section>

        <section id="v0-1-0" className="changelog-entry">
          <h2>v0.1.0 — 按需安装组件源码</h2>
          <div className="changelog-meta"><time dateTime="2026-11-10">2026年11月10日</time><span>Git 首次收录</span></div>
          <p>提供站点托管的 CLI 安装包，可向已有项目按需安装组件，保留已有主题与路径别名，并支持 dry-run 查看安装命令。</p>
          <p>完整安装清单包含 Button、Input、Card、Badge、Switch、Checkbox、Tabs、Accordion、Dialog、Select、Progress、Avatar Stack，共 12 个组件。</p>
        </section>

        <section id="initial" className="changelog-entry">
          <h2>2026年11月 — 网站初版</h2>
          <div className="changelog-meta"><time dateTime="2026-11-09">2026年11月9日</time><span>Git 记录</span></div>
          <p>建立组件注册表、组件预览与中文文档，提供源码和安装入口；加入首页开场动画、轨道卡片、交互演示与 AI Skill。</p>
        </section>

        <DocsPagination current="/docs/changelog" />
      </article>
      <OnThisPage links={links} />
    </div>
  </div>;
}
