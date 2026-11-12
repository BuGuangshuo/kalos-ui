"use client";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
export function InputGroup({ className, ...props }: ComponentProps<"div">) {
  return <div role="group" data-slot="input-group" className={cn("group/input-group flex w-full min-w-0 items-center", className)} {...props} />;
}
export function InputGroupInput({ className, ...props }: ComponentProps<"input">) {
  return <Input data-slot="input-group-control" className={cn("min-w-0 flex-1", className)} {...props} />;
}
export function InputGroupAddon({ className, ...props }: ComponentProps<"div"> & { align?: "inline-end" }) {
  return <div data-slot="input-group-addon" className={cn("flex shrink-0 items-center gap-0.5 pr-1", className)} {...props} />;
}
export function InputGroupButton({ type = "button", ...props }: ComponentProps<typeof Button>) {
  return <Button type={type} variant="ghost" size="icon" {...props} />;
}
