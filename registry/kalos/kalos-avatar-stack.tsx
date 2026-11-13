"use client";

import { cn } from "@/lib/utils";
import { controlStyles, avatarCss } from "@/components/ui/kalos-styles";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  AvatarGlyph, avatarHash, avatarLabel, avatarStyle, avatarCount,
  type KalosAvatarProps, type KalosAvatarStackProps,
} from "@/components/ui/kalos-avatar-shared";
export type { KalosAvatarProps, KalosAvatarStackProps, KalosAvatarPerson, KalosAvatarSize, KalosAvatarStatus } from "@/components/ui/kalos-avatar-shared";

export function KalosAvatar({
  name, src, size = 32, shape, status, kind = "person", seed = name,
  color, working, className, style, ...props
}: KalosAvatarProps) {
  const label = avatarLabel(name, status);
  return (
    <Avatar
      role={label ? "img" : undefined}
      aria-label={label || undefined}
      aria-hidden={label ? undefined : true}
      {...props}
      data-size={size}
      data-shape={shape ?? (kind === "agent" ? "square" : "circle")}
      data-kind={kind}
      data-tone={kind === "person" && seed ? avatarHash(seed) % 8 : undefined}
      className={cn(controlStyles.avatar, "kalos-avatar", className)}
      style={avatarStyle(size, color, style)}
    >
      <style>{avatarCss}</style>
      {src ? <AvatarImage key={src} src={src} alt="" aria-hidden="true" /> : null}
      <AvatarFallback aria-hidden="true">
        <AvatarGlyph name={name} kind={kind} seed={seed} working={working} />
      </AvatarFallback>
      {status ? <span className="kalos-avatar-status" data-status={status} aria-hidden="true" /> : null}
    </Avatar>
  );
}

export function KalosAvatarStack({
  people, max = 4, total, size = 32, className, style, ...props
}: KalosAvatarStackProps) {
  const limit = avatarCount(max, 4);
  const visible = people.slice(0, limit);
  const count = Math.max(people.length, avatarCount(total, people.length));
  const remaining = count - visible.length;
  return (
    <div
      role="group"
      aria-label={`${count} 位联系人`}
      {...props}
      className={cn(controlStyles.avatar, "kalos-avatar-stack", className)}
      style={avatarStyle(size, undefined, style)}
    >
      <style>{avatarCss}</style>
      {visible.map(({ image, ...person }, index) => (
        <KalosAvatar key={`${person.seed ?? person.name}-${index}`} {...person} src={person.src ?? image} size={size} />
      ))}
      {remaining > 0 ? <span className="kalos-avatar-count" data-size={size} role="img" aria-label={`另有 ${remaining} 位联系人`} style={avatarStyle(size)}>
        {remaining > 99 ? "99+" : `+${remaining}`}
      </span> : null}
    </div>
  );
}

export { KalosAvatarStack as KalosAvatarGroup };
