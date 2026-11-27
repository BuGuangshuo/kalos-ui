import { createElement, type ReactNode } from "react";

export type HugeIcon = readonly (readonly [string, Readonly<Record<string, string | number>>])[];

function isHugeIcon(icon: ReactNode | HugeIcon): icon is HugeIcon {
  return Array.isArray(icon) && icon.length > 0 && icon.every(part =>
    Array.isArray(part) && typeof part[0] === "string" && part[1] && typeof part[1] === "object");
}

export function KalosGlyph({ icon, strokeWidth }: { icon: ReactNode | HugeIcon; strokeWidth?: number }) {
  if (!isHugeIcon(icon)) return <>{icon}</>;
  return <svg viewBox="0 0 24 24" fill="none" focusable="false">
    {icon.map(([tag, { key, ...attrs }], index) => createElement(tag, {
      ...attrs,
      key: key ?? index,
      strokeWidth: attrs.strokeWidth !== undefined ? strokeWidth ?? attrs.strokeWidth : undefined,
    }))}
  </svg>;
}
