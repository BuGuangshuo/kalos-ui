"use client";

import { useId } from "react";
import { DialogTrigger, ModalOverlay, Modal, Dialog, Heading } from "react-aria-components";
import { Button } from "@/components/ui/kalos-aria-button";
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
  const descriptionId = useId();
  return (
    <DialogTrigger isOpen={open} onOpenChange={onOpenChange}>
      <Button variant="outline" className={`${controlStyles.button} ${controlStyles.buttonSurface}`}>{trigger}</Button>
      <ModalOverlay isDismissable={false} className={`${controlStyles.dialogOverlay} ${controlStyles.dialogAriaOverlay}`}>
        <Modal data-slot="alert-dialog-content" className={`${controlStyles.font} ${controlStyles.dialogPopup} ${controlStyles.dialogSurface} ${controlStyles.alertDialogWidth} ${controlStyles.alertDialogLayout} ${controlStyles.dialogAriaMotion}`}>
          <Dialog role="alertdialog" aria-describedby={descriptionId} className={controlStyles.alertDialogContent}>
            <div>
              <Heading slot="title" className="text-base leading-none font-medium">{title}</Heading>
            </div>
            <div>
              <p id={descriptionId} className="text-[13px] leading-5 text-muted-foreground">{description}</p>
            </div>
            <div data-slot="dialog-footer" className={controlStyles.alertDialogActions}>
              <Button slot="close" autoFocus variant="outline" className={`${controlStyles.button} ${controlStyles.buttonSurface}`}>{cancelLabel}</Button>
              <Button slot="close" variant="destructive" className={`${controlStyles.button} ${controlStyles.buttonDanger}`} onPress={onConfirm}>{actionLabel}</Button>
            </div>
          </Dialog>
        </Modal>
      </ModalOverlay>
    </DialogTrigger>
  );
}
