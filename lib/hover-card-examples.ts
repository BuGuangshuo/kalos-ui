import { hoverCardDemoCss } from "@/components/hover-card-demo-styles";

export function hoverCardActivityExample(source: string) {
  return source
    .replace('useState, type ComponentType,', 'useState,')
    .replace('import type { KalosHoverCardProps } from "@/components/ui/kalos-hover-card-shared";\n', '')
    .replace('import { hoverCardDemoCss } from "@/components/hover-card-demo-styles";', `import { KalosHoverCard } from "@/components/ui/kalos-hover-card";\n\nconst hoverCardDemoCss = ${JSON.stringify(hoverCardDemoCss)};`)
    .replace('export function HoverCardActivityDemo({ KalosHoverCard, compact = false }: { KalosHoverCard: ComponentType<KalosHoverCardProps>; compact?: boolean }) {', 'export default function Example() {\n  const compact = false;');
}
