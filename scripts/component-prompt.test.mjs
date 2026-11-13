import assert from "node:assert/strict";
import test from "node:test";
import { aiTools, aiToolUrl, componentPrompt } from "../lib/component-prompt.ts";

test("AI handoffs percent-encode Chinese, code and URL delimiters without changing the prompt", () => {
  const prompt = "安装「对话框」 😀\n```tsx\nconst value = '姓名 & email=a+b@example.com #?/';\n```";
  for (const tool of aiTools) {
    const href = aiToolUrl(tool.id, prompt);
    const url = new URL(href);
    assert.equal(url.origin, new URL(tool.url).origin);
    assert.equal(url.pathname, new URL(tool.url).pathname);
    assert.equal(url.searchParams.get(tool.parameter), prompt);
    assert.deepEqual([...url.searchParams.keys()], [tool.parameter]);
    assert.equal(url.hash, "");
    assert.match(href, /%E5%AE%89/);
    assert.match(href, /%20/);
    assert.doesNotMatch(href, /[\u4e00-\u9fff\s]/u);
  }
});

test("component handoffs include an executable installation, typed usage and matching source links", () => {
  const prompt = componentPrompt({
    name: "对话框 Dialog",
    description: "编辑联系人",
    installation: "npx https://kalos.example/cli/kalos-ui-0.3.0.tgz add dialog",
    example: 'export function Contact(): React.ReactNode { return <KalosDialog />; }',
    docsUrl: "https://kalos.example/components/kalos-dialog",
    registryUrl: "https://kalos.example/r/kalos-dialog.json",
  });
  assert.match(prompt, /对话框 Dialog/);
  assert.match(prompt, /```bash\nnpx https:\/\/kalos.example\/cli\/kalos-ui-0.3.0.tgz add dialog\n```/);
  assert.match(prompt, /```tsx\nexport function Contact\(\): React.ReactNode/);
  assert.match(prompt, /Base UI/);
  assert.match(prompt, /https:\/\/kalos.example\/r\/kalos-dialog.json/);
  assert.match(prompt, /https:\/\/kalos.example\/components\/kalos-dialog/);
});
