"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useFramework } from "@/components/framework";

import {
  usePrimitive,
  primitiveNames,
  type Primitive,
} from "@/lib/use-primitive";
export { usePrimitive } from "@/lib/use-primitive";
export function PrimitiveSwitcher() {
  const { framework } = useFramework();
  const { primitive, setPrimitive } = usePrimitive();
  if (framework === "vue")
    return <p className="primitive-caption">基于 shadcn-vue · Reka UI</p>;
  return (
    <Tabs
      value={primitive}
      onValueChange={setPrimitive}
      className="primitive-switcher"
    >
      <TabsList aria-label="组件基础库">
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
  vue,
}: {
  radix: string;
  base: string;
  aria: string;
  vue?: string;
}) {
  const { framework } = useFramework();
  const { primitive } = usePrimitive();
  return framework === "vue" && vue !== undefined
    ? vue
    : { radix, "base-ui": base, "react-aria": aria }[primitive];
}
export function PrimitiveName() {
  const { framework } = useFramework();
  const { primitive } = usePrimitive();
  return framework === "vue" ? "Reka UI" : primitiveNames[primitive];
}
