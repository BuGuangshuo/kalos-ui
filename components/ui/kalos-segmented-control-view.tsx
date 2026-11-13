"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type HTMLAttributes,
  type ReactNode,
  type RefObject,
} from "react";
import {
  controlStyles,
  segmentedControlCss,
} from "@/components/ui/kalos-styles";
import { cn } from "@/lib/utils";

export type KalosSegmentOption<T extends string = string> = {
  value: T;
  label?: ReactNode;
  icon?: ReactNode;
  count?: number | string;
  badge?: ReactNode;
  disabled?: boolean;
  ariaLabel?: string;
  /** kind="tabs" 时关联的外部面板 ID。 */
  controls?: string;
};

export type KalosSegmentedControlProps<T extends string = string> = {
  options: KalosSegmentOption<T>[];
  value?: T;
  defaultValue?: T;
  onChange?: (value: T) => void;
  size?: "sm" | "md" | "lg";
  variant?: "buttons" | "tray" | "underline";
  fullWidth?: boolean;
  kind?: "radio" | "tabs";
  disabled?: boolean;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  className?: string;
};

export type SegmentControlBindings = {
  options: KalosSegmentOption[];
  value: string;
  onChange: (value: string) => void;
  disabled: boolean;
  groupProps: Pick<
    HTMLAttributes<HTMLDivElement>,
    | "className"
    | "aria-label"
    | "aria-labelledby"
    | "onPointerDownCapture"
    | "onPointerMoveCapture"
    | "onPointerUpCapture"
    | "onPointerCancelCapture"
    | "onLostPointerCaptureCapture"
    | "onKeyDownCapture"
  > & { ref: RefObject<HTMLDivElement | null> };
  optionProps: (option: KalosSegmentOption) => {
    className: string;
    "data-segment": string;
    "data-active": boolean | undefined;
    "aria-label": string | undefined;
    "aria-controls": string | undefined;
  };
  content: (option: KalosSegmentOption) => ReactNode;
};

/** Visuals and pointer motion for Base UI radio and tab primitives. */
export function SegmentedControlView({
  renderControl,
  ...props
}: KalosSegmentedControlProps & {
  renderControl: (bindings: SegmentControlBindings) => ReactNode;
}) {
  const {
    options: rawOptions,
    value: controlled,
    defaultValue,
    onChange,
    disabled = false,
    kind = "radio",
    size = "md",
    variant = "buttons",
    fullWidth = false,
    className,
  } = props;
  const options = rawOptions.filter(
    (option, index, all) =>
      all.findIndex((other) => other.value === option.value) === index,
  );
  const [inner, setInner] = useState(
    () => defaultValue ?? options.find((option) => !option.disabled)?.value,
  );
  const value =
    controlled ??
    (options.some((option) => option.value === inner && !option.disabled)
      ? inner
      : options.find((option) => !option.disabled)?.value) ??
    "";
  const root = useRef<HTMLDivElement>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const pill = useRef<HTMLSpanElement>(null);
  const press = useRef<{
    id: number;
    x: number;
    y: number;
    touch: boolean;
    moved: boolean;
    drag: boolean;
  } | null>(null);
  const suppressClick = useRef(false);
  const select = (next: string) => {
    if (
      disabled ||
      next === value ||
      !options.some((option) => option.value === next && !option.disabled)
    )
      return;
    if (controlled === undefined) setInner(next);
    onChange?.(next);
  };

  useLayoutEffect(() => {
    const group = track.current,
      scroll = scroller.current,
      indicator = pill.current;
    if (!group || !scroll || !indicator) return;
    let frame = 0;
    const measure = () => {
      const items = Array.from(
        group.querySelectorAll<HTMLElement>("[data-segment]"),
      );
      const active = items.find((item) => item.dataset.segment === value);
      // Native tab implementations generate panel IDs. Honor the public controls API for external panels.
      if (kind === "tabs")
        items.forEach((item) => {
          const controls = options.find(
            (option) => option.value === item.dataset.segment,
          )?.controls;
          if (controls) item.setAttribute("aria-controls", controls);
          else item.removeAttribute("aria-controls");
        });
      if (!active) {
        indicator.style.opacity = "0";
        return;
      }
      const groupRect = group.getBoundingClientRect();
      const target =
        variant === "underline"
          ? (active.querySelector<HTMLElement>(".kalos-segment__content") ??
            active)
          : active;
      const rect = target.getBoundingClientRect();
      const x = rect.left - groupRect.left;
      const previous = parseFloat(indicator.style.left) || 0;
      indicator.dataset.direction = x > previous ? "right" : "left";
      indicator.style.left = `${x}px`;
      indicator.style.right = `${groupRect.width - x - rect.width}px`;
      indicator.style.opacity = "1";
      if (!indicator.dataset.ready) {
        indicator.style.transition = "none";
        void indicator.offsetWidth;
        indicator.style.transition = "";
        indicator.dataset.ready = "true";
      }
      const overflow = scroll.scrollWidth - scroll.clientWidth;
      root.current?.toggleAttribute("data-overflow", overflow > 1);
      scroll.style.setProperty(
        "--segment-fade-left",
        scroll.scrollLeft > 1 ? "20px" : "0px",
      );
      scroll.style.setProperty(
        "--segment-fade-right",
        scroll.scrollLeft < overflow - 1 ? "20px" : "0px",
      );
    };
    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(measure);
    };
    measure();
    const observer = new ResizeObserver(schedule);
    observer.observe(group);
    observer.observe(scroll);
    group
      .querySelectorAll("[data-segment], .kalos-segment__content")
      .forEach((item) => observer.observe(item));
    scroll.addEventListener("scroll", schedule, { passive: true });
    const active = group.querySelector<HTMLElement>("[data-active=true]");
    if (active && scroll.scrollWidth > scroll.clientWidth + 1) {
      const a = active.getBoundingClientRect(),
        s = scroll.getBoundingClientRect();
      if (a.left < s.left || a.right > s.right)
        scroll.scrollTo({
          left:
            scroll.scrollLeft +
            a.left -
            s.left -
            (scroll.clientWidth - a.width) / 2,
          behavior: "smooth",
        });
    }
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      scroll.removeEventListener("scroll", schedule);
    };
  }, [kind, options, value, size, variant, fullWidth]);

  useEffect(() => {
    const node = track.current;
    if (!node) return;
    // Capture only real drags; native click behavior remains with Base UI.
    const cancelClick = (event: MouseEvent) => {
      if (suppressClick.current) {
        event.preventDefault();
        event.stopImmediatePropagation();
        suppressClick.current = false;
      }
    };
    node.addEventListener("click", cancelClick, true);
    return () => node.removeEventListener("click", cancelClick, true);
  }, [kind]);

  const atPointer = (clientX: number) => {
    const items = Array.from(
      track.current?.querySelectorAll<HTMLElement>("[data-segment]") ?? [],
    );
    return items.reduce<HTMLElement | undefined>((best, item) => {
      const distance = (el: HTMLElement) => {
        const rect = el.getBoundingClientRect();
        return Math.max(rect.left - clientX, clientX - rect.right, 0);
      };
      return !best || distance(item) < distance(best) ? item : best;
    }, undefined);
  };
  const finishPress = () => {
    press.current = null;
    root.current?.removeAttribute("data-pressed");
  };
  const groupProps: SegmentControlBindings["groupProps"] = {
    ref: track,
    className: "kalos-segment__track",
    "aria-label": props["aria-label"],
    "aria-labelledby": props["aria-labelledby"],
    onPointerDownCapture(event) {
      suppressClick.current = false;
      const item = (event.target as Element).closest<HTMLElement>(
        "[data-segment]",
      );
      if (
        event.button !== 0 ||
        disabled ||
        !item ||
        options.find((option) => option.value === item.dataset.segment)
          ?.disabled
      )
        return;
      const touch = event.pointerType === "touch";
      press.current = {
        id: event.pointerId,
        x: event.clientX,
        y: event.clientY,
        touch,
        moved: false,
        drag:
          !touch ||
          (item.dataset.segment === value &&
            !root.current?.hasAttribute("data-overflow")),
      };
      root.current?.setAttribute("data-pressed", "");
    },
    onPointerMoveCapture(event) {
      const held = press.current;
      if (!held || held.id !== event.pointerId) return;
      if (
        Math.hypot(event.clientX - held.x, event.clientY - held.y) <
        (held.touch ? 8 : 3)
      )
        return;
      held.moved = true;
      suppressClick.current = true;
      if (!held.drag) return;
      event.currentTarget.setPointerCapture(event.pointerId);
      const item = atPointer(event.clientX);
      if (item?.dataset.segment) select(item.dataset.segment);
    },
    onPointerUpCapture(event) {
      if (press.current?.moved && press.current.drag) {
        event.preventDefault();
        event.stopPropagation();
        const item = atPointer(event.clientX);
        if (item?.dataset.segment) {
          select(item.dataset.segment);
          (
            item.querySelector<HTMLInputElement>('input[type="radio"]') ?? item
          ).focus({ preventScroll: true });
        }
      }
      finishPress();
    },
    onPointerCancelCapture: finishPress,
    onLostPointerCaptureCapture: finishPress,
    onKeyDownCapture(event) {
      const enabled = options.filter((option) => !option.disabled);
      if (disabled || !enabled.length) return;
      if (kind === "radio" && event.key === "Enter") {
        const item = (event.target as Element).closest<HTMLElement>(
          "[data-segment]",
        );
        if (item?.dataset.segment) {
          event.preventDefault();
          event.stopPropagation();
          select(item.dataset.segment);
        }
        return;
      }
      const previous =
        event.key === "ArrowLeft" ||
        (kind === "radio" && event.key === "ArrowUp");
      const next =
        event.key === "ArrowRight" ||
        (kind === "radio" && event.key === "ArrowDown");
      if (!previous && !next && event.key !== "Home" && event.key !== "End")
        return;
      event.preventDefault();
      event.stopPropagation();
      const index = enabled.findIndex((option) => option.value === value);
      const option =
        enabled[
          event.key === "Home"
            ? 0
            : event.key === "End"
              ? enabled.length - 1
              : (index + (previous ? -1 : 1) + enabled.length) % enabled.length
        ];
      select(option.value);
      const item = Array.from(
        track.current?.querySelectorAll<HTMLElement>("[data-segment]") ?? [],
      ).find((item) => item.dataset.segment === option.value);
      (
        item?.querySelector<HTMLInputElement>('input[type="radio"]') ?? item
      )?.focus({ preventScroll: true });
    },
  };
  const content = (option: KalosSegmentOption) => (
    <span className="kalos-segment__content">
      {option.icon && (
        <span aria-hidden="true" className="kalos-segment__icon">
          {option.icon}
        </span>
      )}
      {(option.label != null || !option.icon) && (
        <span>{option.label ?? option.value}</span>
      )}
      {option.count != null &&
        (typeof option.count !== "number" || Number.isFinite(option.count)) && (
          <span key={option.count} className="kalos-segment__count">
            {typeof option.count === "number"
              ? option.count.toLocaleString("zh-CN")
              : option.count}
          </span>
        )}
      {option.badge != null && (
        <span className="kalos-segment__badge">{option.badge}</span>
      )}
    </span>
  );
  return (
    <div
      ref={root}
      className={cn(controlStyles.segmentedControl, "kalos-segment", className)}
      data-size={size}
      data-variant={variant}
      data-full={fullWidth || undefined}
      data-disabled={disabled || undefined}
    >
      <style href="kalos-segmented-control" precedence="default">
        {segmentedControlCss}
      </style>
      <div ref={scroller} className="kalos-segment__scroller">
        <div className="kalos-segment__positioner">
          <span
            ref={pill}
            className="kalos-segment__indicator"
            aria-hidden="true"
          />
          {renderControl({
            options,
            value,
            onChange: select,
            disabled,
            groupProps,
            optionProps: (option) => ({
              className: "kalos-segment__option",
              "data-segment": option.value,
              "data-active": option.value === value || undefined,
              "aria-label": option.ariaLabel,
              "aria-controls": kind === "tabs" ? option.controls : undefined,
            }),
            content,
          })}
        </div>
      </div>
    </div>
  );
}
