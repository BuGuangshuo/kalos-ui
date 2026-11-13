import type { ComponentPropsWithoutRef, CSSProperties } from "react";

export type KalosAvatarSize = 20 | 24 | 32 | 40;
export type KalosAvatarStatus = "online" | "away" | "busy";
export type KalosAvatarProps = Omit<ComponentPropsWithoutRef<"span">, "children" | "color"> & {
  name?: string;
  src?: string;
  size?: KalosAvatarSize;
  shape?: "circle" | "square";
  status?: KalosAvatarStatus;
  kind?: "person" | "agent";
  seed?: string;
  color?: string;
  working?: boolean;
};
export type KalosAvatarPerson = Pick<KalosAvatarProps, "name" | "src" | "shape" | "status" | "kind" | "seed" | "color" | "working"> & {
  name: string;
  /** 保留原有的头像地址属性。 */
  image?: string;
};
export type KalosAvatarStackProps = Omit<ComponentPropsWithoutRef<"div">, "children"> & {
  people: KalosAvatarPerson[];
  max?: number;
  total?: number;
  size?: KalosAvatarSize;
};

const segmenter = new Intl.Segmenter("zh", { granularity: "grapheme" });
const statusNames = { online: "在线", away: "离开", busy: "忙碌" };

export function avatarHash(value: string) {
  return Array.from(value).reduce((hash, char) => (Math.imul(hash, 31) + char.codePointAt(0)!) >>> 0, 0);
}

export function avatarInitials(name = "") {
  const clean = name.trim().replace(/^[\s\p{P}]+/u, "");
  const first = Array.from(segmenter.segment(clean))[0]?.segment ?? "";
  if (/\p{Extended_Pictographic}|\p{Regional_Indicator}/u.test(first)) return first;
  const words = clean.split(/\s+/).filter(word => !/^(?:[IVX]+|Jr\.?|Sr\.?)$/i.test(word));
  const initials = words.length > 1
    ? [words[0], words.at(-1)!].map(word => Array.from(segmenter.segment(word.replace(/^[\p{P}]+/u, "")))[0]?.segment ?? "").join("")
    : Array.from(segmenter.segment(words[0] ?? "")).slice(0, /\p{Script=Han}/u.test(clean) ? 2 : 1).map(part => part.segment).join("");
  return initials.toUpperCase();
}

export function avatarLabel(name?: string, status?: KalosAvatarStatus) {
  return [name, status ? statusNames[status] : undefined].filter(Boolean).join("，");
}

export function avatarStyle(size: KalosAvatarSize, color?: string, style?: CSSProperties) {
  return { "--avatar-size": `${size}px`, ...(color ? { "--k-avatar-mark": color } : {}), ...style } as CSSProperties;
}

export function avatarCount(value: number | undefined, fallback: number) {
  return value !== undefined && Number.isFinite(value) ? Math.max(0, Math.floor(value)) : fallback;
}

export function AvatarGlyph({ name, kind, seed, working }: Pick<KalosAvatarProps, "name" | "kind" | "seed" | "working">) {
  if (kind === "agent") {
    const hash = avatarHash(seed ?? name ?? "agent");
    return <span className="kalos-avatar-mark" data-working={working || undefined} aria-hidden="true">
      {Array.from({ length: 9 }, (_, index) => <span key={index} data-lit={index === 4 || ((hash >>> (index % 5)) & 1) === 1 || undefined} style={{ animationDelay: `${(Math.floor(index / 3) + index % 3) * 100}ms` }} />)}
    </span>;
  }
  const initials = avatarInitials(name);
  if (initials) return <span dir="auto" aria-hidden="true">{initials}</span>;
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><circle cx="12" cy="8" r="3.5" /><path d="M5 21v-2a7 7 0 0 1 14 0v2" /></svg>;
}
