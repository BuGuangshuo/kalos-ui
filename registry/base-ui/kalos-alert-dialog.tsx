"use client";

import { useRef } from "react";
import { AlertDialog } from "@base-ui/react/alert-dialog";
import { Button } from "@/components/ui/kalos-base-button";
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
  const cancelRef = useRef<HTMLButtonElement>(null);
  return (
    <AlertDialog.Root open={open} onOpenChange={onOpenChange}>
      <AlertDialog.Trigger render={<Button variant="outline" className={`${controlStyles.button} ${controlStyles.buttonSurface}`} />}>{trigger}</AlertDialog.Trigger>
      <AlertDialog.Portal>
        <AlertDialog.Backdrop className={`${controlStyles.dialogOverlay} ${controlStyles.dialogBaseOverlay}`} />
        <AlertDialog.Popup initialFocus={cancelRef} data-slot="alert-dialog-content" className={`${controlStyles.font} ${controlStyles.dialogPopup} ${controlStyles.dialogSurface} ${controlStyles.alertDialogWidth} ${controlStyles.alertDialogLayout} ${controlStyles.dialogBaseMotion}`}>
          <div>
            <AlertDialog.Title className="text-base leading-none font-medium">{title}</AlertDialog.Title>
          </div>
          <div>
            <AlertDialog.Description className="text-[13px] leading-5 text-muted-foreground">{description}</AlertDialog.Description>
          </div>
          <div data-slot="dialog-footer" className={controlStyles.alertDialogActions}>
            <AlertDialog.Close ref={cancelRef} render={<Button variant="outline" className={`${controlStyles.button} ${controlStyles.buttonSurface}`} />}>{cancelLabel}</AlertDialog.Close>
            <AlertDialog.Close render={<Button variant="destructive" className={`${controlStyles.button} ${controlStyles.buttonDanger}`} />} onClick={onConfirm}>{actionLabel}</AlertDialog.Close>
          </div>
        </AlertDialog.Popup>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}
