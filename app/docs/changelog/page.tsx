import type { Metadata } from "next";
import { Sidebar, OnThisPage } from "@/components/docs-parts";
import { DocsPagination } from "@/components/page-pagination";
import { Badge } from "@/components/ui/badge";
import { ChangelogPreview } from "@/components/changelog-preview";

export const metadata: Metadata = { title: "更新日志" };

const links = [
  { id: "unreleased", title: "v0.3.1 · 待发布" },
  { id: "v0-2-0-fixes", title: "v0.2.0 · 后续修复" },
  { id: "v0-2-0", title: "v0.2.0" },
  { id: "v0-1-2", title: "v0.1.2" },
  { id: "v0-1-1", title: "v0.1.1" },
  { id: "v0-1-0", title: "v0.1.0" },
  { id: "initial", title: "网站初版" },
];

export default function ChangelogPage() {
  return <div className="workbench">
    <Sidebar active="changelog" />
    <div className="docs-grid">
      <article className="changelog-content">
        <header className="docs-title changelog-title">
          <h1>更新日志</h1>
          <p>组件、安装器与文档的更新。历史日期以 Git 记录为准。</p>
        </header>

        <section id="unreleased" className="changelog-entry">
          <h2>v0.3.1 — 组件扩展与安装升级<Badge variant="secondary">待发布</Badge></h2>
          <p>新增日期、时间、表格和加载反馈等组件，统一安装入口，并更新 AI 工具栏与文档体验。</p>

          <div className="changelog-block">
            <h3>日期与时间选择</h3>
            <p>新增 Date Picker、Date Range Picker 和 Time Picker。星期按一至日显示，支持日期与时间限制、键盘操作和弹层动画；日期范围支持悬停预览，仅在应用后保存，关闭时丢弃未应用的选择，并支持清空。</p>
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
              <ChangelogPreview slug="kalos-hover-card" />
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
          <div className="changelog-preview-grid">
            <ChangelogPreview slug="kalos-command-menu" />
            <ChangelogPreview slug="kalos-popover" />
          </div>
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
