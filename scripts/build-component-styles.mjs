import { readFile, writeFile } from "node:fs/promises";
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
const field = `${font} ${focus} ${fieldVars} h-8 rounded-[7px] border-0 bg-[var(--k-surface)]! px-2.5 py-0 text-[color:var(--k-ink)] [--k-control-shadow:var(--k-shadow)] shadow-[var(--k-control-shadow)] ring-0! transition-[box-shadow,background-color] duration-[140ms] ease-[var(--k-ease)] ${fieldHover}:[--k-control-shadow:var(--k-shadow-hover)] ${fieldFocused}:[--k-control-shadow:var(--k-shadow-focus)] ${fieldActive}:duration-[${fieldFocusDuration}] data-[invalid=true]:bg-[var(--k-danger-surface)]! data-[invalid=true]:[--k-control-shadow:var(--k-shadow-invalid)] ${fieldInvalidFocused}:[--k-control-shadow:var(--k-shadow-invalid-focus)] data-[disabled=true]:opacity-40 has-disabled:opacity-40`;

const buttonVars = vars("button", Object.fromEntries(["ink", "solid", "solid-hover", "on-solid", "surface", "shadow", "shadow-hover", "wash", "ease", "danger", "danger-hover", "on-danger"].map(k => [k, `--ui-btnc-${k}`])));
const menuVars = vars("select", Object.fromEntries(["ink", "menu", "glow", "shadow-menu", "ease"].map(k => [k, `--ui-selc-${k}`])));
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
  tableScroll: "w-full overflow-x-auto overscroll-x-contain",
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
  inputGroup: `${field} flex w-full min-w-0 px-0`,
  inputContent: `${font} h-full min-w-0 flex-1 rounded-[7px] border-0 bg-transparent! px-2.5 py-0 text-[color:var(--k-ink)] shadow-none outline-none ring-0 focus-visible:shadow-none focus-visible:outline-none focus-visible:ring-0 aria-invalid:ring-0 disabled:bg-transparent disabled:opacity-100 placeholder:text-[color:var(--k-subtle)]`,
  inputClear: "[&_svg]:size-3! pointer-events-none opacity-0 transition-opacity duration-150 group-hover/input-group:pointer-events-auto group-hover/input-group:opacity-100 group-focus-within/input-group:pointer-events-auto group-focus-within/input-group:opacity-100 focus-visible:pointer-events-auto focus-visible:opacity-100",
  inputAddon: "flex h-full shrink-0 items-center gap-0.5 pr-2",
  inputAction: action,
  selectClearable: "[&>svg]:transition-opacity [&>svg]:duration-150 [&>svg]:group-has-[[data-slot=select-clear]:hover]/select-control:opacity-0 [&>svg]:group-has-[:focus-visible]/select-control:opacity-0",
  selectClear: `${action} [&_svg]:size-3! absolute top-1 right-2 opacity-0 hover:opacity-100 group-has-[:focus-visible]/select-control:opacity-100 focus-visible:opacity-100`,
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
  selectControl: `${field} relative w-full min-w-0 px-0`,
  selectTrigger: `${font} ${focus} h-full w-full min-w-0 rounded-[7px] border-0 bg-transparent! px-2.5 py-0 text-[color:var(--k-ink)] shadow-none ring-0! focus-visible:shadow-none focus-visible:ring-0 aria-invalid:ring-0 aria-invalid:shadow-none disabled:opacity-100 data-placeholder:text-[color:var(--k-subtle)] [&_[data-placeholder]]:text-[color:var(--k-subtle)]`,
  selectPlaceholder: "text-[color:var(--k-subtle)] data-placeholder:text-[color:var(--k-subtle)]",
  selectMenu: `${font} ${menuVars} rounded-[${select.menuRadius}px] border-0 ring-0 bg-[var(--k-menu)] p-[${select.menuPadding}px] text-[color:var(--k-ink)] shadow-[var(--k-shadow-menu)] before:rounded-[${select.itemRadius}px] before:bg-[var(--k-glow)] before:duration-[${select.highlightDuration}ms] before:ease-[var(--k-ease)] [&_[role=option]]:min-h-[${select.itemHeight}px] [&_[role=option]]:rounded-[${select.itemRadius}px] [&_[role=option]]:py-[${select.itemPadding[0]}px] [&_[role=option]]:pl-[${select.itemPadding[1]}px] [&_[role=option]]:pr-8 [&_[role=option]]:text-[13px] [&_[role=option]]:leading-5 [&_[role=option]]:text-[color:var(--k-ink)] [&_[data-slot=select-group]]:p-0`,
  commandMenu: `${font} ${commandVars} w-full max-w-[${command.width}px] overflow-hidden rounded-[${command.radius}px] bg-[var(--k-command-surface)] text-[color:var(--k-command-ink)] shadow-[var(--k-command-shadow)]`,
  commandSearch: `flex h-[${command.searchHeight}px] items-center gap-2.5 border-b border-[var(--k-command-edge)] px-[${command.contentInset}px] [&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:text-[var(--k-command-muted)]`,
  commandInput: "h-full min-w-0 flex-1 border-0 bg-transparent p-0 text-[13px] font-normal leading-5 outline-none placeholder:text-[var(--k-command-muted)]",
  commandList: `max-h-[min(400px,55dvh)] overflow-y-auto overscroll-contain px-[${command.listPadding}px] pb-1 before:rounded-[${command.itemRadius}px] before:bg-[var(--k-command-highlight)] before:duration-[${command.highlightDuration}ms] before:ease-[var(--k-command-ease)]`,
  commandGroup: "relative px-2 pt-3 pb-1 text-[12px] font-normal leading-5 text-[color:var(--k-command-muted)]",
  commandItem: "relative z-10 flex min-h-9 w-full items-start gap-2.5 rounded-[6px] border-0 bg-transparent! px-2 py-2 text-left text-[13px] font-normal leading-5 outline-none disabled:cursor-not-allowed disabled:opacity-40 [&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:text-[var(--k-command-muted)]",
  commandIcon: "mt-0.5 inline-flex size-4 shrink-0 items-center justify-center text-[color:var(--k-command-muted)] [&>svg]:size-4",
  commandItemText: "min-w-0 flex-1",
  commandTitle: "block truncate font-normal",
  commandDescription: `mt-0.5 block text-[${command.contextFontSize}px] leading-[${command.contextLineHeight}px] text-[color:var(--k-command-muted)] [display:-webkit-box] [-webkit-line-clamp:2] [-webkit-box-orient:vertical] overflow-hidden`,
  commandFooter: `flex min-h-10 flex-wrap items-center gap-x-4 gap-y-1 border-t border-[var(--k-command-edge)] px-[${command.contentInset}px] py-2 text-[12px] text-[color:var(--k-command-muted)] [&>span]:inline-flex [&>span]:items-center [&>span]:gap-1`,
  commandKey: "inline-flex min-w-5 items-center justify-center rounded border border-[var(--k-command-edge)] px-1 text-[11px] font-normal leading-4",
  popover: `${font} ${menuVars} w-64 max-w-[calc(100vw-24px)] rounded-[10px] border-0 bg-[var(--k-menu)] p-1 text-[color:var(--k-ink)] shadow-[var(--k-shadow-menu)] ring-0 outline-none`,
  hoverCard: `${font} ${menuVars} z-50 w-max max-w-[min(${hoverCard.maxWidth}px,calc(100vw-32px))] overflow-y-auto overscroll-contain rounded-[${hoverCard.radius}px] border-0 bg-[var(--k-menu)] p-[${hoverCard.padding}px] text-[color:var(--k-ink)] font-normal shadow-[var(--k-shadow-menu)] outline-none [overflow-wrap:anywhere]`,
  hoverCardMotion: `${hoverCardMotion} transition-[opacity,scale,translate] data-starting-style:data-[side=bottom]:-translate-y-1 data-starting-style:data-[side=top]:translate-y-1 data-starting-style:data-[side=left]:translate-x-1 data-starting-style:data-[side=right]:-translate-x-1 data-starting-style:scale-${hoverCard.scale * 100} data-starting-style:opacity-0 data-ending-style:scale-${hoverCard.scale * 100} data-ending-style:opacity-0`,
  popoverMotion: `${popoverMotion} transition-[opacity,scale] data-starting-style:scale-${popover.scale * 100} data-starting-style:opacity-0 data-ending-style:scale-${popover.scale * 100} data-ending-style:opacity-0`,
  popoverList: `${font} ${menuVars} before:rounded-[6px] before:bg-[var(--k-glow)] before:duration-[180ms] before:ease-[var(--k-ease)]`,
  dropdownPanel: `${font} ${menuVars} ${dropdownVars} relative isolate z-50 min-w-[${dropdown.minWidth}px] max-w-[calc(100vw-32px)] max-h-[var(--available-height,calc(100dvh-32px))] overflow-y-auto rounded-[${dropdown.radius}px] border-0 bg-[var(--k-menu)] p-[${dropdown.padding}px] text-[color:var(--k-ink)] shadow-[var(--k-shadow-menu)] outline-none before:rounded-[${dropdown.itemRadius}px] before:bg-[var(--k-glow)] before:duration-[${dropdown.highlightDuration}ms] before:ease-[var(--k-ease)] [&:has([data-danger]:is([data-highlighted],[data-focused],:focus))]:before:bg-[var(--k-dropdown-danger-highlight)]`,
  dropdownPositioner: "z-50 outline-none",
  dropdownItem: `relative z-10 flex min-h-[${dropdown.itemHeight}px] w-full cursor-default select-none items-center gap-2 rounded-[${dropdown.itemRadius}px] border-0 bg-transparent px-2 py-[${dropdown.itemPaddingY}px] text-left text-[13px] font-normal leading-5 outline-none data-disabled:pointer-events-none data-disabled:opacity-40 data-[danger=true]:text-[color:var(--k-dropdown-danger)] focus-visible:shadow-[inset_0_0_0_1px_var(--k-dropdown-focus)] [@media(pointer:coarse)]:min-h-[${dropdown.touchItemHeight}px]`,
  dropdownTrigger: "inline-flex h-8 shrink-0 items-center justify-center gap-2 px-2.5 [&_svg]:size-4 focus-visible:shadow-[0_0_0_2px_var(--k-wash)]",
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
await writeFile("components/ui/kalos-styles.ts", `// Generated from design/component-tokens.json by scripts/build-component-styles.mjs.\nimport "@fontsource/roboto/latin-400.css";\nimport "@fontsource/roboto/latin-500.css";\nexport const controlStyles = ${JSON.stringify(styles, null, 2)} as const;\nexport const hoverCardDefaults = ${JSON.stringify(hoverCard)} as const;\nexport const fieldMessageMotion = ${JSON.stringify(fieldMessageMotion)} as const;\nexport const numberInputSettings = ${JSON.stringify(numberInput)} as const;\nexport const avatarCss = ${JSON.stringify(avatarCss)};\nexport const segmentedControlCss = ${JSON.stringify(segmentedControlCss)};\n`);
await writeFile("components/hover-card-demo-styles.ts", `// Generated from design/component-tokens.json and design/hover-card-demo.css.\nexport const hoverCardDemoCss = ${JSON.stringify(hoverCardDemoCss)};\n`);
const loadingLicense = await readFile("AFFECTUI-LICENSE.md", "utf8");
await writeFile("components/ui/kalos-loading-styles.ts", `// Generated from design/component-tokens.json, design/skeleton.css and design/spinner.css.\n/*\n${loadingLicense}\n*/\nexport const skeletonDefaults = ${JSON.stringify(skeleton)} as const;\nexport const spinnerDefaults = ${JSON.stringify(spinner)} as const;\nexport const skeletonCss = ${JSON.stringify(skeletonCss)};\nexport const spinnerCss = ${JSON.stringify(spinnerCss)};\n`);
await writeFile("components/loading-demo-styles.ts", `// Generated from design/component-tokens.json.\nexport const loadingDemoSettings = ${JSON.stringify(loadingDemo)} as const;\n`);
console.log("Generated shared component styles from measured tokens.");
const picker = inventory.defaults.picker;
const pickerCss = [
  `.kalos-picker,.kalos-picker-popup{font-family:${inventory.font.family};font-size:${inventory.font.controlSize}px;line-height:${inventory.font.controlLineHeight}px;${Object.entries(inventory.components.picker.light).map(([key, value]) => `--picker-${key}:${value}`).join(";")};--picker-cell:${picker.cell}px;--picker-radius:${picker.radius}px;--picker-duration:${picker.duration}ms;--picker-range-width:${picker.rangeWidth}px;--picker-layer:${picker.layer}}`,
  `:where(.dark,[data-theme=dark]) :is(.kalos-picker,.kalos-picker-popup){${Object.entries(inventory.components.picker.dark).map(([key, value]) => `--picker-${key}:${value}`).join(";")}}`,
  await readFile("design/picker.css", "utf8"),
].join("\n");
await writeFile("components/ui/kalos-picker-styles.ts", `// Generated from design/component-tokens.json and design/picker.css.\n/*\n${loadingLicense}\n*/\nexport const pickerCss = ${JSON.stringify(pickerCss)};\n`);
