"use client";
import { controlStyles } from "@/components/ui/kalos-styles";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/kalos-aria-button";
import {
  Dialog,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/kalos-aria-dialog";
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
  return (
    <DialogTrigger isOpen={open} onOpenChange={onOpenChange}>
      <Button
        className={`${controlStyles.button} ${controlStyles.buttonSurface}`}
        variant="outline"
      >
        {trigger}
      </Button>
      <Dialog className={`${controlStyles.font} ${controlStyles.dialogLayout}`}>
        <DialogHeader className={controlStyles.dialogHeader}>
          <DialogTitle>{title}</DialogTitle>
          {description ? (
            <DialogDescription>{description}</DialogDescription>
          ) : null}
        </DialogHeader>
        <div className={controlStyles.dialogBody}>{children}</div>
        {footer ? <DialogFooter>{footer}</DialogFooter> : null}
      </Dialog>
    </DialogTrigger>
  );
}
