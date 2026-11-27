"use client";
import { useEffect, useRef, useState } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
export function CopyButton({
  value,
  label = "复制",
  compact = false,
  ariaLabel,
  variant = "ghost",
  className,
}: {
  value: string | (() => Promise<string>);
  label?: string;
  compact?: boolean;
  ariaLabel?: string;
  variant?: "ghost" | "default";
  className?: string;
}) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );
  return (
    <Button
      variant={variant}
      className={className}
      size={compact ? "icon" : "sm"}
      aria-label={copied ? "已复制" : ariaLabel ?? label}
      onClick={async () => {
        try {
          if (typeof value === "string") {
            await navigator.clipboard.writeText(value);
          } else if (typeof ClipboardItem !== "undefined" && navigator.clipboard.write) {
            // WebKit requires the write to begin inside the original click.
            const content = value().then(text => new Blob([text], { type: "text/plain" }));
            await navigator.clipboard.write([new ClipboardItem({ "text/plain": content })]);
          } else {
            await navigator.clipboard.writeText(await value());
          }
          setCopied(true);
          if (timer.current) clearTimeout(timer.current);
          timer.current = setTimeout(() => setCopied(false), 1800);
        } catch {
          toast.error(typeof value === "string" ? "复制失败，请手动选择并复制文本。" : "源码复制失败，请重试。");
        }
      }}
    >
      {copied ? (
        <Check data-icon="inline-start" />
      ) : (
        <Copy data-icon="inline-start" />
      )}
      {compact ? null : copied ? "已复制" : label}
    </Button>
  );
}
