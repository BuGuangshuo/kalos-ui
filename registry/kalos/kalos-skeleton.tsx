import type { ComponentPropsWithRef } from "react";
import { cn } from "cn";
import { skeletonCss, skeletonDefaults } from "@/components/ui/kalos-loading-styles";

// Adapted from affectUI Skeleton (MIT). Full notice is in kalos-loading-styles.ts.
type Length = number | string;

export type KalosSkeletonProps = Omit<ComponentPropsWithRef<"span">, "children"> & {
  width?: Length;
  height?: Length;
  radius?: Length;
  line?: boolean | Length;
};

export function KalosSkeleton({ width = "100%", height = skeletonDefaults.height, radius, line = false, className, style, ...props }: KalosSkeletonProps) {
  const hasLine = line !== false;
  const shape = <span
    {...(!hasLine ? props : {})}
    data-slot="skeleton"
    className={cn("kalos-skeleton", !hasLine && className)}
    style={{ width, height, borderRadius: radius, ...(!hasLine ? style : undefined) }}
    aria-hidden="true"
  />;

  return <>
    <style href="kalos-skeleton" precedence="default">{skeletonCss}</style>
    {hasLine ? <span
      {...props}
      data-slot="skeleton-line"
      className={cn("kalos-skeleton-line", className)}
      style={{ height: typeof line === "boolean" ? "1lh" : line, ...style }}
      aria-hidden="true"
    >{shape}</span> : shape}
  </>;
}

export type KalosLoadingProps = Omit<ComponentPropsWithRef<"div">, "role"> & {
  label?: string;
};

export function KalosLoading({ label = "正在加载", className, children, ...props }: KalosLoadingProps) {
  return <div {...props} data-slot="loading" className={cn("kalos-loading", className)} role="status" aria-busy="true" aria-label={label}>
    <style href="kalos-skeleton" precedence="default">{skeletonCss}</style>
    {children}
  </div>;
}
