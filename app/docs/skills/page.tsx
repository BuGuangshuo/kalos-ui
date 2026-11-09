import type { Metadata } from "next";
import Link from "next/link";
import { Sidebar, CodeBlock, OnThisPage } from "@/components/docs-parts";
import { FrameworkSwitcher } from "@/components/framework";
export const metadata: Metadata = { title: "Skills" };
const links = [
  { id: "install", title: "安装 Skill" },
  { id: "included", title: "包含哪些能力" },
  { id: "prompts", title: "这样开始使用" },
  { id: "frameworks", title: "React 与 Vue" },
  { id: "source", title: "查看与更新" },
];
export default function SkillsPage() {
  return (
    <div className="workbench">
      <Sidebar active="skills" />
      <div className="docs-grid">
        <article className="docs-content">
          <header className="docs-title">
            <h1>Skills</h1>
            <p>让你的 AI 助手理解 Pop UI，从组件安装到细节打磨。</p>
          </header>
          <p>
            Pop UI Skill 为 Codex、Claude Code、Cursor 等支持 Agent Skills
            的编程工具提供项目上下文：识别框架、选对注册表、阅读组件
            API，并使用已有的设计变量构建界面。
          </p>
          <section id="install">
            <h2>安装 Skill</h2>
            <p>在你的项目目录运行，按提示选择使用的 AI 工具：</p>
            <CodeBlock code="npx skills add BuGuangshuo/pop-ui --skill pop-ui" />
            <p>也可以使用你的包管理器：</p>
            <CodeBlock
              code={
                "pnpm dlx skills add BuGuangshuo/pop-ui --skill pop-ui\nyarn dlx skills add BuGuangshuo/pop-ui --skill pop-ui\nbun x skills add BuGuangshuo/pop-ui --skill pop-ui"
              }
            />
            <p>
              添加 <code>-g</code>{" "}
              可以安装到全局。安装后，在支持的工具中描述你的需求，或显式调用{" "}
              <code>$pop-ui</code>。
            </p>
          </section>
          <section id="included">
            <h2>包含哪些能力</h2>
            <h3>识别项目，选择正确的组件</h3>
            <p>
              读取 package.json、components.json 与现有导入，识别 React /
              Next.js 或 Vue / Nuxt，选择对应 CLI、注册表地址与组件 API。
            </p>
            <h3>从基础组件组合界面</h3>
            <p>
              提供按钮、输入框、卡片、徽标、开关、复选框、选项卡、折叠面板、对话框、选择器、进度条和头像组的使用指导。按需安装源码，保留你的目录、别名与现有组件。
            </p>
            <h3>统一风格与自然动效</h3>
            <p>
              使用中性黑白主题、语义颜色与一致的圆角和尺寸。Skill
              包含保存反馈、列表过渡、图标反馈和表单交互配方，优先复用项目中的动画方案。
            </p>
            <h3>保留可访问性与实际行为</h3>
            <p>
              保持标签关联、焦点管理、键盘操作、禁用与加载状态，遵循减少动态效果偏好，并检查窄屏布局与受影响的交互。
            </p>
          </section>
          <section id="prompts">
            <h2>这样开始使用</h2>
            <CodeBlock
              filename="给 AI 助手的提示"
              language="text"
              code={
                "使用 Pop UI，帮我做一个包含姓名、邮箱和消息开关的偏好设置表单。\n\n用 Pop UI 的对话框完成新增项目流程，保留现有主题和键盘操作。\n\n给保存按钮增加加载、成功和失败反馈，连接已有的保存接口。\n\n我是 Vue 项目，请使用 v-model 绑定 PopInput 和 PopSwitch。"
              }
            />
            <p>
              首页的交互场景展示这类需求的实现效果。Skill
              在你的编程工具中读取和修改项目源码，网站提供组件预览与文档。
            </p>
          </section>
          <section id="frameworks">
            <h2>React 与 Vue</h2>
            <FrameworkSwitcher />
            <p>
              两个版本提供相同的 12
              类组件与中性视觉规范。切换框架后，组件文档中的安装命令、源码、示例与
              API 会一起切换。
            </p>
            <div className="code-block">
              <table className="props-table">
                <thead>
                  <tr>
                    <th>版本</th>
                    <th>基础</th>
                    <th>用法</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>React</td>
                    <td>shadcn/ui · Radix UI</td>
                    <td>TSX、属性与回调</td>
                  </tr>
                  <tr>
                    <td>Vue 3.5+</td>
                    <td>shadcn-vue · Reka UI</td>
                    <td>Vue SFC、v-model 与插槽</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p>
              <Link href="/docs/getting-started">查看安装指南 →</Link>
            </p>
          </section>
          <section id="source">
            <h2>查看与更新</h2>
            <p>
              Skill 的指令与参考资料随组件源码一起开源，可在{" "}
              <a
                href="https://github.com/BuGuangshuo/pop-ui/tree/main/skills/pop-ui"
                target="_blank"
                rel="noreferrer"
              >
                GitHub 查看
              </a>
              。更新已经安装的 Skill：
            </p>
            <CodeBlock code="npx skills update" />
            <p>
              命令格式遵循{" "}
              <a
                href="https://skills.sh/docs/cli"
                target="_blank"
                rel="noreferrer"
              >
                Skills CLI
              </a>
              ；内容面向 Pop UI 的真实组件与 API。
            </p>
          </section>
        </article>
        <OnThisPage links={links} />
      </div>
    </div>
  );
}
