"use client";
import { KalosForm } from "@/registry/react-aria/kalos-form";
import { DemoContent } from "@/components/demo-content";
import type { PopoverExampleVariant } from "@/lib/component-examples";
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
  KalosForm,
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
  popoverVariant,
}: {
  slug: string;
  compact?: boolean;
  popoverVariant?: PopoverExampleVariant;
}) {
  return <DemoContent components={components} slug={slug} compact={compact} popoverVariant={popoverVariant} />;
}
