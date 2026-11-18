"use client";

import { useEffect, useState, type ComponentType, type ReactNode } from "react";
import { Bell, FileText, Plus, Trash2, Users } from "lucide-react";
import { AvatarDemo } from "@/components/avatar-demo";
import { FieldGroup, FieldLegend, FieldSet } from "@/components/ui/field";
import { KalosAvatar, KalosAvatarStack } from "@/registry/kalos/kalos-avatar-stack";
import { KalosButton } from "@/registry/kalos/kalos-button";
import { KalosCheckbox } from "@/registry/kalos/kalos-checkbox";
import { KalosInput } from "@/registry/kalos/kalos-input";
import { KalosNotification, type KalosNotice } from "@/registry/kalos/kalos-notification";
import { KalosProgress } from "@/registry/kalos/kalos-progress";
import { KalosSegmentedControl } from "@/registry/kalos/kalos-segmented-control";
import { KalosSelect } from "@/registry/kalos/kalos-select";
import { KalosSwitch } from "@/registry/kalos/kalos-switch";
import { AutoplayContext, useAutoplay } from "./runtime";

export function AutoplayScope({
  paused,
  children,
}: {
  paused: boolean;
  children: ReactNode;
}) {
  return <AutoplayContext value={paused}>{children}</AutoplayContext>;
}

function SwitchVignette() {
  const [on, setOn] = useState([true, false]);
  useAutoplay(() => setOn(([a, b]) => [!a, !b]), 1600);
  return (
    <FieldGroup className="motion-vignette-fields">
      {["消息通知", "每周摘要"].map((label, index) => (
        <KalosSwitch
          key={label}
          label={label}
          checked={on[index]}
          onCheckedChange={(value) =>
            setOn((list) => list.map((v, i) => (i === index ? value : v)))
          }
        />
      ))}
    </FieldGroup>
  );
}

const segments = [
  { value: "all", label: "全部" },
  { value: "pending", label: "待处理" },
  { value: "done", label: "已完成" },
];

function SegmentedVignette() {
  const [value, setValue] = useState("all");
  useAutoplay(
    () => setValue((current) => segments[(segments.findIndex((item) => item.value === current) + 1) % segments.length].value),
    1600,
    300,
  );
  return (
    <div className="motion-vignette-segmented">
      <KalosSegmentedControl options={segments} value={value} onChange={setValue} fullWidth aria-label="文档状态" />
    </div>
  );
}

function AvatarVignette() {
  return <AvatarDemo KalosAvatar={KalosAvatar} KalosAvatarStack={KalosAvatarStack} compact />;
}

const tasks = ["整理联系人", "上传文档", "发送邀请"];

function ChecklistVignette() {
  const [checked, setChecked] = useState([true, false, false]);
  useAutoplay(() => setChecked((current) => {
    const next = current.findIndex((value) => !value);
    return next === -1 ? current.map(() => false) : current.map((value, index) => index === next || value);
  }), 1100, 200);
  return (
    <FieldSet className="motion-vignette-fields">
      <FieldLegend className="sr-only">文档待办清单</FieldLegend>
      <FieldGroup className="motion-vignette-fields">
        {tasks.map((task, index) => (
          <KalosCheckbox
            key={task}
            label={task}
            checked={checked[index]}
            onCheckedChange={(value) => setChecked((current) => current.map((item, i) => i === index ? value : item))}
          />
        ))}
      </FieldGroup>
    </FieldSet>
  );
}

function InputVignette() {
  const [value, setValue] = useState("hello@kalos-ui.com");
  return (
    <div className="motion-vignette-stack">
      <KalosInput label="邮箱地址" type="email" placeholder="请输入邮箱地址" value={value} onChange={(event) => setValue(event.target.value)} onClear={() => setValue("")} />
    </div>
  );
}

const contactGroups = [
  { value: "colleagues", label: "同事" },
  { value: "clients", label: "客户" },
  { value: "friends", label: "朋友" },
];

function SelectVignette() {
  const [value, setValue] = useState("colleagues");
  return (
    <div className="motion-vignette-stack">
      <KalosSelect label="联系人分组" items={contactGroups} value={value} onValueChange={setValue} />
    </div>
  );
}

function ButtonVignette() {
  const [loading, setLoading] = useState(false);
  useAutoplay(() => setLoading(true), 2600, 600);
  useEffect(() => {
    if (!loading) return;
    const timeout = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timeout);
  }, [loading]);
  return (
    <div className="motion-vignette-buttons">
      <KalosButton loading={loading} onClick={() => setLoading(true)}>{!loading ? <Plus data-icon="inline-start" /> : null}添加联系人</KalosButton>
      <KalosButton variant="outline" onClick={() => setLoading(false)}>取消</KalosButton>
      <KalosButton variant="destructive" aria-label="删除文档" size="icon"><Trash2 /></KalosButton>
    </div>
  );
}

const notifications: KalosNotice[] = [
  { id: "documents", title: "文档已更新", text: "使用指南新增了快捷键说明。", icon: <FileText />, pattern: "orbit", action: { label: "标为已读" } },
  { id: "contacts", title: "联系人共享邀请", text: "陈晓邀请你查看共享通讯录。", icon: <Users />, pattern: "rays", action: { label: "接受邀请" } },
  { id: "files", title: "文件上传完成", text: "两份文档已保存到文件夹。", icon: <Bell />, pattern: "grid", action: { label: "标为已读" } },
];

function NotificationVignette() {
  const [cycle, setCycle] = useState(0);
  useAutoplay(() => setCycle((current) => current + 1), 4800, 4800);
  return (
    <div className="motion-vignette-notification">
      <KalosNotification key={cycle} notices={notifications} aria-label="文档通知" />
    </div>
  );
}

const progressSteps = [18, 46, 74, 100];

function ProgressVignette() {
  const [step, setStep] = useState(0);
  useAutoplay(() => setStep((current) => (current + 1) % progressSteps.length), 1000, 100);
  return (
    <div className="motion-vignette-stack">
      <KalosProgress label={progressSteps[step] === 100 ? "上传完成" : "文件上传中"} value={progressSteps[step]} />
    </div>
  );
}

export const VIGNETTES: { title: string; Vignette: ComponentType }[] = [
  { title: "Avatar 头像", Vignette: AvatarVignette },
  { title: "Switch 开关", Vignette: SwitchVignette },
  { title: "Segmented Control 分段控制器", Vignette: SegmentedVignette },
  { title: "Checkbox 复选框", Vignette: ChecklistVignette },
  { title: "Input 输入框", Vignette: InputVignette },
  { title: "Select 选择器", Vignette: SelectVignette },
  { title: "Button 按钮", Vignette: ButtonVignette },
  { title: "Notification 通知", Vignette: NotificationVignette },
  { title: "Progress 进度条", Vignette: ProgressVignette },
];
