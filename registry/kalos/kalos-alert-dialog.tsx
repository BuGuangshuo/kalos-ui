"use client";

import { AlertDialog } from "radix-ui";
import { Button } from "@/components/ui/button";
import { controlStyles } from "@/components/ui/kalos-styles";

export function KalosAlertDialog({
  trigger,
  title,
  description,
  actionLabel = "确认",
  cancelLabel = "取消",
  onConfirm,
  open,
  onOpenChange,
}: {
  trigger: string;
  title: string;
  description: string;
  actionLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  return (
    <AlertDialog.Root open={open} onOpenChange={onOpenChange}>
      <AlertDialog.Trigger asChild>
        <Button variant="outline" className={`${controlStyles.button} ${controlStyles.buttonSurface}`}>{trigger}</Button>
      </AlertDialog.Trigger>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className={`${controlStyles.dialogOverlay} ${controlStyles.dialogRadixOverlay}`} />
        <AlertDialog.Content data-slot="alert-dialog-content" className={`${controlStyles.font} ${controlStyles.dialogPopup} ${controlStyles.dialogSurface} ${controlStyles.alertDialogWidth} ${controlStyles.alertDialogLayout} ${controlStyles.dialogRadixMotion}`}>
          <div>
            <AlertDialog.Title className="text-base leading-none font-medium">{title}</AlertDialog.Title>
          </div>
          <div>
            <AlertDialog.Description className="text-[13px] leading-5 text-muted-foreground">{description}</AlertDialog.Description>
          </div>
          <div data-slot="dialog-footer" className={controlStyles.alertDialogActions}>
            <AlertDialog.Cancel asChild>
              <Button variant="outline" className={`${controlStyles.button} ${controlStyles.buttonSurface}`}>{cancelLabel}</Button>
            </AlertDialog.Cancel>
            <AlertDialog.Action asChild>
              <Button variant="destructive" className={`${controlStyles.button} ${controlStyles.buttonDanger}`} onClick={onConfirm}>{actionLabel}</Button>
            </AlertDialog.Action>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}
