"use client";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/pop-aria-button";
import {
  Dialog,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/pop-aria-dialog";
export function PopDialog({
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
        className="focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-transparent"
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
