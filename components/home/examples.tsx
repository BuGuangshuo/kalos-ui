"use client";

import { useEffect, useEffectEvent, useRef, useState } from "react";
import {
  AnimatePresence,
  LayoutGroup,
  motion,
  useInView,
  useReducedMotion,
} from "motion/react";
import {
  ArrowRight,
  Bell,
  Check,
  CircleCheck,
  Loader2,
  Plus,
  Save,
  Sparkles,
  X,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { PopInput } from "@/registry/pop/pop-input";
import { PopCheckbox } from "@/registry/pop/pop-checkbox";
import { toast } from "sonner";
import { CopyCommand } from "./hero";
import { AutoplayScope } from "./vignettes";
import { easeOut, reveal, useAutoplay } from "./runtime";

const scenes = [
  {
    id: "save",
    label: "保存按钮",
    prompt: "让保存按钮先显示加载状态，再轻快地确认已保存。",
    steps: [
      "使用 PopButton，保留已有的按钮风格。",
      "按下后显示加载状态，避免重复提交。",
      "图标与文字通过模糊过渡自然切换。",
      "保存完成后反馈成功，再回到初始状态。",
    ],
  },
  {
    id: "bell",
    label: "通知图标",
    prompt: "让通知图标在悬停时轻轻摇动，点击时也能得到反馈。",
    steps: [
      "保持熟悉的通知图标与清晰的轮廓。",
      "围绕顶部摇动，模拟自然的钟摆效果。",
      "悬停、点击与循环演示使用相同的节奏。",
      "动画结束后，准确地回到初始位置。",
    ],
  },
  {
    id: "list",
    label: "待办列表",
    prompt: "为列表的新增和移除添加过渡，让每一步变化都清晰可见。",
    steps: [
      "每个任务都有稳定的名称与位置。",
      "新任务从轻微的模糊中向上浮现。",
      "移除任务时，让其他任务自然填补位置。",
      "点击右侧加号与关闭按钮，亲手试试。",
    ],
  },
  {
    id: "form",
    label: "表单输入",
    prompt: "用一致的基础组件，组合一个清晰、易用的偏好设置表单。",
    steps: [
      "输入框保留标签、提示与键盘操作。",
      "用复选框清楚地表达通知偏好。",
      "按钮提供明确的提交与完成反馈。",
      "同一套语义变量，同时适配深浅主题。",
    ],
  },
];

function SavePreview({ playing }: { playing: boolean }) {
  const [state, setState] = useState<"idle" | "loading" | "saved">("idle");
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const save = () => {
    if (state === "loading") return;
    timers.current.forEach(clearTimeout);
    setState("loading");
    timers.current = [
      setTimeout(() => setState("saved"), 1360),
      setTimeout(() => setState("idle"), 2800),
    ];
  };
  useAutoplay(
    () => {
      if (playing) save();
    },
    3600,
    300,
  );
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  const label =
    state === "loading"
      ? "正在保存…"
      : state === "saved"
        ? "已保存"
        : "保存更改";
  const Icon = state === "loading" ? Loader2 : state === "saved" ? Check : Save;
  return (
    <Button
      className="motion-save-button"
      disabled={state === "loading"}
      aria-busy={state === "loading" || undefined}
      onClick={save}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={state}
          initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -8, filter: "blur(4px)" }}
          transition={{ duration: 0.3, ease: easeOut }}
        >
          <Icon
            data-icon="inline-start"
            className={state === "loading" ? "animate-spin" : undefined}
          />
          {label}
        </motion.span>
      </AnimatePresence>
    </Button>
  );
}

function BellPreview({ playing }: { playing: boolean }) {
  const reduce = useReducedMotion();
  const [rings, setRings] = useState(0);
  return (
    <div className="motion-bell-preview">
      <motion.button
        type="button"
        aria-label="摇动通知图标"
        onClick={() => setRings((n) => n + 1)}
        whileTap={{ scale: 0.92 }}
        whileHover={{ scale: 1.04 }}
      >
        <motion.span
          key={rings}
          animate={
            (playing || rings > 0) && !reduce
              ? { rotate: [0, -20, 16, -12, 8, 0] }
              : { rotate: 0 }
          }
          transition={{
            duration: 0.8,
            ease: "easeInOut",
            repeat: playing && !reduce ? Infinity : 0,
            repeatDelay: 0.7,
          }}
        >
          <Bell />
        </motion.span>
      </motion.button>
      <span>悬停 · 点击 · 进入视口 · 循环</span>
    </div>
  );
}

const allTasks = [
  "撰写更新说明",
  "发布你的作品",
  "评审合并请求",
  "回复团队反馈",
  "完善设计规范",
];
function TodoPreview() {
  const [tasks, setTasks] = useState([allTasks[0], allTasks[2]]);
  const next = useRef(0);
  useAutoplay(
    () => {
      const n = next.current++;
      setTasks((list) =>
        n % 2 === 0
          ? [...list, allTasks[(n + 1) % 5]].filter(
              (x, i, a) => a.indexOf(x) === i,
            )
          : list.filter((_, i) => i !== 0),
      );
    },
    1400,
    500,
  );
  return (
    <div className="motion-todo-preview">
      <ul>
        <AnimatePresence initial={false} mode="popLayout">
          {tasks.map((task) => (
            <motion.li
              key={task}
              layout
              initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 0.94, filter: "blur(4px)" }}
              transition={{ type: "spring", stiffness: 300, damping: 28 }}
            >
              <span className="motion-todo-checkbox" />
              <span>{task}</span>
              <button
                aria-label={`移除${task}`}
                onClick={() =>
                  setTasks((list) => list.filter((t) => t !== task))
                }
              >
                <X />
              </button>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
      <Button
        variant="ghost"
        size="sm"
        onClick={() =>
          setTasks((list) => {
            const missing = allTasks.find((t) => !list.includes(t));
            return missing ? [...list, missing] : list;
          })
        }
      >
        <Plus data-icon="inline-start" />
        添加任务
      </Button>
    </div>
  );
}

function FormPreview() {
  return (
    <form
      className="motion-form-preview"
      onSubmit={(event) => {
        event.preventDefault();
        toast.success("偏好已保存");
      }}
    >
      <PopInput
        label="邮箱地址"
        type="email"
        placeholder="you@example.com"
        required
        hint="我们只会发送与你有关的通知。"
      />
      <PopCheckbox label="接收项目动态" defaultChecked />
      <Button type="submit">保存偏好</Button>
    </form>
  );
}

function TypingPrompt({ text, running }: { text: string; running: boolean }) {
  const reduce = useReducedMotion();
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!running || reduce) return;
    let current = 0;
    const timer = setInterval(() => {
      current++;
      setCount(current);
      if (current >= text.length) clearInterval(timer);
    }, 26);
    return () => clearInterval(timer);
  }, [text, running, reduce]);
  return (
    <span>
      {running && !reduce ? text.slice(0, count) : text}
      <span className="motion-type-caret" aria-hidden="true" />
    </span>
  );
}

function ScenarioPane({
  scene,
  running,
  onDone,
}: {
  scene: (typeof scenes)[number];
  running: boolean;
  onDone: () => void;
}) {
  const reduce = useReducedMotion();
  const [step, setStep] = useState(-1);
  const advance = useEffectEvent(onDone);
  useEffect(() => {
    if (!running || reduce) return;
    const typed = scene.prompt.length * 26 + 450;
    const timers = scene.steps.map((_, i) =>
      setTimeout(() => setStep(i), typed + i * 750),
    );
    timers.push(
      setTimeout(
        () => setStep(scene.steps.length),
        typed + scene.steps.length * 750,
      ),
    );
    timers.push(
      setTimeout(() => advance(), typed + scene.steps.length * 750 + 5600),
    );
    return () => timers.forEach(clearTimeout);
  }, [running, reduce, scene]);
  const progress = reduce ? scene.steps.length : step;
  const complete = progress >= scene.steps.length;
  return (
    <div className="motion-scenario-grid">
      <div className="motion-scenario-steps">
        <div className="motion-scenario-prompt">
          <ArrowRight />
          <TypingPrompt text={scene.prompt} running={running} />
        </div>
        <ol>
          {scene.steps.map((text, i) =>
            progress >= i ? (
              <motion.li
                key={text}
                initial={{ opacity: 0, y: 6, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.35, ease: easeOut }}
              >
                {progress > i ? (
                  <CircleCheck />
                ) : (
                  <Loader2 className="animate-spin" />
                )}
                <span>{text}</span>
              </motion.li>
            ) : null,
          )}
        </ol>
        <AnimatePresence>
          {complete ? (
            <motion.div
              className="motion-scenario-complete"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Sparkles />
              示例已就绪，可以直接操作右侧预览。
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
      <div className="motion-scenario-preview">
        <span className="motion-localhost-label">localhost:3000</span>
        <AutoplayScope paused={!running || !complete}>
          {scene.id === "save" ? (
            <SavePreview playing={running && complete} />
          ) : scene.id === "bell" ? (
            <BellPreview playing={running && complete} />
          ) : scene.id === "list" ? (
            <TodoPreview />
          ) : (
            <FormPreview />
          )}
        </AutoplayScope>
      </div>
    </div>
  );
}

export function ExamplesSection() {
  const [active, setActive] = useState(scenes[0].id);
  const [auto, setAuto] = useState(true);
  const ref = useRef<HTMLDivElement>(null);
  const visible = useInView(ref, { margin: "-100px" });
  return (
    <section className="motion-examples-section">
      <motion.span {...reveal(0)} className="motion-examples-badge">
        <Sparkles />
        Pop UI · 交互示例
      </motion.span>
      <motion.h2 {...reveal(1)}>让想法，生动地发生。</motion.h2>
      <motion.p {...reveal(2)} className="motion-examples-subtitle">
        从按钮反馈到列表过渡，把自然的交互融入每一个细节。
        <br className="motion-desktop-break" />
        使用熟悉的组件，自由组合出你的下一个作品。
      </motion.p>
      <motion.div {...reveal(3)} ref={ref} className="motion-example-window">
        <LayoutGroup id="home-scenarios">
          <Tabs
            value={active}
            onValueChange={(value) => {
              setAuto(false);
              setActive(value);
            }}
          >
            <TabsList
              aria-label="交互示例"
              variant="line"
              className="motion-scenario-tabs"
            >
              {scenes.map((scene) => (
                <TabsTrigger key={scene.id} value={scene.id}>
                  {scene.id === active ? (
                    <motion.span
                      layoutId="scenario-active"
                      className="motion-scenario-highlight"
                      transition={{
                        type: "spring",
                        stiffness: 360,
                        damping: 30,
                      }}
                    />
                  ) : null}
                  <span>{scene.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>
            <div className="motion-terminal">
              <div className="motion-terminal-bar">
                <span />
                <span />
                <span />
                <span>~/pop-ui</span>
              </div>
              {scenes.map((scene) => (
                <TabsContent key={scene.id} value={scene.id}>
                  <ScenarioPane
                    scene={scene}
                    running={visible && active === scene.id}
                    onDone={() => {
                      if (auto)
                        setActive(
                          scenes[
                            (scenes.findIndex((s) => s.id === active) + 1) %
                              scenes.length
                          ].id,
                        );
                    }}
                  />
                </TabsContent>
              ))}
            </div>
          </Tabs>
        </LayoutGroup>
      </motion.div>
      <motion.div {...reveal(4)} className="motion-examples-install">
        <p>全部组件支持深浅主题，源码可以直接安装到你的项目中。</p>
        <CopyCommand name="pop-button" id="example-command" />
        <div className="motion-hero-actions">
          <Link href="/docs/getting-started" className="motion-primary-link">
            查看使用文档
          </Link>
          <Link href="/components" className="motion-secondary-link">
            探索组件库
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
