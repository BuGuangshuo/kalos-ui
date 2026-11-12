import type { Item } from "@/lib/catalog";

export function reactExample(item: Item) {
  if (item.slug === "kalos-form") return `"use client";

import { KalosForm, type KalosFormField, type KalosFormValues } from "@/components/ui/kalos-form";

const fields: KalosFormField[] = [
  { name: "email", label: "邮箱地址", type: "email", required: true, autoComplete: "email" },
  { name: "password", label: "密码", type: "password", required: true, placeholder: "请输入密码", minLength: 8, hint: "至少 8 位", autoComplete: "new-password" },
  { name: "role", label: "成员角色", type: "select", required: true, items: [{ value: "editor", label: "编辑者" }, { value: "viewer", label: "查看者" }] },
  { name: "notifications", label: "消息通知", type: "switch" },
  { name: "terms", label: "同意服务条款", type: "checkbox", required: true },
];

export default function Example() {
  async function save(values: KalosFormValues) {
    // 替换为你的保存接口；失败时抛出异常，表单会保留输入并显示重试提示。
    const response = await fetch("/api/members", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    if (!response.ok) throw new Error("保存失败");
  }

  return <KalosForm title="成员设置" fields={fields} defaultValues={{ notifications: true }} onSubmit={save} aria-label="成员设置" />;
}`;
  if (item.slug === "kalos-dialog") return `"use client";

import { useState } from "react";
import { KalosDialog } from "@/components/ui/kalos-dialog";
import { KalosInput } from "@/components/ui/kalos-input";
import { KalosButton } from "@/components/ui/kalos-button";
import { FieldGroup } from "@/components/ui/field";

export default function Example() {
  const [open, setOpen] = useState(false);

  return (
    <KalosDialog
      trigger="创建项目"
      title="创建项目"
      open={open}
      onOpenChange={setOpen}
      footer={<>
        <KalosButton variant="outline" onClick={() => setOpen(false)}>取消</KalosButton>
        <KalosButton onClick={() => setOpen(false)}>创建项目</KalosButton>
      </>}
    >
      <FieldGroup className="gap-3.5">
        <KalosInput label="项目名称" defaultValue="Kalos UI" />
        <KalosInput label="项目标识" defaultValue="kalos-ui" />
      </FieldGroup>
    </KalosDialog>
  );
}`;
  const name = item.slug.split("-").map(part => part[0].toUpperCase() + part.slice(1)).join("");
  const samples: Record<string, { state: string; jsx: string }> = {
    "kalos-input": { state: 'const [email, setEmail] = useState("");', jsx: '<KalosInput\n      label="邮箱地址"\n      type="email"\n      value={email}\n      onChange={event => setEmail(event.target.value)}\n      placeholder="you@example.com"\n    />' },
    "kalos-switch": { state: 'const [enabled, setEnabled] = useState(true);', jsx: '<KalosSwitch\n      label="消息通知"\n      checked={enabled}\n      onCheckedChange={setEnabled}\n    />' },
    "kalos-checkbox": { state: 'const [accepted, setAccepted] = useState(false);', jsx: '<KalosCheckbox\n      label="同意接收产品更新"\n      checked={accepted}\n      onCheckedChange={value => setAccepted(value === true)}\n    />' },
    "kalos-select": { state: 'const [framework, setFramework] = useState("next");', jsx: '<KalosSelect\n      label="开发框架"\n      value={framework}\n      onValueChange={setFramework}\n      items={[\n        { value: "next", label: "Next.js" },\n        { value: "vite", label: "React + Vite" },\n        { value: "router", label: "React Router" },\n      ]}\n    />' },
  };
  const sample = samples[item.slug];
  const jsx = sample?.jsx || (item.slug === "kalos-button" ? '<KalosButton onClick={() => console.log("saved")}>保存更改</KalosButton>' : item.usage);
  return `"use client";\n\n${sample ? 'import { useState } from "react";\n' : ""}import { ${name} } from "@/components/ui/${item.slug}";\n\nexport default function Example() {\n${sample ? `  ${sample.state}\n\n` : ""}  return (\n    ${jsx}\n  );\n}`;
}
