"use client";
import { controlStyles } from "@/components/ui/kalos-styles";
import { useRef, type ReactNode } from "react";
import { Button } from "@/components/ui/kalos-base-button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/kalos-base-dialog";
export function KalosDialog({
  trigger,
  title,
  description,
  children,
  footer,
  open,
  onOpenChange,
}: {
  trigger: string;
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const contentRef = useRef<HTMLDivElement>(null);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger render={<Button variant="outline" />}>
        {trigger}
      </DialogTrigger>
      <DialogContent ref={contentRef} initialFocus={() => {
        const content = contentRef.current;
        return content?.contains(document.activeElement) ? document.activeElement as HTMLElement : content;
      }} className={`${controlStyles.font} ${controlStyles.dialogLayout} focus-visible:outline-none focus-visible:ring-0 [&_button:focus-visible]:outline-none [&_button:focus-visible]:ring-0`}>
        <DialogHeader className={controlStyles.dialogHeader}>
          <DialogTitle>{title}</DialogTitle>
          {description ? (
            <DialogDescription>{description}</DialogDescription>
          ) : null}
        </DialogHeader>
        <div className={controlStyles.dialogBody}>{children}</div>
        {footer ? <DialogFooter>{footer}</DialogFooter> : null}
      </DialogContent>
    </Dialog>
  );
}
