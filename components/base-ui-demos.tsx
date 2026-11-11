"use client";
import { DemoContent } from "@/components/demo-content";
import { KalosAccordion } from "@/registry/base-ui/kalos-accordion";
import { KalosAvatarStack } from "@/registry/base-ui/kalos-avatar-stack";
import { KalosBadge } from "@/registry/base-ui/kalos-badge";
import { KalosButton } from "@/registry/base-ui/kalos-button";
import { KalosCard } from "@/registry/base-ui/kalos-card";
import { KalosCheckbox } from "@/registry/base-ui/kalos-checkbox";
import { KalosAlertDialog } from "@/registry/base-ui/kalos-alert-dialog";
import { KalosDialog } from "@/registry/base-ui/kalos-dialog";
import { KalosPopover } from "@/registry/base-ui/kalos-popover";
import { KalosCommandMenu } from "@/registry/base-ui/kalos-command-menu";
import { KalosInput } from "@/registry/base-ui/kalos-input";
import { KalosProgress } from "@/registry/base-ui/kalos-progress";
import { KalosSelect } from "@/registry/base-ui/kalos-select";
import { KalosSwitch } from "@/registry/base-ui/kalos-switch";
import { KalosTabs } from "@/registry/base-ui/kalos-tabs";
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
