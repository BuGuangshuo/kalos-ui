export const toastExampleVariants = [
  { variant: "types", title: "提示类型" },
  { variant: "action", title: "操作按钮" },
  { variant: "stack", title: "堆叠" },
] as const;

export type ToastExampleVariant = "default" | typeof toastExampleVariants[number]["variant"];

export const toasterSetupExample = `import { KalosToaster } from "@/components/ui/kalos-toast";

export function App({ children }: { children: React.ReactNode }) {
  return <>
    {children}
    <KalosToaster />
  </>;
}`;

export function toastExample(variant: ToastExampleVariant = "default") {
  const imports = `"use client";

import { KalosButton } from "@/components/ui/kalos-button";
import { toast } from "@/components/ui/kalos-toast";`;
  if (variant === "types") return `${imports}

const types = [
  { label: "默认", title: "链接已复制" },
  { label: "成功", type: "success", title: "联系人已保存" },
  { label: "信息", type: "info", title: "有 3 份文档待查阅" },
  { label: "警告", type: "warning", title: "存储空间即将用完" },
  { label: "错误", type: "error", title: "上传失败，请重试" },
  { label: "加载", type: "loading", title: "文件上传中" },
] as const;

export function ToastTypes() {
  return <div className="flex flex-wrap gap-2">
    {types.map(({ label, ...options }) => <KalosButton key={label} variant="outline"
      onClick={() => toast.add({ ...options, timeout: 3000 })}>
      {label}
    </KalosButton>)}
  </div>;
}`;
  if (variant === "action") return `${imports}

export function ToastAction() {
  function deleteFile() {
    const id = toast.add({
      title: "文件已移至回收站",
      type: "success",
      actionProps: {
        children: "撤销",
        onClick() {
          // 在此恢复文件，再关闭对应提示。
          toast.close(id);
          toast.add({ title: "文件已恢复", type: "success" });
        },
      },
    });
  }
  return <KalosButton variant="outline" onClick={deleteFile}>移至回收站</KalosButton>;
}`;
  if (variant === "stack") return `${imports}

export function ToastStack() {
  return <KalosButton variant="outline" onClick={() => {
    toast.add({ title: "链接已复制", type: "info" });
    toast.add({ title: "联系人已保存", type: "success" });
    toast.add({ title: "文档已上传", type: "success" });
  }}>显示三条提示</KalosButton>;
}`;
  return `${imports}

export function ToastDemo() {
  return <KalosButton variant="outline" onClick={() => toast.add({
    title: "联系人已保存",
    type: "success",
  })}>显示提示</KalosButton>;
}`;
}
