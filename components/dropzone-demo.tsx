"use client";

import { KalosDropzone, type KalosDropzoneProps } from "@/registry/kalos/kalos-dropzone";

const fileTypes = [".pdf", ".png", ".jpg", ".xlsx", ".docx", ".mp4"];

export function DropzoneDemo({ compact, variant = "area" }: { compact?: boolean; variant?: KalosDropzoneProps["variant"] }) {
  return <KalosDropzone variant={variant} accept={fileTypes} autoplay={!compact && variant === "area"} />;
}
