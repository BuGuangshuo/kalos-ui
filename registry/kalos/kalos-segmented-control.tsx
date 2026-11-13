"use client";

import { RadioGroup } from "@base-ui/react/radio-group";
import { Radio } from "@base-ui/react/radio";
import { Tabs } from "@base-ui/react/tabs";
import {
  SegmentedControlView,
  type KalosSegmentedControlProps,
} from "@/components/ui/kalos-segmented-control-view";

export type {
  KalosSegmentOption,
  KalosSegmentedControlProps,
} from "@/components/ui/kalos-segmented-control-view";

export function KalosSegmentedControl<T extends string = string>(
  props: KalosSegmentedControlProps<T>,
) {
  return (
    <SegmentedControlView
      {...props}
      onChange={(next) => props.onChange?.(next as T)}
      renderControl={({
        options,
        value,
        onChange,
        disabled,
        groupProps,
        optionProps,
        content,
      }) =>
        props.kind === "tabs" ? (
          <Tabs.Root
            value={value}
            onValueChange={(next) => {
              if (typeof next === "string") onChange(next);
            }}
          >
            <Tabs.List {...groupProps} activateOnFocus>
              {options.map((option) => (
                <Tabs.Tab
                  key={option.value}
                  value={option.value}
                  disabled={disabled || option.disabled}
                  {...optionProps(option)}
                >
                  {content(option)}
                </Tabs.Tab>
              ))}
            </Tabs.List>
          </Tabs.Root>
        ) : (
          <RadioGroup
            {...groupProps}
            value={value}
            onValueChange={onChange}
            disabled={disabled}
          >
            {options.map((option) => (
              <Radio.Root
                key={option.value}
                value={option.value}
                disabled={option.disabled}
                {...optionProps(option)}
              >
                {content(option)}
              </Radio.Root>
            ))}
          </RadioGroup>
        )
      }
    />
  );
}
