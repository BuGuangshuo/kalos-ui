"use client";

import { Fragment } from "react";
import { Menu } from "@base-ui/react/menu";
import { cn } from "@/lib/utils";
import { controlStyles } from "@/components/ui/kalos-styles";
import { DropdownItemContent, dropdownGroups, dropdownPanelClass, dropdownTriggerClass, useDropdownHighlight, type KalosDropdownMenuProps } from "@/components/ui/kalos-dropdown-menu-shared";

export type { KalosDropdownMenuItem, KalosDropdownMenuProps } from "@/components/ui/kalos-dropdown-menu-shared";

function Panel({ items, title, header, onAction, empty, width, contentClassName, "aria-label": label }: Pick<KalosDropdownMenuProps, "items" | "title" | "header" | "onAction" | "empty" | "width" | "contentClassName" | "aria-label">) {
  const highlight = useDropdownHighlight();
  return <Menu.Popup ref={highlight} style={{ width }} aria-label={label ?? title} className={cn(dropdownPanelClass(), controlStyles.popoverMotion, contentClassName)}>
    {header ? <div className={controlStyles.dropdownHeader}>{header}</div> : null}
    {title ? <div className={controlStyles.dropdownLabel}>{title}</div> : null}
    {!items.length ? <Menu.Item disabled className={controlStyles.dropdownEmpty}>{empty ?? "暂无操作"}</Menu.Item> : dropdownGroups(items).map(group => <Fragment key={group.items[0].value}>
      {group.divider ? <Menu.Separator className={controlStyles.dropdownSeparator} /> : null}
      <Menu.RadioGroup value={group.items.find(item => item.checked)?.value ?? ""}>
        {group.items.map(item => {
          const shared = { className: controlStyles.dropdownItem, disabled: item.disabled, label: item.label, "data-kalos-menu-item": "", "data-danger": item.danger || undefined };
          const content = <DropdownItemContent item={item} />;
          const select = () => { item.onSelect?.(); onAction?.(item.value); };
          // Base UI intentionally focuses disabled menu items. Keep unavailable
          // rows outside its item collection to match Kalos keyboard navigation.
          if (item.disabled) return <div key={item.value} role={group.type === "checkbox" ? "menuitemcheckbox" : group.type === "radio" ? "menuitemradio" : "menuitem"} aria-disabled="true" aria-checked={group.type === "action" ? undefined : Boolean(item.checked)} data-disabled="" data-kalos-menu-item="" data-danger={item.danger || undefined} className={controlStyles.dropdownItem}>{content}</div>;
          if (item.submenu) return <Menu.SubmenuRoot key={item.value}>
            <Menu.SubmenuTrigger {...shared}>{content}</Menu.SubmenuTrigger>
            <Menu.Portal><Menu.Positioner side="right" align="start" sideOffset={4} collisionPadding={16} className={controlStyles.dropdownPositioner}>
              <Panel items={item.submenu} aria-label={item.label} onAction={onAction} empty={empty} />
            </Menu.Positioner></Menu.Portal>
          </Menu.SubmenuRoot>;
          if (group.type === "checkbox") return <Menu.CheckboxItem key={item.value} {...shared} checked={Boolean(item.checked)} closeOnClick={!item.keepOpen} onClick={select}>{content}</Menu.CheckboxItem>;
          if (group.type === "radio") return <Menu.RadioItem key={item.value} {...shared} value={item.value} closeOnClick={!item.keepOpen} onClick={select}>{content}</Menu.RadioItem>;
          return <Menu.Item key={item.value} {...shared} closeOnClick={!item.keepOpen} onClick={select}>{content}</Menu.Item>;
        })}
      </Menu.RadioGroup>
    </Fragment>)}
  </Menu.Popup>;
}

export function KalosDropdownMenu({ trigger, triggerProps, align = "start", side = "bottom", disabled, open, defaultOpen, onOpenChange, ...props }: KalosDropdownMenuProps) {
  return <Menu.Root modal={false} open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
    <Menu.Trigger disabled={disabled} aria-label={triggerProps?.["aria-label"]} className={dropdownTriggerClass(triggerProps)}>{trigger}</Menu.Trigger>
    <Menu.Portal><Menu.Positioner side={side} align={align} sideOffset={8} collisionPadding={16} className={controlStyles.dropdownPositioner}><Panel {...props} /></Menu.Positioner></Menu.Portal>
  </Menu.Root>;
}
