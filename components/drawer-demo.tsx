"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { FieldGroup } from "@/components/ui/field";
import { KalosDrawer, type KalosDrawerProps } from "@/registry/kalos/kalos-drawer";
import { KalosInput } from "@/registry/kalos/kalos-input";
import { KalosSelect } from "@/registry/kalos/kalos-select";
import { KalosTimePicker } from "@/registry/kalos/kalos-time-picker";
import { KalosCheckbox } from "@/registry/kalos/kalos-checkbox";
import { KalosDateRangePicker } from "@/registry/kalos/kalos-date-range-picker";
import { KalosLoading, KalosSkeleton } from "@/registry/kalos/kalos-skeleton";

type ContactValues = { name: string; email: string; time: string };
type ContactErrors = Partial<Record<keyof ContactValues, string>>;

function validateContact(values: ContactValues): ContactErrors {
  const errors: ContactErrors = {};
  if (!values.name.trim()) errors.name = "请输入姓名";
  if (!values.email.trim()) errors.email = "请输入邮箱地址";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) errors.email = "请输入有效的邮箱地址";
  if (!values.time) errors.time = "请选择提醒时间";
  return errors;
}

function ContactSkeleton() {
  return <KalosLoading label="正在加载表单" className="flex flex-col gap-3.5">
    {Array.from({ length: 5 }, (_, index) => <div key={index} className="flex flex-col gap-1.5">
      <KalosSkeleton width={index % 2 ? 64 : 40} height={20} />
      <KalosSkeleton height={32} radius={7} />
    </div>)}
    <div className="grid grid-cols-2 gap-3">
      {[0, 1].map(index => <div key={index} className="flex min-w-0 flex-col gap-1.5">
        <KalosSkeleton width={64} height={20} />
        <KalosSkeleton height={32} radius={7} />
      </div>)}
    </div>
    <div className="flex items-center gap-3">
      <KalosSkeleton width={16} height={16} radius={4.5} />
      <KalosSkeleton width={80} height={20} />
    </div>
  </KalosLoading>;
}

export function DrawerDemo({ direction = "right", trigger = "打开抽屉" }: { direction?: KalosDrawerProps["swipeDirection"]; trigger?: string }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [values, setValues] = useState<ContactValues>({ name: "", email: "", time: "" });
  const [submitted, setSubmitted] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const timeRef = useRef<HTMLInputElement>(null);
  const errors = submitted ? validateContact(values) : {};

  function confirm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loading || confirming) return;
    setSubmitted(true);
    const nextErrors = validateContact(values);
    if (nextErrors.name) nameRef.current?.focus();
    else if (nextErrors.email) emailRef.current?.focus();
    else if (nextErrors.time) timeRef.current?.focus();
    else setConfirming(true);
  }

  useEffect(() => {
    if (!open) return;
    // 演示初始化加载；实际接入时由数据请求控制 loading。
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, [open]);

  useEffect(() => {
    if (!confirming || !open) return;
    // 演示异步确认；实际接入时等待保存操作完成。
    const timer = setTimeout(() => { setOpen(false); setConfirming(false); }, 800);
    return () => clearTimeout(timer);
  }, [confirming, open]);

  return <div className="flex flex-col items-center gap-4">
    <KalosDrawer
      trigger={trigger}
      title="联系人设置"
      swipeDirection={direction}
      open={open}
      onOpenChange={next => {
        setOpen(next);
        setLoading(next);
        setConfirming(false);
        if (next) { setValues({ name: "", email: "", time: "" }); setSubmitted(false); }
      }}
      loading={loading}
      loadingContent={<ContactSkeleton />}
      confirming={confirming}
      onConfirm={() => formRef.current?.requestSubmit()}
    >
      <form ref={formRef} noValidate onSubmit={confirm} aria-label="联系人设置">
      <FieldGroup className="gap-3.5">
        <KalosInput ref={nameRef} name="name" label="姓名" placeholder="请输入姓名" autoComplete="off" required value={values.name} error={errors.name} onChange={event => setValues(current => ({ ...current, name: event.target.value }))} onClear={() => setValues(current => ({ ...current, name: "" }))} />
        <KalosInput ref={emailRef} name="email" label="邮箱地址" type="email" placeholder="you@example.com" autoComplete="off" required value={values.email} error={errors.email} onChange={event => setValues(current => ({ ...current, email: event.target.value }))} onClear={() => setValues(current => ({ ...current, email: "" }))} />
        <KalosSelect label="联系人分组" clearable placeholder="请选择分组" items={[
          { value: "colleagues", label: "同事" },
          { value: "friends", label: "朋友" },
          { value: "family", label: "家人" },
        ]} />
        <KalosTimePicker ref={timeRef} name="time" label="提醒时间" placeholder="请选择时间" step={30} required value={values.time || null} error={errors.time} onChange={time => setValues(current => ({ ...current, time: time ?? "" }))} />
        <KalosDateRangePicker label="日期范围" name="dateRange" defaultValue={null} className="w-full!" />
        <FieldGroup className="grid! grid-cols-2 items-start gap-3!">
          <div className="min-w-0"><KalosSelect label="联系渠道" clearable placeholder="请选择渠道" name="channel" items={[
            { value: "phone", label: "电话" },
            { value: "wechat", label: "微信" },
            { value: "other", label: "其他" },
          ]} /></div>
          <div className="min-w-0"><KalosInput label="联系方式" name="contact" placeholder="请输入联系方式" autoComplete="off" /></div>
        </FieldGroup>
        <KalosCheckbox label="接收消息通知" />
      </FieldGroup>
      </form>
    </KalosDrawer>
  </div>;
}
