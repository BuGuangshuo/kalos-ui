"use client";

import { useEffect, useRef, useState } from "react";
import { Bell, FileText, Users } from "lucide-react";
import { KalosNotification, type KalosNotice, type KalosNotificationPosition } from "@/registry/kalos/kalos-notification";
import { KalosButton } from "@/registry/kalos/kalos-button";
import { KalosSegmentedControl } from "@/registry/kalos/kalos-segmented-control";

export function NotificationDemo({ compact = false, floating = false }: { compact?: boolean; floating?: boolean }) {
  const [position, setPosition] = useState<KalosNotificationPosition>("top-right");
  const [notices, setNotices] = useState<KalosNotice[]>([]);
  const serial = useRef(0);
  const pendingTimers = useRef(new Set<ReturnType<typeof setTimeout>>());
  useEffect(() => {
    const timers = pendingTimers.current;
    return () => { timers.forEach(clearTimeout); timers.clear(); };
  }, []);
  const performAction = () => new Promise<void>(resolve => {
    const timer = setTimeout(() => { pendingTimers.current.delete(timer); resolve(); }, 800);
    pendingTimers.current.add(timer);
  });
  const samples: KalosNotice[] = [
    { id: "documents", title: "文档已更新", text: "使用指南新增了快捷键说明，支持在线查看与下载。", pattern: "orbit", icon: <FileText />, action: { label: "查看文档", onClick: performAction } },
    { id: "maintenance", title: "文件存储维护", text: "周日 02:00–03:00 暂停文件上传，已保存的文件不受影响。", pattern: "grid", icon: <Bell />, action: { label: "查看安排", onClick: performAction } },
    { id: "contacts", title: "联系人共享邀请", text: "陈晓邀请你查看共享通讯录中的 12 位联系人。", pattern: "rays", icon: <Users />, action: { label: "接受邀请", onClick: performAction } },
  ];

  if (floating) return <div className="notification-floating-demo">
    <KalosSegmentedControl aria-label="通知弹出位置" variant="tray" value={position} onChange={value => setPosition(value as KalosNotificationPosition)} options={[
      { value: "top-right", label: "右上" }, { value: "bottom-right", label: "右下" },
      { value: "top-left", label: "左上" }, { value: "bottom-left", label: "左下" },
    ]} />
    <div className="flex flex-wrap justify-center gap-2">
      <KalosButton onClick={() => {
        const id = `floating-${++serial.current}`;
        const sample = samples[(serial.current - 1) % samples.length];
        setNotices(current => [{ ...sample, id }, ...current]);
      }}><Bell data-icon="inline-start" />显示通知</KalosButton>
      <KalosButton variant="outline" disabled={!notices.length} onClick={() => setNotices([])}>清空</KalosButton>
    </div>
    <KalosNotification aria-label="浮层通知" notices={notices} variant="floating" position={position} onDismiss={notice => setNotices(current => current.filter(item => item.id !== notice.id))} />
  </div>;

  return <div className={compact ? "notification-demo notification-demo--compact" : "notification-demo"}>
    <KalosNotification notices={samples} />
  </div>;
}
