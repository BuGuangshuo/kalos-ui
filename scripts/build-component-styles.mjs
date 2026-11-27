import { readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
const inventory = JSON.parse(await readFile("design/component-tokens.json", "utf8"));
const css = (value) => value.replace(/\s+/g, "_");
const vars = (component, mapping) => ["light", "dark"].flatMap((mode) => Object.entries(mapping).map(([name, source]) => `${mode === "dark" ? "dark:" : ""}[--k-${name}:${css(inventory.components[component][mode][source])}]`)).join(" ");
const typography = inventory.font;
const family = typography.family.replaceAll('"', '').replace(/\s+/g, "_");
const font = `[font-family:${family}] text-[${typography.controlSize}px] leading-[${typography.controlLineHeight}px]`;
const avatar = inventory.defaults.avatar;
const avatarVars = vars("avatar", Object.fromEntries(Object.keys(inventory.components.avatar.light).map(key => [`avatar-${key}`, key])));
const avatarCss = await readFile("design/avatar.css", "utf8");
const focus = "outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0";
const state = "[&:is([data-checked],[data-selected],[data-state=checked],[data-state=indeterminate],[data-indeterminate])]";
const fieldVars = vars("text-field", Object.fromEntries(["ink", "surface", "shadow", "shadow-hover", "shadow-focus", "shadow-invalid", "shadow-invalid-focus", "ease", "danger-edge", "danger-edge-focus", "danger-surface", "subtle"].map(k => [k, `--ui-tfc-${k}`])));
const fieldFocusDuration = `var(--duration-focus,${inventory.defaults["text-field"].focusDuration}ms)`;
const fieldActive = "[&:is(:focus-within:not([data-focus-managed]),:has([aria-expanded=true]),[data-focused])]";
const fieldHover = "[&:hover:not(:focus-within:not([data-focus-managed])):not(:has([aria-expanded=true])):not([data-focused]):not([data-invalid=true]):not([data-disabled=true])]";
const fieldFocused = "[&:not([data-invalid=true]):is(:focus-within:not([data-focus-managed]),:has([aria-expanded=true]),[data-focused])]";
const fieldInvalidFocused = "[&[data-invalid=true]:is(:focus-within:not([data-focus-managed]),:has([aria-expanded=true]),[data-focused])]";
const fieldSurface = `${font} ${focus} ${fieldVars} h-8 rounded-[7px] border-0 bg-[var(--k-surface)]! px-2.5 py-0 text-[color:var(--k-ink)] [--k-control-shadow:var(--k-shadow)] shadow-[var(--k-control-shadow)] ring-0!`;
const fieldInvalid = "data-[invalid=true]:bg-[var(--k-danger-surface)]! data-[invalid=true]:[--k-control-shadow:var(--k-shadow-invalid)]";
const fieldDisabled = "data-[disabled=true]:opacity-40 has-disabled:opacity-40";
const field = `${fieldSurface} transition-[box-shadow,background-color] duration-[140ms] ease-[var(--k-ease)] ${fieldHover}:[--k-control-shadow:var(--k-shadow-hover)] ${fieldFocused}:[--k-control-shadow:var(--k-shadow-focus)] ${fieldActive}:duration-[${fieldFocusDuration}] ${fieldInvalid} ${fieldInvalidFocused}:[--k-control-shadow:var(--k-shadow-invalid-focus)] ${fieldDisabled}`;

const buttonVars = vars("button", Object.fromEntries(["ink", "solid", "solid-hover", "on-solid", "surface", "shadow", "shadow-hover", "wash", "ease", "danger", "danger-hover", "on-danger"].map(k => [k, `--ui-btnc-${k}`])));
const menuVars = vars("select", Object.fromEntries(["ink", "menu", "glow", "shadow-menu", "ease"].map(k => [k, `--ui-selc-${k}`])));
const selectTextVars = vars("select", { "select-description": "--ui-selc-subtle", "select-disabled": "--ui-selc-faint" });
const select = inventory.defaults.select;
const dropdown = inventory.defaults["dropdown-menu"];
const dropdownVars = vars("dropdown-menu", { "dropdown-danger": "danger", "dropdown-danger-highlight": "danger-highlight", "dropdown-muted": "muted", "dropdown-focus": "focus" });
const switchVars = vars("switch", Object.fromEntries(["off", "off-hover", "on", "on-hover", "thumb", "thumb-shadow", "ease"].map(k => [k, `--ui-swc-${k}`])));
const checkVars = vars("checkbox", Object.fromEntries(["surface", "edge", "edge-hover", "fill", "on-fill", "ease"].map(k => [k, `--ui-chkc-${k}`])));
const tabVars = vars("segmented-control", Object.fromEntries(["ink", "text", "track", "card", "card-shadow", "ease"].map(k => [k, `--ui-segc-${k}`])));
const segmentVars = vars("segmented-control", Object.fromEntries(["ink", "text", "hover-text", "line", "wash", "fill", "track", "card", "card-shadow", "accent", "accent-soft", "focus", "ease"].map(k => [k, `--ui-segc-${k}`])));
const segment = inventory.defaults["segmented-control"];
const previewTabs = inventory.defaults["preview-tabs"];
const toolbar = inventory.defaults["preview-toolbar"];
const segmentedControlCss = (await readFile("design/segmented-control.css", "utf8"))
  .replace("--segment-height: 28px", `--segment-height: ${segment.sizes.md}px`)
  .replace("--segment-height: 24px", `--segment-height: ${segment.sizes.sm}px`)
  .replace("--segment-height: 32px", `--segment-height: ${segment.sizes.lg}px`)
  .replace("--segment-gap: 8px", `--segment-gap: ${segment.gap}px`)
  .replace("--segment-padding-x: 10px", `--segment-padding-x: ${segment.paddingX}px`);
const command = inventory.defaults["command-menu"];
const commandVars = vars("command-menu", Object.fromEntries(["ink", "surface", "highlight", "muted", "edge", "shadow", "ease"].map(k => [`command-${k}`, k])));
const commandBrandVars = vars("command-menu", { "command-brand-ink": "brand-ink", "command-brand-surface": "brand-surface", "command-brand-shadow": "brand-shadow" });
const commandBrandIcon = command.brandIcon;
const commandMenuDemoStyles = {
  menu: `[&_[data-slot=command-icon]]:mt-0 [&_[data-slot=command-icon]]:size-[${commandBrandIcon.containerSize}px]`,
  brandIcon: `${commandBrandVars} grid size-[${commandBrandIcon.containerSize}px] shrink-0 place-items-center rounded-[${commandBrandIcon.radius}px] bg-[var(--k-command-brand-surface)] text-[color:var(--k-command-brand-ink)] shadow-[var(--k-command-brand-shadow)] [&>:is(img,svg)]:size-[${commandBrandIcon.size}px] [&>img]:object-contain`,
  iconSize: commandBrandIcon.size,
};
const dialog = inventory.defaults.dialog;
const alertDialog = inventory.defaults["alert-dialog"];
const dialogVars = `${vars("dialog", { "dialog-edge": "edge" })} ${vars(dialog.tokensFrom, { "dialog-shadow": "--ui-selc-shadow-menu" })}`;
const dialogMotion = `will-change-[${css(dialog.rasterLayer)}] duration-[${dialog.duration}ms] ease-[${css(dialog.ease)}] [animation-duration:${dialog.duration}ms] [animation-timing-function:${css(dialog.ease)}]`;
const dialogOverlayMotion = `duration-[${dialog.duration}ms] ease-[${css(dialog.overlayEase)}] [animation-duration:${dialog.duration}ms] [animation-timing-function:${css(dialog.overlayEase)}]`;
const popover = inventory.defaults.popover;
const popoverEase = `var(--k-ease,${css(inventory.components[popover.tokensFrom].light["--ui-selc-ease"])})`;
const popoverMotion = `will-change-[${css(popover.rasterLayer)}] duration-[${popover.duration}ms] ease-[${popoverEase}] [animation-duration:${popover.duration}ms] [animation-timing-function:${popoverEase}]`;
const hoverCard = inventory.defaults["hover-card"];
const hoverCardMotion = `duration-[${hoverCard.duration}ms] ease-[${popoverEase}] [animation-duration:${hoverCard.duration}ms] [animation-timing-function:${popoverEase}]`;
const hoverCardDemo = inventory.defaults["hover-card-demo"];
const hoverCardDemoCss = [
  `.kalos-hover-demo,.kalos-hover-demo-popup{${Object.entries(inventory.components["hover-card-demo"].light).map(([key, value]) => `--hvc-${key}:${value}`).join(";")};--hvc-mark-duration:${hoverCardDemo.markDuration}ms;--hvc-card-width:${hoverCardDemo.cardWidth}px}`,
  `:where(.dark,[data-theme=dark]) :is(.kalos-hover-demo,.kalos-hover-demo-popup){${Object.entries(inventory.components["hover-card-demo"].dark).map(([key, value]) => `--hvc-${key}:${value}`).join(";")}}`,
  await readFile("design/hover-card-demo.css", "utf8"),
].join("\n");
const form = inventory.defaults.form;
const fieldMessageMotion = inventory.defaults["field-message"];
const cardVars = vars("text-field", { "card-surface": "--ui-tfc-surface", "card-ink": "--ui-tfc-ink", "card-shadow": "--ui-tfc-shadow" });
const cardSurface = `${cardVars} rounded-[12px] border-0 bg-[var(--k-card-surface)] text-[color:var(--k-card-ink)] shadow-[var(--k-card-shadow)] ring-0`;
const card = inventory.defaults.card;
const cardTokens = vars("card", Object.fromEntries(Object.keys(inventory.components.card.light).map(key => [`card-${key}`, key])));
const cardTarget = "[&[data-interactive]_[data-slot=card-title]_:is(a,button)]";
const cardTargetAfter = `${cardTarget}:after`;
const validationVars = vars("text-field", { "validation-edge": "--ui-tfc-danger-edge" });
const validation = `${validationVars} aria-invalid:ring-0 data-invalid:ring-0 aria-invalid:shadow-[0_0_0_1px_var(--k-validation-edge)] data-invalid:shadow-[0_0_0_1px_var(--k-validation-edge)]`;
const action = `inline-flex size-6 shrink-0 items-center justify-center rounded-full border-0 bg-transparent! p-0! text-muted-foreground shadow-none transition-[background-color,box-shadow,color,opacity] duration-150 hover:bg-transparent! hover:shadow-none hover:text-foreground focus-visible:outline-1 focus-visible:outline-offset-0 focus-visible:outline-ring focus-visible:ring-0 disabled:opacity-40 [&_svg]:size-3.5`;
const textArea = inventory.defaults["text-area"];
const numberInput = inventory.defaults["number-input"];
const table = inventory.defaults.table;
const tableVars = vars("table", Object.fromEntries(Object.keys(inventory.components.table.light).map(key => [`table-${key}`, key])));
const tooltip = inventory.defaults.tooltip;
const tooltipVars = vars("tooltip", Object.fromEntries(Object.keys(inventory.components.tooltip.light).map(key => [`tooltip-${key}`, key])));
const skeleton = inventory.defaults.skeleton;
const spinner = inventory.defaults.spinner;
const loadingDemo = inventory.defaults["loading-demo"];
const skeletonCss = [
  `.kalos-skeleton,.kalos-loading{${Object.entries(inventory.components.skeleton.light).map(([key, value]) => `--kalos-skeleton-${key}:${value}`).join(";")};--kalos-skeleton-radius:${skeleton.radius}px;--kalos-skeleton-duration:${skeleton.duration}ms;--kalos-skeleton-ease:${skeleton.ease};--kalos-skeleton-delay:${skeleton.delay}ms;--kalos-skeleton-fade-duration:${skeleton.fadeDuration}ms}`,
  `:where(.dark,[data-theme=dark]) :is(.kalos-skeleton,.kalos-loading){${Object.entries(inventory.components.skeleton.dark).map(([key, value]) => `--kalos-skeleton-${key}:${value}`).join(";")}}`,
  await readFile("design/skeleton.css", "utf8"),
].join("\n");
const spinnerCss = `.kalos-spinner{--kalos-spinner-duration:${spinner.duration}ms}\n${await readFile("design/spinner.css", "utf8")}`;
const styles = {
  loadingDemo: `${font} ${vars("loading-demo", Object.fromEntries(Object.keys(inventory.components["loading-demo"].light).map(key => [`loading-demo-${key}`, key])))} [--loading-demo-skeleton-width:${loadingDemo.skeletonWidth}px] [--loading-demo-spinner-width:${loadingDemo.spinnerWidth}px] [--loading-demo-header-height:${loadingDemo.headerHeight}px] [--loading-demo-skeleton-row-height:${loadingDemo.skeletonRowHeight}px] [--loading-demo-spinner-row-height:${loadingDemo.spinnerRowHeight}px] [--loading-demo-check-duration:${loadingDemo.checkDuration}ms] [--loading-demo-action-height:${loadingDemo.actionHeight}px] [--loading-demo-action-padding:${loadingDemo.actionPadding}px] [--loading-demo-action-icon-size:${loadingDemo.actionIconSize}px]`,
  tooltipPositioner: `z-[${tooltip.layer}]`,
  tooltip: `${font} ${tooltipVars} flex w-max max-w-[min(${tooltip.maxWidth}px,calc(100vw-16px))] items-baseline gap-[${tooltip.gap}px] rounded-[${tooltip.radius}px] border-0 bg-[var(--k-tooltip-surface)] px-[${tooltip.paddingX}px] py-[${tooltip.paddingY}px] text-[${tooltip.fontSize}px] font-normal leading-[${tooltip.lineHeight}px] text-[color:var(--k-tooltip-ink)] shadow-[var(--k-tooltip-shadow)] backdrop-blur-[8px] outline-none transition-[opacity,translate] duration-[${tooltip.duration}ms] ease-[var(--k-tooltip-ease)] data-starting-style:opacity-0 data-ending-style:opacity-0 data-[side=top]:data-starting-style:translate-y-[${tooltip.shift}px] data-[side=bottom]:data-starting-style:-translate-y-[${tooltip.shift}px] data-[side=left]:data-starting-style:translate-x-[${tooltip.shift}px] data-[side=right]:data-starting-style:-translate-x-[${tooltip.shift}px] data-instant:transition-none`,
  tooltipShortcut: "shrink-0 whitespace-nowrap font-[inherit] tracking-[0.02em] text-[color:var(--k-tooltip-muted)]",
  previewToolbarTooltip: `${font} rounded-[${toolbar.tooltipRadius}px] bg-foreground px-2 py-1 text-[12px] leading-4 text-background shadow-sm transition-[opacity,translate] duration-[${toolbar.duration}ms] data-starting-style:translate-y-1 data-starting-style:opacity-0 data-ending-style:opacity-0`,
  previewToolbar: `${font} ${vars("preview-toolbar", { "toolbar-claude": "claude" })} ${buttonVars} [--k-toolbar-size:${toolbar.buttonSize}px] [--k-toolbar-icon:${toolbar.iconSize}px] [--k-toolbar-theme-size:${toolbar.themeButtonSize}px] [--k-toolbar-radius:${toolbar.radius}px] [--k-toolbar-separator:${toolbar.separatorHeight}px]`,
  avatar: `${font} ${avatarVars} [--k-avatar-image-duration:${avatar.imageDuration}ms] [--k-avatar-working-duration:${avatar.workingDuration}ms]`,
  table: `${font} ${tableVars} w-full min-w-0 max-w-[${table.maxWidth}px] overflow-hidden rounded-[${table.radius}px] bg-[var(--k-table-surface)] text-[color:var(--k-table-ink)] shadow-[var(--k-table-shadow)]`,
  tableBordered: "[&_th:not(:last-child)]:border-r [&_td:not(:last-child)]:border-r [&_th]:border-[var(--k-table-edge)] [&_td]:border-[var(--k-table-edge)]",
  tableText: "block min-w-0 max-w-full truncate",
  tableTitle: `flex min-h-[${table.titleHeight}px] items-center justify-between gap-3 border-b border-[var(--k-table-edge)] px-4 py-2 [&_svg]:size-4`,
  tableHeading: "flex min-w-0 items-center gap-2 font-medium text-[14px] [&>svg]:shrink-0 [&>svg]:text-[var(--k-table-brand)]",
  tableHeader: "w-full overflow-x-auto overscroll-x-contain [scrollbar-width:none]",
  tableScroll: "w-full overflow-auto overscroll-x-contain",
  tableGrid: "w-full table-fixed border-collapse text-left text-[13px] leading-5 outline-none",
  tableHead: `h-[${table.headHeight}px] border-b border-[var(--k-table-edge)] px-[${table.cellPadding}px] text-left text-[12px] font-normal text-[color:var(--k-table-muted)] outline-none`,
  tableSort: "flex h-full w-full min-w-0 items-center gap-2 bg-transparent text-inherit outline-none focus-visible:rounded-sm focus-visible:outline-1 focus-visible:outline-[var(--k-table-focus)] [&>svg]:size-3 [&>svg]:shrink-0",
  tableSortArrow: "ml-auto text-[color:var(--k-table-brand)] transition-transform duration-180 data-[descending=true]:rotate-180",
  tableRow: "relative border-b border-[var(--k-table-edge)] transition-colors duration-150 last:border-b-0 hover:bg-[var(--k-table-hover)] data-[selected=true]:bg-[var(--k-table-selected)] data-[dragging=true]:z-10 data-[dragging=true]:bg-[var(--k-table-surface)] data-[dragging=true]:opacity-80 data-[dragging=true]:shadow-[var(--k-table-shadow)] data-[drop-position=before]:shadow-[inset_0_2px_var(--k-table-focus)] data-[drop-position=after]:shadow-[inset_0_-2px_var(--k-table-focus)]",
  tableCell: `relative h-[${table.rowHeight}px] p-0 text-[color:var(--k-table-muted)] outline-none data-[range=true]:bg-[var(--k-table-selected)]`,
  tableCellContent: `relative flex h-full min-h-[${table.rowHeight}px] min-w-0 items-center gap-2 px-[${table.cellPadding}px] outline-none after:pointer-events-none after:absolute after:inset-px after:rounded-[4px] after:content-[''] data-[active=true]:after:shadow-[inset_0_0_0_1.5px_var(--k-table-focus)] data-[editing=true]:bg-[var(--k-table-surface)] data-[editing=true]:px-0 data-[tag=true]:px-0 [&>svg]:size-4 [&>svg]:shrink-0`,
  tableTitleCell: "font-normal text-[color:var(--k-table-ink)]",
  tableNumber: "tabular-nums",
  tableActions: `flex h-full w-full min-w-0 items-center justify-start whitespace-nowrap px-[${table.cellPadding}px] [&>div]:gap-[${table.actionGap}px] [&_button]:h-5 [&_button]:w-[${table.actionIconSize}px] [&_button]:rounded-none [&_button]:bg-transparent! [&_button]:p-0! [&_button]:text-[color:var(--k-table-muted)]! [&_button]:shadow-none! [&_button]:transition-colors [&_button:hover]:text-[color:var(--k-table-ink)]! [&_button:active]:scale-100 [&_button_svg]:size-[${table.actionIconSize}px]!`,
  tableCheckCell: "w-10 px-3.5",
  tableCheck: "flex items-center justify-center [&>[data-slot=checkbox]]:after:hidden",
  tableEditor: "h-[39px] w-full min-w-0 rounded-none border-0 bg-transparent px-3 text-[13px] leading-5 text-[color:var(--k-table-ink)] shadow-none outline-none focus:shadow-none focus:ring-0",
  tableTagTrigger: "h-10! w-full! justify-start! rounded-none! border-0! bg-transparent! px-3.5! py-0! text-left shadow-none! outline-none! ring-0! [&>svg]:hidden",
  tableFilterTrigger: "size-5! shrink-0 justify-center! rounded-[4px]! border-0! bg-transparent! p-0! text-[color:var(--k-table-muted)]! shadow-none! ring-0! hover:text-[color:var(--k-table-ink)]! data-[filtered=true]:text-[color:var(--k-table-brand)]! [&>svg]:size-3! [&>svg:last-child]:hidden",
  tableFilterMenu: "w-40 min-w-0!",
  tableDragHandle: "mx-auto flex h-8 w-7 touch-none items-center justify-center rounded-[4px] bg-transparent text-[color:var(--k-table-muted)] outline-none hover:text-[color:var(--k-table-ink)] focus-visible:outline-1 focus-visible:outline-[var(--k-table-focus)] aria-pressed:text-[color:var(--k-table-brand)] cursor-grab active:cursor-grabbing [&>svg]:size-3.5",
  tableDropIndicator: "h-0 outline-none data-[drop-target]:outline-2 data-[drop-target]:outline-[var(--k-table-focus)]",
  tableTagMenu: `${tableVars} w-[var(--anchor-width)] min-w-0! [&_[role=option]]:text-[13px] [&_[role=option]_svg]:text-[var(--k-table-focus)]!`,
  tableTag: "inline-flex min-w-0 max-w-full items-center rounded-[4px] px-1.5 text-[12px] leading-5",
  tableTagViolet: "bg-[var(--k-table-violet-wash)] text-[color:var(--k-table-violet-ink)]!",
  tableTagPink: "bg-[var(--k-table-pink-wash)] text-[color:var(--k-table-pink-ink)]!",
  tableTagBlue: "bg-[var(--k-table-blue-wash)] text-[color:var(--k-table-blue-ink)]!",
  tableTagGreen: "bg-[var(--k-table-green-wash)] text-[color:var(--k-table-green-ink)]!",
  tableTagAmber: "bg-[var(--k-table-amber-wash)] text-[color:var(--k-table-amber-ink)]!",
  tableTagGray: "bg-[var(--k-table-gray-wash)] text-[color:var(--k-table-gray-ink)]!",
  tableLink: "block min-w-0 max-w-full truncate underline! decoration-current/30 underline-offset-3 hover:text-[color:var(--k-table-ink)] focus-visible:outline-1 focus-visible:outline-[var(--k-table-focus)]",
  tableToolbarButton: "inline-flex size-7 shrink-0 items-center justify-center rounded-[6px] bg-transparent text-[color:var(--k-table-muted)] transition-colors duration-150 hover:bg-[var(--k-table-hover)] hover:text-[color:var(--k-table-ink)] focus-visible:outline-1 focus-visible:outline-[var(--k-table-focus)] disabled:pointer-events-none disabled:opacity-30 [&>svg]:size-3.5",
  tableFooter: `flex min-h-[${table.footerHeight}px] items-center justify-between gap-3 border-t border-[var(--k-table-edge)] px-[${table.cellPadding}px] py-1.5 text-[12px] text-[color:var(--k-table-muted)]`,
  tablePagination: `border-t border-[var(--k-table-edge)] p-[${table.cellPadding}px]`,
  tableAdd: "inline-flex h-7 items-center gap-2 rounded-[6px] px-1 text-[13px] transition-colors duration-150 hover:bg-[var(--k-table-hover)] hover:text-[color:var(--k-table-ink)] focus-visible:outline-1 focus-visible:outline-[var(--k-table-focus)] [&>svg]:size-3",
  tableSummary: "border-t border-[var(--k-table-edge)] bg-[var(--k-table-hover)] text-[color:var(--k-table-ink)] [&_td]:px-3.5 [&_td]:py-3 [&_td]:text-[13px] [&_td]:font-medium",
  tableEmpty: "h-24 px-4 text-center text-[color:var(--k-table-muted)]",
  form: `${font} flex w-full min-w-0 max-w-[${form.maxWidth}px] flex-col`,
  card: `${font} ${cardTokens} relative isolate flex w-full min-w-0 flex-col gap-[${card.gap}px] rounded-[${card.radius}px] border-0 bg-[var(--k-card-surface)] p-[${card.padding}px] text-start text-[color:var(--k-card-ink)] shadow-[var(--k-card-shadow)] transition-[box-shadow,background-color] duration-[${card.duration}ms] ease-[var(--k-card-ease)] data-interactive:cursor-pointer data-interactive:hover:shadow-[var(--k-card-shadow-hover)] data-selected:bg-[var(--k-card-selected)] data-selected:shadow-[var(--k-card-shadow-selected)] data-selected:hover:shadow-[var(--k-card-shadow-selected)] ${cardTarget}:m-0 ${cardTarget}:border-0 ${cardTarget}:bg-transparent ${cardTarget}:p-0 ${cardTarget}:text-start ${cardTarget}:[font:inherit] ${cardTarget}:text-inherit ${cardTarget}:no-underline ${cardTarget}:cursor-pointer ${cardTarget}:outline-none ${cardTargetAfter}:absolute ${cardTargetAfter}:inset-0 ${cardTargetAfter}:z-0 ${cardTargetAfter}:rounded-[${card.radius}px] ${cardTargetAfter}:content-[''] ${cardTarget}:focus-visible:after:outline-2 ${cardTarget}:focus-visible:after:outline-offset-2 ${cardTarget}:focus-visible:after:outline-[var(--k-card-focus)] [&[data-interactive]_:is(a,button,input,select,textarea,label,summary,[tabindex]):not([data-slot=card-title]_*)]:relative [&[data-interactive]_:is(a,button,input,select,textarea,label,summary,[tabindex]):not([data-slot=card-title]_*)]:z-10 [@media(hover:none)]:data-interactive:hover:not-data-selected:shadow-[var(--k-card-shadow)] forced-colors:border forced-colors:border-[CanvasText] forced-colors:data-selected:border-[Highlight]`,
  cardHeader: "flex! min-w-0 items-start gap-3! rounded-none! p-0!",
  cardIcon: "flex min-h-5 min-w-5 shrink-0 items-center justify-center text-[color:var(--k-card-muted)] [&>svg]:size-4",
  cardTitles: "grid min-w-0 flex-1 gap-0.5",
  cardTitle: "m-0! text-[13px]! leading-5! font-medium! wrap-anywhere",
  cardDescription: "m-0 text-[13px] leading-5 text-[color:var(--k-card-muted)] wrap-anywhere",
  cardAction: "flex h-5 shrink-0 items-center gap-1",
  cardContent: "min-w-0 p-0! wrap-anywhere",
  cardFooter: `flex min-h-[${card.footerHeight}px] min-w-0 flex-wrap items-center gap-2 rounded-none! border-0! bg-transparent! p-0! text-[12px] leading-4 text-[color:var(--k-card-muted)]`,
  formCard: `${cardSurface} w-full min-w-0 gap-0 py-0`,
  numberValue: `flex h-full min-w-0 flex-1 items-center overflow-hidden pl-[${numberInput.valuePadding}px]`,
  numberInput: `${font} h-full w-auto min-w-[1ch] max-w-full flex-[0_1_auto] truncate border-0 bg-transparent! p-0 text-[color:var(--k-ink)] tabular-nums shadow-none outline-none ring-0 [field-sizing:content] focus-visible:shadow-none focus-visible:outline-none focus-visible:ring-0 aria-invalid:ring-0 disabled:opacity-100 placeholder:text-[color:var(--k-subtle)]`,
  numberAffix: "shrink-0 text-[color:var(--k-subtle)] [&>svg]:size-3.5",
  numberActions: `flex h-full shrink-0 items-center gap-[${numberInput.actionGap}px] px-1`,
  numberAction: `${buttonVars} inline-flex size-[${numberInput.actionSize}px] shrink-0 touch-none select-none items-center justify-center rounded-[${numberInput.actionRadius}px] border-0 bg-transparent! p-0! text-[color:var(--k-subtle)] shadow-none! outline-none transition-colors duration-150 hover:bg-[var(--k-wash)]! hover:text-[color:var(--k-ink)] focus-visible:outline-1 focus-visible:outline-ring aria-disabled:opacity-30 data-disabled:opacity-30 disabled:opacity-30 [&_svg]:size-3.5`,
  textAreaField: "min-w-0 gap-1.5",
  textAreaSurface: `${field.replace("h-8", "h-auto").replace("px-2.5 py-0", "p-0")} relative w-full min-w-0`,
  textAreaInput: `${font} box-border resize-none rounded-[${textArea.radius}px] border-0 bg-transparent px-[${textArea.paddingX}px] py-[${textArea.paddingY}px] text-[color:var(--k-ink)] shadow-none placeholder:text-[color:var(--k-subtle)] disabled:cursor-not-allowed`,
  textAreaWithResize: "pb-5",
  textAreaResize: `absolute right-0 bottom-0 inline-flex size-[${textArea.resizeSize}px] touch-none select-none items-center justify-center rounded-br-[${textArea.radius}px] border-0 bg-transparent p-0 text-[color:var(--k-subtle)] outline-none hover:text-[color:var(--k-ink)] focus-visible:outline-1 focus-visible:outline-ring cursor-ns-resize [&_svg]:size-3`,
  textAreaMeta: "flex min-w-0 items-start justify-between gap-3",
  textAreaCount: "ml-auto shrink-0 text-xs leading-[18px] tabular-nums text-muted-foreground",
  textAreaOptional: "text-xs font-normal text-muted-foreground",
  textAreaDemo: `${cardSurface} flex w-full max-w-[${textArea.previewWidth}px] flex-col gap-5 p-5`,
  inputGroup: `${field} flex w-full min-w-0 px-0`,
  inputContent: `${font} h-full min-w-0 flex-1 rounded-[7px] border-0 bg-transparent! px-2.5 py-0 text-[color:var(--k-ink)] shadow-none outline-none ring-0 focus-visible:shadow-none focus-visible:outline-none focus-visible:ring-0 aria-invalid:ring-0 disabled:bg-transparent disabled:opacity-100 placeholder:text-[color:var(--k-subtle)]`,
  inputClear: "[&_svg]:size-3! pointer-events-none opacity-0 transition-opacity duration-150 group-hover/input-group:pointer-events-auto group-hover/input-group:opacity-100 group-focus-within/input-group:pointer-events-auto group-focus-within/input-group:opacity-100 focus-visible:pointer-events-auto focus-visible:opacity-100",
  inputAddon: "flex h-full shrink-0 items-center gap-0.5 pr-2",
  inputAction: action,
  selectClearable: "[&>[data-slot=select-icon]>svg]:transition-opacity [&>[data-slot=select-icon]>svg]:duration-150 not-data-popup-open:[&>[data-slot=select-icon]>svg]:group-has-[[data-slot=select-clear]:hover]/select-control:opacity-0 not-data-popup-open:[&>[data-slot=select-icon]>svg]:group-has-[:focus-visible]/select-control:opacity-0",
  selectClear: `${action} [&_svg]:size-3! absolute inset-y-0 right-1 my-auto opacity-0 hover:opacity-100 group-has-[:focus-visible]/select-control:opacity-100 focus-visible:opacity-100 group-has-[[data-popup-open]]/select-control:invisible`,
  formHeader: `px-[${form.padding}px] pt-[${form.padding}px] pb-0`,
  formTitle: "text-[14px] font-medium leading-5",
  formContent: `min-w-0 p-[${form.padding}px]`,
  formFooter: `flex flex-col items-stretch gap-3 border-t border-border bg-transparent p-[${form.footerPadding}px]`,
  formFields: `gap-[${form.gap}px]`,
  formActions: `flex flex-wrap justify-end gap-[${form.buttonGap}px]`,
  formError: "text-xs leading-[18px] text-destructive",
  formStatus: "text-xs leading-[18px] text-muted-foreground",
  font,
  alertDialogWidth: `w-[${alertDialog.maxWidth}px]!`,
  alertDialogLayout: `gap-[${alertDialog.contentGap}px] p-[${alertDialog.contentPadding}px]`,
  alertDialogContent: `grid gap-[${alertDialog.contentGap}px] outline-none`,
  alertDialogActions: `flex flex-col-reverse gap-[${alertDialog.buttonGap}px] sm:flex-row sm:justify-end`,
  dialogPopup: "fixed top-1/2 left-1/2 z-50 grid w-full max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 rounded-xl bg-popover text-popover-foreground outline-none",
  dialogOverlay: "fixed inset-0 isolate z-50 bg-black/10 supports-backdrop-filter:backdrop-blur-xs",
  dialogFooter: `flex flex-col-reverse gap-[${dialog.footerGap}px] border-0 px-[${dialog.footerPaddingX}px] pt-[${dialog.footerPaddingTop}px] pb-[${dialog.footerPaddingBottom}px] sm:flex-row sm:justify-end`,
  dialogLayout: `gap-[${dialog.contentGap}px]! p-[${dialog.contentPadding}px]!`,
  dialogHeader: `gap-[${dialog.headerGap}px]! pt-[${dialog.headerPaddingTop}px] pr-[${dialog.headerPaddingRight}px] pb-[${dialog.headerPaddingBottom}px] pl-[${dialog.sectionPaddingX}px] [&_[data-slot=dialog-title]]:pr-[${dialog.headerCloseSpace}px] [&_[data-slot=dialog-description]]:pr-[${dialog.headerCloseSpace}px] [&_[data-slot=dialog-title]]:text-[${dialog.titleFontSize}px] [&_[data-slot=dialog-title]]:leading-[${dialog.titleLineHeight}px]`,
  dialogBody: `min-w-0 px-[${dialog.sectionPaddingX}px] pt-[${dialog.bodyPaddingTop}px] pb-[${dialog.sectionPaddingY}px]`,
  dialogForm: `gap-[${dialog.formGap}px]`,
  dialogWidth: `sm:max-w-[${dialog.maxWidth}px]`,
  dialogSurface: `${dialogVars} border-[${dialog.borderWidth}px] border-[var(--k-dialog-edge)] shadow-[var(--k-dialog-shadow)] ring-0`,
  dialogMotion: `${dialogMotion} transition-[opacity,scale] data-starting-style:scale-${dialog.scale * 100} data-starting-style:opacity-0 data-ending-style:scale-${dialog.scale * 100} data-ending-style:opacity-0`,
  dialogOverlayMotion: `${dialogOverlayMotion} transition-opacity data-starting-style:opacity-0 data-ending-style:opacity-0`,
  label: `${font} gap-1 font-normal`,
  requiredMark: "ml-0.5 text-destructive",
  field,
  selectControl: `${field} relative w-full min-w-0 px-0 data-[size=sm]:h-[${select.smallHeight}px] data-[size=md]:h-[${select.height}px] data-[size=lg]:h-[${select.largeHeight}px]`,
  selectControlStatic: `${fieldSurface} ${fieldInvalid} ${fieldDisabled} relative w-full min-w-0 px-0`,
  selectTrigger: `${font} ${focus} h-full w-full min-w-0 gap-2 rounded-[${select.radius}px] border-0 bg-transparent! pl-[${select.paddingLeft}px] pr-[${select.paddingRight}px] py-0 text-[color:var(--k-ink)] shadow-none ring-0! focus-visible:shadow-none focus-visible:ring-0 aria-invalid:ring-0 aria-invalid:shadow-none disabled:opacity-100 data-placeholder:text-[color:var(--k-subtle)] [&_[data-placeholder]]:text-[color:var(--k-subtle)]`,
  selectPlaceholder: "text-[color:var(--k-subtle)] data-placeholder:text-[color:var(--k-subtle)]",
  selectOptionIcon: `grid size-[${select.iconSize}px] shrink-0 place-items-center text-muted-foreground group-data-disabled/select-option:text-[color:var(--k-select-disabled)] [&>svg]:size-[${select.optionIconSize}px]! [&>img]:size-[${select.optionIconSize}px]`,
  selectOptionLabel: "truncate group-aria-selected/select-option:font-medium group-data-disabled/select-option:text-[color:var(--k-select-disabled)]",
  selectOptionDescription: "truncate text-xs leading-4 text-[color:var(--k-select-description)]",
  selectChevron: `pointer-events-none grid size-[${select.iconSize}px] shrink-0 place-items-center text-muted-foreground transition-[rotate] duration-[${select.chevronDuration}ms] ease-[${css(inventory.components.select.light["--ui-selc-ease"])}] data-popup-open:rotate-180 [&>svg]:size-[${select.chevronSize}px]!`,
  selectIndicator: `pointer-events-none absolute inset-y-0 right-2 flex w-[${select.iconSize}px] items-center justify-center [&>svg]:size-[${select.indicatorSize}px]!`,
  selectTick: `[stroke-dasharray:1] [stroke-dashoffset:0] transition-[stroke-dashoffset] duration-[${select.checkDuration}ms] delay-[${select.checkDelay}ms] ease-[${css(inventory.components.select.light["--ui-selc-ease"])}] starting:[stroke-dashoffset:1]`,
  selectPopup: `min-w-[min(${select.menuMinWidth}px,calc(100vw-16px))] max-w-[calc(100vw-16px)] overflow-x-hidden overflow-y-auto overscroll-contain [scrollbar-width:thin] max-h-[min(var(--available-height),${select.menuMaxHeight}px)] data-[align-trigger=false]:transition-[opacity,translate,scale] data-[align-trigger=false]:duration-[${select.menuDuration}ms] data-[align-trigger=false]:ease-[${css(inventory.components.select.light["--ui-selc-ease"])}] data-[align-trigger=false]:data-starting-style:opacity-0 data-[align-trigger=false]:data-ending-style:opacity-0 data-[align-trigger=false]:data-starting-style:scale-[${select.menuScale}] data-[align-trigger=false]:data-ending-style:scale-[${select.menuScale}] data-[align-trigger=false]:data-starting-style:translate-y-[-${select.menuOffset}px] data-[align-trigger=false]:data-ending-style:translate-y-[-${select.menuOffset}px] data-[align-trigger=false]:data-[side=top]:data-starting-style:translate-y-[${select.menuOffset}px] data-[align-trigger=false]:data-[side=top]:data-ending-style:translate-y-[${select.menuOffset}px]`,
  selectMenu: `${font} ${menuVars} ${selectTextVars} rounded-[${select.menuRadius}px] border-0 ring-0 bg-[var(--k-menu)] p-[${select.menuPadding}px] text-[color:var(--k-ink)] shadow-[var(--k-shadow-menu)] before:rounded-[${select.itemRadius}px] before:bg-[var(--k-glow)] before:duration-[${select.highlightDuration}ms] before:ease-[var(--k-ease)] [&_[role=option]]:min-h-[${select.itemHeight}px] [&_[role=option]]:rounded-[${select.itemRadius}px] [&_[role=option]]:py-[${select.itemPadding[0]}px] [&_[role=option]]:pl-[${select.itemPadding[1]}px] [&_[role=option]]:pr-8 [&_[role=option]]:text-[13px] [&_[role=option]]:leading-5 [&_[role=option]]:text-[color:var(--k-ink)] [&_[data-slot=select-group]]:p-0`,
  commandMenu: `${font} ${commandVars} @container w-full max-w-[${command.width}px] overflow-hidden rounded-[${command.radius}px] bg-[var(--k-command-surface)] text-[color:var(--k-command-ink)] shadow-[var(--k-command-shadow)]`,
  commandSearch: `flex h-[${command.searchHeight}px] items-center gap-2.5 border-b border-[var(--k-command-edge)] px-[${command.contentInset}px] [&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:text-[var(--k-command-muted)]`,
  commandInput: "h-full min-w-0 flex-1 border-0 bg-transparent p-0 text-[13px] font-normal leading-5 outline-none placeholder:text-[var(--k-command-muted)]",
  commandList: `max-h-[min(400px,55dvh)] overflow-y-auto overscroll-contain px-[${command.listPadding}px] pb-1 before:rounded-[${command.itemRadius}px] before:bg-[var(--k-command-highlight)] before:duration-[${command.highlightDuration}ms] before:ease-[var(--k-command-ease)]`,
  commandGroup: "relative px-2 pt-3 pb-1 text-[12px] font-normal leading-5 text-[color:var(--k-command-muted)]",
  commandItem: "relative z-10 flex min-h-9 w-full items-start gap-2.5 rounded-[6px] border-0 bg-transparent! px-2 py-2 text-left text-[13px] font-normal leading-5 outline-none disabled:cursor-not-allowed disabled:opacity-40 [&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:text-[var(--k-command-muted)]",
  commandIcon: "mt-0.5 inline-flex size-4 shrink-0 items-center justify-center text-[color:var(--k-command-muted)] [&>svg]:size-4",
  commandItemText: "min-w-0 flex-1",
  commandItemTitle: "flex min-w-0 items-baseline gap-2 overflow-hidden",
  commandTitle: "max-w-full min-w-0 shrink-0 truncate font-normal",
  commandHint: `min-w-0 truncate text-[${command.contextFontSize}px] text-[color:var(--k-command-muted)]`,
  commandDescription: `mt-0.5 block text-[${command.contextFontSize}px] leading-[${command.contextLineHeight}px] text-[color:var(--k-command-muted)] [display:-webkit-box] [-webkit-line-clamp:2] [-webkit-box-orient:vertical] overflow-hidden`,
  commandFooter: `flex min-h-10 flex-wrap items-center gap-x-4 gap-y-1 border-t border-[var(--k-command-edge)] px-[${command.contentInset}px] py-2 text-[12px] text-[color:var(--k-command-muted)] [&>span]:inline-flex [&>span]:items-center [&>span]:gap-1`,
  commandKey: "inline-flex min-w-5 items-center justify-center rounded border border-[var(--k-command-edge)] px-1 text-[11px] font-normal leading-4",
  commandShortcut: "hidden shrink-0 self-start leading-[18px] text-[color:var(--k-command-muted)] @min-[22rem]:inline-flex",
  popover: `${font} ${menuVars} w-64 max-w-[calc(100vw-24px)] rounded-[10px] border-0 bg-[var(--k-menu)] p-1 text-[color:var(--k-ink)] shadow-[var(--k-shadow-menu)] ring-0 outline-none`,
  hoverCard: `${font} ${menuVars} z-50 w-max max-w-[min(${hoverCard.maxWidth}px,calc(100vw-32px))] overflow-y-auto overscroll-contain rounded-[${hoverCard.radius}px] border-0 bg-[var(--k-menu)] p-[${hoverCard.padding}px] text-[color:var(--k-ink)] font-normal shadow-[var(--k-shadow-menu)] outline-none [overflow-wrap:anywhere]`,
  hoverCardMotion: `${hoverCardMotion} transition-[opacity,scale,translate] data-starting-style:data-[side=bottom]:-translate-y-1 data-starting-style:data-[side=top]:translate-y-1 data-starting-style:data-[side=left]:translate-x-1 data-starting-style:data-[side=right]:-translate-x-1 data-starting-style:scale-${hoverCard.scale * 100} data-starting-style:opacity-0 data-ending-style:scale-${hoverCard.scale * 100} data-ending-style:opacity-0`,
  popoverMotion: `${popoverMotion} transition-[opacity,scale] data-starting-style:scale-${popover.scale * 100} data-starting-style:opacity-0 data-ending-style:scale-${popover.scale * 100} data-ending-style:opacity-0`,
  popoverList: `${font} ${menuVars} before:rounded-[6px] before:bg-[var(--k-glow)] before:duration-[180ms] before:ease-[var(--k-ease)]`,
  dropdownPanel: `${font} ${menuVars} ${dropdownVars} relative isolate z-50 min-w-[${dropdown.minWidth}px] max-w-[calc(100vw-32px)] max-h-[var(--available-height,calc(100dvh-32px))] overflow-y-auto rounded-[${dropdown.radius}px] border-0 bg-[var(--k-menu)] p-[${dropdown.padding}px] text-[color:var(--k-ink)] shadow-[var(--k-shadow-menu)] outline-none before:rounded-[${dropdown.itemRadius}px] before:bg-[var(--k-glow)] before:duration-[${dropdown.highlightDuration}ms] before:ease-[var(--k-ease)] [&:has([data-danger]:is([data-highlighted],[data-focused],:focus))]:before:bg-[var(--k-dropdown-danger-highlight)]`,
  dropdownPositioner: "z-50 outline-none",
  dropdownItem: `relative z-10 flex min-h-[${dropdown.itemHeight}px] w-full cursor-default select-none items-center gap-2 rounded-[${dropdown.itemRadius}px] border-0 bg-transparent px-2 py-[${dropdown.itemPaddingY}px] text-left text-[13px] font-normal leading-5 outline-none data-disabled:pointer-events-none data-disabled:opacity-40 data-[danger=true]:text-[color:var(--k-dropdown-danger)] focus-visible:shadow-[inset_0_0_0_1px_var(--k-dropdown-focus)] [@media(pointer:coarse)]:min-h-[${dropdown.touchItemHeight}px]`,
  dropdownTrigger: "inline-flex h-8 shrink-0 items-center justify-center gap-2 px-2.5 [&_svg]:size-4 data-popup-open:bg-[var(--k-wash)] focus-visible:shadow-[0_0_0_2px_var(--k-wash)]",
  dropdownIcon: `flex size-[${dropdown.iconSize}px] shrink-0 items-center justify-center text-[color:var(--k-dropdown-muted)] [[data-danger=true]_&]:text-current [&>svg]:size-full`,
  dropdownChevron: `size-[${dropdown.iconSize}px] shrink-0 text-[color:var(--k-dropdown-muted)]`,
  dropdownDescription: "block text-xs leading-[18px] text-[color:var(--k-dropdown-muted)]",
  dropdownShortcut: "ml-4 shrink-0 font-sans text-xs leading-[18px] text-[color:var(--k-dropdown-muted)]",
  dropdownCheck: `flex size-[${dropdown.iconSize}px] shrink-0 items-center justify-center [&>svg]:size-full [&>svg]:opacity-0 [&>svg]:transition-opacity [&>svg]:duration-[${dropdown.checkDuration}ms] data-checked:[&>svg]:opacity-100 [&_path]:[stroke-dasharray:24] [&_path]:[stroke-dashoffset:24] [&_path]:transition-[stroke-dashoffset] [&_path]:duration-[${dropdown.checkDuration}ms] data-checked:[&_path]:[stroke-dashoffset:0]`,
  dropdownSeparator: "relative z-10 my-1 h-px bg-border",
  dropdownLabel: "relative z-10 px-2 py-1.5 text-xs leading-[18px] text-[color:var(--k-dropdown-muted)]",
  dropdownHeader: "relative z-10 px-2 py-2",
  dropdownEmpty: "relative z-10 block px-2 py-3 text-xs text-[color:var(--k-dropdown-muted)]",
  popoverItem: "relative z-10 flex min-h-8 w-full items-center rounded-[6px] border-0 bg-transparent! px-2 py-1.5 text-left text-[13px] font-normal leading-5 outline-none disabled:cursor-not-allowed disabled:opacity-40",
  button: `${font} ${focus} ${buttonVars} rounded-[6px] border-0 font-normal transition-[background-color,color,box-shadow,transform,opacity] duration-[140ms] ease-[var(--k-ease)] active:scale-[.97] disabled:opacity-40`,
  buttonDanger: "bg-[var(--k-danger)]! text-[color:var(--k-on-danger)]! shadow-none hover:bg-[var(--k-danger-hover)]!",
  buttonSolid: "bg-[var(--k-solid)] text-[color:var(--k-on-solid)] shadow-none hover:bg-[var(--k-solid-hover)]",
  buttonSurface: "bg-[var(--k-surface)]! text-[color:var(--k-ink)] shadow-[var(--k-shadow)] hover:bg-[var(--k-surface)]! hover:shadow-[var(--k-shadow-hover)]",
  buttonGhost: "bg-transparent text-[color:var(--k-ink)] shadow-none hover:bg-[var(--k-wash)]",
  switch: `${validation} ${focus} ${switchVars} relative h-5 w-8 shrink-0 rounded-full border-0 p-0.5 bg-[var(--k-off)]! hover:bg-[var(--k-off-hover)]! transition-colors duration-200 ${state}:bg-[var(--k-on)]! ${state}:hover:bg-[var(--k-on-hover)]! [&_[data-slot=switch-thumb]]:size-4 [&_[data-slot=switch-thumb]]:bg-[var(--k-thumb)]! [&_[data-slot=switch-thumb]]:shadow-[var(--k-thumb-shadow)] [&_[data-slot=switch-thumb]]:transition-[transform,width] [&_[data-slot=switch-thumb]]:duration-[260ms] [&_[data-slot=switch-thumb]]:ease-[var(--k-ease)] ${state}:[&_[data-slot=switch-thumb]]:translate-x-3 disabled:opacity-40`,
  checkbox: `${validation} ${focus} ${checkVars} size-4 shrink-0 rounded-[4.5px] border-0 bg-[var(--k-surface)]! shadow-[inset_0_0_0_1px_var(--k-edge),0_1px_1px_rgba(0,0,0,.04)] hover:shadow-[inset_0_0_0_1px_var(--k-edge-hover),0_1px_1px_rgba(0,0,0,.04)] transition-[background-color,box-shadow,transform] duration-[160ms] ease-[var(--k-ease)] active:scale-[.93] ${state}:bg-[var(--k-fill)]! ${state}:text-[color:var(--k-on-fill)] ${state}:shadow-none ${state}:hover:shadow-none [&_svg]:size-4 [&_svg]:text-current disabled:opacity-40`,
  segmentedControl: `${font} ${segmentVars} [--segment-radius:${segment.radius}px] [--segment-pill-radius:${segment.pillRadius}px]`,
  previewTabsList: `h-[${previewTabs.height}px]! rounded-[${previewTabs.radius}px]! p-[${previewTabs.padding}px]! before:rounded-[${previewTabs.radius}px]!`,
  previewTabsTrigger: `h-[${previewTabs.optionHeight}px]! rounded-[${previewTabs.radius}px]! px-[${previewTabs.paddingX}px]! gap-1.5!`,
  tabsList: `${font} ${tabVars} h-7! rounded-[8px] border-0 bg-[var(--k-track)] p-0.5 text-[color:var(--k-text)] before:rounded-[6px] before:bg-[var(--k-card)] before:shadow-[var(--k-card-shadow)] before:duration-200 before:ease-[var(--k-ease)]`,
  tabsTrigger: `${focus} relative z-10 h-6 min-h-0 rounded-[6px] border-0 bg-transparent! px-2.5 py-0 text-[13px] font-normal leading-5 text-[color:var(--k-text)] data-active:text-[color:var(--k-ink)] data-selected:text-[color:var(--k-ink)] data-[state=active]:text-[color:var(--k-ink)] data-active:bg-transparent! data-selected:bg-transparent! data-[state=active]:bg-transparent! data-active:shadow-none! data-selected:shadow-none! data-[state=active]:shadow-none!`,
};
await writeFile("components/ui/kalos-styles.ts", `// Generated from design/component-tokens.json by scripts/build-component-styles.mjs.\nimport "@fontsource/roboto/latin-400.css";\nimport "@fontsource/roboto/latin-500.css";\nexport const controlStyles = ${JSON.stringify(styles, null, 2)} as const;\nexport const hoverCardDefaults = ${JSON.stringify(hoverCard)} as const;\nexport const fieldMessageMotion = ${JSON.stringify(fieldMessageMotion)} as const;\nexport const textAreaDefaults = ${JSON.stringify(textArea)} as const;\nexport const numberInputSettings = ${JSON.stringify(numberInput)} as const;\nexport const avatarCss = ${JSON.stringify(avatarCss)};\nexport const segmentedControlCss = ${JSON.stringify(segmentedControlCss)};\n`);
await writeFile("components/hover-card-demo-styles.ts", `// Generated from design/component-tokens.json and design/hover-card-demo.css.\nexport const hoverCardDemoCss = ${JSON.stringify(hoverCardDemoCss)};\n`);
await writeFile("components/command-menu-demo-styles.ts", `// Generated from design/component-tokens.json.\nexport const commandMenuDemoStyles = ${JSON.stringify(commandMenuDemoStyles, null, 2)} as const;\n`);
const loadingLicense = await readFile("AFFECTUI-LICENSE.md", "utf8");
await writeFile("components/ui/kalos-loading-styles.ts", `// Generated from design/component-tokens.json, design/skeleton.css and design/spinner.css.\n/*\n${loadingLicense}\n*/\nexport const skeletonDefaults = ${JSON.stringify(skeleton)} as const;\nexport const spinnerDefaults = ${JSON.stringify(spinner)} as const;\nexport const skeletonCss = ${JSON.stringify(skeletonCss)};\nexport const spinnerCss = ${JSON.stringify(spinnerCss)};\n`);
await writeFile("components/loading-demo-styles.ts", `// Generated from design/component-tokens.json.\nexport const loadingDemoSettings = ${JSON.stringify(loadingDemo)} as const;\n`);
const badgeTokens = mode => ({ ...Object.fromEntries(Object.entries(inventory.components.badge.toneMapping).flatMap(([tone, source]) => ["ink", "wash"].map(part => [`${tone}-${part}`, inventory.components[inventory.components.badge.tokensFrom][mode][`${source}-${part}`]]))), ...Object.fromEntries(Object.entries(inventory.components.badge.toneMapping).map(([tone, source]) => [`${tone}-solid`, tone === "warning" ? inventory.components.table.warningBase : inventory.components[inventory.components.badge.tokensFrom].light[`${source}-ink`]])), "danger-solid": inventory.components.badge.light["danger-ink"], "on-solid": inventory.components.badge.onSolid, "warning-base": inventory.components.table.warningBase, ...inventory.components.badge[mode] });
const badgeCss = [
  `.kalos-badge{font-family:${inventory.font.family};${Object.entries(badgeTokens("light")).map(([key, value]) => `--badge-${key}:${value}`).join(";")};${Object.entries(inventory.defaults.badge).filter(([, value]) => typeof value === "number").map(([key, value]) => `--badge-${key}:${value}${key.endsWith("duration") ? "ms" : "px"}`).join(";")}}`,
  `:where(.dark,[data-theme=dark]) .kalos-badge{${Object.entries(badgeTokens("dark")).map(([key, value]) => `--badge-${key}:${value}`).join(";")}}`,
  await readFile("design/badge.css", "utf8"),
].join("\n");
await writeFile("components/ui/kalos-badge-styles.ts", `// Generated from design/component-tokens.json and design/badge.css.\n/*\n${loadingLicense}\n*/\nexport const badgeCss = ${JSON.stringify(badgeCss)};\n`);
console.log("Generated shared component styles from measured tokens.");
const pagination = inventory.defaults.pagination;
const paginationCss = [
  `.kalos-pagination{font-family:${inventory.font.family};font-size:${inventory.font.controlSize}px;line-height:${inventory.font.controlLineHeight}px;${Object.entries(inventory.components.pagination.light).map(([key, value]) => `--pg-${key}:${value}`).join(";")};--pg-size:${pagination.height}px;--pg-radius:${pagination.radius}px;--pg-gap:${pagination.gap}px;--pg-duration:${pagination.duration}ms}`,
  `:where(.dark,[data-theme=dark]) .kalos-pagination{${Object.entries(inventory.components.pagination.dark).map(([key, value]) => `--pg-${key}:${value}`).join(";")}}`,
  (await readFile("design/pagination.css", "utf8")).replace("max-width:520px", `max-width:${pagination.collapseWidth}px`),
].join("\n");
await writeFile("components/ui/kalos-pagination-styles.ts", `// Generated from design/component-tokens.json and design/pagination.css.\n/*\n${loadingLicense}\n*/\nexport const paginationCss = ${JSON.stringify(paginationCss)};\n`);
const picker = inventory.defaults.picker;
const pickerCss = [
  `.kalos-picker,.kalos-picker-popup{font-family:${inventory.font.family};font-size:${inventory.font.controlSize}px;line-height:${inventory.font.controlLineHeight}px;${Object.entries(inventory.components.picker.light).map(([key, value]) => `--picker-${key}:${value}`).join(";")};--picker-cell:${picker.cell}px;--picker-radius:${picker.radius}px;--picker-duration:${picker.duration}ms;--picker-range-width:${picker.rangeWidth}px;--picker-layer:${picker.layer}}`,
  `:where(.dark,[data-theme=dark]) :is(.kalos-picker,.kalos-picker-popup){${Object.entries(inventory.components.picker.dark).map(([key, value]) => `--picker-${key}:${value}`).join(";")}}`,
  await readFile("design/picker.css", "utf8"),
].join("\n");
await writeFile("components/ui/kalos-picker-styles.ts", `// Generated from design/component-tokens.json and design/picker.css.\n/*\n${loadingLicense}\n*/\nexport const pickerCss = ${JSON.stringify(pickerCss)};\n`);

const drawer = inventory.defaults.drawer;
const drawerTokens = Object.fromEntries(["light", "dark"].map(mode => [mode, {
  surface: inventory.components[drawer.tokensFrom][mode]["--ui-selc-menu"],
  ink: inventory.components[drawer.tokensFrom][mode]["--ui-selc-ink"],
  shadow: inventory.components[drawer.tokensFrom][mode]["--ui-selc-shadow-menu"],
  ...inventory.components.drawer[mode],
}]));
const drawerCss = [
  `.kalos-drawer-popup,.kalos-drawer-overlay{${Object.entries(drawerTokens.light).map(([key, value]) => `--kalos-drawer-${key}:${value}`).join(";")};--kalos-drawer-width:${drawer.width}px;--kalos-drawer-radius:${drawer.radius}px;--kalos-drawer-duration:${drawer.duration}ms;--kalos-drawer-ease:${drawer.ease}}`,
  `:where(.dark,[data-theme=dark]) :is(.kalos-drawer-popup,.kalos-drawer-overlay){${Object.entries(drawerTokens.dark).map(([key, value]) => `--kalos-drawer-${key}:${value}`).join(";")}}`,
  await readFile("design/drawer.css", "utf8"),
].join("\n");
await writeFile("components/ui/kalos-drawer-styles.ts", `// Generated from design/component-tokens.json and design/drawer.css.\nexport const drawerCss = ${JSON.stringify(drawerCss)};\n`);

const toast = inventory.defaults.toast;
const toastCss = [
  `.kalos-toast,.kalos-toast-viewport{${Object.entries({ radius: toast.radius, "min-height": toast.minHeight, "padding-x": toast.paddingX, "padding-y": toast.paddingY, gap: toast.gap, "viewport-width": toast.viewportWidth, top: toast.top }).map(([key, value]) => `--kalos-toast-${key}:${value}px`).join(";")};--kalos-toast-duration:${toast.duration}ms;--kalos-toast-font:${inventory.font.family};--kalos-toast-ease:${toast.ease};${Object.entries(inventory.components.toast.light).map(([key, value]) => `--kalos-toast-${key}:${value}`).join(";")}}`,
  `:where(.dark,[data-theme=dark]) .kalos-toast{${Object.entries(inventory.components.toast.dark).map(([key, value]) => `--kalos-toast-${key}:${value}`).join(";")}}`,
  await readFile("design/toast.css", "utf8"),
].join("\n");
await writeFile("components/ui/kalos-toast-styles.ts", `// Generated from design/component-tokens.json and design/toast.css.\nimport "@fontsource/roboto/latin-400.css";\nexport const toastDefaults = ${JSON.stringify(toast)} as const;\nexport const toastCss = ${JSON.stringify(toastCss)};\n`);

const notification = inventory.defaults.notification;
const notificationCss = [
  `.kalos-notification{font-family:${inventory.font.family};font-size:${inventory.font.controlSize}px;line-height:${inventory.font.controlLineHeight}px;${Object.entries(inventory.components.notification.light).map(([key, value]) => `--nt-${key}:${value}`).join(";")};--nt-width:${notification.width}px;--nt-text-inset-right:${notification.textInsetRight}px;--nt-radius:${notification.radius}px;--nt-offset:${notification.offset}px;--nt-layer:${notification.layer}}`,
  `:where(.dark,[data-theme=dark]) .kalos-notification{${Object.entries(inventory.components.notification.dark).map(([key, value]) => `--nt-${key}:${value}`).join(";")}}`,
  await readFile("design/notification.css", "utf8"),
].join("\n");
const notificationStyleHref = `kalos-notification-${createHash("sha256").update(notificationCss).digest("hex").slice(0, 12)}`;
await writeFile("components/ui/kalos-notification-styles.ts", `// Generated from design/component-tokens.json and design/notification.css.\n/*\n${loadingLicense}\n*/\nexport const notificationDefaults = ${JSON.stringify(notification)} as const;\nexport const notificationStyleHref = ${JSON.stringify(notificationStyleHref)};\nexport const notificationCss = ${JSON.stringify(notificationCss)};\n`);

const otp = inventory.defaults["otp-input"];
const otpField = inventory.defaults["text-field"];
const otpFieldKeys = ["ink", "surface", "shadow", "shadow-hover", "shadow-focus", "ease", "faint", "wash", "danger",
  "danger-surface", "shadow-invalid", "shadow-invalid-focus", "success", "muted"];
const otpFieldTokens = mode => otpFieldKeys
  .map(key => `--otp-${key}:${inventory.components["text-field"][mode][`--ui-tfc-${key}`]}`).join(";");
const otpCss = [
  `.kalos-otp{font:${typography.controlSize}px/${typography.controlLineHeight}px ${typography.family};${otpFieldTokens("light")};--otp-slot-width:${otp.slotWidth}px;--otp-height:${otp.slotHeight}px;--otp-radius:${otpField.radius}px;--otp-gap:${otp.gap}px;--otp-separator:${otp.separatorWidth}px;--otp-focus-in:${otpField.focusDuration}ms;--otp-focus-slide:${otp.focusSlideDuration}ms;--otp-digit-in:${otp.digitDuration}ms;--otp-shake:${otp.shakeDuration}ms;--otp-clear:${otp.clearDuration}ms;--otp-morph:${otp.morphDuration}ms}`,
  `:where(.dark,[data-theme=dark]) .kalos-otp{${otpFieldTokens("dark")}}`,
  await readFile("design/otp-input.css", "utf8"),
].join("\n");
const otpStyleHref = `kalos-otp-input-${createHash("sha256").update(otpCss).digest("hex").slice(0, 12)}`;
await writeFile("components/ui/kalos-otp-input-styles.ts", `// Generated from design/component-tokens.json and design/otp-input.css.\n/*\n${loadingLicense}\n*/\nimport "@fontsource/roboto/latin-400.css";\nexport const otpDefaults = ${JSON.stringify(otp)} as const;\nexport const otpStyleHref = ${JSON.stringify(otpStyleHref)};\nexport const otpCss = ${JSON.stringify(otpCss)};\n`);

const colorPicker = inventory.defaults["color-picker"];
const colorPickerCss = [
  `.kalos-color-panel,.kalos-color-popup{--color-panel-width:${colorPicker.width}px;--color-panel-radius:${colorPicker.radius}px;--color-panel-padding:${colorPicker.padding}px;--color-panel-gap:${colorPicker.gap}px;--color-plane-height:${colorPicker.planeHeight}px;--color-plane-touch-height:${colorPicker.touchPlaneHeight}px;--color-popup-duration:${colorPicker.duration}ms;--color-popup-scale:${colorPicker.scale};--color-popup-shift:${colorPicker.shift}px}`,
  await readFile("design/color-picker.css", "utf8"),
].join("\n");
const colorPickerStyleHref = `kalos-color-picker-${createHash("sha256").update(colorPickerCss).digest("hex").slice(0, 12)}`;
await writeFile("components/ui/kalos-color-picker-styles.ts", `// Generated from design/component-tokens.json and design/color-picker.css.\nexport const colorPickerStyleHref = ${JSON.stringify(colorPickerStyleHref)};\nexport const colorPickerCss = ${JSON.stringify(colorPickerCss)};\n`);

const combobox = inventory.defaults.combobox;
const comboboxColors = vars("combobox", Object.fromEntries(
  Object.keys(inventory.components.combobox.light).map(key => [`combobox-${key}`, key]),
));
const comboboxSelected = vars("table", { "combobox-selected": "brand" });
const comboboxEase = `cubic-bezier(${combobox.ease.join(",")})`;
const comboboxStyles = {
  label: "pl-0.5 text-[color:var(--k-combobox-muted)]",
  colors: comboboxColors,
  control: "flex items-center px-1! [&:not([data-pointer-focus]):has(input:focus-visible)>button]:bg-accent [&:not([data-pointer-focus]):has(input:focus-visible)>button]:text-foreground",
  input: "h-6 min-w-0 flex-1 border-0 bg-transparent px-1.5 py-0 outline-none placeholder:text-[color:var(--k-subtle)] disabled:cursor-not-allowed [@media(pointer:coarse)]:text-base",
  action: "flex size-6 shrink-0 items-center justify-center rounded-[6px] text-[color:var(--k-combobox-muted)] outline-none transition-colors duration-140 enabled:hover:bg-accent enabled:hover:text-foreground",
  chevron: "size-3 transition-transform duration-200 [button[data-popup-open]_&]:rotate-180",
  tags: "relative flex h-full min-w-0 flex-1 items-center overflow-clip [clip-margin:1px]",
  tagTrack: "grid min-w-0 shrink-0 grid-cols-[minmax(0,1fr)]",
  tag: `flex h-[${combobox.tagHeight}px] w-max max-w-full min-w-0 items-center gap-1.5 rounded-[${combobox.tagRadius}px] bg-[var(--k-combobox-chip)] pr-1 pl-1.5 text-[13px] leading-5 outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-ring [&>[data-slot=avatar]]:[--avatar-size:${combobox.tagAvatarSize}px]! [&>[data-slot=avatar]]:text-[7px]!`,
  initialAvatar: "[&_[data-slot=avatar-fallback]>span]:[text-box:trim-both_cap_alphabetic]",
  tagExit: "bg-[var(--k-combobox-removing)]",
  more: `shrink-0 px-1.5 mr-[${combobox.tagGap}px] text-xs text-[color:var(--k-combobox-muted)]`,
  remove: "flex size-4 shrink-0 items-center justify-center rounded-[4px] text-[color:var(--k-combobox-muted)] transition-colors enabled:hover:bg-background enabled:hover:text-foreground [&>svg]:size-3",
  measure: `flex w-max items-center gap-[${combobox.tagGap}px]`,
  popup: `${comboboxColors} ${comboboxSelected} w-(--anchor-width) max-w-(--available-width) origin-(--transform-origin) p-0! outline-none transition-[opacity,scale,translate] duration-[${combobox.popupDuration}ms] ease-[${comboboxEase}] data-anchor-hidden:invisible data-starting-style:scale-[${combobox.popupScale}] data-starting-style:opacity-0 data-ending-style:scale-[${combobox.popupScale}] data-ending-style:opacity-0 data-[side=bottom]:data-starting-style:-translate-y-[${combobox.popupShift}px] data-[side=bottom]:data-ending-style:-translate-y-[${combobox.popupShift}px] data-[side=top]:data-starting-style:translate-y-[${combobox.popupShift}px] data-[side=top]:data-ending-style:translate-y-[${combobox.popupShift}px]`,
  viewport: `overflow-hidden rounded-[inherit] transition-[height] duration-[${combobox.resizeDuration}ms] ease-[${comboboxEase}]`,
  scroll: `max-h-[min(${combobox.maxListHeight}px,calc(var(--available-height)-${combobox.footerHeight}px))] overflow-y-auto overscroll-contain before:top-0! before:left-0! before:translate-x-[var(--kalos-highlight-x,0px)] before:translate-y-[var(--kalos-highlight-y,0px)] before:rounded-[${select.itemRadius}px] before:bg-[var(--k-combobox-highlight)] before:transition-[translate,height,width,opacity] before:[transition-duration:${select.highlightDuration}ms,${select.highlightDuration}ms,${select.highlightDuration}ms,140ms] before:ease-out`,
  group: "px-2 py-1 text-[10px] leading-4 tracking-[0.025em] text-[color:var(--k-combobox-muted)]",
  item: "flex cursor-default items-center gap-2 pr-7! outline-none data-disabled:opacity-40 data-disabled:data-highlighted:ring-1 data-disabled:data-highlighted:ring-inset data-disabled:data-highlighted:ring-border [@media(pointer:coarse)]:min-h-11!",
  hint: "min-w-0 truncate text-xs text-[color:var(--k-combobox-muted)]",
  empty: `text-center text-[color:var(--k-combobox-muted)] [&:not(:empty)]:px-3 [&:not(:empty)]:pt-[${combobox.emptyPaddingTop}px] [&:not(:empty)]:pb-[${combobox.emptyPaddingBottom}px]`,
  indicator: `pointer-events-none absolute inset-y-0 right-2 flex scale-100 items-center text-[color:var(--k-combobox-selected)] opacity-100 transition-[opacity,scale] [transition-duration:${combobox.checkFadeDuration}ms,${combobox.checkDuration}ms] [transition-timing-function:ease,cubic-bezier(${combobox.checkEase.join(",")})] [[aria-selected=false]_&]:scale-[0.4] [[aria-selected=false]_&]:opacity-0 [[aria-selected=false]_&]:[transition-duration:120ms,160ms] [&>svg]:size-4`,
  icon: "flex shrink-0 items-center justify-center text-[color:var(--k-combobox-muted)] [&>svg]:size-3.5",
  createIcon: "flex size-5 shrink-0 items-center justify-center rounded-[6px] text-[color:var(--k-combobox-muted)] shadow-[inset_0_0_0_0.5px_var(--k-combobox-icon-edge)] [&>svg]:size-3",
  dot: "ml-0.5 size-2 shrink-0 rounded-full",
  measureAvatar: `size-[${combobox.tagAvatarSize}px] shrink-0`,
  match: "rounded-[2px] bg-[color-mix(in_srgb,var(--selection-background)_64%,transparent)] text-inherit",
  footer: `flex h-[${combobox.footerHeight}px] items-center justify-between gap-1 rounded-b-[inherit] border-t border-[var(--k-combobox-icon-edge)] px-3 text-xs leading-4 text-[color:var(--k-combobox-muted)]`,
  shortcuts: "flex items-center gap-1 [@media(pointer:coarse)]:hidden",
  key: "inline-grid size-[18px] place-items-center rounded-[5px] font-[inherit] text-xs leading-none shadow-[inset_0_0_0_0.5px_var(--k-combobox-icon-edge)]",
};
await writeFile("components/ui/kalos-combobox-styles.ts", `// Generated from design/component-tokens.json.
export const comboboxDefaults = ${JSON.stringify(combobox)} as const;
export const comboboxStyles = ${JSON.stringify(comboboxStyles, null, 2)} as const;
`);

const dropzone = inventory.defaults.dropzone;
const dropzoneColors = inventory.components.dropzone;
const themeTokens = JSON.parse(await readFile("design/tokens.json", "utf8"));
const thinking = inventory.defaults["thinking-state"];
const thinkingColors = inventory.components["thinking-state"];
const thinkingVars = (mode) => [
  ...Object.entries(thinkingColors.themeMapping).map(([name, source]) => [name, `var(--${source}, ${themeTokens[mode][source]})`]),
  ...Object.entries(thinkingColors[mode]),
].map(([name, value]) => `--kts-${name}:${value}`).join(";");
const thinkingTimings = Object.entries({
  "enter-duration": thinking.enterDuration,
  "fold-open-duration": thinking.foldOpenDuration,
  "fold-close-duration": thinking.foldCloseDuration,
  "shimmer-duration": thinking.shimmerDuration,
  "pulse-duration": thinking.pulseDuration,
  "chip-duration": thinking.chipDuration,
  "chip-lead": thinking.chipLead,
  "chip-stagger": thinking.chipStagger,
  "extra-chip-stagger": thinking.extraChipStagger,
  "check-duration": thinking.checkDuration,
  "tick-duration": thinking.tickDuration,
  "tick-delay": thinking.tickDelay,
}).map(([name, value]) => `--kts-${name}:${value}ms`).join(";");
const thinkingCss = [
  `.kalos-thinking-state{font-family:${typography.family};font-size:${typography.controlSize}px;line-height:${typography.controlLineHeight}px;${thinkingVars("light")};${thinkingTimings};--kts-width:${thinking.width}px;--kts-chip-radius:${thinking.chipRadius}px;--kts-ease:${thinking.ease};--kts-fold-open-ease:${thinking.foldOpenEase}}`,
  `:where(.dark,[data-theme=dark]) .kalos-thinking-state{${thinkingVars("dark")}}`,
  await readFile("design/thinking-state.css", "utf8"),
].join("\n");
const thinkingStateStyleHref = `kalos-thinking-state-${createHash("sha256").update(thinkingCss).digest("hex").slice(0, 12)}`;
await writeFile("components/ui/kalos-thinking-state-styles.ts", `// Generated from design tokens and design/thinking-state.css.\nexport const thinkingStateDefaults = ${JSON.stringify(thinking)} as const;\nexport const thinkingStateStyleHref = ${JSON.stringify(thinkingStateStyleHref)};\nexport const thinkingStateCss = ${JSON.stringify(thinkingCss)};\n`);

const answer = inventory.defaults["ai-answer"];
const answerColors = inventory.components["ai-answer"];
const answerVars = (mode) => {
  const palette = inventory.components[answerColors.tokensFrom][mode];
  return [
    ...Object.entries(answerColors.themeMapping).map(([key, source]) => [key, `var(--${source}, ${themeTokens[mode][source]})`]),
    ...Object.entries(answerColors.colorMapping).map(([key, source]) => [key, palette[source]]),
  ].map(([key, value]) => `--aa-${key}:${value}`).join(";");
};
const answerSelectors = ":is(.kalos-ai-answer,.kalos-answer-source-popup)";
const answerMotion = Object.entries(answer.motion).map(([key, value]) => `--aa-${key}:${value}ms`).join(";");
const answerCss = [
  `${answerSelectors}{font-family:${typography.family};font-size:${typography.controlSize}px;line-height:${typography.controlLineHeight}px;${answerVars("light")};--aa-width:${answer.width}px;--aa-radius:${answer.radius}px;--aa-source-radius:${answer.sourceRadius}px;--aa-padding:${answer.padding}px;--aa-narrow-padding:${answer.narrowPadding}px;--aa-duration:${answer.duration}ms;--aa-ease:${answer.ease};${answerMotion}}`,
  `:where(.dark,[data-theme=dark]) ${answerSelectors}{${answerVars("dark")}}`,
  (await readFile("design/ai-answer.css", "utf8")).replace("@container kalos-answer (width < 440px)", `@container kalos-answer (width < ${answer.narrowWidth}px)`),
].join("\n");
const answerStyleHref = `kalos-ai-answer-${createHash("sha256").update(answerCss).digest("hex").slice(0, 12)}`;
await writeFile("components/ui/kalos-ai-answer-styles.ts", `// Generated from design tokens and design/ai-answer.css.\nexport const answerDefaults = ${JSON.stringify(answer)} as const;\nexport const answerStyleHref = ${JSON.stringify(answerStyleHref)};\nexport const answerCss = ${JSON.stringify(answerCss)};\n`);

const decisionCard = inventory.defaults["decision-card"];
const decisionColors = inventory.components["decision-card"];
const decisionVars = (mode) => [
  ...Object.entries(decisionColors.themeMapping).map(([name, source]) => [name, `var(--${source}, ${themeTokens[mode][source]})`]),
  ...Object.entries(decisionColors.colorMapping).map(([name, source]) => [name, inventory.components[decisionColors.tokensFrom][mode][source]]),
  ["highlight-color", inventory.components.select[mode]["--ui-selc-glow"]],
  ["highlight-ease", inventory.components.select[mode]["--ui-selc-ease"]],
].map(([name, value]) => `--kd-${name}:${value}`).join(";");
const decisionCardCss = [
  `.kalos-decision-card{font-family:${inventory.font.family};font-size:${inventory.font.controlSize}px;line-height:${inventory.font.controlLineHeight}px;${decisionVars("light")};--kd-radius:${decisionCard.radius}px;--kd-row-radius:${decisionCard.rowRadius}px;--kd-highlight-radius:${select.itemRadius}px;--kd-highlight-duration:${select.highlightDuration}ms}`,
  `:where(.dark,[data-theme=dark]) .kalos-decision-card{${decisionVars("dark")}}`,
  (await readFile("design/decision-card.css", "utf8")).replace("DECISION_NARROW_WIDTH", `${decisionCard.narrowWidth}px`),
].join("\n");
const decisionCardStyleHref = `kalos-decision-card-${createHash("sha256").update(decisionCardCss).digest("hex").slice(0, 12)}`;
await writeFile("components/ui/kalos-decision-card-styles.ts", `// Generated from design tokens and design/decision-card.css.\nexport const decisionDefaults = ${JSON.stringify(decisionCard)} as const;\nexport const decisionCardStyleHref = ${JSON.stringify(decisionCardStyleHref)};\nexport const decisionCardCss = ${JSON.stringify(decisionCardCss)};\n`);

const permission = inventory.defaults["permission-request"];
const permissionColors = inventory.components["permission-request"];
const permissionVars = (mode) => [
  ...Object.entries(permissionColors.themeMapping).map(([name, source]) => [name, `var(--${source}, ${themeTokens[mode][source]})`]),
  ...Object.entries(permissionColors.colorMapping).map(([name, source]) => [name, inventory.components[permissionColors.tokensFrom][mode][source]]),
  ...Object.entries(permissionColors[mode]),
].map(([name, value]) => `--kpr-${name}:${value}`).join(";");
const permissionCss = [
  `.kalos-permission-request{font-family:${typography.family};font-size:${typography.controlSize}px;line-height:${typography.controlLineHeight}px;${permissionVars("light")};--kpr-width:${permission.width}px;--kpr-radius:${permission.radius}px;--kpr-preview-radius:${permission.previewRadius}px;--kpr-padding:${permission.padding}px;--kpr-compact-padding:${permission.compactPadding}px;--kpr-row-duration:${permission.rowDuration}ms;--kpr-row-stagger:${permission.rowStagger}ms;--kpr-ease:cubic-bezier(${permission.ease.join(",")})}`,
  `:where(.dark,[data-theme=dark]) .kalos-permission-request{${permissionVars("dark")}}`,
  (await readFile("design/permission-request.css", "utf8")).replace("PERMISSION_NARROW_WIDTH", `${permission.narrowWidth}px`),
].join("\n");
const permissionStyleHref = `kalos-permission-request-${createHash("sha256").update(permissionCss).digest("hex").slice(0, 12)}`;
await writeFile("components/ui/kalos-permission-request-styles.ts", `// Generated from design tokens and design/permission-request.css.\nexport const permissionDefaults = ${JSON.stringify(permission)} as const;\nexport const permissionStyleHref = ${JSON.stringify(permissionStyleHref)};\nexport const permissionCss = ${JSON.stringify(permissionCss)};\n`);

const stream = inventory.defaults["response-stream"];
const streamColors = inventory.components["response-stream"];
const streamVars = (mode) => [
  ...Object.entries(streamColors.themeMapping).map(([name, source]) => [name, `var(--${source}, ${themeTokens[mode][source]})`]),
  ...Object.entries(streamColors.colorMapping).map(([name, source]) => [name, inventory.components[streamColors.tokensFrom][mode][source]]),
  ...Object.entries(streamColors[mode]),
  ["action", inventory.components["segmented-control"][mode]["--ui-segc-card"]],
].map(([name, value]) => `--krs-${name}:${value}`).join(";");
const streamCss = [
  `.kalos-response-stream{font-family:${typography.family};font-size:${typography.controlSize}px;line-height:${typography.controlLineHeight}px;${streamVars("light")};--krs-indent:${stream.indent}px;--krs-word-duration:${stream.wordDuration}ms;--krs-dismiss-duration:${stream.dismissDuration}ms;--krs-pixel-duration:${stream.pixelDuration}ms;--krs-caret-duration:${stream.caretDuration}ms;--krs-chip-duration:${stream.chipDuration}ms}`,
  `:where(.dark,[data-theme=dark]) .kalos-response-stream{${streamVars("dark")}}`,
  (await readFile("design/response-stream.css", "utf8")).replace("RESPONSE_NARROW_WIDTH", `${stream.narrowWidth}px`),
].join("\n");
const streamStyleHref = `kalos-response-stream-${createHash("sha256").update(streamCss).digest("hex").slice(0, 12)}`;
await writeFile("components/ui/kalos-response-stream-styles.ts", `// Generated from design tokens and design/response-stream.css.\nexport const responseStreamDefaults = ${JSON.stringify(stream)} as const;\nexport const responseStreamStyleHref = ${JSON.stringify(streamStyleHref)};\nexport const responseStreamCss = ${JSON.stringify(streamCss)};\n`);

const collaboration = inventory.defaults["collaboration-stream"];
const collaborationColors = inventory.components["collaboration-stream"];
const collaborationVars = (mode) => [
  ...Object.entries(collaborationColors.themeMapping).map(([name, source]) => [name, `var(--${source}, ${themeTokens[mode][source]})`]),
  ...Object.entries(collaborationColors.colorMapping).map(([name, source]) => [name, inventory.components[collaborationColors.tokensFrom][mode][source]]),
  ...Object.entries(collaborationColors[mode]),
].map(([name, value]) => `--kcs-${name}:${value}`).join(";");
const collaborationMotion = [
  ...["transition", "dim", "detail", "dialog", "shimmer"].map(name => [name, collaboration[name]]),
  ["message-shadow", collaboration.messageShadow],
  ["message-text", collaboration.messageText],
].map(([name, duration]) => `--kcs-${name}:${duration}ms`).join(";");
const collaborationCss = [
  `.kalos-collaboration-stream{font-family:${typography.family};font-size:${typography.controlSize}px;line-height:${typography.controlLineHeight}px;${collaborationVars("light")};--kcs-bubble:${collaboration.bubble}px;--kcs-radius:${collaboration.radius}px;--kcs-ease:${collaboration.ease};--kcs-detail-fade:${collaboration.detailFade}ms;${collaborationMotion}}`,
  `:where(.dark,[data-theme=dark]) .kalos-collaboration-stream{${collaborationVars("dark")}}`,
  await readFile("design/collaboration-stream.css", "utf8"),
].join("\n");
const collaborationStyleHref = `kalos-collaboration-stream-${createHash("sha256").update(collaborationCss).digest("hex").slice(0, 12)}`;
await writeFile("components/ui/kalos-collaboration-stream-styles.ts", `// Generated from design tokens and design/collaboration-stream.css.\nexport const collaborationDefaults = ${JSON.stringify(collaboration)} as const;\nexport const collaborationStyleHref = ${JSON.stringify(collaborationStyleHref)};\nexport const collaborationCss = ${JSON.stringify(collaborationCss)};\n`);

const usageMeter = inventory.defaults["usage-meter"];
const usageMeterColors = inventory.components["usage-meter"];
const usageMeterVars = (mode) => [
  ...Object.entries(usageMeterColors.themeMapping).map(([name, source]) => [name, `var(--${source}, ${themeTokens[mode][source]})`]),
  ...Object.entries(usageMeterColors.colorMapping).map(([name, source]) => [name, inventory.components[usageMeterColors.tokensFrom][mode][source]]),
  ...Object.entries(usageMeterColors[mode]),
].map(([name, value]) => `--kum-${name}:${value}`).join(";");
const usageMeterCss = [
  `.kalos-usage-meter{font-family:${typography.family};font-size:${typography.controlSize}px;line-height:${typography.controlLineHeight}px;${usageMeterVars("light")};--kum-width:${usageMeter.width}px;--kum-radius:${usageMeter.radius}px;--kum-padding:${usageMeter.padding}px;--kum-narrow-padding:${usageMeter.narrowPadding}px;--kum-duration:${usageMeter.duration}ms;--kum-feedback:${usageMeter.feedbackDuration}ms;--kum-limit-duration:${usageMeter.limitDuration}ms;--kum-readout-duration:${usageMeter.readoutDuration}ms;--kum-readout-fade:${usageMeter.readoutFade}ms;--kum-layout-duration:${usageMeter.layoutDuration}ms;--kum-chart-readout-duration:${usageMeter.chartReadoutDuration}ms;--kum-ease:${usageMeter.ease}}`,
  `:where(.dark,[data-theme=dark]) .kalos-usage-meter{ ${usageMeterVars("dark")} }`,
  (await readFile("design/usage-meter.css", "utf8")).replaceAll("USAGE_METER_NARROW_WIDTH", `${usageMeter.narrowWidth}px`),
].join("\n");
const usageMeterStyleHref = `kalos-usage-meter-${createHash("sha256").update(usageMeterCss).digest("hex").slice(0, 12)}`;
await writeFile("components/ui/kalos-usage-meter-styles.ts", `// Generated from design tokens and design/usage-meter.css.\nexport const usageMeterDefaults = ${JSON.stringify(usageMeter)} as const;\nexport const usageMeterStyleHref = ${JSON.stringify(usageMeterStyleHref)};\nexport const usageMeterCss = ${JSON.stringify(usageMeterCss)};\n`);

const contextWindow = inventory.defaults["context-window"];
const contextWindowColors = inventory.components["context-window"];
const contextWindowVars = (mode) => [
  ...Object.entries(contextWindowColors.themeMapping).map(([name, source]) => [name, `var(--${source}, ${themeTokens[mode][source]})`]),
  ...Object.entries(contextWindowColors.colorMapping).map(([name, source]) => [name, inventory.components[contextWindowColors.tokensFrom][mode][source]]),
  ...Object.entries(contextWindowColors[mode]),
  ["danger-wash", inventory.components.badge[mode]["danger-wash"]],
].map(([name, value]) => `--kc-${name}:${value}`).join(";");
const contextWindowCss = [
  `.kalos-context-window{${contextWindowVars("light")};--kc-width:${contextWindow.width}px;--kc-padding:${contextWindow.padding}px;--kc-row-radius:${contextWindow.rowRadius}px;--kc-duration:${contextWindow.duration}ms;--kc-shimmer:${contextWindow.shimmer}ms;--kc-ease:${contextWindow.ease}}`,
  `:where(.dark,[data-theme=dark]) .kalos-context-window{${contextWindowVars("dark")}}`,
  (await readFile("design/context-window.css", "utf8")).replace("CONTEXT_NARROW_WIDTH", `${contextWindow.narrowWidth}px`),
].join("\n");
const contextWindowStyleHref = `kalos-context-window-${createHash("sha256").update(contextWindowCss).digest("hex").slice(0, 12)}`;
await writeFile("components/ui/kalos-context-window-styles.ts", `// Generated from design tokens and design/context-window.css.\nexport const contextWindowDefaults = ${JSON.stringify(contextWindow)} as const;\nexport const contextWindowStyleHref = ${JSON.stringify(contextWindowStyleHref)};\nexport const contextWindowCss = ${JSON.stringify(contextWindowCss)};\n`);

const dropzoneVars = (mode) => {
  const palette = inventory.components[dropzoneColors.tokensFrom][mode];
  return [
    ...Object.entries(dropzoneColors.themeMapping).map(([name, source]) => [name, `var(--${source}, ${themeTokens[mode][source]})`]),
    ...Object.entries(dropzoneColors.colorMapping).map(([name, source]) => [name, palette[source]]),
    ["document-wash", inventory.components.badge[mode]["danger-wash"]],
  ].map(([name, value]) => `--kalos-dz-${name}:${value}`).join(";");
};
const dropzoneCss = [
  `.kalos-dropzone{font-family:${inventory.font.family};font-size:${inventory.font.controlSize}px;line-height:${inventory.font.controlLineHeight}px;${dropzoneVars("light")};--kalos-dz-width:${dropzone.width}px;--kalos-dz-radius:${dropzone.radius}px;--kalos-dz-inner-radius:${dropzone.innerRadius}px;--kalos-dz-duration:${dropzone.duration}ms;--kalos-dz-fan-duration:${dropzone.fanDuration}ms;--kalos-dz-progress-collapse:${dropzone.progressCollapseDuration}ms;--kalos-dz-ease:cubic-bezier(${dropzone.ease.join(",")})}`,
  `:where(.dark,[data-theme=dark]) .kalos-dropzone{${dropzoneVars("dark")}}`,
  await readFile("design/dropzone.css", "utf8"),
].join("\n");
const dropzoneStyleHref = `kalos-dropzone-${createHash("sha256").update(dropzoneCss).digest("hex").slice(0, 12)}`;
await writeFile("components/ui/kalos-dropzone-styles.ts", `// Generated from design tokens and design/dropzone.css.\nimport "@fontsource/roboto/latin-400.css";\nimport "@fontsource/roboto/latin-500.css";\nexport const dropzoneDefaults = ${JSON.stringify(dropzone)} as const;\nexport const dropzoneStyleHref = ${JSON.stringify(dropzoneStyleHref)};\nexport const dropzoneCss = ${JSON.stringify(dropzoneCss)};\n`);

const stepper = inventory.defaults["stepper-form"];
const stepperColors = inventory.components["stepper-form"];
const stepperCss = [
  `.kalos-stepper{font-family:${inventory.font.family};font-size:${inventory.font.controlSize}px;line-height:${inventory.font.controlLineHeight}px;--kalos-stepper-width:${stepper.width}px;--kalos-stepper-radius:${stepper.radius}px;--kalos-stepper-padding:${stepper.padding}px;--kalos-stepper-narrow-padding:${stepper.narrowPadding}px;--kalos-stepper-track-height:${stepper.trackHeight}px;--kalos-stepper-success-icon:${stepper.successIconSize}px;--kalos-stepper-success-mark:${stepper.successMarkSize}px;--kalos-stepper-progress:${stepperColors.light.progress};--kalos-stepper-duration:${stepper.duration}ms;--kalos-stepper-ease:cubic-bezier(${stepper.ease.join(",")})}`,
  `:where(.dark,[data-theme=dark]) .kalos-stepper{--kalos-stepper-progress:${stepperColors.dark.progress}}`,
  (await readFile("design/stepper-form.css", "utf8")).replace("STEPPER_COMPACT_WIDTH", `${stepper.compactWidth}px`),
].join("\n");
const stepperStyleHref = `kalos-stepper-form-${createHash("sha256").update(stepperCss).digest("hex").slice(0, 12)}`;
await writeFile("components/ui/kalos-stepper-form-styles.ts", `// Generated from design/component-tokens.json and design/stepper-form.css.\nexport const stepperDefaults = ${JSON.stringify(stepper)} as const;\nexport const stepperStyleHref = ${JSON.stringify(stepperStyleHref)};\nexport const stepperCss = ${JSON.stringify(stepperCss)};\n`);

const breakdown = inventory.defaults["breakdown-chart"];
const breakdownColors = inventory.components["breakdown-chart"];
const breakdownVars = mode => Object.entries(breakdownColors[mode]).map(([key, value]) => `--kbc-${key}:${value}`).join(";");
const breakdownCss = [
  `.kalos-breakdown-chart{${breakdownVars("light")};--kbc-ease:${breakdown.ease};--kbc-width:${breakdown.width}px;--kbc-radius:${breakdown.radius}px;--kbc-restack:${breakdown.restackDuration}ms;--kbc-table-motion:${breakdown.tableDuration}ms;font-family:Inter,${typography.family}}`,
  `:where(.dark,[data-theme=dark]) .kalos-breakdown-chart{${breakdownVars("dark")}}`,
  ...(await Promise.all(["design/breakdown-chart.css", "design/breakdown-plot.css"].map(file => readFile(file, "utf8"))))
    .map(source => source.replaceAll("BREAKDOWN_NARROW_WIDTH", `${breakdown.narrowWidth}px`)),
].join("\n");
const breakdownHash = createHash("sha256").update(breakdownCss).digest("hex").slice(0, 12);
await writeFile("components/ui/kalos-breakdown-chart-styles.ts", `// Generated from the Breakdown Chart design tokens and styles.\nexport const breakdownPalette = ${JSON.stringify(breakdown.palette)} as const;\nexport const breakdownChartStyleHref = "kalos-breakdown-chart-${breakdownHash}";\nexport const breakdownChartCss = ${JSON.stringify(breakdownCss)};\n`);

const breadcrumb = inventory.defaults.breadcrumb;
const breadcrumbTheme = inventory.components.breadcrumb;
const breadcrumbVars = values => Object.entries(values).map(([name, value]) => `--bc-${name}:${value}`).join(";");
const breadcrumbMetrics = Object.fromEntries(Object.entries(breadcrumb)
  .filter(([name]) => name !== "maxItems")
  .map(([name, value]) => [name, typeof value === "string" ? value : `${value}${name.endsWith("Duration") ? "ms" : "px"}`]));
const breadcrumbCss = [
  `.kalos-breadcrumb{font-family:${inventory.font.family};${breadcrumbVars(breadcrumbMetrics)};${breadcrumbVars(breadcrumbTheme.light)}}`,
  `:where(.dark,[data-theme=dark]) .kalos-breadcrumb{${breadcrumbVars(breadcrumbTheme.dark)}}`,
  await readFile("design/breadcrumb.css", "utf8"),
].join("\n");
const breadcrumbLicense = await readFile("BREADCRUMB-LICENSE.md", "utf8");
await writeFile("components/ui/kalos-breadcrumb-styles.ts", `// Generated from design/component-tokens.json and design/breadcrumb.css.\n/*\n${breadcrumbLicense}\n*/\nexport const breadcrumbCss = ${JSON.stringify(breadcrumbCss)};\nexport const breadcrumbMaxItems = ${breadcrumb.maxItems};\n`);

const emptyState = inventory.components["empty-state"];
const { compactBreakpoint, ...emptyMetrics } = inventory.defaults["empty-state"];
const emptyVars = values => Object.entries(values)
  .map(([name, value]) => `--est-${name}:${typeof value === "number" ? `${value}px` : value}`).join(";");
const emptyStateCss = [
  `.kalos-empty-state{font-family:${inventory.font.family};font-size:${inventory.font.controlSize}px;line-height:${inventory.font.controlLineHeight}px;font-weight:${inventory.font.controlWeight};${emptyVars(emptyMetrics)};${emptyVars(emptyState.light)}}`,
  `:where(.dark,[data-theme=dark]) .kalos-empty-state{${emptyVars(emptyState.dark)}}`,
  (await readFile("design/empty-state.css", "utf8")).replace("EMPTY_STATE_COMPACT_WIDTH", `${compactBreakpoint}px`),
].join("\n");
const emptyStateStyleHref = `kalos-empty-state-${createHash("sha256").update(emptyStateCss).digest("hex").slice(0, 12)}`;
const emptyStateLicense = await readFile("EMPTY-STATE-LICENSE.md", "utf8");
await writeFile("components/ui/kalos-empty-state-styles.ts", `// Generated from design/component-tokens.json and design/empty-state.css.\n/*\n${emptyStateLicense}\n*/\nexport const emptyStateStyleHref = ${JSON.stringify(emptyStateStyleHref)};\nexport const emptyStateCss = ${JSON.stringify(emptyStateCss)};\n`);
