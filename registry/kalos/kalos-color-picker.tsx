"use client";

import { useEffect, useEffectEvent, useId, useRef, useState, type ComponentPropsWithRef, type CSSProperties, type KeyboardEvent, type PointerEvent } from "react";
import { DirectionProvider } from "@base-ui/react/direction-provider";
import { Popover } from "@base-ui/react/popover";
import { Radio } from "@base-ui/react/radio";
import { RadioGroup } from "@base-ui/react/radio-group";
import { Slider } from "@base-ui/react/slider";
import { Hash } from "lucide-react";
import { InputGroup, InputGroupInput } from "@/components/ui/input-group";
import { clampColor, colorToHsva, completeColorInput, defaultColor, hsvaToHex, normalizeColor, type Hsva } from "@/components/ui/kalos-color-picker-model";
import { colorPickerCss, colorPickerStyleHref } from "@/components/ui/kalos-color-picker-styles";
import { controlStyles } from "@/components/ui/kalos-styles";
import { cn } from "@/lib/utils";

export type KalosColorPreset = string | { value: string; label: string };

type ColorValueProps = {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  alpha?: boolean;
  presets?: readonly KalosColorPreset[];
};

export type KalosColorPickerProps = Omit<ComponentPropsWithRef<"button">, "value" | "defaultValue" | "onChange" | "children" | "type"> & ColorValueProps & {
  label?: string;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: Popover.Root.Props["onOpenChange"];
  showValue?: boolean;
  size?: "sm" | "md";
  side?: "bottom" | "top";
  align?: "start" | "end";
};

export type KalosColorPickerPanelProps = Omit<ComponentPropsWithRef<"div">, "defaultValue" | "onChange" | "children"> & ColorValueProps;

function useColorValue({ value, defaultValue, onValueChange, alpha = false }: ColorValueProps) {
  const [uncontrolled, setUncontrolled] = useState(defaultValue ?? defaultColor);
  const hex = normalizeColor(value ?? uncontrolled, alpha) ?? defaultColor;
  const [edit, setEdit] = useState(() => ({ hex, color: colorToHsva(hex) }));
  let color = edit.color;
  if (edit.hex !== hex) {
    color = colorToHsva(hex, edit.color);
    setEdit({ hex, color });
  }

  function change(next: Hsva) {
    const nextHex = hsvaToHex(next, alpha);
    setEdit({ hex: nextHex, color: next });
    if (hex === nextHex) return;
    if (value === undefined) setUncontrolled(nextHex);
    onValueChange?.(nextHex);
  }

  function reset() {
    const initial = defaultValue ?? defaultColor;
    const initialHex = normalizeColor(initial, alpha) ?? defaultColor;
    setUncontrolled(initial);
    setEdit({ hex: initialHex, color: colorToHsva(initialHex) });
  }

  return { hex, color, alpha, change, reset };
}

type ColorValue = ReturnType<typeof useColorValue>;

function PickerStyles() {
  return <style href={colorPickerStyleHref} precedence="default">{colorPickerCss}</style>;
}

function colorStyle(color: string): CSSProperties {
  return { "--color-swatch": color } as CSSProperties;
}

function ColorPlane({ color, change }: ColorValue) {
  const saturation = Math.round(color.s * 100);
  const brightness = Math.round(color.v * 100);
  function drag(event: PointerEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    change({ ...color, s: clampColor((event.clientX - rect.left) / rect.width), v: clampColor(1 - (event.clientY - rect.top) / rect.height) });
  }
  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const step = event.shiftKey ? 10 : 1;
    const moves: Record<string, [number, number]> = {
      ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, step], ArrowDown: [0, -step],
      PageUp: [0, 10], PageDown: [0, -10], Home: [-100, 0], End: [100, 0],
    };
    if (!Object.hasOwn(moves, event.key)) return;
    event.preventDefault();
    const [s, v] = moves[event.key];
    change({ ...color, s: s ? clampColor((saturation + s) / 100) : color.s, v: v ? clampColor((brightness + v) / 100) : color.v });
  }
  return (
    <div className="kalos-color-plane" dir="ltr" role="slider" tabIndex={0} aria-label="饱和度与明度"
      aria-valuemin={0} aria-valuemax={100} aria-valuenow={saturation}
      aria-valuetext={`饱和度 ${saturation}%，明度 ${brightness}%`}
      onKeyDown={onKeyDown}
      onPointerDown={(event) => {
        if (!event.isPrimary || event.button !== 0) return;
        event.preventDefault();
        event.currentTarget.setPointerCapture(event.pointerId);
        event.currentTarget.focus({ preventScroll: true });
        drag(event);
      }}
      onPointerMove={(event) => {
        if (event.currentTarget.hasPointerCapture(event.pointerId)) drag(event);
      }}
      onPointerUp={(event) => {
        if (event.currentTarget.hasPointerCapture(event.pointerId)) drag(event);
      }}
    >
      <span aria-hidden="true" className="kalos-color-thumb" style={{ left: `${color.s * 100}%`, top: `${(1 - color.v) * 100}%` }} />
    </div>
  );
}

function ColorSliders({ color, alpha, change }: ColorValue) {
  return <DirectionProvider direction="ltr">
    <Slider.Root dir="ltr" value={Math.round(color.h)} max={360} thumbAlignment="edge"
      onValueChange={(h) => change({ ...color, h })}>
      <Slider.Control className="kalos-color-track" data-channel="hue">
        <Slider.Thumb className="kalos-color-thumb" getAriaLabel={() => "色相"} getAriaValueText={(_, value) => `${value}°`} />
      </Slider.Control>
    </Slider.Root>
    {alpha ? <Slider.Root dir="ltr" value={Math.round(color.a * 100)} max={100} thumbAlignment="edge"
      onValueChange={(value) => change({ ...color, a: value / 100 })}>
      <Slider.Control className="kalos-color-track" data-channel="alpha">
        <Slider.Thumb className="kalos-color-thumb kalos-color-swatch" getAriaLabel={() => "不透明度"} getAriaValueText={(_, value) => `${value}%`} />
      </Slider.Control>
    </Slider.Root> : null}
  </DirectionProvider>;
}

function ColorField({ hex, color, alpha, change }: ColorValue) {
  const [draft, setDraft] = useState<string>();
  const [invalid, setInvalid] = useState(false);

  function commit(input: string) {
    const next = normalizeColor(input, alpha);
    if (!next) return false;
    if (next !== hex) change(colorToHsva(next, color));
    return true;
  }

  return <div className="flex min-w-0 items-center gap-2" dir="ltr">
    <span aria-hidden="true" className="kalos-color-swatch size-8 rounded-[7px] [@media(pointer:coarse)]:size-10" />
    <InputGroup className={cn(controlStyles.inputGroup, "relative [@media(pointer:coarse)]:h-10")} data-invalid={invalid || undefined}>
      <Hash aria-hidden="true" className="pointer-events-none absolute left-2.5 size-3 text-muted-foreground" />
      <InputGroupInput
        className={cn(controlStyles.inputContent, "kalos-color-code pl-7")}
        aria-label="十六进制颜色"
        aria-invalid={invalid || undefined}
        value={draft ?? hex.slice(1).toUpperCase()}
        spellCheck={false}
        autoComplete="off"
        autoCapitalize="off"
        onChange={(event) => {
          const text = event.target.value;
          setDraft(text);
          setInvalid(false);
          if (completeColorInput.test(text.trim())) commit(text);
        }}
        onBlur={() => {
          if (draft !== undefined) commit(draft);
          setDraft(undefined);
          setInvalid(false);
        }}
        onKeyDown={(event) => {
          if (event.key !== "Enter" || event.nativeEvent.isComposing) return;
          event.preventDefault();
          if (draft === undefined) return;
          if (commit(draft)) setDraft(undefined);
          else setInvalid(true);
        }}
      />
      {invalid ? <span className="sr-only" role="alert">请输入有效的 HEX 或 RGB 颜色</span> : null}
    </InputGroup>
    {alpha ? <span className="w-9 shrink-0 text-right text-xs text-muted-foreground tabular-nums">{Math.round(color.a * 100)}%</span> : null}
  </div>;
}

function ColorPresets({ value, presets }: { value: ColorValue; presets?: readonly KalosColorPreset[] }) {
  const options = new Map<string, string>();
  for (const preset of presets ?? []) {
    const hex = normalizeColor(typeof preset === "string" ? preset : preset.value, value.alpha);
    if (hex && !options.has(hex)) options.set(hex, typeof preset === "string" ? hex.toUpperCase() : preset.label);
  }
  if (!options.size) return null;
  return (
    <RadioGroup aria-label="预设颜色" className="kalos-color-presets" value={value.hex}
      onValueChange={(hex) => value.change(colorToHsva(hex, value.color))}>
      {[...options].map(([hex, label]) => (
        <Radio.Root key={hex} value={hex} className="kalos-color-preset kalos-color-swatch"
          aria-label={label} title={label}
          style={{ ...colorStyle(hex), "--color-preset-ring": hex.slice(0, 7) } as CSSProperties} />
      ))}
    </RadioGroup>
  );
}

function ColorPanel({ state, presets, className, style, ...props }: ComponentPropsWithRef<"div"> & {
  state: ColorValue;
  presets?: readonly KalosColorPreset[];
}) {
  return (
    <div {...props} className={cn("kalos-color-panel", className)} style={{
      "--color-swatch": state.hex,
      "--color-solid": state.hex.slice(0, 7),
      "--color-hue": `hsl(${state.color.h} 100% 50%)`,
      ...style,
    } as CSSProperties}>
      <ColorPlane {...state} />
      <ColorSliders {...state} />
      <ColorField {...state} />
      <ColorPresets value={state} presets={presets} />
    </div>
  );
}

export function KalosColorPickerPanel({ value, defaultValue, onValueChange, alpha, presets, className, ...props }: KalosColorPickerPanelProps) {
  const state = useColorValue({ value, defaultValue, onValueChange, alpha });
  return <>
    <PickerStyles />
    <ColorPanel {...props} data-inline="" className={cn(controlStyles.popover, className)}
      state={state} presets={presets} />
  </>;
}

export function KalosColorPicker({
  value, defaultValue, onValueChange, alpha, presets, name, open, defaultOpen = false, onOpenChange,
  label = "颜色", showValue = true, side = "bottom", align = "start", size = "md", className,
  id, disabled, form, "aria-label": ariaLabel, ...props
}: KalosColorPickerProps) {
  const state = useColorValue({ value, defaultValue, onValueChange, alpha });
  const [internalOpen, setOpen] = useState(defaultOpen);
  const expanded = !disabled && (open ?? internalOpen);
  const popup = useRef<HTMLDivElement>(null);
  const canFocusPopup = useRef(!expanded);
  const hiddenInput = useRef<HTMLInputElement>(null);
  const generatedId = useId();
  const triggerId = id ?? generatedId;
  const displayHex = state.hex.slice(0, 7).toUpperCase();
  const opacity = Math.round(state.color.a * 100);
  const buttonLabel = ariaLabel ?? `${label}，${displayHex}${alpha && opacity < 100 ? `，不透明度 ${opacity}%` : ""}`;

  useEffect(() => {
    if (!expanded) canFocusPopup.current = true;
  }, [expanded]);

  const reset = useEffectEvent(state.reset);
  useEffect(() => {
    const owner = hiddenInput.current?.form;
    if (!owner || value !== undefined) return;
    function handleReset(event: Event) {
      queueMicrotask(() => { if (!event.defaultPrevented) reset(); });
    }
    owner.addEventListener("reset", handleReset);
    return () => owner.removeEventListener("reset", handleReset);
  }, [form, name, value]);

  return <>
    <PickerStyles />
    <Popover.Root open={expanded} triggerId={triggerId} onOpenChange={(next, details) => {
      onOpenChange?.(next, details);
      if (open === undefined && !details.isCanceled) setOpen(next);
    }}>
      <Popover.Trigger {...props} id={triggerId} form={form} disabled={disabled} aria-label={buttonLabel}
        className={cn(controlStyles.button, controlStyles.buttonSurface,
          "kalos-color-trigger inline-flex shrink-0 items-center justify-center gap-1.5 px-2 align-middle aria-expanded:shadow-[var(--k-shadow-hover)]",
          size === "sm" ? "h-7 [@media(pointer:coarse)]:h-9" : "h-8 [@media(pointer:coarse)]:h-10",
          !showValue && "aspect-square px-0", className)}>
        <span className={cn("kalos-color-swatch rounded-[5px]", size === "sm" ? "size-4" : "size-[18px]")}
          style={colorStyle(state.hex)} aria-hidden="true" />
        {showValue ? <span className="kalos-color-code inline-flex items-center gap-1.5" dir="ltr" aria-hidden="true">
          {displayHex}{alpha ? <span className="w-[4ch] text-right text-muted-foreground">{opacity}%</span> : null}
        </span> : null}
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Positioner side={side} align={align} sideOffset={6} collisionPadding={12} className="z-50">
          <Popover.Popup ref={popup} className={cn(controlStyles.popover, "kalos-color-popup")}
            aria-label={label} initialFocus={() => canFocusPopup.current ? popup.current ?? false : false}>
            <ColorPanel state={state} presets={presets} />
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
    {name ? <input ref={hiddenInput} type="hidden" name={name} form={form} disabled={disabled} value={state.hex} /> : null}
  </>;
}
