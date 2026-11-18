"use client";

import { createContext, useContext, useRef, type ComponentProps } from "react";
import { Drawer as DrawerPrimitive } from "@base-ui/react/drawer";
import { cn } from "cn";
import { drawerCss } from "@/components/ui/kalos-drawer-styles";
import { controlStyles } from "@/components/ui/kalos-styles";

const DrawerModalContext = createContext<DrawerPrimitive.Root.Props["modal"]>(true);

function Drawer({ modal = true, ...props }: DrawerPrimitive.Root.Props) {
  return <DrawerModalContext value={modal}><DrawerPrimitive.Root modal={modal} {...props} /></DrawerModalContext>;
}
const DrawerTrigger = DrawerPrimitive.Trigger;
const DrawerClose = DrawerPrimitive.Close;
const DrawerPortal = DrawerPrimitive.Portal;
const DrawerTitle = DrawerPrimitive.Title;
const DrawerDescription = DrawerPrimitive.Description;

function DrawerContent({ className, children, initialFocus, showSwipeHandle = true, ...props }: DrawerPrimitive.Popup.Props & { showSwipeHandle?: boolean }) {
  const popupRef = useRef<HTMLDivElement>(null);
  const modal = useContext(DrawerModalContext);
  return <DrawerPortal>
    <style href="kalos-drawer" precedence="default">{drawerCss}</style>
    {modal === true ? <DrawerPrimitive.Backdrop data-slot="drawer-overlay" className="kalos-drawer-overlay" /> : null}
    <DrawerPrimitive.Viewport data-slot="drawer-viewport" className="kalos-drawer-viewport">
      <DrawerPrimitive.Popup
        ref={popupRef}
        data-slot="drawer-popup"
        className={cn(controlStyles.font, "kalos-drawer-popup", className)}
        initialFocus={initialFocus ?? popupRef}
        {...props}
      >
        {showSwipeHandle ? <div data-slot="drawer-swipe-handle" className="kalos-drawer-swipe-handle" aria-hidden="true" /> : null}
        <DrawerPrimitive.Content data-slot="drawer-content" className="kalos-drawer-content">
          {children}
        </DrawerPrimitive.Content>
      </DrawerPrimitive.Popup>
    </DrawerPrimitive.Viewport>
  </DrawerPortal>;
}

function DrawerHeader({ className, ...props }: ComponentProps<"div">) {
  return <div data-slot="drawer-header" className={cn("kalos-drawer-header", className)} {...props} />;
}

function DrawerFooter({ className, ...props }: ComponentProps<"div">) {
  return <div data-slot="drawer-footer" className={cn("kalos-drawer-footer", className)} {...props} />;
}

export { Drawer, DrawerTrigger, DrawerClose, DrawerPortal, DrawerContent, DrawerHeader, DrawerFooter, DrawerTitle, DrawerDescription };
