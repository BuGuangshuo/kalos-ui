export const colorPickerPresets = [
  { value: "#0190fe", label: "蓝色" },
  { value: "#10b6d8", label: "青色" },
  { value: "#13a89e", label: "蓝绿色" },
  { value: "#58ba7c", label: "绿色" },
  { value: "#e6aa13", label: "琥珀色" },
  { value: "#ef842c", label: "橙色" },
  { value: "#e74b93", label: "粉色" },
  { value: "#a651f0", label: "紫色" },
] as const;

export const colorPickerVariants = [
  { variant: "alpha", title: "透明度" },
  { variant: "panel", title: "内嵌面板" },
] as const;

export type ColorPickerVariant = typeof colorPickerVariants[number]["variant"];

export function colorPickerExample(variant?: ColorPickerVariant) {
  if (variant === "alpha") return `import { KalosColorPicker } from "@/components/ui/kalos-color-picker";

export default function Example() {
  return <KalosColorPicker label="批注颜色" name="annotationColor" defaultValue="#0190fe80" alpha />;
}`;
  if (variant === "panel") return `import { KalosColorPickerPanel } from "@/components/ui/kalos-color-picker";

export default function Example() {
  return <KalosColorPickerPanel
    role="group"
    aria-label="文档标签颜色"
    defaultValue="#13a89e"
    presets={["#0190fe", "#13a89e", "#e6aa13", "#a651f0"]}
  />;
}`;
  return `"use client";

import { useState } from "react";
import { KalosColorPicker } from "@/components/ui/kalos-color-picker";

const presets = [
  { value: "#0190fe", label: "蓝色" },
  { value: "#13a89e", label: "蓝绿色" },
  { value: "#e6aa13", label: "琥珀色" },
  { value: "#a651f0", label: "紫色" },
];

export default function Example() {
  const [color, setColor] = useState("#a651f0");

  return <div className="flex items-center gap-3">
    <span style={{ backgroundColor: color }} className="size-3 rounded-sm" aria-hidden="true" />
    <span>设计规范</span>
    <KalosColorPicker label="文档颜色" value={color} onValueChange={setColor} presets={presets} align="end" />
  </div>;
}`;
}
