import { readFile, writeFile } from "node:fs/promises";
const inventory = JSON.parse(await readFile("design/component-tokens.json", "utf8"));
const css = (value) => value.replace(/\s+/g, "_");
const vars = (component, mapping) => ["light", "dark"].flatMap((mode) => Object.entries(mapping).map(([name, source]) => `${mode === "dark" ? "dark:" : ""}[--k-${name}:${css(inventory.components[component][mode][source])}]`)).join(" ");
const typography = inventory.font;
const family = typography.family.replaceAll('"', '').replace(/\s+/g, "_");
const font = `[font-family:${family}] text-[${typography.controlSize}px] leading-[${typography.controlLineHeight}px]`;
const focus = "outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0";
const state = "[&:is([data-checked],[data-selected],[data-state=checked],[data-state=indeterminate],[data-indeterminate])]";
const fieldVars = vars("text-field", Object.fromEntries(["ink", "surface", "shadow", "shadow-hover", "shadow-focus", "danger-edge", "subtle"].map(k => [k, `--ui-tfc-${k}`])));
const field = `${font} ${focus} ${fieldVars} h-8 rounded-[7px] border-0 bg-[var(--k-surface)]! px-2.5 py-0 text-[color:var(--k-ink)] shadow-[var(--k-shadow)] transition-[box-shadow,background-color] duration-[140ms] ease-[ease] hover:shadow-[var(--k-shadow-hover)] focus-visible:shadow-[var(--k-shadow-focus)] placeholder:text-[color:var(--k-subtle)] aria-invalid:shadow-[0_0_0_1px_var(--k-danger-edge),0_1px_2px_0_rgba(0,0,0,.05)] disabled:opacity-40`;
const buttonVars = vars("button", Object.fromEntries(["ink", "solid", "solid-hover", "on-solid", "surface", "shadow", "shadow-hover", "wash", "ease"].map(k => [k, `--ui-btnc-${k}`])));
const menuVars = vars("select", Object.fromEntries(["ink", "menu", "glow", "shadow-menu", "ease"].map(k => [k, `--ui-selc-${k}`])));
const switchVars = vars("switch", Object.fromEntries(["off", "off-hover", "on", "on-hover", "thumb", "thumb-shadow", "ease"].map(k => [k, `--ui-swc-${k}`])));
const checkVars = vars("checkbox", Object.fromEntries(["surface", "edge", "edge-hover", "fill", "on-fill", "ease"].map(k => [k, `--ui-chkc-${k}`])));
const tabVars = vars("segmented-control", Object.fromEntries(["ink", "text", "track", "card", "card-shadow", "ease"].map(k => [k, `--ui-segc-${k}`])));
const command = inventory.defaults["command-menu"];
const commandVars = vars("command-menu", Object.fromEntries(["ink", "surface", "highlight", "muted", "edge", "shadow", "ease"].map(k => [`command-${k}`, k])));
const styles = {
  font,
  label: `${font} font-normal`,
  field,
  selectTrigger: `${field} w-full pr-2 data-[state=open]:shadow-[var(--k-shadow-focus)] data-popup-open:shadow-[var(--k-shadow-focus)] data-open:shadow-[var(--k-shadow-focus)]`,
  selectMenu: `${font} ${menuVars} rounded-[10px] border-0 ring-0 bg-[var(--k-menu)] p-1 text-[color:var(--k-ink)] shadow-[var(--k-shadow-menu)] before:rounded-[6px] before:bg-[var(--k-glow)] before:duration-[180ms] before:ease-[var(--k-ease)] [&_[role=option]]:min-h-8 [&_[role=option]]:rounded-[6px] [&_[role=option]]:py-1.5 [&_[role=option]]:pl-2 [&_[role=option]]:pr-8 [&_[role=option]]:text-[14px] [&_[role=option]]:leading-5 [&_[role=option]]:text-[color:var(--k-ink)] [&_[data-slot=select-group]]:p-0`,
  commandMenu: `${font} ${commandVars} w-full max-w-[${command.width}px] overflow-hidden rounded-[${command.radius}px] bg-[var(--k-command-surface)] text-[color:var(--k-command-ink)] shadow-[var(--k-command-shadow)]`,
  commandSearch: `flex h-[${command.searchHeight}px] items-center gap-2.5 border-b border-[var(--k-command-edge)] px-[${command.contentInset}px] [&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:text-[var(--k-command-muted)]`,
  commandInput: "h-full min-w-0 flex-1 border-0 bg-transparent p-0 text-[14px] font-normal leading-5 outline-none placeholder:text-[var(--k-command-muted)]",
  commandList: `max-h-[min(400px,55dvh)] overflow-y-auto overscroll-contain px-[${command.listPadding}px] pb-1 before:rounded-[${command.itemRadius}px] before:bg-[var(--k-command-highlight)] before:duration-[${command.highlightDuration}ms] before:ease-[var(--k-command-ease)]`,
  commandGroup: "relative px-2 pt-3 pb-1 text-[12px] font-normal leading-5 text-[color:var(--k-command-muted)]",
  commandItem: "relative z-10 flex min-h-9 w-full items-start gap-2.5 rounded-[6px] border-0 bg-transparent! px-2 py-2 text-left text-[14px] font-normal leading-5 outline-none disabled:cursor-not-allowed disabled:opacity-40 [&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:text-[var(--k-command-muted)]",
  commandIcon: "mt-0.5 inline-flex size-4 shrink-0 items-center justify-center text-[color:var(--k-command-muted)] [&>svg]:size-4",
  commandItemText: "min-w-0 flex-1",
  commandTitle: "block truncate font-normal",
  commandDescription: `mt-0.5 block text-[${command.contextFontSize}px] leading-[${command.contextLineHeight}px] text-[color:var(--k-command-muted)] [display:-webkit-box] [-webkit-line-clamp:2] [-webkit-box-orient:vertical] overflow-hidden`,
  commandFooter: `flex min-h-10 flex-wrap items-center gap-x-4 gap-y-1 border-t border-[var(--k-command-edge)] px-[${command.contentInset}px] py-2 text-[12px] text-[color:var(--k-command-muted)] [&>span]:inline-flex [&>span]:items-center [&>span]:gap-1`,
  commandKey: "inline-flex min-w-5 items-center justify-center rounded border border-[var(--k-command-edge)] px-1 text-[11px] font-normal leading-4",
  popover: `${font} ${menuVars} w-64 max-w-[calc(100vw-24px)] rounded-[10px] border-0 bg-[var(--k-menu)] p-1 text-[color:var(--k-ink)] shadow-[var(--k-shadow-menu)] ring-0 outline-none`,
  popoverList: `${font} ${menuVars} before:rounded-[6px] before:bg-[var(--k-glow)] before:duration-[180ms] before:ease-[var(--k-ease)]`,
  popoverItem: "relative z-10 flex min-h-8 w-full items-center rounded-[6px] border-0 bg-transparent! px-2 py-1.5 text-left text-[14px] font-normal leading-5 outline-none disabled:cursor-not-allowed disabled:opacity-40",
  button: `${font} ${focus} ${buttonVars} rounded-[6px] border-0 font-normal transition-[background-color,color,box-shadow,transform,opacity] duration-[140ms] ease-[var(--k-ease)] active:scale-[.97] disabled:opacity-40`,
  buttonSolid: "bg-[var(--k-solid)] text-[color:var(--k-on-solid)] shadow-none hover:bg-[var(--k-solid-hover)]",
  buttonSurface: "bg-[var(--k-surface)]! text-[color:var(--k-ink)] shadow-[var(--k-shadow)] hover:bg-[var(--k-surface)]! hover:shadow-[var(--k-shadow-hover)]",
  buttonGhost: "bg-transparent text-[color:var(--k-ink)] shadow-none hover:bg-[var(--k-wash)]",
  switch: `${focus} ${switchVars} relative h-5 w-8 shrink-0 rounded-full border-0 p-0.5 bg-[var(--k-off)]! hover:bg-[var(--k-off-hover)]! transition-colors duration-200 ${state}:bg-[var(--k-on)]! ${state}:hover:bg-[var(--k-on-hover)]! [&_[data-slot=switch-thumb]]:size-4 [&_[data-slot=switch-thumb]]:bg-[var(--k-thumb)]! [&_[data-slot=switch-thumb]]:shadow-[var(--k-thumb-shadow)] [&_[data-slot=switch-thumb]]:transition-[transform,width] [&_[data-slot=switch-thumb]]:duration-[260ms] [&_[data-slot=switch-thumb]]:ease-[var(--k-ease)] ${state}:[&_[data-slot=switch-thumb]]:translate-x-3 disabled:opacity-40`,
  checkbox: `${focus} ${checkVars} size-4 shrink-0 rounded-[4.5px] border-0 bg-[var(--k-surface)]! shadow-[inset_0_0_0_1px_var(--k-edge),0_1px_1px_rgba(0,0,0,.04)] hover:shadow-[inset_0_0_0_1px_var(--k-edge-hover),0_1px_1px_rgba(0,0,0,.04)] transition-[background-color,box-shadow,transform] duration-[160ms] ease-[var(--k-ease)] active:scale-[.93] ${state}:bg-[var(--k-fill)]! ${state}:text-[color:var(--k-on-fill)] ${state}:shadow-none ${state}:hover:shadow-none [&_svg]:size-4 [&_svg]:text-current disabled:opacity-40`,
  tabsList: `${font} ${tabVars} h-7! rounded-[8px] border-0 bg-[var(--k-track)] p-0.5 text-[color:var(--k-text)] before:rounded-[6px] before:bg-[var(--k-card)] before:shadow-[var(--k-card-shadow)] before:duration-200 before:ease-[var(--k-ease)]`,
  tabsTrigger: `${focus} relative z-10 h-6 min-h-0 rounded-[6px] border-0 bg-transparent! px-2.5 py-0 text-[14px] font-normal leading-5 text-[color:var(--k-text)] data-active:text-[color:var(--k-ink)] data-selected:text-[color:var(--k-ink)] data-[state=active]:text-[color:var(--k-ink)] data-active:bg-transparent! data-selected:bg-transparent! data-[state=active]:bg-transparent! data-active:shadow-none! data-selected:shadow-none! data-[state=active]:shadow-none!`,
};
await writeFile("components/ui/kalos-styles.ts", `// Generated from design/component-tokens.json by scripts/build-component-styles.mjs.\nimport "@fontsource/roboto/latin-400.css";\nimport "@fontsource/roboto/latin-500.css";\nexport const controlStyles = ${JSON.stringify(styles, null, 2)} as const;\n`);
console.log("Generated shared component styles from measured tokens.");
