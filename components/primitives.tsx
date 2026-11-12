"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  usePrimitive,
  primitiveNames,
  type Primitive,
} from "@/lib/use-primitive";
export { usePrimitive } from "@/lib/use-primitive";
export function PrimitiveSwitcher() {
  const { primitive, setPrimitive } = usePrimitive();
  return (
    <Tabs
      value={primitive}
      onValueChange={setPrimitive}
      className="primitive-switcher"
    >
      <TabsList variant="default" aria-label="组件基础库">
        {(Object.keys(primitiveNames) as Primitive[]).map((value) => (
          <TabsTrigger value={value} key={value}>
            {primitiveNames[value]}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
export function PrimitiveText({
  radix,
  base,
  aria,
}: {
  radix: string;
  base: string;
  aria: string;
}) {
  const { primitive } = usePrimitive();
  return { radix, "base-ui": base, "react-aria": aria }[primitive];
}
export function PrimitiveName() {
  const { primitive } = usePrimitive();
  return primitiveNames[primitive];
}
