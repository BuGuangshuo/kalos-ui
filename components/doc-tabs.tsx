"use client";

import { createContext, useContext, type ComponentProps } from "react";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { controlStyles } from "@/components/ui/kalos-styles";
import {
  slidingHighlightClasses,
  useSlidingHighlight,
} from "@/components/ui/kalos-highlight";
import { cn } from "@/lib/utils";

const PreviewTabs = createContext(false);

export function DocTabsList({
  className,
  variant = "default",
  ...props
}: ComponentProps<typeof TabsList>) {
  const highlight = useSlidingHighlight(
    '[role="tab"]',
    '[role="tab"][aria-selected="true"]',
  );
  const preview = typeof className === "string" && className.split(" ").includes("detail-view-tabs");
  return (
    <PreviewTabs.Provider value={preview}>
      <TabsList
        {...props}
        variant={variant}
        ref={variant === "line" ? undefined : highlight}
        className={cn(
          variant !== "line" && [
            slidingHighlightClasses,
            controlStyles.tabsList,
          ],
          preview && controlStyles.previewTabsList,
          className,
        )}
      />
    </PreviewTabs.Provider>
  );
}

export function DocTabsTrigger({
  className,
  line = false,
  ...props
}: ComponentProps<typeof TabsTrigger> & { line?: boolean }) {
  const preview = useContext(PreviewTabs);
  return (
    <TabsTrigger
      {...props}
      className={cn(
        !line && controlStyles.tabsTrigger,
        preview && controlStyles.previewTabsTrigger,
        "[&_svg]:size-[13px]",
        className,
      )}
    />
  );
}
