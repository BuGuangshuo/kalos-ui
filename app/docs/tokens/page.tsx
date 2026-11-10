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
            语义变量维护在 <code>design/tokens.json</code>，控件状态维护在 <code>design/component-tokens.json</code>。
            React、Vue 与 Figma 共用这些颜色、尺寸和字体规则。
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
                ["--radius-inner", "6px", "按钮与嵌套元素"],
                ["--radius-element", "7px", "输入与选择控件"],
                ["--radius-container", "12px", "卡片与弹出层"],
                ["--radius-page", "20px", "页面区块"],
                ["--radius-full", "9999px", "开关与头像"],
              ]}
            />
            <div className="radius-preview">
              {[6, 7, 12, 20].map((radius) => (
                <div key={radius} style={{ borderRadius: radius }}>
                  {radius}px
                </div>
              ))}
            </div>
          </section>
          <section id="typography">
            <h2>排版</h2>
            <p>
              界面与标题使用 Roboto，中文按系统字体回退。正文与按钮为 400 字重，标题为 500–600；代码使用系统等宽字体。
            </p>
            <TokenTable
              rows={[
                ["--font-size-sm", "12px", "辅助说明"],
                ["--font-size-base", "14px / 20px", "正文、表单标签、导航与按钮"],
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
                ["--duration-fast", "140ms", "输入与按钮状态切换"],
                ["select/highlight", "180ms", "选项背景滑动"],
                ["switch/thumb", "260ms", "开关滑块"],
                ["--duration-medium", "200ms", "分段指示器"],
                ["--ease-standard", "cubic-bezier(.22, 1, .36, 1)", "标准缓动"],
                ["field/focus-edge", "1px", "聚焦阴影边缘"],
              ]}
            />
            <p>选项背景连续滑动，开关与复选框通过短过渡表达状态变化。</p>
          </section>
          <section id="usage">
            <h2>在项目中使用</h2>
            <CodeBlock
              filename="globals.css"
              language="css"
              code={
                ":root {\n  --primary: rgba(0, 0, 0, .88);\n  --primary-foreground: #fcfcfc;\n  --muted: rgba(0, 0, 0, .04);\n  --radius: .75rem;\n}\n\n.your-component {\n  color: var(--foreground);\n  background: var(--background);\n  border-radius: var(--radius-element);\n}"
              }
            />
          </section>
        </article>
        <OnThisPage links={links} />
      </div>
    </div>
  );
}
