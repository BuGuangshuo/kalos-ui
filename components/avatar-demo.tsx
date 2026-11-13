"use client";

import type { ComponentType } from "react";
import type { KalosAvatarPerson, KalosAvatarProps, KalosAvatarStackProps } from "@/components/ui/kalos-avatar-shared";

const contacts: KalosAvatarPerson[] = [
  { name: "林舟", seed: "lin-zhou", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=80&h=80&fit=crop&crop=faces", status: "online" },
  { name: "文档助手", seed: "document-agent", kind: "agent", working: true },
  { name: "陈晓", seed: "chen-xiao", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=faces", status: "away" },
  { name: "周宁", seed: "zhou-ning", status: "busy" },
  { name: "吴昕", seed: "wu-xin" },
  { name: "许知" },
  { name: "沈言" },
  { name: "苏晴" },
  { name: "陆川" },
];
const rows = [
  { person: contacts[0], detail: "设计师" },
  { person: contacts[2], detail: "稍后回复" },
  { person: contacts[3], detail: "正在通话" },
  { person: contacts[4], detail: "编辑者" },
  { person: contacts[1], detail: "正在整理 14 份文档" },
  { person: { name: "设计团队", seed: "design-team", shape: "square" } as KalosAvatarPerson, detail: "24 位成员" },
];

export function AvatarDemo({ KalosAvatar, KalosAvatarStack, compact }: {
  KalosAvatar: ComponentType<KalosAvatarProps>;
  KalosAvatarStack: ComponentType<KalosAvatarStackProps>;
  compact?: boolean;
}) {
  if (compact) return <KalosAvatarStack people={contacts} aria-label="文档协作者" />;
  return <div className="avatar-demo-card">
    <div className="avatar-demo-header">
      <span>文档协作</span>
      <KalosAvatarStack people={contacts.map(person => ({ ...person, status: undefined }))} size={24} aria-label="9 位文档协作者" />
    </div>
    <ul className="avatar-demo-list">
      {rows.map(({ person: { image, ...person }, detail }) => <li key={person.seed}>
        <KalosAvatar {...person} src={image} aria-hidden="true" />
        <div><span>{person.name}{person.status ? <span className="sr-only">，{({ online: "在线", away: "离开", busy: "忙碌" })[person.status]}</span> : null}</span><span className="avatar-demo-detail">{detail}</span></div>
      </li>)}
    </ul>
  </div>;
}
