const demoActionHook = `// 演示异步处理；实际使用时让 action.onClick 返回业务请求的 Promise。
function useDemoAction() {
  const timers = useRef(new Set<ReturnType<typeof setTimeout>>());
  useEffect(() => {
    const pending = timers.current;
    return () => { pending.forEach(clearTimeout); pending.clear(); };
  }, []);

  return () => new Promise<void>(resolve => {
    const timer = setTimeout(() => { timers.current.delete(timer); resolve(); }, 800);
    timers.current.add(timer);
  });
}`;

export const notificationExample = `"use client";

import { useEffect, useRef } from "react";
import { Bell, FileText, Users } from "lucide-react";
import { KalosNotification, type KalosNotice } from "@/components/ui/kalos-notification";

${demoActionHook}

export default function Example() {
  const performAction = useDemoAction();
  const notices: KalosNotice[] = [
    {
      id: "documents", title: "文档已更新",
      text: "使用指南新增了快捷键说明，支持在线查看与下载。",
      icon: <FileText />, pattern: "orbit",
      action: { label: "查看文档", onClick: performAction },
    },
    {
      id: "maintenance", title: "文件存储维护",
      text: "周日 02:00–03:00 暂停文件上传，已保存的文件不受影响。",
      icon: <Bell />, pattern: "grid",
      action: { label: "查看安排", onClick: performAction },
    },
    {
      id: "contacts", title: "联系人共享邀请",
      text: "陈晓邀请你查看共享通讯录中的 12 位联系人。",
      icon: <Users />, pattern: "rays",
      action: { label: "接受邀请", onClick: performAction },
    },
  ];

  return <KalosNotification notices={notices} />;
}`;

export const notificationFloatingExample = `"use client";

import { useEffect, useRef, useState } from "react";
import { Bell, FileText } from "lucide-react";
import { KalosButton } from "@/components/ui/kalos-button";
import { KalosSegmentedControl } from "@/components/ui/kalos-segmented-control";
import { KalosNotification, type KalosNotice, type KalosNotificationPosition } from "@/components/ui/kalos-notification";

${demoActionHook}

export default function Example() {
  const [position, setPosition] = useState<KalosNotificationPosition>("top-right");
  const [notices, setNotices] = useState<KalosNotice[]>([]);
  const serial = useRef(0);
  const performAction = useDemoAction();

  return <div className="flex flex-col items-center gap-4">
    <KalosSegmentedControl aria-label="通知弹出位置" variant="tray"
      value={position} onChange={value => setPosition(value as KalosNotificationPosition)}
      options={[
        { value: "top-right", label: "右上" }, { value: "bottom-right", label: "右下" },
        { value: "top-left", label: "左上" }, { value: "bottom-left", label: "左下" },
      ]}
    />
    <div className="flex gap-2">
      <KalosButton onClick={() => {
        const id = String(++serial.current);
        setNotices(current => [{
          id, title: "文档已更新",
          text: "使用指南新增了快捷键说明。", icon: <FileText />, pattern: "orbit",
          action: { label: "查看文档", onClick: performAction },
        }, ...current]);
      }}><Bell data-icon="inline-start" />显示通知</KalosButton>
      <KalosButton variant="outline" disabled={!notices.length} onClick={() => setNotices([])}>清空</KalosButton>
    </div>
    <KalosNotification notices={notices} variant="floating" position={position}
      onDismiss={notice => setNotices(current => current.filter(item => item.id !== notice.id))}
    />
  </div>;
}`;
