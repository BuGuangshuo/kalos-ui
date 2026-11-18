"use client";

import { KalosButton } from "@/registry/kalos/kalos-button";
import { toast } from "@/registry/kalos/kalos-toast";
import type { ToastExampleVariant } from "@/lib/toast-examples";

const types = [
  { label: "默认", type: undefined, title: "链接已复制" },
  { label: "成功", type: "success", title: "联系人已保存" },
  { label: "信息", type: "info", title: "有 3 份文档待查阅" },
  { label: "警告", type: "warning", title: "存储空间即将用完" },
  { label: "错误", type: "error", title: "上传失败，请重试" },
  { label: "加载", type: "loading", title: "文件上传中" },
];

export function ToastDemo({ variant = "default" }: { variant?: ToastExampleVariant }) {
  if (variant === "types") return <div className="toast-demo-actions">
    {types.map(item => <KalosButton key={item.label} variant="outline" onClick={() => toast.add({ title: item.title, type: item.type, timeout: 3000 })}>{item.label}</KalosButton>)}
  </div>;
  if (variant === "action") return <KalosButton variant="outline" onClick={() => {
    const noticeId = toast.add({ title: "文件已移至回收站", type: "success", actionProps: { children: "撤销", onClick() { toast.close(noticeId); toast.add({ title: "文件已恢复", type: "success" }); } } });
  }}>移至回收站</KalosButton>;
  if (variant === "stack") return <KalosButton variant="outline" onClick={() => {
    toast.add({ title: "链接已复制", type: "info" });
    toast.add({ title: "联系人已保存", type: "success" });
    toast.add({ title: "文档已上传", type: "success" });
  }}>显示三条提示</KalosButton>;
  return <KalosButton variant="outline" onClick={() => toast.add({ title: "联系人已保存", type: "success" })}>显示提示</KalosButton>;
}
