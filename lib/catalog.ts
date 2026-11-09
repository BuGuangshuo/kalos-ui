export type Category =
  "Actions" | "Inputs" | "Display" | "Navigation" | "Feedback";
export const catalog = [
  {
    slug: "pop-button",
    title: "Button",
    category: "Actions",
    description: "A little intention behind every interaction.",
    dependencies: ["button"],
    props: "All shadcn Button props, plus loading?: boolean.",
    usage: "<PopButton loading={saving}>Save changes</PopButton>",
  },
  {
    slug: "pop-input",
    title: "Text field",
    category: "Inputs",
    description: "Clear labels, helpful hints, and room to type.",
    dependencies: ["input", "field"],
    props:
      "label: string; hint?: string; error?: string; all native input props.",
    usage:
      '<PopInput label="Email address" type="email" placeholder="you@example.com" />',
  },
  {
    slug: "pop-card",
    title: "Card",
    category: "Display",
    description: "A calm home for your content and actions.",
    dependencies: ["card"],
    props:
      "title: string; description?: string; children: ReactNode; footer?: ReactNode.",
    usage:
      '<PopCard title="Your workspace" description="A place for good ideas.">Hello, world.</PopCard>',
  },
  {
    slug: "pop-badge",
    title: "Badge",
    category: "Display",
    description: "Small signals that say just enough.",
    dependencies: ["badge"],
    props: 'status?: "neutral" | "success" | "warning"; children: ReactNode.',
    usage: '<PopBadge status="success">Available</PopBadge>',
  },
  {
    slug: "pop-switch",
    title: "Switch",
    category: "Inputs",
    description: "One small switch. A clear change of state.",
    dependencies: ["switch"],
    props:
      "label: string; description?: string; checked?: boolean; onCheckedChange?: (checked: boolean) => void.",
    usage:
      '<PopSwitch label="Notifications" description="Keep the good things coming." />',
  },
  {
    slug: "pop-checkbox",
    title: "Checkbox",
    category: "Inputs",
    description: "Make a choice. Feel a little progress.",
    dependencies: ["checkbox"],
    props:
      "label: string; description?: string; checked?: CheckedState; onCheckedChange?: (checked: CheckedState) => void.",
    usage: '<PopCheckbox label="Make something wonderful" />',
  },
  {
    slug: "pop-tabs",
    title: "Tabs",
    category: "Navigation",
    description: "A simple way to find your next point of view.",
    dependencies: ["tabs"],
    props:
      "items: { value: string; label: string; content: ReactNode }[]; defaultValue?: string.",
    usage:
      '<PopTabs items={[{ value: "overview", label: "Overview", content: "All your work, together." }]} />',
  },
  {
    slug: "pop-accordion",
    title: "Accordion",
    category: "Display",
    description: "More detail, only when you need it.",
    dependencies: ["accordion"],
    props: "items: { question: string; answer: ReactNode }[].",
    usage:
      '<PopAccordion items={[{ question: "Can I customize it?", answer: "Every line is yours." }]} />',
  },
  {
    slug: "pop-dialog",
    title: "Dialog",
    category: "Actions",
    description: "A focused moment for something that matters.",
    dependencies: ["dialog", "button"],
    props:
      "trigger: string; title: string; description?: string; children: ReactNode.",
    usage:
      '<PopDialog trigger="Take a closer look" title="A moment of focus">Your content here.</PopDialog>',
  },
  {
    slug: "pop-select",
    title: "Select",
    category: "Inputs",
    description: "A good choice starts with a clear menu.",
    dependencies: ["select"],
    props:
      "label: string; placeholder?: string; items: { value: string; label: string }[]; value?: string; onValueChange?: (value: string) => void.",
    usage:
      '<PopSelect label="Framework" items={[{ value: "next", label: "Next.js" }]} />',
  },
  {
    slug: "pop-progress",
    title: "Progress",
    category: "Feedback",
    description: "Every little step deserves to be seen.",
    dependencies: ["progress"],
    props: "label: string; value: number; description?: string.",
    usage: '<PopProgress label="Your next big thing" value={68} />',
  },
  {
    slug: "pop-avatar-stack",
    title: "Avatar stack",
    category: "Display",
    description: "Good things are better when built together.",
    dependencies: ["avatar"],
    props: "people: { name: string; image?: string }[]; max?: number.",
    usage:
      '<PopAvatarStack people={[{ name: "Alan Bu" }, { name: "Alex Kim" }]} />',
  },
] as const;
export type Item = (typeof catalog)[number];
