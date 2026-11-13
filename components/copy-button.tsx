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
  value: string;
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
          await navigator.clipboard.writeText(value);
          setCopied(true);
          if (timer.current) clearTimeout(timer.current);
          timer.current = setTimeout(() => setCopied(false), 1800);
        } catch {
          toast.error("复制失败，请手动选择并复制文本。");
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
