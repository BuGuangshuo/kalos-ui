import type { Metadata } from "next";
import { Sidebar, CodeBlock, OnThisPage } from "@/components/docs-parts";
import tokens from "@/design/tokens.json";
export const metadata: Metadata = { title: "设计变量" };
const links = [
  { id: "colors", title: "颜色与主题" },
  { id: "spacing", title: "间距" },
  { id: "size", title: "组件尺寸" },
  { id: "radius", title: "圆角" },
  { id: "typography", title: "排版" },
  { id: "motion", title: "动效与焦点" },
  { id: "usage", title: "使用变量" },
];
function TokenTable({ rows }: { rows: [string, string, string?][] }) {
  return (
    <div className="token-table-wrap">
      <table className="token-table">
        <thead>
          <tr>
            <th>变量</th>
            <th>值</th>
            <th>说明</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(([name, value, note]) => (
            <tr key={name}>
              <td>
                <code>{name}</code>
              </td>
              <td>{value}</td>
              <td>{note || "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
export default function TokensPage() {
  return (
    <div className="workbench">
      <Sidebar active="tokens" />
      <div className="docs-grid">
        <article className="docs-content">
          <header className="docs-title">
            <h1>设计变量</h1>
            <p>用一套共享的语义规则，保持组件、页面与设计稿的一致。</p>
          </header>
          <p className="tokens-intro">
            以下变量映射参考{" "}
            <a
              href="https://astryx.atmeta.com/docs/tokens"
              target="_blank"
              rel="noreferrer"
            >
              Astryx Tokens
            </a>
            ，并适配 shadcn/ui。代码源文件位于 <code>design/tokens.json</code>
            ，React 与 Vue 组件共用对应的颜色与尺寸变量。
          </p>
          <section id="colors">
            <h2>颜色与主题</h2>
            <p>
              使用语义颜色表达界面角色。默认操作色为中性黑色，浅色与深色主题分别定义，避免直接把颜色写死到组件中。
            </p>
            <div className="palette-grid">
              {Object.entries(tokens.light).map(([name, value]) => (
                <div key={name}>
                  <div style={{ background: value }} />
                  <code>--{name}</code>
                  <span>{value}</span>
                </div>
              ))}
            </div>
            <TokenTable
              rows={Object.entries(tokens.light).map(([name, value]) => [
                `--${name}`,
                value,
                `深色：${tokens.dark[name as keyof typeof tokens.dark]}`,
              ])}
            />
          </section>
          <section id="spacing">
            <h2>间距</h2>
            <p>
              以 4px
              为基础单元。根据内容关系选择间距，在组件内部使用紧凑间隔，在区块间保留充分留白。
            </p>
            <TokenTable
              rows={Object.entries(tokens.space).map(([key, value]) => [
                `--spacing-${key}`,
                `${value}px`,
              ])}
            />
            <div className="spacing-preview">
              {Object.entries(tokens.space)
                .slice(0, 7)
                .map(([key, value]) => (
                  <div key={key}>
                    <i style={{ width: value, height: value }} />
                    <span>{value}</span>
                  </div>
                ))}
            </div>
          </section>
          <section id="size">
            <h2>组件尺寸</h2>
            <p>默认使用标准尺寸。根据界面密度，可显式选择紧凑或宽松规格。</p>
            <TokenTable
              rows={[
                ["--size-element-sm", "28px", "紧凑"],
                ["--size-element-md", "32px", "标准 / 默认"],
                ["--size-element-lg", "36px", "宽松"],
              ]}
            />
          </section>
          <section id="radius">
            <h2>圆角</h2>
            <TokenTable
              rows={[
                ["--radius-inner", "8px", "嵌套元素"],
                ["--radius-element", "12px", "输入与选择控件"],
                ["--radius-container", "16px", "卡片与弹出层"],
                ["--radius-page", "32px", "页面区块"],
                ["--radius-full", "9999px", "胶囊按钮与头像"],
              ]}
            />
            <div className="radius-preview">
              {[8, 12, 16, 32].map((radius) => (
                <div key={radius} style={{ borderRadius: radius }}>
                  {radius}px
                </div>
              ))}
            </div>
          </section>
          <section id="typography">
            <h2>排版</h2>
            <p>
              中文界面优先使用系统字体，代码采用等宽字体。通过字号、字重与行高建立层次，而不是增加额外装饰。
            </p>
            <TokenTable
              rows={[
                ["--font-size-sm", "12px", "辅助说明"],
                ["--font-size-base", "14px", "正文与控件"],
                ["--font-size-lg", "17px", "强调内容"],
                ["--font-size-xl", "20px", "区块标题"],
                ["--font-size-2xl", "24px", "内容标题"],
                ["--font-size-5xl", "42px", "页面展示标题"],
              ]}
            />
          </section>
          <section id="motion">
            <h2>动效与焦点</h2>
            <TokenTable
              rows={[
                ["--duration-fast", "175ms", "悬停、状态切换"],
                ["--duration-medium", "410ms", "入场与展开"],
                ["--ease-standard", "cubic-bezier(.24, 1, .4, 1)", "标准缓动"],
                ["--focus-outline-width", "2px", "键盘焦点"],
                ["--focus-outline-offset", "3px", "焦点偏移"],
              ]}
            />
            <p>启用系统“减少动态效果”时，界面会缩短动效并关闭平滑滚动。</p>
          </section>
          <section id="usage">
            <h2>在项目中使用</h2>
            <CodeBlock
              filename="globals.css"
              language="css"
              code={
                ":root {\n  --primary: #1b1b1b;\n  --primary-foreground: #ffffff;\n  --muted: #f1f1f1;\n  --radius: 1rem;\n}\n\n.your-component {\n  color: var(--foreground);\n  background: var(--background);\n  border-radius: var(--radius-element);\n}"
              }
            />
          </section>
        </article>
        <OnThisPage links={links} />
      </div>
    </div>
  );
}
