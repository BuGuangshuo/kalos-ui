"use client";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
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
    <Dialog>
      <DialogTrigger asChild>
        <Button
          className="focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-transparent"
          variant="outline"
        >
          {trigger}
        </Button>
      </DialogTrigger>
      <DialogContent className="focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 [&_button:focus-visible]:outline-none [&_button:focus-visible]:ring-0">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description ? (
            <DialogDescription>{description}</DialogDescription>
          ) : null}
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}
