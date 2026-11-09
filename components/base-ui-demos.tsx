"use client";
import { DemoContent } from "@/components/demo-content";
import { PopAccordion } from "@/registry/base-ui/pop-accordion";
import { PopAvatarStack } from "@/registry/base-ui/pop-avatar-stack";
import { PopBadge } from "@/registry/base-ui/pop-badge";
import { PopButton } from "@/registry/base-ui/pop-button";
import { PopCard } from "@/registry/base-ui/pop-card";
import { PopCheckbox } from "@/registry/base-ui/pop-checkbox";
import { PopDialog } from "@/registry/base-ui/pop-dialog";
import { PopInput } from "@/registry/base-ui/pop-input";
import { PopProgress } from "@/registry/base-ui/pop-progress";
import { PopSelect } from "@/registry/base-ui/pop-select";
import { PopSwitch } from "@/registry/base-ui/pop-switch";
import { PopTabs } from "@/registry/base-ui/pop-tabs";
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
