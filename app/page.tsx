import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Code2,
  Box,
  Layers,
  Sun,
  Moon,
} from "lucide-react";
import { HeroShowcase, HomeControls, ComponentDemo } from "@/components/demos";
import { InstallCommand } from "@/components/site-shell";
import { catalog } from "@/lib/catalog";
import { site } from "@/lib/site";
export default function Home() {
  return (
    <>
      <section className="home-hero">
        <div className="hero-center">
          <div className="hero-wordmark" aria-label="Pop UI">
            pop<span>ui</span>
          </div>
          <h1>
            一套开源组件库，
            <br />
            <strong>让设计与开发自然衔接。</strong>
          </h1>
          <div className="hero-actions">
            <Link href="/docs/getting-started" className="primary-link">
              开始使用 <ArrowRight />
            </Link>
            <Link href="/components" className="secondary-link">
              浏览组件
            </Link>
          </div>
          <p className="hero-meta">
            源码开放，自由定制 · 基于 React 与 shadcn/ui
          </p>
        </div>
        <div className="hero-stage">
          <HeroShowcase />
        </div>
        <div className="hero-bottom-note">
          <span />
          <span>为每一个好想法，准备好基础。</span>
          <span />
        </div>
      </section>
      <section className="home-features">
        <div className="features-grid">
          <div className="features-column">
            <div className="feature-intro">
              <span className="eyebrow">从基础出发</span>
              <h2>
                即刻开始。
                <br />
                自由定制。
                <br />
                让想法更快落地。
              </h2>
              <p>
                不必反复搭建相同的基础。用一致的组件与设计变量，把时间留给真正重要的创意。
              </p>
            </div>
            <Link className="feature-card theme-feature" href="/docs/tokens">
              <h3>为你的品牌，找到自己的表达</h3>
              <p>从中性主题开始，用语义变量统一颜色、间距、圆角和排版。</p>
              <span className="feature-link">
                探索设计变量 <ArrowUpRight />
              </span>
              <div className="theme-swatches">
                <div />
                <div />
                <div />
                <div />
                <div />
              </div>
              <div className="type-sample">
                Aa <span>简洁，有序，恰到好处。</span>
              </div>
            </Link>
          </div>
          <div className="features-column">
            <div className="feature-card components-feature">
              <h3>从 12 个核心组件开始</h3>
              <p>
                覆盖操作、输入、内容、导航与反馈。预览每一种状态，复制你需要的代码。
              </p>
              <Link href="/components" className="feature-link">
                浏览组件 <ArrowUpRight />
              </Link>
              <HomeControls />
            </div>
            <Link
              className="feature-card code-feature"
              href="/docs/getting-started#usage"
            >
              <h3>每一行代码，都由你掌控</h3>
              <p>组件直接安装到项目中。按需使用，随时修改。</p>
              <div className="mini-code">
                <div>
                  <span />
                  <span />
                  <span />
                  <small>your-next-idea.tsx</small>
                </div>
                <pre>
                  <span>import</span> {"{ PopButton }"}
                  <br /> <span>from</span>{" "}
                  &quot;@/components/ui/pop-button&quot;
                  <br />
                  <br />
                  <span>export default function</span> App() {"{"}
                  <br /> <span>return</span>{" "}
                  &lt;PopButton&gt;开始构建&lt;/PopButton&gt;
                  <br />
                  {"}"}
                </pre>
              </div>
            </Link>
          </div>
          <div className="features-column">
            <a
              className="feature-card design-feature"
              href={site.figma}
              target="_blank"
              rel="noreferrer"
            >
              <h3>从画布到代码，保持一致</h3>
              <p>
                配套 Figma 组件、变量与组合示例，让设计与开发使用同一套语言。
              </p>
              <span className="feature-link">
                打开 Figma <ArrowUpRight />
              </span>
              <div className="figma-preview">
                <div className="figma-toolbar">
                  <span>◈ Pop UI</span>
                  <span>设计系统</span>
                </div>
                <div className="figma-canvas">
                  <div>
                    <i />
                    <strong>项目设置</strong>
                    <span />
                    <span />
                    <b>保存更改</b>
                  </div>
                  <div>
                    <strong>组件变量</strong>
                    <p>颜色 · 尺寸 · 间距</p>
                    <span />
                    <span />
                    <span />
                  </div>
                </div>
                <div className="figma-cursor">
                  ↖ <span>Alan</span>
                </div>
              </div>
            </a>
            <Link
              className="feature-card modes-feature"
              href="/docs/tokens#colors"
            >
              <div className="mode-symbols">
                <Sun />
                <Moon />
              </div>
              <h3>明暗之间，体验始终如一</h3>
              <p>
                浅色与深色语义变量成套定义，切换主题时保持清晰的层次与对比。
              </p>
              <span className="feature-link">
                了解主题 <ArrowUpRight />
              </span>
            </Link>
          </div>
        </div>
      </section>
      <section className="home-library page-width">
        <div className="section-heading">
          <div>
            <span className="eyebrow">组件预览</span>
            <h2>从一个组件，开始你的下一个作品。</h2>
          </div>
          <Link className="text-link" href="/components">
            浏览全部 12 个组件 <ArrowUpRight />
          </Link>
        </div>
        <div className="component-grid">
          {catalog.slice(0, 3).map((item) => (
            <article className="component-card" key={item.slug}>
              <div className="component-preview">
                <ComponentDemo slug={item.slug} compact />
              </div>
              <Link
                className="component-card-label"
                href={`/components/${item.slug}`}
              >
                <span>
                  {item.title}
                  <small>{item.english}</small>
                </span>
                <ArrowUpRight />
              </Link>
            </article>
          ))}
        </div>
      </section>
      <section className="home-principles page-width">
        <div>
          <Code2 />
          <h3>源码开放</h3>
          <p>复制到项目中使用，自由修改每一处细节。</p>
        </div>
        <div>
          <Layers />
          <h3>设计一致</h3>
          <p>共享语义变量，保持组件与 Figma 同步。</p>
        </div>
        <div>
          <Box />
          <h3>按需组合</h3>
          <p>从基本元素开始，构建你需要的产品体验。</p>
        </div>
      </section>
      <section className="home-cta">
        <span className="eyebrow">从这里开始</span>
        <h2>
          基础已就绪。
          <br />
          接下来，交给你的想象力。
        </h2>
        <p>一个命令，把你的第一个组件带进项目。</p>
        <InstallCommand />
        <Link className="text-link" href="/docs/getting-started">
          查看完整安装指南 <ArrowRight />
        </Link>
      </section>
    </>
  );
}
