"use client";

import { useId, useRef, useState } from "react";
import { Select } from "@base-ui/react/select";

type BreakdownPickerProps = {
  label: string;
  value: string;
  options: readonly { key: string; label: string }[];
  onChange: (value: string) => void;
};

export function BreakdownPicker({ label, value, options, onChange }: BreakdownPickerProps) {
  const labelId = useId();
  const container = useRef<HTMLDivElement>(null);
  const returnFocus = useRef(true);
  const [navigating, setNavigating] = useState(false);
  const selected = options.find(option => option.key === value)?.label;

  return <div className="kbc-picker" ref={container}>
    <span className="kbc-picker-label" id={labelId}>{label}</span>
    <Select.Root<string>
      value={value}
      modal={false}
      disabled={!options.length}
      onValueChange={next => { if (next !== null) onChange(next); }}
      onOpenChange={(open, details) => {
        setNavigating(false);
        if (open) returnFocus.current = true;
        else if (details.reason === "outside-press" || details.reason === "focus-out") returnFocus.current = false;
      }}
    >
      <Select.Trigger className="kbc-trigger" aria-labelledby={labelId} title={selected}>
        <span dir="auto">{selected}</span>
        <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round">
          <path d="m4.5 6.25 3.5 3.5 3.5-3.5" />
        </svg>
      </Select.Trigger>
      <Select.Portal container={container} style={{ display: "contents" }}>
        <Select.Positioner className="kbc-positioner" align="start" sideOffset={4} alignItemWithTrigger={false} collisionAvoidance={{ side: "none", align: "shift" }}>
          <Select.Popup
            className="kbc-menu"
            data-navigating={navigating || undefined}
            finalFocus={() => returnFocus.current}
            onPointerMove={() => setNavigating(true)}
            onPointerLeave={() => setNavigating(false)}
            onKeyDownCapture={event => {
              if (["ArrowUp", "ArrowDown", "Home", "End"].includes(event.key) || event.key.length === 1) setNavigating(true);
            }}
          >
            <Select.List aria-labelledby={labelId}>
              {options.map(option => <Select.Item
                className="kbc-option"
                key={option.key}
                value={option.key}
                label={option.label}
              >
                <Select.ItemText dir="auto" title={option.label}>{option.label}</Select.ItemText>
                {option.key === value && <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m3.5 8.5 3 3 6-7" />
                </svg>}
              </Select.Item>)}
            </Select.List>
          </Select.Popup>
        </Select.Positioner>
      </Select.Portal>
    </Select.Root>
  </div>;
}
