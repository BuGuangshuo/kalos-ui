"use client";
import { DemoContent } from "@/components/demo-content";
import { PopAccordion } from "@/registry/react-aria/pop-accordion";
import { PopAvatarStack } from "@/registry/react-aria/pop-avatar-stack";
import { PopBadge } from "@/registry/react-aria/pop-badge";
import { PopButton } from "@/registry/react-aria/pop-button";
import { PopCard } from "@/registry/react-aria/pop-card";
import { PopCheckbox } from "@/registry/react-aria/pop-checkbox";
import { PopDialog } from "@/registry/react-aria/pop-dialog";
import { PopInput } from "@/registry/react-aria/pop-input";
import { PopProgress } from "@/registry/react-aria/pop-progress";
import { PopSelect } from "@/registry/react-aria/pop-select";
import { PopSwitch } from "@/registry/react-aria/pop-switch";
import { PopTabs } from "@/registry/react-aria/pop-tabs";
const components = {
  PopAccordion,
  PopAvatarStack,
  PopBadge,
  PopButton,
  PopCard,
  PopCheckbox,
  PopDialog,
  PopInput,
  PopProgress,
  PopSelect,
  PopSwitch,
  PopTabs,
};
export default function BackendDemo({
  slug,
  compact,
}: {
  slug: string;
  compact?: boolean;
}) {
  return <DemoContent components={components} slug={slug} compact={compact} />;
}
