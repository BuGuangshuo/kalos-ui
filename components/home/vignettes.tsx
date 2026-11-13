"use client";

import { useId, useState, type ComponentType, type ReactNode } from "react";
import {
  AnimatePresence,
  LayoutGroup,
  motion,
  useReducedMotion,
} from "motion/react";
import {
  Bell,
  CircleCheck,
  Clapperboard,
  Heart,
  Send,
  Settings,
  Sparkles,
  X,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldSet,
  FieldLegend,
} from "@/components/ui/field";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { AutoplayContext, easeOut, useAutoplay } from "./runtime";

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
  const id = useId();
  const [on, setOn] = useState([true, false]);
  useAutoplay(() => setOn(([a, b]) => [!a, !b]), 1600);
  return (
    <FieldGroup className="motion-vignette-fields">
      {["飞行模式", "无线网络"].map((label, index) => (
        <Field key={label} orientation="horizontal">
          <Switch
            id={`${id}-${index}`}
            checked={on[index]}
            onCheckedChange={(value) =>
              setOn((list) => list.map((v, i) => (i === index ? value : v)))
            }
          />
          <FieldLabel htmlFor={`${id}-${index}`}>
            <span>{label}</span>
          </FieldLabel>
        </Field>
      ))}
    </FieldGroup>
  );
}

const tabs = [
  { label: "概览", text: "12 项任务，3 项待办。" },
  { label: "分析", text: "本周页面访问量增长了 25%。" },
  { label: "报告", text: "5 份报告已准备好导出。" },
];
export function TabsVignette() {
  const [value, setValue] = useState("0");
  useAutoplay(
    () => setValue((v) => String((Number(v) + 1) % tabs.length)),
    1600,
    300,
  );
  return (
    <LayoutGroup>
      <Tabs
        value={value}
        onValueChange={setValue}
        className="motion-vignette-tabs"
      >
        <TabsList aria-label="内容视图">
          {tabs.map((tab, index) => (
            <TabsTrigger key={tab.label} value={String(index)}>
              {value === String(index) ? (
                <motion.span
                  layoutId="vignette-tab-highlight"
                  className="motion-vignette-tab-highlight"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              ) : null}
              <span>{tab.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value={value} className="motion-vignette-tab-panel">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={value}
              initial={{ opacity: 0, y: 8, filter: "blur(3px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -8, filter: "blur(3px)" }}
              transition={{ duration: 0.2 }}
            >
              <strong>{tabs[Number(value)].label}</strong>
              <p>{tabs[Number(value)].text}</p>
            </motion.div>
          </AnimatePresence>
        </TabsContent>
      </Tabs>
    </LayoutGroup>
  );
}

const questions = [
  ["支持键盘操作吗？", "保留完整的键盘与无障碍交互。"],
  ["可以自由修改吗？", "源码就在代码目录中，每一处都可以定制。"],
  ["如何安装组件？", "运行安装命令，按需添加组件。"],
];
function AccordionVignette() {
  const [value, setValue] = useState("0");
  useAutoplay(() => setValue((v) => String((Number(v) + 1) % 3)), 2000, 600);
  return (
    <Accordion
      value={value ? [value] : []}
      onValueChange={next => setValue(next[0] ?? "")}
      className="motion-vignette-accordion"
    >
      {questions.map(([question, answer], index) => (
        <AccordionItem key={question} value={String(index)}>
          <AccordionTrigger>{question}</AccordionTrigger>
          <AccordionContent>{answer}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

const tasks = ["预订拍摄工作室", "发送服务报价", "选择合适的字体"];
function ChecklistVignette() {
  const id = useId();
  const [done, setDone] = useState(0);
  useAutoplay(() => setDone((count) => (count + 1) % 4), 1100, 200);
  return (
    <FieldSet className="motion-vignette-fields">
      <FieldLegend className="sr-only">待办任务清单</FieldLegend>
      <FieldGroup className="motion-vignette-fields">
        {tasks.map((task, index) => (
          <Field key={task} orientation="horizontal">
            <Checkbox
              id={`${id}-${index}`}
              checked={index < done}
              onCheckedChange={(value) => setDone(value ? index + 1 : index)}
            />
            <FieldLabel htmlFor={`${id}-${index}`}>
              <span
                className={index < done ? "motion-task-completed" : undefined}
              >
                {task}
              </span>
            </FieldLabel>
          </Field>
        ))}
      </FieldGroup>
    </FieldSet>
  );
}

export function SlidingNumber({ number }: { number: number }) {
  const reduce = useReducedMotion();
  return (
    <span
      className="motion-sliding-number"
      aria-label={number.toLocaleString("en-US")}
    >
      <span aria-hidden="true">
        {number
          .toLocaleString("en-US")
          .split("")
          .map((character, index) =>
            /\d/.test(character) ? (
              <span key={index} className="motion-number-digit">
                <motion.span
                  className="motion-number-strip"
                  animate={{ y: `${-Number(character) * 10}%` }}
                  transition={{
                    type: "spring",
                    stiffness: 160,
                    damping: 24,
                    duration: reduce ? 0 : undefined,
                  }}
                >
                  {Array.from({ length: 10 }, (_, n) => (
                    <span key={n}>{n}</span>
                  ))}
                </motion.span>
              </span>
            ) : (
              <span key={index}>{character}</span>
            ),
          )}
      </span>
    </span>
  );
}
function CounterVignette() {
  const [count, setCount] = useState(12480);
  useAutoplay(() => setCount((c) => c + 67), 1500);
  return (
    <div className="motion-counter-demo">
      <SlidingNumber number={count} />
      <span>本周组件调用次数 · 演示</span>
    </div>
  );
}

const densities = ["默认间距", "舒适间距", "紧凑间距"];
function RadioVignette() {
  const [value, setValue] = useState(densities[1]);
  useAutoplay(
    () => setValue((v) => densities[(densities.indexOf(v) + 1) % 3]),
    1300,
    500,
  );
  return (
    <RadioGroup
      value={value}
      onValueChange={setValue}
      aria-label="界面密度"
      className="motion-vignette-radio"
    >
      {densities.map((density) => (
        <Field key={density} orientation="horizontal">
          <FieldLabel>
            <RadioGroupItem value={density} />
            {density}
          </FieldLabel>
        </Field>
      ))}
    </RadioGroup>
  );
}

const icons = [Bell, Heart, Settings, Send, Sparkles, Clapperboard];
export function IconsVignette() {
  const [turn, setTurn] = useState(0);
  useAutoplay(() => setTurn((n) => n + 1), 1500, 100);
  return (
    <div className="motion-icons-demo">
      {icons.map((Icon, index) => (
        <motion.button
          key={index}
          type="button"
          aria-label={["通知", "喜欢", "设置", "发送", "灵感", "影片"][index]}
          whileHover={{ scale: 1.16, rotate: [0, -16, 16, 0] }}
          whileTap={{ scale: 0.86 }}
          animate={
            index % 3 === turn % 3
              ? { rotate: [0, -12, 12, -7, 0] }
              : { rotate: 0 }
          }
          transition={{ duration: 0.65, ease: easeOut }}
        >
          <Icon />
        </motion.button>
      ))}
    </div>
  );
}

const notifications = ["文档已创建", "更改已保存", "邀请已发送"];
function ToastVignette() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);
  useAutoplay(
    () => {
      setIndex((i) => i + 1);
      setVisible(true);
    },
    1600,
    300,
  );
  return (
    <div className="motion-toast-demo" aria-label="通知演示">
      <div className="motion-toast-back" />
      <AnimatePresence mode="popLayout" initial={false}>
        {visible ? (
          <motion.div
            key={index}
            className="motion-toast-card"
            initial={{ opacity: 0, y: 50, scale: 0.9, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -12, scale: 0.94, filter: "blur(4px)" }}
            transition={{ type: "spring", stiffness: 300, damping: 26 }}
          >
            <CircleCheck />
            <span>{notifications[index % 3]}</span>
            <button
              type="button"
              aria-label="关闭演示通知"
              onClick={() => setVisible(false)}
            >
              <X />
            </button>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

const progressSteps = [18, 46, 74, 100];
function ProgressVignette() {
  const [step, setStep] = useState(0);
  useAutoplay(() => setStep((n) => (n + 1) % 4), 1000, 100);
  return (
    <div className="motion-progress-demo">
      <div>
        <span>正在上传</span>
        <span>
          <SlidingNumber number={progressSteps[step]} />%
        </span>
      </div>
      <Progress value={progressSteps[step]} aria-label="上传进度" />
    </div>
  );
}

export const VIGNETTES: { title: string; Vignette: ComponentType }[] = [
  { title: "开关 Switch", Vignette: SwitchVignette },
  { title: "分段控制器 Segmented", Vignette: TabsVignette },
  { title: "折叠面板 Accordion", Vignette: AccordionVignette },
  { title: "复选框 Checkbox", Vignette: ChecklistVignette },
  { title: "数字滚动 Sliding Number", Vignette: CounterVignette },
  { title: "单选组 Radio Group", Vignette: RadioVignette },
  { title: "动态图标 Icons", Vignette: IconsVignette },
  { title: "消息通知 Toast", Vignette: ToastVignette },
  { title: "进度条 Progress", Vignette: ProgressVignette },
];
