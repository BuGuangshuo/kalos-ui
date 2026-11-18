"use client";

import { useEffect, useEffectEvent, useRef, type RefObject } from "react";
import { Eye, Pencil, ShieldCheck } from "lucide-react";
import {
  KalosStepperChoices, KalosStepperField, KalosStepperForm, KalosStepperInput,
  KalosStepperReview, KalosStepperSuccess, KalosStepperTags,
  type KalosStepperChoice, type KalosStepperContext, type KalosStepperStep,
} from "@/registry/kalos/kalos-stepper-form";

type Values = { name: string; slug: string; members: string[]; access: string };
const initialValues: Values = { name: "", slug: "", members: [], access: "view" };
const sampleName = "Lotus Contacts";
const typingDelay = 75;
const choices: KalosStepperChoice[] = [
  { value: "view", title: "查看", icon: <Eye />, description: "浏览和导出联系人" },
  { value: "edit", title: "编辑", icon: <Pencil />, description: "添加和更新联系人" },
  { value: "manage", title: "管理", icon: <ShieldCheck />, description: "管理联系人和成员权限" },
];

function StepperDetails({ values, setValues, playedRef, stopRef }: Pick<KalosStepperContext<Values>, "values" | "setValues"> & {
  playedRef: RefObject<boolean>;
  stopRef: RefObject<(() => void) | undefined>;
}) {
  const fieldsRef = useRef<HTMLDivElement>(null);
  const fill = useEffectEvent((name: string) => setValues({
    name,
    slug: name.trimEnd().toLowerCase().replaceAll(" ", "-"),
  }));

  useEffect(() => {
    const fields = fieldsRef.current;
    if (!fields || playedRef.current) return;
    let timer: ReturnType<typeof setTimeout>;
    let active = true;

    function typeNext(length: number) {
      if (!active) return;
      fill(sampleName.slice(0, length));
      if (length < sampleName.length) timer = setTimeout(() => typeNext(length + 1), typingDelay);
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry?.isIntersecting || !active) return;
      observer.disconnect();
      playedRef.current = true;
      timer = setTimeout(() => typeNext(1), 150);
    });
    const stop = () => {
      active = false;
      observer.disconnect();
      clearTimeout(timer);
    };
    stopRef.current = stop;
    observer.observe(fields);
    return () => {
      stop();
      if (stopRef.current === stop) stopRef.current = undefined;
    };
  }, [playedRef, stopRef]);

  function takeOver() {
    playedRef.current = true;
    stopRef.current?.();
  }

  return <div ref={fieldsRef} className="flex flex-col gap-3.5" onFocusCapture={takeOver} onPointerDownCapture={takeOver}
    onChangeCapture={takeOver}>
    <KalosStepperField name="name" label="分组名称">
      <KalosStepperInput name="name" required placeholder="例如，通讯录" value={values.name}
        onChange={event => setValues({ name: event.target.value })} />
    </KalosStepperField>
    <KalosStepperField name="slug" label="分组地址" hint="小写字母、数字和连字符">
      <KalosStepperInput name="slug" required prefix="contacts/" placeholder="address-book" value={values.slug}
        onChange={event => setValues({ slug: event.target.value })} />
    </KalosStepperField>
  </div>;
}

const remainingSteps: KalosStepperStep<Values>[] = [
  {
    id: "members", title: "成员", heading: "邀请成员",
    render: ({ values, setValues }) =>
      <KalosStepperField name="members" label="邮箱地址" optional hint="按 Enter 或逗号添加，支持粘贴多个地址">
        <KalosStepperTags value={values.members} onChange={members => setValues({ members })} placeholder="name@example.com" />
      </KalosStepperField>,
  },
  {
    id: "access", title: "权限", heading: "设置成员权限",
    render: ({ values, setValues }) =>
      <KalosStepperChoices label="成员权限" options={choices} value={values.access} onChange={access => setValues({ access })} />,
  },
  {
    id: "review", title: "确认", heading: "确认分组信息",
    render: ({ values, goTo }) =>
      <KalosStepperReview onEdit={goTo} rows={[
        { label: "分组名称", value: values.name, step: "details" },
        { label: "分组地址", value: `contacts/${values.slug}`, step: "details" },
        { label: "成员", value: values.members.join("、") || "暂未邀请", step: "members" },
        { label: "权限", value: choices.find(option => option.value === values.access)?.title, step: "access" },
      ]} />,
  },
];

export function StepperFormDemo() {
  const playedRef = useRef(false);
  const stopRef = useRef<() => void>(undefined);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);

  return <KalosStepperForm
    steps={[{
      id: "details", title: "分组资料", heading: "设置联系人分组",
      render: ({ values, setValues }) => <StepperDetails values={values} setValues={setValues} playedRef={playedRef} stopRef={stopRef} />,
      validate: values => ({
        name: values.name.trim() ? undefined : "请输入分组名称",
        slug: /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(values.slug) ? undefined : "请输入有效的分组地址",
      }),
    }, ...remainingSteps]}
    initialValues={initialValues}
    aria-label="新建联系人分组"
    onStepChange={() => {
      playedRef.current = true;
      stopRef.current?.();
    }}
    submitLabel="创建分组"
    submittingLabel="正在创建…"
    // 演示提交状态。接入时从 onComplete 返回保存请求。
    onComplete={() => new Promise<void>(resolve => { timer.current = setTimeout(resolve, 650); })}
    success={(values, reset) => <KalosStepperSuccess title="联系人分组已创建" description={values.name} onReset={() => {
      reset();
      playedRef.current = false;
    }} />}
  />;
}
