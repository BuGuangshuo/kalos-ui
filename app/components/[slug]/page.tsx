import { readFile } from "node:fs/promises";
import path from "node:path";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { catalog } from "@/lib/catalog";
import { blocks } from "@/lib/blocks";
import { BlockDetails } from "@/components/block-details";
import { PagePagination } from "@/components/page-pagination";
import { ComponentDetails, ComponentInstallation, ComponentReference } from "@/components/component-details";
import { InstallCommand } from "@/components/site-shell";
import { CodeBlock } from "@/components/code-block";
import { reactExample } from "@/lib/component-examples";
import { hoverCardActivityExample } from "@/lib/hover-card-examples";
import { PopoverExamples } from "@/components/popover-examples";
import { DrawerExamples } from "@/components/drawer-examples";
import { NotificationExamples } from "@/components/notification-examples";
import { BadgeExamples } from "@/components/badge-examples";
import { PaginationExamples } from "@/components/pagination-examples";
import { SegmentedControlExamples } from "@/components/segmented-control-examples";
import { DropdownMenuExamples } from "@/components/dropdown-menu-examples";
import { NumberInputExamples } from "@/components/number-input-examples";
import { TextAreaExamples } from "@/components/text-area-examples";
import { ColorPickerExamples } from "@/components/color-picker-examples";
import { DropzoneExamples } from "@/components/dropzone-examples";
import { ToastExamples } from "@/components/toast-examples";
import { toasterSetupExample } from "@/lib/toast-examples";
import { TableExamples } from "@/components/table-examples";
import { tableExample, tableExampleVariants } from "@/lib/table-examples";
import { componentPrompt } from "@/lib/component-prompt";
import { installerCommand } from "@/lib/installer";
import { site } from "@/lib/site";

const componentPages = [...catalog, ...blocks];

function chapterLink(item: (typeof componentPages)[number]) {
  return { href: `/components/${item.slug}`, title: item.title };
}

export const dynamicParams = false;
export function generateStaticParams() {
  return componentPages.map(({ slug }) => ({ slug }));
}
export async function generateMetadata({ params }: PageProps<"/components/[slug]">) {
  const { slug } = await params;
  const item = componentPages.find((item) => item.slug === slug);
  return {
    title: item ? `${item.english} ${item.title}` : "组件",
    description: item?.description,
  };
}
export default async function DetailPage({ params }: PageProps<"/components/[slug]">) {
  const { slug } = await params;
  const index = componentPages.findIndex(item => item.slug === slug);
  if (index === -1) notFound();
  const pagination = <PagePagination
    previous={index > 0 ? chapterLink(componentPages[index - 1]) : { href: "/components", title: "全部组件" }}
    next={index + 1 < componentPages.length ? chapterLink(componentPages[index + 1]) : { href: "/docs/getting-started", title: "安装" }}
  />;
  const item = componentPages[index];
  if (!("category" in item)) return <BlockDetails item={item} pagination={pagination} />;
  const [source, hoverCardDemoSource, tableDemoSource, tableOptionsSource, tablePaginationSource, tableIconsSource, designStackSource, stepperDemoSource, contextWindowDemoSource] = await Promise.all([
    slug === "kalos-command-menu"
      ? readFile(path.join(process.cwd(), "components/ui/kalos-command-menu-panel.tsx"), "utf8")
      : readFile(path.join(process.cwd(), "registry/kalos", `${item.slug}.tsx`), "utf8"),
    slug === "kalos-hover-card" ? readFile(path.join(process.cwd(), "components/hover-card-activity-demo.tsx"), "utf8") : "",
    slug === "kalos-table" ? readFile(path.join(process.cwd(), "components/table-demo.tsx"), "utf8") : "",
    slug === "kalos-table" ? readFile(path.join(process.cwd(), "components/table-row-options.tsx"), "utf8") : "",
    slug === "kalos-table" ? readFile(path.join(process.cwd(), "components/table-pagination-demo.tsx"), "utf8") : "",
    slug === "kalos-table" ? readFile(path.join(process.cwd(), "components/stack-brand-icons.tsx"), "utf8") : "",
    slug === "kalos-table" ? readFile(path.join(process.cwd(), "components/design-stack-table.tsx"), "utf8") : "",
    slug === "kalos-stepper-form" ? readFile(path.join(process.cwd(), "components/stepper-form-demo.tsx"), "utf8") : "",
    slug === "kalos-context-window" ? readFile(path.join(process.cwd(), "components/context-window-demo.tsx"), "utf8") : "",
  ]);
  const example = stepperDemoSource
    ? stepperDemoSource.replace("@/registry/kalos/kalos-stepper-form", "@/components/ui/kalos-stepper-form").trim()
    : contextWindowDemoSource
    ? contextWindowDemoSource.replace("@/registry/kalos/kalos-context-window", "@/components/ui/kalos-context-window").trim()
    : reactExample(item);
  return (
    <article className="detail-content">
      <nav className="breadcrumbs" aria-label="面包屑导航">
        <Link href="/components">组件</Link>
        <ChevronRight />
        <span>{item.category}</span>
        <ChevronRight />
        <span>{item.title}</span>
      </nav>
      <header className="detail-title">
        <h1 className="component-title">
          {item.english}
          <span>{item.title}</span>
        </h1>
        <p>{item.description}</p>
        <InstallCommand slug={slug} />
      </header>
      <section id="preview">
        <ComponentDetails
          slug={slug}
          source={source}
          prompt={componentPrompt({
            name: `${item.title} ${item.english}`,
            description: item.description,
            installation: installerCommand(site.url, "npm", item.slug),
            example,
            docsUrl: `${site.url}/components/${item.slug}`,
            registryUrl: `${site.url}/r/${item.slug}.json`,
          })}
        />
      </section>
      <ComponentInstallation slug={slug} />
      {slug === "kalos-toast" ? <section id="toaster-setup">
        <h2>接入应用</h2>
        <p>在应用根部放置一次 KalosToaster，再从客户端调用 toast。默认位于页面顶部居中，3 秒后关闭。</p>
        <CodeBlock code={toasterSetupExample} language="tsx" />
      </section> : null}
      <section id="usage">
        <h2>使用</h2>
        {slug === "kalos-ai-answer" ? <p>示例使用本地数据演示分段生成。接入模型时，每收到一段就追加到 <code>answer</code>，流结束后将 <code>streaming</code> 设为 false，并在 <code>onStop</code> 中取消请求。</p> : null}
        {slug === "kalos-dropzone" ? <p>将示例中的 <code>/api/uploads</code> 替换为你的上传端点，并在服务端校验文件类型与大小。省略 <code>onUpload</code> 时使用本地模拟进度。</p> : null}
        {slug === "kalos-drawer" ? <p>表单示例还需安装 Input、Select、Time Picker、Range Picker 与 Checkbox：运行安装命令时追加 input select time-picker date-range-picker checkbox。示例计时器演示初始化与确认加载，实际接入时由数据请求与保存操作控制。</p> : null}
        {slug === "kalos-table" ? <p>默认示例的 Options 使用 Dropdown Menu、Dialog、Input 和 Button；同时安装这些组件，并运行 npm install sonner 以显示操作结果。已有 Toaster 时复用原有入口。</p> : null}
        <CodeBlock
          code={slug === "kalos-hover-card" ? hoverCardActivityExample(hoverCardDemoSource) : slug === "kalos-table" ? tableExample("data", tableDemoSource, tableOptionsSource, tablePaginationSource, tableIconsSource, designStackSource) : example}
          language="tsx"
        />
      </section>
      {slug === "kalos-number-input" && <NumberInputExamples />}
      {slug === "kalos-text-area" && <TextAreaExamples />}
      {slug === "kalos-dropzone" && <DropzoneExamples />}
      {slug === "kalos-color-picker" && <ColorPickerExamples />}
      {slug === "kalos-toast" && <ToastExamples />}
      {slug === "kalos-segmented-control" && <SegmentedControlExamples />}
      {slug === "kalos-dropdown-menu" && <DropdownMenuExamples />}
      {slug === "kalos-popover" && <PopoverExamples />}
      {slug === "kalos-drawer" && <DrawerExamples />}
      {slug === "kalos-notification" && <NotificationExamples />}
      {slug === "kalos-badge" && <BadgeExamples />}
      {slug === "kalos-pagination" && <PaginationExamples />}
      {slug === "kalos-table" && <TableExamples examples={Object.fromEntries(tableExampleVariants.map(({ variant }) => [variant, tableExample(variant, tableDemoSource, tableOptionsSource, tablePaginationSource, tableIconsSource, designStackSource)]))} />}
      <ComponentReference slug={slug} />
      {pagination}
    </article>
  );
}
