"use client";
import { DemoContent } from "@/components/demo-content";
import { KalosAccordion } from "@/registry/react-aria/kalos-accordion";
import { KalosAvatarStack } from "@/registry/react-aria/kalos-avatar-stack";
import { KalosBadge } from "@/registry/react-aria/kalos-badge";
import { KalosButton } from "@/registry/react-aria/kalos-button";
import { KalosCard } from "@/registry/react-aria/kalos-card";
import { KalosCheckbox } from "@/registry/react-aria/kalos-checkbox";
import { KalosAlertDialog } from "@/registry/react-aria/kalos-alert-dialog";
import { KalosDialog } from "@/registry/react-aria/kalos-dialog";
import { KalosPopover } from "@/registry/react-aria/kalos-popover";
import { KalosCommandMenu } from "@/registry/react-aria/kalos-command-menu";
import { KalosInput } from "@/registry/react-aria/kalos-input";
import { KalosProgress } from "@/registry/react-aria/kalos-progress";
import { KalosSelect } from "@/registry/react-aria/kalos-select";
import { KalosSwitch } from "@/registry/react-aria/kalos-switch";
import { KalosTabs } from "@/registry/react-aria/kalos-tabs";
const components = {
  KalosAccordion,
  KalosAvatarStack,
  KalosBadge,
  KalosButton,
  KalosCard,
  KalosCheckbox,
  KalosDialog,
  KalosAlertDialog,
  KalosInput,
  KalosPopover,
  KalosCommandMenu,
  KalosProgress,
  KalosSelect,
  KalosSwitch,
  KalosTabs,
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
