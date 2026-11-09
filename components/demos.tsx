"use client";
import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  Check,
  Plus,
  Sparkles,
  ArrowUpRight,
  Layers,
  Heart,
  Mail,
} from "lucide-react";
import { toast } from "sonner";
import { PopButton } from "@/registry/pop/pop-button";
import { PopInput } from "@/registry/pop/pop-input";
import { PopCard } from "@/registry/pop/pop-card";
import { PopBadge } from "@/registry/pop/pop-badge";
import { PopSwitch } from "@/registry/pop/pop-switch";
import { PopCheckbox } from "@/registry/pop/pop-checkbox";
import { PopTabs } from "@/registry/pop/pop-tabs";
import { PopAccordion } from "@/registry/pop/pop-accordion";
import { PopDialog } from "@/registry/pop/pop-dialog";
import { PopSelect } from "@/registry/pop/pop-select";
import { PopProgress } from "@/registry/pop/pop-progress";
import { PopAvatarStack } from "@/registry/pop/pop-avatar-stack";
import { Separator } from "@/components/ui/separator";
const people = [
  { name: "Alan Bu" },
  { name: "Jules Park" },
  { name: "Emma Chen" },
  { name: "Noah Lee" },
  { name: "Olivia Yu" },
];
export function ButtonDemo() {
  const [loading, setLoading] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );
  return (
    <div className="demo-buttons">
      <PopButton
        loading={loading}
        onClick={() => {
          setLoading(true);
          timer.current = setTimeout(() => {
            setLoading(false);
            toast.success("Your idea is ready to go.");
          }, 1000);
        }}
      >
        Make it happen <ArrowRight data-icon="inline-end" />
      </PopButton>
      <div className="flex items-center justify-center gap-3">
        <PopButton
          variant="outline"
          onClick={() => toast("One more good idea.")}
        >
          <Plus data-icon="inline-start" />
          Add something
        </PopButton>
        <PopButton
          variant="outline"
          size="icon"
          aria-label="Like this component"
          onClick={() => toast.success("A little love goes a long way.")}
        >
          <Heart />
        </PopButton>
      </div>
    </div>
  );
}
export function ComponentDemo({
  slug,
  compact = false,
}: {
  slug: string;
  compact?: boolean;
}) {
  const [progress, setProgress] = useState(68);
  const [framework, setFramework] = useState("next");
  switch (slug) {
    case "pop-button":
      return <ButtonDemo />;
    case "pop-input":
      return (
        <div className="demo-form">
          <PopInput
            label="Email address"
            type="email"
            placeholder="you@example.com"
            hint="A good place to stay in touch."
          />
          <PopInput
            label="Your next big idea"
            placeholder="It all starts here…"
          />
        </div>
      );
    case "pop-card":
      return (
        <div className="demo-card">
          <PopCard
            title="A fresh start"
            description="Your next great thing starts here."
            footer={
              <PopButton
                variant="outline"
                size="sm"
                onClick={() => toast("Your workspace is ready to explore.")}
              >
                Explore workspace <ArrowUpRight data-icon="inline-end" />
              </PopButton>
            }
          >
            <div className="card-icon">
              <Layers />
            </div>
            <p className="muted text-sm">
              A little space for your biggest ideas.
            </p>
          </PopCard>
        </div>
      );
    case "pop-badge":
      return (
        <div className="badge-demo">
          <PopBadge status="success">All systems operational</PopBadge>
          <div className="flex gap-2">
            <PopBadge>In progress</PopBadge>
            <PopBadge status="warning">In review</PopBadge>
          </div>
          <span className="tiny-note">Small details. Clear signals.</span>
        </div>
      );
    case "pop-switch":
      return (
        <div className="demo-form settings-demo">
          <PopSwitch
            label="Push notifications"
            description="Just the things that matter."
            defaultChecked
          />
          <Separator />
          <PopSwitch
            label="Weekly digest"
            description="A little inspiration in your inbox."
          />
        </div>
      );
    case "pop-checkbox":
      return (
        <div className="demo-form">
          <PopCheckbox
            label="Make something meaningful"
            description="A good place to begin."
            defaultChecked
          />
          <PopCheckbox label="Add a little personality" />
          <PopCheckbox label="Share it with the world" />
        </div>
      );
    case "pop-tabs":
      return (
        <div className="demo-form">
          <PopTabs
            items={[
              {
                value: "overview",
                label: "Overview",
                content: (
                  <div className="tabs-copy">
                    <Sparkles />
                    <strong>A little clarity.</strong>
                    <p>Everything you need, right where you need it.</p>
                  </div>
                ),
              },
              {
                value: "activity",
                label: "Activity",
                content: (
                  <div className="tabs-copy">
                    <Check />
                    <strong>Looking good.</strong>
                    <p>Your latest changes are all up to date.</p>
                  </div>
                ),
              },
              {
                value: "settings",
                label: "Settings",
                content: (
                  <div className="tabs-copy">
                    <PopSwitch label="Make it yours" defaultChecked />
                  </div>
                ),
              },
            ]}
          />
        </div>
      );
    case "pop-accordion":
      return (
        <div className="demo-form">
          <PopAccordion
            items={[
              {
                question: "Can I make it my own?",
                answer:
                  "Absolutely. The source code lives in your project. Change the colors, the spacing, or every little detail.",
              },
              {
                question: "Does it work with shadcn/ui?",
                answer:
                  "Yes. Pop UI builds on shadcn/ui primitives and uses the same CLI and semantic design tokens.",
              },
              ...(!compact
                ? [
                    {
                      question: "Can I use it commercially?",
                      answer:
                        "Yes. Every component is open source under the MIT license.",
                    },
                  ]
                : []),
            ]}
          />
        </div>
      );
    case "pop-dialog":
      return (
        <PopDialog
          trigger="A moment of focus"
          title="Good ideas deserve a little space."
          description="An accessible dialog that keeps your next step in focus."
        >
          <p className="muted text-sm">
            Try the close button, press Escape, or click outside. Focus returns
            to where you left off.
          </p>
          <PopInput label="Your idea" placeholder="What are you thinking?" />
        </PopDialog>
      );
    case "pop-select":
      return (
        <div className="demo-form">
          <PopSelect
            label="Your favorite framework"
            value={framework}
            onValueChange={setFramework}
            items={[
              { value: "next", label: "Next.js" },
              { value: "react", label: "React + Vite" },
              { value: "remix", label: "React Router" },
            ]}
          />
          <p className="tiny-note">A solid foundation for your next project.</p>
        </div>
      );
    case "pop-progress":
      return (
        <div className="demo-form">
          <PopProgress
            label="Making good things happen"
            value={progress}
            description={
              progress === 100
                ? "You made it. Time to share it."
                : "One step closer to something wonderful."
            }
          />
          <div className="flex gap-2">
            <PopButton
              variant="outline"
              size="sm"
              onClick={() =>
                setProgress((value) =>
                  value >= 100 ? 0 : Math.min(100, value + 16),
                )
              }
            >
              {progress === 100 ? "Start again" : "Take a step"}{" "}
              <ArrowRight data-icon="inline-end" />
            </PopButton>
          </div>
        </div>
      );
    case "pop-avatar-stack":
      return (
        <div className="avatar-demo">
          <PopAvatarStack people={people} />
          <div>
            <strong>Better, together.</strong>
            <p className="tiny-note">
              A few good people. Endless possibilities.
            </p>
          </div>
        </div>
      );
    default:
      return null;
  }
}
export function HeroShowcase() {
  return (
    <div className="hero-showcase">
      <div className="float-tag">
        <span className="status-dot" /> Thoughtfully put together
      </div>
      <div className="showcase-main">
        <div className="showcase-top">
          <span className="mini-icon">
            <Sparkles />
          </span>
          <span className="tiny-note">
            A little something for your next idea
          </span>
          <span className="window-dots">···</span>
        </div>
        <div className="showcase-content">
          <div className="showcase-avatars">
            <PopAvatarStack people={people.slice(0, 3)} />
            <PopBadge status="success">Ready when you are</PopBadge>
          </div>
          <h3>
            Your next big thing.
            <br />
            <span>Starts with the little things.</span>
          </h3>
          <PopInput label="Project name" placeholder="Something wonderful" />
          <div className="showcase-setting">
            <PopSwitch
              label="A little extra magic"
              description="It's all in the details."
              defaultChecked
            />
          </div>
          <PopButton
            className="w-full"
            onClick={() => toast.success("Something wonderful is on its way.")}
          >
            <Plus data-icon="inline-start" />
            Create something good
            <ArrowRight data-icon="inline-end" />
          </PopButton>
        </div>
      </div>
      <div className="floating-notice">
        <span className="notice-check">
          <Check />
        </span>
        <div>
          <strong>Nice. That feels right.</strong>
          <span>Small details make a big difference.</span>
        </div>
        <span className="notice-time">now</span>
      </div>
      <div className="floating-button">
        <PopButton
          variant="outline"
          onClick={() => toast("Hello from Pop UI.")}
        >
          <Mail data-icon="inline-start" />
          Say hello
          <ArrowUpRight data-icon="inline-end" />
        </PopButton>
      </div>
      <div className="showcase-caption">
        <span>12 components</span>
        <span>∞ possibilities</span>
      </div>
    </div>
  );
}
