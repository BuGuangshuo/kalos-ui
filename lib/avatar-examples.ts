export function avatarExample() {
  return `"use client";

import { KalosAvatar, KalosAvatarStack, type KalosAvatarPerson } from "@/components/ui/kalos-avatar-stack";

const contacts: KalosAvatarPerson[] = [
  { name: "林舟", seed: "lin-zhou", status: "online" },
  { name: "陈晓", seed: "chen-xiao", status: "away" },
  { name: "周宁", seed: "zhou-ning", status: "busy" },
  { name: "吴昕", seed: "wu-xin" },
  { name: "许知" },
];

export default function Example() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <KalosAvatar name="林舟" status="online" />
      <KalosAvatar name="设计团队" shape="square" />
      <KalosAvatar name="文档助手" kind="agent" seed="document-agent" working />
      <KalosAvatarStack people={contacts} max={4} size={24} aria-label="文档协作者" />
    </div>
  );
}`;
}
