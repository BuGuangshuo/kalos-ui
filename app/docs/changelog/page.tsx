import type { Metadata } from "next";
import { Sidebar, OnThisPage } from "@/components/docs-parts";
import { DocsPagination } from "@/components/page-pagination";
import { ChangelogPreview } from "@/components/changelog-preview";
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

        <section id="v0-3-5" className="changelog-entry">
          <h2>v0.3.5 — 新组件与预览更新</h2>
          <ReleaseMeta version="0.3.5" />
          <p>组件导航会在最新正式发布版本的新增组件名称后显示蓝点。</p>
          <p>日期范围选择器的英文显示名称改为 Range Picker。</p>
          <p>Select 新增带图标、说明和禁用状态的选项，以及角色、模型和时区预览。共享控件使用翻转箭头、浮层过渡和 14px 描线勾选图标。原有 items 和 onValueChange 继续支持，clearable 默认关闭，可按需启用。</p>
          <div className="changelog-block">
            <h3>Table 表格滚动</h3>
            <p>纵向滚动时固定表头和分页区，滚动条从表头下方开始，滑块按内容区高度计算。横向滚动时表头与数据列同步移动。scrollAreaProps 的高度限制应用于数据行及汇总行。</p>
          </div>
          <div className="changelog-block">
            <h3>Stepper Form 分步表单</h3>
            <p>新增四步联系人分组预览，顶部使用蓝色进度线，当前和待填写步骤显示编号，完成后切换为勾号。支持步骤滑动、卡片高度过渡、字段校验、返回编辑、异步提交和成功页。提供可组合的输入、标签、单选卡片和复核子组件，支持受控步骤。</p>
            <p>预览进入视口后逐字填写分组名称，地址同步生成。用户开始编辑后接管输入，返回前序步骤时保留当前内容。完成页使用 32px 勾号徽标。</p>
            <p>提供按需安装、TSX 示例和键盘说明。已核验桌面与 390px 窄屏、深色主题、错误聚焦、标签粘贴、返回编辑、提交和重置。</p>
            <ChangelogPreview slug="kalos-stepper-form" />
          </div>
          <div className="changelog-block">
            <h3>OTP Input 验证码输入</h3>
            <p>组件目录展示完整的邮箱验证卡片，滚动到卡片时播放输入、验证和重试。</p>
            <p>邮箱预览打开时逐格播放验证码输入、验证失败和重试成功，点击或聚焦任一输入格即可接管。聚焦边缘和阴影复用 Text Input 的浅深主题样式，点击已填数字时仅显示焦点状态。</p>
            <p>新增分格验证码输入与邮箱验证预览，包含滑动焦点环、逐格扫光、错误抖动和成功勾选。支持整段粘贴、短信自动填充、重发倒计时与表单提交。已加入组件目录、安装注册表与 AI Skill。</p>
            <p>已通过完整构建和注册表校验，并在桌面及 320px 窄屏核验浅深主题与验证码交互。在独立 Vite 项目验证了按需安装、字母数字混合输入、原生表单提交和重发重试。</p>
            <ChangelogPreview slug="kalos-otp-input" />
          </div>
          <div className="changelog-block">
            <h3>Color Picker 颜色选择器</h3>
            <p>新增带弹层的颜色按钮与内嵌面板。支持拖动和键盘选色、HEX / RGB 输入、命名预设与可选透明度，并可随表单提交颜色。预览中的文档图标会随选色更新。组件可单独安装，也包含在完整组件库中。</p>
            <ChangelogPreview slug="kalos-color-picker" />
          </div>
          <div className="changelog-block">
            <h3>Dropzone 文件上传</h3>
            <p>新增拖放与多文件选择、格式和大小校验、实时进度、失败重试和移除。详情页自动播放五个文件，包含带蓝色图标的 Word 文档和超限的 MP4。支持通过 onUpload 接入上传端点，提供 TSX 示例、API、键盘说明及按需安装。</p>
            <p>颜色跟随 Kalos 主题和 Table 标签色板。拖放区采用折角纸张图标，文件列表用色条区分类型，上传完成时勾选线条描出，进度条填满后收起。</p>
            <p>新增按钮上传变体。初始仅显示上传按钮，选择文件后展开进度列表，支持重试和移除。</p>
            <p>本地验证覆盖桌面与 390px 窄屏、浅深主题、键盘选择、失败重试、取消上传与注册表安装。已同步按钮版在浅深主题下的空态和选中文件状态至 Figma。</p>
            <ChangelogPreview slug="kalos-dropzone" />
          </div>
          <p>首页轨道展示与网格预览改用当前 Kalos 组件，首位展示 Avatar，加入 Input、Select、Button 与 Notification。分段控制器仅保留一行，按钮预览不再展示“已归档”，清理旧版独立控件样式；站点布局与组件 API 保持不变。</p>
          <p>首页展示验证：Lint、类型检查通过；已核验桌面及 390px 窄屏、浅深主题、输入编辑与清空、标签点击、选择器键盘选择，以及通知关闭、操作与焦点衔接。Figwrite MCP 当前不可用，设计稿尚未同步。</p>
          <p>统一组件 API 表格列宽：说明列占 40%，类型列占 28%；长属性、类型与默认值在列内换行，窄屏在表格内横向滚动。仅调整文档排版，组件 API 保持兼容。</p>
          <p>修复组件源码、用法和手动安装代码的行号折行。行号栏按总行数预留宽度，长代码可在代码块内横向滚动。</p>
          <p>修复滚动组件页面时，日期选择器等浮层遮挡顶部导航的问题。</p>
          <p>API 表格验证：Lint 与类型检查通过，已检查全部 31 个组件页面的列宽及内容溢出，并截图核验桌面、390px 窄屏与浅深主题。Figwrite 当前没有连接设计文件，设计稿尚未同步。</p>
          <div className="changelog-block">
            <h3>Combobox 搜索选择器</h3>
            <p>新增分组搜索、多选和创建选项。详情页的审阅人预览默认展开并聚焦搜索框，可直接用方向键和 Enter 选择。十位审阅人使用卡通头像，新建选项在浮层和已选标签内均显示居中的灰底首字头像。</p>
            <p>浮层以 240ms 位移淡入，列表筛选以 300ms 调整高度，标签横向展开和折叠，蓝色勾选带弹性过渡。无匹配项提示与浮层顶部的距离对齐参考预览。补齐 TSX 示例、API 和按需安装入口。</p>
            <p>已核验桌面和 390px 窄屏、浅深主题、键盘选择、标签折叠与移除、创建选项和表单值。Figma 的 Combobox 浅深主题预览和创建状态已同步。</p>
            <p>Combobox 和 Range Picker 的外层选择框使用固定细边。键盘焦点提示显示在控件内部，Combobox 箭头使用柔和底色。</p>
            <ChangelogPreview slug="kalos-combobox" />
          </div>
          <div className="changelog-block">
            <h3>Toast 轻提示</h3>
            <p>移植 CostScope 的顶部居中胶囊提示、浅深主题颜色与阴影、彩色圆形图标，以及从中心展开和收起的动画。默认 3 秒关闭，支持堆叠、悬停和聚焦展开、向上或向右滑动关闭、操作按钮与异步任务状态。</p>
            <p>KalosToaster 与 toast.add、update、close、promise 保留 Base UI 管理器 API；新增可安装源码、接入步骤、交互示例与键盘说明。新增组件不影响现有调用。</p>
            <p>首个预览仅保留“显示提示”，其余示例展示提示类型、操作按钮与堆叠。</p>
            <p>验证：Lint、类型检查、完整生产构建、注册表校验、38 项安装器测试与 Toast 安装 dry-run 通过；已对比 CostScope 的实际尺寸、颜色、阴影和展开动画，并核验浅深主题、390px 窄屏、自动关闭、计时暂停、操作撤销、异步结果、堆叠、滑动与键盘焦点。Figwrite 未连接，设计稿尚未同步。</p>
            <ChangelogPreview slug="kalos-toast" />
          </div>
          <div className="changelog-block">
            <h3>Text Area 多行文本输入</h3>
            <p>新增多行文本输入，支持自动增高、字数统计、可选与错误状态，以及 ⌘/Ctrl+Enter 提交回调。右下角支持拖动调整高度，也可用方向键操作；手动高度在继续输入后保留，minRows / maxRows 约束自动与手动高度，达到上限后内部滚动；提供最大高度预览。表单重置时恢复自动增高。复用输入控件的浅深主题表面与聚焦样式；新增 API 不影响现有组件。安装器升级至 0.3.5，包含 Text Area 的按需与完整安装。</p>
            <p>验证：已核验桌面与 390px 窄屏、浅深主题、拖动与键盘调高、快捷提交、表单保存与重置、字数统计、超限预填和错误恢复；Figwrite 未连接，设计稿尚未同步。</p>
            <ChangelogPreview slug="kalos-text-area" />
          </div>
          <p>Dropdown Menu 主预览改为带排序的中文文档列表，每行提供打开、创建副本、复制链接、移动、通知和删除操作。组件目录直接展示文件操作菜单浮层。Popover 主预览改为每周摘要卡片，包含带图标的发送频率选择、取消与保存，以及摘要范围信息浮层。</p>
          <p>Dropdown Menu 展开时保留触发按钮底色，主预览菜单宽度调整为 180px；浮层继续与触发按钮右侧对齐，间隔 8px。已核验不同行的菜单锚点与 Escape 后焦点返回，Lint、类型检查和注册表校验通过。</p>
          <p>Popover 支持 ReactNode 触发内容，并新增可选 triggerProps，用于按钮外观、尺寸与可访问名称。原有文字触发器保持兼容；同步更新使用示例、API 与可安装源码。</p>
          <p>验证：Lint、类型检查、注册表校验与完整生产构建通过；已核验桌面和 390px 窄屏、浅深主题、菜单排序与子菜单、通知切换、复制记录与删除撤销，以及日程保存和取消、键盘选择、Escape 关闭与焦点返回。设计稿尚未同步。</p>
          <div className="changelog-block">
            <h3>Drawer 抽屉</h3>
            <p>新增基于 Base UI 的抽屉，支持上、右、下、左四个方向滑入与拖拽关闭。示例组合姓名、邮箱地址、联系人分组、提醒时间、日期范围与复选框，联系渠道和联系方式同一行展示。姓名、邮箱地址和提醒时间为必填项，确定时检查空值及邮箱格式，错误项显示提示并聚焦首个错误字段；校验通过后才显示 Spinner。每次打开先显示 KalosSkeleton，点击确定时显示 KalosSpinner，处理完成后再滑出；取消与右上角 X 直接关闭。四个弹出方向独立展示在变体预览中。</p>
            <p>loading、confirming 与 onConfirm 支持接入实际异步任务，保留 Base UI 打开状态和事件 API。默认聚焦容器，支持 Tab、Esc、遮罩关闭与焦点返回；确认处理中防止重复提交。新增组件不影响现有调用。</p>
            <p>本地验证：Lint、类型检查、完整构建、注册表校验与安装命令 dry-run 通过；已核验四向弹出、拖拽关闭、桌面与 390px 窄屏、浅深主题、表单标签与选择器浮层、日期范围应用、同行字段布局、必填及邮箱格式校验、错误聚焦与修正恢复、确定按钮 Spinner，以及取消与 X 在确认处理中直接关闭。Figwrite 未连接设计文件，尚未同步设计稿。</p>
            <ChangelogPreview slug="kalos-drawer" />
          </div>
          <div className="changelog-block">
            <h3>Notification 通知</h3>
            <p>新增层叠通知，参考 affectUI Notification Stack 的卡片递进、关闭动画与轨道、网格、射线图案，支持自定义图标、标签、正文和操作链接。后方卡片不进入键盘焦点顺序，关闭后可继续操作下一张。</p>
            <p>新增 floating 变体，position 支持右上（默认）、右下、左上、左下，底部位置向上层叠；同步补充四角交互预览、TSX 用法、API、安装注册表与 AI Skill。</p>
            <p>预览移除顶部标签与操作后的成功文案，操作按钮统一为 Primary，默认宽度调整为 400px，文字区增加右侧留白以避开背景蓝点；关闭按钮保持在右上角，修复热更新沿用旧样式导致的位置异常。action.onClick 支持返回 Promise：处理中复用 Button 的 loading 状态，保留原有按钮文字并在前面显示加载图标，成功后关闭当前通知，失败时保留并显示重试提示；同步操作执行后直接关闭。onDismiss 同时用于手动关闭和操作成功，异步操作期间的重复点击被禁用。</p>
            <p>Notification 验证：Lint、类型检查、完整生产构建、注册表校验、38 项安装器测试与安装命令 dry-run 通过；已核验桌面与 390px 窄屏、浅深主题、四角定位、底部向上层叠、Primary 按钮加载后关闭、处理中手动关闭、连续新增与清空、Tab 导航和关闭后的焦点衔接。Figwrite MCP 当前不可用，设计稿尚未同步。</p>
            <ChangelogPreview slug="kalos-notification" />
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
          <p>Badge 默认采用 Table 标签的 20px 高度、12px 文字、4px 圆角和左右 6px 内边距，共享浅深主题配色；警告色统一为 #f19021 橙色体系，灰、蓝、绿、紫、粉色与 Table 一致；失败使用独立的红色，粉色单独展示草稿状态。提供浅色底配状态色文字、全色底配白字、无背景三种变体，以及小号尺寸、圆点、呼吸动效、前置图标和封顶计数；补充全色与无背景预览及可复制代码。预览改为中文任务列表，包含时钟、暂停图标与 99+ 计数。</p>
          <p>保留旧版 status 属性与 Base UI render 组合；默认外观改为轻量圆角标签，原有调用无需迁移。</p>
          <div className="changelog-block">
            <h3>Pagination 分页器</h3>
            <p>新增分页器与中文文档列表预览，显示总条数，支持首页与末页、省略页码、每页条数和简洁模式。条数选择器位于页码后，隐藏可见标签，选项显示为 20条、50条、100条。改变每页条数时保留原首条记录所在页；窄容器自动收起页码，支持浅深主题和键盘焦点。详情保留默认与简洁模式预览，不展示条目范围。新增组件不影响现有调用。</p>
            <p>Table 详情新增分页表格示例，使用 67 条联系人数据演示翻页、每页条数切换和末页边界，附可复制的完整 TSX 代码。</p>
            <p>安装器升级至 0.3.3，支持按需安装 Pagination，并将其纳入完整组件库。Figwrite 已同步分页器、浅深主题变量与 Table 分页原型；设计稿内的表格滚动暂未配置。</p>
            <p>发布验证：Lint、TypeScript、80 项测试与完整生产构建通过；已核验注册表与安装器 dry-run，以及桌面和窄屏的翻页、条数切换、末页边界与布局。正式站点已核验 Table 分页交互，线上注册表与 0.3.3 安装包和本地生成产物一致。</p>
            <ChangelogPreview slug="kalos-pagination" caption={false} />
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
