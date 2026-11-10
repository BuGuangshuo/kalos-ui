"use client";
import { controlStyles } from "@/components/ui/kalos-styles";
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
    <Dialog>
      <DialogTrigger asChild>
        <Button
          className={`${controlStyles.button} ${controlStyles.buttonSurface}`}
          variant="outline"
        >
          {trigger}
        </Button>
      </DialogTrigger>
      <DialogContent
        {...(description ? {} : { "aria-describedby": undefined })}
        className={`${controlStyles.font} focus-visible:outline-none focus-visible:ring-0 [&_button:focus-visible]:outline-none [&_button:focus-visible]:ring-0`}
      >
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
