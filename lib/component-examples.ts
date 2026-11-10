import type { Item } from "@/lib/catalog";

export function reactExample(item: Item) {
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
