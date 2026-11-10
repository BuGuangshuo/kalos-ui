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
} from "@/components/ui/kalos-aria-dialog";
export function KalosDialog({
  trigger,
  title,
  description,
  children,
}: {
  trigger: string;
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <DialogTrigger>
      <Button
        className={`${controlStyles.button} ${controlStyles.buttonSurface}`}
        variant="outline"
      >
        {trigger}
      </Button>
      <Dialog>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description ? (
            <DialogDescription>{description}</DialogDescription>
          ) : null}
        </DialogHeader>
        {children}
      </Dialog>
    </DialogTrigger>
  );
}
